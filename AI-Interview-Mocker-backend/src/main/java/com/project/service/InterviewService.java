package com.project.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springdoc.core.converters.models.Sort;
import org.springframework.stereotype.Service;

import com.project.dto.request.InterviewRequest;
import com.project.dto.request.UpdateFeedbackRequest;
import com.project.dto.response.InterviewResponse;
import com.project.entity.Interview;
import com.project.entity.User;
import com.project.mapper.InterviewMapper;
import com.project.repository.InterviewRepository;
import com.project.repository.UserRepository;

@Service
public class InterviewService {

	private final InterviewRepository interviewRepo;
	private final UserRepository userRepo;

	public InterviewService(InterviewRepository interviewRepo, UserRepository userRepo) {
		this.interviewRepo = interviewRepo;
		this.userRepo = userRepo;

	}

	public InterviewResponse createInterview(InterviewRequest request, String userId) {

		try {
			ObjectId id = new ObjectId(userId);
			Optional<User> userOptional = userRepo.findById(id);

			if (userOptional.isEmpty())
				throw new NoSuchElementException("User not found with id: " + id);

			User user = userOptional.get();

			// into Entity
			Interview interview = InterviewMapper.toEntity(request, user);

			Interview saveInterview = interviewRepo.save(interview);

			// into Response
			InterviewResponse resp = InterviewMapper.toResponse(saveInterview);
			return resp;
		} catch (Exception e) {
			throw new RuntimeException("Failed to create interview: " + e.getMessage());
		}
	}

	public List<InterviewResponse> getUserInterviews(String userId) {
		try {
			ObjectId userObjectId = new ObjectId(userId);
	        // ADD THIS DEBUG LOG
//	        System.out.println("Searching interviews for userId: " + userObjectId);
	        
			// Find interviews by userId, sorted by createdAt descending
			List<Interview> interviews = interviewRepo.findByUserIdOrderByCreatedAtDesc(userObjectId);

			 // ADD THIS DEBUG LOG  
//	        System.out.println("Found " + interviews.size() + " interviews");
	        
			// Convert entities to response DTOs
			return interviews.stream().map(InterviewMapper::toResponse).collect(Collectors.toList());

		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch interviews: " + e.getMessage());
		}
	}

	// Add this method to your InterviewService class

	public InterviewResponse updateFeedbackAndRating(String interviewId,
			List<UpdateFeedbackRequest.ResultRequest> intResult, String userId) {
		try {
			System.out.println("Updating feedback and rating for interview: {} " + interviewId);

			ObjectId interviewObjectId = new ObjectId(interviewId);
			Optional<Interview> interviewOptional = interviewRepo.findById(interviewObjectId);

			if (interviewOptional.isEmpty()) {
				throw new NoSuchElementException("Interview not found with id: " + interviewId);
			}

			Interview interview = interviewOptional.get();

			// Security check: ensure user can only update their own interviews
			ObjectId userObjectId = new ObjectId(userId);
			if (!interview.getUser().getId().equals(userObjectId)) {
				throw new SecurityException("Unauthorized access to interview");
			}

			// Convert request results to entity results
			List<Interview.Result> results = intResult.stream().map(this::convertToResultEntity)
					.collect(Collectors.toList());

			// Update interview results
			interview.setResults(results);

			// Save updated interview
			Interview savedInterview = interviewRepo.save(interview);
			System.out.println("Feedback and rating updated successfully for interview: {} " + interviewId);

			// Convert to response DTO
			return InterviewMapper.toResponse(savedInterview);

		} catch (NoSuchElementException | SecurityException e) {
			// Re-throw specific exceptions for proper error handling
			throw e;
		} catch (Exception e) {
			System.err.println("Error updating feedback for interview {}: {} " + interviewId + " " + e.getMessage());
			throw new RuntimeException("Failed to update feedback and rating: " + e.getMessage());
		}
	}

	private Interview.Result convertToResultEntity(UpdateFeedbackRequest.ResultRequest request) {
		return Interview.Result.builder().question(request.getQuestion()).answer(request.getAnswer())
				.rating(request.getRating()).feedback(request.getFeedback()).build();
	}
}
