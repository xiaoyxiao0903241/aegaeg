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
        pathNot: '^src/views/dapp/web3/|^src/views/dapp/auth/',
      },
      to: { path: '^thirdweb' },
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
