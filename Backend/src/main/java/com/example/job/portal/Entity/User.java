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
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(name = "account_created_at")
    private Date accountCreatedAt;

    @Column(name = "account_updated_at")
    private Date accountUpdatedAt;

    @Column(name = "role")
    private String role;

    @Column(name = "account_status",nullable = false)
    private String accountStatus;

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public String getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getAccountCreatedAt() {
        return accountCreatedAt;
    }

    public void setAccountCreatedAt(Date accountCreatedAt) {
        this.accountCreatedAt = accountCreatedAt;
    }

    public Date getAccountUpdatedAt() {
        return accountUpdatedAt;
    }

    public void setAccountUpdatedAt(Date accountUpdatedAt) {
        this.accountUpdatedAt = accountUpdatedAt;
    }
}
