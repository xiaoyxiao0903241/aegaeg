# Foundation — 文档入口

> **当前分支 = baseline**（2026-07-09）。不再维护 4175 Phase0 快照为结构 SSOT。  
> **范围**：Token · Text · Button · Card · Chip · Input · Composite · shell

## Agent 必读链（仅 3 步）

```text
1. .cursor/skills/aegis-component-refactor/SKILL.md   ← 触发器 + 硬门禁摘要
2. docs/foundation/runbook.md                         ← 怎么改
3. docs/foundation/api.md                             ← 改什么
```

写盘后验收 → [`verification.md`](./verification.md)。

## 三核职责（唯一 SSOT）

| 文档 | 职责 |
|------|------|
| [`runbook.md`](./runbook.md) | 流程 · 样式栈 · MUST NOT · CSS 保留清单 |
| [`api.md`](./api.md) | 公开 API · 键数 gate · 断点白名单 |
| [`verification.md`](./verification.md) | 切片标签 · 命令 · 回归记录 |

## 用户定稿

| 项 | 定稿 |
|----|------|
| 策略 | **一步到位** — 无 `deprecatedAliases` |
| 视觉 SSOT | **Figma 正式稿画板** + **当前分支**（人工 / heatmap）；`dev` 仅作可选回归对照 |
| 完成定义 | **API gate + 人工对照** — 探针 alone ≠ DONE |
| 交付物 | 世界级最小公开 API |

## 易混

- **Figma** = 设计意图 · **当前分支** = 实现 baseline
- `dev` @ 4175 = 可选回归对照，**不是**结构模板
