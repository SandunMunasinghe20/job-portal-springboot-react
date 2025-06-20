package com.example.job.portal.Entity;

import jakarta.persistence.*;

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
    @ElementCollection
    @CollectionTable(name = "seeker_skills", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "skill")
    private List<String> skills;

    private String currentJobTitle;

    private Integer totalExperience;

    private String resumeUrl;

    // Preferences
    private String jobTypePreference;
    private String preferredIndustry;
    private Double expectedSalary;
    private String availability;

    // profile picture
    private String profilePictureUrl;


    @Lob
    private String education;
    @Lob
    private String workExperience;

    @Lob
    private String certifications;


}
