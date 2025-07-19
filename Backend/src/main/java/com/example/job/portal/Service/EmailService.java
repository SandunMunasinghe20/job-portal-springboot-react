package com.example.job.portal.Service;

import com.example.job.portal.Entity.LinkToken;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.LinkTokenRepo;
import com.example.job.portal.Repository.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailService {
    private final JavaMailSenderImpl mailSender;
    private final UserRepo userRepo;
    private final LinkTokenRepo linkTokenRepo;


    @Autowired
    public EmailService(JavaMailSenderImpl mailSender, UserRepo userRepo,  LinkTokenRepo linkTokenRepo) {
        this.mailSender = mailSender;
        this.userRepo = userRepo;
        this.linkTokenRepo = linkTokenRepo;
    }

    public ResponseEntity<String> sendEmail(User user, String resetLink) {
        String email = user.getEmail();

        SimpleMailMessage message = new SimpleMailMessage();

        System.out.println("Sending to email: [" + email + "]");


        message.setTo(email);
        message.setSubject("Reset Password");
        message.setText("Click the link below to reset your password:\n" + resetLink);
        message.setFrom("msandunlakshan2001@gmail.com");

        mailSender.send(message);

        return ResponseEntity.ok("Check your email to reset your password");

    }

    @Transactional
    public String getResetLink(User user) {
        //delete any pre tokens
        linkTokenRepo.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        LinkToken linkToken = new LinkToken();
        linkToken.setToken(token);
        linkToken.setUser(user);
        linkToken.setExpires(LocalDateTime.now().plusMinutes(15));
        linkToken.setTokenUsed(false);


        //save token
        linkTokenRepo.save(linkToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8) +
                "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);

        return (resetLink);
    }

    public String sendAccountStatusEmail(String email, String msg) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Account Status Update");
            helper.setText(msg, true); // true => HTML content

            mailSender.send(message);
            return "Email Sent to " + email;

        } catch (MessagingException e) {
            e.printStackTrace();
            return "Failed to send email to " + email;
        }
    }

}
