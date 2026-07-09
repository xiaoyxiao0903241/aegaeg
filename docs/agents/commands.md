# Agent / CI 命令 SSOT

> 与 `package.json` scripts 同构。收工与 PR 门禁以本表为准。

## 日常

| 命令 | 用途 |
|------|------|
| `pnpm dev` | tokens + render-home + Vite `:5174` |
| `pnpm build` | tokens + `tsc -b` + render-home + Vite production build |
| `pnpm env:staging` / `pnpm env:prod` / `pnpm env:status` | 切换 `.env.local` staging 覆盖 |

## 验证门禁

| 命令 | 用途 |
|------|------|
| **`pnpm check`** | **收工最小门禁**：`tsc -b` + `lint:architecture` + `test:unit` |
| `pnpm lint:all` | ESLint + Stylelint + hex + depcruise + knip |
| `pnpm test:unit` | Node 内置 test runner（`tests/unit/*.test.mjs`） |
| `pnpm test:e2e` | Playwright 视觉 + 契约（需本机浏览器） |
| `pnpm test:e2e:update` | 更新视觉快照 |
| `pnpm test:integration` | 可选 live BSC quote（非 CI 门禁） |

## Chrome 90+ / 国产 WebView

生产构建目标见 `vite.config.ts`（`chrome90`、`@vitejs/plugin-legacy`、lightningcss targets）。**勿删除** legacy polyfill / cascade-layer flatten / `legacy-breakpoints.css`。

## 路径 SSOT（行为）

| 主题 | 路径 |
|------|------|
| 链 / thirdweb | `src/views/dapp/web3/thirdweb.ts` |
| 合约地址 | `src/shared/config/contracts.ts` |
| Query 失效 | `src/shared/api/query/invalidate.ts` |
| Auth | `src/app/bootstrap/auth-provider.tsx` + `src/views/dapp/auth/*` + `src/core/auth/*` |
| Home providers | `src/app/bootstrap/home-providers.tsx`（无 thirdweb） |
| DApp providers | `src/app/bootstrap/web-root-providers.tsx` |
