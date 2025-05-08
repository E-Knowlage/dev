package com.skillsharing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "learning")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Learning {
    @Id
    private String id;

    private String title;
    private String description;
    private String topic;
    private String deadline;
    private String resourceLink;
    private String status; // Status of the post
    private Long userId;

}
