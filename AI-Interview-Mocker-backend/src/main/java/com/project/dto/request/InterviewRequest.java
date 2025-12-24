package com.project.dto.request;

import java.util.List;

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
public class InterviewRequest {

    @NotBlank(message = "Job Title is required")
    private String jobTitle;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Job Description is required")
    private String jobDescription;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotBlank(message = "Difficulty level is required")
    private String difficulty;

    @NotBlank(message = "Experience level is required")
    private String experience;

    @NotNull(message = "Questions list cannot be null")
    private List<String> questions;

}
