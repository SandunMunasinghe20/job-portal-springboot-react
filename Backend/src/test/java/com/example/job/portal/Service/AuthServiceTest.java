package com.example.job.portal.Service;

import com.example.job.portal.DTO.LinkTokenDTO;
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
    @Mock
    private LinkTokenRepo linkTokenRepo;


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

    @Test
    void login_UserNotFound() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("a@gmail.com");
        request.setPassword("pass");
        when(userRepo.findByEmail("a@gmail.com")).thenReturn(Optional.empty());
        BadCredentialsException ex = assertThrows(BadCredentialsException.class, () -> authService.login(request));
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void login_InactiveUser() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("user@gmail.com");
        request.setPassword("pass");
        User user = new User();
        user.setEmail("user@gmail.com");
        user.setAccountStatus("inactive");
        when(userRepo.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        BadCredentialsException ex = assertThrows(BadCredentialsException.class, () -> authService.login(request));
        assertEquals("Your account is currently inactive", ex.getMessage());
    }
    @Test
    void login_Success() {

        LoginRequestDTO request = new LoginRequestDTO();

        request.setEmail("user@gmail.com");
        request.setPassword("pass");

        User user = new User();

        user.setEmail("user@gmail.com");
        user.setAccountStatus("active");
        user.setRole("seeker");
        user.setId(1L);

        UserDetails userDetails = mock(UserDetails.class);

        when(userDetails.getUsername()).thenReturn("user@gmail.com");

        when(userRepo.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("user@gmail.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");
        when(jwtTokenRepo.findByUser(user)).thenReturn(Optional.empty());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(Authentication.class));
        when(jwtTokenRepo.save(any(JWTToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoginResponseDTO response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("seeker", response.getRole());
        assertEquals(1L, response.getId());
    }


    @Test
    void logout_NoAuth() {
        ResponseEntity<String> response = authService.logout(null, null);
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void forgotPassword_UserNotFound() {
        ResponseEntity<String> response = authService.forgotPassword("unknown@gmail.com");
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void resetPassword_TokenInvalid() {
        LinkTokenDTO dto = new LinkTokenDTO();
        dto.setToken("token");
        ResponseEntity<String> response = authService.resetPassword(dto);
        assertEquals(400, response.getStatusCodeValue());
    }


}
