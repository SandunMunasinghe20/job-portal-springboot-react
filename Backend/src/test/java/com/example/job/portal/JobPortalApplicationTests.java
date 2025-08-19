package com.example.job.portal;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class JobPortalApplicationTests {

    @Test

        //@Disabled("Disabled to unblock CI, fix ApplicationContext issue later")
    void contextLoads() {
    }

}
