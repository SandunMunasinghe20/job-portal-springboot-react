package com.example.job.portal.Service;

import com.example.job.portal.DTO.SeekerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private SeekerService seekerService;

    public ResponseEntity<List<SeekerDTO>> getAllSeekers() {
        return seekerService.getAllSeekers();
    }


}
