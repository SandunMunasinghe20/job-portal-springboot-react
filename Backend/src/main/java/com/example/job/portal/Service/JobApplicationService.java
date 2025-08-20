package com.example.job.portal.Service;

import java.util.Base64;

import com.example.job.portal.DTO.JobApplicationDTO;
import com.example.job.portal.Entity.*;
import com.example.job.portal.Repository.*;
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
    @Autowired
    private SeekerRepo seekerRepo;
    @Autowired
    private EmployerRepo employerRepo;

    public JobApplicationService() {
    }

    // Apply for a job
    public ResponseEntity<String> applyJob(Long jobId, MultipartFile resume, Authentication authentication) {
        System.out.println("job applying started");
        // Check if job exists
        Optional<Job> job = jobRepo.findById(jobId);

        if (job.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        // Get current user by email
        String email = authentication.getName();
        Optional<User> optUser = userRepo.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optUser.get();

        System.out.println("user found");

        // Check if user already applied
        Optional<JobApplication> optApp = jobApplicationRepo.findByJobIdAndSeekerId(jobId, user.getId());

        if (optApp.isPresent()) {
            String status = optApp.get().getStatus();

            if (status.equals("APPROVED") || status.equals("PENDING")) {
                return ResponseEntity.badRequest().body("You have already Applied to this Job");
            }
        }
        // Check file size (max 10MB)
        if (resume.getSize() > 10 * 1024 * 1024) {    //10Mb
            return ResponseEntity.badRequest().body("Max allowed file size is 10MB");
        }
        // Convert resume to byte array
        byte[] resumeBytes = null;
        try {
            resumeBytes = resume.getBytes();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to read resume file");
        }
        System.out.println("job found and byte arr created");

        // Create job application entity
        JobApplication jobApplication = new JobApplication();
        jobApplication.setResume(resumeBytes);
        jobApplication.setJobId(jobId);
        jobApplication.setSeekerId(user.getId());
        jobApplication.setAppliedAt(LocalDateTime.now());

        jobApplicationRepo.save(jobApplication);

        return ResponseEntity.ok("Successfully applied to job");
    }

    // Admin: get all job applications
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
            // Convert resume to Base64 for transfer
            byte[] resumeBytes = jobApplication.getResume();
            if (resumeBytes != null) {
                String base64Resume = Base64.getEncoder().encodeToString(resumeBytes);
                jobApplicationDTO.setResumeBase64(base64Resume);
            } else {
                jobApplicationDTO.setResumeBase64(null);
            }

            // Add job title and employer name
            Optional<Job> optApp = jobRepo.findJobById(jobApplication.getJobId());
            if (optApp.isPresent()) {
                Job job = optApp.get();
                jobApplicationDTO.setJobTitle(job.getJobTitle());

                Optional<Employer> optionalEmployer = employerRepo.findById(job.getEmployerId());
                if (optionalEmployer.isPresent()) {
                    Employer employer = optionalEmployer.get();
                    jobApplicationDTO.setCompanyName(employer.getCompanyName());
                }

            }

            appliedJobs.add(jobApplicationDTO);
        }
        return ResponseEntity.ok(appliedJobs);
    }

    // Seeker: get own applications
    @PreAuthorize("hasRole('seeker')")
    public ResponseEntity<?> getAllJobApplications(Authentication authentication) {
        String email = authentication.getName();
        Optional<Seeker> optionalSeeker = seekerRepo.findByEmail(email);

        if (optionalSeeker.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Seeker seeker = optionalSeeker.get();
        System.out.println("user found");

        Long seekerId = seeker.getId();

        Optional<List<JobApplication>> jobApplications = jobApplicationRepo.findAllBySeekerId(seekerId);
        if (jobApplications.isEmpty() || jobApplications.get().isEmpty()) {
            return ResponseEntity.badRequest().body("No Job Applications found");
        }
        List<JobApplicationDTO> dtos = new ArrayList<>();

        int count = 0;

        for (JobApplication jobApplication : jobApplications.get()) {
            JobApplicationDTO dto = new JobApplicationDTO();

            dto.setId(jobApplication.getId());
            dto.setJobId(jobApplication.getJobId());
            dto.setSeekerId(jobApplication.getSeekerId());
            dto.setStatus(jobApplication.getStatus());
            dto.setResume(jobApplication.getResume());
            byte[] resumeBytes = jobApplication.getResume();
            if (resumeBytes != null) {
                String base64Resume = Base64.getEncoder().encodeToString(resumeBytes);
                dto.setResumeBase64(base64Resume);
            } else {
                dto.setResumeBase64(null);
            }

            // Add job title and employer name
            Optional<Job> job = jobRepo.findById(jobApplication.getJobId());
            if (job.isPresent()) {
                System.out.println("job found");
                Job j = job.get();

                Optional<Employer> optionalEmployer = employerRepo.findById(j.getEmployerId());
                if (optionalEmployer.isPresent()) {
                    Employer employer = optionalEmployer.get();
                    dto.setCompanyName(employer.getCompanyName());
                }

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

    // Employer: view applications for their jobs
    public ResponseEntity<?> empViewApplications(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("Email for emp view applications" + email);
        Optional<Employer> optionalEmployer = employerRepo.findByEmail(email);
        if (optionalEmployer.isEmpty()) {
            return ResponseEntity.badRequest().body("Your employer account not found. Try logging in again.");
        }
        Employer employer = optionalEmployer.get();

        // Get all job IDs of this employer
        List<Job> jobs = jobRepo.findAllByEmployerId(employer.getId());
        List<Long> jobIds = jobs.stream().map(Job::getId).toList();

        if (jobIds.isEmpty()) return ResponseEntity.badRequest().body("No Jobs found");
        List<JobApplication> applications = jobApplicationRepo.findByJobIdIn(jobIds);

        List<JobApplicationDTO> dtos = new ArrayList<>();
        for (JobApplication jobApplication : applications) {
            JobApplicationDTO dto = new JobApplicationDTO();

            dto.setId(jobApplication.getId());
            dto.setJobId(jobApplication.getJobId());
            dto.setSeekerId(jobApplication.getSeekerId());
            dto.setStatus(jobApplication.getStatus());

            // Convert resume to Base64
            byte[] resumeBytes = jobApplication.getResume();
            if (resumeBytes != null) {
                String base64Resume = Base64.getEncoder().encodeToString(resumeBytes);
                dto.setResumeBase64(base64Resume);
            } else {
                dto.setResumeBase64(null);
            }

            // Add job title and company name
            jobs.stream().filter(job -> job.getId().equals(jobApplication.getJobId())).findFirst().ifPresent(job -> {
                Optional<Employer> optEmployer = employerRepo.findById(job.getEmployerId());
                if (optEmployer.isPresent()) {
                    Employer emp = optEmployer.get();
                    dto.setCompanyName(emp.getCompanyName());
                }
                dto.setJobTitle(job.getJobTitle());
            });

            dtos.add(dto);
        }

        return ResponseEntity.ok(dtos);
    }

    // Delete a job application
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

        // Only admin or seeker who applied can delete
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

    // Update a job application
    public ResponseEntity<String> updateJobApplication(Long jobApplicationId, MultipartFile resume, Authentication authentication) {
        System.out.println("job id received at update:  " + jobApplicationId);
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

        // Only seeker who applied can update
        if (!jobApplication.getSeekerId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not allowed to update this Job");
        }

        // Check file size
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

    // Employer updates application status
    public ResponseEntity<String> handleApplicationByEmployer(JobApplicationDTO jobApplicationDTO) {
        Long jobApplicationId = jobApplicationDTO.getId();
        Optional<JobApplication> optApp = jobApplicationRepo.findById(jobApplicationId);
        if (optApp.isEmpty()) {
            return ResponseEntity.badRequest().body("Job Application not found");
        }
        JobApplication jobApplication = optApp.get();

        // Update status
        jobApplication.setStatus(jobApplicationDTO.getStatus());
        jobApplicationRepo.save(jobApplication);
        return ResponseEntity.ok("Successfully " + jobApplicationDTO.getStatus() + " job application");
    }

}
