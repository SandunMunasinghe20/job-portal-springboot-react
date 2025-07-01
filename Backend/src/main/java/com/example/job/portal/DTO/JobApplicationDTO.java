package com.example.job.portal.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class JobApplicationDTO {
    private Long id;
    private Long seekerId;
    private Long jobId;
    private LocalDateTime appliedAt;
    private String status;

    private byte[] resume;

}
