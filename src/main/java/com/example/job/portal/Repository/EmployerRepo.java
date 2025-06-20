package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerRepo extends JpaRepository<Employer, Integer> {
}
