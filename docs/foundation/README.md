# Foundation 重构 — 文档入口（L0）

> **版本**：v1.0 · **2026-07-08**  
> **仲裁**：极简派 × 严格派对抗 → 主 Agent 定稿  
> **范围**：**全部 6 类** Foundation — Text · Button · Card · FaqList · AmountInput · shell cards

## Agent 必读链（仅 3 步）

```text
1. .cursor/skills/aegis-component-refactor/SKILL.md   ← 触发器 + 硬门禁摘要
2. docs/foundation/runbook.md                         ← 怎么改（流程 / 阶段 / 反模式）
3. docs/foundation/api.md                             ← 改什么（六组件公开 API）
```

写盘前若涉及验收命令 → 加读 [`verification.md`](./verification.md)。

**禁止**再读已废止文档（见 [`../README.md`](../README.md) 「已废止」表）。

---

## 三核职责（唯一 SSOT）

| 文档 | 职责 | 读者 |
|------|------|------|
| [`runbook.md`](./runbook.md) | Phase 0→P2 · 单组件 6 步 · 样式栈 · MUST NOT | 执行 refactor 的 agent |
| [`api.md`](./api.md) | 六组件对称 API · 键数 gate · Tier B 边界 | 定 API / 改 primitive |
| [`verification.md`](./verification.md) | 4175/5174 · 双 gate · 命令 · 切片验收模板 | 收工 / 探针 |

---

## 用户定稿（不可改）

| 项 | 定稿 |
|----|------|
| 策略 | **一步到位** — 无 `deprecatedAliases` / legacy variant |
| P1 scope | **六类全部**做完；顺序 Text→…→shell cards = **先后**，不是「只做 Text」 |
| 每 PR | primitive API 收束 + **全仓 call site** |
| 视觉 SSOT | dev **4175** computed |
| Parity gate | Swap PC/H5（`12:2` / `62:2`）`compare:style-baseline` |
| 完成定义 | **API gate + 探针** — 探针 PASS alone = NOT DONE |
| 交付物 | 世界级最小公开 API，不是 parity 补丁 |

---

## L2 / L3 参考（非执行 SSOT）

| 文档 | 用途 |
|------|------|
| [`../design-token-tiers.md`](../design-token-tiers.md) | Tier A/B 字阶理论 |
| [`../aegis-design-system-spec.md`](../aegis-design-system-spec.md) | 设计规范全书 |
| [`../design-system-audit.md`](../design-system-audit.md) | Figma 帧 ↔ 代码 |
| [`../figma-pages-inventory.md`](../figma-pages-inventory.md) | Figma 清单 |
| [`../baselines/`](../baselines/README.md) | Phase 0 computed 数据 |
| [`../archive/`](../archive/README.md) | 历史审查（只读） |

---

## 对抗仲裁摘要

| 分歧 | 极简派 | 严格派 | **裁决** |
|------|--------|--------|----------|
| 文档篇数 | 2–3 篇 | 分层 L0–L3 | **L1 三核** + skill + baselines 数据 |
| Text 独立 plan | 并入 api §3 | 附录可以 | **api 六节对称**，Text 不单独成 execution SSOT |
| playbook / migration | 合并 runbook | 保留 playbook | **合并** → runbook |
| parity / slice | 合并 verification | 保留用户确认 | **合并** → verification |
| audit-synthesis | 归档 | 保留背景 | **archive/**，不进必读链 |
