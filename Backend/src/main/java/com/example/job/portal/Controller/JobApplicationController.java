package com.example.job.portal.Controller;

import com.example.job.portal.DTO.JobApplicationDTO;
import com.example.job.portal.Service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController

@RequestMapping("api/applyJobs")
public class JobApplicationController {
    @Autowired
    private JobApplicationService jobApplicationService;


    @PreAuthorize("hasRole('seeker')")
    @PostMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<String> applyJob(@RequestParam("jobId") Long jobId, @RequestParam("resume")MultipartFile resume, Authentication authentication) {
        
        return jobApplicationService.applyJob(jobId,resume,authentication);
    }
    @PreAuthorize("hasRole('seeker')")
    @GetMapping("/myApplications")
    public ResponseEntity<?> viewMyApplications(Authentication authentication) {
        System.out.println("Seeker view applications");
        return jobApplicationService.getAllJobApplications(authentication);
    }


    @PreAuthorize("hasRole('employer')")
    @GetMapping("/view")
    public ResponseEntity<?> viewAllJobApplications(Authentication authentication) {
        System.out.println("View application controller ");
        return jobApplicationService.empViewApplications(authentication);
    }

    @DeleteMapping("/delete/{jobApplicationId}")
    public ResponseEntity<String> deleteJobApplication(@PathVariable Long jobApplicationId, Authentication authentication) {
        System.out.println("delete application controller ");
        return jobApplicationService.deleteJobApplication(jobApplicationId,authentication);
    }

    @PreAuthorize("hasRole('seeker')")
    @PutMapping("/update/{jobApplicationId}")
    public ResponseEntity<String> updateJobApplication(@PathVariable Long jobApplicationId, @RequestParam("resume")MultipartFile resume, Authentication authentication){

        return jobApplicationService.updateJobApplication(jobApplicationId,resume,authentication);
    }

    @PreAuthorize("hasRole('employer')")
    @PutMapping("/updateBYEmp")
    public ResponseEntity<String> updateApplicationByEmp(@RequestBody JobApplicationDTO jobApplicationDTO){
        return jobApplicationService.handleApplicationByEmployer(jobApplicationDTO);
    }
}
