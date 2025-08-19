# 💼 Fullstack Job Portal

A full-featured, responsive Job Portal built using **Java 21 (Spring Boot)** for the backend and **React + Vite** for the frontend. Developed individually to demonstrate fullstack engineering capabilities.

---

## 🚀 Project Overview

This fullstack Job Portal allows seamless interaction between Employers and Job Seekers. Key features include:

🧑‍💼 Employers can post, update, and delete job listings, and manage applications.

👨‍🎓 Job Seekers can browse, search, filter, and apply to jobs with uploaded resumes.

🔐 Secure login, registration, and password management using Spring Security

      Passwords are hashed with BCryptPasswordEncoder
      
      JWT-based authentication for stateless sessions
      
      Role-based access control enforced via @PreAuthorize annotations

💬 Messaging system enabling Employers and Job Seekers to communicate securely based on application status.

📂 Upload and view resumes, profile pictures, and company logos securely.

The project is fully developed individually, with a MySQL database backend, Spring Boot APIs, and a React + Vite frontend, demonstrating end-to-end fullstack development, database design, and security best practices.
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
| Database | MySQL (local development), MariaDB (SkySQL for CI)                   |
| Tools    | Git, GitHub, Postman, JUnit                                          |

---

## 📸 Screenshots

### 🛠️ Admin Dashboard

![Admin Home](./Screenshots/AdminHome.png)

### 📄 View Job Applications

![View Job Applications](./Screenshots/viewJobApplications.png)

### 📝 Job Details Page

![Job Details](./Screenshots/job-details.png)

### 👤 Profile View

![Profile View](./Screenshots/viewProfile.png)

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
- Activate or Deactivate User Accounts
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
- Implemented Continuous Integration (CI) using GitHub Actions to automate backend builds,  tests, and frontend linting

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

| Area     | Tech                                                    |
| -------- | --------------------------------------------------------|
| Frontend | React, Vite, Tailwind CSS, React Router                 |
| Backend  | Java 21, Spring Boot, Spring Security, JPA              |
| Database | MySQL (local development), MariaDB via SkySQL (CI/CD)   |
| Tools    | Git, GitHub, Postman, JUnit                             |


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

### 🛠️ Continuous Integration & Code Quality

Configured **GitHub Actions** to automatically run workflows on every push and pull request. The **backend workflow** performs:

- ⚙️ Build the Spring Boot project  
- 🧪 Run tests  
- 📦 Ensure proper Maven setup  
- ☁️ Connect to **SkySQL (MariaDB) cloud database** for CI testing

#### 💻 Frontend CI
- 📝 ESLint enforces linting for JavaScript/React code  
- 🔍 Automatically detects unused variables, formatting issues, and potential bugs  
- ✅ Ensures code quality before merging into the `main` branch  

#### 🖥️ Backend Code Quality
- 🛡️ Static analysis and formatting checks performed using **SunCheck**  
- 🐛 Detects code smells, bugs, and coverage gaps  
- 🧹 Ensures maintainable, clean, and consistent backend code  

#### 🎯 Benefits
- 🐞 Catch bugs and code smells **before deployment**  
- 🎨 Maintain consistent code style across frontend and backend  
- ⚡ Ensure reliable builds and faster feedback loops


## 📌 Roadmap

- ✅ Login, Register, Forgot/Reset Password
- ✅ Job Posting and Application Flows
- ✅ MySQL Integration
- ✅ Resume Upload & File Storage
- ✅ Role-Based Messaging System
- ✅ Admin View and Control Features
- ✅ Notifications for Account activations and deactivations by Admin
- ✅ Stats/Analytics
- ✅ UI/UX Polish
- 🔜 Deployment (Render / Vercel / Railway)



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

