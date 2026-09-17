import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    rolldownOptions: {
      input: { main: 'index.html', scroll: 'scroll/index.html', static: 'static/index.html', white: 'white/index.html' },
    },
  },
});
