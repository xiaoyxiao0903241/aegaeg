# Foundation 公开 API（SSOT）

> **流程**：[`runbook.md`](./runbook.md) · **验收**：[`verification.md`](./verification.md)  
> **Baseline**：当前分支 + Figma 正式稿  
> **原则**：键数 = 类型字面量数 · 无 alias · 无 context 分叉轴 · 细微差异用 `className` 抹平

每节：**公开轴 · 禁止 · 依赖 · Gate**

---

## §1 Token（源 SSOT）

`src/shared/styles/tokens/tokens.json` 为唯一真源，CI 生成 `theme.css` 与 `tokens.ts`。

| 维度 | 集合 | 键数 |
|------|------|------|
| color | `background` · `foreground` · `card` · `muted-foreground` · `primary` · `primary-soft` · `primary-foreground` · `primary-bright` · `coral` · `coral-emphasis` · `band` · `faq` · `skeleton` · `modal-overlay` · `warning` · `footer` · `success` · `success-soft` · `border` · `dark` · `inverse` · `inverse-muted` · `destructive` · `token-*` | 公开语义；工程色见 tokens.json |
| type | `caption` · `eyebrow` · `copy` · `detail` · `question` · `headline` · `brand` · `section` · `panel` · `figure` | 10 |
| space | `1(4)` · `2(6)` · `3(8)` · `4(10)` · `5(12)` · `6(14)` · `7(16)` · `8(24)` · `9(40)` | 9 |
| radius | `sm(8)` · `md(10)` · `lg(12)` · `xl(16)` · `full` | 5 |
| shadow | `faq(E1)` · `card(E2)` · `subtle(E3)` · `elevated-strong(E4)` · `window(E5)` · `modal(E6)` · `modal-panel(E7)` · `tooltip(E8)` · `menu(E9)` · `dropdown(E10)` | 10 |

**禁止**：新增 `--ink-strong`、`--faq-text`、`--on-dark`、`--coral-bright` 等代码臆造色（深底亮珊瑚用正式 token `primary-bright` ≡ Figma `accent/coral-bright`）。

---

## §2 Text

| 公开轴 | 值 |
|--------|-----|
| `variant` | **10 键**：`caption` · `eyebrow` · `copy` · `detail` · `question` · `headline` · `brand` · `section` · `panel` · `figure` |
| `tone` | `foreground` · `muted-foreground` · `primary` · `primary-bright` · `success` · `inverse` · `inverse-muted` |
| 可选 | `as` |

**数字**：比例字（Montserrat 默认字形）。**禁止** `tabular` prop / `tabular-nums`（等宽偏疏，已删）。列对齐若需要，用布局/表格，不靠等宽数字。

### 10 variant（仅此）

| variant | PC | H5 | weight | 用途 |
|---------|----|----|--------|------|
| caption | 10 | 10 | medium | rail label |
| eyebrow | 11 | 12 | semibold | uppercase kicker |
| copy | 13 | 12 | normal | **默认**正文、label、table cell |
| detail | 14 | 14 | normal | FAQ 答案、长说明 |
| question | 14 | 15 | semibold | FAQ 问题 |
| headline | 16 | 15 | semibold | 卡小标题 |
| brand | 17 | 18 | semibold | topbar brand / rank |
| section | 18 | 16 | semibold | section heading (dl)；tracking **-0.04em** |
| panel | 21 | 22 | semibold | widget / page header；tracking **-0.04em** |
| figure | 22 | 23 | semibold | 金额、数值 |

**字距（Figma Genesis `31:2`）**：正文档（caption/copy/detail/…）**-0.02em**；`section`/`panel` 标题 **-0.04em**（≡ 18→`-0.72px`、21→`-0.84px`）；`headline` **-0.03em**；`eyebrow` **+0.08em**。禁 call site `tracking-normal` 抹平正文/标题字距（Input/Button 控件内文除外）。

**可选 `as`**：含 `label`（form a11y，如 sr-only）。
**禁止**：`weight` prop · `panel-title` / `table-cell` / `on-dark` · `deprecatedAliases`
**className 显示阶覆盖**：若 `className` 含字号 utility（`text-xs`…`text-9xl` / `text-[…]`，含 `max-*:text-*` / `!text-*`），`Text` 剥掉 size / leading / tracking type token，**保留** `font-[var(--type-*-weight)]`（call site 通常只覆盖字号/行高）。避免残留 tracking 把标题挤窄，同时不丢 variant 字重。
**依赖**：Token（§1）
**探针**：Swap catalog 全部 Text owner 行 · Home section titles
**Gate**：`text.tsx` variant 键 = **10** · `TextVariant` 联合 = 10 · `tone` = 7

`inverse-muted` = 深底次级文案（Figma/dev `#b8c0ce`）。**禁止**用 `inverse` + `opacity-*` 近似；**禁止** call site `text-on-dark`（legacy alias 仅过渡）。
`primary-bright` = 深底珊瑚强调（Figma `accent/coral-bright` `#f4a98f`）。暗色卡 kicker / volume 用此 tone；**禁止**用 `primary` 近似，**禁止** call site `text-coral-bright`。

---

## §3 Button

| 公开轴 | 值 |
|--------|-----|
| `variant` | `primary` · `secondary` · `ghost` · `link` |
| `size` | `sm` · `md` · `lg` |
| `shape` | `pill` · `rounded` |

**Size 高度 SSOT**（按钮显示阶，**不是** Text `copy` token）：
- `sm` = **42**（`min-h-[2.625rem]`）· 卡内 CTA · `text-sm` · leading-normal · **无默认 px**
- `md` = **44**（`min-h-11`）· 卡外 / widget 栈主 CTA · `text-sm` · leading-snug · `px-5`
- `lg` = **48**（`min-h-12`）· Home hero 等 · `text-base` · leading-none · `px-6`（H5：`px-5` / `text-sm`）
**暗色 promo CTA**：**38**（`min-h-9.5`）— 走 `DappActionButton density="inverse"`，**不是**第 4 个 size
**Compound**：`size=sm|md` + `shape=pill` → `w-full`；`primary` + `lg` → `border-0`（其余 primary 为 `border-transparent`）
**Hover / press SSOT**（全 variant 一致，禁 call site 叠 `shadow-primary-hover-*`）：
- 过渡：`duration-160 ease-out`；`active:duration-75`
- 动效：**极轻缩放**（禁 `translate-y` lift）
  - hover / focus-visible：`scale-[1.008]`
  - active：`scale-[0.992]`（不硬清影）
- `primary`：scale + `shadow-primary-hover`
- `secondary`：scale + `shadow-card` + `border-coral-hover-border`
- `ghost`：scale + `border-primary` / `text-primary`（无额外影）
- `link`：无 scale / 无影
**Typography**：`link` 用 `font-normal text-primary`，不 hand-roll 平行字阶文件
**禁止**：call site 用 `!min-h-*` / `!text-*` 绕过 size · `shape="chip"`（拆到 Chip）；H5 勿再叠平行 `max-dapp:min-h-*` 改高度；call site 叠 `hover:shadow-primary-hover-xl` 等改 hover
**依赖**：Text（§2）
**探针**：home hero CTA · swap CTA · claim · genesis promo Join · connect promo · community shareholder
**Gate**：`variant` = **4**；`size` = **3**；`shape` = **2**

---

## §4 Chip

| 公开轴 | 值 |
|--------|-----|
| `variant` | `solid` · `soft` · `outlined` |
| `size` | `sm` · `md` · `lg` |
| `shape` | `pill` · `rounded` |
| `tone` | `default` · `primary` · `coral` · `success` |
| 可选 | `onRemove` |

覆盖：percent buttons、badges、tabs、tags。

**`coral`**：Figma `accent/primary (coral)` `#c85c3f` — LIVE / MAX / 选中边框角色；**勿**与 `primary` `#e86a43` 混用。折扣强调用 token `coral-emphasis`（非 Chip tone）。

**Field-adjacent action**：Genesis MAX · Community Bind → `Chip variant="soft" tone="coral"` + `fieldActionChipClass`（`h-11` / `rounded-control`）；**不是** `DappActionButton` / Button secondary。

**禁止**：在 Chip 内 hand-roll typography
**依赖**：Text（§2）
**探针**：swap percent · season badge · htab · genesis MAX · community Bind
**Gate**：`variant` = **3**；`size` = **3**；`shape` = **2**；`tone` = **4**

---

## §5 Card

| 公开轴 | 值 |
|--------|-----|
| `surface` | `outlined` · `elevated` · `soft` · `inverse` |
| `as` | `article` · `button` · `div` · `section` · `details` · `span` |

| surface | Elevation | radius | padding | 用途 |
|---------|-----------|--------|---------|------|
| outlined | — | `rounded-md` (16px) | `p-3.5` (14px) | 标准边框卡（wcol box、meta、mode card、`DappSideCard`） |
| elevated | E2 (`shadow-card`) | `rounded-md` (16px) | `p-3.5` (14px) | MetricCard、DataTable、`SwapProgramCard`、`DappTableCard`（表壳另抹 `rounded-2xl`+`border-0`+`p-0`，仅阴影） |
| soft | E1 (`shadow-faq`) | `rounded-2xl` (16px) | 无（body 自管 `px-6 py-4.5`） | FAQ / Accordion；浅色 CommunityStat（composite 用 `rounded-lg` + `p-4.5` 抹平 ≡ Figma sc 18） |
| inverse | E3 (`shadow-subtle`) | `rounded-md` (16px) | `p-4` (16px) | 深色 CTA 卡（`WidgetPromoCard`） |

**子组件**：`Card.Header / Title / Description / Content / Footer / Label / Value`

**禁止**：`context` · `fill` · `radius` · `tone` · `hover` 轴；call site 叠 `shadow-*` / `rounded-*` 覆盖 surface 默认。
**Composite 豁免（须文档）**：`CommunityStatCard` / `SwapPromoCard` 可用 className 抹平 radius/pad，**禁止**再叠 `shadow-*` 改 elevation。
**依赖**：Text（§2）
**探针**：mode-card-root · program-card · faq card layout · metric-card · community-stat · swap-promo
**Gate**：`surface` 键 = **4**

---

## §6 Input

| 公开轴 | 值 |
|--------|-----|
| `variant` | `default` · `numeric` · `amount` |
| `size` | `sm` · `md` · `lg` |
| 可选 | `startAdornment` · `endAdornment` · `error` |

覆盖：普通表单输入、swap amount、genesis shares（numeric）、community referrer（default）。

**Placeholder**：`placeholder:text-placeholder`（`--placeholder` ≡ 4175 `oklch(82% 0.011 264)`）。**禁止** `placeholder:text-muted-foreground`。
**未连接金额预览**：`AmountBox` 在 `sessionReady=false` 时用 `text-amount-muted` / `placeholder:text-amount-muted`（≡ 4175 `#c9cfda`）。

**禁止**：call site 手写平行 `<input>` / 输入框内 hand-roll amount typography（社区邀请人等须走 `Input`）
**依赖**：Token（§1）
**探针**：swap amount · genesis shares · community referrer bind
**Gate**：`variant` = **3**

---

## §7 Composite（业务组件）

按 Figma 高频层提取，**不满足 3 调用点或纯视觉容器不提**。

| Composite | Figma 层 | 核心 props | 提升理由 |
|-----------|----------|------------|----------|
| `TopBar` | topbar / tb / tr | `wallet`, `network`, `locale` | 全局 shell |
| `NavRail` | rail / rit | `items`, `activeTab`, `onSelect` | 4 页共用 |
| `PanelHeader` | wh | `title`, `subtitle`, `action` | 4 页共用 |
| `AmountInput` | box / tk / rr / mx | `token`, `value`, `balance`, `onMax` | 真实交互行为 |
| `Segment` | pcts / pct / htab | `options`, `value`, `onChange` | 高频模式 |
| `MetricCard` | sc / mc | `label`, `value`, `hint`, `tone` | 跨页指标 |
| `DataTable` | tbl / trow / cell | `columns`, `rows`, `empty` | cell 614 次 |
| `Accordion` | qa / qhd | `items`, `variant` | 折叠行为 + a11y；实现文件为 `faq-list.tsx`（导出 `FaqList`） |
| `WidgetPromoCard` | promo / pcard | children | 深色 CTA 卡（`Card inverse`）；替代已删 `CalloutCard` |

**内部约定**：
- `FaqList` / `Accordion`：question 走 `Text variant="question"`；answer 走 `variant`（home=`copy` / dapp=`detail`）+ `text-faq`（token `faq`，**不进** Text `tone`）。Chevron：固定 path + CSS `.faq-chevron`（`[data-faq-item][data-state=open]` → `rotate(180deg)` + `color: var(--primary)`；关态 `foreground@40%`）；禁换 path / 禁 React 条件 class 切旋转。展开高度走 `.faq-answer-panel` grid `0fr→1fr`。
- `CommunityProgramCard`：Figma `pcard` `4040:7354` — `elevated` · `p-5` · `gap-2` · coral accent（≠ primary）。字阶走 Text `eyebrow` / `headline` / `copy`（rem + `site-fluid`）；**禁** `text-[Npx]` / `max-w-[Nch]` 锁死。
- `DappCollapsibleSection`：高度 `grid-template-rows 0fr→1fr`（320ms）；chevron `rotate` 同曲线；`overflow-visible` **仅**在展开 settle 后挂上（展开中保持 clip）；CSS 须有 `[data-open=true] .overflow-visible { overflow: visible }` 覆盖基类 `overflow:hidden`（否则表卡 `shadow-card` 被裁）。
- `Card.Description`：多数次级文案 → `tone="muted-foreground"`。
- `WidgetPromoCard` 内部使用 `Card surface="inverse"`（深色 CTA；原 `CalloutCard` 已删，零 call site）。
- `DappInlineAlert`（`src/shared/ui/dapp-inline-alert.tsx`）：destructive 内联提示 chrome（border / wash / pad / `text-destructive`）；`density` = `compact` | `comfortable`；字阶仍走 Text `copy`；**不是** Card surface，**勿**并入 `inverse`。间距（`mt`/`mx`/`mb`）留 call site。
- `dappDarkBanner`（`src/shared/ui/dapp-dark-banner.tsx`）：暗色横幅 chrome（`bg-dark` + `shadow-card` + `rounded-md`）；RewardsHero / GenesisGlobal 消费；**≠** Card `inverse`（E3 / WidgetPromoCard）。
- `aegisDialogCloseClass`（`aegis-responsive-dialog.tsx`）：DApp modal/sheet 关闭钮（details / slippage）；Connect 仍用 `.aegis-wallet-connect-close`；Home popup 深色圆钮独立；**H5 drawer** 关闭为透明 X（≠ modal close）。
- `LanguageMenu`：topbar 密度 trigger（`min-h-9` / H5 `7.5`）+ `coral-wash` hover；**不是** Button `secondary`；panel `shadow-menu`。
- `DappTablePagination`：视觉 SSOT = Figma `4067:258`（控件 `rounded-[6px]` · 页码 pill `w-20 h-8` · `text-coral`/`bg-accent` ≡ Chip soft coral · 控件簇 gap 4px ·「每页」间距 16px · 文案 12 muted）；页码箭头：关菜单 `rotate-180`（向下）· 开菜单 `rotate-0`（向上）· 220ms；**不是** Button；下拉菜单不在该节点，保留 portal。
- `swapFlowButtonClass`（`swap-widget-composites.tsx`）：Figma `flb` — 34×34 · `rounded-control` · border · card；Trade flip / Flash divider 共用；**不是** `IconButton`（详情折叠）。禁 call site / SSOT 再写 `rounded-[11px]`。
- `ResponsiveTable` / `DataTable` 表头：≡ Community「我的社区成员」— `text-muted-foreground`；禁 tab 特判 `text-foreground/30` / `headCellClassName` 分叉。
- `DappTableCard`：外框 **无** `border`（仅 `shadow-card`）；表头/行/页脚内部分隔线保留。

**禁止**：把 `box`、`dl`、`r`、`ovc`、`tcard`、`qlink` 等纯视觉层提升为 Composite。

---

## §8 断点白名单

允许 `max-dapp:` / `dapp:` **仅 layout** 的文件：

- `shell-layout.ts` · `dapp-shell.tsx` · `dapp-topbar.tsx` · `dapp-mobile-nav.tsx`
- `dapp-widget-frame.tsx` · `dapp-detail-layout.ts` · `responsive-table.tsx` · `dapp-table-*`
- `wallet-*-modal.tsx` · `swap-slippage-modal.tsx` · `aegis-responsive-dialog.tsx`
- `static-layout.ts` · `views/home/components/*`
- Foundation 定义文件：**layout 断点 only** — `text.tsx` · `button.tsx` · `chip.tsx` · `card.tsx` · `input.tsx`

**禁止**：上述以外 `max-dapp:(text-|font-|leading-|tracking-)`

**不可删**：`legacy-breakpoints.css` 中 `@custom-variant dapp` / `max-dapp`

---

## §9 组件地图（实现已落地）

| 层 | 文件 / 入口 | Gate |
|----|-------------|------|
| Token | `tokens.json` → `theme.css` / `tokens.ts` | §1 |
| Text | `shared/ui/text.tsx` | 10 variant · 7 tone |
| Button | `shared/ui/button.tsx` | 4×3×2 |
| Chip | `shared/ui/chip.tsx` | 3×3×2×4 |
| Card | `shared/ui/card.tsx` | 4 surface |
| Input | `shared/ui/input.tsx` | default / numeric / amount |
| Composite | FaqList · WidgetPromoCard · MetricCard · Segment · AmountBox · WidgetHeader · … | 见 §7；禁平行 chrome |

新切片：**先查本表有无 owner** → 有则扩 call site / className；无则先改 api 再实现。

---

## 修订

| 版本 | 说明 |
|------|------|
| v3.0 | Baseline 维护态：去掉 P0–P8 交付矩阵叙事；入口与 runbook 对齐 |
| v3.1 | panel/section tracking `-0.04em`（≡ Figma Genesis 标题）；正文保持 `-0.02em` |
| v2.25 | CommunityProgramCard：label/CTA `text-coral` ≡ Figma `#c85c3f` |
| v2.11–v2.24 | 见 git 历史（tabular 删除 · flb · Button scale · FAQ/Pagination 动效等） |
| v2.1–v2.10 | 命名定稿 · Card/Button/Chip/Input/Composite 收束 |
