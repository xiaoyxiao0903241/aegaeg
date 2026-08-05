# UI Tokens / 组件公开轴（SSOT）

> **内容**：设计 token 与 primitive 公开轴（不是后端 API）。  
> **流程**：[`runbook.md`](./runbook.md) · **用法**：[`component-usage.md`](./component-usage.md)  
> **原则**：键数 = 类型字面量数 · 无 alias · 细微差异用 `className` 抹平

每节：**公开轴 · 禁止**

---

## §1 Token（源 SSOT）

`src/shared/styles/tokens/tokens.json` 为唯一真源，CI 生成 `theme.css` 与 `tokens.ts`。

| 维度   | 集合                                                                                                                                                                                                                                                                                                                                            | 键数                           |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| color  | `background` · `foreground` · `card` · `muted-foreground` · `primary` · `primary-soft` · `primary-foreground` · `primary-bright` · `coral` · `coral-emphasis` · `band` · `faq` · `skeleton` · `modal-overlay` · `warning` · `footer` · `success` · `success-soft` · `border` · `dark` · `inverse` · `inverse-muted` · `destructive` · `token-*` | 公开语义；工程色见 tokens.json |
| type   | `caption` · `eyebrow` · `support` · `copy` · `detail` · `question` · `headline` · `brand` · `section` · `panel` · `figure` · `stat`                                                                                                                                                                                                             | 12                             |
| space  | `1(4)` · `2(6)` · `3(8)` · `4(10)` · `5(12)` · `6(14)` · `7(16)` · `8(24)` · `9(40)`                                                                                                                                                                                                                                                            | 9                              |
| radius | `tight(6)` · `chip(9)` · `control(11)` · `faq(12)` · `sm(14)` · `md(16)` · `lg(18)` · `xl(28)` · `full`                                                                                                                                                                                                                                         | 9                              |
| shadow | `faq(E1)` · `card(E2)` · `subtle(E3)` · `elevated-strong(E4)` · `window(E5)` · `modal(E6)` · `modal-panel(E7)` · `tooltip(E8)` · `menu(E9)` · `dropdown(E10)`                                                                                                                                                                                   | 10                             |

**禁止**：新增 `--ink-strong`、`--faq-text`、`--on-dark`、`--coral-bright` 等代码臆造色（深底亮珊瑚用正式 token `primary-bright` ≡ Figma `accent/coral-bright`）。

---

## §2 Text

| 公开轴    | 值                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant` | **12 键**：`caption` · `eyebrow` · `support` · `copy` · `detail` · `question` · `headline` · `brand` · `section` · `panel` · `figure` · `stat` |
| `tone`    | `foreground` · `muted-foreground` · `primary` · `primary-bright` · `success` · `inverse` · `inverse-muted`                                     |
| 可选      | `as`                                                                                                                                           |

**数字**：比例字（Montserrat 默认字形）。**禁止** `tabular` prop / `tabular-nums`。列对齐若需要，用布局/表格，不靠等宽数字。

### 12 variant（仅此）

| variant  | PC  | H5  | weight   | 用途                                                              |
| -------- | --- | --- | -------- | ----------------------------------------------------------------- |
| caption  | 10  | 11  | normal   | meta / rail label；badge 等 Medium 在 call site `font-medium`     |
| eyebrow  | 11  | 12  | semibold | uppercase kicker                                                  |
| support  | 12  | 13  | normal   | 次级说明：等级卡底栏、进度/余额 meta、widget 副标题、分页 chrome  |
| copy     | 13  | 14  | normal   | **默认**正文：表头/单元格、pill、主说明、控件旁文案               |
| detail   | 14  | 15  | normal   | FAQ 答案、长说明                                                  |
| question | 14  | 15  | semibold | FAQ 问题                                                          |
| headline | 16  | 17  | semibold | 卡小标题                                                          |
| brand    | 17  | 18  | semibold | topbar brand / rank                                               |
| section  | 18  | 19  | semibold | section heading (dl)；tracking **-0.04em**                        |
| panel    | 21  | 22  | semibold | widget / page header；tracking **-0.04em**                        |
| figure   | 24  | 25  | semibold | 金额、数量输入（amtBox 字盒；leading 见 `--type-figure-leading`） |
| stat     | 32  | 32  | bold     | 结果区大额（rcard 收益总额等）                                    |

**H5 字号策略（≡ `dev` `mobile-type-scale` / `dapp-scale`）**：语义 `--type-*` 与 Tailwind `--text-*` 在 `max-width: 820px` 上均为 **PC +1px**；不以 Figma H5 偏小稿为准。

**字距（Figma Genesis `31:2`）**：正文档（caption/support/copy/detail/…）**-0.02em**；`section`/`panel` 标题 **-0.04em**（≡ 18→`-0.72px`、21→`-0.84px`）；`headline` **-0.03em**；`eyebrow` **+0.08em**。禁 call site `tracking-normal` 抹平正文/标题字距（Input/Button 控件内文除外）。

**可选 `as`**：含 `label`（form a11y，如 sr-only）。
**禁止**：`weight` prop · `panel-title` / `table-cell` / `on-dark` · `deprecatedAliases`
**className 显示阶覆盖**：若 `className` 含字号 utility（`text-xs`…`text-9xl` / `text-[…]`，含 `max-*:text-*` / `!text-*`），`Text` 剥掉 size / leading / tracking type token，**保留** `font-[var(--type-*-weight)]`（call site 通常只覆盖字号/行高）。避免残留 tracking 把标题挤窄，同时不丢 variant 字重。
**依赖**：Token（§1）
**探针**：Swap catalog 全部 Text owner 行 · Home section titles
**Gate**：`text.tsx` variant 键 = **12** · `TextVariant` 联合 = 12 · `tone` = 7

`inverse-muted` = 深底次级文案（Figma/dev `#b8c0ce`）。**禁止**用 `inverse` + `opacity-*` 近似；**禁止** call site `text-on-dark`。
`primary-bright` = 深底珊瑚强调（Figma `accent/coral-bright` `#f4a98f`）。暗色卡 kicker / volume 用此 tone；**禁止**用 `primary` 近似，**禁止** call site `text-coral-bright`。

---

## §3 Button

| 公开轴    | 值                                         |
| --------- | ------------------------------------------ |
| `variant` | `primary` · `secondary` · `ghost` · `link` |
| `size`    | `sm` · `md` · `lg`                         |
| `shape`   | `pill` · `rounded`                         |

**Size 高度 SSOT**（按钮显示阶，**不是** Text `copy` token）：

- `sm` = **36**（`min-h-9` · `px-4.5`）· 默认 pill / topbar Connect / Enter App · `text-sm` · leading-none — Figma `4040:220`
- `md` = **44**（`min-h-11`）· 卡外 / widget 栈主 CTA · `text-sm` · leading-snug · `px-5`
- `lg` = **48**（`min-h-12`）· Home hero · Community「参与共建」· `text-base` · leading-none · `px-6`（H5：`px-5` / `text-sm`）
  **`CtaButton` density 高度**（叠在 size 上，**不是**第 4 个 size）：
- `inverse` = **38**（`min-h-9.5`）· 暗色 promo CTA
- `card` = **42**（`min-h-10.5`）· 白卡 / outlined·elevated 卡内 CTA — Figma claim `4040:4904`
- `external` = **44**（→ `size=md`）· 卡外主 CTA（Swap / Genesis 认购等）
- `modal` = **46**（`min-h-11.5`）· Dialog / wallet modal 主按钮 — Figma `62:70` / `74:129`
- `hero` = **48**（→ `size=lg`）· Community 左栏「参与共建」— Figma `4040:7307`；与 Home hero `Button size="lg"` 同高
  **Topbar Connect** 保持 **36**（`Button sm`），不走 `density="card"`。
  **Modal 内 raw `Button`**：须 `className="min-h-11.5"`（与 `density="modal"` 同高），勿只写 `size="md"`。
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

| 公开轴    | 值                                          |
| --------- | ------------------------------------------- |
| `variant` | `solid` · `soft` · `outlined`               |
| `size`    | `sm` · `md` · `lg`                          |
| `shape`   | `pill` · `rounded`                          |
| `tone`    | `default` · `primary` · `coral` · `success` |
| 可选      | `onRemove`                                  |

覆盖：percent buttons、badges、tabs、tags。

**`outlined` + `default`**：未选 htab / 分立 pill — `bg-card` + `border-border` + **`text-foreground/40`**（Figma `text/muted` 40%；**勿**用 `muted-foreground` 70%）。

**`coral`**：Figma `accent/primary (coral)` `#c85c3f` — LIVE / MAX / 选中边框角色；**勿**与 `primary` `#e86a43` 混用。折扣强调用 token `coral-emphasis`（非 Chip tone）。选中 htab 字色由 `PillTabs` 叠 `text-coral-emphasis`（样本 Grant `4719:2447`）。

**Field-adjacent action**：Genesis MAX · Community Bind → `FieldActionChip`（`Chip soft` + `coral` · `h-11` / `rounded-control`）；**不是** `CtaButton` / Button secondary。

**禁止**：在 Chip 内 hand-roll typography
**依赖**：Text（§2）
**探针**：swap percent · season badge · htab · genesis MAX · community Bind
**Gate**：`variant` = **3**；`size` = **3**；`shape` = **2**；`tone` = **4**

---

## §5 Card

| 公开轴    | 值                                                            |
| --------- | ------------------------------------------------------------- |
| `surface` | `outlined` · `elevated` · `soft` · `inverse`                  |
| `as`      | `article` · `button` · `div` · `section` · `details` · `span` |

| surface  | Elevation            | radius               | padding                       | 用途                                                                                                         |
| -------- | -------------------- | -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| outlined | —                    | `rounded-md` (16px)  | `p-4` (16px)                  | 标准边框卡（`InteractiveCard` hub 左卡 / meta / `SideCard`；禁 call site 再抹 `p-*`/`rounded-*`/`shadow-*`） |
| elevated | E2 (`shadow-card`)   | `rounded-md` (16px)  | `p-4` (16px)                  | 右栏指标瓦 B+D；`ExchangeProgramCard`、`Table`（表壳另抹 `rounded-2xl`+`border-0`+`p-0`，仅阴影）            |
| soft     | E1 (`shadow-faq`)    | `rounded-2xl` (16px) | 无（body 自管 `px-6 py-4.5`） | FAQ / Accordion；浅色 CommunityStat（composite 用 `rounded-lg` + `p-4.5` 抹平 ≡ Figma sc 18）                |
| inverse  | E3 (`shadow-subtle`) | `rounded-md` (16px)  | `p-4` (16px)                  | 深色 CTA 卡（`WidgetPromoCard`）                                                                             |

**子组件**：`Card.Header / Title / Description / Content / Footer / Label / Value`（**通用内容卡**字阶合同；≠ Hub 入口）

**Hub 可点壳**：`InteractiveCard`（`Card outlined` + 交互）— 无文案子件；内容用 `Text`；见 [`component-usage.md`](./component-usage.md)「B+D」。

**用法**：同 chrome 入口卡 / hub tile 的 props 合同与「可点才 button」见 [`component-usage.md`](./component-usage.md)。

**禁止**：`context` · `fill` · `radius` · `tone` · `hover` 轴；call site 叠 `shadow-*` / `rounded-*` 覆盖 surface 默认。
**Composite 豁免（须文档）**：`CommunityStatCard` / `ExchangePromoCard` 可用 className 抹平 radius/pad，**禁止**再叠 `shadow-*` 改 elevation。
**依赖**：Text（§2）
**探针**：InteractiveCard hub · program-card · faq card layout · elevated 右栏瓦 · community-stat · swap-promo
**Gate**：`surface` 键 = **4**

---

## §6 Input

| 公开轴    | 值                                          |
| --------- | ------------------------------------------- |
| `variant` | `default` · `numeric` · `amount`            |
| `size`    | `sm` · `md` · `lg`                          |
| 可选      | `startAdornment` · `endAdornment` · `error` |

覆盖：普通表单输入、swap amount、genesis shares（numeric）、community referrer（default）。

**Placeholder**：`placeholder:text-placeholder`（`--placeholder` ≡ 4175 `oklch(82% 0.011 264)`）。**禁止** `placeholder:text-muted-foreground`。
**未连接金额预览**：`AmountBox` 在 `sessionReady=false` 时用 `text-amount-muted` / `placeholder:text-amount-muted`（≡ 4175 `#c9cfda`）。
**聚焦（兑换金额卡）**：`AmountBox` 根 `focus-within:border-coral`（Figma `#c85c3f` 卡描边，非 `--primary`）；`Input variant=amount` 用 `caret-coral` + `focus:border-0`（禁止 input 自身描边）。Buy 只读 + `tabIndex=-1`，不抢焦点。

**禁止**：call site 手写平行 `<input>` / 输入框内 hand-roll amount typography（社区邀请人等须走 `Input`）
**依赖**：Token（§1）
**探针**：swap amount · genesis shares · community referrer bind
**Gate**：`variant` = **3**

---

## §7 Composite（跨页 chrome）

> **命名**：跨 rail / 跨页复用的 chrome composite **不是**「可内置业务数据或 locale 文案」。domain options / 文案由 call site + i18n 传入；见根 `AGENTS.md` §2。

按 Figma 高频层提取，**不满足 3 调用点或纯视觉容器不提**。

| Composite          | Figma 层                           | 核心 props                                                                        | 提升理由                                                                                                                    |
| ------------------ | ---------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `TopBar`           | topbar / tb / tr                   | `wallet`, `network`, `locale`                                                     | 全局 shell                                                                                                                  |
| `NavRail`          | rail / rit                         | `items`, `activeTab`, `onSelect`                                                  | 4 页共用                                                                                                                    |
| `PanelHeader`      | wh                                 | `title`, `subtitle`, `action`                                                     | 4 页共用                                                                                                                    |
| `AmountBox`        | box / tk / rr / mx                 | `token`, `value`, `balance`, `sessionReady`                                       | 金额输入卡                                                                                                                  |
| `Segment`          | seg / pcts / htab                  | `options`, `value`, `onChange`, `aria-label`, `size` sm\|md\|lg                   | 滑动白底 pill（≠ Chip）；高度 token；options/文案 i18n                                                                      |
| `ClaimSplitSlider` | slider `4812:221`                  | `value` (release%), `onChange`, `aria-label`                                      | 双色轨 + `%` thumb；Radix；文案由 call site 传入                                                                            |
| `Card` elevated    | —                                  | children                                                                          | elevated chrome SSOT；右栏数据卡优先走 `Tile`（`app/shell/tile.tsx`）                                                       |
| `Tile`             | `Label` / `Note`                   | 主值 children；旁注用 `Tooltip.Info`                                              | 组合式右栏数据卡；Note=另起一行；禁 layout variant / MetricCard                                                             |
| `Carousel`         | Content/Item/Indicators            | `opts` · `autoplayMs` · `syncIndex`；Content about\|peek；Indicators about\|plain | 组合式轮播（Embla 不漏 api）；indicator active 须 `h-1.5`                                                                   |
| `Empty`            | —                                  | `title` · `body?`                                                                 | 纯文案空态；偏大 pad；`Table.Empty` / `Chart.Empty` 复用                                                                    |
| `Chart`            | Header/Plot/Empty                  | `surface`；Plot 吃 `points`                                                       | 组合式面积图；业务见 StakingTvlChart / StakingCurveChart                                                                    |
| `List`             | Label / Value                      | `items` · 行距 `gap-2.5` · value 原样（禁隐式 CountValue）                        | 键值 infoBox 行轨（无 Card）；替代 DappMeta*                                                                                |
| `Steps`            | Item                               | `align` start\|center · `activeIndex?`                                            | 组合式步骤条（无 Card）；PC 横 / H5 竖                                                                                      |
| `Detail`           | —                                  | children                                                                          | 右栏详情壳（pad + 节距 gap-8.5 / max-dapp:gap-6）；原 DappDetailPage                                                        |
| `Section`          | Title / Description                | `collapsible?` · `defaultOpen?` · `reveal?`                                       | 右栏内容节；无节间 mt；节内 `gap-4`；Title/Description 无 className；`collapsible` 隐含 reveal + settle 后 overflow-visible |
| `Table`            | Header/Body/Cell/Footer/Pagination | `headers`, `rows`, `empty`, …                                                     | 组合式 DApp 表（`shared/components/table.tsx`）                                                                             |
| `Accordion`        | qa / qhd                           | `items`, `variant`                                                                | 折叠行为 + a11y；实现文件为 `faq.tsx`（导出 `Faq`）                                                                         |
| `WidgetPromoCard`  | promo / pcard                      | children                                                                          | 深色 CTA 卡（`Card inverse`）                                                                                               |

**内部约定**：

- `Faq` / `Accordion`：question 走 `Text variant="question"`；answer 走 `variant`（home=`copy` / dapp=`detail`）+ muted。折叠箭头 ≡ `CollapseChevron`（与 `Section.collapsible` 同 SSOT：收起 `ChevronDown`+foreground@40%，展开 rotate-180+primary）；展开高度走 `.faq-answer-panel` grid `0fr→1fr`。DApp 项圆角稿 `12` → `rounded-faq`（禁 `rounded-xl`：本仓 xl=28px）；pad `px-4 py-4.5`；**禁** call site `text-[Npx|Nrem]` / `rounded-[Nrem]` 覆盖 type/radius token（字阶走 `Text` variant）。
- `Segment`：Figma `seg` 滑动白底 pill（闪兑样本 `4430:410`）；动效 `220ms` · `cubic-bezier(0.22, 1, 0.36, 1)`。thumb = 白底 + **微阴影** `0 1px 2px rgba(18,26,51,0.06)`（禁 `shadow-sm` / card elevation）；**按选中 tab 实测 left/width，以轨宽 % 写出**（禁硬编码 gap/pad px 常量；轨 `gap`/`p`/`h` 一律 Tailwind spacing token）。列宽 `auto` hug。**`size`**：`sm`=`h-6`（图区间）| `md`=`h-9`（默认，周期/指标；对齐 Figma `seg` 4448:601 轨高 36）| `lg`=`h-10`（闪兑/涡轮）；call site 按稿面选。项 padding 随 size（md/lg：`px-3`；sm：`px-2.5`）。选中字色由 call site `tone` 传入：`coral`（默认，样本 `4448:601`）| `ink`（闪兑 tabs，semibold）。**Figma `htab`（珊瑚 soft / outlined 分立 pill，样本 hub `4371:233`）走 Chip，不走 Segment。** `options` / `aria-label` 由 call site（i18n）传入。`options[].disabled` 支持单档禁用。开仓档 ≠ 领取释放档 ≠ 复投档 — 由业务 call site 组 options。`PercentButtonRow` 仍为 Chip 网格，≠ Segment 合同。
- `ClaimSplitSlider`：`@radix-ui/react-slider`；左轨 `bg-primary`（释放%）· 右轨 `--app-claim-restake`（复投%）· 白底内嵌 `%` thumb；`aria-label` 必填（i18n）。
- `CommunityProgramCard`：Figma `pcard` `4040:7354` — `elevated` · `p-5` · `gap-2` · coral accent（≠ primary）。字阶走 Text `eyebrow` / `headline` / `copy`（rem + `site-fluid`）；**禁** `text-[Npx]` / `max-w-[Nch]` 锁死。
- `Detail`：右栏详情壳；`flex flex-col gap-8.5 max-dapp:gap-6`（节距 SSOT；PC 34 / H5 24）；子级直接列具名 Section（禁 bag Fragment）。
- `Section`：右栏内容节；根 `flex flex-col gap-4`（节内 Title / Description / body 节奏 SSOT；节间距归 Detail）；`Title` 仅 `children`+可选 `id`（`Text section` · `m-0`）；`Description` 仅 `children`（`copy` · `m-0 text-foreground/40`）；**禁** call site `className` 改字阶/间距（`text-xl` fork 等）；**禁** `mt-*` 冒充节距；标题行伴生（CTA / chips）用外层 flex 组合；折叠箭头 ≡ `CollapseChevron`（与 FAQ 同）。`collapsible` **必然** reveal；高度 `grid-template-rows 0fr→1fr`（320ms）；折叠内层亦 `flex flex-col gap-4`；展开 settle 后内置 `overflow-visible`（展开中保持 clip）；CSS 须有 `[data-open=true] .overflow-visible { overflow: visible }` 覆盖基类 `overflow:hidden`（否则表卡 `shadow-card` 被裁）。禁再传 `bodyClassName` / 叠 `reveal`。
- `CollapseChevron`：DApp 开合箭头唯一 owner（`shared/components/collapse-chevron.tsx`）。Lucide `ChevronDown`；收起 foreground@40% · 展开 `rotate-180` + primary；动效 CSS `.collapse-chevron` 280ms / `cubic-bezier(0.2,0.8,0.2,1)`（禁 `duration-280` 等未登记 token）。`size`：`sm` 10 / `md` 12（`--app-icon-xs`）/ `lg` 18（FAQ·Section 默认）。FAQ、`Section.collapsible`、SelectMenu、TokenPicker、TokenChip picker、报价排序、Table.Pagination 页码触发器必须用本件；禁平行 `.faq-chevron` / 稿面 img 开合 / 上下图标对换冒充旋转。
- `Card.Description`：多数次级文案 → `tone="muted-foreground"`。
- `WidgetPromoCard` 内部使用 `Card surface="inverse"`（深色 CTA）。
- `InlineAlert`（`src/shared/components/inline-alert.tsx`）：destructive 内联提示 chrome（border / wash / pad / `text-destructive`）；`density` = `compact` | `comfortable`；字阶仍走 Text `copy`；**不是** Card surface，**勿**并入 `inverse`。间距（`mt`/`mx`/`mb`）留 call site。共享层禁 `Dapp*` 前缀（产品壳前缀只留 `app/shell` / `views/dapp`）。
- `darkBanner`（`src/shared/components/dark-banner.tsx`）：暗色横幅 chrome（`bg-dark` + `shadow-card` + `rounded-md`）；RewardsHero / GenesisGlobal 消费；**≠** Card `inverse`（E3 / WidgetPromoCard）。
- `DialogClose`（`dialog.tsx`）：DApp modal/sheet 关闭钮（details / slippage）；Connect 仍用 `.aegis-wallet-connect-close`；Home popup 深色圆钮独立；**H5 drawer** 关闭为透明 X（≠ modal close）。
- `LanguageMenu`：topbar 密度 trigger（`min-h-9` / H5 `7.5`）+ `coral-wash` hover；**不是** Button `secondary`；panel `shadow-menu`。
- `Table.Pagination`：视觉 SSOT = Figma `4067:258`（控件 `rounded-tight` · 页码 pill `min-w-15.25 h-6`（61×24，与两侧翻页 chevron `size-6` 同高）· `text-coral`/`bg-accent` ≡ Chip soft coral · 控件簇 gap 4px ·「每页」间距 16px · 文案 12 muted）；页码开合箭头 ≡ `CollapseChevron` `size="md"`（禁珊瑚 Up/Down 对换）；**不是** Button。**页码下拉是小号自管 portal**（≠ `DropdownMenu` / `SelectMenu`）：面板与触发器同 `rounded-tight`（6px；禁 `rounded-sm` 大面板圆角）· `p-0` · `shadow-dropdown`；行无圆角、通栏高亮；选中 `bg-accent` + `text-coral`；行高 `--dapp-pagination-menu-item-height`；可见最多 5 行（× 5）。
- `ExchangeFlowButton`（`swap-widget-composites.tsx`）：Figma `flb` — 34×34 · `rounded-control` · border · card；Trade flip（`interactive`）/ Flash divider 共用；**不是** `IconButton`（详情折叠）。禁 call site 再写 `rounded-[11px]`。
- `Table.Body` 列头：≡ Community「我的社区成员」— `text-foreground/40`；禁 tab 特判 / `headCellClassName` 分叉。
- `Table`：外框 **无** `border`（仅 `shadow-card`）；表头/行/页脚内部分隔线保留。`Table.Header` = 卡内顶槽（≠ thead）；`Table.Cell` = 单元格 chrome。

**禁止**：把 `box`、`dl`、`r`、`ovc`、`tcard`、`qlink` 等纯视觉层提升为 Composite。

---

## §8 断点白名单

允许 `max-dapp:` / `dapp:` **仅 layout** 的文件：

- `dapp-shell.tsx` · `dapp-rail.tsx` · `dapp-topbar.tsx` · `dapp-mobile-nav.tsx`
- `dapp-widget-frame.tsx` · `shared/components/detail.tsx` · `shared/components/section.tsx` · `shared/components/table.tsx`
- `shared/components/steps.tsx` · `shared/components/carousel.tsx`
- `wallet-*-modal.tsx` · `swap-slippage-modal.tsx` · `dialog.tsx`
- `static-layout.ts` · `views/home/*`
- Foundation 定义文件：**layout 断点 only** — `text.tsx` · `button.tsx` · `chip.tsx` · `card.tsx` · `input.tsx`

**禁止**：上述以外 `max-dapp:(text-|font-|leading-|tracking-)`

**不可删**：`legacy-breakpoints.css` 中 `@custom-variant dapp` / `max-dapp`

---

## §9 组件地图

| 层        | 文件 / 入口                                                                                                                         | Gate                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Token     | `tokens.json` → `theme.css` / `tokens.ts`                                                                                           | §1                                                      |
| Text      | `shared/components/text.tsx`                                                                                                        | 12 variant · 7 tone                                     |
| Button    | `shared/components/button.tsx`                                                                                                      | 4×3×2                                                   |
| Chip      | `shared/components/chip.tsx`                                                                                                        | 3×3×2×4                                                 |
| Card      | `shared/components/card.tsx`                                                                                                        | 4 surface                                               |
| Input     | `shared/components/input.tsx`                                                                                                       | default / numeric / amount                              |
| Composite | Faq · WidgetPromoCard · Segment · ClaimSplitSlider · AmountBox · WidgetHeader · List · Steps · Carousel · Chart · Empty · Table · … | 见 §7；禁平行 chrome；右栏指标瓦 = Card elevated + Text |

新切片：**先查本表有无 owner** → 有则扩 call site / className；无则先改 api 再实现。
