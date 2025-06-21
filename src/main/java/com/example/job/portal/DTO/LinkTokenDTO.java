package com.example.job.portal.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkTokenDTO {

    private String token;
    private String email;
    private String password;
    private String confirmPassword;

}
