package com.example.job.portal.Entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "job_applications" ,uniqueConstraints = @UniqueConstraint(columnNames = {"seeker_id", "job_id"}))
@Getter
@Setter
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "seeker_id")
    private Long seekerId;


    @Column(name = "job_id")
    private Long jobId;

    private LocalDateTime appliedAt;

    @Lob
    @Column(name = "resume", columnDefinition = "MEDIUMBLOB")
    private byte[] resume;

    private String status = "PENDING";
}
