import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://sunuideeopenrouter.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
});