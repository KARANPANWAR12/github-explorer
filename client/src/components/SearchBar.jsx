/**
 * SearchBar.jsx — Search Input Component
 *
 * This is a "controlled component" — React controls the input's value.
 * Every keypress updates state, and state updates the input display.
 * This is different from native HTML where the DOM manages the value itself.
 *
 * Props received from App.jsx:
 *   onSearch(username) — function to call when user submits a search
 *   loading            — boolean; disables input while a search is in progress
 */

import { useState } from 'react';

function SearchBar({ onSearch, loading }) {
  // Local state for just this component — only the typed value
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) onSearch(trimmed); // Call parent's search function
  };

  // Allow pressing Enter to trigger search (better UX)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="flex gap-2 w-full">
      {/* Controlled text input — value is always in sync with React state */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}  // Update state on every keypress
        onKeyDown={handleKeyDown}
        placeholder="Search GitHub username…  e.g. torvalds"
        disabled={loading}
        className="
          flex-1 px-4 py-3 text-sm
          bg-white border border-gray-300 rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent
          disabled:bg-gray-100 disabled:text-gray-400
          transition-shadow placeholder-gray-400
        "
        aria-label="GitHub username"
      />

      {/* Search Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !inputValue.trim()}
        className="
          px-5 py-3 text-sm font-semibold
          bg-gray-900 text-white rounded-lg shadow-sm
          hover:bg-gray-700 active:bg-gray-800
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors min-w-[100px]
        "
      >
        {loading ? (
          // Animated spinner while searching
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Searching
          </span>
        ) : (
          'Search'
        )}
      </button>
    </div>
  );
}

export default SearchBar;
