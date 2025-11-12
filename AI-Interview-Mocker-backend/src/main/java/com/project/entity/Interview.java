package com.project.entity;
import java.time.Instant;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "interviews")
public class Interview {
	@Id
	@Field("_id")
	private ObjectId id;
	
	@Field("jobTitle")
	private String jobTitle;
	
	@Field("company")
	private String company;
	
	@Field("jobDescription")
	private String jobDescription;
	
	@Field("skills")
	private String skills;
	
	@Field("difficulty")
	private String difficulty;
	
	@Field("experience")
	private String experience;
	
	@Field("questions")
	private List<String> questions; // come from GEMINI API
	
	@Field("results")
	private List<Result> results; // same as results array of objects
	
	@DBRef
	private User user; // same as { type: ObjectId, ref: "User" }
	
	@CreatedDate
	private Instant createdAt; // same as timestamps.createdAt
	
	@LastModifiedDate
	private Instant updatedAt; // same as timestamps.updatedAt
	
	// inner class for results
	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Result {
		@Field("question")
		private String question;
		
		@Field("answer")
		private String answer;
		
		@Field("rating")
		private Integer rating;
		
		@Field("feedback")
		private String feedback;
	}
}
