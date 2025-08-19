package com.example.job.portal.Service;

import com.example.job.portal.DTO.AdminDTO;
import com.example.job.portal.DTO.AnalyticsDTO;
import com.example.job.portal.DTO.SeekerDTO;
import com.example.job.portal.Entity.*;
import com.example.job.portal.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @InjectMocks
    private AdminService adminService;

    @Mock
    private SeekerService seekerService;
    @Mock
    private AdminRepo adminRepo;
    @Mock
    private UserRepo userRepo;
    @Mock
    private EmployerService employerService;
    @Mock
    private EmployerRepo employerRepo;
    @Mock
    private SeekerRepo seekerRepo;
    @Mock
    private JobRepo jobRepo;
    @Mock
    private JobApplicationRepo jobApplicationRepo;
    @Mock
    private MessageRepo messageRepo;
    @Mock
    private JWTTokenRepo jwtTokenRepo;
    @Mock
    private EmailService emailService;
    @Mock
    private Authentication authentication;

    @Spy
    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); // Initialize mocks before each test
    }

    @Test
        // Test fetching all job seekers through SeekerService
    void testGetAllSeekers() {
        List<SeekerDTO> mockSeekers = List.of(new SeekerDTO());
        when(seekerService.getAllSeekers()).thenReturn(ResponseEntity.ok(mockSeekers));

        ResponseEntity<List<SeekerDTO>> response = adminService.getAllSeekers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockSeekers, response.getBody()); // Ensure returned list matches mocked data
    }

    @Test
        // Test retrieving admin profile based on authentication
    void testGetAdminProfile() {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        when(authentication.getName()).thenReturn("admin@example.com");
        when(adminRepo.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        ResponseEntity<AdminDTO> response = adminService.getAdminProfile(authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("admin@example.com", response.getBody().getEmail());
    }

    @Test
        // Test updating admin profile with new email and password
    void testUpdateAdmin() {
        Admin admin = new Admin();
        admin.setEmail("old@example.com");
        when(authentication.getName()).thenReturn("admin@example.com");
        when(adminRepo.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        AdminDTO dto = new AdminDTO();
        dto.setEmail("new@example.com");
        dto.setPassword("newpassword");

        ResponseEntity<String> response = adminService.updateAdmin(dto, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Profile updated successfully", response.getBody());
        assertTrue(bCryptPasswordEncoder.matches("newpassword", admin.getPassword())); // Password encoded correctly
        verify(adminRepo, times(1)).save(admin); // Ensure save is called once
    }

    @Test
        // Test activating a user account (from inactive to active)
    void testActivateUserAccount() {
        Admin admin = new Admin();
        when(authentication.getName()).thenReturn("admin@example.com");
        when(adminRepo.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        User user = new User();
        user.setEmail("user@example.com");
        user.setAccountStatus("inactive");

        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<String> response = adminService.activateUserAccount(authentication, "user@example.com");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User account activated", response.getBody());
        assertEquals("active", user.getAccountStatus());
        verify(emailService, times(1)).sendAccountStatusEmail(eq("user@example.com"), anyString());
        verify(userRepo, times(1)).save(user); // Ensure user saved after status change
    }

    @Test
        // Test deactivating a user account and marking JWT token as used
    void testDeactivateUserAccount() {
        Admin admin = new Admin();
        when(authentication.getName()).thenReturn("admin@example.com");
        when(adminRepo.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        User user = new User();
        user.setEmail("user@example.com");
        user.setAccountStatus("active");

        JWTToken token = new JWTToken();
        token.setTokenUsed(false);

        when(userRepo.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(jwtTokenRepo.findById(user.getId())).thenReturn(Optional.of(token));

        ResponseEntity<String> response = adminService.deactivateUserAccount(authentication, "user@example.com");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User account deactivated", response.getBody());
        assertEquals("inactive", user.getAccountStatus());
        assertTrue(token.isTokenUsed());
        verify(emailService, times(1)).sendAccountStatusEmail(eq("user@example.com"), anyString());
        verify(userRepo, times(1)).save(user);
        verify(jwtTokenRepo, times(1)).save(token);
    }

    @Test
        // Test getting site-wide analytics including user growth and skill-based data
    void testGetAnalytics() {
        when(seekerRepo.count()).thenReturn(5L);
        when(employerRepo.count()).thenReturn(3L);
        when(adminRepo.count()).thenReturn(2L);
        when(jobRepo.count()).thenReturn(10L);
        when(jobApplicationRepo.count()).thenReturn(20L);
        when(messageRepo.count()).thenReturn(15L);

        // Mock monthly user growth data
        List<Object[]> growthData = new ArrayList<>();
        growthData.add(new Object[]{ "2025-08", 5L });

        when(userRepo.getUserGrowthByMonth()).thenReturn(growthData);

        // Mock skill-based counts
        Map<String, Long> jobSkillCounts = Map.of("Java", 4L);
        Map<String, Long> appSkillCounts = Map.of("Java", 3L);

        when(jobRepo.getJobCountBySkill()).thenReturn(jobSkillCounts);
        when(jobApplicationRepo.getApplicationCountBySkill(jobRepo)).thenReturn(appSkillCounts);

        ResponseEntity<AnalyticsDTO> response = adminService.getAnalytics();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        AnalyticsDTO dto = response.getBody();
        assertNotNull(dto);

        // Check counts
        assertEquals(5L, dto.getJobSeekers());
        assertEquals(3L, dto.getEmployers());
        assertEquals(2L, dto.getAdmins());
        assertEquals(10L, dto.getTotalJobs());
        assertEquals(20L, dto.getTotalApplications());
        assertEquals(15L, dto.getTotalMessages());
        assertEquals(10L, dto.getTotalUsers());

        // Check user growth and skill-based data
        assertEquals(5L, dto.getUserGrowthData().get("2025-08"));
        assertEquals(jobSkillCounts, dto.getSkillBasedData().get("skillJobCounts"));
        assertEquals(appSkillCounts, dto.getSkillBasedData().get("skillApplicationCounts"));
    }
}
