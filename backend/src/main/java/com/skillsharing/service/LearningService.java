package com.skillsharing.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillsharing.model.Learning;

@Service
public class LearningService {

    @Autowired
    private com.skillsharing.repository.LearningRepository learningRepository;

    // Create a new learning post
    public Learning createLearning(Learning learning) {
        return learningRepository.save(learning);
    }

    // Get all learning posts
    public List<Learning> getAllLearnings() {
        return learningRepository.findAll();
    }

    // Get a learning post by ID
    public Optional<Learning> getLearningById(String id) {
        return learningRepository.findById(id);
    }

    // Update a learning post
    public Learning updateLearning(String id, Learning learning) {
        Optional<Learning> optionalLearning = learningRepository.findById(id);
        if (optionalLearning.isPresent()) {
            Learning existingLearning = optionalLearning.get();
            existingLearning.setTitle(learning.getTitle());
            existingLearning.setDescription(learning.getDescription());
            existingLearning.setTopic(learning.getTopic());
            existingLearning.setDeadline(learning.getDeadline());
            existingLearning.setResourceLink(learning.getResourceLink());
            existingLearning.setStatus(learning.getStatus());
            existingLearning.setUserId(learning.getUserId());
            return learningRepository.save(existingLearning);
        } else {
            throw new RuntimeException("Learning not found with id: " + id);
        }
    }

    // Delete a learning post
    public void deleteLearning(String id) {
        Optional<Learning> optionalLearning = learningRepository.findById(id);
        if (optionalLearning.isPresent()) {
            learningRepository.deleteById(id);
        } else {
            throw new RuntimeException("Learning not found with id: " + id);
        }
    }
}