# Foundation — UI token 与组件轴

> **Baseline**：当前分支 + [Figma](https://www.figma.com/design/uiKwzwIoD06phS0husdqjB/AEGIS-X--Copy---Copy-?node-id=4253-365&m=dev)  
> **范围**：Token · Text · Button · Card · InteractiveCard（Hub 壳）· Chip · Input · shell chrome

## 必读

1. [`.cursor/skills/aegis-component-refactor/SKILL.md`](../../.cursor/skills/aegis-component-refactor/SKILL.md)
2. [`ui-tokens.md`](./ui-tokens.md) — 设计 token / 组件公开轴
3. [`runbook.md`](./runbook.md) — 改 primitive 流程
4. [`component-usage.md`](./component-usage.md) — leaf / call site 用法

## 定稿规则

| 项                | 规则                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 颜色              | **`src/shared/styles/tokens/tokens.json`** → `theme.css`（色值真源）；轴说明见 `ui-tokens.md`；禁新遗留色 / 平行语义 class |
| 文本              | 用户可见文案必须 `<Text>`                                                                                                  |
| 样式复用          | 禁导出 `*Class`；单用处 inline；多处 → 组件 / `tv()`                                                                       |
| shared/components | 只扩 chrome；业务档位 / locale 不进 primitive                                                                              |
| H5                | PC 文案 SSOT；H5 只做响应式                                                                                                |

## 易混色

| 说法                | 含义                            |
| ------------------- | ------------------------------- |
| `primary` `#e86a43` | 主 CTA 橙                       |
| `coral` `#c85c3f`   | 强调 / LIVE / 页码（≠ primary） |
