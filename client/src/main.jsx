/**
 * main.jsx — React Application Entry Point
 *
 * This is the first file React runs. It "mounts" our App component
 * into the <div id="root"> in index.html.
 * Think of it as plugging the TV into the wall socket.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global styles including Tailwind
import App from './App';

createRoot(document.getElementById('root')).render(
  // StrictMode helps catch potential bugs during development
  // It renders components twice in dev mode to surface side-effect issues
  <StrictMode>
    <App />
  </StrictMode>
);
