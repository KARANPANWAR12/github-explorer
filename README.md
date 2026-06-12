# GitHub Explorer

A full-stack web application that allows users to search any GitHub username and instantly explore their public profile, repositories, and language statistics.

Built as a take-home assignment for the Studio Graphene Associate Software Engineer role.

The application follows a proxy architecture where the React frontend never communicates directly with the GitHub API. All requests pass through a Node.js + Express backend that handles caching, rate-limit protection, and API aggregation.

---

# Live Deployment

| Service           | URL                                              |
| ----------------- | ------------------------------------------------ |
| Frontend (Vercel) | https://github-explorer-eta-two.vercel.app       |
| Backend (Render)  | https://github-explorer-01nb.onrender.com        |
| GitHub Repository | https://github.com/KARANPANWAR12/github-explorer |

---

# Features

* Search any GitHub user
* View profile information
* View public repositories
* Sort repositories
* Filter repositories by language
* Language distribution chart
* Recently searched usernames
* Server-side caching
* Responsive UI
* Loading skeletons
* Error handling
* Pagination support

---

# Tech Stack

| Technology        | Purpose                  |
| ----------------- | ------------------------ |
| React 18 + Vite   | Frontend                 |
| Node.js + Express | Backend                  |
| Axios             | API requests             |
| Tailwind CSS      | Styling                  |
| Recharts          | Data visualization       |
| dotenv            | Environment variables    |
| In-Memory Cache   | Performance optimization |

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/KARANPANWAR12/github-explorer.git
cd github-explorer
```

## Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# API Endpoints

## Get User Profile & Repositories

```http
GET /api/user/:username
```

Example:

```http
GET /api/user/torvalds
```

### Success Response

```json
{
  "user": {},
  "repos": [],
  "totalRepos": 12,
  "currentPage": 1,
  "hasMore": false,
  "fromCache": false
}
```

### Error Responses

| Status | Description           |
| ------ | --------------------- |
| 404    | User not found        |
| 429    | Rate limit exceeded   |
| 500    | Internal server error |

---

## Cache Statistics

```http
GET /api/cache-stats
```

Returns current cache entries and statistics.

---

# Project Structure

```text
github-explorer/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── routes/
│   │   └── github.js
│   ├── cache.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# Deployment

## Backend (Render)

* Root Directory: `server`
* Build Command: `npm install`
* Start Command: `node index.js`

Live Backend:

https://github-explorer-01nb.onrender.com

## Frontend (Vercel)

* Root Directory: `client`
* Framework: Vite

Environment Variable:

```env
VITE_API_URL=https://github-explorer-01nb.onrender.com
```

Live Frontend:

https://github-explorer-eta-two.vercel.app

---

# Future Improvements

* Redis-based persistent caching
* GitHub OAuth authentication
* Search debouncing
* Unit testing
* Database-backed search history
* Rate limiting by IP

---

# AI Usage Disclosure

AI tools were used for syntax assistance, documentation refinement, and development productivity. All architectural decisions, implementation logic, application structure, deployment setup, and feature design were completed and understood by the developer.

---

Built by **Karan Panwar**
Studio Graphene Take-Home Assignment • 2026
