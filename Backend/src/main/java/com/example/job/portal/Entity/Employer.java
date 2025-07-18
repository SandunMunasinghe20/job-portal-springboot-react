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

    @Column(unique=true,nullable = true)
    private Integer registrationNumber;

    private String industry;

    private String companySize;

    private String website;

    @Lob
    @Column(name = "company_logo", columnDefinition = "MEDIUMBLOB")
    private byte[] companyLogo;



    @Lob
    private String companyDescription;



    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(Integer registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getCompanySize() {
        return companySize;
    }

    public void setCompanySize(String companySize) {
        this.companySize = companySize;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public byte[] getCompanyLogo() {
        return companyLogo;
    }

    public void setCompanyLogo(byte[] companyLogo) {
        this.companyLogo = companyLogo;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }
}
