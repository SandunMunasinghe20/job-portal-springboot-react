package com.example.job.portal.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class EmployerDTO {

    private String email;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String address;

    private String phone;

    //@Positive(message = "Registration number must be positive")
    private Integer registrationNumber;

    private String industry;

    private String companySize;

    private String website;

    private String companyLogo;

    private String companyDescription;

    private String role = "employer";

    private String accountStatus;
}
