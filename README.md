# 🎯 CareerMentor AI (MVP)

**An AI-powered career preparation platform** — built with the MERN stack, helping students analyze their resumes, chat with an AI career mentor, and get a personalized learning roadmap.

> This is a **3-day MVP build**, scoped down from a larger CareerMentor AI concept to focus on core, demoable AI features rather than a full multi-role platform.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-MVP-orange)
![License](https://img.shields.io/badge/License-Learning%2FPortfolio-blue)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [3-Day Build Plan](#-3-day-build-plan)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🚀 Overview

CareerMentor AI (MVP) is a single-role (Student) platform focused on four things:

1. Secure login/signup
2. AI-powered resume analysis
3. An AI chat mentor for career guidance
4. An AI-generated personalized learning roadmap

The goal of this MVP is to demonstrate full-stack development, AI integration, and clean UI/UX within a tight 3-day timeline — without the overhead of multi-role auth, a job portal, or admin tooling.

---

## ✨ Features

### 🔐 Authentication
- Signup / Login with JWT
- Protected routes
- Single role: **Student**

### 📄 AI Resume Analyzer
- Upload resume as PDF
- AI-generated ATS score
- Missing skills detection
- Keyword & improvement suggestions

### 🤖 AI Career Mentor (Chat)
- Conversational AI assistant for career guidance
- Skill recommendations & general placement advice
- Chat history stored per user

### 🗺️ Roadmap Generator
- Input: current skills + target role
- Output: AI-generated weekly learning plan with resources and practice suggestions

### 📊 Simple Dashboard
- Resume score summary
- Roadmap status
- Quick links to chat & resume analyzer

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| Vite | Development & build tool |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Axios | API requests |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API server |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT + bcrypt | Authentication |
| Multer | Resume (PDF) uploads |

### AI Integration
| Technology | Purpose |
|---|---|
| Gemini API / OpenAI API | Resume analysis, chat mentor, roadmap generation |

### Deployment
| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## 📂 Project Structure

```
careermentor-ai-mvp/
│
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── resume/
│       │   ├── mentor-chat/
│       │   └── dashboard/
│       ├── pages/
│       │   ├── auth/           # Login, Signup
│       │   ├── Dashboard.jsx
│       │   ├── ResumeAnalyzer.jsx
│       │   ├── MentorChat.jsx
│       │   └── Roadmap.jsx
│       ├── context/             # AuthContext
│       ├── services/            # Axios API calls
│       ├── routes/              # ProtectedRoute
│       ├── App.jsx
│       └── main.jsx
│
├── server/                     # Express backend
│   ├── config/                 # db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── mentorController.js
│   │   └── roadmapController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── ChatHistory.js
│   │   └── Roadmap.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── mentorRoutes.js
│   │   └── roadmapRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── services/
│   │   └── aiService.js         # Gemini/OpenAI integration layer
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄️ Database Models

| Model | Purpose |
|---|---|
| **User** | Student account data (name, email, password hash) |
| **Resume** | Uploaded resume file reference, ATS score, AI analysis output |
| **ChatHistory** | AI Career Mentor conversation logs, linked to user |
| **Roadmap** | AI-generated learning roadmap, linked to user |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gemini API or OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/careermentor-ai-mvp.git
cd careermentor-ai-mvp

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Run in Development

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🔑 Environment Variables

Create a `.env` file in `/server`:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AI Integration
AI_PROVIDER=gemini        # or "openai"
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

Create a `.env` file in `/client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

| Route | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Register a new student |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/resume/upload` | POST | Upload resume PDF & get AI analysis |
| `/api/resume/:id` | GET | Fetch a saved resume analysis |
| `/api/mentor/chat` | POST | Send a message to the AI mentor |
| `/api/mentor/history` | GET | Fetch chat history |
| `/api/roadmap/generate` | POST | Generate a personalized roadmap |
| `/api/roadmap/:id` | GET | Fetch a saved roadmap |

All routes except signup/login require `Authorization: Bearer <token>`.

---

## 🗓️ 3-Day Build Plan

**Day 1 — Backend Foundation**
- Express + MongoDB setup, models (`User`, `Resume`, `ChatHistory`, `Roadmap`)
- JWT auth (signup/login, protected routes)
- Resume upload (Multer) + AI resume analysis integration

**Day 2 — Frontend Core**
- Auth pages (Login/Signup) + AuthContext
- Dashboard shell
- Resume upload UI + analysis results display
- Mentor chat UI (send/receive + history)

**Day 3 — Roadmap + Polish + Deploy**
- Roadmap generator UI
- Styling pass, responsive check, error handling
- Deploy frontend (Vercel) + backend (Render) + connect MongoDB Atlas
- Final README + demo walkthrough

---

## 📌 Future Improvements

*(deferred from the original full-scope plan — for after the MVP)*

- Recruiter & Admin roles
- Job Portal (post/apply/track applications)
- Mock Interview module with AI feedback
- Coding & aptitude practice
- Notifications system
- Skill analytics dashboard
- Bonus features: portfolio builder, LinkedIn import, voice interviews, badges, leaderboard

---

## 📄 License

This project is developed for learning and portfolio demonstration purposes.

---

<p align="center">Built with ❤️ using the MERN Stack — MVP scoped for a 3-day sprint.</p>
