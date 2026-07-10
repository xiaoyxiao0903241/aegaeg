# Agent / CI 命令 SSOT

> 与 `package.json` scripts 同构。收工与 PR 门禁以本表为准。

## 日常

| 命令 | 用途 |
|------|------|
| `pnpm dev` | tokens + render-home + Vite `:5174` |
| `pnpm build` | tokens + `tsc -b` + render-home + Vite production build |
| `pnpm probe:bundle` | 读 `dist/*/index.html` / `app.html` 同步 JS；**Home 污染标记 / 体积上限失败则 exit 1** |
| `pnpm env:staging` / `pnpm env:prod` / `pnpm env:status` | 切换 `.env.local` staging 覆盖 |

## 验证门禁

| 命令 | 用途 |
|------|------|
| **`pnpm check`** | **收工最小门禁**：`tsc -b` + `lint:src`（eslint **error** only）+ `lint:architecture` + `lint:hex` + `lint:css` + `lint:deadcode`（knip）+ `test:unit` |
| `pnpm lint:css` | Stylelint `src/**/*.css`（进 `check`） |
| `pnpm lint:src` | `eslint src --quiet`（仅 error；`exhaustive-deps` 等进收工） |
| `pnpm lint` | ESLint 全仓（含 Tailwind / 登记债 **warn**，不阻断 `check`） |
| `pnpm lint:hex` | 禁止 scoped TS 模块硬编码 hex（须走 `theme.ts`） |
| **git pre-commit**（husky） | staged `*.{ts,tsx,js,mjs,cjs}` → `eslint`；全仓 → `tsc -b`。**error 阻断提交**；warn 不阻断。`pnpm install` 后 `prepare` 会挂上 hook。**禁止**把 `test:e2e` / Playwright 挂进 hook 或 `pnpm check` |
| `pnpm lint:all` | ESLint + Stylelint + hex + depcruise + knip |
| `pnpm lint:deadcode` | knip（死代码；`tests/unit/knip-traced-exports.ts` 承接 `loadModule` 动态引用；**进** `check`） |
| `pnpm format` / `pnpm format:check` | Prettier + `prettier-plugin-tailwindcss`（class 排序；**未**进 `check`） |
| `pnpm format:classnames` | 仅对 `src/**/*.{ts,tsx}` 跑 Prettier（批量修 class 顺序） |
| `pnpm exec eslint "src/**/*.{ts,tsx}" --fix` | 自动修 canonical / important 后缀 / CSS-var 简写等 |
| `pnpm test:unit` | Node 内置 test runner（`tests/unit/*.test.mjs`） |
| `pnpm test:e2e` | Playwright 视觉 + 契约（需本机浏览器；**手动 / 可选**，不进 husky、不进 `pnpm check`） |
| `pnpm test:e2e:update` | 更新视觉快照 |
| `pnpm test:integration` | 可选 live BSC quote（非 CI 门禁） |

### Tailwind 工具链

- **CSS 入口（IntelliSense / Prettier / ESLint）**：`src/shared/styles/app.css`
- **Canonical lint**：`better-tailwindcss/enforce-canonical-classes`（与 IDE `suggestCanonicalClasses` 同源；IDE 该项已 `ignore`，避免双报）
- **IDE**：`.vscode/settings.json` 已忽略未知 at-rule（`@theme` / `@source` / `@custom-variant`）
- **策略**：早装晚收紧 — Tailwind 规则保持 `warn`；`pnpm check` 不因 class 警告失败

## Chrome 90+ / 国产 WebView

生产构建目标见 `vite.config.ts`（`chrome90`、`@vitejs/plugin-legacy`、lightningcss targets）。**勿删除** legacy polyfill / cascade-layer flatten / viewport-unit fallbacks（`dvh`→`vh`）/ `legacy-breakpoints.css`。lightningcss **不会**降级 `dvh`（#534），由 `vite-plugins/viewport-unit-fallbacks.ts` 注入。

## React Runtime

约定与质量门禁（Compiler / hooks / i18n）：[`docs/react-runtime.md`](../react-runtime.md)。

## 路径 SSOT（行为）

| 主题 | 路径 |
|------|------|
| 链 / thirdweb | `src/web3/thirdweb.ts` |
| 写链 | `src/web3/wallet/wallet-contract-write.ts` |
| Swap 链 IO | `src/web3/swap/` |
| 合约地址 | `src/shared/config/contracts.ts` |
| Query 失效 | `src/shared/api/query/invalidate.ts` |
| Auth | `src/app/bootstrap/auth-provider.tsx` + `src/views/dapp/auth/*` + `src/core/auth/*` |
| Home providers | `src/app/bootstrap/home-providers.tsx`（无 thirdweb） |
| DApp providers | `src/app/bootstrap/web-root-providers.tsx` |
| 目录落点 | [`docs/src-layout.md`](../src-layout.md) |
