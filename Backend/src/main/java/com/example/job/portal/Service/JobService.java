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
        //original entity data
        List<Job> jobs = jobRepo.findAll();
        //list of dtos
        List<JobDTO> jobDTOs = new ArrayList<>();

        for (Job job : jobs) {
            JobDTO dto = new JobDTO();
            dto.setId(job.getId());
            dto.setJobTitle(job.getJobTitle());
            dto.setJobDescription(job.getJobDescription());
            dto.setJobType(job.getJobType());
            dto.setSalary(job.getSalary());
            dto.setSkillsRequired(job.getSkillsRequired());

            //comp Name
            Long compId = job.getEmployerId();
            Optional<Employer> optEmployer = employerRepo.findById(compId);
            if (optEmployer.isPresent()) {
                Employer employer = optEmployer.get();
                dto.setCompanyName(employer.getCompanyName());
                System.out.println("company is : "+employer.getCompanyName());


                //calc date
                Date postedDate = job.getPostedDate();
                String daysAgoStr = "Unknown";

                if (postedDate != null) {
                    LocalDate postDate = postedDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDate today = LocalDate.now();
                    long daysBetween = ChronoUnit.DAYS.between(postDate, today);

                    if (daysBetween == 0) {
                        daysAgoStr = "Today";
                    } else if (daysBetween == 1) {
                        daysAgoStr = "1 day ago";
                    } else {
                        daysAgoStr = daysBetween + " days ago";
                    }

                    dto.setDays(daysAgoStr);

                }
            }
            dto.setLocation(job.getLocation());

            jobDTOs.add(dto);
        }
        return ResponseEntity.ok(jobDTOs);
    }

    public ResponseEntity<JobDTO> getJobById(Long id) {
        Optional<Job> optJob = jobRepo.findById(id);
        //job found
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

            //comp Name
            Long compId = job.getEmployerId();
            Optional<Employer> optEmployer = employerRepo.findById(compId);
            if (optEmployer.isPresent()) {
                Employer employer = optEmployer.get();
                dto.setCompanyName(employer.getCompanyName());
                System.out.println("company is : "+employer.getCompanyName());


                //calc date
                Date postedDate = job.getPostedDate();
                String daysAgoStr = "Unknown";

                if (postedDate != null) {
                    LocalDate postDate = postedDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDate today = LocalDate.now();
                    long daysBetween = ChronoUnit.DAYS.between(postDate, today);

                    if (daysBetween == 0) {
                        daysAgoStr = "Today";
                    } else if (daysBetween == 1) {
                        daysAgoStr = "1 day ago";
                    } else {
                        daysAgoStr = daysBetween + " days ago";
                    }

                    dto.setDays(daysAgoStr);


                }
                return ResponseEntity.ok(dto);
            }
        }
        //not found a job
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<List<JobDTO>> getAllJobsByCompany(Authentication authentication) {
        String email = authentication.getName();

        //find employer
        Optional<Employer> optEmployer = employerRepo.findByEmail(email);
        if (optEmployer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Employer employer = optEmployer.get();

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
            jobDTOs.add(dto);
        }
            return ResponseEntity.ok(jobDTOs);
        }


    public ResponseEntity<String> addJob(JobDTO jobDTO, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Employer> OptEmployer = employerRepo.findByEmail(email);
            if (OptEmployer.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Employer not found");
            }
            Employer employer = OptEmployer.get();

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

            //set employer
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

            //find existing job
            Long id = jobDTO.getId();
            Optional<Job> jobOpt = jobRepo.findById(id);

            if (jobOpt.isEmpty()){
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
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while updating your job");
        }
    }


    public ResponseEntity<String> deleteJob(Long id) {
        try {
            Optional<Job> jobOpt = jobRepo.findById(id);
            if (jobOpt.isEmpty()){
                return ResponseEntity.badRequest().body("Job not found");
            }
            Job job = jobOpt.get();
            jobRepo.delete(job);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong while deleting your job");
        }
    }

}
