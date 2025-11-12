package com.project.dto.request;

import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {
	private String fullName;
    private String email;
    private String phoneNumber;

    @Schema(type = "string", format = "binary", description = "Resume or profile file")
    private MultipartFile profile; // optional
}
