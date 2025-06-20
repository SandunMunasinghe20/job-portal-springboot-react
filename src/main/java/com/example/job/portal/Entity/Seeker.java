package com.example.job.portal.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "seekers")
public class Seeker extends User {
}
