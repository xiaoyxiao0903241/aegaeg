/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'core-is-pure',
      severity: 'error',
      from: { path: '^src/core/' },
      to: {
        path: '^(react|react-dom|thirdweb|viem|@tanstack|zustand|src/views|src/shared|src/app)',
        pathNot: '^src/core/',
      },
    },
    {
      name: 'shared-no-views',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/(views|core)/' },
    },
    {
      name: 'shared-no-app',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'web3-gateway',
      severity: 'error',
      from: {
        path: '^src/',
        pathNot: '^src/web3/|^src/views/dapp/auth/',
      },
      to: { path: '^thirdweb' },
    },
    {
      name: 'stores-no-views',
      severity: 'error',
      from: { path: '^src/stores/' },
      to: { path: '^src/views/' },
    },
    {
      name: 'hooks-no-views',
      severity: 'error',
      from: { path: '^src/hooks/' },
      to: { path: '^src/views/' },
    },
    {
      name: 'home-no-web3',
      severity: 'error',
      from: { path: '^src/views/home/' },
      to: { path: '(^src/web3/|^thirdweb|^viem)' },
    },
    {
      name: 'ui-is-dumb',
      severity: 'warn',
      from: { path: '^src/shared/ui/' },
      to: { path: '^src/(views|core|app)/' },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.app.json' },
  },
}
