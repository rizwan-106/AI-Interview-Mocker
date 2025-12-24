//package com.project.dto;
//
//import java.util.Objects;
//
//public class LoginRequest {
//
//	private String email;
//	private String password;
//
//	// Default constructor (Lombok's @NoArgsConstructor bhi yahi karta hai)
//	public LoginRequest() {
//	}
//
//	public LoginRequest(String email, String password) {
//		this.email = email;
//		this.password = password;
//	}
//
//	// Getters and Setters
//	public String getEmail() {
//		return email;
//	}
//
//	public void setEmail(String email) {
//		this.email = email;
//	}
//
//	public String getPassword() {
//		return password;
//	}
//
//	public void setPassword(String password) {
//		this.password = password;
//	}
//
//	@Override
//	public int hashCode() {
//		return Objects.hash(email, password);
//	}
//
//	@Override
//	public boolean equals(Object obj) {
//		if (this == obj)
//			return true;
//		if (obj == null)
//			return false;
//		if (getClass() != obj.getClass())
//			return false;
//		LoginRequest other = (LoginRequest) obj;
//		return Objects.equals(email, other.email) && Objects.equals(password, other.password);
//	}
//
//	@Override
//	public String toString() {
//		return "LoginRequest [email=" + email + ", password=" + password + "]";
//	}
//
//}
package com.project.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @JsonProperty("email")  // Frontend se exact same property name
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @JsonProperty("password")  // Frontend se exact same property name
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

}