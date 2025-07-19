package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployerRepo extends JpaRepository<Employer, Long> {
    Optional<Employer> findByEmail(String email);


}
