package com.example.job.portal.Service;

import com.example.job.portal.DTO.LinkTokenDTO;
import com.example.job.portal.DTO.LoginRequestDTO;
import com.example.job.portal.DTO.LoginResponseDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Entity.*;
import com.example.job.portal.Repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;


@Service
public class AuthService {
    @Autowired
    private SeekerRepo seekerRepo;
    @Autowired
    private EmployerRepo employerRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private JWTTokenRepo jwtTokenRepo;

    private LocalDateTime localDateTime;

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;
    @Autowired
    private LinkTokenRepo linkTokenRepo;
    @Autowired
    private AdminRepo adminRepo;

    // Constructor for dependency injection
    public AuthService(SeekerRepo seekerRepo, EmployerRepo employerRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JWTService jwtService, JWTTokenRepo jwtTokenRepo) {
        this.seekerRepo = seekerRepo;
        this.employerRepo = employerRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    // Register a new job seeker
    public ResponseEntity<String> registerSeeker(UserDto userDto) {
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // Check if user already exists
        Optional<Seeker> seeker = seekerRepo.findByEmail(email);
        Optional<Employer> employer = employerRepo.findByEmail(email);
        Optional<Admin> admin = adminRepo.findByEmail(email);

        if (seeker.isPresent() || employer.isPresent() || admin.isPresent()) {
            return ResponseEntity.badRequest().body("Account already exists with this email");
        } else {
            try {
                Seeker newSeeker = new Seeker();
                newSeeker.setEmail(email);
                newSeeker.setPassword(passwordEncoder.encode(password));
                newSeeker.setAccountCreatedAt(new Date());
                newSeeker.setAccountUpdatedAt(new Date());
                newSeeker.setRole("seeker");
                newSeeker.setAccountStatus("active");
                seekerRepo.save(newSeeker);
                return ResponseEntity.ok().body("Successfully registered");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Something went wrong while registering seeker");
            }
        }
    }

    // Register a new employer
    public ResponseEntity<String> registerEmployer(UserDto userDto) {
        String email = userDto.getEmail();
        String password = userDto.getPassword();
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // Check if user already exists
        Optional<Employer> employer = employerRepo.findByEmail(email);
        Optional<Seeker> seeker = seekerRepo.findByEmail(email);
        Optional<Admin> admin = adminRepo.findByEmail(email);

        if (seeker.isPresent() || employer.isPresent() || admin.isPresent()) {
            return ResponseEntity.badRequest().body("Account already exists with this email");
        } else {
            try {
                Employer newEmployer = new Employer();
                newEmployer.setEmail(email);
                newEmployer.setPassword(passwordEncoder.encode(password));
                newEmployer.setAccountCreatedAt(new Date());
                newEmployer.setAccountUpdatedAt(new Date());
                newEmployer.setRole("employer");
                newEmployer.setAccountStatus("active");
                employerRepo.save(newEmployer);
                return ResponseEntity.ok().body("Account successfully registered");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Something went wrong while registering employer");
            }
        }
    }

    // Register a new admin
    public ResponseEntity<String> registerAdmin(UserDto userDto) {
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        // Check if user already exists
        Optional<Seeker> seeker = seekerRepo.findByEmail(email);
        Optional<Employer> employer = employerRepo.findByEmail(email);
        Optional<Admin> admin = adminRepo.findByEmail(email);

        if (seeker.isPresent() || employer.isPresent() || admin.isPresent()) {
            return ResponseEntity.badRequest().body("Account already exists with this email");
        } else {
            try {
                Admin newAdmin = new Admin();
                newAdmin.setEmail(email);
                newAdmin.setPassword(passwordEncoder.encode(password));
                newAdmin.setAccountCreatedAt(new Date());
                newAdmin.setAccountUpdatedAt(new Date());
                newAdmin.setRole("admin");
                newAdmin.setAccountStatus("active");
                adminRepo.save(newAdmin);
                return ResponseEntity.ok().body("Successfully registered");
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Something went wrong while registering admin");
            }
        }
    }

    // User login with JWT token generation
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepo.findByEmail(loginRequestDTO.getEmail()).orElseThrow(() -> new BadCredentialsException("User not found"));

        // Check account status
        if (!"active".equalsIgnoreCase(user.getAccountStatus())) {
            throw new BadCredentialsException("Your account is currently inactive");
        }

        // Authenticate user
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword()));

        // Generate JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getEmail());
        String token = jwtService.generateToken(userDetails);

        // Save or update JWT in database
        Optional<JWTToken> existingToken = jwtTokenRepo.findByUser(user);
        LocalDateTime expiry = LocalDateTime.now().plusHours(10);

        if (existingToken.isPresent()) {
            JWTToken jwtToken = existingToken.get();
            jwtToken.setToken(token);
            jwtToken.setExpires(expiry);
            jwtToken.setTokenUsed(false);
            jwtTokenRepo.save(jwtToken);
        } else {
            JWTToken newToken = new JWTToken(token, expiry, false, user);
            jwtTokenRepo.save(newToken);
        }

        return new LoginResponseDTO(token, user.getRole(), user.getId(), "Login successful", true);
    }

    // Logout user and invalidate JWT
    public ResponseEntity<String> logout(Authentication authentication, HttpServletRequest request) {
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Authorization header missing or invalid");
            }
            String jwtToken = authHeader.substring(7);
            Optional<JWTToken> tokenOpt = jwtTokenRepo.findByToken(jwtToken);
            if (tokenOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Token not found");
            }
            JWTToken token = tokenOpt.get();

            if (!token.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Not authorized to logout this token");
            }

            token.setTokenUsed(true); // mark token as used
            jwtTokenRepo.save(token);
            return ResponseEntity.ok().body("Successfully logged out");
        }
        return ResponseEntity.badRequest().body("No authenticated user found");
    }

    // Send password reset email
    public ResponseEntity<String> forgotPassword(String email) {
        String newEmail = email.trim().replaceAll("\\s+", "").toLowerCase();
        Optional<User> user = userRepo.findByEmail(newEmail);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found with this email");
        }

        User u = user.get();
        String resetLink = emailService.getResetLink(u); // generate reset link
        return emailService.sendEmail(u, resetLink); // send reset email
    }

    // Reset user password using token
    public ResponseEntity<String> resetPassword(LinkTokenDTO linkTokenDTO) {
        LinkToken token = linkTokenRepo.findByToken(linkTokenDTO.getToken());

        if (token == null) return ResponseEntity.badRequest().body("Token not found");
        if (token.getExpires().isBefore(LocalDateTime.now())) return ResponseEntity.badRequest().body("Token expired");
        if (token.isTokenUsed()) return ResponseEntity.badRequest().body("Token already used");
        if (!linkTokenDTO.getPassword().equals(linkTokenDTO.getConfirmPassword()))
            return ResponseEntity.badRequest().body("Passwords do not match");

        User realUser = token.getUser();
        if (!realUser.getEmail().equals(linkTokenDTO.getEmail().trim()))
            return ResponseEntity.badRequest().body("Email does not match token owner");
        if (linkTokenDTO.getPassword() == null || linkTokenDTO.getPassword().trim().isEmpty())
            return ResponseEntity.badRequest().body("Password cannot be empty");

        // update password
        realUser.setPassword(passwordEncoder.encode(linkTokenDTO.getPassword().trim()));
        userRepo.save(realUser);

        // mark token as used
        token.setTokenUsed(true);
        linkTokenRepo.save(token);

        return ResponseEntity.ok().body("Password reset successful");
    }
}
