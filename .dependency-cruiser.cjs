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
      comment: 'shared may import core (pure); must not import views.',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/views/' },
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
        pathNot: '^src/web3/',
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
      name: 'hooks-no-app',
      severity: 'error',
      from: { path: '^src/hooks/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: { path: '^src/' },
      to: { circular: true, path: '^src/' },
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
    {
      name: 'stores-no-app',
      comment:
        'stores must not import app/. Tab init helpers live in shared/config (getInitialTab).',
      severity: 'error',
      from: { path: '^src/stores/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'views-no-cross-tab',
      comment:
        'DApp tab page-bags must not import sibling tabs. Shared helpers belong in hooks/shared/core.',
      severity: 'error',
      from: { path: '^src/views/dapp/([^/]+)/' },
      to: {
        path: '^src/views/dapp/([^/]+)/',
        pathNot: '^src/views/dapp/$1/',
      },
    },
    {
      name: 'app-views-composition',
      comment:
        'Document app→views. known-ok: shell hosts, auth→login (src-layout invariant 4), rail dots/promo. known-leak: skeleton→community (phase E). Warn-only.',
      severity: 'warn',
      from: { path: '^src/app/' },
      to: { path: '^src/views/' },
    },
    {
      name: 'section-only-in-detail',
      comment:
        'Section 仅允许 *-detail.tsx import。禁为消 jscpd 抽 Section/Title 薄壳；页内同构用 jscpd:ignore。',
      severity: 'error',
      from: {
        path: '^src/views/',
        pathNot: '-detail\\.tsx$',
      },
      to: { path: 'shared/components/section(\\.tsx)?$' },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.app.json' },
    doNotFollow: {
      path: '(^node_modules/|\\.pnpm/)',
    },
  },
}
