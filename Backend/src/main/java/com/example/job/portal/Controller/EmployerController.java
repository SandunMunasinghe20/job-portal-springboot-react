package com.example.job.portal.Controller;

import com.example.job.portal.DTO.EmployerDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Service.EmployerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employers")
@AllArgsConstructor
public class EmployerController {

    private final EmployerRepo employerRepo;
    private final SeekerRepo seekerRepo;
    private final EmployerService employerService;


    @GetMapping("/all")
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        return employerService.getAllEmployers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('seeker')")
    public ResponseEntity<EmployerDTO> getEmployerById(@PathVariable Long id) {
        return employerService.getEmployerById(id);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('employer')")
    public ResponseEntity<String > updateEmployer(@RequestBody EmployerDTO employerDTO, Authentication authentication) {
        employerDTO.setEmail(authentication.getName());
        return employerService.updateEmployer(employerDTO);
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployerDTO> getEmployerProfile(Authentication authentication) {
        return employerService.getEmployerProfile(authentication);
    }

    @DeleteMapping("delete-emp")
    public ResponseEntity<String> deleteEmployer(Authentication authentication) {
        return employerService.deleteEmployer(authentication.getName());
    }

}
