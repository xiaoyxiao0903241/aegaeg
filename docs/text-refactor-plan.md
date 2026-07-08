# Text 重构方案

> **性质**：`<Text>` 组件与字阶 token 的**工程实施 SSOT**。  
> **设计 SSOT**：[`design-token-tiers.md`](./design-token-tiers.md) · [`aegis-design-system.md`](./aegis-design-system.md) v1.2  
> **审查汇总**：[`design-token-audit-synthesis.md`](./design-token-audit-synthesis.md)

**状态**：v0.3 方案定稿（2026-07-08）；**尚未**改 `text.tsx` / call site。

---

## 1. 目标

1. **公开 API**：`variant` + `tone`（+ `tabular` / `as`）；**删除 `weight` prop**。
2. **Tier A variant**：**10 flat + 3 compound**（见 tiers §1.1）；低频 px **不进 Text API**。
3. **默认正文**：省略 `variant` → **`meta`**（13px）。
4. **rail**：**仅**左侧 rit **10px Medium**（产品定稿）。
5. 删除 `dapp-type-scale.ts`；样式进 `@theme` + `@utility`。

---

## 2. Tier A variant 表

| `variant` | PC→H5 | 字重 | Tier | 主要用途 |
|-----------|------|------|------|----------|
| `rail` | 10→10 | medium | A | **仅** rit 四 Tab |
| `kicker` | 11→12 | semibold | A+compound | eyebrow |
| `meta` | 13→13 | normal | A | 默认正文 |
| `detail` | 14→14 | normal | A | FAQ 答案、tk |
| `question` | 15→15 | semibold | A | qhd |
| `headline` | 16→15 | semibold | A | 卡小标题 |
| `brand` | 17→18 | semibold | A | tb |
| `section` | 18→16 | semibold | A | dl |
| `widget-title` | 21→22 | semibold | A | wh 主标题 |
| `amount` | 22→23 | semibold | A | 金额 |

**Compound**：`kicker` · `panel-title` · `table-cell`

---

## 3. Tier B — 组件内（不进 Text）

| px | 组件 |
|----|------|
| 12 | StatCard 标签、Table 表头、WidgetHeader 副标题 |
| 20 | ConvertPanel / Modal 标题 |
| 26 | WidgetHeader disconnected 主标题 |
| 30 | StatCard 大数值 |

---

## 4. 映射摘要

| 删除 / alias | 并到 |
|--------------|------|
| caption* / footnote / body 角色名 | `meta` / `detail` |
| faq-question | `question` |
| stat / panel variant | **Tier B 组件** |
| title1/2/3 | `amount` / `widget-title` / `brand` |

---

## 5. 阶段

| Phase | 内容 |
|-------|------|
| 1 | 删 `weight` |
| 2 | 10 variant + compound @utility |
| 3 | 组件 Tier B（StatCard、WidgetHeader、rail 10px） |
| 4 | Home 3–4 display variant |
| 5 | theme spacing/color 按 tiers |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.2 | 2026-07-08 | Figma SSOT + 角色命名 |
| v0.3 | 2026-07-08 | 对齐 design-token-tiers；10+3 compound；stat/panel 出 Text API |
