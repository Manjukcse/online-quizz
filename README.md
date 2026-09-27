# Enterprise Java Full-Stack Role-Based Online Examination System

This project is a full-stack migration of the legacy Python Django Online Quiz system into an enterprise-grade **Java 21 + Spring Boot 3.x REST API** backend and a **React 18 + Redux Toolkit + Material-UI** frontend.

---

## 1. Migration Summary

| Legacy Python (Django) Component | New Java / Spring Boot Equivalent |
| :--- | :--- |
| Django Models (`Course`, `Question`, `Result`) | Spring Data JPA Entities (`User`, `Role`, `Exam`, `Question`, `Option`, `ExamRegistration`, `Result`, `Answer`, `Feedback`, `Notification`, `LearningResource`) |
| SQLite / Django ORM | MySQL (`onlinequiz_db`) + H2 in-memory test database |
| Django Session Authentication | Spring Security 6 + JWT (Stateless Bearer Tokens) |
| Django HTML Templates | React 18 SPA + Redux Toolkit + Axios + Material-UI |
| Basic Exam Rules | Strict Server-Side Time Validation (`EXAM_NOT_STARTED`, `EXAM_EXPIRED`) |
| Manual Grading | Atomic `@Transactional` Result Evaluation Engine |

---

## 2. Technology Stack

### Backend
* **Java 21**
* **Spring Boot 3.2.3**
* **Spring Data JPA & Hibernate**
* **Spring Security & JJWT 0.12.5**
* **Jakarta Bean Validation**
* **MySQL 8.0 & H2 Database**
* **Maven 3.9.6**
* **JUnit 5 & Mockito**

### Frontend
* **Node.js v24.13.0**
* **React 18 & Vite**
* **Redux Toolkit**
* **React Router v6**
* **Axios Interceptors**
* **Material UI (MUI v5)**

---

## 3. System Architecture

```
React Frontend (Port 3000)
       │
       ▼  (Axios HTTP / JWT Authorization: Bearer <token>)
Spring Boot REST API (Port 8080)
       │
   ├── Security & JWT Filter Layer
   ├── Controller Layer (/api/admin, /api/instructor, /api/student)
   ├── Service Layer (Auth, Exam, Question, Execution, Result, Report)
   └── Repository Layer (Spring Data JPA)
       │
       ▼
MySQL 8.0 Database (onlinequiz_db)
```

---

## 4. Default Seed Accounts

Upon application startup, `DataInitializer` automatically seeds default roles and test accounts:

| Role | Username | Password | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | APPROVED | Full system privileges, user & instructor management |
| **INSTRUCTOR** | `instructor1` | `instructor123` | APPROVED | Exam & question creation, student grading |
| **STUDENT** | `student1` | `student123` | APPROVED | Can register for exams, take tests, view scorecards |

> New Instructor applications registered via UI start in `PENDING` status and require Admin approval + salary assignment before login.

---

## 5. Execution Instructions

### A. Run Backend (Spring Boot)

```powershell
# Set Java 21 environment
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"

# Run tests
& "C:\Users\ccces\.maven\apache-maven-3.9.6\bin\mvn.cmd" clean test -f backend/pom.xml

# Run backend application
& "C:\Users\ccces\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run -f backend/pom.xml
```

The Spring Boot backend will start on **http://localhost:8080**.

### B. Run Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

The React frontend will start on **http://localhost:3000**.

---

## 6. Build Verification

Both backend and frontend can be built into production artifacts:

* **Backend Executable JAR**:
  ```powershell
  & "C:\Users\ccces\.maven\apache-maven-3.9.6\bin\mvn.cmd" clean package -f backend/pom.xml
  ```
  Generates `backend/target/online-exam-system-1.0.0-SNAPSHOT.jar`.

* **Frontend Production Bundle**:
  ```powershell
  cd frontend
  npm run build
  ```
  Generates production static assets in `frontend/dist/`.
