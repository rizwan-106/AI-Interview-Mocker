package com.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.request.InterviewRequest;
import com.project.dto.request.UpdateFeedbackRequest;
import com.project.dto.response.InterviewResponse;
import com.project.service.CustomUserDetails;
import com.project.service.InterviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/interview")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

	private final InterviewService interviewService;

	public InterviewController(InterviewService interviewService) {
		this.interviewService = interviewService;
	}

	@PostMapping("/registerInterview")
	public ResponseEntity<Map<String, Object>> registerInterview(
	        @Valid @RequestBody InterviewRequest request,
	        Authentication authentication) {
	    try {
	        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
	        String userId = userDetails.getUserId();

	        InterviewResponse interviewResp = interviewService.createInterview(request, userId);

	        // Build Node.js-style response
	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("success", true);
	        responseBody.put("message", "Interview created successfully");
	        responseBody.put("interview", interviewResp);

	        return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
	    } catch (Exception e) {
	        Map<String, Object> errorBody = new HashMap<>();
	        errorBody.put("success", false);
	        errorBody.put("message", "Server Error: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
	    }
	}

	
	@GetMapping("/getUserInterviews")
	public ResponseEntity<?> getUserInterviews(Authentication authentication) {
		try {
			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
			String userId = userDetails.getUserId();
	        

			List<InterviewResponse> interviews = interviewService.getUserInterviews(userId);
//			System.out.println(interviews);

			// Success response matching your Node.js format
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("interviews", interviews);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("success", false);
			errorResponse.put("message", "Server Error");
			errorResponse.put("error", e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	
	// Add this to your InterviewController class
	@PostMapping("/updateFeedbackAndRating")
	public ResponseEntity<?> updateFeedbackAndRating(@Valid @RequestBody UpdateFeedbackRequest request,
			Authentication authentication) {
		try {
			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
			String userId = userDetails.getUserId();

			InterviewResponse updatedInterview = interviewService.updateFeedbackAndRating(request.getInterviewId(),
					request.getIntResult(), userId);

			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "Feedback and rating updated successfully");
			response.put("interview", updatedInterview);

			return ResponseEntity.ok(response);

		} catch (NoSuchElementException e) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("success", false);
			errorResponse.put("message", "Interview not found");

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);

		} catch (Exception e) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("success", false);
			errorResponse.put("message", "Server Error");
			errorResponse.put("error", e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	

}
