package com.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class CloudinaryConfig {

	@Bean
	public Cloudinary cloudinary() {
		Dotenv dotenv=Dotenv.load();
		String CloudName=dotenv.get("CLOUDINARY_CLOUD_NAME");
		String ApiKey=dotenv.get("CLOUDINARY_API_KEY");
		String SecretKey=dotenv.get("CLOUDINARY_API_SECRET");
		return new Cloudinary(ObjectUtils.asMap("cloud_name", CloudName, "api_key", ApiKey, "api_secret", SecretKey));
	}

}
