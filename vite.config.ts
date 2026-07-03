import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const locales = ['en', 'zh', 'zht', 'id', 'ko', 'ja', 'vi', 'es', 'ru', 'hi', 'tr'] as const

const localeEntries = Object.fromEntries(
  locales.flatMap((locale) => [
    [`${locale}-app`, resolve(__dirname, `${locale}/app.html`)],
    [`${locale}-home`, resolve(__dirname, `${locale}/index.html`)],
  ]),
)

/**
 * CSS 兼容目标：Huawei/Vivo 等国产浏览器内核常见为 Chromium 90~110，
 * 不支持 oklch()（Chrome 111+）与媒体查询范围语法 width >= / <（Chrome 104+）。
 * lightningcss 按此目标降级：oklch → hex 回退 + @supports 渐进增强。
 * `max-dapp` / `dapp` 变体由 `legacy-breakpoints.css` 强制经典 min-/max-width（修 `not all and`）。
 */
const cssTargets = {
  chrome: 90 << 16,
  android: 90 << 16,
  safari: 14 << 16,
  firefox: 90 << 16,
}

export default defineConfig(({ command }) => ({
  css:
    command === 'build'
      ? {
          transformer: 'lightningcss',
          lightningcss: {
            targets: cssTargets,
          },
        }
      : undefined,
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@tanstack/react-query': resolve(__dirname, 'node_modules/@tanstack/react-query'),
    },
    dedupe: ['@tanstack/react-query', 'react', 'react-dom'],
  },
  build: {
    // 最终 minify 阶段以 cssTarget 为准（会覆盖 css.lightningcss.targets），须与 cssTargets 一致。
    // esbuild 目标名不含 android；安卓系浏览器按 chrome 内核版本覆盖。
    cssTarget: ['chrome90', 'safari14', 'ios14', 'firefox90'],
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
    include: [
      'thirdweb',
      'thirdweb/react',
      'thirdweb/wallets',
      '@tanstack/react-query',
    ],
  },
  plugins: [react(), tailwindcss()],
}))
