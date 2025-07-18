package com.example.job.portal.Service;

import com.example.job.portal.DTO.AdminDTO;
import com.example.job.portal.DTO.SeekerDTO;
import com.example.job.portal.Entity.Admin;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.AdminRepo;
import com.example.job.portal.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.fasterxml.jackson.databind.type.LogicalType.DateTime;

@Service
public class AdminService {

    @Autowired
    private SeekerService seekerService;
    @Autowired
    private AdminRepo adminRepo;

    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private UserRepo userRepo;


    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {
        return seekerService.getAllSeekers();
    }

    public ResponseEntity<AdminDTO> getAdminProfile(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("email : " + email);
        Optional<Admin> admin = adminRepo.findByEmail(email);
        System.out.println("admin: " + admin);

        if (admin.isEmpty()) {
            System.out.println("admin is null");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Admin adminObj = admin.get();

        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setEmail(adminObj.getEmail());

        return ResponseEntity.ok(adminDTO);
    }

    public ResponseEntity<String> updateAdmin(AdminDTO adminDTO, Authentication authentication) {
        String email = authentication.getName();
        Optional<Admin> optAdmin = adminRepo.findByEmail(email);

        if (optAdmin.isEmpty()) {
            System.out.println("admin not found");
            return ResponseEntity.badRequest().body("admin account not found");
        }

        Admin admin = optAdmin.get();
        admin.setEmail(adminDTO.getEmail());
        admin.setPassword(bCryptPasswordEncoder.encode(adminDTO.getPassword()));
        adminRepo.save(admin);
        return ResponseEntity.ok("Profile updated successfully");

    }

    public ResponseEntity<String> activateUserAccount(Authentication authentication, Long userId) {
        String email = authentication.getName();
        Optional<Admin> optAdmin = adminRepo.findByEmail(email);
        if (optAdmin.isEmpty()) {
            return ResponseEntity.badRequest().body("You are not authorized.");
        }

        Optional<User> optUser = userRepo.findById(userId);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optUser.get();

        if ("active".equals(user.getAccountStatus())) {
            return ResponseEntity.ok("User account is already active");
        } else {
            user.setAccountStatus("active");
            userRepo.save(user);
            return ResponseEntity.ok("User account activated");
        }
    }


    public ResponseEntity<String> deactivateUserAccount(Authentication authentication, Long userId) {
        String email = authentication.getName();
        Optional<Admin> optAdmin = adminRepo.findByEmail(email);
        if (optAdmin.isEmpty()) {
            return ResponseEntity.badRequest().body("You are not authorized.");
        }

        Optional<User> optUser = userRepo.findById(userId);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optUser.get();

        if ("inactive".equals(user.getAccountStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User account is already inactive");
        } else {
            user.setAccountStatus("inactive");
            userRepo.save(user);
            return ResponseEntity.ok("User account deactivated");
        }
    }

}
