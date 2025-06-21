package com.example.job.portal.Service;

import com.example.job.portal.DTO.EmployerDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Repository.EmployerRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployerService {

    private final EmployerRepo employerRepo;

    public EmployerService(EmployerRepo employerRepo) {
        this.employerRepo = employerRepo;
    }

    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        List<Employer> employers = employerRepo.findAll();

        List<EmployerDTO> dtoList = employers.stream().map(emp -> {
            EmployerDTO dto = new EmployerDTO();
            dto.setCompanyName(emp.getCompanyName());
            dto.setIndustry(emp.getIndustry());
            dto.setCompanySize(emp.getCompanySize());
            dto.setWebsite(emp.getWebsite());
            dto.setLogoUrl(emp.getLogoUrl());
            return dto;
        }).toList();
        return ResponseEntity.ok(dtoList);
    }



    public ResponseEntity<String> updateEmployer(EmployerDTO employerDTO) {
        String email = employerDTO.getEmail();

        Optional<Employer> user = employerRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found with email " + email);
        }
        Employer employer = user.get();

        employer.setEmail(employerDTO.getEmail());
        employerRepo.save(employer);
        return ResponseEntity.ok("Profile updated successfully");

    }

    public ResponseEntity<String> deleteEmployer(String email) {
        Optional<Employer> user = employerRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found with email " + email);
        }
        Employer employer = user.get();
        employerRepo.delete(employer);
        return ResponseEntity.ok("Profile deleted successfully");
    }

    public ResponseEntity<EmployerDTO> getEmployerById(Long id) {
        Optional<Employer> user = employerRepo.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        Employer employer = user.get();

        EmployerDTO dto = new EmployerDTO();
        dto.setCompanyName(employer.getCompanyName());
        dto.setIndustry(employer.getIndustry());
        dto.setCompanySize(employer.getCompanySize());
        dto.setWebsite(employer.getWebsite());
        dto.setLogoUrl(employer.getLogoUrl());
        return ResponseEntity.ok(dto);

    }



}
