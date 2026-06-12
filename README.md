# GitHub Explorer

A full-stack web application that lets users search any GitHub username and instantly view their public profile and repositories. Built as a take-home assignment for the Studio Graphene Associate Software Engineer role.

The app is a proxy architecture — React never calls GitHub directly. All requests go through the Node.js backend, which caches responses for 60 seconds to avoid hitting GitHub's rate limit and to keep sensitive tokens server-side.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend (Vercel) | _Add your Vercel URL here after deployment_ |
| Backend (Render) | _Add your Render URL here after deployment_ |

---

## Tech Stack

| Technology | Role | Why I chose it |
|------------|------|----------------|
| **React 18 + Vite** | Frontend framework | Vite's dev server is significantly faster than CRA; React hooks make state management clean |
| **Node.js + Express** | Backend server | Lightweight and fast; the assignment specified Node.js |
| **Axios** | HTTP client | Cleaner error handling than native fetch (catches non-2xx as errors automatically) |
| **Tailwind CSS** | Styling | Utility-first approach means no separate CSS files; responsive by default |
| **Recharts** | Data visualisation | React-native charting library; easy to integrate without D3 complexity |
| **In-memory cache** | Caching layer | A plain JS object with timestamps — no Redis needed, keeps setup simple |
| **dotenv** | Environment variables | Safely loads secrets (GitHub token) from a `.env` file that is never committed to Git |

---

## How to Run Locally

> Assumes you have **Node.js 18+** and **npm** installed. Nothing else required.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/github-explorer.git
cd github-explorer
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Optional: add your GitHub token to .env to increase rate limit from 60 → 5000 req/hr
npm run dev
```

Server starts at `http://localhost:5000`

Verify it's running: `http://localhost:5000/health`

### 3. Set up the frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

Open `http://localhost:5173` in your browser and search for any GitHub username (e.g. `torvalds`, `gaearon`, `sindresorhus`).

> **Note:** No need to configure the API URL in development — Vite's proxy automatically forwards `/api/*` requests to `localhost:5000`.

---

## API Documentation

Base URL (development): `http://localhost:5000`

### `GET /api/user/:username`

Fetches a GitHub user's profile and their public repositories.

**URL Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | GitHub username to look up |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number for repo pagination (30 repos per page) |

**Success Response (200):**

```json
{
  "user": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "avatar_url": "https://...",
    "bio": "...",
    "followers": 229000,
    "following": 0,
    "public_repos": 9,
    "html_url": "https://github.com/torvalds",
    "location": "Portland, OR",
    "created_at": "2011-09-03T..."
  },
  "repos": [
    {
      "id": 2325298,
      "name": "linux",
      "description": "Linux kernel source tree",
      "html_url": "https://github.com/torvalds/linux",
      "language": "C",
      "stargazers_count": 180000,
      "forks_count": 50000,
      "open_issues_count": 398,
      "default_branch": "master",
      "updated_at": "2024-03-15T...",
      "topics": ["kernel", "linux"]
    }
  ],
  "totalRepos": 9,
  "currentPage": 1,
  "hasMore": false,
  "fromCache": false
}
```

**Error Responses:**

| Status | Condition | Response body |
|--------|-----------|---------------|
| 404 | Username not found | `{ "error": "No GitHub user found with username ..." }` |
| 429 | GitHub rate limit exceeded | `{ "error": "GitHub API rate limit reached. Please wait 60 seconds..." }` |
| 500 | Network / server error | `{ "error": "Could not reach GitHub. Please check your internet connection..." }` |

---

### `GET /health`

Health check endpoint for deployment verification.

**Response (200):**
```json
{ "status": "ok", "message": "GitHub Explorer server is running!", "timestamp": "..." }
```

---

### `GET /api/cache-stats`

Development helper — shows what's currently in the in-memory cache.

**Response (200):**
```json
{ "keys": 3, "entries": ["torvalds_page1", "gaearon_page1", "sindresorhus_page1"] }
```

---

## Project Structure

```
github-explorer/
├── server/                     ← Node.js + Express backend
│   ├── index.js                  Entry point — sets up Express, middleware, routes
│   ├── cache.js                  In-memory cache module with 60s TTL
│   ├── package.json
│   ├── .env.example              Template for environment variables
│   └── routes/
│       └── github.js             GitHub API proxy route — the core of the backend
│
├── client/                     ← React frontend
│   ├── index.html                Root HTML shell
│   ├── vite.config.js            Vite config with dev proxy to backend
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx              React entry point — mounts App into #root
│       ├── index.css             Global styles + Tailwind + skeleton animation
│       ├── App.jsx               Root component — all state lives here
│       └── components/
│           ├── SearchBar.jsx     Controlled search input
│           ├── ProfileCard.jsx   User profile display (avatar, bio, stats)
│           ├── RepoList.jsx      Repo list with sort and language filter
│           ├── RepoCard.jsx      Individual repo card with expand/collapse
│           ├── LanguageChart.jsx Recharts donut chart for language breakdown
│           ├── ErrorMessage.jsx  Error display with retry button
│           └── LoadingSkeleton.jsx Shimmer loading placeholder
│
└── README.md
```

---

## Deployment Guide

### Backend → Render (free tier)

1. Push code to a public GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set **Root Directory** to `server`
5. Set **Start Command** to `node index.js`
6. Add environment variable: `GITHUB_TOKEN` = your token (optional but recommended)
7. Deploy and copy the URL (e.g. `https://github-explorer-api.onrender.com`)

### Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → Import Git Repository
2. Set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy
5. Test by searching a username from an incognito window

---

## What Works

- ✅ All Must Have requirements (search, profile display, repo list, sort, error handling)
- ✅ Server-side caching with 60s TTL
- ✅ Loading skeleton (shimmer animation)
- ✅ Pagination (Load More)
- ✅ Expand repo card for extra details
- ✅ Recently searched usernames (localStorage, persists across sessions)
- ✅ Language distribution chart (Recharts donut)
- ✅ Language filter dropdown
- ✅ Mobile responsive

## What I Would Add Next

- **Persistent cache with Redis** — the current in-memory cache clears on server restart; Redis would survive restarts
- **Rate limiting by IP** — protect the `/api/user/:username` endpoint from being abused
- **GitHub OAuth** — let users log in to view their own private repos and increase their personal rate limit
- **Debounced search-as-you-type** — search while the user types with a 300ms debounce delay
- **Unit tests** — test the cache module (get/set/TTL expiry) and the Express route error handling
- **SQLite persistence** — save search history to a database so it works across devices

---

## AI Tool Usage Disclosure

I used Claude as an AI assistant during development — primarily for syntax help when working in JavaScript (my primary language is Python) and for boilerplate like Tailwind class suggestions. Every architectural decision — the proxy pattern, the cache design, the component structure, the error handling strategy — was made by me. I can explain every line of code in this project.

---

*Built by Karan Panwar · Studio Graphene Take-Home Assignment · June 2026*
