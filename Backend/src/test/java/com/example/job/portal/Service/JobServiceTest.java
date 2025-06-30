package com.example.job.portal.Service;

import com.example.job.portal.DTO.JobDTO;
import com.example.job.portal.Entity.Job;
import com.example.job.portal.Repository.JobRepo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.ListResourceBundle;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @InjectMocks
    JobService jobService;

    @Mock
    JobRepo jobRepo;

   /* @Test
    void testAddJob(Authentication authentication) {

        JobDTO jobDTO = new JobDTO();
        jobDTO.setSalary(1000);
        jobDTO.setJobTitle("Job Title");
        jobDTO.setJobDescription("Job Description");
        jobDTO.setJobType("Job Type");
        jobDTO.setLocation("Location");

        when(jobRepo.save(any(Job.class))).thenReturn(new Job());

        ResponseEntity<String> response = jobService.addJob(jobDTO,authentication);

        //asserts
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Job added successfully",response.getBody());

    }
*/
    @Test
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

        when(jobRepo.findById(1L)).thenReturn(Optional.of(existingJob));
        when(jobRepo.save(any(Job.class))).thenReturn(new Job());


        ResponseEntity<String> response = jobService.updateJob(jobDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Job updated successfully",response.getBody());
    }

    @Test
    void testDeleteJob() {
        Long id = 1L;
        Job job = new Job();
        job.setId(id);

        when(jobRepo.findById(id)).thenReturn(Optional.of(job));
        ResponseEntity<String> response = jobService.deleteJob(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Job deleted successfully",response.getBody());

        //verify
        verify(jobRepo , times(1)).delete(job);
    }

    @Test
    void testGetAllJobs() {
        Job job1 = new Job();
        job1.setId(1L);
        job1.setJobTitle("Developer");
        job1.setJobDescription("Writes code");
        job1.setJobType("Full-Time");
        job1.setSalary(50000);
        job1.setLocation("Remote");

        Job job2 = new Job();
        job2.setId(2L);
        job2.setJobTitle("Tester");
        job2.setJobDescription("Tests code");
        job2.setJobType("Part-Time");
        job2.setSalary(30000);
        job2.setLocation("Onsite");

        List<Job> jobs = List.of(job1, job2);

        when(jobRepo.findAll()).thenReturn(jobs);
        ResponseEntity<List<JobDTO>> response = jobService.getAllJobs();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());

    }

    @Test
    void testGetJobById() {
        Long id = 1L;
        Job job = new Job();
        job.setId(id);
        job.setJobTitle("Developer");
        job.setJobDescription("Writes code");
        job.setJobType("Full-Time");
        job.setSalary(50000);
        job.setLocation("Remote");

        Job job2 = new Job();
        job2.setId(2L);
        job2.setJobTitle("Tester");
        job2.setJobDescription("Tests code");
        job2.setJobType("Part-Time");
        job2.setSalary(30000);
        job2.setLocation("Onsite");

        when(jobRepo.findById(id)).thenReturn(Optional.of(job));
        ResponseEntity<JobDTO> response = jobService.getJobById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        JobDTO dto = response.getBody();

        assertEquals(job.getId(), dto.getId());
        assertEquals(job.getJobTitle(), dto.getJobTitle());
        assertEquals(job.getJobDescription(), dto.getJobDescription());
        assertEquals(job.getJobType(), dto.getJobType());
        assertEquals(job.getSalary(), dto.getSalary());


    }

}
