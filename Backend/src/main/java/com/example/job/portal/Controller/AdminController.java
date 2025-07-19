package com.example.job.portal.Controller;

import com.example.job.portal.DTO.*;
import com.example.job.portal.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('admin')")
public class AdminController {

    @Autowired private SeekerService seekerService;
    @Autowired private EmployerService employerService;
    @Autowired private JobService jobService;
    @Autowired private JobApplicationService jobApplicationService;
    @Autowired
    private AdminService adminService;

    // seekers

    @GetMapping("/seekers")
    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {
        return seekerService.getAllSeekers();
    }

    @GetMapping("/seekers/{id}")
    public ResponseEntity<SeekerDTO> getSeekerById(@PathVariable long id) {
        return seekerService.getSeekerprofileById(id);
    }

    @DeleteMapping("/seekers/{email}")
    public ResponseEntity<String> deleteSeekerByEmail(@PathVariable String email) {
        return seekerService.deleteSeeker(email);
    }

    @PutMapping("/seekers/{email}")
    public ResponseEntity<String> updateSeekerByEmail(@PathVariable String email, @RequestBody SeekerDTO seekerDTO) {
        seekerDTO.setEmail(email);
        return seekerService.updateSeekerProfile(seekerDTO);
    }

    // employers

    @GetMapping("/employers")
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        return employerService.getAllEmployers();
    }

    @GetMapping("/employers/{id}")
    public ResponseEntity<EmployerDTO> getEmployerById(@PathVariable long id) {
        return employerService.getEmployerById(id);
    }

    @DeleteMapping("/employers/{email}")
    public ResponseEntity<String> deleteEmployerByEmail(@PathVariable String email) {
        return employerService.deleteEmployer(email);
    }

    @PutMapping("/employers/{email}")
    public ResponseEntity<String> updateEmployerByEmail(@PathVariable String email, @RequestBody EmployerDTO employerDTO) {
        employerDTO.setEmail(email);
        return employerService.updateEmployer(employerDTO);
    }

    // jobs

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable long id) {
        return jobService.getJobById(id);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<String> deleteJobById(@PathVariable Long id) {
        return jobService.deleteJob(id);
    }

    // job applications

    @GetMapping("/applications")
    public ResponseEntity<?> getAllJobApplications() {
        return jobApplicationService.getallAppliedJobs();
    }

    /*
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<String> deleteJobApplicationById(@PathVariable long id, Authentication auth) {
        return jobApplicationService.deleteJobApplication(id, auth);
    }
    */

    @GetMapping("/profile")
    public ResponseEntity<AdminDTO> getProfile(Authentication authentication) {
        return adminService.getAdminProfile(authentication);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(@RequestBody AdminDTO adminDTO, Authentication authentication) {
        return adminService.updateAdmin(adminDTO, authentication);
    }

    //account management
    @PatchMapping("/activate")
    public ResponseEntity<String> activate(@RequestBody UserDto userDto, Authentication authentication) {
        if (!authentication.isAuthenticated() || authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return adminService.activateUserAccount(authentication, userDto.getEmail());
    }

    @PatchMapping("/deactivate")
    public ResponseEntity<String> deactivate(@RequestBody UserDto userDto, Authentication authentication) {
        if (!authentication.isAuthenticated() || authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return adminService.deactivateUserAccount(authentication, userDto.getEmail());
    }


    //analytics
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalytics(Authentication authentication) {
        if (!authentication.isAuthenticated() || authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AnalyticsDTO());
        }
        return adminService.getAnalytics();
    }


}

