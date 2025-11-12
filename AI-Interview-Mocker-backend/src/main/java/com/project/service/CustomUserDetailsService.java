package com.project.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.entity.User;
import com.project.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepo;

	public CustomUserDetailsService(UserRepository userRepo) {
		this.userRepo = userRepo;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepo.findByEmail(username);
		if (user == null) {
			throw new UsernameNotFoundException("User Not Found with email: " + username);
		}
		return new CustomUserDetails(user);
	}

	public UserDetails loadUserById(String userId) throws UsernameNotFoundException {
		User user = userRepo.findById(new org.bson.types.ObjectId(userId))
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with ID: " + userId));
		return new CustomUserDetails(user);
	}

}
