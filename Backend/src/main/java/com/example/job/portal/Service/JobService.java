package com.example.job.portal.Service;

import com.example.job.portal.DTO.JobDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Job;
import com.example.job.portal.Repository.EmployerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.example.job.portal.Repository.JobRepo;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class JobService {

    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private EmployerRepo employerRepo;

    public ResponseEntity<List<JobDTO>> getAllJobs() {
        // Fetch all jobs from database
        List<Job> jobs = jobRepo.findAll();
        // Prepare list of DTOs to return
        List<JobDTO> jobDTOs = new ArrayList<>();

        for (Job job : jobs) {
            JobDTO dto = new JobDTO();
            dto.setId(job.getId());
            dto.setJobTitle(job.getJobTitle());
            dto.setJobDescription(job.getJobDescription());
            dto.setJobType(job.getJobType());
            dto.setSalary(job.getSalary());
            dto.setSkillsRequired(job.getSkillsRequired());

            // Fetch employer info to get company name
            Long compId = job.getEmployerId();
            Optional<Employer> optEmployer = employerRepo.findById(compId);
            if (optEmployer.isPresent()) {
                Employer employer = optEmployer.get();
                dto.setCompanyName(employer.getCompanyName());
                System.out.println("company is : " + employer.getCompanyName());

                // Calculate how many days ago job was posted
                Date postedDate = job.getPostedDate();
                dto.setDays(calculateDays(postedDate));

            }

            dto.setLocation(job.getLocation());

            jobDTOs.add(dto);

        }
        return ResponseEntity.ok(jobDTOs);
    }

    public ResponseEntity<JobDTO> getJobById(Long id) {
        // Fetch job by ID
        Optional<Job> optJob = jobRepo.findById(id);
        // Check if job exists
        if (optJob.isPresent()) {
            Job job = optJob.get();
            JobDTO dto = new JobDTO();
            dto.setId(job.getId());
            dto.setJobTitle(job.getJobTitle());
            dto.setJobDescription(job.getJobDescription());
            dto.setJobType(job.getJobType());
            dto.setLocation(job.getLocation());
            dto.setSalary(job.getSalary());
            dto.setSkillsRequired(job.getSkillsRequired());

            // Fetch employer info for company name
            Long compId = job.getEmployerId();
            Optional<Employer> optEmployer = employerRepo.findById(compId);
            if (optEmployer.isPresent()) {
                Employer employer = optEmployer.get();
                dto.setCompanyName(employer.getCompanyName());
                System.out.println("company is : " + employer.getCompanyName());


                // Calculate days since posted
                Date postedDate = job.getPostedDate();
                dto.setDays(calculateDays(postedDate));

                return ResponseEntity.ok(dto);
            }
        }
        // Job not found
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<List<JobDTO>> getAllJobsByCompany(Authentication authentication) {
        String email = authentication.getName();

        // Find employer by email
        Optional<Employer> optEmployer = employerRepo.findByEmail(email);
        if (optEmployer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Employer employer = optEmployer.get();

        // Fetch all jobs posted by this employer
        List<Job> jobs = jobRepo.findAllByEmployerId(employer.getId());
        List<JobDTO> jobDTOs = new ArrayList<>();

        for (Job job : jobs) {
            JobDTO dto = new JobDTO();
            dto.setId(job.getId());
            dto.setJobTitle(job.getJobTitle());
            dto.setJobDescription(job.getJobDescription());
            dto.setJobType(job.getJobType());
            dto.setSalary(job.getSalary());
            dto.setCompanyName(employer.getCompanyName());
            dto.setLocation(job.getLocation());

            // Calculate days since job was posted
            Date postedDate = job.getPostedDate();
            dto.setDays(calculateDays(postedDate));

            jobDTOs.add(dto);
        }
        return ResponseEntity.ok(jobDTOs);
    }


    public ResponseEntity<String> addJob(JobDTO jobDTO, Authentication authentication) {
        try {
            // Get employer info from authentication
            String email = authentication.getName();
            Optional<Employer> OptEmployer = employerRepo.findByEmail(email);
            if (OptEmployer.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Employer not found");
            }
            Employer employer = OptEmployer.get();

            // Check if company profile is completed
            if (employer.getCompanyName() == null || employer.getCompanyName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("You must complete your company profile before posting a job.");
            }

            Job job = new Job();
            job.setJobTitle(jobDTO.getJobTitle());
            job.setJobDescription(jobDTO.getJobDescription());
            job.setJobType(jobDTO.getJobType());
            job.setSkillsRequired(jobDTO.getSkillsRequired());
            job.setSalary(jobDTO.getSalary());
            job.setLocation(jobDTO.getLocation());
            job.setEmployerId(employer.getId());
            job.setPostedDate(new Date());

            // Set employer ID
            job.setEmployerId(employer.getId());
            System.out.println("Empl id : " + employer.getId());

            System.out.println("ready to save job");
            jobRepo.save(job);
            return ResponseEntity.ok("Job added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while adding your job");
        }
    }

    public ResponseEntity<String> updateJob(JobDTO jobDTO) {

        // Find existing job
        Long id = jobDTO.getId();
        Optional<Job> jobOpt = jobRepo.findById(id);

        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }
        Job job = jobOpt.get();
        try {


            job.setJobTitle(jobDTO.getJobTitle());
            job.setJobDescription(jobDTO.getJobDescription());
            job.setJobType(jobDTO.getJobType());
            job.setSkillsRequired(jobDTO.getSkillsRequired());
            job.setSalary(jobDTO.getSalary());
            job.setLocation(jobDTO.getLocation());

            jobRepo.save(job);
            return ResponseEntity.ok("Job updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while updating your job");
        }
    }


    public ResponseEntity<String> deleteJob(Long id) {
        try {
            Optional<Job> jobOpt = jobRepo.findById(id);
            if (jobOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Job not found");
            }
            Job job = jobOpt.get();
            jobRepo.delete(job);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while deleting your job");
        }
    }

    // Calculate days since job was posted for display
    public String calculateDays(Date postedDate) {
        if (postedDate != null) {
            LocalDate postDate = postedDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate today = LocalDate.now();
            long daysBetween = ChronoUnit.DAYS.between(postDate, today);

            if (daysBetween == 0) {
                return "Today";
            } else if (daysBetween == 1) {
                return "1 day ago";
            } else {
                return daysBetween + " days ago";
            }
        }
        return "Unknown date";
    }
}
