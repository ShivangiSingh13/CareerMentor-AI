# 🎯 CareerMentor AI

**An all-in-one AI-powered placement preparation and career mentorship platform** built on the MERN stack — helping students improve resumes, ace interviews, practice aptitude, and get personalized career guidance, all in one place.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active%20Development-orange)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**CareerMentor AI** is a full-stack placement preparation platform designed for students, recruiters, and administrators. It combines AI-driven resume analysis, mock interviews, career mentorship, a job portal, and skill analytics into a single, modern, and responsive web application.

The platform is built with clean architecture, reusable components, a scalable folder structure, and production-ready practices — making it suitable both as a real-world product and as a strong portfolio project.

---

## ✨ Features

### 🔐 Authentication & Roles
- Signup / Login with JWT-based authentication
- Email verification & Forgot Password flow
- Role-based access control — **Student**, **Recruiter**, **Admin**
- Protected routes on both client and server

### 🎓 Student Dashboard
- Personalized welcome & placement progress overview
- Resume completion & ATS score widgets
- Daily goals, skill progress, and streaks
- Applied jobs, upcoming interviews, and notifications feed

### 📄 AI Resume Analyzer
- Upload resumes in PDF format
- AI-generated ATS score
- Missing skills detection & keyword suggestions
- Bullet point improvement suggestions
- Certification & project recommendations
- Visual results with charts and progress bars

### 🤖 AI Career Mentor (Chat Assistant)
- Conversational career guidance
- Personalized placement roadmap & learning path
- Skill recommendations, company prep, salary guidance
- Persistent chat history per user

### 🎤 AI Mock Interview
- Role-, experience-, and skill-based question generation
- HR, Technical, and Behavioral interview types
- AI feedback with score & confidence rating
- Suggested answers and improvement tips
- Full interview history tracking

### 💼 Job Portal
- Recruiters: post, edit, and delete job listings
- Students: search, filter, apply, save jobs, and track applications

### 🗺️ Roadmap Generator
- Input current skills, target role, and target company
- AI-generated weekly learning plan with projects, resources, and certifications

### 💻 Coding & Aptitude Practice
- Coding, aptitude, logical reasoning, SQL, JavaScript, and Python quizzes
- Score and progress tracking

### 📌 Project Recommender
- AI-suggested projects based on skills, experience, and career goals
- Includes difficulty, tech stack, GitHub structure, and learning outcomes

### 📊 Skill Analytics
- Visual charts for skill progress, study hours, interview scores, resume improvement, applications sent, and success rate

### 🔔 Notifications
- Interview reminders, resume updates, new job alerts, daily goals, and learning reminders

### 🛠️ Admin Panel
- Manage users & jobs, view platform-wide analytics, remove spam, monitor activity

### 🎁 Bonus Features
- GitHub profile analysis & LinkedIn import
- Portfolio & resume builder
- AI cover letter generator
- Voice interviews (speech-to-text / text-to-speech)
- Calendar integration & email notifications
- Achievement badges, streaks, and leaderboard

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Framer Motion, Chart.js, React Icons |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt, Multer, Cloudinary, Nodemailer |
| **AI Integration** | Gemini API / OpenAI API |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 📁 Folder Structure

```
careermentor-ai/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/              # Buttons, Cards, Modals, Loaders
│   │   │   ├── dashboard/
│   │   │   ├── resume/
│   │   │   ├── interview/
│   │   │   ├── mentor-chat/
│   │   │   ├── jobs/
│   │   │   └── analytics/
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Signup, ForgotPassword
│   │   │   ├── student/
│   │   │   ├── recruiter/
│   │   │   └── admin/
│   │   ├── layouts/
│   │   ├── context/                 # AuthContext, ThemeContext
│   │   ├── hooks/
│   │   ├── services/                # Axios API service files
│   │   ├── utils/
│   │   ├── routes/                  # ProtectedRoute, RoleBasedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/                      # db.js, cloudinary.js, nodemailer.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── interviewController.js
│   │   ├── mentorController.js
│   │   ├── jobController.js
│   │   ├── roadmapController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Interview.js
│   │   ├── Roadmap.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Notification.js
│   │   ├── ChatHistory.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   └── Certificate.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── mentorRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── roadmapRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── adminRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── uploadMiddleware.js
│   ├── services/
│   │   └── aiService.js             # Gemini/OpenAI integration layer
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   └── validators.js
│   ├── server.js
│   └── package.json
│
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

| Collection | Purpose |
|---|---|
| **Users** | Student, recruiter, and admin account data & roles |
| **Resumes** | Uploaded resumes, ATS scores, AI analysis results |
| **Interviews** | Mock interview sessions, questions, feedback, scores |
| **Roadmaps** | AI-generated personalized learning roadmaps |
| **Jobs** | Job postings created by recruiters |
| **Applications** | Student job applications and status tracking |
| **Notifications** | System and activity notifications per user |
| **ChatHistory** | AI Career Mentor conversation logs |
| **Projects** | AI-recommended project suggestions |
| **Skills** | Skill tracking and progress data |
| **Certificates** | Earned/recommended certifications |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account (resume/image storage)
- Gemini API or OpenAI API key
- SMTP credentials (for Nodemailer)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/careermentor-ai.git
cd careermentor-ai

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

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000` (default ports).

---

## 🔑 Environment Variables

Create a `.env` file in `/server` based on `.env.example`:

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

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

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

## 📡 API Documentation

Full endpoint-by-endpoint documentation lives in [`docs/API.md`](./docs/API.md). Summary of core route groups:

| Route Prefix | Description |
|---|---|
| `/api/auth` | Signup, login, email verification, password reset |
| `/api/resume` | Resume upload & AI analysis |
| `/api/mentor` | AI chat assistant & conversation history |
| `/api/interview` | Mock interview generation, feedback, history |
| `/api/jobs` | Job CRUD, search, filter, apply, save |
| `/api/roadmap` | Personalized roadmap generation |
| `/api/analytics` | Skill and progress analytics |
| `/api/notifications` | Notification management |
| `/api/admin` | User/job management, platform monitoring |

All protected routes require an `Authorization: Bearer <token>` header. Role-restricted routes additionally check the user's role via middleware.

---

## ☁️ Deployment Guide

Detailed steps are in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). Quick summary:

1. **Database** — Create a MongoDB Atlas cluster, whitelist IPs, and grab your connection string.
2. **Backend (Render)** — Connect your GitHub repo, set the root directory to `server`, add environment variables, and deploy as a Web Service.
3. **Frontend (Vercel)** — Connect your GitHub repo, set the root directory to `client`, add `VITE_API_BASE_URL` pointing to your Render backend URL, and deploy.
4. **Post-deploy** — Update `CLIENT_URL` in the backend `.env` to your Vercel domain for CORS configuration, and test all auth/email flows in production.

---

## 🔒 Security

- Password hashing with **bcrypt**
- Stateless authentication via **JWT**
- **Helmet** for secure HTTP headers
- **CORS** configuration restricted to trusted origins
- Rate limiting on sensitive endpoints (auth, AI calls)
- Server-side input validation on all routes
- XSS protection and sanitized user input
- Secrets managed exclusively via environment variables

---

## 🧭 Roadmap

- [ ] Real-time notifications via WebSockets
- [ ] Voice-based mock interviews (speech-to-text/text-to-speech)
- [ ] Portfolio builder with public shareable links
- [ ] Leaderboard & achievement badge system
- [ ] LinkedIn/GitHub profile import
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss proposed changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">Built with ❤️ using the MERN Stack — helping students land their dream jobs, one feature at a time.</p>
