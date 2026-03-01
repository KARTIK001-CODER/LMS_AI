# AI-Powered LMS Profile Assistant

An AI-integrated Learning Management System (LMS) that allows students to **view and update their profile using both manual UI interactions and natural language commands via a chatbot**.

The system demonstrates secure authentication, backend–database integration, frontend–backend communication, and real-time UI updates triggered by chatbot actions.

---

## Live Deployment

Frontend (Vercel):  
https://lms-ai-murex.vercel.app/

Backend (Render):  
https://lms-ai-2-vlnb.onrender.com/

---

## Figma Design(Prototype Link)

https://www.figma.com/proto/e2BELW4QBwQZ1qhMEyW0If/Untitled?node-id=0-1&t=u9LE2j3C1Edw1P9t-1

---

## Figma Design(Design Link)

https://www.figma.com/design/e2BELW4QBwQZ1qhMEyW0If/Untitled?node-id=0-1&m=dev&t=u9LE2j3C1Edw1P9t-1

---

## Features

### Authentication
- User registration and login (email + password)
- JWT-based authentication
- Password hashing
- Protected profile and chatbot routes

---

### Profile Management

Users can view and update the following information:

**Personal Information**
- Full name
- Email
- Phone
- Date of birth
- City

**Educational Information**
- 10th board and percentage
- 12th board and percentage

**Course & Application Information (Read-Only)**
- Enrolled course
- Course duration and fee
- Application status (submitted / under_review / accepted / rejected)

---

### AI Chatbot Assistant

The chatbot allows users to interact using natural language:

**Profile Updates**
- Example:  
  “Update my 12th board to KSEAB”

**Profile Queries**
- Example:  
  “What is my tenth percentage?”

**Course & Application Queries**
- Example:  
  “What is my application status?”

Profile changes made through the chatbot are reflected instantly on the profile page.

---

## Architecture Overview

### Tech Stack

**Frontend**
- React (Vite)
- Fetch API
- JWT stored in localStorage
- Deployed on Vercel

**Backend**
- Node.js
- Express.js
- SQLite
- JWT Authentication
- LangChain
- Groq LLM
- Deployed on Render

---

### System Flow

1. User sends a message to the chatbot
2. Backend detects intent (read / update)
3. Database query is executed (SQL)
4. Response returned to frontend
5. Profile data is re-fetched
6. UI updates automatically

---

## Database Schema Overview

- `students` – personal and authentication data
- `education_details` – 10th and 12th academic details
- `courses` – course catalog
- `applications` – course enrollment and application status

All data access is scoped to the authenticated student.

---

## NLP Strategy

The chatbot follows a controlled intent-detection pipeline:

1. Detect action (read / update)
2. Identify target field (personal / education / course)
3. Map to SQL operation
4. Execute query safely

Known fields are handled using deterministic logic, while complex queries fall back to LangChain with Groq.

---

## Real-Time UI Updates

- Backend confirms database update
- Frontend re-fetches `/profile`
- React state updates
- UI reflects changes instantly without page reload

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

---

## Security

- JWT-protected APIs
- Student-scoped database queries
- Password hashing
- Environment-based secret management
- Restricted CORS configuration

---

## API Endpoints

### Authentication
- POST /auth/register
- POST /auth/login

### Profile
- GET /profile
- PATCH /profile/personal
- PATCH /profile/education

### Chatbot
- POST /chat

---

## Documentation

Low Level Design:  
See `lld.md`

---

## Assessment Coverage

- ✅ Natural Language Understanding
- ✅ Backend–Database Integration
- ✅ Frontend–Backend Communication
- ✅ Real-Time UI Updates
- ✅ Secure System Architecture
```

