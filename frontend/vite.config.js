// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    'process.env': process.env,
  },
server: {
    host: '0.0.0.0', // Allow access from outside the container
    port: 5173,      // Ensure port matches the one being exposed
  },
});
