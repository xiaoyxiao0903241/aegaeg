# Agent / CI 命令 SSOT

> 常用命令与 `package.json` scripts 对齐；完整列表以 `package.json` 为准。

## 日常

| 命令                                           | 用途                                               |
| ---------------------------------------------- | -------------------------------------------------- |
| `pnpm dev`                                     | tokens + render-home + Vite `:5174`                |
| `pnpm build`                                   | tokens + `tsc -b` + render-home + production build |
| `pnpm env:staging` / `env:prod` / `env:status` | 切换 `.env.local`                                  |

## 门禁

| 命令                                 | 用途                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| **`pnpm check`**                     | 收工最小门禁：tokens + tsc + lint(src/arch/hex/css/deadcode/duplicates) + format + unit |
| `pnpm build:tokens` / `check:tokens` | 从 `tokens.json` 生成并防手改漂移                                                       |
| `pnpm probe:bundle`                  | Home sync 污染 / 体积上限（build 后）                                                   |
| `pnpm audit:prod`                    | prod 依赖 high+（CI 可 soft-fail）                                                      |
| `pnpm test:unit`                     | Node test runner                                                                        |
| `pnpm test:e2e`                      | Playwright（可选，不进 check）                                                          |
| `pnpm measure:leaf`                  | UI leaf A5 实测（需自备 inventory；见 `scripts/ui-leaf-a5-measure/`）                   |

## 关键路径

| 主题                    | 路径                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| 链 / thirdweb           | `src/web3/thirdweb.ts`                                               |
| 写链                    | `src/web3/wallet/wallet-contract-write.ts`                           |
| 合约地址（fail-closed） | `src/shared/config/contracts.ts` ← `VITE_BSC_*`                      |
| 地址目录                | [`onchain-manual/00-addresses.md`](./onchain-manual/00-addresses.md) |
| 新手册 / ABI            | [`onchain-manual/`](./onchain-manual/)                               |
| 旧手册                  | [`onchain-manual-legacy.md`](./onchain-manual-legacy.md)             |
| 后端 API                | [`backend-api/`](./backend-api/)（机器真源 `openapi.json`）          |
