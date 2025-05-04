import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5000', // Replace with your Flask API URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      }
    }
  }
})