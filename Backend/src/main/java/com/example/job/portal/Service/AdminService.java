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

import java.util.*;
import java.util.stream.Collectors;


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

    // Fetch all job seekers
    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {
        return seekerService.getAllSeekers();
    }

    // Get currently authenticated admin profile
    public ResponseEntity<AdminDTO> getAdminProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Admin> admin = adminRepo.findByEmail(email);

        if (admin.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Admin adminObj = admin.get();

        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setEmail(adminObj.getEmail());
        return ResponseEntity.ok(adminDTO);
    }

    // Update admin profile
    public ResponseEntity<String> updateAdmin(AdminDTO adminDTO, Authentication authentication) {
        String email = authentication.getName();
        Optional<Admin> optAdmin = adminRepo.findByEmail(email);

        if (optAdmin.isEmpty()) {
            return ResponseEntity.badRequest().body("admin account not found");
        }

        Admin admin = optAdmin.get();
        admin.setEmail(adminDTO.getEmail());
        admin.setPassword(bCryptPasswordEncoder.encode(adminDTO.getPassword())); // encode password
        adminRepo.save(admin);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // Activate a user's account
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

            // send automated email about activation
            String msg = """
                        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
                            <p>Dear User,</p>
                            <p style="color: #15803d; font-weight: bold;">
                                Your account associated with <strong>%s</strong> has been <span style="color: green;">successfully activated</span>.
                            </p>
                            <p>You can now log in and start using all features. Contact support if needed.</p>
                            <p>Best regards,<br/>Support Team</p>
                        </div>
                    """.formatted(user.getEmail());

            emailService.sendAccountStatusEmail(email, msg);
            return ResponseEntity.ok("User account activated");
        }
    }

    // Deactivate a user's account
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

            // mark JWT token as used to prevent access
            Optional<JWTToken> optionalJWTToken = jwtTokenRepo.findById(user.getId());
            optionalJWTToken.ifPresent(jwtToken -> {
                jwtToken.setTokenUsed(true);
                jwtTokenRepo.save(jwtToken);
            });

            // send automated email about deactivation
            String msg = """
                        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
                            <p>Dear User,</p>
                            <p style="color: #b91c1c; font-weight: bold;">
                                Your account associated with <strong>%s</strong> has been <span style="color: red;">deactivated</span>.
                            </p>
                            <p>If you believe this was a mistake, contact support.</p>
                            <p>Thank you,<br/>Support Team</p>
                        </div>
                    """.formatted(user.getEmail());

            emailService.sendAccountStatusEmail(email, msg);
            return ResponseEntity.ok("User account deactivated");
        }
    }

    // Get site-wide analytics
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        long jobSeekers = seekerRepo.count();
        long employers = employerRepo.count();
        long admins = adminRepo.count();
        long totalJobs = jobRepo.count();
        long totalApplications = jobApplicationRepo.count();
        long totalMessages = messageRepo.count();
        long totalUsers = jobSeekers + employers + admins;

        AnalyticsDTO analyticsDTO = new AnalyticsDTO();
        analyticsDTO.setJobSeekers(jobSeekers);
        analyticsDTO.setEmployers(employers);
        analyticsDTO.setAdmins(admins);
        analyticsDTO.setTotalJobs(totalJobs);
        analyticsDTO.setTotalApplications(totalApplications);
        analyticsDTO.setTotalMessages(totalMessages);
        analyticsDTO.setTotalUsers(totalUsers);

        // monthly user growth
        List<Object[]> userGrowthRaw = userRepo.getUserGrowthByMonth();
        Map<String, Long> userGrowthData = userGrowthRaw.stream().collect(Collectors.toMap(obj -> (String) obj[0],               // month string, e.g. "2023-07"
                obj -> ((Number) obj[1]).longValue() // count of users
        ));
        analyticsDTO.setUserGrowthData(userGrowthData);

        // skill-based job and application counts
        Map<String, Long> skillJobCounts = jobRepo.getJobCountBySkill();
        Map<String, Long> skillApplicationCounts = jobApplicationRepo.getApplicationCountBySkill(jobRepo);

        Map<String, Object> skillBasedData = new HashMap<>();
        skillBasedData.put("skillJobCounts", skillJobCounts);
        skillBasedData.put("skillApplicationCounts", skillApplicationCounts);

        analyticsDTO.setSkillBasedData(skillBasedData);

        return ResponseEntity.ok(analyticsDTO);
    }
}
