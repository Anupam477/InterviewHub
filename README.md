# InterviewHub - High-Performance AI Mock Interview Platform

An enterprise-grade, full-stack web application designed to help engineering students prepare for technical and placement interviews. Built using the **MERN Stack** (MongoDB, Express, React, Node.js) and powered by **Google Gemini 1.5 Flash** for real-time technical evaluation, complexity analysis, and communication feedback.

---

## 🚀 Key Features

1. **Dynamic Setup Dashboard**: Configure job roles (e.g., Frontend Developer, System Engineer), experience level (Fresher to 5+ YoE), tech stacks, difficulty levels, and interviewer personalities.
2. **AI-Driven Q&A Engine**: Generates customized technical interview questions based on the candidate's profile.
3. **Interactive Coding Sandbox**: Real-time coding input with automatic analysis of Time Complexity, Space Complexity, and optimization recommendations.
4. **Speech-to-Text Integration**: Powered by the browser's built-in **Web Speech API** for vocal answers.
5. **Speech Pacing & Filler Word Auditor**: Programmatic analysis counting speech filler words (`um`, `like`, `you know`, `actually`) to help improve verbal presentation.
6. **Detailed Performance Reports**: circular score trackers, accordion-based evaluations displaying the candidate's answers side-by-side with AI feedback, ideal answers, and a 5-day action roadmap.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS (Premium Dark Theme), Lucide React (Icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Service**: Google Gemini API (`@google/generative-ai`)
- **Authentication**: JSON Web Token (JWT) + Bcrypt.js

---

## 📐 Directory Structure

```text
mockInterview/
├── backend/
│   ├── config/             # Database connection handler
│   ├── controllers/        # Express request logic (Auth, Gemini prompt evaluation)
│   ├── middleware/         # JWT verification middleware
│   ├── models/             # Mongoose Schemas (User, InterviewSession, QAHistory)
│   ├── routes/             # REST API Endpoints
│   ├── .env                # Server environmental variables
│   ├── server.js           # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API config
│   │   ├── context/        # Auth global state provider
│   │   ├── pages/          # App views (Landing, Dashboard, Interview, Report)
│   │   ├── App.jsx         # App router
│   │   ├── index.css       # Tailwind base styles
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── package.json            # Root configuration for concurrent run scripts
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB installed locally or MongoDB Atlas URI
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Installation

1. **Clone or Open the Folder**
   Open the root workspace folder `mockInterview` in your terminal.

2. **Configure Environmental Variables**
   Create a `.env` file in the `backend/` directory (a template is already provided):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mock_interviewer
   JWT_SECRET=supersecrettokenkey12345
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
   *Replace `YOUR_GEMINI_API_KEY` with your actual Google Gemini API key.*

3. **Install All Dependencies**
   Run the following command at the root to automatically install dependencies for the root, backend, and frontend folders:
   ```bash
   npm run install-all
   ```

4. **Run Development Servers**
   Run the backend and frontend concurrently in development mode using:
   ```bash
   npm run dev
   ```
   *The React app will launch at `http://localhost:5173` and backend APIs at `http://localhost:5000`.*

---

## 📊 Mongoose Relational ERD

```text
  [User] ──(1:N)──► [InterviewSession] ──(1:N)──► [QAHistory]
  (Auth Profile)     (Job Profile & Details)       (Questions, Answers, Scores & Feedbacks)
```

---

## 🛡️ API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authorize user & return JWT

### Interview Session Routes (Protected via JWT)
- `POST /api/interview/start` - Initialize session and request AI questions
- `GET /api/interview/session/:sessionId/question/:qNum` - Fetch question details
- `POST /api/interview/evaluate` - Evaluate response (scores, fillers, code complexity)
- `POST /api/interview/end` - Finalize session, compile overall score and custom roadmap
- `GET /api/interview/history` - Retrieve all past interview logs for user
- `GET /api/interview/session/:sessionId/report` - Get detailed QA breakdown report
