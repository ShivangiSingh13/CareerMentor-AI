# 🎯 CareerMentor AI

**An AI-powered career preparation platform** built with the MERN stack — helping students analyze their resumes, chat with an AI career mentor, get a personalized learning roadmap, and practice with AI-powered mock interviews.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-Learning%2FPortfolio-blue)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Models](#-database-models)
- [AI Provider System](#-ai-provider-system)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Deployment (AWS)](#-deployment-aws)
- [Security](#-security)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🚀 Overview

CareerMentor AI is a full-stack platform focused on four core, AI-powered tools for students preparing for placements:

1. **AI Resume Analyzer** — upload a resume, get an instant ATS score and improvement feedback
2. **AI Career Mentor** — a chat assistant for real-time career guidance
3. **AI Roadmap Generator** — a personalized, trackable weekly learning plan
4. **AI Mock Interview** — practice interview questions with AI-generated feedback and scoring

Everything is tied together on a single dashboard, with one login (Student role). The platform is deployed live on AWS.

---

## ✨ Features

### 🔐 Authentication
- Signup / Login with JWT
- Passwords hashed with bcrypt
- Protected routes on both frontend and backend

### 📄 AI Resume Analyzer
- Upload a resume as a PDF
- AI-generated ATS score (0–100)
- Missing skills detection
- Keyword & improvement suggestions
- Recommended projects and an overall verdict
- Full resume history — track your score improving over time

### 🤖 AI Career Mentor (Chat)
- Conversational AI assistant for career guidance
- Chat history stored per user

### 🗺️ AI Roadmap Generator
- Input: current skills + target role
- AI-generated weekly learning plan with topics, a project idea, and resources per week
- Progress tracking — check off completed topics, see overall completion %

### 🎤 AI Mock Interview
- Choose a target role, experience level, and interview type (HR / Technical / Behavioral)
- 5 AI-generated interview questions tailored to your input
- Answer each question and get AI feedback: a score out of 10, written feedback, a suggested model answer, and improvement tips
- Overall score and confidence score once the interview is complete
- Interview history — review past attempts

### 📊 Dashboard
- Latest resume ATS score
- Roadmap progress
- Quick links to every feature

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
| MongoDB Atlas | Database (cloud-hosted) |
| Mongoose | ODM |
| JWT + bcryptjs | Authentication |
| Multer | Resume (PDF) uploads |
| pdf-parse | Extracting text from uploaded PDFs |

### AI Integration
| Provider | Role |
|---|---|
| Groq | Primary AI provider (fast, free tier) |
| Hugging Face | Automatic fallback if Groq is unavailable |
| Gemini | Additional fallback |
| OpenAI | Additional fallback |
| Built-in mock | Final safety net — the app never fully breaks even if every AI provider fails |

### Deployment
| Layer | Platform |
|---|---|
| Server (frontend + backend) | AWS EC2 (Ubuntu, Nginx, PM2) |
| Database | MongoDB Atlas |
| Public access | AWS Elastic IP (fixed address) |

---

## 📂 Project Structure

```
CareerMentor-AI/
│
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── auth/                # Login, Signup
│       │   ├── Dashboard.jsx
│       │   ├── ResumeAnalyzer.jsx
│       │   ├── MentorChat.jsx
│       │   ├── Roadmap.jsx
│       │   └── MockInterview.jsx
│       ├── context/                 # AuthContext
│       ├── services/                # Axios API modules
│       ├── routes/                  # ProtectedRoute
│       ├── App.jsx
│       └── main.jsx
│
├── server/                          # Express backend (CommonJS)
│   ├── config/                      # db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── mentorController.js
│   │   ├── roadmapController.js
│   │   └── interviewController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── ChatHistory.js
│   │   ├── Roadmap.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── mentorRoutes.js
│   │   ├── roadmapRoutes.js
│   │   └── interviewRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── services/
│   │   └── aiService.js             # Single AI integration layer (multi-provider + fallback)
│   ├── uploads/resumes/              # Uploaded student resumes
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json                      # Root — npm workspaces (client + server)
└── README.md
```

---

## 🗄️ Database Models

| Model | Purpose |
|---|---|
| **User** | Student account data (name, email, hashed password) |
| **Resume** | Uploaded resume history, ATS scores, AI analysis results |
| **ChatHistory** | AI Career Mentor conversation log, linked to user |
| **Roadmap** | AI-generated learning roadmap with per-topic progress tracking |
| **Interview** | Mock interview sessions — questions, answers, AI feedback, scores |

---

## 🤖 AI Provider System

All AI calls go through a single file: `server/services/aiService.js`.

- Set `AI_PROVIDER` in `.env` to choose the primary provider (`groq`, `huggingface`, `gemini`, or `openai`)
- If the primary provider fails (quota exceeded, invalid key, network issue), the service **automatically retries** through the remaining providers in order: `groq → huggingface → gemini → openai`
- If every provider fails, each feature falls back to built-in mock data so the app keeps working end-to-end for demos, even with zero API quota available

This means you can swap AI providers by changing one line in `.env` — no code changes needed elsewhere in the app.

---

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier)
- At least one AI provider API key (Groq recommended — free, fast, no card required)

### Installation

```bash
git clone https://github.com/ShivangiSingh13/CareerMentor-AI.git
cd CareerMentor-AI
npm install
```

This installs both `client` and `server` dependencies via npm workspaces.

### Run in Development

```bash
npm run dev
```

This starts both frontend and backend together (via `concurrently`, configured in the root `package.json`).

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

If you'd rather run them separately:
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## 🔑 Environment Variables

### `server/.env`

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/careermentor-ai?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d

# AI Provider (primary — automatically falls back if this fails)
AI_PROVIDER=groq

# AI Keys (add whichever you have — unused ones are simply ignored)
GROQ_API_KEY=your_groq_key_here
HUGGINGFACE_API_KEY=your_huggingface_key_here
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### `client/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Never commit `.env` files — they're already covered by `.gitignore`.

---

## 📡 API Endpoints

| Route | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Register a new student |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/resume/upload` | POST | Upload resume PDF & get AI analysis |
| `/api/resume` | GET | Fetch resume history |
| `/api/resume/:id` | GET | Fetch a specific resume analysis |
| `/api/mentor/history` | GET | Fetch chat history |
| `/api/mentor/chat` | POST | Send a message to the AI mentor |
| `/api/roadmap/generate` | POST | Generate a personalized roadmap |
| `/api/roadmap/:id` | GET | Fetch a saved roadmap |
| `/api/interview/start` | POST | Start a new mock interview |
| `/api/interview/:id/answer` | POST | Submit an answer and get AI feedback |
| `/api/interview/:id` | GET | Fetch a specific interview |
| `/api/interview` | GET | Fetch interview history |

All routes except signup/login require `Authorization: Bearer <token>`.

---

## ☁️ Deployment (AWS)

The app is deployed on a single AWS EC2 instance:

- **Backend** runs as a persistent process via **PM2**, which auto-restarts it if it crashes
- **Frontend** is built into static files and served by **Nginx**
- **Nginx** also reverse-proxies any `/api/*` request to the backend on port 5000
- **Database** is hosted separately on **MongoDB Atlas**, decoupled from the app server
- An **Elastic IP** keeps the public address fixed, even if the EC2 instance is stopped and restarted

### Redeploying after code changes

```bash
cd ~/CareerMentor-AI
git pull
npm install
npm run build
pm2 restart careermentor-api
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** — never stored in plaintext
- **JWT** authentication with expiring tokens
- Every protected API route validates the JWT server-side, not just the frontend
- Data queries are scoped to the logged-in user's ID (taken from the verified token) — one user cannot access another user's data
- Only PDF files accepted for resume upload, with a file size limit
- All secrets (DB credentials, JWT secret, AI API keys) live in `.env`, excluded from version control

---

## 📌 Future Improvements

- Recruiter role & Job Portal (post/apply/track applications)
- Admin panel for platform management
- Notifications system
- Skill analytics dashboard with charts
- Real-time features (WebSocket-based chat, live notifications)

---

## 📄 License

This project is developed for learning and portfolio demonstration purposes.

---

<p align="center">Built with ❤️ using the MERN stack — AI-powered career prep for students.</p>
