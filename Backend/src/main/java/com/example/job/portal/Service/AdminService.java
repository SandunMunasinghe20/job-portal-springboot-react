package com.example.job.portal.Service;

import com.example.job.portal.DTO.AdminDTO;
import com.example.job.portal.DTO.AnalyticsDTO;
import com.example.job.portal.DTO.SeekerDTO;
import com.example.job.portal.Entity.Admin;
import com.example.job.portal.Entity.JWTToken;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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

    @Autowired
    private EmailService emailService;
    @Autowired
    private EmployerService employerService;
    @Autowired
    private EmployerRepo employerRepo;
    @Autowired
    private SeekerRepo seekerRepo;
    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private JobApplicationRepo jobApplicationRepo;
    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private JWTTokenRepo jwtTokenRepo;


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

    public ResponseEntity<String> activateUserAccount(Authentication authentication, String email) {
        String currentUserEmail = authentication.getName();
        Optional<Admin> optAdmin = adminRepo.findByEmail(currentUserEmail);
        if (optAdmin.isEmpty()) {
            return ResponseEntity.badRequest().body("You are not authorized.");
        }

        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optUser.get();

        if ("active".equals(user.getAccountStatus())) {
            return ResponseEntity.ok("User account is already active");
        } else {
            user.setAccountStatus("active");
            userRepo.save(user);

            //send an automated email saying that

            String msg = """
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
        <p>Dear User,</p>

        <p style="color: #15803d; font-weight: bold;">
            Your account associated with <strong>%s</strong> has been <span style="color: green;">successfully activated</span>.
        </p>

        <p>
            You can now log in and start using all features. If you have any questions or need assistance,
            please feel free to contact us at
            <a href="mailto:aaa845515@gmail.com" style="color: #2563eb;">aaa845515@gmail.com</a>.
        </p>

        <p>Best regards,<br/>Support Team</p>
    </div>
""".formatted(user.getEmail());

            emailService.sendAccountStatusEmail(email,msg);


            return ResponseEntity.ok("User account activated");
        }
    }


    public ResponseEntity<String> deactivateUserAccount(Authentication authentication, String email) {

        String currentUserEmail = authentication.getName();
        Optional<Admin> optAdmin = adminRepo.findByEmail(currentUserEmail);
        if (optAdmin.isEmpty()) {
            return ResponseEntity.badRequest().body("You are not authorized.");
        }

        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optUser.get();

        if ("inactive".equals(user.getAccountStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User account is already inactive");
        } else {
            user.setAccountStatus("inactive");
            userRepo.save(user);

            //marks as used auth token
            Optional<JWTToken> optionalJWTToken = jwtTokenRepo.findById(user.getId());
            if (optionalJWTToken.isPresent()) {
                JWTToken jwtToken = optionalJWTToken.get();
                jwtToken.setTokenUsed(true);
                jwtTokenRepo.save(jwtToken);
                System.out.println("Token marked as used to prevent accessing the account");
            }

            //send an automated email saying that
            String adminEmail = "aaa845515@gmail.com";
            String msg = """
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
        <p>Dear User,</p>

        <p style="color: #b91c1c; font-weight: bold;">
            Your account associated with <strong>%s</strong> has been <span style="color: red;">deactivated</span>.
        </p>

        <p>
            If you believe this was a mistake or have any questions, please contact us at
            <a href="mailto:aaa845515@gmail.com" style="color: #2563eb;">aaa845515@gmail.com</a>.
        </p>

        <p>Thank you,<br/>Support Team</p>
    </div>
""".formatted(user.getEmail());

            emailService.sendAccountStatusEmail(email,msg);

            return ResponseEntity.ok("User account deactivated");
        }
    }

    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        long jobSeekers = seekerRepo.count();
        long employers = employerRepo.count();
        long admins = adminRepo.count();
        long totalJobs = jobRepo.count();
        long totalApplications = jobApplicationRepo.count();
        long totalMessages = messageRepo.count();

        long totalUsers = jobSeekers + employers + admins;

        AnalyticsDTO dto = new AnalyticsDTO(totalUsers, jobSeekers, employers, admins,
                totalJobs, totalApplications, totalMessages);

        return ResponseEntity.ok(dto);
    }

}
