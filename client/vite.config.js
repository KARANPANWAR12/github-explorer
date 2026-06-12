import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is our build tool and development server for React.
// This config tells Vite how to set up the dev server.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy: when our React code calls /api/..., Vite forwards it to our Express server.
    // This means in development we don't need to worry about CORS at all.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
