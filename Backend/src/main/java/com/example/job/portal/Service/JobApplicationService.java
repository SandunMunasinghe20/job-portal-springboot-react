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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
            return ResponseEntity.badRequest().body("Max allowed file size is 10MB");
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
    //all
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> getallAppliedJobs() {
        List<JobApplicationDTO> appliedJobs = new ArrayList<>();

        List<JobApplication> optionalList = jobApplicationRepo.findAll();

        for (JobApplication jobApplication : optionalList) {
            JobApplicationDTO jobApplicationDTO = new JobApplicationDTO();
            jobApplicationDTO.setJobId(jobApplication.getJobId());
            jobApplicationDTO.setSeekerId(jobApplication.getSeekerId());
            jobApplicationDTO.setAppliedAt(jobApplication.getAppliedAt());
            jobApplicationDTO.setStatus(jobApplication.getStatus());
            jobApplicationDTO.setResume(jobApplication.getResume());

            //job title and company
            Optional<Job> optApp = jobRepo.findJobById(jobApplication.getJobId());
            if (optApp.isPresent()) {
                Job job = optApp.get();
                jobApplicationDTO.setJobTitle(job.getJobTitle());
                jobApplicationDTO.setCompanyName(job.getCompanyName());
            }

            appliedJobs.add(jobApplicationDTO);
        }
        return ResponseEntity.ok(appliedJobs);
    }
//user specific
    public ResponseEntity<?> getAllJobApplications(Authentication authentication) {
        String email = authentication.getName();
        //get user
        Optional<User> optUser = userRepo.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optUser.get();
        System.out.println("user found");

        Long seekerId = user.getId();

        //get only seeker's applications
        Optional<List<JobApplication>> jobApplications = jobApplicationRepo.findAllBySeekerId(seekerId);
        if (jobApplications.isEmpty() || jobApplications.get().isEmpty()) {
           return ResponseEntity.badRequest().body("No Job Applications found");
        }
        List<JobApplicationDTO> dtos = new ArrayList<>();

        int count =0;

        for (JobApplication jobApplication : jobApplications.get()) {
            JobApplicationDTO dto = new JobApplicationDTO();

            dto.setId(jobApplication.getId());
            dto.setJobId(jobApplication.getJobId());
            dto.setSeekerId(jobApplication.getSeekerId());
            dto.setStatus(jobApplication.getStatus());
            dto.setResume(jobApplication.getResume());
            //company name + title
            Optional<Job> job = jobRepo.findById(jobApplication.getJobId());
            if (job.isPresent()) {
                System.out.println("job found");
                Job j = job.get();

                dto.setCompanyName(j.getCompanyName());
                dto.setJobTitle(j.getJobTitle());
                count++;
            }
            dtos.add(dto);
        }
        if (count == 0) {
            return ResponseEntity.badRequest().body("No Job Applications found");
        }
        return ResponseEntity.ok(dtos);
    }


    public ResponseEntity<String> deleteJobApplication(Long jobApplicationId, Authentication authentication) {
        System.out.println("job delete started");
        Optional<JobApplication> optApp = jobApplicationRepo.findById(jobApplicationId);
        if (optApp.isEmpty()) {
            return ResponseEntity.badRequest().body("Job Application not found");
        }

        JobApplication jobApplication = optApp.get();

        String email = authentication.getName();
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optUser.get();
        System.out.println("user found");

        if (!jobApplication.getSeekerId().equals(user.getId()) && !user.getRole().equals("admin")) {
            return ResponseEntity.badRequest().body("You are not allowed to delete this Job");
        }

        try {
            jobApplicationRepo.deleteById(jobApplicationId);
            return ResponseEntity.ok("Successfully deleted job application");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete job application");
        }
    }

    public ResponseEntity<String> updateJobApplication(Long jobApplicationId, MultipartFile resume, Authentication authentication) {
        System.out.println("job id received at update:  "+jobApplicationId);
        Optional<JobApplication> optApp = jobApplicationRepo.findById(jobApplicationId);
        if (optApp.isEmpty()) {
            return ResponseEntity.badRequest().body("Job Application not found");
        }
        JobApplication jobApplication = optApp.get();

        String email = authentication.getName();
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optUser.get();
        System.out.println("user found");

        if (!jobApplication.getSeekerId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not allowed to update this Job");
        }

        //size check
        if (resume.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Max allowed size is 10MB");
        }

        byte[] resumeBytes = null;
        try {
            resumeBytes = resume.getBytes();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to read resume file");
        }

        jobApplication.setResume(resumeBytes);
        jobApplication.setAppliedAt(LocalDateTime.now());
        jobApplicationRepo.save(jobApplication);
        return ResponseEntity.ok("Successfully updated job application");
    }

}
