package com.project.entity;

import java.time.Instant;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

	@Field("_id")
	@Id
	private ObjectId id;

	@Field("fullname")
	private String fullName;

	@Field("email")
	@Indexed(unique = true)
	private String email;

	private String password;

	@Field("phoneNumber")
	private String phoneNumber;

	@CreatedDate
	private Instant createdAt;

	@LastModifiedDate
	private Instant updatedAt;

	@Field("profile")
	private Profile profile;

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Profile {
		@Field("profilePhoto")
		private String profilePhoto;// store cloudinary URL
	}

}
