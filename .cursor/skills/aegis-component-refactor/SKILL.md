---
name: aegis-component-refactor
description: >-
  AEGIS Foundation refactor — P0–P8. Read docs/foundation/ only.
  One-step API, full call-site migration per phase.
---

# AEGIS Foundation 重构 Skill

> **唯一文档链**（对抗仲裁 v2.1 · 2026-07-08）：
> 1. 本 skill（门禁摘要）
> 2. [`docs/foundation/runbook.md`](../../docs/foundation/runbook.md)
> 3. [`docs/foundation/api.md`](../../docs/foundation/api.md)
> 4. [`docs/foundation/design-system-audit-v2.md`](../../docs/foundation/design-system-audit-v2.md)
> 5. 写盘后 [`docs/foundation/verification.md`](../../docs/foundation/verification.md)

**勿读**已废止 stub（migration-plan · playbook · text-refactor-plan · anatomy · visual-parity · slice-*）。

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

视觉优先级：Figma > Foundation > `dev`（**仅视觉**回归探测器）。

**`dev` 不是结构 SSOT。** `dev` 里同样有 class 字典、空装饰名、重复断点、平行色——重构目标就是消掉这些冗余；**禁止**以「dev 也有」为由保留结构债。对照 `dev` 只回答「视觉是否坏了」，不回答「代码该不该长这样」。

```
1. 禁止 *Class = { ... } as const / 顶部长 cn() 样式表；一次性布局写在 JSX className。
2. 自定义 class 仅当 CSS/脚本真正选择它；纯装饰名删除（不论 dev 是否带同名）。
3. 动效钩子优先 data-*；同步改 CSS；禁止为动效保留空 class。
4. 删冗余：重复断点、被 token/primitive 覆盖的手写字阶色、无 computed 影响的 utility——以「是否影响样式」为准，不以「dev 有没有」为准。
5. 视觉收敛：布局/字号/色/间距相对 4175 须 <1px（或无肉眼可辨色差）。有偏差 → 打开 dev 与当前**对应代码位置**，找根因，全面修；禁止 !important / 局部特判补丁。
6. 禁止为凑截图贴回已删平行样式体系 / 遗留色 / type-scale；根因在 token/primitive 则改 SSOT 并全仓受益。
7. deletion-first · 代码极简 · 第一性原理。
```

## 视觉诊断（MUST · 红块优先）

整页 `%` **只作趋势，不作收工条件**。漏看 hero CTA 的根因是「修完高度就停」。

**发现与归因**靠 heatmap + 源码；**探针是降级确认工具**，不是默认第一步。禁止先全页 DOM dump 再猜红块是什么。

```
1. 打开 heatmap / diff.png，按红块列清单（不按整页 %）
2. 裁切 4175 vs 5174 → 肉眼定：色 / 字 / 布局 / 动态文案 / 抗锯齿
3. 同位置打开当前源码（必要时 baseline 同文件）→ 根因一句 + REGRESSION|INTENTIONAL|IGNORE
4. 共享 primitive 导致 → 改 SSOT（Button/Text/Card…），禁止 call site ! 补丁
5. 探针（可选）：仅当肉眼分不清色/字号档，或修完要对 1–2 个节点硬验收时，scoped 取 computed
6. 修完重跑 heatmap；红块清零或每块已标注
7. 禁止「diff 从 17%→4%」当作完成；未扫完红块 = NOT DONE
```

---

## 写盘前硬门禁

```
[ ] 已读 foundation/runbook + api 对应 §
[ ] Step 1 API 表 + Step 2 dev 映射表已产出
[ ] Phase 0 baselines 已存在
[ ] 不碰无关 theme/shell/页面
[ ] 本切片若动 class/CSS：已按「Class / CSS 减法」删冗余（不以 dev 结构为保留理由）
```

## 写盘后硬门禁

```
[ ] verification.md 双 gate PASS
[ ] 该组件 api.md 键数 = 代码键数
[ ] 全仓 legacy API rg 零命中
[ ] 无新增空装饰 class；动效钩子已 data-*（若本切片触及）
```

---

## 命令速查

见 [`docs/foundation/verification.md`](../../docs/foundation/verification.md)
