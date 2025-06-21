package com.example.job.portal.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String message;
    private boolean success;

    public void setToken(String token) {
        this.token = token;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }
    public String getToken() {
        return token;
    }
    public String getMessage() {
        return message;
    }
    public boolean isSuccess() {
        return success;
    }

}
