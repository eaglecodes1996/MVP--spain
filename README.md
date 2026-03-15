# SolveSnap — Learning Platform

Full-stack learning platform (MERN) for **Math, Science and English**, with AI homework help, real-time chat, video call UI, threaded forum, calculator widget (code **2012** → games portal), and unified support hub.

## Features

- **Core subjects**: Math, Science, English (extensible via `server/routes/subjects.js`)
- **AI homework help**: Configurable backend (OpenAI or Anthropic via `AI_PROVIDER`); rate-limited chat API
- **Interactive layer**: Real-time live chat (Socket.IO), one-click video call UI, threaded discussion forum — same UI
- **Smart calculator**: Enter code **2012** to open the games portal (plane animation + embedded game links)
- **Support hub**: In-page live chat, email ticketing, searchable FAQ
- **Security**: Rate limiting on AI chat, validated calculator input, sanitized forum/support posts

## Tech stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO
- **Frontend**: React (Vite), React Router
- **AI**: Configurable layer in `server/config/ai.js` (swap OpenAI ↔ Anthropic without changing UI)

## Setup

1. **Install**
   ```bash
   npm run install:all
   ```

2. **Environment**
   - Copy `server/.env.example` to `server/.env`
   - Set `MONGODB_URI` (e.g. `mongodb://localhost:27017/solvesnap`)
   - Set **`OPENAI_API_KEY`** (required for AI chat; use your OpenAI API key)

3. **Seed FAQ (optional)**
   ```bash
   cd server && node scripts/seedFaq.js
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   - API: http://localhost:5000  
   - Client: http://localhost:5173 (proxies `/api` and Socket.IO to the server)

## Project structure

```
client/
  src/
    api/          # Configurable API (config.js, ai.js, forum.js, support.js, subjects.js)
    components/   # subjects/, chat/, calculator/, support/, learn/
    pages/        # HomePage, ForumPage, SupportPage, LearnPage
    styles/       # theme.css (SolveSnap v2 look)
server/
  config/         # db.js, ai.js (swap AI provider here)
  middleware/     # rateLimit, sanitize, validateCalculator
  models/         # ForumPost, SupportTicket, Faq
  routes/         # ai, forum, support, subjects
  sockets/        # live chat + video signalling
  scripts/        # seedFaq.js
```

## AI (OpenAI)

- **Required**: `OPENAI_API_KEY` in `server/.env`
- **Optional**: `OPENAI_MODEL` (default `gpt-4o-mini`)
- Rate limit: `AI_RATE_LIMIT_WINDOW_MS`, `AI_RATE_LIMIT_MAX` (default 30/minute).

## Calculator code 2012

On the Home page, use the calculator and type **2012** (digits only). A plane takeoff animation plays, then a mini games portal with links to browser games. Replace the URLs in `client/src/components/calculator/GamesPortal.jsx` with your own game iframes or embeds.

## Extending subjects

1. Add entries in `server/routes/subjects.js` (`SUBJECTS` array).
2. Frontend fetches `/api/subjects` and renders `SubjectCard` for each; no UI change needed for new subjects.
