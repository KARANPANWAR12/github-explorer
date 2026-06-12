// PostCSS processes our CSS — required for Tailwind to work
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Adds vendor prefixes for browser compatibility (-webkit-, etc.)
  },
};
