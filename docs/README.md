# docs/ — 索引

> 仓库根**仅** [`../AGENTS.md`](../AGENTS.md)。最高原则 + Matt 流程见该文件 §0–§1。

## 入门

React + Vite + TypeScript · AEGIS X DApp（BSC）。

- Node **22+** · pnpm **11.17+**（Corepack）
- `pnpm env:staging`（或 `env:prod`）→ `pnpm install` → `pnpm dev`（`:5174`）
- 完整 env 真源：`env/prod.env` / `env/staging.env`（含密钥）；`pnpm env:status` 查看当前模式
- 门禁：`pnpm check` · 命令 SSOT：[`commands.md`](./commands.md)

## 文档表

|任务|读|
|---|---|
|契约 / 五柱 / Matt 路由|[`../AGENTS.md`](../AGENTS.md)|
|命令|[`commands.md`](./commands.md)|
|词表|[`ubiquitous-language.md`](./ubiquitous-language.md)|
|链上手册（新）|[`onchain-manual/`](./onchain-manual/)|
|链上手册（旧·仅缺口）|[`onchain-manual-legacy.md`](./onchain-manual-legacy.md)|
|后端 API|[`backend-api/`](./backend-api/)|
|Figma 页 nodeId|[`figma-pages.md`](./figma-pages.md)|
|本轮视觉对照（原型优先）|[`decisions/dapp-prototype-visual-qa.md`](./decisions/dapp-prototype-visual-qa.md)|
|UI token / 组件|[`foundation/`](./foundation/)|
|代码注释|[`foundation/comment-conventions.md`](./foundation/comment-conventions.md)|
|Matt 决策 / 票 / handoff|[`decisions/`](./decisions/) · [`tickets/`](./tickets/) · [`handoffs/`](./handoffs/)|
|页袋 Dock/Detail 合同|[`decisions/dapp-page-bag-dock-detail.md`](./decisions/dapp-page-bag-dock-detail.md)|
|各章对照源目录|[`research/dapp-tab-source-index.md`](./research/dapp-tab-source-index.md)|

## 手册优先级

1. 新 `onchain-manual/` → 2. 旧 `onchain-manual-legacy.md`（仅补缺口）→ 3. `backend-api/`  
   钱路专文暂缺。  
   **禁止改写手册正文**；更新则整树替换入仓拷贝，勿手改。

## Matt 落盘

- grilling / wayfinder 决策 → `docs/decisions/`
- to-tickets / triage 票 → `docs/tickets/`
- 跨会话 handoff → `docs/handoffs/`（用后可删）
- **禁止** `.scratch/` 过程坟作 SSOT
