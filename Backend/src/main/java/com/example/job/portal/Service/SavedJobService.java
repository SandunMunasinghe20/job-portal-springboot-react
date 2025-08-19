package com.example.job.portal.Service;

import com.example.job.portal.DTO.JobDTO;
import com.example.job.portal.DTO.SavedJobDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Job;
import com.example.job.portal.Entity.SavedJob;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.JobRepo;
import com.example.job.portal.Repository.SavedJobRepo;
import com.example.job.portal.Repository.SeekerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class SavedJobService {

    @Autowired
    private SavedJobRepo savedJobRepo;

    @Autowired
    private SeekerRepo seekerRepo;

    @Autowired
    private JobRepo jobRepo;

    @Autowired
    private EmployerRepo employerRepo;

    @Autowired
    private JobService jobService;


    // Save a job for a seeker
    public ResponseEntity<String> saveJob(SavedJobDTO savedJobDTO) {

        Long seekerId = savedJobDTO.getSeekerId();
        Long jobId = savedJobDTO.getJobId();

        // Find seeker by ID
        Optional<Seeker> optionalSeeker = seekerRepo.findById(seekerId);
        if (optionalSeeker.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seeker not found");
        }

        // Find job by ID
        Optional<Job> optionalJob = jobRepo.findJobById(jobId);
        if (optionalJob.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");
        }

        // Check for duplicate saved job
        boolean alreadyExists = savedJobRepo.existsBySeekerIdAndJobId(seekerId, jobId);
        if (alreadyExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Job already exists");
        }

        // Save new job
        SavedJob savedJob = new SavedJob();
        savedJob.setJob(optionalJob.get());
        savedJob.setSeeker(optionalSeeker.get());
        savedJob.setSavedTime(LocalDateTime.now()); // timestamp for when job is saved
        savedJobRepo.save(savedJob);

        return ResponseEntity.status(HttpStatus.CREATED).body("Job Saved successfully");
    }


    // Get all saved jobs for currently authenticated seeker
    public ResponseEntity<List<JobDTO>> getSavedJobs(Authentication authentication) {

        // Get logged-in user's email
        String email = authentication.getName();

        // Find seeker by email
        Optional<Seeker> optionalSeeker = seekerRepo.findByEmail(email);
        if (optionalSeeker.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ArrayList<>());
        }
        Seeker seeker = optionalSeeker.get();

        // Fetch saved jobs for seeker
        List<SavedJob> savedJobs = savedJobRepo.findBySeekerId(seeker.getId());

        List<JobDTO> jobDTOList = new ArrayList<>();

        // Map SavedJob entities to JobDTOs
        for (SavedJob savedJob : savedJobs) {

            Job job = savedJob.getJob();

            JobDTO jobDTO = new JobDTO();
            jobDTO.setId(job.getId());
            jobDTO.setEmployerId(job.getEmployerId());
            jobDTO.setJobTitle(job.getJobTitle());
            jobDTO.setJobDescription(job.getJobDescription());
            jobDTO.setLocation(job.getLocation());
            jobDTO.setJobType(job.getJobType());
            jobDTO.setSalary(job.getSalary());

            // Get employer name
            Optional<Employer> optionalEmployer = employerRepo.findById(job.getEmployerId());
            if (optionalEmployer.isPresent()) {
                Employer employer = optionalEmployer.get();
                jobDTO.setCompanyName(employer.getCompanyName());
            }

            // Calculate number of days since job was posted
            Date postedDate = job.getPostedDate();
            jobDTO.setDays(jobService.calculateDays(postedDate));

            jobDTOList.add(jobDTO);
        }

        return ResponseEntity.status(HttpStatus.OK).body(jobDTOList);
    }

}
