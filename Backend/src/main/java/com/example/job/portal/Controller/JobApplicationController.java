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
        if(authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body("Please login first");

        }
        System.out.println("mobing to service function now");
        return jobApplicationService.applyJob(jobId,resume,authentication);
    }


}
