# docs/ — 文档索引

> Agent：**先读本表**，再打开对应 SSOT。

## 重构（rev3 · move/refactor 两拍）

| 顺序 | 文档 | 用途 |
|------|------|------|
| 1 | [`refactor-execution-playbook.md`](./refactor-execution-playbook.md) | **怎么执行** PR：checklist、parity、分支命名 |
| 2 | [`refactor-plan-minimal-world-class.md`](./refactor-plan-minimal-world-class.md) | **做什么**：四层架构、~18 merge 点、附录 A 映射 |

**纪律**：先 **`-move`**（只改路径 + shim，验 UI 一致）→ 再 **`-refactor`**（抽组件 / 收 CSS）。

## 必读（按任务）

| 任务 | 先读 |
|------|------|
| **改 Home / HTML / 动效 / 性能** | [`homepage-architecture.md`](./homepage-architecture.md) → [`static-homepage-plan.md`](./static-homepage-plan.md) → [`homepage-load-optimization.md`](./homepage-load-optimization.md) |
| **改 DApp 业务 / Web3 / Auth** | [`DAPP-GUIDE.md`](./DAPP-GUIDE.md) |
| **改 DApp / Home 视觉对齐** | 根 [`AGENTS.md`](../AGENTS.md) §8.4–8.6 + [`design-system-audit.md`](./design-system-audit.md) |
| **全仓目录迁移 / 抽组件** | **playbook → refactor-plan rev3** |
| **合约 error / ABI** | [`contract.md`](./contract.md) |

## 全部 SSOT 文档

| 文档 | 内容 |
|------|------|
| [`refactor-execution-playbook.md`](./refactor-execution-playbook.md) | 重构执行手册 |
| [`refactor-plan-minimal-world-class.md`](./refactor-plan-minimal-world-class.md) | 架构重构方案 rev3 |
| [`homepage-architecture.md`](./homepage-architecture.md) | Home **代码现状** |
| [`static-homepage-plan.md`](./static-homepage-plan.md) | Home **目标** vs 现状 |
| [`homepage-load-optimization.md`](./homepage-load-optimization.md) | Home 性能 Phase 1–4 |
| [`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md) | 动效 + runtime boot |
| [`DAPP-GUIDE.md`](./DAPP-GUIDE.md) | DApp 实操 |
| [`design-system-audit.md`](./design-system-audit.md) | Figma 帧、tv()、Frame→代码 |
| [`contract.md`](./contract.md) | 链上合约 |

## 易混命名

- `wallet-loader.ts` = 首页 **动效 boot**，不是钱包
- Home CTA → **`/{locale}/app.html`**
- 多语言 HTML = **24 入口**，**薄壳 CSR**

## 已删除（勿再引用）

见 playbook / refactor-plan 附录 C · [`README` 历史条目已归档于 git 历史]
