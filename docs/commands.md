# Agent / CI 命令 SSOT

> 常用命令与 `package.json` scripts 对齐；完整列表以 `package.json` 为准。

## 日常

|命令|用途|
|---|---|
|`pnpm dev`|tokens + render-home + Vite `:5174`（`/api` → `VITE_API_BASE_URL` 代理，避 CORS）|
|`pnpm build`|tokens + `tsc -b` + render-home + production build|
|`pnpm env:staging` / `env:prod` / `env:status`|切换 `.env.local`|
|`pnpm docs:matrix`|从 `docs/dapp-data-coverage-matrix.md` 生成可读 HTML|
|`pnpm react-doctor`|React Doctor 本地扫描（devDependency；勿用 `pnpm doctor`，那是 pnpm 自检）。配置：根目录 `doctor.config.jsonc`；Cursor skill：`.agents/skills/react-doctor`（兼 `.cursor/skills/react-doctor`）|
|`pnpm react-doctor:staged`|提交钩子：仅 staged，`--blocking error`|
|`pnpm react-doctor:changed`|相对 base 的 changed 扫描（进 `pnpm check`）|

## 门禁

|命令|用途|
|---|---|
|**`pnpm check`**|收工最小门禁：tokens + tsc + lint(src/arch/hex/css/deadcode/duplicates) + format + unit + `react-doctor:changed`|
|`pnpm lint:duplicates`|jscpd（threshold 0）。页袋 Foundation 拼装重复 → `jscpd:ignore`（须中文理由含「页内拼装」）；**禁止**抽 Section/Detail 薄包装过门禁|
|`pnpm lint:architecture`|depcruise 层门；含 `Section` 仅 `*-detail.tsx` 可 import|
|`pnpm build:tokens` / `check:tokens`|从 `tokens.json` 生成并防手改漂移|
|`pnpm probe:bundle`|Home sync 污染 / 体积上限（build 后）|
|`pnpm audit:prod`|prod 依赖 high+（CI 可 soft-fail）|
|`pnpm test:unit`|Node test runner|
|`pnpm test:e2e`|Playwright（可选，不进 check）|
|`pnpm measure:leaf`|UI leaf A5 实测（需自备 inventory；见 `scripts/ui-leaf-a5-measure/`）|

## 关键路径

|主题|路径|
|---|---|
|链 / thirdweb|`src/web3/thirdweb.ts`|
|写链|`src/web3/wallet/wallet-contract-write.ts`|
|合约地址（fail-closed）|`src/shared/config/contracts.ts` ← `VITE_BSC_*`|
|地址目录|[`onchain-manual/00-addresses.md`](./onchain-manual/00-addresses.md)|
|新手册 / ABI|[`onchain-manual/`](./onchain-manual/)|
|手册 HTML→MD|`python3 scripts/convert-frontend-manual-html.py`（需 `lxml`）；校验 `python3 scripts/verify-frontend-manual-html-fidelity.py`|
|旧手册|[`onchain-manual-legacy.md`](./onchain-manual-legacy.md)|
|后端 API|[`backend-api/`](./backend-api/)（机器真源 `openapi.json`）|
|数据对齐矩阵（SSOT）|[`dapp-data-coverage-matrix.md`](./dapp-data-coverage-matrix.md)|
|各章对照源|[`research/dapp-tab-source-index.md`](./research/dapp-tab-source-index.md)|
|页袋 Dock/Detail 合同|[`decisions/dapp-page-bag-dock-detail.md`](./decisions/dapp-page-bag-dock-detail.md)|
