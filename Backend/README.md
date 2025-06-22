# 💼 Fullstack Job Portal

A full-featured, responsive **Job Portal** built using **Java 23 (Spring Boot)** for the backend and **React + Vite** for the frontend. Developed as a personal project to showcase my skills as a fullstack engineer.

---

## 🚀 Project Overview

This Job Portal enables:

- 🧑‍💼 Employers to post, update, and delete job listings
- 👨‍🎓 Job Seekers to browse, search, and apply for jobs
- 🔐 Secure login and registration system with role-based access control

The app is backed by a **MySQL** database and built entirely by me as a demonstration of fullstack development with modern tools.

---

## 🧑‍💻 My Role as Developer

- Designed and implemented **RESTful APIs** using **Spring Boot**
- Built responsive **frontend UI** using **React + Vite**
- Configured **JWT-based authentication** with **Spring Security**
- Managed **MySQL** database design and schema relationships
- Solved CORS issues, security configuration, and role segregation

---

## 🏗️ Architecture


* **Frontend**: React, React Router, Tailwind CSS
* **Backend**: Spring Boot, Spring Data JPA, Spring Security
* **Database**: MySQL with Hibernate (JPA) for ORM

---

## 📸 Screenshots


## 🔗 Live Demo / Video


## 🧪 Key Features

* 🔐 Authentication: Login / Register / Forgot Password
* 🧭 Role-based Access: Job Seekers & Employers
* 📝 Job CRUD: Post, Edit, Delete (Employers)
* 📂 Apply to Jobs: (Job Seekers)
* 🌍 MySQL Integration (local setup)
* ✅ JWT Token Security 

---

## 🧩 Challenges Solved

* ✔️ Integrated **JWT** securely with **Spring Security**
* ✔️ Managed **CORS** across React (localhost) and Spring Boot (localhost)
* ✔️ Structured frontend & backend as independent services
* ✔️ Designed normalized schema for user-job-application relations

---

## 🧠 What I Learned

* End-to-end fullstack development using **Spring Boot** and **React**
* Managing state and handling API calls using **React Hooks**
* Creating and consuming **RESTful APIs** with proper request/response structure
* Implementing **secure authentication and authorization** using **Spring Security** and **JWT**
* Applying **role-based access control** (Job Seeker / Employer) in both frontend and backend
* Using modern **Java 23** features and configuration-based setups in Spring Boot
* Connecting frontend, backend, and MySQL with full-stack integration logic
* Handling **CORS**, environment configs, and error handling across the stack
---

## 🛠️ Tech Stack

| Area     | Tech                                       |
| -------- | ------------------------------------------ |
| Frontend | React, Vite, React Router                  |
| Backend  | Java 23, Spring Boot, Spring Security, JPA |
| Database | MySQL                                      |
| Tools    | Git, GitHub, Postman,Junit                       |

---

## ⚙️ Setup Instructions

### Prerequisites

* Java 23
* Node.js & npm
* MySQL Server
* Maven

### Backend Setup

1. Create MySQL database:

```sql
CREATE DATABASE job_portal;
```

2. Edit `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. Run backend:

```bash
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Roadmap

* [x] Login, Register, Forgot/Reset Password
* [x] Job Posting and Application Flows
* [x] MySQL Integration
* [ ] Job Search / Filters
* [ ] Resume Upload & File Storage
* [ ] Deployment (Render, Vercel, Railway)

---

## 👤 Author

**Sandun Munasinghe**
📧 [e20259@eng.pdn.ac.lk](mailto:e20259@eng.pdn.ac.lk)
🔗 [GitHub Profile](https://github.com/tharuwa1954)

---

## 📄 License

This is a personal project created solely by me for educational and portfolio purposes. No open-source license is applied.

