package com.example.job.portal.Entity;

import com.example.job.portal.Entity.Job;
import com.example.job.portal.Entity.Seeker;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "job_applications")
@Getter
@Setter
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @JoinColumn(name = "seeker_id")
    private Long seekerId;


    @JoinColumn(name = "job_id")
    private Long jobId;

    private LocalDateTime appliedAt;

    @Lob
    @Column(name = "resume", columnDefinition = "BLOB")
    private byte[] resume;

    private String status = "PENDING";
}
