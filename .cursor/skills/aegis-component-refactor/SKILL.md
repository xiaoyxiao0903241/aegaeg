---
name: aegis-component-refactor
description: >-
  AEGIS Foundation — current-branch baseline. Read docs/foundation/ only.
  One-step API; full call-site migration per slice.
---

# AEGIS Foundation Skill

> **文档链**
> 1. 本 skill（门禁）
> 2. [`docs/foundation/runbook.md`](../../docs/foundation/runbook.md) — 怎么改
> 3. [`docs/foundation/api.md`](../../docs/foundation/api.md) — 改什么

**Baseline**：当前分支 + Figma 正式稿。

---

## 硬约束

- 一步到位；无 `deprecatedAliases`
- 每切片：primitive + **全仓**相关 call site
- 完成 = API gate + 人工对照；探针 alone ≠ DONE
- Class / CSS 减法与视觉同级 — 见 runbook §5
- **禁止**导出 Tailwind class 常量（`*Class` / 平行 layout 文件）；单用处 inline；多处复用 → **抽组件**

---

## 写盘前

```
[ ] 已读 runbook + api 对应 §
[ ] 根因 + REGRESSION|INTENTIONAL|IGNORE 已写明
[ ] 不扩公开轴；细微差异用 className
[ ] 不碰无关 theme / shell / 页面
[ ] 动 class/CSS 时已按减法删冗余
[ ] 无新 *Class 常量 / 无平行 layout class 文件
```

## 写盘后

```
[ ] API gate + 人工对照通过（tsc / 肉眼；见 runbook §2）
```

## 视觉（红块优先）

```
红块 → 裁切肉眼 → 同位置源码根因 → 改 SSOT
→ （可选）scoped 探针 → 重跑对照
```

`dev` 只答「看起来坏没坏」，不答「代码该不该长这样」。
