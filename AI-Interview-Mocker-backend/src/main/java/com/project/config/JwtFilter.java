package com.project.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Autowired
	private TokenBlacklistService tokenBlacklistService;

	// Public endpoints that don't require JWT authentication
	private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList("/api/v1/user/signup", "/api/v1/user/signin",
			"/swagger-ui", "/v3/api-docs", "/swagger-resources", "/webjars");

	/**
	 * Skip JWT filter for public endpoints
	 */
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
		
		String path = request.getRequestURI();
		return PUBLIC_ENDPOINTS.stream().anyMatch(path::startsWith);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization"); // For Local Storage with "Authorization": Bearer
																// <token>
		String token = null;
		String userId = null;

		// 1️ Using Authorization with Bearer<token> -> localStorage
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		}

		// 2️ If not found in header, try to fetch from cookies
		if (token == null && request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if ("token".equals(cookie.getName())) {
					token = cookie.getValue();
					break; // Found token, no need to continue
				}
			}
		}

		// If no token found at all, just continue the filter chain
		if (token == null) {
			filterChain.doFilter(request, response);
			return;
		}

		// Check if token is blacklisted
		if (tokenBlacklistService.isTokenBlacklisted(token)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Token is invalid or logged out\"}");
			return; // Stop filter chain
		}

		// Extract userId from token
		try {
			userId = jwtUtil.extractUsername(token);
		} catch (Exception e) {
			logger.error("Error extracting userId from token: " + e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\":\"Invalid token\"}");
			return;
		}

		// Validate token and set authentication
		if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			try {
				UserDetails userDetails = customUserDetailsService.loadUserByUsername(userId);

				if (jwtUtil.validateToken(token, userId)) {
					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
							null, userDetails.getAuthorities());
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				} else {
					SecurityContextHolder.clearContext();
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.setContentType("application/json");
					response.getWriter().write("{\"error\":\"Token expired\"}");
					return;
				}
			} catch (Exception e) {
				logger.error("Error during authentication: " + e.getMessage());
				// Don't return error here, just continue without authentication
			}
		}

		filterChain.doFilter(request, response); // Pass to next filter
	}
}