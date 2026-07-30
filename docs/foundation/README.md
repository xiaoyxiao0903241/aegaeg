# Foundation — 入口

> **Baseline**：当前分支 + [Figma 正式稿（静态 UI）](https://www.figma.com/design/uiKwzwIoD06phS0husdqjB/AEGIS-X--Copy---Copy-?node-id=4253-365&p=f&m=dev)  
> **范围**：Token · Text · Button · Card · Chip · Input · Composite · shell

## 必读

```text
1. .cursor/skills/aegis-component-refactor/SKILL.md
2. docs/foundation/runbook.md
3. docs/foundation/api.md
4. docs/foundation/component-usage.md   ← leaf / call site 用法（数据进、展示内化）
```

## 定稿

| 项       | 规则                                                                                         |
| -------- | -------------------------------------------------------------------------------------------- |
| 策略     | 一步到位；无 `deprecatedAliases`                                                             |
| 视觉     | Figma = 意图；当前分支 = 实现                                                                |
| 完成     | API gate + 人工对照；探针 alone ≠ DONE                                                       |
| 文本     | 用户可见文案必须 `<Text>`                                                                    |
| 颜色     | `tokens.json` → `theme.css`；禁新遗留色 / 平行语义 class                                     |
| 样式复用 | 禁导出 `*Class`；单用处 inline；多处 → 组件 / `tv()`                                         |
| 组件用法 | [`component-usage.md`](./component-usage.md) — 同 chrome 一组件；props 传数据；可点才 button |
| H5       | PC 文案 SSOT；H5 只做响应式                                                                  |

## 易混

| 说法                | 含义                            |
| ------------------- | ------------------------------- |
| `primary` `#e86a43` | 主 CTA 橙                       |
| `coral` `#c85c3f`   | 强调 / LIVE / 页码（≠ primary） |
