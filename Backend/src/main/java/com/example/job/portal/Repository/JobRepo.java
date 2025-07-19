package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface JobRepo extends JpaRepository<Job, Long> {
    Optional<Job> findJobById(Long id);
    List<Job> findAllByEmployerId(Long employerId);


    @Query("SELECT j FROM Job j")
    List<Job> findAllJobs();

    default Map<String, Long> getJobCountBySkill() {
        List<Job> allJobs = findAllJobs();
        Map<String, Long> skillCount = new HashMap<>();

        for (Job job : allJobs) {
            String skillsStr = job.getSkillsRequired();
            if (skillsStr != null && !skillsStr.isEmpty()) {
                String[] skills = skillsStr.split(",");
                for (String skill : skills) {
                    skill = skill.trim();
                    skillCount.put(skill, skillCount.getOrDefault(skill, 0L) + 1);
                }
            }
        }
        return skillCount;
    }

}
