package com.example.job.portal.Repository;

import com.example.job.portal.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
}
