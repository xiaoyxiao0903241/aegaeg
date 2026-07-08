# Phase 0 基线 — dev computed 快照

> **SSOT 角色**：Swap 探针 parity gate 的**只读参照**（非设计目标稿）。  
> **生成**：`pnpm capture:phase0-baseline`（读 dev @4175 或等效 worktree）

| 文件 | 内容 |
|------|------|
| `swap-pc-computed.json` | Swap Desktop 探针节点 computed |
| `swap-h5-computed.json` | Swap H5 探针节点 computed |
| `swap-style-stack.md` | 样式栈表（改前 owner 记录） |

**验收**：

```bash
pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5
```

P1 写盘前 **必须** 已 commit 上述 JSON；无文件 → 停手。

**流程 SSOT**：[`foundation/runbook.md`](../foundation/runbook.md) · [`.cursor/skills/aegis-component-refactor/SKILL.md`](../../.cursor/skills/aegis-component-refactor/SKILL.md)
