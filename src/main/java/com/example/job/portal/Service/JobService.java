package com.example.job.portal.Service;

import com.example.job.portal.DTO.JobDTO;
import com.example.job.portal.Entity.Job;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.job.portal.Repository.JobRepo;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.ResourceBundle;

@Service
public class JobService {

    private JobRepo jobRepo;

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
            dto.setSalary(job.getSalary());
            return ResponseEntity.ok(dto);
        }
        //not found a job
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> addJob(JobDTO jobDTO) {
        try {
            Job job = new Job();
            job.setJobTitle(jobDTO.getJobTitle());
            job.setJobDescription(jobDTO.getJobDescription());
            job.setJobType(jobDTO.getJobType());
            job.setSalary(jobDTO.getSalary());
            job.setLocation(jobDTO.getLocation());
            jobRepo.save(job);
            return ResponseEntity.ok("Job added successfully");
        } catch (Exception e) {
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
