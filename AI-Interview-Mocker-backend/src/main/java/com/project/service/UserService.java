package com.project.service;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.config.JwtUtil;
import com.project.config.TokenBlacklistService;
import com.project.dto.request.LoginRequest;
import com.project.dto.request.SignupRequest;
import com.project.dto.request.UpdateRequest;
import com.project.dto.response.UserResponse;
import com.project.entity.User;
import com.project.entity.User.Profile;
import com.project.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class UserService {

	private final Cloudinary cloudinary;
	private final UserRepository userRepo;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final TokenBlacklistService blacklistService;
	private final CloudinaryService cloudinaryService;

	public UserService(Cloudinary cloudinary, UserRepository userRepo, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, JwtUtil jwtUtil, TokenBlacklistService blacklistService,
			CloudinaryService cloudinaryService) {
		// TODO Auto-generated constructor stub
		this.cloudinary = cloudinary;
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.blacklistService = blacklistService;
		this.cloudinaryService = cloudinaryService;
	}

	public boolean getUserByEmail(String email) {
		User isUserExist = userRepo.findByEmail(email);
		if (isUserExist == null) {
			return false;
		}
		return true;
	}

	public UserResponse saveUser(SignupRequest request) throws IOException {
		// 1. Upload image to Cloudinary
		Map uploadResult = cloudinary.uploader().upload(request.getProfile().getBytes(), ObjectUtils.emptyMap());

		// 2. Get image url from cloudinary
		String imageUrl = uploadResult.get("secure_url").toString();
		User.Profile profile = User.Profile.builder().profilePhoto(imageUrl).build();
		
		User user = User.builder().fullName(request.getFullName()).email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword())).phoneNumber(request.getPhoneNumber())
				.createdAt(Instant.now()).updatedAt(Instant.now()).profile(profile).build();

		User savedUser = userRepo.save(user);
		return UserResponse.fromEntity(savedUser);
	}

	public User getUser(String id) {
		return userRepo.findById(id);
	}

	// security using JWT
	public ResponseEntity<?> verify(LoginRequest request, HttpServletResponse response) {
		try {
			Authentication authenticate = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
			if (authenticate.isAuthenticated()) {
				String tokenValue = jwtUtil.generateToken(request.getEmail());

				Optional<User> optionalUser = userRepo.findUserByEmail(request.getEmail());
				if (optionalUser.isEmpty()) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST)
							.body(Map.of("message", "Incorrect email", "success", false));
				}
				User user = optionalUser.get();

				Cookie cookie = new Cookie("token", tokenValue);
				cookie.setHttpOnly(true);
				cookie.setSecure(false); // 🚨 prod me true karna (https)
				cookie.setPath("/");
				cookie.setMaxAge(24 * 60 * 60);
				response.addCookie(cookie);

				Map<String, Object> userData = new HashMap<>();
				userData.put("_id", user.getId());
				userData.put("fullname", user.getFullName());
				userData.put("email", user.getEmail());
				userData.put("phoneNumber", user.getPhoneNumber());
				userData.put("profile", user.getProfile());

				Map<String, Object> responseBody = new HashMap<>();
				responseBody.put("message", "Welcome back, " + user.getFullName());
				responseBody.put("user", userData);
				responseBody.put("success", true);
				return ResponseEntity.ok(responseBody);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(Map.of("message", "Invalid credentials!", "success", false));
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Internal Server Error", "success", false));
		}

	}

	public ResponseEntity<?> logoutService(String authHeader, HttpServletRequest request,
			HttpServletResponse response) {

		try {
			String token = null;

			// 1. First check Authorization header (localStorage case)
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				token = authHeader.substring(7);
			}

			// 2. If not in header, check cookies (cookie case)
			if (token == null && request.getCookies() != null) {
				for (Cookie cookie : request.getCookies()) {
					if ("token".equals(cookie.getName())) {
						token = cookie.getValue();
					}
				}
			}

			// 3. If token found → blacklist it
			if (token != null && !token.isEmpty()) {
				blacklistService.blacklistToken(token);
			}
			// 4. Clear cookie always (so browser tokens are gone)
			Cookie clearCookie = new Cookie("token", "");
			clearCookie.setHttpOnly(true);
			clearCookie.setSecure(false); // prod → true
			clearCookie.setPath("/");
			clearCookie.setMaxAge(0);
			response.addCookie(clearCookie);
			// 5. Return same JSON as Node.js
			Map<String, Object> responseBody = new HashMap<>();
			responseBody.put("message", "Logged out successfully.");
			responseBody.put("success", true);

			return ResponseEntity.ok(responseBody);
		} catch (Exception e) {
			e.printStackTrace();
			Map<String, Object> errorBody = new HashMap<>();
			errorBody.put("message", "Internal Server Error");
			errorBody.put("success", false);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
		}
	}

	public UserResponse updateProfile(String email, UpdateRequest request) {

		User user = userRepo.findByEmail(email);
		if (user == null) {
			throw new RuntimeException("User not found");
		}

		// update simple fields if present
		if (request.getFullName() != null)
			user.setFullName(request.getFullName());
		if (request.getEmail() != null)
			user.setEmail(request.getEmail());
		if (request.getPhoneNumber() != null)
			user.setPhoneNumber(request.getPhoneNumber());

		// handle resume/profile upload
		MultipartFile profileFile = request.getProfile();
		if (profileFile != null && !profileFile.isEmpty()) {
			String url = cloudinaryService.uploadFile(profileFile);

			Profile profile = user.getProfile();
			if (profile == null) {
				profile = new Profile();
			}

			profile.setProfilePhoto(url); // storing URL same as Node
			user.setProfile(profile);
		}

		User savedUser = userRepo.save(user);
		return UserResponse.fromEntity(savedUser);
	}

}
