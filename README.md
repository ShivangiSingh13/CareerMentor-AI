# CareerMentor AI (MVP)

A production-ready MERN MVP for student career preparation with:

- JWT authentication
- AI resume analysis
- AI career mentor chat
- AI roadmap generation
- MongoDB persistence
- React + Vite frontend with Tailwind CSS

## Setup

1. Copy `.env.example` to `server/.env` or the project root `.env` and fill in the values.
2. Install dependencies:

```bash
npm install
```

3. Run both apps:

```bash
npm run dev
```

## Environment Variables

Required variables are listed in `.env.example`.

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/resume/upload`
- `GET /api/resume/:id`
- `POST /api/mentor/chat`
- `GET /api/mentor/history`
- `POST /api/roadmap/generate`
- `GET /api/roadmap/:id`

## Notes

- The frontend stores the current user session and the latest analyzed resume / generated roadmap IDs in local storage so the dashboard can show summary data without extra API routes.
- AI responses are parsed as structured JSON in the backend. If Gemini is unavailable, the backend can fall back to OpenAI when configured.
