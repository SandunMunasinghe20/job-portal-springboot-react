package com.example.job.portal.Repository;

import com.example.job.portal.Entity.JWTToken;
import com.example.job.portal.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JWTTokenRepo extends JpaRepository<JWTToken, Long> {
    Optional<JWTToken> findByToken(String token);

    Optional<JWTToken> findByUser(User user);


}
