# Foundation — 入口

> **Baseline**：当前分支（实现）+ [Figma 正式稿](https://www.figma.com/design/sXWXDvBrLeg5r0NnP1SMZH/AEGIS-X--Copy---Copy---Copy-)（设计意图）  
> **范围**：Token · Text · Button · Card · Chip · Input · Composite · shell

## 必读链

```text
1. .cursor/skills/aegis-component-refactor/SKILL.md
2. docs/foundation/runbook.md   ← 怎么改
3. docs/foundation/api.md       ← 改什么
```

## 定稿（不可改）

| 项 | 定稿 |
|----|------|
| 策略 | 一步到位；无 `deprecatedAliases` |
| 视觉 | Figma 定意图；当前分支是实现真相；`dev` 仅可选回归 |
| 完成 | API gate + 人工对照；探针 alone ≠ DONE |
| 文本 | 用户可见文案必须 `<Text>` |
| 颜色 | `tokens.json` → `theme.css`；禁新遗留色 / 平行语义 class |
| 样式复用 | 禁导出 `*Class` 常量；单用处 inline；多处 → 抽组件 / `tv()` |
| H5 | PC 文案 SSOT；H5 只做响应式布局 |

## 易混

| 说法 | 含义 |
|------|------|
| Figma | 设计意图 |
| 当前分支 | 实现 baseline |
| `dev` @ 4175 | 可选旧 worktree 对照，**不是**结构模板 |
| `primary` `#e86a43` | 主 CTA 橙 |
| `coral` `#c85c3f` | 强调 / LIVE / 页码 / 部分 label（≠ primary） |
