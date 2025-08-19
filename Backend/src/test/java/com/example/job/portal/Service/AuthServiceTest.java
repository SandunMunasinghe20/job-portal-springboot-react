package com.example.job.portal.Service;

import com.example.job.portal.DTO.LoginRequestDTO;
import com.example.job.portal.DTO.LoginResponseDTO;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.JWTToken;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.example.job.portal.Entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private SeekerRepo seekerRepo;
    @Mock
    private EmployerRepo employerRepo;
    @Mock
    private UserRepo userRepo;

    @Mock
    private AdminRepo adminRepo;

    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserDto userDto;
    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JWTService jwtService;

    @Mock
    private JWTTokenRepo jwtTokenRepo;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    void registerSeeker_WhenEmailExists_ShouldReturnBadRequest(){
        String email = "test@gmail.com";
        String password = "password";

        when(userDto.getEmail()).thenReturn(email);
        when(userDto.getPassword()).thenReturn(password);

        when(seekerRepo.findByEmail(email)).thenReturn(Optional.of(new Seeker()));
        when(employerRepo.findByEmail(email)).thenReturn(Optional.of(new Employer()));


        ResponseEntity<String> response = authService.registerSeeker(userDto);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Account already exists with this email", response.getBody());
    }

    @Test
    void registerSeeker_whenEmailDoesNotExist_ShouldReturnBadRequest(){

        String password = "password";

        when(userDto.getEmail()).thenReturn(null);
        when(userDto.getPassword()).thenReturn(password);

        ResponseEntity<String> response = authService.registerSeeker(userDto);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid email or password", response.getBody());
    }

    @Test
    void registerSeeker() {
        String email = "test2gmail.com";
        String password = "password";

        when(userDto.getEmail()).thenReturn(email);
        when(userDto.getPassword()).thenReturn(password);

        ResponseEntity<String> response = authService.registerSeeker(userDto);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Successfully registered", response.getBody());
    }



    @Test
    void wrongEmail_login_userNotFound() {
        String email = "a@gmail.com";
        String password = "password";

        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail(email);
        request.setPassword(password);

        // Mock userRepo to return empty
        when(userRepo.findByEmail(email)).thenReturn(Optional.empty());

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> {
            authService.login(request);
        });

        assertEquals("User not found", exception.getMessage());
    }



}
