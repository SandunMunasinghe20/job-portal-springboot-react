package com.example.job.portal.Entity;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
//@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JWTToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    private LocalDateTime expires;

    private boolean tokenUsed = false;

    @OneToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User user;

    public JWTToken(String token, LocalDateTime expires, boolean tokenUsed, User user) {
        this.token = token;
        this.expires = expires;
        this.tokenUsed = tokenUsed;
        this.user = user;
    }
}
