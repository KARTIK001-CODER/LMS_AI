# AI-Powered LMS Profile Assistant

An AI-integrated LMS profile system that allows students to manage and update their profile using both manual UI interactions and natural language commands via a chatbot.

This project demonstrates:

* Natural Language Processing (NLP)
* Backend–database integration (SQLite)
* Frontend–backend communication
* Real-time UI updates based on chatbot actions
* Clean modular architecture

---

## Features

### Authentication

* User registration (email + password)
* Secure login with JWT
* Password hashing using bcrypt
* Protected profile routes

---

### Profile Management

Users can view and update:

#### Personal Information

* Full Name
* Email
* Phone
* Date of Birth
* City

#### Educational Information

* 10th board + percentage
* 12th board + percentage

#### Course & Application Information

* Enrolled course
* Course duration & fee
* Application status (submitted / under_review / accepted / rejected)

---

### AI Chatbot Assistant

The AI chatbot allows users to:

* Update profile fields using natural language

  * Example:

    > “Update my 12th board to KSEAB”

* Query profile data

  * Example:

    > “What is my tenth percentage?”

* Check course & application status

  * Example:

    > “What is my application status?”

The chatbot converts user input into structured database operations and reflects changes in real-time on the profile page.

---

## Architecture Overview

### Tech Stack

**Frontend**

* React
* Modern CSS / Tailwind (if used)
* Axios for API communication

**Backend**

* Node.js
* Express.js
* SQLite
* JWT Authentication
* bcrypt

---

### System Flow

1. User sends message to chatbot
2. Backend parses intent (update / read)
3. SQL query executed against SQLite
4. Response returned to frontend
5. Profile page re-fetches updated data
6. UI updates instantly

---

## Database Schema Overview

### `students`

Stores personal information and authentication data.

### `education_details`

Stores 10th and 12th academic details (one-to-one relationship with student).

### `courses`

Defines LMS course offerings.

### `applications`

Tracks course enrollment and application status.

Relational integrity is maintained via foreign keys and constraints.

---

## NLP Strategy

The chatbot follows a structured intent-detection flow:

1. Identify action:

   * `update`
   * `fetch`
   * `status query`

2. Identify entity:

   * personal field
   * education field
   * course/application

3. Map to SQL operation:

   * `UPDATE`
   * `SELECT`

4. Execute database operation safely.

This approach ensures:

* Controlled database access
* Predictable behavior
* Safe query execution

---

## Real-Time UI Updates

After chatbot-triggered updates:

* Backend confirms database write
* Frontend re-fetches `/profile`
* React state updates
* UI reflects changes instantly

No page refresh required.

---

## Project Structure

```
backend/
 ├── server.js
 ├── db.js
 ├── routes/
 ├── controllers/
 ├── middleware/

frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── services/
```

Separation of concerns ensures maintainability and scalability.

---

## Security Considerations

* Passwords hashed with bcrypt
* JWT-based authentication
* Protected API routes
* Foreign key constraints in database
* Input validation before DB operations

---

## API Endpoints

### Auth

* `POST /register`
* `POST /login`

### Profile

* `GET /profile`
* `PUT /profile/personal`
* `PUT /profile/education`

### Chatbot

* `POST /chat`

---

## Design Decisions

* Floating chatbot button used to keep UI clean and non-intrusive.
* SQLite chosen for lightweight relational structure.
* Structured schema allows clear separation of student, education, and enrollment data.
* Chatbot logic kept modular to allow future AI/LLM upgrades.

---

## Future Improvements

* LLM integration for more advanced NLP
* Role-based access (admin/instructor)
* Course management module
* Profile analytics
* WebSocket-based live updates

---

## How to Run the Project

### Backend

```
cd backend
npm install
node server.js
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## Assessment Objectives Covered

* ✅ Natural Language Understanding
* ✅ Backend–Database Integration
* ✅ Frontend–Backend Communication
* ✅ Real-Time Profile Updates
* ✅ Clean System Architecture

---

## Conclusion

This project demonstrates the integration of AI-driven user interaction within an LMS profile system, combining structured relational data with conversational interfaces in a scalable and maintainable architecture.

---
