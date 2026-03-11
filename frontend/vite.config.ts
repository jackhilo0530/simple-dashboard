import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all /api requests to your Hono server
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Proxy WebSockets for Socket.io
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
      },
    },
  },
})