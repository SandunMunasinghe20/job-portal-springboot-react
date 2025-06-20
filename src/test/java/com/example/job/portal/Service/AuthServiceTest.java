package com.example.job.portal.Service;
import com.example.job.portal.DTO.UserDto;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import static org.mockito.Mockito.when;


public class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private SeekerRepo seekerRepo;
    @Mock
    private EmployerRepo employerRepo;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserDto userDto;

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


}
