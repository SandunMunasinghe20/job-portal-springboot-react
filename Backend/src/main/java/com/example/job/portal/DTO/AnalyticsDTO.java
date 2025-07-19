package com.example.job.portal.DTO;

import java.util.Map;

public class AnalyticsDTO {
    private long totalUsers;
    private long jobSeekers;
    private long employers;
    private long admins;
    private long totalJobs;
    private long totalApplications;
    private long totalMessages;

    private Map<String,Long> userGrowthData;
    private Map<String, Object> skillBasedData;


    // Constructors
    public AnalyticsDTO() {}

    public AnalyticsDTO(long totalUsers, long jobSeekers, long employers, long admins,
                        long totalJobs, long totalApplications, long totalMessages, Map<String,Long> userGrowthData,Map<String, Object> skillBasedData) {
        this.totalUsers = totalUsers;
        this.jobSeekers = jobSeekers;
        this.employers = employers;
        this.admins = admins;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
        this.totalMessages = totalMessages;
        this.userGrowthData = userGrowthData;
        this.skillBasedData = skillBasedData;
    }

    // Getters and setters for all fields

    public Map<String, Object> getSkillBasedData() {
        return skillBasedData;
    }

    public void setSkillBasedData(Map<String, Object> skillBasedData) {
        this.skillBasedData = skillBasedData;
    }

    public Map<String,Long> getUserGrowthData() {
        return userGrowthData;
    }
    public void setUserGrowthData(Map<String,Long> userGrowthData) {
        this.userGrowthData = userGrowthData;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getJobSeekers() { return jobSeekers; }
    public void setJobSeekers(long jobSeekers) { this.jobSeekers = jobSeekers; }

    public long getEmployers() { return employers; }
    public void setEmployers(long employers) { this.employers = employers; }

    public long getAdmins() { return admins; }
    public void setAdmins(long admins) { this.admins = admins; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getTotalMessages() { return totalMessages; }
    public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }
}
