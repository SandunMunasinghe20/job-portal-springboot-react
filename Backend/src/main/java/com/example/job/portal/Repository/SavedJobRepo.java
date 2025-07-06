package com.example.job.portal.Repository;


import com.example.job.portal.Entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedJobRepo extends JpaRepository<SavedJob, Long> {

    List<SavedJob> findBySeekerId(long seekerId);
    boolean existsBySeekerIdAndJobId(Long seekerId, Long jobId);
}
