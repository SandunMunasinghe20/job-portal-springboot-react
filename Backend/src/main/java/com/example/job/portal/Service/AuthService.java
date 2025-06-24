package com.example.job.portal.Service;

import com.example.job.portal.DTO.LinkTokenDTO;
import com.example.job.portal.DTO.LoginRequestDTO;
import com.example.job.portal.DTO.LoginResponseDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.LinkToken;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.LinkTokenRepo;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Repository.UserRepo;
import com.example.job.portal.Security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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


    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;
    @Autowired
    private LinkTokenRepo linkTokenRepo;


    public AuthService(SeekerRepo seekerRepo,
                       EmployerRepo employerRepo,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       JWTService jwtService) {
        this.seekerRepo = seekerRepo;
        this.employerRepo = employerRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public ResponseEntity<String> registerSeeker(UserDto userDto) {

         String email = userDto.getEmail();
         String password = userDto.getPassword();


        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        Optional<Seeker> seeker = seekerRepo.findByEmail(email);
        Optional<Employer> employer = employerRepo.findByEmail(email);

        if(seeker.isPresent() || employer.isPresent()) {
            return ResponseEntity.badRequest().body("Account already exists with this email");
        }else{
            try{
                Seeker newSeeker = new Seeker();

                newSeeker.setEmail(email);
                newSeeker.setPassword(passwordEncoder.encode(password));
                newSeeker.setAccountCreatedAt(new Date());
                newSeeker.setAccountUpdatedAt(new Date());
                newSeeker.setRole("seeker");
                seekerRepo.save(newSeeker);
                return ResponseEntity.ok().body("Successfully registered");

            }catch (Exception e){
                return ResponseEntity.badRequest().body("Something went wrong while registering seeker");
            }
        }
    }

    public ResponseEntity<String> registerEmployer(UserDto userDto) {
        String email = userDto.getEmail();
        System.out.println("email received from user: " + email);
        String password = userDto.getPassword();
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        Optional<Employer> employer = employerRepo.findByEmail(email);
        Optional<Seeker> seeker = seekerRepo.findByEmail(email);

        if(seeker.isPresent() || employer.isPresent()) {
            System.out.println("Account already exists with this email");
            return ResponseEntity.badRequest().body("Account already exists with this email");
        }else {
            try{
                Employer newEmployer = new Employer();
                newEmployer.setEmail(email);
                newEmployer.setPassword(passwordEncoder.encode(password));
                newEmployer.setAccountCreatedAt(new Date());
                newEmployer.setAccountUpdatedAt(new Date());
                newEmployer.setRole("employer");
                employerRepo.save(newEmployer);
                System.out.println("Account successfully registered");
                return ResponseEntity.ok().body("Account successfully registered");
            }catch (Exception e){
                System.out.println("Something went wrong while registering employer");
                return ResponseEntity.badRequest().body("Something went wrong while registering employer");

            }
        }
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getEmail());
            String token = jwtService.generateToken(userDetails);

            return new LoginResponseDTO(token, "Login successful", true);
        }catch (Exception e) {
            return new LoginResponseDTO(null, "Login failed.Check your email and password", false);
        }
    }

    public ResponseEntity<String> logout(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();

            return ResponseEntity.ok().body("Successfully logged out");
        }else {
            return ResponseEntity.badRequest().body("No authenticated use found");
        }

    }

    public ResponseEntity<String> forgotPassword(String email) {
        System.out.println("email in forgotPassword: " + email);
        String newEmail = email.trim().replaceAll("\\s+", "").toLowerCase();

        Optional<User> user = userRepo.findByEmail(newEmail);

        //System.out.println("forgot password started "+user);
        if (user.isEmpty()) {
            System.out.println("user not found");
            return ResponseEntity.badRequest().body("User not found with this email");
        }

        User u = user.get();

        //get reset link
        String resetLink = emailService.getResetLink(u);

        //send reset email
        ResponseEntity<String> response=emailService.sendEmail(u, resetLink);

        System.out.println("response after sending email "+response);
        return response;
    }

    public ResponseEntity<String> resetPassword(LinkTokenDTO linkTokenDTO) {
        /*if (linkTokenDTO.getEmail() == null || linkTokenDTO.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid email");
        }*/
        //search repo for token
        LinkToken token = linkTokenRepo.findByToken(linkTokenDTO.getToken());

        if (token == null) {
            return ResponseEntity.badRequest().body("Token not found");
        }
        if (token.getExpires().isBefore(LocalDateTime.now())){
            return ResponseEntity.badRequest().body("Token expired");
        }
        if (token.isTokenUsed()){
            return ResponseEntity.badRequest().body("Token already used");
        }

        if (!linkTokenDTO.getPassword().equals( linkTokenDTO.getConfirmPassword())){
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        User realUser = token.getUser();

        /*if (!realUser.getEmail().equals(linkTokenDTO.getEmail().trim())) {
            return ResponseEntity.badRequest().body("Email does not match token owner");
        }*/

        if (linkTokenDTO.getPassword() == null || linkTokenDTO.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be empty");
        }

        //add new pass
        realUser.setPassword(passwordEncoder.encode(linkTokenDTO.getPassword().trim()));
        userRepo.save(realUser);
        token.setTokenUsed(true);
        linkTokenRepo.save(token);

        return ResponseEntity.ok().body("Password reset successfull");
    }


}
