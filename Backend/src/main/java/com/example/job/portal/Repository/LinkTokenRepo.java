package com.example.job.portal.Repository;

import com.example.job.portal.Entity.LinkToken;
import com.example.job.portal.Entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


public interface LinkTokenRepo extends JpaRepository<LinkToken, Long> {
    LinkToken findByToken(String token);

    @Modifying
    @Transactional
    @Query("delete from LinkToken lt where lt.user = :user")
    void deleteByUser(User user);
}
