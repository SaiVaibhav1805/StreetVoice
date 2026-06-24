# StreetVoice

StreetVoice is a community-driven civic issue reporting and monitoring platform. It uses AI to automatically categorize reported issues, assess their severity, detect duplicates, and route them to relevant authorities. The platform also incorporates citizen gamification (XP, badges, levels) to incentivize community action and verify reports.

## Project Structure

```text
streetvoice/
│
├── client/                          # React PWA Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json            # PWA manifest
│   │   ├── service-worker.js        # Offline support
│   │   └── icons/                   # App icons
│   │
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   │
│   │   ├── pages/                   # Client views
│   │   ├── components/              # Reusable components
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── context/                 # Context Providers
│   │   ├── services/                # Backend API services
│   │   └── utils/                   # Helper functions
│   │
│   ├── .env                         # Client Environment config
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── index.js                 # Entry point
│   │   ├── config/                  # DB, Firebase, Cloudinary configurations
│   │   ├── models/                  # Mongoose Schemas
│   │   ├── routes/                  # Express API routers
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Express middlewares
│   │   ├── services/                # AI, Gamification, and Geo logic
│   │   ├── jobs/                    # Chron/Background worker jobs
│   │   └── utils/                   # Helper utilities
│   │
│   ├── .env                         # Server Environment config
│   └── package.json
│
├── ai/                              # LLM system configurations
│   ├── prompts/                     # Prompt templates (Spam, Category, Severity)
│   └── schemas/                     # Enforced JSON response schemas
│
└── docs/                            # Documentation details
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- Firebase Admin SDK credentials (for notifications)
- Cloudinary credentials (for image uploads)
- OpenAI or Gemini API Key (for AI analysis services)

### 2. Client Installation & Start
```bash
cd client
npm install
npm run dev
```

### 3. Server Installation & Start
```bash
cd server
npm install
npm run dev
```

### 4. Docker Compose
If you prefer running using docker-compose:
```bash
docker-compose up --build
```
