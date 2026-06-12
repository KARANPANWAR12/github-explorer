/**
 * index.js — Express Server Entry Point
 *
 * This is the main file that starts our backend server.
 * Think of it as the "front door" of our backend application.
 *
 * Flow: React App → Our Express Server → GitHub API
 *                ↑ (This file sets up the server)
 */

require('dotenv').config(); // Load .env file variables into process.env
const express = require('express');
const cors = require('cors');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
// Middleware = code that runs on EVERY request before it reaches a route

/**
 * CORS (Cross-Origin Resource Sharing)
 * Without this, browsers BLOCK our React app (localhost:5173) from
 * calling our server (localhost:5000) — they're on different "origins".
 * cors() tells the browser: "Yes, this server allows requests from other origins."
 */
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // In production, restrict to your Vercel URL
  methods: ['GET'],                       // We only need GET for this app
};
app.use(cors(corsOptions));

/**
 * JSON Body Parser
 * Automatically parses incoming JSON request bodies.
 * So we can do req.body.username instead of manually parsing raw text.
 */
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// Mount all GitHub-related routes under /api
// So /api/user/:username, /api/cache-stats, etc.
app.use('/api', githubRoutes);

/**
 * Health Check Route
 * Used to verify the server is running — especially useful after deployment.
 * Render.com and Railway also use this to check if the app is alive.
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GitHub Explorer server is running!',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 Handler — catch-all for any route that doesn't exist
 */
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

/**
 * Global Error Handler — catches any unhandled errors in routes
 */
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({ error: 'An unexpected error occurred on the server.' });
});

// ─── START SERVER ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 GitHub token: ${process.env.GITHUB_TOKEN ? 'Provided (5000 req/hr)' : 'Not set (60 req/hr)'}\n`);
});
