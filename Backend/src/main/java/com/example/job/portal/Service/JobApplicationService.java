package com.example.job.portal.Service;


import com.example.job.portal.DTO.JobApplicationDTO;
import com.example.job.portal.Entity.Job;
import com.example.job.portal.Entity.JobApplication;
import com.example.job.portal.Repository.JobApplicationRepo;
import com.example.job.portal.Repository.JobRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class JobApplicationService {

    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private JobApplicationRepo jobApplicationRepo;

    public JobApplicationService() {
    }

    public ResponseEntity<String> applyJob(JobApplicationDTO jobApplicationDTO) {
        //get job id
        Long jobId = jobApplicationDTO.getJobId();

        //find job
        Job job = jobRepo.findJobById(jobId).get();

        if (job == null) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        JobApplication jobApplication = new JobApplication();
        jobApplication.setResume(jobApplicationDTO.getResume());
        jobApplication.setJobId(jobId);
        jobApplication.setSeekerId(jobApplicationDTO.getSeekerId());
        jobApplication.setAppliedAt(LocalDateTime.now());

        jobApplicationRepo.save(jobApplication);

        return ResponseEntity.ok("Successfully applied to job");
    }

}
