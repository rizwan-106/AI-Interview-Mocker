package com.project.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springdoc.core.converters.models.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.project.entity.Interview;
import com.project.entity.User;

public interface InterviewRepository extends MongoRepository<Interview, ObjectId> {
	List<Interview> findByUser(User user);

	@Query("{'user.$id': ?0}")
	List<Interview> findByUserId(ObjectId userId);

	@Query(value = "{'user.$id': ?0}", sort = "{'createdAt': -1}")
	List<Interview> findByUserIdOrderByCreatedAtDesc(ObjectId userId);
}
