import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND_TARGET = process.env.VITE_BACKEND_PROXY || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/resume': { target: BACKEND_TARGET, changeOrigin: true },
      '/ai': { target: BACKEND_TARGET, changeOrigin: true },
      '/api': { target: BACKEND_TARGET, changeOrigin: true },
      '/platform': { target: BACKEND_TARGET, changeOrigin: true },
      '/analytics': { target: BACKEND_TARGET, changeOrigin: true },
    },
  },
})
