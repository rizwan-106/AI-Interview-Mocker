package com.project.config;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final SecretKey secret_key = Keys
			.hmacShaKeyFor("rizz15thisisalongsecretkeyforjwt123456anditisenoughforthisgotit786".getBytes());

//	public String generateToken(String email) {
//		Map<String, Object> claim = new HashMap<>();
//		return Jwts.builder().setClaims(claim).setSubject(email).setIssuedAt(new Date(System.currentTimeMillis()))
//				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 day
//				.signWith(secret_key, SignatureAlgorithm.HS256).compact();
//	}
	public String generateToken(String userId) {
		Map<String, Object> claim = new HashMap<>();
		return Jwts.builder().setClaims(claim).setSubject(userId).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 day
				.signWith(secret_key, SignatureAlgorithm.HS256).compact();
	}

	public String extractUsername(String token) {
		return getClaims(token).getSubject();
	}

	public boolean validateToken(String token, String username) {
		return username.equals(extractUsername(token)) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return getClaims(token).getExpiration().before(new Date());
	}

	private Claims getClaims(String token) {
		return Jwts.parser().verifyWith(secret_key).build().parseSignedClaims(token).getPayload();
	}
}
