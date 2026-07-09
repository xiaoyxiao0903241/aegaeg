import js from '@eslint/js'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
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
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/web3/**',
      'src/views/dapp/web3/**',
      'src/views/dapp/auth/**',
      'src/lib/api/auth/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'thirdweb',
              message:
                'Import thirdweb only from src/web3/, src/views/dapp/web3/, or src/views/dapp/auth/.',
            },
            {
              name: 'thirdweb/react',
              message:
                'Import thirdweb only from src/web3/, src/views/dapp/web3/, or src/views/dapp/auth/.',
            },
          ],
          patterns: [
            {
              group: ['thirdweb/*'],
              message:
                'Import thirdweb only from src/web3/, src/views/dapp/web3/, or src/views/dapp/auth/.',
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
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      /* 项目内大量合法的 effect 同步 / render 期 ref 镜像；保留为 warn 避免阻塞 CI */
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
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
            '^community-stat$',
            '^dapp-(?:collapsible-body|collapsible-inner|detail-panel|panel-enter|progress-meter(?:__fill)?|scroll-fade-(?:edge(?:-top|-bottom)?|host))$',
            '^faq-(?:answer-panel(?:-inner)?|chevron)$',
            '^hero-rays(?:__.+|-.+)?$',
            '^home-popup-notice-content$',
            '^is-dark$',
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
)
