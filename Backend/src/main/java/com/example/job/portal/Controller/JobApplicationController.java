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
@PreAuthorize("hasRole('seeker')")
@RequestMapping("api/applyJobs")
public class JobApplicationController {
    @Autowired
    private JobApplicationService jobApplicationService;



    @PostMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<String> applyJob(@RequestParam("jobId") Long jobId, @RequestParam("resume")MultipartFile resume, Authentication authentication) {
        
        return jobApplicationService.applyJob(jobId,resume,authentication);
    }


    @GetMapping("/view")
    public ResponseEntity<?> viewAllJobApplications(Authentication authentication) {
        System.out.println("View application controller ");
        return jobApplicationService.getAllJobApplications(authentication);
    }

    @DeleteMapping("/delete/{jobApplicationId}")
    public ResponseEntity<String> deleteJobApplication(@PathVariable Long jobApplicationId, Authentication authentication) {

        return jobApplicationService.deleteJob(jobApplicationId,authentication);
    }

    @PutMapping("/update/{jobApplicationId}")
    public ResponseEntity<String> updateJobApplication(@PathVariable Long jobApplicationId, @RequestParam("resume")MultipartFile resume, Authentication authentication){

        return jobApplicationService.updateJob(jobApplicationId,resume,authentication);
    }

}
