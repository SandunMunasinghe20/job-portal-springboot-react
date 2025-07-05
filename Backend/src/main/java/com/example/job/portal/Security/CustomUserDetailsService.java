package com.example.job.portal.Security;

import com.example.job.portal.Entity.Admin;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.AdminRepo;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.SeekerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SeekerRepo seekerRepo;

    @Autowired
    private EmployerRepo employerRepo;
    @Autowired
    private AdminRepo adminRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Seeker> seeker = seekerRepo.findByEmail(email);
        if (seeker.isPresent()) {
            return new CustomUserDetails(seeker.get());
        }

        Optional<Employer> employer = employerRepo.findByEmail(email);
        if (employer.isPresent()) {
            return new CustomUserDetails(employer.get());
        }
        Optional<Admin> admin = adminRepo.findByEmail(email);
        if (admin.isPresent()) {
            return new CustomUserDetails(admin.get());
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
