package com.example.job.portal.Repository;

import com.example.job.portal.Entity.LinkToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface LinkTokenRepo extends JpaRepository<LinkToken, Long> {
    LinkToken findByToken(String token);
}
