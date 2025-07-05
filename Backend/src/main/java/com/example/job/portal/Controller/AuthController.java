package com.example.job.portal.Controller;


import com.example.job.portal.DTO.LinkTokenDTO;
import com.example.job.portal.DTO.LoginRequestDTO;
import com.example.job.portal.DTO.LoginResponseDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Service.JWTService;
import com.example.job.portal.Service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
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
        return authService.registerEmployer(userDto);
    }
    @PostMapping("register-admin")
    public ResponseEntity<String> registerAdmin(@Valid @RequestBody UserDto userDto) {
        return authService.registerAdmin(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok(authService.login(loginRequestDTO));

    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication, HttpServletRequest request) {

        return authService.logout(authentication,request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody String email) {
        System.out.println("email received: " + email);
        return (authService.forgotPassword(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid  @RequestBody LinkTokenDTO linkTokenDTO) {
        return (authService.resetPassword(linkTokenDTO));
    }


}
