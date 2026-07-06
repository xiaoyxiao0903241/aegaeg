import js from '@eslint/js'
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
      ...reactHooks.configs.recommended.rules,
      /* 项目内大量合法的 effect 同步 / render 期 ref 镜像；保留为 warn 避免阻塞 CI */
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
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
