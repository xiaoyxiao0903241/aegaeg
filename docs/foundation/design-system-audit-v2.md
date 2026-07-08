# AEGIS 设计系统规范 v2 —— Figma 视觉角色审计与重构蓝图

> **状态**：审计稿 · 待用户确认后落盘为执行 SSOT  
> **来源**：Figma 31 帧导出（`docs/figma-export/frames/*.json`）+ 当前代码审计  
> **目标**：代码极简 / 逻辑清晰可测试 / 算法精妙 / 少量 CSS 文件 / 很少 inline CSS / 组件 + 少量 className 组合实现全部 UI

---

## 1. 审计结论

当前 `refactor/world-class-minimal` 分支的 primitive 已经做了方向正确的 tv 化和 token 统一，但**离世界级还很远**：

| 问题 | 现状 | 目标 |
|------|------|------|
| Text variant | 12 个，其中 `panel-title` 和 `widget-title` 是 alias，`table-cell` 和 `meta` 是 alias | **10 个**真正独立的视觉角色 |
| Text tone | 含 `on-dark` 场景色 | 只保留语义色，深色卡用 `inverse` |
| Card | `context` 分叉 Home/DApp，`fill`/`radius` 轴冗余 | 6 个 surface，无 context |
| Button | `link` 直接写死 typography class，`shape=chip` 和 size 冲突 | link 走 Text 组合，chip 拆为独立 `Chip` |
| Input | 只有 `AmountInput`，无通用 Input | 统一 `Input` primitive |
| CSS 文件 | 10 个，且 `dapp-type-scale.ts` 等散落 | **2 个**（`theme.css` + `legacy-breakpoints.css`） |
| 业务组件 | 各页重复 hand-roll | 提取 8-10 个高频 Composite |

---

## 2. Token 架构（从 Figma 收敛）

### 2.1 颜色（14 个源变量）

Figma 实际出现的颜色：

```text
text/ink      #0b0e14   → foreground
text/body     rgba(0,0,0,0.7)  → muted-foreground
text/muted    rgba(0,0,0,0.4)  → 删除，用 opacity 组合
text/inverse  white     → inverse
accent/primary(coral) #e66a47  → primary
accent/coral-soft     #fceae2  → primary/soft
accent/coral-button   #e66a47  → primary（与 accent/primary 合并）
accent/coral-bright   #f4a98f  → 删除，用 primary  lighter
bg/page       #f5f6f8   → background
bg/surface    white     → card
bg/dark       #11141d   → dark
border/default #eceef2  → border
functional/up #16b979   → success
token/usd1    #e86a43   → token-usd1
token/agx     #232833   → token-agx
token/gagx    #7c6230   → token-gagx
token/x       #5e2a40   → token-x
```

**最终颜色 token（12 个语义 + 4 个代币）**：

```css
--background
--foreground
--card
--muted-foreground
--primary
--primary-soft
--primary-foreground
--success
--border
--dark
--inverse
--destructive
--token-usd1
--token-agx
--token-gagx
--token-x
```

**删除**：`ink-strong`、`ink-muted`、`faint`、`faq-text`、`on-dark`、`coral-bright`、`subtle-ink`、`placeholder`、`focus-border`、`border-subtle`、`surface-glass/wash`、`pill-muted-bg` 等。

### 2.2 Typography（10 个业务 variant，px-lock）

| variant | PC | H5 | weight | leading | tracking | 用途 |
|---------|----|----|--------|---------|----------|------|
| rail | 10 | 10 | medium | snug | tight | rail label |
| kicker | 11 | 12 | semibold | snug | wide uppercase | eyebrow / badge label |
| meta | 13 | 12 | normal | normal | -0.24/-0.26 | 默认正文、label、table cell |
| detail | 14 | 14 | normal | normal | -0.28 | FAQ 答案、长说明 |
| question | 15 | 14 | semibold | snug | -0.3/-0.28 | FAQ 问题 |
| headline | 16 | 15 | semibold | snug | -0.48/-0.45 | 卡标题 |
| brand | 17 | 18 | semibold | snug | -0.68/-0.72 | topbar brand / rank |
| section | 18 | 16 | semibold | tight | -0.72/-0.64 | section heading (dl) |
| widget-title | 21 | 22 | semibold | snug | -0.84/-0.88 | widget/page header |
| amount | 22 | 23 | semibold | snug | -0.44/-0.54 | 金额、数值 |

**删除**：`panel-title`、`table-cell`。

### 2.3 间距（7 阶 + 2 特殊）

Figma 分布显示主要聚集在 4/6/8/10/12/14/16/24/40。

```text
space-1: 4px
space-2: 6px
space-3: 8px
space-4: 10px
space-5: 12px
space-6: 14px
space-7: 16px
space-8: 24px
space-9: 40px
```

走 Tailwind 工具类：`gap-2`(8px) 等已覆盖多数；对 14px、40px 等 outliers 用 CSS var 或直接 `className`。

### 2.4 圆角（5 阶）

Figma 分布：9/10/12/13/14/16/18/999。

```text
radius-sm:  8px
radius-md:  10px
radius-lg:  12px
radius-xl:  16px
radius-full: 999px
```

**删除 Card 的 `radius` 轴**，由 surface 默认决定，call site 用 `className` 微调极个别情况。

### 2.5 阴影（6 阶，保留 E1-E6）

```text
shadow-faq   = E1
shadow-card  = E2
shadow-subtle = E3
elevated-strong = E4
shadow-window = E5
shadow-modal  = E6
```

**删除**：`shadow-primary-hover*`、arbitrary hover shadows；改由 Button/Card surface 自带或 token。

---

## 3. Primitive 清单（10 个）

### 3.1 Text
```ts
variant:  'rail' | 'kicker' | 'meta' | 'detail' | 'question' | 'headline' | 'brand' | 'section' | 'widget-title' | 'amount'
tone:     'foreground' | 'muted-foreground' | 'primary' | 'success' | 'inverse'
as?:      'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'strong' | 'small' | 'em' | 'b' | 'a' | 'div' | 'time'
tabular?: boolean
```

### 3.2 Button
```ts
variant:  'primary' | 'secondary' | 'ghost' | 'link'
size:     'sm' | 'md' | 'lg'
shape?:   'pill' | 'rect'    // chip 拆出
loading?: boolean
```
**变更**：删除 `tab` variant（用 Chip），`link` 内部自动用 Text `meta`/`primary`。

### 3.3 Chip（新增）
```ts
variant:  'solid' | 'soft' | 'outlined'
size:     'sm' | 'md'
shape:    'pill' | 'rounded'
tone:     'default' | 'primary' | 'success'
onRemove?: () => void
```
覆盖：percent buttons、badges、tabs、tags。

### 3.4 Card
```ts
surface:  'outlined' | 'elevated' | 'faq' | 'promo' | 'window' | 'modal'
tone?:    'dark'    // for promo
as?:      'article' | 'button' | 'div' | 'section' | 'details' | 'span'
```
**子组件**：`Card.Header / Title / Description / Content / Footer / Label / Value`。
**删除**：`context`、`fill`、`radius`。

### 3.5 Input
```ts
variant:  'default' | 'amount' | 'shares'
size?:    'sm' | 'md' | 'lg'
error?:   boolean
startAdornment?: ReactNode
endAdornment?: ReactNode
```
覆盖 swap amount、genesis shares、普通表单输入。

### 3.6 FaqList
```ts
variant:  'home' | 'dapp'
items:    { question: ReactNode; answer: ReactNode }[]
```

### 3.7 Dialog / Drawer（已有，小改）
用 Card `surface="modal"`。

### 3.8 TokenIcon（已有）
```ts
symbol: string
src?: string
size?: 'xs' | 'sm' | 'md' | 'lg'
```

### 3.9 Spinner / Loading（已有）

### 3.10 Link（已有）

---

## 4. Composite 清单（8-10 个，含取舍）

### 4.1 提升为 Composite（跨页 ≥3 或含行为/a11y）

| Composite | Figma 层来源 | 理由 | 核心 props |
|-----------|--------------|------|------------|
| `TopBar` | topbar/tb/tr/net/wal/lang | 全局 shell，状态槽 | `wallet`, `network`, `locale` |
| `AppRail` | rail/rit | 4 页都有，active 状态 | `items`, `activeTab`, `onSelect` |
| `WidgetHeader` | wh | 4 页 widget 列都有 | `title`, `subtitle`, `action` |
| `TokenAmountInput` | box + tk + rr + mx | 真实交互：金额 + token + max | `token`, `value`, `balance`, `onMax` |
| `PercentChipGroup` | pcts/pct | 4 页出现或类似模式 | `options`, `value`, `onChange` |
| `MetricCard` | sc/mc | 跨页指标卡 | `label`, `value`, `hint`, `tone` |
| `DataTable` | tbl/trow/cell | cell 614 次高频 | `columns`, `rows`, `empty` |
| `FAQList` | qa/qhd | 82 次，accordion 行为 | `items`, `variant` |
| `PromoCard` | promo/pcard/tc | 深色 CTA 卡 | `title`, `description`, `cta` |

### 4.2 不提为 Composite，用 Primitive + className 组合

| Figma 层 | 原因 | 组合方式 |
|----------|------|----------|
| `box` | 只是 Card outlined + padding | `<Card surface="outlined" className="...">` |
| `dl` | 只是 Text section | `<Text variant="section">` |
| `r` / `rr` | 行布局 | `div` + flex + Text/Chip |
| `meta` | 小 meta 信息块 | `<Card surface="outlined"><Card.Label/><Card.Value/></Card>` |
| `ovc` | overview card | `<Card surface="elevated">` + Text |
| `tcard` | token about card | `<Card surface="elevated">` + TokenIcon + Text |
| `qlink` / `qi` | quick link | 列表渲染 + Chip + Icon |
| `htab` | 水平 tab | Chip 组合 |

---

## 5. 文件组织

```text
src/shared/ui/
  primitives/
    text.tsx
    button.tsx
    chip.tsx          # 新增
    card.tsx
    input.tsx         # 新增/合并 amount-input
    faq-list.tsx
    dialog.tsx        # 复用 Card modal
    token-icon.tsx
    spinner.tsx
    link.tsx
  composite/
    top-bar.tsx
    app-rail.tsx
    widget-header.tsx
    token-amount-input.tsx
    percent-chip-group.tsx
    metric-card.tsx
    data-table.tsx
    faq-list.tsx      # 可复用 primitive
    promo-card.tsx
src/shared/styles/
  tokens/
    tokens.json       # SSOT
    theme.css         # 生成
    tokens.ts         # 生成
  shared.css          # 入口
  app.css
  home.css
  legacy-breakpoints.css  # 不可删
```

**CSS 文件目标**：4 个（theme.css + shared/app/home + legacy-breakpoints）。其中 theme.css 由 JSON 生成，hand-written 只剩入口 CSS 和 legacy-breakpoints。

---

## 6. 最终文件数估算

| 类别 | 文件数 |
|------|--------|
| Primitive | ~10 |
| Composite | ~9 |
| Token (JSON/CSS/TS/script) | 4 |
| CSS 入口 | 3 |
| Foundation 文档 | 2-3 |
| **总计** | **~28 个** |

**Inline CSS**：仅保留运行时计算值（进度条宽度、图表数据），通过 lint 规则禁止其他 inline style。

---

## 7. 实施顺序

1. **P0 — Token 重构**：`tokens.json` + 生成 `theme.css`/`tokens.ts`，删 legacy color class
2. **P1 — Text 收敛**：10 variant + 5 tone，全仓迁移
3. **P2 — Card 重构**：6 surface，删 context/fill/radius
4. **P3 — Chip 新增**：替换 pct/badge/tab
5. **P4 — Input 统一**：default/amount/shares
6. **P5 — Button 修复**：link 走 Text，chip 拆出
7. **P6 — Composite 提取**：按 WidgetHeader → TokenAmountInput → MetricCard → DataTable → FAQList → PromoCard → AppRail → TopBar 顺序
8. **P7 — 按页替换**：Swap → Genesis → Rewards → Community → Home sections

---

## 8. 落盘文件清单

确认本规范后，应更新/新增：

- `docs/foundation/api.md` → 按本规范重写
- `docs/foundation/tokens.md` → token 集合与生成说明
- `docs/foundation/composite-components.md` → Composite 清单与取舍
- `src/shared/styles/tokens/tokens.json` → 新增
- `scripts/generate-tokens.mjs` → 新增

---

## 9. 需要你确认

1. 是否同意 **Text 10 variant + 5 tone**？
2. 是否同意 **Card 6 surface 无 context**？
3. 是否同意 **新增 Chip 独立组件**？
4. 是否同意 **Input 统一 default/amount/shares**？
5. 是否同意 **Composite 清单（8-10 个）**？
6. 是否同意 **token 用 JSON 源 + CI 生成 CSS/TS**？
7. 是否同意我按 **P0 → P7 顺序**开始实施？

确认后我立刻落盘并开始第一个切片（Token 重构）。
