package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobRepo extends JpaRepository<Job, Long> {
    Optional<Job> findJobById(Long id);
    List<Job> findAllByEmployerId(Long employerId);


}
