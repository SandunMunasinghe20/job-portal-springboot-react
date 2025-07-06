package com.example.job.portal.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs")
@Getter
@Setter
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long savedJobId;

    @ManyToOne
    private Seeker seeker;

    @ManyToOne
    private Job job;

    private LocalDateTime savedTime;
}
