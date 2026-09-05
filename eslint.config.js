import js from '@eslint/js'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      '.codegraph/**',
      'tmp/**',
      'docs/figma-export/**',
      '.scratch/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/web3/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'thirdweb',
              message: 'Import thirdweb only from src/web3/.',
            },
            {
              name: 'thirdweb/react',
              message: 'Import thirdweb only from src/web3/.',
            },
          ],
          patterns: [
            {
              group: ['thirdweb/*'],
              message: 'Import thirdweb only from src/web3/.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      /* S8: exhaustive-deps 已清零 → error；set-state-in-effect / refs 仍有登记债 → warn */
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      /* Compiler：违反 Rules of React → 该组件/hook 不会被优化；进 lint:src --quiet */
      'react-compiler/react-compiler': 'error',
      /*
       * Project co-locates tv()/helpers with components (intentional).
       * Fast Refresh purity is not a gate — off globally.
       */
      'react-refresh/only-export-components': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^node:'], ['^@?\\w'], ['^~/', '^@/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  /*
   * set-state-in-effect stays warn globally (see react-hooks block above).
   * Per-file debt allowlist cleared — do not reintroduce overrides.
   */
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    extends: [eslintPluginBetterTailwindcss.configs['recommended-warn']],
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/shared/styles/app.css',
        detectComponentClasses: true,
      },
    },
    rules: {
      /* 排序 / 换行交给 prettier-plugin-tailwindcss */
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      /*
       * canonical 已覆盖 shorthand / important 位置 / var 语法；关掉避免重复报。
       * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/rules/enforce-canonical-classes.md
       */
      'better-tailwindcss/enforce-shorthand-classes': 'off',
      'better-tailwindcss/enforce-consistent-important-position': 'off',
      'better-tailwindcss/enforce-consistent-variable-syntax': 'off',
      /* 主规则：与 IntelliSense suggestCanonicalClasses 同源（TW canonicalize API） */
      'better-tailwindcss/enforce-canonical-classes': 'warn',
      'better-tailwindcss/no-deprecated-classes': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'warn',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      /* 正确性：先 warn；项目 CSS / thirdweb / 动效壳 class 进 ignore */
      'better-tailwindcss/no-unknown-classes': [
        'warn',
        {
          ignore: [
            '^aegis(?:-.+)?$',
            '^app-toaster$',
            '^collapse-chevron$',
            '^community-stat$',
            '^dapp-(?:collapsible-body|collapsible-inner|content-fade|detail-panel|panel-enter|progress-meter(?:__fill)?|scroll-fade-(?:edge(?:-top|-bottom)?|host)|subview-layer(?:-.+)?)$',
            '^duration-dapp-(?:fast|base|emphasis)$',
            '^faq-(?:answer-panel(?:-inner)?|chevron)$',
            '^hero-rays(?:__.+|-.+)?$',
            '^popup-notice-content$',
            '^is-dark$',
            '^network-pill-wrong-breathe$',
            '^onboarding-highlight-hit$',
            '^swap-view-layer(?:-.+)?$',
            '^tw(?:-.+)?$',
            '^embla(?:-.+)?$',
            '^sonner(?:-.+)?$',
          ],
        },
      ],
      'better-tailwindcss/no-conflicting-classes': 'warn',
    },
  },
  {
    files: ['tests/**/*.mjs', 'scripts/**/*.mjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // WebBridge page.evaluate 注入脚本：浏览器全局
    files: ['scripts/ui-leaf-a5-measure/profiles/**/*.page.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
)
