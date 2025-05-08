package com.skillsharing.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillsharing.model.Learning;

@Repository
public interface LearningRepository extends MongoRepository<Learning, String> {
}