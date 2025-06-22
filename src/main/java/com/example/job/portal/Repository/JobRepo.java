package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepo extends JpaRepository<Job, Long> {
}
