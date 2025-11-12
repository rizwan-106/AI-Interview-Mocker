package com.project.dto.response;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private String id;               // ObjectId ko String me convert karke bhejna
    private String jobTitle;
    private String company;
    private String jobDescription;
    private String skills;
    private String difficulty;
    private String experience;

    private List<String> questions;
    private List<ResultResponse> results;

    private String userId;           // sirf userId bhejna, pura User object nahi
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResultResponse {
        private String question;
        private String answer;
        private Integer rating;
        private String feedback;
    }
}
