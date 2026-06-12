/**
 * routes/github.js — GitHub API Proxy Routes
 *
 * WHY IS THIS A PROXY? (Important — they will ask this in interview)
 * Instead of React calling GitHub directly, React calls OUR server,
 * and our server calls GitHub. Two reasons:
 *
 * 1. SECURITY: If we stored a GitHub API token in React, anyone could
 *    open DevTools → Network tab and steal it. On the server, it stays hidden.
 *
 * 2. CACHING: We can store results for 60 seconds. A browser cache only
 *    helps one user. Our server cache helps ALL users simultaneously.
 */

const express = require('express');
const axios = require('axios');
const cache = require('../cache');

const router = express.Router();

/**
 * Build request headers for GitHub API.
 * Adding a token increases rate limit from 60/hr to 5000/hr.
 */
function buildHeaders() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Explorer-App', // GitHub requires a User-Agent header
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * GET /api/user/:username?page=1
 *
 * Fetches a GitHub user's profile AND their repos in one single request.
 * Uses Promise.all to make both calls simultaneously (faster than one-by-one).
 *
 * Query params:
 *   page (optional, default 1) — for pagination (GitHub returns 30 repos per page)
 */
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page) || 1;
  const PER_PAGE = 30;

  // Build a unique cache key: "torvalds_page1", "torvalds_page2", etc.
  const cacheKey = `${username.toLowerCase()}_page${page}`;

  // --- STEP 1: Check cache first ---
  const cached = cache.get(cacheKey);
  if (cached) {
    // Data found in cache and still fresh — return it immediately!
    return res.json({ ...cached, fromCache: true });
  }

  // --- STEP 2: Cache miss — fetch from GitHub ---
  try {
    const headers = buildHeaders();

    // Make BOTH API calls at the same time using Promise.all
    // This is ~2x faster than awaiting them one after the other
    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(
        `https://api.github.com/users/${username}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`,
        { headers }
      ),
    ]);

    const responseData = {
      user: userRes.data,
      repos: reposRes.data,
      totalRepos: userRes.data.public_repos,
      currentPage: page,
      // If GitHub returned a full page (30 repos), there might be more
      hasMore: reposRes.data.length === PER_PAGE,
    };

    // --- STEP 3: Save to cache for next 60 seconds ---
    cache.set(cacheKey, responseData);

    // Send response (fromCache: false = this came fresh from GitHub)
    return res.json({ ...responseData, fromCache: false });
  } catch (error) {
    // --- STEP 4: Handle specific GitHub API errors gracefully ---

    if (error.response) {
      const status = error.response.status;

      // 404 = Username doesn't exist on GitHub
      if (status === 404) {
        return res.status(404).json({
          error: `No GitHub user found with username "${username}". Please check the spelling.`,
        });
      }

      // 403 = Rate limit exceeded (too many requests)
      if (status === 403) {
        return res.status(429).json({
          error: 'GitHub API rate limit reached. Please wait 60 seconds and try again.',
        });
      }

      // 422 = Unprocessable — invalid username format
      if (status === 422) {
        return res.status(422).json({
          error: 'Invalid username. GitHub usernames can only contain letters, numbers, and hyphens.',
        });
      }
    }

    // Network error / timeout / something unexpected
    console.error(`[GitHub API Error] ${error.message}`);
    return res.status(500).json({
      error: 'Could not reach GitHub. Please check your internet connection and try again.',
    });
  }
});

/**
 * GET /api/cache-stats
 * Development helper — see what's currently in the cache.
 * Remove this in a real production app.
 */
router.get('/cache-stats', (req, res) => {
  const { stats } = require('../cache');
  res.json(stats());
});

module.exports = router;
