package com.example.job.portal.Controller;

import com.example.job.portal.DTO.SeekerDTO;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Service.EmployerService;
import com.example.job.portal.Service.SeekerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seekers")
@AllArgsConstructor
public class SeekerController {

    private final SeekerRepo seekerRepo;
    private final SeekerService seekerService;
    private final EmployerService employerService;


    @GetMapping("/all")
    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {
        return seekerService.getAllSeekers();
    }

    @GetMapping("/profile")
    public ResponseEntity<SeekerDTO> getSeekerProfile(Authentication authentication) {
        return seekerService.getSeekerprofile(authentication);
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasRole('employer') ||hasRole('admin')")
    public ResponseEntity<SeekerDTO> getSeekerProfileById(@PathVariable Long id) {
        return seekerService.getSeekerprofileById(id);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateSeeker(@RequestBody SeekerDTO seekerDTO,Authentication authentication) {
        seekerDTO.setEmail(authentication.getName());
        return seekerService.updateSeekerProfile(seekerDTO);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteSeeker(Authentication auth) {
        return seekerService.deleteSeeker(auth.getName());
    }

}
