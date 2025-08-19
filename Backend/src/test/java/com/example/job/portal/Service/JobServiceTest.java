package com.example.job.portal.Service;

import com.example.job.portal.DTO.JobDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Job;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.JobRepo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @InjectMocks
    JobService jobService; // Service under test

    @Mock
    JobRepo jobRepo; // Mock repository for Job

    @Mock
    EmployerRepo employerRepo; // Mock repository for Employer

    @Mock
    Authentication authentication; // Mock authentication for user context

    @Test
        // Test updating an existing job
    void testUpdateJob() {
        JobDTO jobDTO = new JobDTO();
        jobDTO.setId(1L);
        jobDTO.setSalary(1000);
        jobDTO.setJobTitle("Job Title");
        jobDTO.setJobDescription("Job Description");
        jobDTO.setJobType("Job Type");
        jobDTO.setLocation("Location");

        Job existingJob = new Job();
        existingJob.setId(1L);

        // Mock database call to return existing job
        when(jobRepo.findById(1L)).thenReturn(Optional.of(existingJob));
        when(jobRepo.save(any(Job.class))).thenReturn(new Job()); // Mock save

        // Call service
        ResponseEntity<String> response = jobService.updateJob(jobDTO);

        // Assert response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Job updated successfully", response.getBody());
    }

    @Test
        // Test deleting a job
    void testDeleteJob() {
        Long id = 1L;
        Job job = new Job();
        job.setId(id);

        // Mock finding job by ID
        when(jobRepo.findById(id)).thenReturn(Optional.of(job));

        ResponseEntity<String> response = jobService.deleteJob(id);

        // Assert delete response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Job deleted successfully", response.getBody());

        // Verify delete method called once
        verify(jobRepo, times(1)).delete(job);
    }

    @Test
        // Test fetching all jobs
    void testGetAllJobs() {
        Job job = new Job();
        job.setId(1L);
        job.setEmployerId(10L);
        job.setJobTitle("Developer");
        job.setJobDescription("Writes code");
        job.setJobType("Full-Time");
        job.setSalary(50000);
        job.setLocation("Remote");
        job.setPostedDate(new Date());

        Employer employer = new Employer();
        employer.setId(10L);
        employer.setCompanyName("Acme Corp");

        // Mock fetching all jobs and employer info
        when(jobRepo.findAll()).thenReturn(List.of(job));
        when(employerRepo.findById(10L)).thenReturn(Optional.of(employer));

        ResponseEntity<List<JobDTO>> response = jobService.getAllJobs();

        // Assert response contains expected job and company name
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Acme Corp", response.getBody().get(0).getCompanyName());
    }

    @Test
        // Test fetching a job by ID
    void testGetJobById() {
        Job job = new Job();
        job.setId(1L);
        job.setEmployerId(10L);
        job.setJobTitle("Developer");
        job.setJobDescription("Writes code");
        job.setJobType("Full-Time");
        job.setSalary(50000);
        job.setLocation("Remote");
        job.setPostedDate(new Date());

        Employer employer = new Employer();
        employer.setId(10L);
        employer.setCompanyName("Acme Corp");

        // Mock database calls
        when(jobRepo.findById(1L)).thenReturn(Optional.of(job));
        when(employerRepo.findById(10L)).thenReturn(Optional.of(employer));

        ResponseEntity<JobDTO> response = jobService.getJobById(1L);

        // Assert the response matches expected data
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Acme Corp", response.getBody().getCompanyName());
    }

    @Test
        // Test adding a new job
    void testAddJob() {
        JobDTO jobDTO = new JobDTO();
        jobDTO.setSalary(1000);
        jobDTO.setJobTitle("Job Title");
        jobDTO.setJobDescription("Job Description");
        jobDTO.setJobType("Job Type");
        jobDTO.setLocation("Location");

        Employer employer = new Employer();
        employer.setId(10L);
        employer.setCompanyName("Acme Corp");

        // Mock authentication and employer lookup
        when(authentication.getName()).thenReturn("test@example.com");
        when(employerRepo.findByEmail("test@example.com")).thenReturn(Optional.of(employer));
        when(jobRepo.save(any(Job.class))).thenReturn(new Job());

        ResponseEntity<String> response = jobService.addJob(jobDTO, authentication);

        // Assert job was added successfully
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Job added successfully", response.getBody());
    }

    @Test
        // Test fetching jobs posted by authenticated employer
    void testGetAllJobsByCompany() {
        Employer employer = new Employer();
        employer.setId(10L);
        employer.setCompanyName("Acme Corp");
        employer.setEmail("test@example.com");

        Job job = new Job();
        job.setId(1L);
        job.setEmployerId(10L);
        job.setJobTitle("Developer");
        job.setJobDescription("Writes code");
        job.setJobType("Full-Time");
        job.setSalary(50000);
        job.setLocation("Remote");
        job.setPostedDate(new Date());

        // Mock authentication and repository calls
        when(authentication.getName()).thenReturn("test@example.com");
        when(employerRepo.findByEmail("test@example.com")).thenReturn(Optional.of(employer));
        when(jobRepo.findAllByEmployerId(10L)).thenReturn(List.of(job));

        ResponseEntity<List<JobDTO>> response = jobService.getAllJobsByCompany(authentication);

        // Assert response matches expected employer jobs
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Acme Corp", response.getBody().get(0).getCompanyName());
    }
}
