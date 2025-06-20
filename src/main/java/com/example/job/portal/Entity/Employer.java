package com.example.job.portal.Entity;

import jakarta.persistence.*;
import org.springframework.boot.autoconfigure.batch.BatchProperties;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "employers")
@PrimaryKeyJoinColumn(name="id")
public class Employer extends User{

    private String companyName;
    private String address;
    private String phone;

    @Column(unique=true)
    private int registrationNumber;

    private String industry;

    private String companySize;

    private String website;

    private String logoUrl;



    @Lob
    private String companyDescription;


}
