package com.example.job.portal.Service;

import com.example.job.portal.Entity.LinkToken;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.LinkTokenRepo;
import com.example.job.portal.Repository.UserRepo;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {
/*
    @InjectMocks
    private EmailService emailService;

    @Mock
    private JavaMailSenderImpl mailSender;

    @Mock
    private UserRepo userRepo;

    @Mock
    private LinkTokenRepo linkTokenRepo;

    @Mock
    private MimeMessage mimeMessage;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        // Mock creation of MimeMessage to avoid real email sending
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
        // Test sending a simple reset password email
    void testSendEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        String resetLink = "http://localhost/reset-password?token=123";

        // Avoid real sending
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        ResponseEntity<String> response = emailService.sendEmail(user, resetLink);

        assertEquals("Check your email to reset your password", response.getBody());
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testGetResetLink() {
        User user = new User();
        user.setEmail("test@example.com");

        // Mock deletion and saving of token
        doNothing().when(linkTokenRepo).deleteByUser(any(User.class));
        when(linkTokenRepo.save(any(LinkToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String resetLink = emailService.getResetLink(user);

        assertNotNull(resetLink);
        assertTrue(resetLink.contains("token="));
        assertTrue(resetLink.contains("email=test%40example.com"));

        // Verify methods were called exactly once
        verify(linkTokenRepo, times(1)).deleteByUser(user); // can also use any(User.class)
        verify(linkTokenRepo, times(1)).save(any(LinkToken.class));
    }



    @Test
        // Test sending account status HTML email
    void testSendAccountStatusEmail() throws Exception {
        String email = "user@example.com";
        String htmlMsg = "<p>Account activated</p>";

        // Avoid real sending
        doNothing().when(mailSender).send(any(MimeMessage.class));

        String result = emailService.sendAccountStatusEmail(email, htmlMsg);

        assertEquals("Email Sent to " + email, result);
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
        // Test failure handling when email cannot be sent
    void testSendAccountStatusEmailFailure() throws Exception {
        String email = "user@example.com";
        String htmlMsg = "<p>Account activated</p>";

        // Force sending to fail
        doThrow(new RuntimeException("SMTP error")).when(mailSender).send(any(MimeMessage.class));

        String result = emailService.sendAccountStatusEmail(email, htmlMsg);

        assertTrue(result.contains("Failed to send email to " + email));
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }
    */

}
