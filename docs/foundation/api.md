# Foundation 公开 API（L2 · 十组件对称 SSOT）

> **流程**：[`runbook.md`](./runbook.md) · **验收**：[`verification.md`](./verification.md) · **设计审计**：[`design-system-audit-v2.md`](./design-system-audit-v2.md)
>
> **原则**：每组件 **键数 = 类型字面量数** · **无 alias 层** · **无场景分叉（context）** · Tier B 不进 Text

每节结构一致：**公开轴 · 禁止 · 依赖 · Swap 探针 · API gate**

---

## §1 Token（源 SSOT）

`src/shared/styles/tokens/tokens.json` 为唯一真源，CI 生成 `theme.css` 与 `tokens.ts`。

| 维度 | 集合 | 键数 |
|------|------|------|
| color | `background` · `foreground` · `card` · `muted-foreground` · `primary` · `primary-soft` · `primary-foreground` · `success` · `border` · `dark` · `inverse` · `destructive` · `token-usd1` · `token-agx` · `token-gagx` · `token-x` | 16 |
| type | `rail` · `kicker` · `meta` · `detail` · `question` · `headline` · `brand` · `section` · `widget-title` · `amount` | 10 |
| space | `1(4)` · `2(6)` · `3(8)` · `4(10)` · `5(12)` · `6(14)` · `7(16)` · `8(24)` · `9(40)` | 9 |
| radius | `sm(8)` · `md(10)` · `lg(12)` · `xl(16)` · `full` | 5 |
| shadow | `faq(E1)` · `card(E2)` · `subtle(E3)` · `elevated-strong(E4)` · `window(E5)` · `modal(E6)` | 6 |

**禁止**：新增 `--ink-strong`、`--faq-text`、`--on-dark`、`--coral-bright` 等代码臆造色。

---

## §2 Text

| 公开轴 | 值 |
|--------|-----|
| `variant` | **10 键**：`rail` · `kicker` · `meta` · `detail` · `question` · `headline` · `brand` · `section` · `widget-title` · `amount` |
| `tone` | `foreground` · `muted-foreground` · `primary` · `success` · `inverse` |
| 可选 | `as` · `tabular` |

### 10 variant（仅此）

| variant | PC | H5 | weight | 用途 |
|---------|----|----|--------|------|
| rail | 10 | 10 | medium | rail label |
| kicker | 11 | 12 | semibold | eyebrow / badge label |
| meta | 13 | 12 | normal | **默认**正文、label、table cell |
| detail | 14 | 14 | normal | FAQ 答案、长说明 |
| question | 15 | 14 | semibold | FAQ 问题 |
| headline | 16 | 15 | semibold | 卡小标题 |
| brand | 17 | 18 | semibold | topbar brand / rank |
| section | 18 | 16 | semibold | section heading (dl) |
| widget-title | 21 | 22 | semibold | widget / page header |
| amount | 22 | 23 | semibold | 金额、数值 |

**禁止**：`weight` prop · `panel-title` / `table-cell` / `on-dark` · `deprecatedAliases`
**依赖**：P0 token
**探针**：Swap catalog 全部 Text owner 行
**Gate**：`text.tsx` variant 键 = **10** · `TextVariant` 联合 = 10 · `tone` = 5

---

## §3 Button

| 公开轴 | 值 |
|--------|-----|
| `variant` | `primary` · `secondary` · `ghost` · `link` |
| `size` | `sm` · `md` · `lg` |
| `shape` | `pill` · `rect` |

**Typography**：`link` 内部自动用 `Text variant="meta" tone="primary"`，不 hand-roll class
**禁止**：call site `max-dapp:` typography · `shape="chip"`（拆到 Chip）
**依赖**：P1-Text
**探针**：topbar-connect · swap CTA · mode tab
**Gate**：`variant` = **4**；`size` = **3**；`shape` = **2**

---

## §4 Chip（新增）

| 公开轴 | 值 |
|--------|-----|
| `variant` | `solid` · `soft` · `outlined` |
| `size` | `sm` · `md` |
| `shape` | `pill` · `rounded` |
| `tone` | `default` · `primary` · `success` |
| 可选 | `onRemove` |

覆盖：percent buttons、badges、tabs、tags。

**禁止**：在 Chip 内 hand-roll typography
**依赖**：P1-Text
**探针**：swap percent · season badge · htab
**Gate**：`variant` = **3**；`size` = **2**；`shape` = **2**；`tone` = **3**

---

## §5 Card

| 公开轴 | 值 |
|--------|-----|
| `surface` | `outlined` · `elevated` · `faq` · `promo` · `window` · `modal` |
| `tone` | `dark`（用于 promo） |
| `as` | `article` · `button` · `div` · `section` · `details` · `span` |

| surface | Elevation | radius | padding | 用途 |
|---------|-----------|--------|---------|------|
| outlined | — | xl | 14/16 | 标准边框卡（box、meta） |
| elevated | E2 | xl | 14/16 | MetricCard、DataTable |
| faq | E1 | xl | 18/24 | FAQ item |
| promo | E3 | xl | 16/18 | 深色 CTA 卡 |
| window | E5 | 2xl | shell | app-window |
| modal | E6 | xl | 组件内 | dialog / sheet |

**子组件**：`Card.Header / Title / Description / Content / Footer / Label / Value`

**禁止**：`context` · `fill` · `radius` 轴 · call site 叠 `shadow-*` / `rounded-*` 覆盖 surface 默认
**依赖**：P1-Text
**探针**：mode-card-root · program-card · faq card layout · metric-card
**Gate**：`surface` 键 = **6**

---

## §6 Input

| 公开轴 | 值 |
|--------|-----|
| `variant` | `default` · `amount` · `shares` |
| `size` | `sm` · `md` · `lg` |
| 可选 | `startAdornment` · `endAdornment` · `error` |

覆盖：普通表单输入、swap amount、genesis shares。

**禁止**：call site 输入框内 hand-roll amount typography
**依赖**：P0 token
**探针**：swap amount 输入区 · genesis shares 输入区
**Gate**：`variant` = **3**

---

## §7 FaqList

| 公开轴 | 值 |
|--------|-----|
| `variant` | `home` · `dapp`（layout only） |
| 内部 Text | `question` · `detail` |
| 内部 Card | `surface="faq"` |

**依赖**：P1-Text · P1-Card
**探针**：faq-question-* · faq answer
**Gate**：`variant` = **2**

---

## §8 Composite（业务组件）

按 Figma 高频层提取，**不满足 3 调用点或纯视觉容器不提**。

| Composite | Figma 层 | 核心 props | 提升理由 |
|-----------|----------|------------|----------|
| `TopBar` | topbar / tb / tr | `wallet`, `network`, `locale` | 全局 shell |
| `AppRail` | rail / rit | `items`, `activeTab`, `onSelect` | 4 页共用 |
| `WidgetHeader` | wh | `title`, `subtitle`, `action` | 4 页共用 |
| `TokenAmountInput` | box / tk / rr / mx | `token`, `value`, `balance`, `onMax` | 真实交互行为 |
| `PercentChipGroup` | pcts / pct | `options`, `value`, `onChange` | 高频模式 |
| `MetricCard` | sc / mc | `label`, `value`, `hint`, `tone` | 跨页指标 |
| `DataTable` | tbl / trow / cell | `columns`, `rows`, `empty` | cell 614 次 |
| `FAQList` | qa / qhd | `items`, `variant` | 折叠行为 + a11y |
| `PromoCard` | promo / pcard / tc | `title`, `description`, `cta` | 深色 CTA 卡 |

**禁止**：把 `box`、`dl`、`r`、`ovc`、`tcard`、`qlink` 等纯视觉层提升为 Composite。

---

## §9 断点白名单

允许 `max-dapp:` / `dapp:` **仅 layout** 的文件：

- `shell-layout.ts` · `dapp-shell.tsx` · `dapp-topbar.tsx` · `dapp-mobile-nav.tsx`
- `dapp-widget-frame.tsx` · `dapp-detail-layout.ts` · `responsive-table.tsx` · `dapp-table-*`
- `wallet-*-modal.tsx` · `swap-slippage-modal.tsx` · `aegis-responsive-dialog.tsx`
- `home-layout.ts` · `static-layout.ts` · `views/home/components/*`
- Foundation 定义文件：**layout 断点 only** — `text.tsx` · `button.tsx` · `chip.tsx` · `card.tsx` · `input.tsx` · `faq-list.tsx`

**禁止**：上述以外 `max-dapp:(text-|font-|leading-|tracking-)`

**不可删**：`legacy-breakpoints.css` 中 `@custom-variant dapp` / `max-dapp`

---

## §10 P0-P7 交付矩阵

| 阶段 | 组件/任务 | 键数 gate | 同 PR 范围 |
|------|-----------|-----------|------------|
| P0 | Token JSON + 生成 CSS/TS | 见 §1 | theme.css / tokens.ts / 删 legacy color class |
| P1 | Text | 10 variant · 5 tone | 全仓 `variant=` / `tone=` |
| P2 | Card | 6 surface | 全仓 `surface=` |
| P3 | Chip（新增） | 3×2×2×3 | 替换 pct / badge / tab |
| P4 | Input | 3 variant | 替换 amount-input、shares field |
| P5 | Button | 4×3×2 | 全仓 Button props |
| P6 | Composite | 9 个 | 按依赖顺序逐个提取 |
| P7 | 按页替换 | — | Swap → Genesis → Rewards → Community → Home |

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 component-anatomy + text-refactor-plan；六节对称 |
| v2.0 | Figma 审计后收敛：10 Text variant · 6 Card surface · 新增 Chip/Input · Composite 清单 |
