# Agent / CI 命令 SSOT

> 与 `package.json` scripts 同构。收工与 PR 门禁以本表为准。

## 日常

| 命令                                                     | 用途                                                    |
| -------------------------------------------------------- | ------------------------------------------------------- |
| `pnpm dev`                                               | tokens + render-home + Vite `:5174`                     |
| `pnpm build`                                             | tokens + `tsc -b` + render-home + Vite production build |
| `pnpm probe:bundle`                                      | `build` 后：Home sync 污染标记 / 体积上限 → 失败 exit 1 |
| `pnpm env:staging` / `pnpm env:prod` / `pnpm env:status` | 切换 `.env.local` staging 覆盖                          |

## 验证门禁

| 命令                                         | 用途                                                                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`pnpm check`**                             | **收工最小门禁**：`check:tokens` + `tsc -b` + `lint:src` + `lint:architecture` + `lint:hex` + `lint:css` + `lint:deadcode` + **`lint:duplicates`** + **`format:check`** + `test:unit` |
| `pnpm build:tokens`                          | 从 `tokens.json` 生成 `theme.css` / `tokens.ts`；改色后必跑；**勿手改生成文件**（`--app-claim-restake` 等别名在 generator）                                                           |
| `pnpm check:tokens`                          | `build:tokens` 后对生成物 `git diff --exit-code`（防手改 theme/tokens.ts 漂移）                                                                                                       |
| `pnpm build`                                 | tokens + `tsc -b` + render-home + Vite production build（**CI 强制**）                                                                                                                |
| `pnpm probe:bundle`                          | `build` 后：Home sync 污染标记 / 体积上限 → 失败 exit 1（**CI 强制**）                                                                                                                |
| `pnpm audit:prod`                            | `pnpm audit --prod --audit-level high`（CI 单独 job，`continue-on-error`：传递依赖洞可见但不挡 merge）                                                                                |
| `pnpm lint:css`                              | Stylelint `src/**/*.css`（进 `check`）                                                                                                                                                |
| `pnpm lint:src`                              | `eslint src --quiet`（仅 error；`exhaustive-deps` 等进收工）                                                                                                                          |
| `pnpm lint`                                  | ESLint 全仓（含 Tailwind warn；不阻断 `check`）                                                                                                                                       |
| `pnpm lint:hex`                              | 禁止 scoped TS 模块硬编码 hex（须走 `theme.ts`）                                                                                                                                      |
| **git pre-commit**（husky）                  | staged → eslint + prettier；全仓 → `tsc -b`。**error 阻断提交**；warn 不阻断。                                                                                                        |
| **git commit-msg**（husky）                  | `commitlint` conventional commits                                                                                                                                                     |
| `pnpm lint:all`                              | ESLint + Stylelint + hex + depcruise + knip + jscpd                                                                                                                                   |
| `pnpm lint:deadcode`                         | knip（死导出/文件/依赖/重复导出等；**进** `check`；规则见 `knip.json`）                                                                                                               |
| `pnpm lint:duplicates`                       | jscpd 拷贝粘贴检测（`.jscpd.json`：`minLines` 20 / `threshold` 0；**进** `check`；下一棘轮 18→15）                                                                                    |
| `pnpm lint:deadcode:duplicates`              | 仅 knip `duplicates` issue（可选；默认已含于 `lint:deadcode`）                                                                                                                        |
| `pnpm format` / `pnpm format:check`          | Prettier（**`format:check` 进 `check`**）                                                                                                                                             |
| `pnpm format:classnames`                     | 仅对 `src/**/*.{ts,tsx}` 跑 Prettier（批量修 class 顺序）                                                                                                                             |
| `pnpm exec eslint "src/**/*.{ts,tsx}" --fix` | 自动修 canonical / important 后缀 / CSS-var 简写等                                                                                                                                    |
| `pnpm test:unit`                             | Node 内置 test runner（`tests/unit/*.test.mjs`）                                                                                                                                      |
| `pnpm test:e2e`                              | Playwright 视觉 + 契约（需本机浏览器；**手动 / 可选**，不进 husky、不进 `pnpm check`）                                                                                                |
| `pnpm test:e2e:update`                       | 更新视觉快照                                                                                                                                                                          |
| `pnpm test:integration`                      | 可选 live BSC quote（非 CI 门禁）                                                                                                                                                     |

### 架构门禁（dependency-cruiser）

- `core-is-pure` / `shared-no-views` / `shared-no-app` / `web3-gateway` / `stores-no-views` / `hooks-no-views` / **`hooks-no-app`** / `home-no-web3`
- **`no-circular`**（仅 `src/` 内环）

### TypeScript

- `strict` + **`noUncheckedIndexedAccess`**（`tsconfig.app.json`）

### 命名

- [`docs/naming.md`](../naming.md) · [`UBIQUITOUS_LANGUAGE.md`](../../UBIQUITOUS_LANGUAGE.md)

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

| 主题                                | 路径                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| 链 / thirdweb                       | `src/web3/thirdweb.ts`                                                                            |
| 写链                                | `src/web3/wallet/wallet-contract-write.ts`                                                        |
| Write intent / unknown receipt lock | `src/web3/wallet/assert-write-intent.ts` · `unknown-receipt-lock.ts`                              |
| Exchange 链 IO                      | `src/web3/exchange/`                                                                              |
| 合约地址（运行时 / fail-closed）    | `src/shared/config/contracts.ts` ← `VITE_BSC_*`；目录 SSOT `docs/frontend-manual/00-addresses.md` |
| 新功能手册 / ABI                    | `docs/frontend-manual/` · `env/manual.bsc.addresses.env`                                          |
| Query 失效                          | `src/shared/api/query/invalidate.ts`                                                              |
| Auth                                | `src/app/startup/auth-provider.tsx` + `src/web3/auth/*` + `src/core/auth/*`                       |
| Home providers                      | `src/app/startup/home-providers.tsx`（无 thirdweb）                                               |
| DApp providers                      | `src/app/startup/web-root-providers.tsx`                                                          |
| 目录落点                            | [`docs/src-layout.md`](../src-layout.md)                                                          |
