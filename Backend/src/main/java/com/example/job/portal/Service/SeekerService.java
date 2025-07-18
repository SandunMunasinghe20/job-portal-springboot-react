package com.example.job.portal.Service;

import com.example.job.portal.DTO.SeekerDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Repository.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class SeekerService {

    private final UserRepo userRepo;
    private final SeekerRepo seekerRepo;
    private final EmployerService employerService;

    public SeekerService(UserRepo userRepo, SeekerRepo seekerRepo,EmployerService employerService) {
        this.userRepo = userRepo;
        this.seekerRepo = seekerRepo;
        this.employerService = employerService;
    }

    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {
        List<Seeker> seekers = seekerRepo.findAll();

        List<SeekerDTO> seekerDTOs = seekers.stream().map( seeker -> {
            SeekerDTO seekerDTO = new SeekerDTO();
            seekerDTO.setEmail(seeker.getEmail());
            seekerDTO.setRole("seeker");
            seekerDTO.setFname(seeker.getFname());
            seekerDTO.setLname(seeker.getLname());
            seekerDTO.setPhone(seeker.getPhone());
            seekerDTO.setLocation(seeker.getLocation());

            // Professional data
            seekerDTO.setSkills(seeker.getSkills());
            seekerDTO.setCurrentJobTitle(seeker.getCurrentJobTitle());
            seekerDTO.setTotalExperience(seeker.getTotalExperience());

            seekerDTO.setResume(employerService.byteResumeToBase64(seeker.getResume()));

            // Preferences
            seekerDTO.setJobTypePreference(seeker.getJobTypePreference());
            seekerDTO.setPreferredIndustry(seeker.getPreferredIndustry());
            seekerDTO.setExpectedSalary(seeker.getExpectedSalary());
            seekerDTO.setAvailability(seeker.getAvailability());

            // Educational & additional data
            //convert byte arr to base 64 to send to front
            byte[] byteImage = seeker.getProfilePicture();
            if (byteImage != null && byteImage.length > 0) {
                String base64Image = Base64.getEncoder().encodeToString(byteImage);
                seekerDTO.setProfilePicture(base64Image);
            }

            seekerDTO.setWorkExperience(seeker.getWorkExperience());
            seekerDTO.setCertifications(seeker.getCertifications());

            return seekerDTO;
        }).toList();
        return ResponseEntity.ok(seekerDTOs);
    }


    public ResponseEntity<String> updateSeekerProfile(SeekerDTO seekerDTO) {

        String email = seekerDTO.getEmail();
        System.out.println("updating seeker: " + email);
        if (email.isEmpty()){
            System.out.println("Email is empty");
            return ResponseEntity.badRequest().body("Email is empty");
        }

        //find existing user acc
        Optional<Seeker> user = seekerRepo.findByEmail(email);
        if (user.isEmpty()){
            System.out.println("User not found");
            return ResponseEntity.badRequest().body("User not found");
        }
        Seeker seeker = user.get();

        System.out.println("Updating the user: "+seekerDTO.getEmail());

        // Personal Info
        seeker.setFname(seekerDTO.getFname());
        seeker.setLname(seekerDTO.getLname());
        seeker.setPhone(seekerDTO.getPhone());
        seeker.setLocation(seekerDTO.getLocation());

        // Professional Data
        seeker.setSkills(seekerDTO.getSkills());
        seeker.setCurrentJobTitle(seekerDTO.getCurrentJobTitle());
        seeker.setTotalExperience(seekerDTO.getTotalExperience());
        seeker.setResume(employerService.base64ToByteImage(seekerDTO.getResume()));

        // Preferences
        seeker.setJobTypePreference(seekerDTO.getJobTypePreference());
        seeker.setPreferredIndustry(seekerDTO.getPreferredIndustry());
        seeker.setExpectedSalary(seekerDTO.getExpectedSalary());
        seeker.setAvailability(seekerDTO.getAvailability());

        // Media / Description
        //profile pic
        String base64Image = seekerDTO.getProfilePicture();
        if (base64Image != null && base64Image.length() > 0) {
            byte[] byteImage = Base64.getDecoder().decode(base64Image);
            seeker.setProfilePicture(byteImage);
        }


        seeker.setEducation(seekerDTO.getEducation());
        seeker.setWorkExperience(seekerDTO.getWorkExperience());
        seeker.setCertifications(seekerDTO.getCertifications());

        seekerRepo.save(seeker);
        System.out.println("updated seeker: " + seekerDTO.getEmail());
        return ResponseEntity.ok("SeekerProfile updated successfully");

    }

    public ResponseEntity<SeekerDTO> getSeekerprofile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Seeker> user = seekerRepo.findByEmail(email);
        if (user.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Seeker seeker = user.get();

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

        byte[] byteImage = seeker.getProfilePicture();
        if (byteImage != null && byteImage.length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(byteImage);
            seekerDTO.setProfilePicture(base64Image);
        }

        seekerDTO.setEducation(seeker.getEducation());
        seekerDTO.setWorkExperience(seeker.getWorkExperience());
        seekerDTO.setCertifications(seeker.getCertifications());


        return ResponseEntity.ok(seekerDTO);

    }

    public ResponseEntity<String> deleteSeeker(String email) {
        Optional<Seeker> user = seekerRepo.findByEmail(email);
        if (user.isEmpty()){
            return ResponseEntity.badRequest().body("User not found");
        }
        Seeker seeker = user.get();
        seekerRepo.delete(seeker);
        return ResponseEntity.ok("SeekerProfile deleted successfully");
    }

    public ResponseEntity<SeekerDTO> getSeekerprofileById(Long id) {
        Optional<Seeker> optSeeker = seekerRepo.findById(id);
        if (optSeeker.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Seeker seeker = optSeeker.get();

        SeekerDTO seekerDTO = new SeekerDTO();
        seekerDTO.setRole("seeker");
        seekerDTO.setFname(seeker.getFname());
        seekerDTO.setLname(seeker.getLname());
        //seekerDTO.setPhone(seeker.getPhone());
        seekerDTO.setLocation(seeker.getLocation());
        seekerDTO.setSkills(seeker.getSkills());
        seekerDTO.setCurrentJobTitle(seeker.getCurrentJobTitle());
        seekerDTO.setTotalExperience(seeker.getTotalExperience());
        seekerDTO.setResume(employerService.byteResumeToBase64(seeker.getResume()));
        seekerDTO.setJobTypePreference(seeker.getJobTypePreference());
        seekerDTO.setPreferredIndustry(seeker.getPreferredIndustry());
        seekerDTO.setExpectedSalary(seeker.getExpectedSalary());
        seekerDTO.setAvailability(seeker.getAvailability());


        byte[] byteImage = seeker.getProfilePicture();
        if (byteImage != null && byteImage.length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(byteImage);
            seekerDTO.setProfilePicture(base64Image);
        }

        seekerDTO.setEducation(seeker.getEducation());
        seekerDTO.setWorkExperience(seeker.getWorkExperience());
        seekerDTO.setCertifications(seeker.getCertifications());



        return ResponseEntity.ok(seekerDTO);
    }
}
