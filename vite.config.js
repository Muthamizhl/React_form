// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/React_form/', // 👈 This is the fix!
  plugins: [react()],
});
