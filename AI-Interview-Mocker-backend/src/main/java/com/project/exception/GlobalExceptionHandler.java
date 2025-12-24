package com.project.exception;

import java.util.Map;
import java.util.NoSuchElementException;

import org.apache.coyote.BadRequestException;
import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<?> handleBadRequest(BadRequestException ex) {
		return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST)
				.body(Map.of("success", false, "message", ex.getMessage()));
	}

	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<?> handleNotFound(NoSuchElementException ex) {
		return ResponseEntity.status(HttpStatus.SC_NOT_FOUND)
				.body(Map.of("success", false, "message", ex.getMessage()));
	}
}
