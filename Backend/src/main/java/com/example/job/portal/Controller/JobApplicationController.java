package com.example.job.portal.Controller;

import com.example.job.portal.DTO.JobApplicationDTO;
import com.example.job.portal.Service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/applyJobs")
public class JobApplicationController {
    @Autowired
    private JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<String> applyJob(@RequestBody JobApplicationDTO jobApplicationDTO, Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body("Please login first");
        }
        return jobApplicationService.applyJob(jobApplicationDTO);
    }


}
