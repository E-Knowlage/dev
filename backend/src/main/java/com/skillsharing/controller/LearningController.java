package com.skillsharing.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillsharing.model.Learning;
import com.skillsharing.service.LearningService;;

@RestController
@CrossOrigin
@RequestMapping("/api/learning")
public class LearningController {

    @Autowired
    private LearningService learningService;

    // Create a new learning post
    @PostMapping("/create")
    public ResponseEntity<Learning> createLearning(@RequestBody Learning learning) {
        try {
            Learning createdLearning = learningService.createLearning(learning);
            return new ResponseEntity<>(createdLearning, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating learning: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all learning posts
    @GetMapping("/view")
    public ResponseEntity<List<Learning>> getAllLearnings() {
        List<Learning> learnings = learningService.getAllLearnings();
        return new ResponseEntity<>(learnings, HttpStatus.OK);
    }

    // Get a learning post by ID
    @GetMapping("/view/{id}")
    public ResponseEntity<Learning> getLearningById(@PathVariable String id) {
        Optional<Learning> learning = learningService.getLearningById(id);
        return learning.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update a learning post
    @PutMapping("/update/{id}")
    public ResponseEntity<Learning> updateLearning(@PathVariable String id, @RequestBody Learning learning) {
        try {
            Learning updatedLearning = learningService.updateLearning(id, learning);
            return new ResponseEntity<>(updatedLearning, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Error updating learning: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a learning post
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLearning(@PathVariable String id) {
        try {
            learningService.deleteLearning(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}