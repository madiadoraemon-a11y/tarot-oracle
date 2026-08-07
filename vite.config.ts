import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tarot-oracle/',
  build: {
    outDir: 'docs',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://tarot-reading-api.tarot-reading-api.workers.dev',
        changeOrigin: true,
      },
    },
  },
});
