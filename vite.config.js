import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // '/' for bhumaji.com; set BASE_PATH=/<repo>/ for a GitHub project page.
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    // The built pages get their full <head> from scripts/prerender.mjs; the dev server just needs a title.
    {
      name: 'dev-head',
      apply: 'serve',
      transformIndexHtml: (html) => html.replace('<!--app-head-->', '<title>Bhumaji Systems</title>'),
    },
  ],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
  },
});
