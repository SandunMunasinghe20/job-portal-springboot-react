package com.example.job.portal.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String email;
    private String password;

    @Column(name = "account_created_at")
    private LocalDateTime accountCreatedAt;

    @Column(name = "account_updated_at")
    private LocalDateTime accountUpdatedAt;

}
