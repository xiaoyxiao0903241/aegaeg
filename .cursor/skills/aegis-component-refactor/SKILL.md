---
name: aegis-component-refactor
description: >-
  AEGIS Foundation refactor — P0–P8. Read docs/foundation/ only.
  One-step API, full call-site migration per phase.
---

# AEGIS Foundation 重构 Skill

> **唯一文档链**：
> 1. 本 skill（门禁摘要）
> 2. [`docs/foundation/runbook.md`](../../docs/foundation/runbook.md)
> 3. [`docs/foundation/api.md`](../../docs/foundation/api.md)
> 4. 写盘后 [`docs/foundation/verification.md`](../../docs/foundation/verification.md)

**Baseline**：当前分支 + Figma 正式稿。勿再引用已删的 Phase0 `baselines/`、旧规范全书、audit-v2、world-class-goals、废止 stub。

---

## 定稿约束

- **P0–P8 全部**：Token · Text · Button · Card · Chip · Input · Composite · 清债
- **最终命名**：Text caption/eyebrow/copy/panel/figure；Card 4 surface；Composite NavRail/PanelHeader/AmountInput/Segment/Accordion/CalloutCard
- **一步到位**：无 `deprecatedAliases`
- **每阶段**：primitive + 该阶段涉及的全仓 call site
- **完成**：API gate + 人工对照表确认 — 探针 alone ≠ done
- **Class / CSS 减法**：与视觉 SSOT 同级 — 见下方 + [`runbook.md`](../../docs/foundation/runbook.md) §6.1

---

## Class / CSS 减法（MUST）

视觉 SSOT：**Figma 画板实节点**（设计意图）+ **当前分支**（实现 baseline）。见 [`verification.md`](../../docs/foundation/verification.md)。

**`dev` 不是结构 SSOT。** 对照 `dev` 只回答「视觉是否坏了」，不回答「代码该不该长这样」。Foundation API / token 仍以 `docs/foundation/` 为准。

```
1. 禁止 *Class = { ... } as const / 顶部长 cn() 样式表；一次性布局写在 JSX className。
2. 自定义 class 仅当 CSS/脚本真正选择它；纯装饰名删除。
3. 动效钩子优先 data-*；同步改 CSS；禁止为动效保留空 class。
4. 删冗余：重复断点、被 token/primitive 覆盖的手写字阶色、无 computed 影响的 utility。
5. 视觉收敛：布局/字号/色/间距相对目标 <1px（或无肉眼可辨色差）。有偏差 → 找根因，全面修；禁止 !important / 局部特判补丁。
6. 禁止为凑截图贴回已删平行样式体系 / 遗留色 / type-scale；根因在 token/primitive 则改 SSOT。
7. deletion-first · 代码极简 · 第一性原理。
8. **禁止当死 CSS 删**：`home-motion.css`、`wallet.css` 主路径、DApp 动效钩子。清单见 [`runbook.md`](../../docs/foundation/runbook.md) §6.1。
```

---

## 视觉诊断（MUST · 红块优先）

```
1. 打开 heatmap / diff.png，按红块列清单
2. 裁切对照 → 肉眼定：色 / 字 / 布局 / 动态文案 / 抗锯齿
3. 同位置打开当前源码 → 根因一句 + REGRESSION|INTENTIONAL|IGNORE
4. 共享 primitive 导致 → 改 SSOT，禁止 call site ! 补丁
5. 探针（可选）：仅当肉眼分不清或修完硬验收时
6. 修完重跑 heatmap；红块清零或每块已标注
```

---

## 写盘前硬门禁

```
[ ] 已读 foundation/runbook + api 对应 §
[ ] Step 1 API 表 + Step 2 视觉映射表已产出
[ ] 不碰无关 theme/shell/页面
[ ] 本切片若动 class/CSS：已按「Class / CSS 减法」删冗余
```

## 写盘后硬门禁

```
[ ] verification.md 切片标签已更新
[ ] API gate + 人工对照（探针 alone ≠ DONE）
```
