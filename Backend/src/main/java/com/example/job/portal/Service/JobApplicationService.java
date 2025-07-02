package com.example.job.portal.Service;


import com.example.job.portal.DTO.JobApplicationDTO;
import com.example.job.portal.Entity.Job;
import com.example.job.portal.Entity.JobApplication;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.JobApplicationRepo;
import com.example.job.portal.Repository.JobRepo;
import com.example.job.portal.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private JobApplicationRepo jobApplicationRepo;
    @Autowired
    private UserRepo userRepo;

    public JobApplicationService() {
    }

    public ResponseEntity<String> applyJob(Long jobId, MultipartFile resume, Authentication authentication) {
        System.out.println("job applying started");
        //check job exist
        Optional<Job> job = jobRepo.findById(jobId);

        if (job.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        //get seekerID
        String email = authentication.getName();
        Optional<User> optUser = userRepo.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optUser.get();

        System.out.println("user found");

        //check duplicate applications
        Optional<JobApplication> optApp = jobApplicationRepo.findByJobIdAndSeekerId(jobId, user.getId());

        if (optApp.isPresent()){
            String status = optApp.get().getStatus();

            if(status.equals("APPROVED") || status.equals("PENDING")){
                return ResponseEntity.badRequest().body("You have already Applied to this Job");
            }

        }


        //max file size
        if (resume.getSize() > 10 * 1024 * 1024) {    //10Mb
            return ResponseEntity.badRequest().body("Max allowed size is 10MB");
        }

        //resume to byte arr
        byte[] resumeBytes = null;
        try {
            resumeBytes = resume.getBytes();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to read resume file");
        }
        System.out.println("job found and byte arr created");


        JobApplication jobApplication = new JobApplication();
        jobApplication.setResume(resumeBytes);
        jobApplication.setJobId(jobId);
        jobApplication.setSeekerId(user.getId());
        jobApplication.setAppliedAt(LocalDateTime.now());

        jobApplicationRepo.save(jobApplication);

        return ResponseEntity.ok("Successfully applied to job");
    }

}
