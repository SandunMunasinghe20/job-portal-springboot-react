package com.example.job.portal.Service;

import com.example.job.portal.Entity.LinkToken;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.LinkTokenRepo;
import com.example.job.portal.Repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

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

        String resetLink = "http://localhost:8080/reset-password?token=" + token;
        return (resetLink);
    }

}
