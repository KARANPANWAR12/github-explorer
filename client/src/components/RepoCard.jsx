/**
 * RepoCard.jsx — Individual Repository Card
 *
 * Shows a repo's key info at a glance.
 * Clicking the card "expands" it to show extra details.
 * This is controlled with a local `expanded` state — no API call needed,
 * because GitHub already sent us all the extra data we need.
 *
 * Demonstrates:
 *   - Local component state (useState)
 *   - Conditional rendering (show details only when expanded)
 *   - Language color badges (like GitHub's own UI)
 */

import { useState } from 'react';

// GitHub-style language color map
// These are the actual colors GitHub uses for each language
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  'C++':      '#f34b7d',
  C:          '#555555',
  'C#':       '#178600',
  CSS:        '#563d7c',
  HTML:       '#e34c26',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Ruby:       '#701516',
  PHP:        '#4F5D95',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
  Dart:       '#00B4AB',
  Shell:      '#89e051',
  Scala:      '#c22d40',
  R:          '#198CE7',
  Vue:        '#41b883',
  default:    '#8b949e',
};

function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false); // Is the detail panel open?

  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;

  // Format a date like "2024-03-15T..." → "15 Mar 2024"
  const formatDate = (str) =>
    new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Shorten large numbers: 12345 → "12.3k"
  const shortNum = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n));

  // Format repo size: KB or MB
  const formatSize = (kb) => (kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB');

  return (
    <article className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">

      {/* ── Collapsed view (always visible) ───────────────────────── */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={() => setExpanded((prev) => !prev)} // Toggle expanded state
        role="button"
        aria-expanded={expanded}
        aria-label={`${repo.name} — click to ${expanded ? 'collapse' : 'expand'} details`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">

            {/* Repo name + badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Stop click propagation so link click doesn't also toggle expand */}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                {repo.name}
              </a>
              {repo.fork && (
                <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-full">
                  fork
                </span>
              )}
              {repo.archived && (
                <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 px-1.5 py-0.5 rounded-full">
                  archived
                </span>
              )}
            </div>

            {/* Description */}
            {repo.description && (
              <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
                {repo.description}
              </p>
            )}

            {/* Topic tags */}
            {repo.topics?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {repo.topics.slice(0, 4).map((t) => (
                  <span key={t} className="bg-blue-50 text-blue-600 text-xs px-1.5 py-0.5 rounded-full border border-blue-100">
                    {t}
                  </span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="text-gray-400 text-xs">+{repo.topics.length - 4} more</span>
                )}
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {repo.language && (
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: langColor }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                ⭐ {shortNum(repo.stargazers_count)}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                🍴 {shortNum(repo.forks_count)}
              </span>
              <span className="text-xs text-gray-400">
                Updated {formatDate(repo.updated_at)}
              </span>
            </div>
          </div>

          {/* Expand/collapse arrow — rotates when expanded */}
          <span
            className={`text-gray-300 text-sm transition-transform duration-200 flex-shrink-0 mt-0.5 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* ── Expanded detail panel ──────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 rounded-b-xl px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs">
            {[
              { label: 'Default Branch', value: <span className="font-mono">{repo.default_branch}</span> },
              { label: 'Open Issues', value: repo.open_issues_count },
              { label: 'Watchers', value: shortNum(repo.watchers_count) },
              { label: 'License', value: repo.license?.spdx_id || repo.license?.name || 'None' },
              { label: 'Size', value: formatSize(repo.size) },
              { label: 'Created', value: formatDate(repo.created_at) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-gray-400 uppercase tracking-wider font-semibold mb-0.5 text-[10px]">{label}</p>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>

          {/* View on GitHub CTA */}
          <div className="mt-4 flex gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white
                         px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              View on GitHub →
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-white text-gray-700 border border-gray-300
                           px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                🔗 Live Demo
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default RepoCard;
