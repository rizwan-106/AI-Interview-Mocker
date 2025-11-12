package com.project.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFeedbackRequest {
    
    @NotBlank(message = "Interview ID is required")
    private String interviewId;
    
    @NotNull(message = "Interview results cannot be null")
    @Valid
    private List<ResultRequest> intResult;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResultRequest {
        private String question;
        private String answer;
        private Integer rating;
        private String feedback;
    }
}