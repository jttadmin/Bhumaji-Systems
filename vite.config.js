import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // '/' for bhumaji.com; set BASE_PATH=/<repo>/ for a GitHub project page.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
  },
});
