/**
 * ErrorMessage.jsx — Error Display Component
 *
 * Shows a styled error box with the error message.
 * Also provides a "Try Again" button that calls the onRetry function
 * passed down from App.jsx — so the user doesn't have to retype the username.
 *
 * This is a "dumb" component — it receives everything it needs as props
 * and never manages its own data or makes API calls.
 */

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
    >
      {/* Warning icon */}
      <span className="text-red-400 text-xl flex-shrink-0 mt-0.5" aria-hidden="true">
        ⚠️
      </span>

      <div className="flex-1">
        <p className="text-red-700 font-semibold text-sm">Search failed</p>
        {/* The actual error message from our Express server */}
        <p className="text-red-600 text-sm mt-0.5 leading-relaxed">{message}</p>

        {/* Retry button — calls App's handleSearch with the last query */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-red-600 underline hover:text-red-800 font-medium"
          >
            Try again →
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
