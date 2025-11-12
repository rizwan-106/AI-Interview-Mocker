package com.project.mapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;

import com.project.dto.request.InterviewRequest;
import com.project.dto.response.InterviewResponse;
import com.project.entity.Interview;
import com.project.entity.User;

public class InterviewMapper {

	public static Interview toEntity(InterviewRequest request, User user) {
		if (request == null || user == null)
			return null;
		return Interview.builder().jobTitle(request.getJobTitle()).company(request.getCompany())
				.jobDescription(request.getJobDescription()).skills(request.getSkills())
				.difficulty(request.getDifficulty()).experience(request.getExperience())
				.questions(request.getQuestions()).results(new ArrayList<>()).user(user).build();
	}

	public static InterviewResponse toResponse(Interview interview) {
		if (interview == null)
			return null;
		return InterviewResponse.builder().id(interview.getId() == null ? null : interview.getId().toHexString())
				.jobTitle(interview.getJobTitle()).company(interview.getCompany())
				.jobDescription(interview.getJobDescription()).skills(interview.getSkills())
				.difficulty(interview.getDifficulty()).experience(interview.getExperience())
				.questions(interview.getQuestions())
				.results(interview.getResults() == null ? Collections.emptyList()
						: interview.getResults().stream()
								.map(r -> InterviewResponse.ResultResponse.builder().question(r.getQuestion())
										.answer(r.getAnswer()).rating(r.getRating()).feedback(r.getFeedback()).build())
								.collect(Collectors.toList()))
				.userId(interview.getUser() == null ? null : interview.getUser().getId().toHexString())
				.createdAt(Instant.now()).updatedAt(Instant.now()).build();

	}
}
