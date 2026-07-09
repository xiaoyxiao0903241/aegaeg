# Foundation 公开 API（L2 · 十组件对称 SSOT）

> **流程**：[`runbook.md`](./runbook.md) · **验收**：[`verification.md`](./verification.md) · **设计审计**：[`design-system-audit-v2.md`](./design-system-audit-v2.md)
>
> **原则**：每组件 **键数 = 类型字面量数** · **无 alias 层** · **无场景分叉（context）** · Tier B 不进 Text · **细微差异用 className 抹平，不扩轴**

每节结构一致：**公开轴 · 禁止 · 依赖 · Swap 探针 · API gate**

---

## §1 Token（源 SSOT）

`src/shared/styles/tokens/tokens.json` 为唯一真源，CI 生成 `theme.css` 与 `tokens.ts`。

| 维度 | 集合 | 键数 |
|------|------|------|
| color | `background` · `foreground` · `card` · `muted-foreground` · `primary` · `primary-soft` · `primary-foreground` · `primary-bright` · `coral` · `coral-emphasis` · `band` · `faq` · `skeleton` · `modal-overlay` · `warning` · `footer` · `success` · `success-soft` · `border` · `dark` · `inverse` · `inverse-muted` · `destructive` · `token-*` | 公开语义；工程色见 tokens.json |
| type | `caption` · `eyebrow` · `copy` · `detail` · `question` · `headline` · `brand` · `section` · `panel` · `figure` | 10 |
| space | `1(4)` · `2(6)` · `3(8)` · `4(10)` · `5(12)` · `6(14)` · `7(16)` · `8(24)` · `9(40)` | 9 |
| radius | `sm(8)` · `md(10)` · `lg(12)` · `xl(16)` · `full` | 5 |
| shadow | `faq(E1)` · `card(E2)` · `subtle(E3)` · `elevated-strong(E4)` · `window(E5)` · `modal(E6)` | 6 |

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
| question | 14 | 15 | semibold | FAQ 问题（H5 ≡ 4175 `text-sm`） |
| headline | 16 | 15 | semibold | 卡小标题 |
| brand | 17 | 18 | semibold | topbar brand / rank |
| section | 18 | 16 | semibold | section heading (dl) |
| panel | 21 | 22 | semibold | widget / page header |
| figure | 22 | 23 | semibold | 金额、数值 |

**禁止**：`weight` prop · `panel-title` / `table-cell` / `on-dark` · `deprecatedAliases`
**className 显示阶覆盖**：若 `className` 含字号 utility（`text-xs`…`text-9xl` / `text-[…]`，含 `max-*:text-*` / `!text-*`），`Text` 剥掉 size / leading / tracking type token，**保留** `font-[var(--type-*-weight)]`（call site 通常只覆盖字号/行高）。避免残留 tracking 把标题挤窄，同时不丢 variant 字重。
**依赖**：P0 token
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
**Hover SSOT**（全 variant 一致，禁 call site 叠 `shadow-primary-hover-*`）：
- `primary`：lift `-translate-y-px` + `shadow-primary-hover`
- `secondary`：lift + `shadow-card` + `border-coral-hover-border`
- `ghost`：lift + `border-primary` / `text-primary`（无额外影）
- `link`：无 lift / 无影
**Typography**：`link` 用 `font-normal text-primary`，不 hand-roll 平行字阶文件
**禁止**：call site 用 `!min-h-*` / `!text-*` 绕过 size · `shape="chip"`（拆到 Chip）；H5 勿再叠平行 `max-dapp:min-h-*` 改高度；call site 叠 `hover:shadow-primary-hover-xl` 等改 hover
**依赖**：P1-Text
**探针**：home hero CTA · swap CTA · claim · genesis promo Join · connect promo · community shareholder
**Gate**：`variant` = **4**；`size` = **3**；`shape` = **2**

---

## §4 Chip（新增）

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
**依赖**：P1-Text
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
| inverse | E3 (`shadow-subtle`) | `rounded-md` (16px) | `p-4` (16px) | 深色 CTA 卡（CalloutCard、WidgetPromoCard） |

**子组件**：`Card.Header / Title / Description / Content / Footer / Label / Value`

**禁止**：`context` · `fill` · `radius` · `tone` · `hover` 轴；call site 叠 `shadow-*` / `rounded-*` 覆盖 surface 默认。
**Composite 豁免（须文档）**：`CommunityStatCard` / `SwapPromoCard` 可用 className 抹平 radius/pad，**禁止**再叠 `shadow-*` 改 elevation。
**依赖**：P1-Text
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
**依赖**：P0 token
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
| `CalloutCard` | promo / pcard / tc | `title`, `description`, `cta` | 深色 CTA / 提示卡 |

**内部约定**：
- `FaqList` / `Accordion`：question 走 `Text variant="question"`；answer 走 `variant`（home=`copy` / dapp=`detail`）+ `text-faq`（token `faq`，**不进** Text `tone`）。
- `Card.Description`：多数次级文案 → `tone="muted-foreground"`。
- `CalloutCard` 内部使用 `Card surface="inverse"` + `Text tone="inverse"`。
- `DappInlineAlert`（`src/shared/ui/dapp-inline-alert.tsx`）：destructive 内联提示 chrome（border / wash / pad / `text-destructive`）；`density` = `compact` | `comfortable`；字阶仍走 Text `copy`；**不是** Card surface，**勿**并入 `CalloutCard` / `inverse`。间距（`mt`/`mx`/`mb`）留 call site。
- `dappDarkBanner`（`src/shared/ui/dapp-dark-banner.tsx`）：暗色横幅 chrome（`bg-dark` + `shadow-card` + `rounded-md`）；RewardsHero / GenesisGlobal 消费；**≠** Card `inverse`（E3 / CalloutCard）。
- `aegisDialogCloseClass`（`aegis-responsive-dialog.tsx`）：DApp modal/sheet 关闭钮（details / slippage）；Connect 仍用 `.aegis-wallet-connect-close`；Home popup 深色圆钮独立；**H5 drawer** 关闭为透明 X（≠ modal close）。
- `LanguageMenu`：topbar 密度 trigger（`min-h-9` / H5 `7.5`）+ `coral-wash` hover；**不是** Button `secondary`；panel `shadow-menu`。
- `DappTablePagination`：视觉 SSOT = Figma `4067:258`（控件 `rounded-[6px]` · 页码 pill `w-20 h-8` · `text-coral`/`bg-accent` ≡ Chip soft coral · 控件簇 gap 4px ·「每页」间距 16px · 文案 12 muted）；**不是** Button；下拉菜单不在该节点，保留 portal。
- `swapFlowButtonClass`（`swap-widget-composites.tsx`）：Figma `flb` `4040:1662` — 34×34 · `rounded-[11px]` · border · card；Trade flip / Flash divider 共用；**不是** `IconButton`（详情折叠）。
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

## §9 P0-P7 交付矩阵

| 阶段 | 组件/任务 | 键数 gate | 同 PR 范围 |
|------|-----------|-----------|------------|
| P0 | Token JSON + 生成 CSS/TS | 见 §1 | theme.css / tokens.ts / 删 legacy color class |
| P1 | Text | 10 variant · 7 tone | 全仓 `variant=` / `tone=` |
| P2 | Card | 4 surface | 全仓 `surface=` |
| P3 | Chip（新增） | 3×2×2×4 | 替换 pct / badge / tab；tone 含 coral |
| P4 | Input | 3 variant | 替换 amount-input、shares field |
| P5 | Button | 4×3×2 | 全仓 Button props |
| P6 | Composite | 9 个 | 按依赖顺序逐个提取 |
| P7 | 按页替换 | — | Swap → Genesis → Rewards → Community → Home |
| P8 | 清债 | — | 删 dapp-type-scale.ts / 旧 color class / 文档同步 |

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 component-anatomy + text-refactor-plan；六节对称 |
| v2.1 | 按用户最终命名调整：Text caption/eyebrow/copy/panel/figure；Card 4 surface；Composite NavRail/PanelHeader/AmountInput/Segment/Accordion/CalloutCard；Input default/numeric/amount；Button shape rounded |
| v2.2 | P7 完成：按页替换 Swap / Genesis / Rewards / Community / Home；删除旧 swap 组件；新增 `swap-panel-toggle.tsx` 承接 PC 详情面板切换 |
| v2.3 | Button size 高度：sm **42**（卡内）· md **44**（外部）· lg **48**；暗色 promo 38 走 `DappActionButton density="inverse"` |
| v2.4 | `DappInlineAlert`：destructive 内联 chrome SSOT；`compact` / `comfortable`；禁并 CalloutCard |
| v2.5 | Card surface 契约：`SwapPromoCard` 去叠 `shadow-subtle`；浅色 `CommunityStatCard` → `soft`（sc≠ovc） |
| v2.6 | `dappDarkBanner`：RewardsHero / GenesisGlobal 唯一暗色横幅 chrome；≠ Card inverse |
| v2.7 | `SwapProgramCard` / `DappTableCard` 走 Card `elevated`；表壳保留 2xl+border；thirdweb 按钮迁 Button 另切片 |
| v2.8 | Button hover SSOT：去 Community `shadow-primary-hover-xl`；ghost 对齐 lift；slippage Confirm → Button |
| v2.9 | 隐藏面：WalletDetails 去 `h-11`/内嵌 Text；`aegisDialogCloseClass`；token 行 → Card outlined |
| v2.10 | LanguageMenu DRY；mobile-nav 标签 ≡ `dev` text-sm；删未用 `shadow-primary-hover-xl` |
| v2.11 | 删除 Text `tabular`；数字定稿比例字（禁 `tabular-nums`） |
| v2.12 | Community Bind：`Input` + `fieldActionChipClass`（≡ Genesis MAX）；删 `DappActionButton` `shape=inline` |
| v2.13 | CommunityStat 浅色 sc ≡ Figma `4040:7313`（ink / coral / radius-lg） |
| v2.14 | `swapFlowButtonClass` ≡ Figma flb；Trade/Flash 中间钮共用 |
| v2.15 | flb 显式 `rounded-[11px]`；InviteFlow desc = muted 70%；表壳去外边框 |
| v2.16 | Button / flb：220ms soft ease + active 按下回落 |
