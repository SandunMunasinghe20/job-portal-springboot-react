package com.example.job.portal.Service;

import com.example.job.portal.DTO.EmployerDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Repository.EmployerRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
            dto.setEmail(emp.getEmail());
            dto.setCompanyName(emp.getCompanyName());
            dto.setIndustry(emp.getIndustry());
            dto.setCompanySize(emp.getCompanySize());
            dto.setWebsite(emp.getWebsite());
            dto.setLogoUrl(emp.getLogoUrl());
            dto.setCompanyDescription(emp.getCompanyDescription());
            dto.setAddress(emp.getAddress());
            dto.setPhone(emp.getPhone());
            dto.setRegistrationNumber(emp.getRegistrationNumber());
            dto.setRole("employer");
            return dto;
        }).toList();

        return ResponseEntity.ok(dtoList);
    }




    public ResponseEntity<String> updateEmployer(EmployerDTO employerDTO) {
        String email = employerDTO.getEmail();
        System.out.println("updating profile for email: " + email);
        Optional<Employer> user = employerRepo.findByEmail(email);
        if (user.isEmpty()) {
            System.out.println("user not found");
            return ResponseEntity.badRequest().body("User not found with email " + email);
        }
        Employer employer = user.get();

        employer.setEmail(employerDTO.getEmail());
        employer.setCompanyName(employerDTO.getCompanyName());
        employer.setAddress(employerDTO.getAddress());
        employer.setPhone(employerDTO.getPhone());
        employer.setRegistrationNumber(employerDTO.getRegistrationNumber());
        employer.setIndustry(employerDTO.getIndustry());
        employer.setCompanySize(employerDTO.getCompanySize());
        employer.setWebsite(employerDTO.getWebsite());
        employer.setLogoUrl(employerDTO.getLogoUrl());
        employer.setCompanyDescription(employerDTO.getCompanyDescription());
        employer.setRole(employerDTO.getRole());

        employerRepo.save(employer);

        System.out.println("profile updated successfully for email: " + email);
        return ResponseEntity.ok("Profile updated successfully");

    }

    public ResponseEntity<EmployerDTO> getEmployerProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Employer> employerOptional = employerRepo.findByEmail(email);

        if (employerOptional.isEmpty()) {
            throw new UsernameNotFoundException("Employer not found with email: " + email);
        }

        Employer employer = employerOptional.get();

        EmployerDTO dto = new EmployerDTO();
        dto.setEmail(employer.getEmail());
        dto.setCompanyName(employer.getCompanyName());
        dto.setAddress(employer.getAddress());
        dto.setPhone(employer.getPhone());
        dto.setRegistrationNumber(employer.getRegistrationNumber());
        dto.setIndustry(employer.getIndustry());
        dto.setCompanySize(employer.getCompanySize());
        dto.setWebsite(employer.getWebsite());
        dto.setLogoUrl(employer.getLogoUrl());
        dto.setCompanyDescription(employer.getCompanyDescription());
        dto.setRole(employer.getRole());
        System.out.println("role: " + employer.getRole());

        return ResponseEntity.ok(dto);
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
