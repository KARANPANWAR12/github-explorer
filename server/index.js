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

const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET'],
};
app.use(cors(corsOptions));
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────

app.use('/api', githubRoutes);

/**
 * Root Route
 * This is what shows when someone visits the backend URL directly.
 * Example: https://github-explorer-01nb.onrender.com/
 */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 GitHub Explorer API is live and running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      user: '/api/user/:username'
    }
  });
});

/**
 * Health Check Route
 * Used to verify the server is running — especially useful after deployment.
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