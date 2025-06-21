package com.example.job.portal.Controller;


import com.example.job.portal.DTO.LoginRequestDTO;
import com.example.job.portal.DTO.LoginResponseDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Security.JWTService;
import com.example.job.portal.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JWTService jWTService;

    @PostMapping("/register-seeker")
    public ResponseEntity<String> registerSeeker(@Valid @RequestBody UserDto userDto) {
        ResponseEntity<String> response =authService.registerSeeker(userDto);
        return response;
    }

    @PostMapping("register-employer")
    public ResponseEntity<String> registerEmployer(@Valid @RequestBody UserDto userDto) {
        ResponseEntity<String> response =authService.registerEmployer(userDto);
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));

    }

}
