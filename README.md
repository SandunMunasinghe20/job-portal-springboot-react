# 💼 Fullstack Job Portal

A full-featured, responsive Job Portal built using **Java 21 (Spring Boot)** for the backend and **React + Vite** for the frontend. Developed as a university project to demonstrate fullstack engineering capabilities.

---

## 🚀 Project Overview

This Job Portal enables:

- 🧑‍💼 Employers to post, update, and delete job listings
- 👨‍🎓 Job Seekers to browse, search, and apply for jobs
- 🔐 Secure login and registration system with role-based access control

Backed by a **MySQL database**, the app was entirely built by me to demonstrate robust, modern fullstack development.

---

## 🧑‍💻 My Role as Developer

- Designed and implemented RESTful APIs using Spring Boot
- Built a responsive frontend UI using React + Vite + Tailwind CSS
- Configured **JWT-based authentication and role-based access** using Spring Security
- Designed database schema and relationships in MySQL
- Integrated secure resume and profile image upload features
- Managed CORS, error handling, and environment configurations

---

## 🏗️ Architecture

| Layer    | Stack                                                                |
| -------- | -------------------------------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS, React Router, React Icons, React Toastify |
| Backend  | Java 21, Spring Boot, Spring Data JPA, Spring Security               |
| Database | MySQL with Hibernate (JPA)                                           |
| Tools    | Git, GitHub, Postman, JUnit                                          |

---

## 📸 Screenshots

### 🛠️ Admin Dashboard

![Admin Home](./screenshots/AdminHome.png)

### 📄 View Job Applications

![View Job Applications](./screenshots/viewJobApplications.png)

### 📝 Job Details Page

![Job Details](./screenshots/job-details.png)

### 👤 Profile View

![Profile View](./screenshots/viewProfile.png)

## 🔗 Live Demo / Video

---

## 🧪 Key Features

### 🔐 Authentication & Authorization

- Login / Register / Forgot Password via email service
- **JWT Token** based secure authentication
- Role-based access control for Employers, Job Seekers, and Admins
- Logout functionality for all roles

### 💬 Messaging System

- Employers can message job seekers only **after a job application** exists
- Admins can message anyone
- Self-messaging and same-role messaging is **prohibited**
- **Read receipts** are enabled (users can see if their message was viewed)
- **Messages cannot be deleted** to ensure platform integrity

### 🧭 Role Capabilities

#### 👨‍🎓 Job Seekers

- Browse and search all job posts
- Apply to jobs with attached resume
- View and update profile
- Upload resume to profile and during job applications
- View submitted applications

#### 🧑‍💼 Employers

- Post, edit, delete **only their own jobs**
- View received job applications
- Approve, reject, or delete job applications
- View and update profile
- See all jobs on the portal

#### 🛠️ Admins

- View **all** jobs, applications, employers, and seekers
- Delete inappropriate jobs
- Monitor platform activities

### 📂 File Uploads

- Upload and view resumes (PDF)
- Upload and view profile and company logos

---

## 🧩 Challenges Solved

- Integrated **JWT and Spring Security** securely for role-based access
- Solved CORS issues between frontend and backend during development
- Designed clean RESTful APIs with proper separation of concerns
- Normalized schema for user-job-application relationships
- Maintained secure upload storage for resumes and images

---

## 🧠 What I Learned

- Building and securing fullstack applications end-to-end
- React state management with Hooks and API integration
- Designing scalable and normalized relational databases
- Implementing security best practices with Spring Security & JWT
- Handling uploads and file storage across the stack
- Structuring clean code and maintaining modularity in large projects

---

## 🛠️ Tech Stack

| Area     | Tech                                       |
| -------- | ------------------------------------------ |
| Frontend | React, Vite, Tailwind CSS, React Router    |
| Backend  | Java 21, Spring Boot, Spring Security, JPA |
| Database | MySQL                                      |
| Tools    | Git, GitHub, Postman, JUnit                |

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Java 21
- Node.js & npm
- MySQL Server
- Maven

### 🛠️ Backend Setup

```sql
CREATE DATABASE job_portal;
```

**Edit `application.properties`:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

**Run Backend:**

```bash
./mvnw spring-boot:run
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Roadmap

- ✅ Login, Register, Forgot/Reset Password
- ✅ Job Posting and Application Flows
- ✅ MySQL Integration
- ✅ Resume Upload & File Storage
- ✅ Role-Based Messaging System
- ✅ Admin View and Control Features
- 🔜 Deployment (Render / Vercel / Railway)
- 🔜 UI/UX Polish
- ⛔ Notifications (not included)
- ⛔ Stats/Analytics (not included)

---

## 👤 Author

**Sandun Munasinghe**
📧 [e20259@eng.pdn.ac.lk](mailto:e20259@eng.pdn.ac.lk)
📧 [msandunlakshan2001@gmail.com](mailto:msandunlakshan2001@gmail.com)
🔗 [GitHub Profile](https://github.com/SandunMunasinghe20)

---

## 📄 License

This is a personal project created solely by me for educational and portfolio purposes. No open-source license is applied.

---

## 🏫 About

University Final Project (Year 2)
Department of Computer Engineering
University of Peradeniya
