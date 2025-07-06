package com.example.job.portal.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SavedJobDTO {
    private Long jobId;
    private Long seekerId;
    private Long savedJobId;
    private LocalDateTime savedDate;

}
