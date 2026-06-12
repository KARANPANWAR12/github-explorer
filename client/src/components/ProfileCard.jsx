/**
 * ProfileCard.jsx — GitHub User Profile Display
 *
 * A pure "display" component — it only shows data, never fetches or changes anything.
 * Receives a `user` object (from GitHub API) as a prop and renders it.
 *
 * GitHub user object has fields like:
 *   user.avatar_url, user.name, user.login, user.bio, user.location,
 *   user.followers, user.following, user.public_repos, user.html_url, user.blog
 */

function ProfileCard({ user }) {
  // Format large numbers nicely: 1200 → "1.2k"
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  // Ensure external links have a protocol
  const formatBlogUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  // Format join date: "2011-10-08T..." → "October 2011"
  const formatJoinDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Top gradient bar — decorative accent */}
      <div className="h-1.5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-300" />

      <div className="p-6">
        {/* Avatar + Name row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Profile picture */}
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            <img
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-md hover:opacity-90 transition-opacity"
            />
          </a>

          {/* User details */}
          <div className="flex-1 text-center sm:text-left">
            {/* Display name (falls back to username if name not set) */}
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {user.name || user.login}
            </h2>

            {/* @username link to actual GitHub profile */}
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm font-mono hover:underline"
            >
              @{user.login}
            </a>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-md">{user.bio}</p>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-2">
              {user.location && (
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  📍 {user.location}
                </span>
              )}
              {user.company && (
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  🏢 {user.company.replace('@', '')}
                </span>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline flex items-center gap-1"
                >
                  🐦 @{user.twitter_username}
                </a>
              )}
              {user.blog && (
                <a
                  href={formatBlogUrl(user.blog)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline flex items-center gap-1"
                >
                  🔗 Website
                </a>
              )}
              {user.created_at && (
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  📅 Joined {formatJoinDate(user.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row — followers / following / repos */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
          {[
            { label: 'Followers', value: formatNumber(user.followers) },
            { label: 'Following', value: formatNumber(user.following) },
            { label: 'Public Repos', value: formatNumber(user.public_repos) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
