package com.project.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.request.LoginRequest;
import com.project.dto.request.SignupRequest;
import com.project.dto.request.UpdateRequest;
import com.project.dto.response.UserResponse;
import com.project.entity.User;
import com.project.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

//import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin("*")
//@CrossOrigin(origins = "http://localhost:5173")

public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> registerUser(@Valid @ModelAttribute SignupRequest request) throws IOException {

		boolean existingUser = userService.getUserByEmail(request.getEmail());
		if (existingUser)
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "User already exists with this email"));

		try {
			userService.saveUser(request);
			return ResponseEntity.status(HttpStatus.CREATED)
					.body(Map.of("message", "Account created successfully", "success", true));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("message", "Internal Server Error", "success", false));
		}
	}

	@PostMapping("/signin")
	public ResponseEntity<?> userLogin(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
		return userService.verify(loginRequest, response);

	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestHeader(value = "Authorizatoin", required = false) String authHeader,
			HttpServletRequest request, HttpServletResponse response) {
		return userService.logoutService(authHeader, request, response);
	}

	@PatchMapping("/update")
	public ResponseEntity<UserResponse> update(@ModelAttribute UpdateRequest request, Authentication authentication) {

		String email = authentication.getName();

		UserResponse updateUser = userService.updateProfile(email, request);
		return ResponseEntity.ok(updateUser);

	}

	@GetMapping("/{id}")
	public User getMethodName(@PathVariable String id) {
		User user = userService.getUser(id);
		if (user != null)
			System.out.println(user);
		else
			System.out.println("Didn't get");
		return user;
	}

}