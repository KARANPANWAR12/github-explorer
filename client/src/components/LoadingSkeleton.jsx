/**
 * LoadingSkeleton.jsx — Loading Placeholder Component
 *
 * Shows an animated "skeleton" UI while data is being fetched.
 * This is much better UX than just showing a spinner —
 * the user can see the shape of the content before it loads.
 *
 * The shimmer animation is defined in index.css as the .skeleton class.
 * It creates a sweeping light effect to indicate the page is loading.
 */

// A single skeleton "block" with configurable size
const Block = ({ className }) => (
  <div className={`skeleton rounded ${className}`} />
);

function LoadingSkeleton() {
  return (
    <div className="mt-6 space-y-4" aria-busy="true" aria-label="Loading GitHub profile">

      {/* Profile Card Skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex gap-5">
          {/* Avatar placeholder */}
          <Block className="w-24 h-24 rounded-full flex-shrink-0" />
          {/* Text placeholders */}
          <div className="flex-1 space-y-3 pt-2">
            <Block className="h-6 w-1/3" />
            <Block className="h-3 w-1/4" />
            <Block className="h-3 w-3/4" />
            <Block className="h-3 w-1/2" />
          </div>
        </div>
        {/* Stats row placeholder */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Block className="h-7 w-12 mx-auto" />
              <Block className="h-2.5 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <Block className="h-4 w-40 mb-4" />
        <Block className="h-44 w-full rounded-lg" />
      </div>

      {/* Repo Card Skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
          <Block className="h-4 w-1/3 mb-2" />
          <Block className="h-3 w-2/3 mb-1" />
          <Block className="h-3 w-1/2 mb-3" />
          <div className="flex gap-3">
            <Block className="h-3 w-20" />
            <Block className="h-3 w-12" />
            <Block className="h-3 w-12" />
            <Block className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
