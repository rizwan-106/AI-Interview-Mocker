package com.project.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.entity.User;

public interface UserRepository extends MongoRepository<User, ObjectId> {

	User findByEmail(String email);
	
	Optional<User> findUserByEmail(String email);

	boolean existsByEmail(String email);

	User findById(String id);

}
