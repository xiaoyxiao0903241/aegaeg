---
name: aegis-component-refactor
description: >-
  AEGIS Foundation refactor — ALL 6 components. Read docs/foundation/ only.
  One-step API, dev 4175 parity, full call-site migration per PR.
---

# AEGIS Foundation 重构 Skill

> **唯一文档链**（对抗仲裁 v1.0 · 2026-07-08）：
> 1. 本 skill（门禁摘要）
> 2. [`docs/foundation/runbook.md`](../../docs/foundation/runbook.md)
> 3. [`docs/foundation/api.md`](../../docs/foundation/api.md)
> 4. 写盘后 [`docs/foundation/verification.md`](../../docs/foundation/verification.md)

**勿读**已废止 stub（migration-plan · playbook · text-refactor-plan · anatomy · visual-parity · slice-*）。

---

## 定稿约束

- **六类全部**：Text · Button · Card · FaqList · AmountInput · shell cards
- **一步到位**：无 `deprecatedAliases`
- **每 PR**：primitive + 全仓 call site
- **完成**：API gate + Swap 探针 — 探针 alone ≠ done

---

## 写盘前硬门禁

```
[ ] 已读 foundation/runbook + api 对应 §
[ ] Step 1 API 表 + Step 2 dev 映射表已产出
[ ] Phase 0 baselines 已存在
[ ] 不碰无关 theme/shell/页面
```

## 写盘后硬门禁

```
[ ] verification.md 双 gate PASS
[ ] 该组件 api.md 键数 = 代码键数
[ ] 全仓 legacy API rg 零命中
```

---

## 命令速查

见 [`docs/foundation/verification.md`](../../docs/foundation/verification.md)
