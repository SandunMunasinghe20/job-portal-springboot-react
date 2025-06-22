package com.example.job.portal.Security;

import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Seeker;
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

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
