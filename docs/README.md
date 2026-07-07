# docs/ — 文档索引

> Agent：**先读本表**，再打开对应 SSOT。

## 必读（按任务）

| 任务 | 先读 |
|------|------|
| **改 Home / HTML / 动效 / 性能** | [`homepage-architecture.md`](./homepage-architecture.md) → [`static-homepage-plan.md`](./static-homepage-plan.md) → [`homepage-load-optimization.md`](./homepage-load-optimization.md) |
| **改 DApp 业务 / Web3 / Auth** | [`DAPP-GUIDE.md`](./DAPP-GUIDE.md) |
| **改 DApp / Home 视觉对齐** | 根 [`AGENTS.md`](../AGENTS.md) §8.4–8.7 + **[`visual-parity-workflow.md`](./visual-parity-workflow.md)**（4175 vs 5174 主验收）+ [`design-system-audit.md`](./design-system-audit.md) |
| **改 typography / 删 CSS class / Text·shell 样式** | **[`style-refactor-playbook.md`](./style-refactor-playbook.md)**（强制，先于写盘） · **[`typography-baseline.md`](./typography-baseline.md)**（dev 字阶 SSOT + 映射表） · 验收 **[`visual-parity-workflow.md`](./visual-parity-workflow.md)** |
| **新增/改用户可见文案** | `<Text>` only — playbook §3.1 |
| **合约 error / ABI** | [`contract.md`](./contract.md) |

## 全部 SSOT 文档

| 文档 | 内容 |
|------|------|
| [`homepage-architecture.md`](./homepage-architecture.md) | Home **代码现状**（路径、Provider、HTML 生成） |
| [`static-homepage-plan.md`](./static-homepage-plan.md) | Home **目标** vs 现状 |
| [`homepage-load-optimization.md`](./homepage-load-optimization.md) | Home 性能 Phase 1–4 |
| [`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md) | 动效 + runtime boot |
| [`DAPP-GUIDE.md`](./DAPP-GUIDE.md) | DApp 实操 |
| [`design-system-audit.md`](./design-system-audit.md) | Figma 帧、tv()、Frame→代码 |
| [`style-refactor-playbook.md`](./style-refactor-playbook.md) | **样式重构强制流程**（样式栈、parity、验收） |
| [`visual-parity-workflow.md`](./visual-parity-workflow.md) | **4175 vs 5174 视觉 parity**（截图标红 → DOM → computed，主验收） |
| [`contract.md`](./contract.md) | 链上合约 |

## 架构约定（代码即 SSOT）

四层目录：`app` · `core` · `views` · `shared`。护栏见 `pnpm lint:all`（eslint、depcruise、knip、shims）。

专项重构不再维护独立迁移 playbook；历史 rev3 计划见 git 历史（`refactor-plan-minimal-world-class.md` 等已删除）。

## 易混命名

- `home-reveal-loader.ts` = 首页 **动效 boot**，不是钱包
- Home CTA → **`/{locale}/app.html`**
- 多语言 HTML = **24 入口**，**薄壳 CSR**
