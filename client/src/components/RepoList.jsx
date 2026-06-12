/**
 * RepoList.jsx — Repository List with Sorting
 *
 * Receives the full repos array from App.jsx.
 * Handles sorting locally (no API call needed — data is already fetched).
 * Renders one RepoCard per repo.
 *
 * Sorting happens with JavaScript's Array.sort():
 *   - Stars: compare b.stars - a.stars (descending — most stars first)
 *   - Name: alphabetical using localeCompare()
 *   - Updated: compare dates (most recently updated first)
 */

import { useState } from 'react';
import RepoCard from './RepoCard';

// Sort options with emoji labels for the dropdown
const SORT_OPTIONS = [
  { value: 'stars',   label: '⭐ Stars' },
  { value: 'updated', label: '🕒 Last Updated' },
  { value: 'name',    label: '🔤 Name' },
  { value: 'forks',   label: '🍴 Forks' },
];

function RepoList({ repos }) {
  const [sortBy, setSortBy] = useState('stars');   // Default: sort by stars
  const [filterLang, setFilterLang] = useState(''); // Filter by language

  // Get unique languages from repos for the filter dropdown
  const languages = ['', ...new Set(repos.map((r) => r.language).filter(Boolean)).values()];

  // Sort the repos — spread to avoid mutating the original array
  const sorted = [...repos]
    .filter((r) => !filterLang || r.language === filterLang)
    .sort((a, b) => {
      if (sortBy === 'stars')   return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks')   return b.forks_count - a.forks_count;
      if (sortBy === 'name')    return a.name.localeCompare(b.name);
      if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
      return 0;
    });

  if (repos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-4xl mb-2">📭</p>
        <p className="font-medium">No public repositories found.</p>
      </div>
    );
  }

  return (
    <section>
      {/* Header row: title + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Repositories{' '}
          <span className="text-gray-400 font-normal text-sm">
            ({sorted.length}{repos.length !== sorted.length ? ` of ${repos.length}` : ''} shown)
          </span>
        </h3>

        <div className="flex gap-2 flex-wrap">
          {/* Language filter */}
          {languages.length > 1 && (
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white
                         focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
              aria-label="Filter by language"
            >
              <option value="">All Languages</option>
              {languages.filter(Boolean).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white
                       focus:outline-none focus:ring-2 focus:ring-gray-800 text-gray-700"
            aria-label="Sort repositories"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty filter state */}
      {sorted.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">
          No repositories found for the selected language.
        </div>
      )}

      {/* Repo cards list */}
      <div className="space-y-3">
        {sorted.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}

export default RepoList;
