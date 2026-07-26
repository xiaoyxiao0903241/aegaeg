import legacy from '@vitejs/plugin-legacy'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { flattenCssCascadeLayersPlugin } from './vite-plugins/flatten-css-cascade-layers'
import { viewportUnitFallbacksPlugin } from './vite-plugins/viewport-unit-fallbacks'

/** Inline boot polyfill must parse before plugin-legacy module polyfills in <head>. */
function legacyBootFirstPlugin(): Plugin {
  return {
    name: 'aegis-legacy-boot-first',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const bootMatch = html.match(/<script>try\{if\('scrollRestoration'[\s\S]*?__patchPerfLists[\s\S]*?\}<\/script>/)
        if (!bootMatch) return html
        const boot = bootMatch[0]
        return html.replace(boot, '').replace('<head>', `<head>\n    ${boot}`)
      },
    },
  }
}

const locales = ['en', 'zh', 'zht', 'id', 'ko', 'ja', 'vi', 'es', 'tr', 'ru', 'hi', 'th'] as const

const localeEntries = Object.fromEntries(
  locales.flatMap((locale) => [
    [`${locale}-app`, resolve(__dirname, `${locale}/app.html`)],
    [`${locale}-home`, resolve(__dirname, `${locale}/index.html`)],
  ]),
)

/** JS 兼容目标 — 与 cssTargets / Huawei·Vivo Chromium 90~110 对齐 */
const legacyBrowserTargets = ['chrome >= 90', 'Android >= 90']

/**
 * CSS 兼容目标：Huawei/Vivo 等国产浏览器内核常见为 Chromium 90~110，
 * 不支持 oklch()（Chrome 111+）与媒体查询范围语法 width >= / <（Chrome 104+）。
 * lightningcss 按此目标降级：oklch → hex 回退 + @supports 渐进增强。
 * 断点变体（`dapp` / `max-dapp` / `max-tablet` / `tablet` / `max-narrow`）由
 * `legacy-breakpoints.css` @custom-variant 强制经典 min-/max-width（修 `not all and`）。
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
    target: 'chrome90',
    // 最终 minify 阶段以 cssTarget 为准（会覆盖 css.lightningcss.targets），须与 cssTargets 一致。
    cssTarget: ['chrome90', 'safari14', 'ios14', 'firefox90'],
    modulePreload: false,
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'app.html'),
        index: resolve(__dirname, 'index.html'),
        ...localeEntries,
      },
      output: {
        /**
         * Prefer several parallel vendor chunks over one opaque shared bag.
         * Match `/node_modules/<pkg>/` only — never substring `/react/` inside other packages.
         *
         * thirdweb/viem: do not add here. Named chunks absorb shared deps; Home then
         * sync-loads ~3.5MB via LocalizedErrorBoundary. codeSplitting +
         * includeDependenciesRecursively:false keeps Home clean but inflates DApp
         * sync (~1.6MB→~4.6MB) by collapsing thirdweb async splits. Debt:
         * docs/homepage-architecture.md (S6).
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          const path = id.replaceAll('\\', '/')

          if (path.includes('/node_modules/react-dom/')) return 'react-dom'
          if (path.includes('/node_modules/react/')) return 'react'
          if (path.includes('/node_modules/@tanstack/react-query/')) return 'query'
          if (path.includes('/node_modules/@radix-ui/')) return 'radix'
          if (path.includes('/node_modules/lucide-react/')) return 'lucide'
          if (
            path.includes('/node_modules/tailwind-variants/') ||
            path.includes('/node_modules/clsx/') ||
            path.includes('/node_modules/tailwind-merge/')
          ) {
            return 'tv'
          }
          if (path.includes('/node_modules/sonner/')) return 'sonner'
          return
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'thirdweb',
      'thirdweb/react',
      'thirdweb/wallets',
      '@tanstack/react-query',
      'core-js/features/object/has-own',
      'core-js/features/array/at',
      'core-js/features/string/at',
    ],
  },
  plugins: [
    react(),
    // React Compiler — full mode after Chrome90 build smoke (docs/react-runtime.md).
    // Must not share a PR with auth/home-reveal/blind memo deletion.
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    flattenCssCascadeLayersPlugin(),
    // lightningcss does not rewrite dvh→vh (chrome90); inject classic fallbacks post-build.
    viewportUnitFallbacksPlugin(),
    legacyBootFirstPlugin(),
    legacy({
      targets: legacyBrowserTargets,
      // Chrome 90+ 支持原生 ESM；modern chunk + polyfills 即可，无需 SystemJS legacy chunk
      modernTargets: legacyBrowserTargets,
      modernPolyfills: ['es.object.has-own', 'es.array.at'],
      renderLegacyChunks: false,
    }),
  ],
}))
