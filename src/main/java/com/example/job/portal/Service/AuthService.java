package com.example.job.portal.Service;

import com.example.job.portal.DTO.LoginRequestDTO;
import com.example.job.portal.DTO.LoginResponseDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;


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
        String password = userDto.getPassword();
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        Optional<Employer> employer = employerRepo.findByEmail(email);
        Optional<Seeker> seeker = seekerRepo.findByEmail(email);

        if(seeker.isPresent() || employer.isPresent()) {
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
                return ResponseEntity.ok().body("Account successfully registered");
            }catch (Exception e){
                return ResponseEntity.badRequest().body("Something went wrong while registering employer");
            }
        }
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequestDTO.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new LoginResponseDTO(token);
    }

}
