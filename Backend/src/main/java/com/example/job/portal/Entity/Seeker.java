package com.example.job.portal.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.util.List;

@Entity
@Table(name = "seekers")
@PrimaryKeyJoinColumn(name = "id")
public class Seeker extends User {
    private String fname;
    private String lname;
    private String phone;
    private String location;


    // Professional Data
    //@ElementCollection
    //@CollectionTable(name = "seeker_skills", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "skill")
    private String skills;

    private String currentJobTitle;

    @Min(value = 0, message = "Experience must be a positive number")
    private Integer totalExperience;

    @Lob
    @Column(name = "resume",columnDefinition = "LONGBLOB")
    private byte[] resume;

    // Preferences
    private String jobTypePreference;
    private String preferredIndustry;
    private Double expectedSalary;
    private String availability;

    // profile picture
    @Lob
    @Column(name = "profile_picture", columnDefinition = "LONGBLOB")
    private byte[] profilePicture;



    @Lob
    private String education;
    @Lob
    private String workExperience;

    @Lob
    private String certifications;

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCurrentJobTitle() {
        return currentJobTitle;
    }

    public void setCurrentJobTitle(String currentJobTitle) {
        this.currentJobTitle = currentJobTitle;
    }

    public Integer getTotalExperience() {
        return totalExperience;
    }

    public void setTotalExperience(Integer totalExperience) {
        this.totalExperience = totalExperience;
    }

    public byte[] getResume() {
        return resume;
    }

    public void setResume(byte[] resume) {
        this.resume = resume;
    }

    public String getJobTypePreference() {
        return jobTypePreference;
    }

    public void setJobTypePreference(String jobTypePreference) {
        this.jobTypePreference = jobTypePreference;
    }

    public String getPreferredIndustry() {
        return preferredIndustry;
    }

    public void setPreferredIndustry(String preferredIndustry) {
        this.preferredIndustry = preferredIndustry;
    }

    public Double getExpectedSalary() {
        return expectedSalary;
    }

    public void setExpectedSalary(Double expectedSalary) {
        this.expectedSalary = expectedSalary;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getWorkExperience() {
        return workExperience;
    }

    public void setWorkExperience(String workExperience) {
        this.workExperience = workExperience;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }
}
