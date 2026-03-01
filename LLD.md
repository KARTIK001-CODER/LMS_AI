## 1. Objective
To design a system that allows students to securely view and update their LMS profile using:
- Manual UI-based updates
- Natural language commands via an AI chatbot
The system ensures real-time synchronization between the database and UI while maintaining security and controlled access.

---

## 2. System Architecture
```
User
↓
Frontend (React + Vite)
↓
Backend (Node.js + Express + JWT)
↓
SQLite Database
↓
Groq LLM via LangChain (conditional)
```

---

## 3. Authentication Flow
1. User logs in using email and password
2. Backend validates credentials
3. JWT token is generated
4. Token is stored on frontend
5. Token is sent in `Authorization` header
6. Middleware verifies token
7. `student_id` is extracted and used for all requests
All protected routes require a valid JWT.

---

## 4. Database Design
### Tables

#### students
- id (Primary Key)
- full_name
- email
- password
- phone
- date_of_birth
- city

#### education_details
- student_id (Foreign Key)
- tenth_board
- tenth_percentage
- twelfth_board
- twelfth_percentage

#### courses
- id (Primary Key)
- title
- duration_months
- fee

#### applications
- student_id (Foreign Key)
- course_id (Foreign Key)
- status

All tables are linked using foreign key constraints to maintain data integrity.

---

## 5. API Design

### Authentication
- POST /auth/register
- POST /auth/login
---
### Profile APIs
**GET /profile**
- Returns personal, education, and course/application data
- JWT protected

**PATCH /profile/personal**
- Updates personal information
- JWT protected

**PATCH /profile/education**
- Updates or inserts education details
- JWT protected

---

### Chatbot API
**POST /chat**
- Accepts natural language input
- JWT protected
- Returns chatbot response
---

## 6. Chatbot Logic
### Intent Routing Strategy
```
User Message
│
├─ Known field + UPDATE intent → Direct SQL UPDATE
│
├─ Known field + READ intent → Direct SQL SELECT
│
└─ Complex / unknown intent → LangChain + Groq
```
---
### Rule-Based Processing
- Handles known profile and education fields
- Deterministic logic
- No AI token usage
- Safe SQL execution
---
### LLM-Based Processing
- Used only for complex or conversational queries
- Cannot directly modify database
- All data access scoped to authenticated student
---

## 7. Course and Application Handling
- Course and application data are read-only for students
- Students can:
  - View enrolled course
  - View application status
- Students cannot update course or application status

---

## 8. Real-Time Profile Synchronization
1. Profile updated via manual edit or chatbot
2. Backend confirms database update
3. Frontend triggers profile re-fetch
4. React state updates
5. UI reflects changes instantly

---

## 9. Performance Considerations
- Direct SQL used for known operations
- LLM invoked only when necessary
- Singleton SQLite connection
- Guarded API calls to prevent redundancy

---

## 10. Security Considerations
- JWT-based authentication
- Student-scoped database queries
- Input validation before DB operations
- Environment-based secret management
- Restricted CORS configuration

---

## 11. Deployment
- Backend deployed on Render
- Frontend deployed on Vercel
- Backend URL configured via frontend environment variables
- SQLite database included for demo purposes
