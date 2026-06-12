/**
 * LanguageChart.jsx — Language Distribution Pie Chart
 *
 * BONUS FEATURE — shows which languages this GitHub user uses most.
 *
 * Uses Recharts library (recharts.org) — a React charting library
 * built on top of D3.js but much easier to use.
 *
 * How we build the chart data:
 *   repos = [{ language: "Python" }, { language: "Python" }, { language: "JS" }]
 *   → count occurrences using .reduce()
 *   → [{ name: "Python", value: 2 }, { name: "JS", value: 1 }]
 *   → pass to Recharts PieChart
 */

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Distinct, accessible colors for up to 8 languages
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

function LanguageChart({ repos }) {
  // Count how many repos use each language
  // .reduce() starts with an empty object {} and adds to it for each repo
  const counts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert { Python: 5, JS: 3 } → [{ name: "Python", value: 5 }, ...]
  // Then sort by count descending and take top 8
  const data = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Don't render the chart if there's no language data at all
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Custom tooltip — shown when user hovers over a slice
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-gray-500">{value} repos ({Math.round((value / total) * 100)}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-800 mb-1">Language Distribution</h3>
      <p className="text-xs text-gray-400 mb-4">Based on {repos.length} loaded repositories</p>

      {/* ResponsiveContainer makes the chart resize with the screen */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}   // Donut hole — makes it look cleaner
            outerRadius={90}
            paddingAngle={2}   // Small gap between slices
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LanguageChart;
