package com.project.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService {

	private final Set<String> blacklistedTokens = new HashSet<>();

	// This method will call by UserService to store token in blacklist
	public void blacklistToken(String token) {
		blacklistedTokens.add(token);
	}

	// This method will call at JwtFilter for verification
	public boolean isTokenBlacklisted(String token) {
		return blacklistedTokens.contains(token);
	}
}
