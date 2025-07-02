package com.example.job.portal.Repository;

import com.example.job.portal.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findByJobIdAndSeekerId(long jobId, long seekerId);

    Optional<List<JobApplication>> findAllBySeekerId(long seekerId);
}
