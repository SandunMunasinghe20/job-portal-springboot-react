package com.example.job.portal.Service;

import com.example.job.portal.DTO.EmployerDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Repository.EmployerRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class EmployerService {

    private final EmployerRepo employerRepo;

    public EmployerService(EmployerRepo employerRepo) {
        this.employerRepo = employerRepo;
    }

    // Convert Base64 string to byte array
    public byte[] base64ToByteImage(String base64Image) {
        if (base64Image == null || base64Image.isEmpty()) {
            return null; // return null if no image provided
        }
        return Base64.getDecoder().decode(base64Image);
    }

    // Convert byte array to Base64 string
    public String byteImageToBase64(byte[] byteImage) {
        if (byteImage == null || byteImage.length == 0) {
            return null; // return null if no data
        }
        return Base64.getEncoder().encodeToString(byteImage);
    }

    // Convert byte array resume to Base64 string
    public String byteResumeToBase64(byte[] byteResume) {
        if (byteResume == null || byteResume.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(byteResume);
    }

    // Get list of all employers as DTOs
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        List<Employer> employers = employerRepo.findAll();

        List<EmployerDTO> dtoList = employers.stream().map(emp -> {
            EmployerDTO dto = new EmployerDTO();
            dto.setEmail(emp.getEmail());
            dto.setCompanyName(emp.getCompanyName());
            dto.setIndustry(emp.getIndustry());
            dto.setCompanySize(emp.getCompanySize());
            dto.setWebsite(emp.getWebsite());

            // Convert company logo to Base64 for frontend
            dto.setCompanyLogo(byteImageToBase64(emp.getCompanyLogo()));
            dto.setCompanyDescription(emp.getCompanyDescription());
            dto.setAddress(emp.getAddress());
            dto.setPhone(emp.getPhone());
            dto.setRegistrationNumber(emp.getRegistrationNumber());
            dto.setRole("employer");
            dto.setAccountStatus(emp.getAccountStatus());

            return dto;
        }).toList();

        return ResponseEntity.ok(dtoList);
    }

    // Update employer profile
    public ResponseEntity<String> updateEmployer(EmployerDTO employerDTO) {
        String email = employerDTO.getEmail();
        System.out.println("updating profile for email: " + email);

        Optional<Employer> user = employerRepo.findByEmail(email);

        if (user.isEmpty()) {
            System.out.println("user not found");
            return ResponseEntity.badRequest().body("User not found with email " + email);
        }

        Employer employer = user.get();

        // Update all relevant fields
        employer.setEmail(employerDTO.getEmail());
        employer.setCompanyName(employerDTO.getCompanyName());
        employer.setAddress(employerDTO.getAddress());
        employer.setPhone(employerDTO.getPhone());
        employer.setRegistrationNumber(employerDTO.getRegistrationNumber());
        employer.setIndustry(employerDTO.getIndustry());
        employer.setCompanySize(employerDTO.getCompanySize());
        employer.setWebsite(employerDTO.getWebsite());
        employer.setCompanyLogo(base64ToByteImage(employerDTO.getCompanyLogo())); // convert logo
        employer.setCompanyDescription(employerDTO.getCompanyDescription());
        employer.setRole(employerDTO.getRole());

        employerRepo.save(employer);

        System.out.println("profile updated successfully for email: " + email);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // Get employer profile for logged-in user
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
        dto.setCompanyLogo(byteImageToBase64(employer.getCompanyLogo())); // convert logo
        dto.setCompanyDescription(employer.getCompanyDescription());
        dto.setRole(employer.getRole());
        dto.setAccountStatus(employer.getAccountStatus());

        System.out.println("role: " + employer.getRole());
        return ResponseEntity.ok(dto);
    }

    // Delete employer profile
    public ResponseEntity<String> deleteEmployer(String email) {
        Optional<Employer> user = employerRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found with email " + email);
        }

        employerRepo.delete(user.get()); // remove employer from DB
        return ResponseEntity.ok("Profile deleted successfully");
    }

    // Get employer by ID
    public ResponseEntity<EmployerDTO> getEmployerById(Long id) {
        Optional<Employer> user = employerRepo.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.noContent().build(); // no content if not found
        }

        Employer employer = user.get();
        EmployerDTO dto = new EmployerDTO();
        dto.setCompanyName(employer.getCompanyName());
        dto.setIndustry(employer.getIndustry());
        dto.setCompanySize(employer.getCompanySize());
        dto.setWebsite(employer.getWebsite());
        dto.setAccountStatus(employer.getAccountStatus());
        dto.setCompanyLogo(byteImageToBase64(employer.getCompanyLogo())); // convert logo

        return ResponseEntity.ok(dto);
    }
}
