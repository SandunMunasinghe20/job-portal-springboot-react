package com.example.job.portal.Controller;

import com.example.job.portal.DTO.JobDTO;
import com.example.job.portal.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @GetMapping("/all")
    public ResponseEntity<List<JobDTO>> getAllJobs(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return jobService.getAllJobs();
    }

    @GetMapping("findById/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable long id,Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return jobService.getJobById(id);
    }
    @PreAuthorize("hasRole('employer')")
    @GetMapping("findByEmp")
    public ResponseEntity<List<JobDTO>> getJobsByEmpId(Authentication authentication) {
        return jobService.getAllJobsByCompany(authentication);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addJob(Authentication authentication, @RequestBody JobDTO jobDTO) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return jobService.addJob(jobDTO,authentication);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateJob(Authentication authentication, @RequestBody JobDTO jobDTO) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return jobService.updateJob(jobDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJob(Authentication authentication, @PathVariable Long id) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("Job id to delete is : "+id);
        return jobService.deleteJob(id);
    }

}
