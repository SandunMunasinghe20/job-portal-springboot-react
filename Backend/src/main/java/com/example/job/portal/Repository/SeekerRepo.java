package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Seeker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeekerRepo extends JpaRepository<Seeker, Long> {
    Optional<Seeker> findByEmail(String email);


}
