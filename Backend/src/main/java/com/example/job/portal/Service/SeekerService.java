package com.example.job.portal.Service;

import com.example.job.portal.DTO.SeekerDTO;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.SeekerRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class SeekerService {

    private final SeekerRepo seekerRepo;
    private final EmployerService employerService;

    public SeekerService(SeekerRepo seekerRepo, EmployerService employerService) {
        this.seekerRepo = seekerRepo;
        this.employerService = employerService;
    }

    // Get all seekers and map to DTOs for frontend consumption
    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {

        // Fetch all seekers from database
        List<Seeker> seekers = seekerRepo.findAll();

        // Convert each Seeker entity to SeekerDTO
        List<SeekerDTO> seekerDTOs = seekers.stream().map(seeker -> {

            SeekerDTO seekerDTO = new SeekerDTO();

            // Personal information
            seekerDTO.setEmail(seeker.getEmail());
            seekerDTO.setRole("seeker");
            seekerDTO.setFname(seeker.getFname());
            seekerDTO.setLname(seeker.getLname());
            seekerDTO.setPhone(seeker.getPhone());
            seekerDTO.setLocation(seeker.getLocation());

            // Professional information
            seekerDTO.setSkills(seeker.getSkills());
            seekerDTO.setCurrentJobTitle(seeker.getCurrentJobTitle());
            seekerDTO.setTotalExperience(seeker.getTotalExperience());
            seekerDTO.setResume(employerService.byteResumeToBase64(seeker.getResume()));

            // Job preferences
            seekerDTO.setJobTypePreference(seeker.getJobTypePreference());
            seekerDTO.setPreferredIndustry(seeker.getPreferredIndustry());
            seekerDTO.setExpectedSalary(seeker.getExpectedSalary());
            seekerDTO.setAvailability(seeker.getAvailability());

            // Profile picture conversion to Base64
            byte[] byteImage = seeker.getProfilePicture();
            if (byteImage != null && byteImage.length > 0) {
                String base64Image = Base64.getEncoder().encodeToString(byteImage);
                seekerDTO.setProfilePicture(base64Image);
            }

            // Additional data
            seekerDTO.setWorkExperience(seeker.getWorkExperience());
            seekerDTO.setCertifications(seeker.getCertifications());
            seekerDTO.setAccountStatus(seeker.getAccountStatus());

            return seekerDTO;

        }).toList();

        return ResponseEntity.ok(seekerDTOs);
    }

    // Update seeker profile based on SeekerDTO
    public ResponseEntity<String> updateSeekerProfile(SeekerDTO seekerDTO) {

        String email = seekerDTO.getEmail();
        if (email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is empty");
        }

        // Find existing seeker by email
        Optional<Seeker> user = seekerRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Seeker seeker = user.get();

        // Update personal info
        seeker.setFname(seekerDTO.getFname());
        seeker.setLname(seekerDTO.getLname());
        seeker.setPhone(seekerDTO.getPhone());
        seeker.setLocation(seekerDTO.getLocation());

        // Update professional data
        seeker.setSkills(seekerDTO.getSkills());
        seeker.setCurrentJobTitle(seekerDTO.getCurrentJobTitle());
        seeker.setTotalExperience(seekerDTO.getTotalExperience());
        seeker.setResume(employerService.base64ToByteImage(seekerDTO.getResume()));

        // Update preferences
        seeker.setJobTypePreference(seekerDTO.getJobTypePreference());
        seeker.setPreferredIndustry(seekerDTO.getPreferredIndustry());
        seeker.setExpectedSalary(seekerDTO.getExpectedSalary());
        seeker.setAvailability(seekerDTO.getAvailability());

        // Update profile picture
        String base64Image = seekerDTO.getProfilePicture();
        if (base64Image != null && base64Image.length() > 0) {
            byte[] byteImage = Base64.getDecoder().decode(base64Image);
            seeker.setProfilePicture(byteImage);
        }

        // Update education, work experience, and certifications
        seeker.setEducation(seekerDTO.getEducation());
        seeker.setWorkExperience(seekerDTO.getWorkExperience());
        seeker.setCertifications(seekerDTO.getCertifications());

        // Save updated seeker
        seekerRepo.save(seeker);
        return ResponseEntity.ok("SeekerProfile updated successfully");
    }

    // Get currently logged-in seeker's profile
    public ResponseEntity<SeekerDTO> getSeekerprofile(Authentication authentication) {

        String email = authentication.getName();

        Optional<Seeker> user = seekerRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Seeker seeker = user.get();

        SeekerDTO seekerDTO = mapSeekerToDTO(seeker);
        return ResponseEntity.ok(seekerDTO);
    }

    // Delete seeker by email
    public ResponseEntity<String> deleteSeeker(String email) {

        Optional<Seeker> user = seekerRepo.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        Seeker seeker = user.get();
        seekerRepo.delete(seeker);
        return ResponseEntity.ok("SeekerProfile deleted successfully");
    }

    // Get seeker profile by ID
    public ResponseEntity<SeekerDTO> getSeekerprofileById(Long id) {

        Optional<Seeker> optSeeker = seekerRepo.findById(id);
        if (optSeeker.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Seeker seeker = optSeeker.get();
        SeekerDTO seekerDTO = mapSeekerToDTO(seeker);

        return ResponseEntity.ok(seekerDTO);
    }

    // Helper method to map Seeker entity to SeekerDTO
    private SeekerDTO mapSeekerToDTO(Seeker seeker) {
        SeekerDTO seekerDTO = new SeekerDTO();
        seekerDTO.setRole("seeker");
        seekerDTO.setEmail(seeker.getEmail());
        seekerDTO.setFname(seeker.getFname());
        seekerDTO.setLname(seeker.getLname());
        seekerDTO.setPhone(seeker.getPhone());
        seekerDTO.setLocation(seeker.getLocation());
        seekerDTO.setSkills(seeker.getSkills());
        seekerDTO.setCurrentJobTitle(seeker.getCurrentJobTitle());
        seekerDTO.setTotalExperience(seeker.getTotalExperience());
        seekerDTO.setResume(employerService.byteResumeToBase64(seeker.getResume()));
        seekerDTO.setJobTypePreference(seeker.getJobTypePreference());
        seekerDTO.setPreferredIndustry(seeker.getPreferredIndustry());
        seekerDTO.setExpectedSalary(seeker.getExpectedSalary());
        seekerDTO.setAvailability(seeker.getAvailability());
        seekerDTO.setAccountStatus(seeker.getAccountStatus());

        byte[] byteImage = seeker.getProfilePicture();
        if (byteImage != null && byteImage.length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(byteImage);
            seekerDTO.setProfilePicture(base64Image);
        }

        seekerDTO.setEducation(seeker.getEducation());
        seekerDTO.setWorkExperience(seeker.getWorkExperience());
        seekerDTO.setCertifications(seeker.getCertifications());

        return seekerDTO;
    }
}
