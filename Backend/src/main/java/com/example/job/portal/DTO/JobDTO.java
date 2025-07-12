package com.example.job.portal.DTO;

import java.sql.Date;
import java.time.LocalDate;

public class JobDTO {

    private Long id;
    private String jobTitle;
    private String jobDescription;
    private String location;
    private String jobType;
    private int salary;
    private Long employerId;
    private String skillsRequired;
    private String days;


    public String getDays() {
        return days;
    }

    public void setDays(String days) {
        this.days = days;
    }

    public String getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(String skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    private String companyName;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }


    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getSalary() {
        return salary;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }
}
