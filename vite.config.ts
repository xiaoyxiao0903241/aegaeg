import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'app.html'),
        'en-app': resolve(__dirname, 'en/app.html'),
        'en-home': resolve(__dirname, 'en/index.html'),
        index: resolve(__dirname, 'index.html'),
        'zh-app': resolve(__dirname, 'zh/app.html'),
        'zh-home': resolve(__dirname, 'zh/index.html'),
      },
    },
  },
  optimizeDeps: {
    include: ['thirdweb', 'thirdweb/react', 'thirdweb/wallets'],
  },
  plugins: [react(), tailwindcss()],
})
