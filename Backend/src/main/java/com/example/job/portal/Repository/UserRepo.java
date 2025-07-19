package com.example.job.portal.Repository;

import com.example.job.portal.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT FUNCTION('DATE_FORMAT', u.accountCreatedAt, '%Y-%m') AS month, COUNT(u) AS count " +
            "FROM User u GROUP BY month ORDER BY month")
    List<Object[]> getUserGrowthByMonth();


}
