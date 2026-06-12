/**
 * cache.js — Simple In-Memory Cache with TTL (Time To Live)
 *
 * WHY THIS EXISTS:
 * GitHub only allows 60 API requests per hour without a token.
 * If 10 people search "torvalds" in one minute, we'd waste 10 requests.
 * With caching, the first search fetches from GitHub, and the next 9
 * get the answer instantly from our memory — no GitHub call needed.
 *
 * HOW IT WORKS (plain English):
 * Think of it like a notepad on your desk.
 * When someone asks about "torvalds", you write the answer + the time on the notepad.
 * Next time someone asks, you check: is the answer still on the notepad?
 * Is it less than 60 seconds old? Yes → hand them the notepad answer.
 * No / too old → go look it up fresh and update the notepad.
 */

const cache = {}; // Our "notepad" — a plain JavaScript object
const CACHE_TTL = 60 * 1000; // 60 seconds in milliseconds

/**
 * Retrieve data from cache.
 * Returns null if: key doesn't exist, OR data has expired (older than 60s).
 */
function get(key) {
  const entry = cache[key];

  // Nothing stored for this key
  if (!entry) return null;

  // Check if the data has expired
  const ageInMs = Date.now() - entry.timestamp;
  if (ageInMs > CACHE_TTL) {
    delete cache[key]; // Clean up — don't waste memory on stale data
    return null;
  }

  return entry.data; // Fresh data — return it!
}

/**
 * Store data in cache with the current timestamp.
 */
function set(key, data) {
  cache[key] = {
    data,
    timestamp: Date.now(), // Record exactly when we stored this
  };
}

/**
 * Get current cache statistics (useful for debugging).
 */
function stats() {
  return {
    keys: Object.keys(cache).length,
    entries: Object.keys(cache),
  };
}

module.exports = { get, set, stats };
