import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const locales = ['en', 'zh', 'zh-tw', 'ko', 'ja', 'vi', 'es', 'ru'] as const

const localeEntries = Object.fromEntries(
  locales.flatMap((locale) => [
    [`${locale}-app`, resolve(__dirname, `${locale}/app.html`)],
    [`${locale}-home`, resolve(__dirname, `${locale}/index.html`)],
  ]),
)

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
        index: resolve(__dirname, 'index.html'),
        ...localeEntries,
      },
    },
  },
  optimizeDeps: {
    include: ['thirdweb', 'thirdweb/react', 'thirdweb/wallets'],
  },
  plugins: [react(), tailwindcss()],
})
