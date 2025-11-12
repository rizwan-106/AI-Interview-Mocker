package com.project.dto.response;

import com.project.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

	private String id;
	private String fullName;
	private String email;
	private String phoneNumber;
	private ProfileResponse profile;

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class ProfileResponse {
		private String profilePhoto; // Cloudinary URL
	}


	public static UserResponse fromEntity(User user) {
		return UserResponse.builder().id(user.getId().toHexString()) // ObjectId → String
				.fullName(user.getFullName()).email(user.getEmail()).phoneNumber(user.getPhoneNumber())
				.profile(ProfileResponse.builder().profilePhoto(user.getProfile().getProfilePhoto()).build()).build();
	}
}
