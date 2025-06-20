package com.example.job.portal.Controller;


import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/register-seeker")
    public ResponseEntity<String> registerSeeker(@Valid @RequestBody UserDto userDto) {
        ResponseEntity<String> response =authService.registerSeeker(userDto);
        return response;
    }

    @GetMapping("register-employer")
    public ResponseEntity<String> registerEmployer(@Valid @RequestBody UserDto userDto) {
        ResponseEntity<String> response =authService.registerEmployer(userDto);
        return response;
    }
}
