/**
 * App.jsx — Root Component & State Manager
 *
 * This is the "brain" of the frontend. All important data (state) lives here.
 * Child components receive data as "props" (parameters) and call functions
 * passed down from here to trigger changes.
 *
 * Data flow:  App (state lives here)
 *                ↓ passes data as props
 *            SearchBar, ProfileCard, RepoList, etc.
 *                ↓ calls functions passed as props
 *            App updates state → React re-renders UI automatically
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import RepoList from './components/RepoList';
import ErrorMessage from './components/ErrorMessage';
import LoadingSkeleton from './components/LoadingSkeleton';
import LanguageChart from './components/LanguageChart';

// In development: Vite proxy forwards /api → localhost:5000
// In production: VITE_API_URL is set to your Render backend URL (e.g. https://github-explorer-api.onrender.com)
const API_URL = import.meta.env.VITE_API_URL || '';

// GitHub icon SVG (reused in multiple places)
export const GithubIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function App() {
  // ─── STATE ─────────────────────────────────────────────────────────────────
  // useState(initialValue) returns [currentValue, functionToUpdateIt]
  // When you call the update function, React automatically re-renders the UI.

  const [user, setUser] = useState(null);         // GitHub user profile object
  const [repos, setRepos] = useState([]);          // Array of repo objects
  const [loading, setLoading] = useState(false);   // true = show skeleton
  const [error, setError] = useState(null);        // null = no error
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);   // Are there more repos on next page?
  const [loadingMore, setLoadingMore] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [lastQuery, setLastQuery] = useState('');  // Remember last searched name

  // ─── EFFECTS ────────────────────────────────────────────────────────────────
  // useEffect runs AFTER the component renders.
  // The [] dependency array means "run this only once, when the app first loads".

  useEffect(() => {
    // Load recently searched usernames from the browser's localStorage
    // localStorage persists across browser sessions (like a tiny database in the browser)
    try {
      const stored = localStorage.getItem('gh_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // If localStorage is unavailable or data is corrupted, just start fresh
      setRecentSearches([]);
    }
  }, []);

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  const saveRecentSearch = (username) => {
    // Add to front of list, remove duplicates, keep max 5
    const updated = [username, ...recentSearches.filter((u) => u !== username)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('gh_recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (username) => {
    const updated = recentSearches.filter((u) => u !== username);
    setRecentSearches(updated);
    localStorage.setItem('gh_recent_searches', JSON.stringify(updated));
  };

  // ─── MAIN SEARCH FUNCTION ───────────────────────────────────────────────────

  /**
   * handleSearch — fetches user + repos from our Express backend.
   *
   * @param {string} username  — the GitHub username to look up
   * @param {number} page      — which page of repos to fetch (default: 1)
   * @param {boolean} append   — if true, add repos to existing list (Load More)
   *                             if false, replace the current list (new search)
   */
  const handleSearch = async (username, page = 1, append = false) => {
    if (!username.trim()) return;

    // Reset state for a fresh search; set loading flags for load-more
    if (!append) {
      setLoading(true);
      setError(null);
      setUser(null);
      setRepos([]);
      setCurrentPage(1);
      setHasMore(false);
      setLastQuery(username);
    } else {
      setLoadingMore(true);
    }

    try {
      // Call our Express backend (NOT GitHub directly)
      const { data } = await axios.get(`${API_URL}/api/user/${encodeURIComponent(username)}`, {
        params: { page },
        timeout: 10000, // Timeout after 10 seconds
      });

      setUser(data.user);
      // append=true → add new repos to bottom of list (Load More)
      // append=false → replace everything (new search)
      setRepos((prev) => (append ? [...prev, ...data.repos] : data.repos));
      setHasMore(data.hasMore);
      setCurrentPage(page);

      if (!append) saveRecentSearch(username);
    } catch (err) {
      // Extract the error message our Express server sent, or use a fallback
      const message =
        err.response?.data?.error ||
        (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : 'Something went wrong. Please try again.');
      setError(message);
      if (!append) {
        setUser(null);
        setRepos([]);
      }
    } finally {
      // Always stop showing loading indicators, regardless of success or failure
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (lastQuery) handleSearch(lastQuery, currentPage + 1, true);
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  // JSX = HTML-like syntax that React turns into real DOM elements.
  // Curly braces {} = "execute JavaScript here".

  const showEmptyState = !user && !loading && !error && recentSearches.length === 0;
  const showRecentSearches = !user && !loading && !error && recentSearches.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="bg-gray-900 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 text-white mb-2">
            <GithubIcon className="w-9 h-9" />
            <h1 className="text-3xl font-bold tracking-tight">GitHub Explorer</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Search any GitHub username to explore their profile and repositories
          </p>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Search Bar */}
        <SearchBar onSearch={(u) => handleSearch(u)} loading={loading} />

        {/* Recent Searches — shown only when no results are displayed */}
        {showRecentSearches && (
          <div className="mt-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Recent</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
                >
                  <button
                    onClick={() => handleSearch(name)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {name}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(name)}
                    className="text-gray-300 hover:text-gray-500 ml-1 text-base leading-none"
                    aria-label={`Remove ${name} from recent searches`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Skeleton — animated placeholder while fetching */}
        {loading && <LoadingSkeleton />}

        {/* Error Message */}
        {error && !loading && <ErrorMessage message={error} onRetry={() => handleSearch(lastQuery)} />}

        {/* ── RESULTS ─────────────────────────────────────────────────────── */}
        {user && !loading && (
          <div className="mt-6 space-y-5">

            {/* User Profile */}
            <ProfileCard user={user} />

            {/* Language Distribution Chart (only shows if repos have language data) */}
            <LanguageChart repos={repos} />

            {/* Repository List with Sort */}
            <RepoList repos={repos} />

            {/* Load More Button (shown when GitHub has more pages) */}
            {hasMore && (
              <div className="text-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg
                             hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed
                             transition-colors shadow-sm"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    `Load More Repositories`
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-1">Showing {repos.length} of {user.public_repos} repos</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State — shown on first load before any search */}
        {showEmptyState && (
          <div className="text-center mt-20 text-gray-400 select-none">
            <GithubIcon className="w-20 h-20 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium text-gray-500">Explore any GitHub profile</p>
            <p className="text-sm mt-1">Try searching for <span className="text-blue-500 font-mono">torvalds</span>, <span className="text-blue-500 font-mono">gaearon</span>, or <span className="text-blue-500 font-mono">sindresorhus</span></p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-200 mt-8">
        Built with React + Node.js · Data from GitHub API · Karan Panwar
      </footer>
    </div>
  );
}

export default App;
