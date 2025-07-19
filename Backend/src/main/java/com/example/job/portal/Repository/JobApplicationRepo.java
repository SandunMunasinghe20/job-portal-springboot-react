package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Job;
import com.example.job.portal.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {

    Optional<JobApplication> findByJobIdAndSeekerId(long jobId, long seekerId);

    Optional<List<JobApplication>> findAllBySeekerId(long seekerId);

    List<JobApplication> findByJobIdIn(List<Long> jobIds);

    @Query("SELECT ja FROM JobApplication ja")
    List<JobApplication> findAllApplications();

    default Map<String, Long> getApplicationCountBySkill(JobRepo jobRepo) {
        List<JobApplication> applications = findAllApplications();
        Map<Long, Job> jobMap = jobRepo.findAll().stream()
                .collect(Collectors.toMap(Job::getId, job -> job));
        Map<String, Long> skillAppCount = new HashMap<>();

        for (JobApplication app : applications) {
            Job job = jobMap.get(app.getJobId());
            if (job != null && job.getSkillsRequired() != null) {
                String[] skills = job.getSkillsRequired().split(",");
                for (String skill : skills) {
                    skill = skill.trim();
                    skillAppCount.put(skill, skillAppCount.getOrDefault(skill, 0L) + 1);
                }
            }
        }
        return skillAppCount;
    }

}
