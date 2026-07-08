# AEGIS X — 推断设计规范 v0.1

> **性质**：从 Figma MCP（DApp 6 帧 + 正式文件 variable）**逆向推断**的规范草案，供设计与工程对齐。  
> **不是**设计师原始 Design System 文档；**不是**工程验收 SSOT。  
> **工程验收 SSOT**：4175 dev computed + [`visual-parity-workflow.md`](./visual-parity-workflow.md)。  
> **Figma 逐页清单**：[`figma-pages-inventory.md`](./figma-pages-inventory.md)（31 UI 帧，MCP 提取）。  
> **冲突裁决**：**dev 分支 effective 样式优先**；Figma 差异记为 delta，供多 agent 讨论后再改代码。

## Figma 来源

| 用途 | File key | 说明 |
|------|----------|------|
| **本次全量 MCP 分析** | [`n8nD6qqAtikNhP3xuH8PRS`](https://www.figma.com/design/n8nD6qqAtikNhP3xuH8PRS/AEGIS-X--Copy---Copy-?node-id=4-2) | 页面 `4:2`「AEGIS X — Website」；DApp + Home + H5 全帧 |
| 正式 SSOT（根 AGENTS §8.4） | `sXWXDvBrLeg5r0NnP1SMZH` | variable 与上表一致，以本文件为长期对齐目标 |

**推断方法**：`get_metadata`（全 canvas）+ `get_design_context`（关键帧）+ `get_variable_defs`；聚合 `text-[Npx]` / `gap-[Npx]` / 组件 `data-name`。

**置信度**：颜色与布局 **高**；字阶 **高**（含 15 / 17px 独立档）；逐 px tracking **中高**。

**与工程 parity 关系**：**新元素 / 缺状态**以 Figma 为准；**回归迁移**仍以 4175 computed 为准（根 AGENTS §8.4）。本文是设计稿目标态，不替代 parity 探针。

---

## 1. 设计原则（推断）

1. **字体**：Montserrat — Regular（正文）、SemiBold（标题 / 数值）。
2. **基准**：PC @ 16px root；H5 `@media (max-width: 820px)` 部分字号 +1px（见 [`dapp-scale.css`](../src/shared/styles/dapp-scale.css)）。
3. **间距**：由容器 `gap` / `padding` 承担；**Text 不设 margin**。
4. **颜色**：优先 Figma variable；游离 hex 视为待收编项。
5. **断点**：821px PC / 820px H5（与代码 `max-dapp` 一致）。

---

## 2. 颜色

### 2.1 Figma variable → 语义

| Figma token | 值 | 语义 | 工程 `Text tone` / 用途 |
|-------------|-----|------|-------------------------|
| `text/ink` | `#0b0e14` | 主文案 | `foreground` |
| `text/body` | `#000000b2` (70%) | 次级正文 | `foreground` / `strong` |
| `text/muted` | `#00000066` (40%) | 标签 / 脚注 | `muted-foreground` / `subtle` |
| `text/inverse` | `#ffffff` | 深底主文 / 按钮白字 | `inverse` |
| `text/on-dark` | `#b8c0ce` | 深底次级 | `on-dark` |
| `accent/primary (coral)` | `#c85c3f` | 品牌强调 | `accent` / `primary` |
| `accent/coral-button` | `#e66a47` | 主按钮底 | Button `primary` |
| `accent/coral-bright` | `#f4a98f` | Kicker 亮珊瑚 | kicker 默认 |
| `accent/coral-soft` | `#fceae2` | 浅珊瑚底 | chip / badge 底 |
| `functional/up` | `#16b979` | 涨 / 成功 | `success` |
| `bg/surface` | `#ffffff` | 卡片面 | `card` |
| `bg/page` | `#f5f6f8` | 页面底 | `background` |
| `bg/dark` | `#11141d` | 深底区块 | Card `tone=dark` |
| `border/default` | `#eceef2` | 默认边框 | `border` |

### 2.2 待收编硬编码

| Hex | 推断映射 |
|-----|----------|
| `#5b6472` | FAQ / secondary 文案 → `muted-foreground` 或单一 `--foreground-secondary` |
| `#0b0e14`（裸写） | → `text/ink` / `foreground` |
| `#8b93a1` | 次级 UI 灰 → `muted-foreground` |

### 2.3 表面规则（推断）

- **卡片**：`bg-card` + `border-border` + `shadow-card`；默认 `rounded-md` (16px)。
- **主 CTA**：`bg-primary` + `text-primary-foreground`；高约 42–44px；`radius/pill`。
- **次按钮**：白底描边胶囊。
- **深底区块**：`bg-dark`；标题 `inverse`，说明 `on-dark`。

---

## 3. 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `radius/pill` | 999 | 按钮、chip、输入 |
| `radius/md` | 16px | 标准卡片 |
| `radius/xl` | 28px | 大面板 / FAQ 卡 |

---

## 4. Typography — 字号（设计稿 px 阶梯）

> **禁止合并设计稿 px**：15px、17px 为 Figma **独立字阶**，不得并入 14 / 16（旧版「15→14、17→16」推断已废止）。

### 4.1 MCP 聚合频次（全文件 `text-[Npx]` 抽样）

| 字号 (px) | 出现次数 | 占比（约） | 备注 |
|-----------|----------|------------|------|
| **13** | 1809 | **~55%** | DApp 正文 / meta / 表格主力 |
| 12 | 417 | ~13% | rail 标签、分页 chip |
| 14 | 357 | ~11% | token 标签、FAQ **答案**、CTA 白字 |
| 11 | 226 | ~7% | kicker、season badge |
| **15** | **193** | **~6%** | FAQ **问题**、H5 步骤卡标题、Home 部分 CTA |
| 18 | 130 | ~4% | 侧栏 lead（少量） |
| 10 | 117 | ~4% | micro badge |
| **17** | **102** | **~3%** | **顶栏品牌**、detail 区块标题、rank 行标题 |
| 22 | 101 | ~3% | amount、widget 主标题 |
| 16 | 93 | ~3% | 卡片小标题 |
| 21 | 63 | ~2% | panel 标题 |
| 30+ | 46+ | ~2% | Home display / metric |

**15px / 17px 结论**：合计 ~9% 文本节点，**不是噪声**；必须在 `@theme` 与 `Text variant` 中保留独立 token。

### 4.2 骨干档位（PC → H5）

H5 规则（与 [`mobile-type-scale.css`](../src/shared/styles/mobile-type-scale.css) 一致）：Tailwind `--text-*` 各档 **+1px**；DApp 专用 var（如 `--dapp-type-body-lg-size`）在 `@media (max-width:820px)` **另表**。

| Token / 档 | PC (px) | H5 (px) | 默认 weight | 主要角色（Figma 层） |
|------------|---------|---------|-------------|----------------------|
| micro | 10 | 11 | Medium | `badge` |
| kicker | 11 | 12 | SemiBold | 区块 kicker（uppercase） |
| xs | 12 | 13 | Regular | `rit` rail 标签、`pct` |
| sm | **13** | 12* | Regular | **正文主力** `box`/`meta`/`r` |
| **md-sm** | **14** | 13* | Reg / SB | `tk` token 名、FAQ 答案 `#5b6472` |
| **md** | **15** | 14* | SemiBold | **`qhd` FAQ 问题**、H5 步骤卡标题 |
| lg | 16 | 15* | SemiBold | 卡片小标题、`ovc` 区块 |
| **lg-md** | **17** | 18 | SemiBold | **`tb` 顶栏品牌**、`wh` 侧栏标题、rank 行标题 |
| xl | 18 | 16* | SemiBold | section lead（少量） |
| 2xl | 21 | 22 | SemiBold | `wh` widget 标题 |
| 3xl | 22 | 23 | SemiBold | `amount` 金额 |
| 4xl | 26–30 | 同档或 +1 | SemiBold | Home display / stat |

\*H5 对 13px 主力字阶：`sm` 在 H5 帧中仍为 **13px**（非 +1）；以各帧 MCP 为准，**不以单一公式覆盖**。

### 4.3 15px / 17px 角色锚点（MCP 实锤）

| px | Tracking | Leading | 典型节点 | 工程 variant 目标名 |
|----|----------|---------|----------|---------------------|
| **15** | **−0.30px**（FAQ）；H5 步骤 **−0.45px** | 1.3（问题）/ 1.2（步骤） | `qa` → `qhd` 问题文案 | `subheadline`（15pt 对齐） |
| **17** | **−0.34px**（顶栏）；detail **−0.68px**（H5） | normal / 1.2 | `topbar` → `tb` 品牌；`dcol` 区块 h3 | `title3`（17px 专用档） |

FAQ 答案为 **14px / Regular / lh 1.5 / −0.28px** — 与 15px 问题成对，**不可合并**。

### 4.4 工程 CSS var（已有 + 待补）

已有：[`dapp-scale.css`](../src/shared/styles/dapp-scale.css) `--dapp-type-*-size`（含 **17px** `--dapp-type-body-lg-size`）。

待补 `@theme`：

```css
--font-size-15: 0.9375rem;   /* 15 — FAQ question */
--font-size-17: 1.0625rem;   /* 17 — topbar brand, title-lg */
--tracking-15: -0.30px;
--tracking-17: -0.34px;      /* detail 区块可用 -0.68px 例外 */
```

---

## 5. Leading（行高）

### 5.1 推断：3 档 rhythm（跟角色，不跟字号）

Figma DApp 统计：约 **55% lh 1.5 · 25% lh 1.3 · 14% lh 1.2**。

| Rhythm | 值 | 绑定条件 |
|--------|-----|----------|
| `leading-body` | **1.5** | Regular + 多行正文 / 说明 |
| `leading-title` | **1.3** | SemiBold 标题 / 数值 / FAQ 问题 |
| `leading-compact` | **1.2** | kicker、badge、H5 大标题、单行 label |

同一字号可有不同 leading（例：13px → 1.5 正文 vs 1.3 数值 vs 1.2 紧凑）。

### 5.2 H5

大标题在 H5 常 **1.3 → 1.2**（与现有 `panel-title`、`amount` 一致）。

### 5.3 建议 CSS（待实施）

```css
:root {
  --dapp-leading-body: 1.5;
  --dapp-leading-title: 1.3;
  --dapp-leading-compact: 1.2;
}
@media (max-width: 820px) {
  :root {
    --dapp-leading-title: 1.2; /* 大标题 H5 */
  }
}
```

**禁止**：为每个 Text variant 写不同 `leading-[1.32]`；variant 只声明默认 rhythm 档位。

---

## 6. Tracking（字距）

### 6.1 推断：跟字号走（px，非 em）

| 字号 | Tracking | 备注 |
|------|----------|------|
| 10 | −0.20px | ~2% |
| 12 | −0.24px | |
| **13** | **−0.26px** | **最高频（DApp 主力）** |
| 14 | −0.28px | |
| 15 | **−0.30px** | FAQ 问题；H5 步骤 −0.45px |
| 16 | −0.48px | SemiBold 标题（~3%） |
| **17** | **−0.34px** ~ **−0.68px** | 顶栏品牌 / detail 区块（见 §4.3） |
| 18 | −0.72px | SemiBold 标题（~4%） |
| 21 | −0.63px ~ −0.84px | 见 panel-title 例外 |
| 22 | −0.54px ~ −0.66px | amount |
| 30 | −0.90px ~ −1.20px | display |

**公式（Regular 正文）**：`trackingPx ≈ −0.02 × fontSizePx`  
**公式（SemiBold 大标题）**：`trackingPx ≈ −0.04 × fontSizePx`（≥16px）

H5 字号变化时，按**新字号**查表，不单独维护 H5 tracking。

### 6.2 例外（不可公式化，保留在 variant 内）

| 角色 | Tracking |
|------|----------|
| `kicker` | **+0.88px** + uppercase |
| `section-eyebrow` | **+1.82px**（H5 +1.68px） |
| `roadmap-phase-label` | **+0.72px** |
| `footer-group-title` | **+0.56px** |
| `program-title` | **+0.08em** |
| `panel-title` | PC −0.84；tab swap/genesis/rewards −0.42；H5 −0.88 |
| `table-cell` / 部分 meta | `0`（dev parity；Figma 多为 −0.26） |

### 6.3 噪声（可忽略 / 合并）

- tracking 差 **≤0.02px**（如 −0.28 vs −0.30）
- 13px vs 14px 局部互换（以 4175 computed 为准）
- Figma 未绑 variable 的孤立 hex

### 6.4 建议 CSS（待实施）

与 `--dapp-type-*-size` 配对，例如：

```css
--dapp-tracking-12: -0.24px;
--dapp-tracking-13: -0.26px;
--dapp-tracking-14: -0.28px;
--dapp-tracking-18: -0.72px;
--dapp-tracking-21: -0.63px;
--dapp-tracking-22: -0.54px;
--dapp-tracking-kicker: 0.88px; /* 正字距例外 */
```

---

## 7. Spacing & Layout

### 7.1 Spacing scale（MCP 聚合 `gap-*` / `p-*` 高频值）

| 值 (px) | 频次 | 典型用途 |
|---------|------|----------|
| **8** | 43+ | 行内 icon+文案、meta 行、chip 内 |
| **6** | 33+ | rail 项间距、pct 按钮组、widget 内紧凑堆叠 |
| **10** | 32+ | topbar 品牌区、列表行间距 |
| **12** | 18+ | FAQ 卡内 `qa` 问题与答案间距 |
| **14** | 11+ | widget `box` 内 padding |
| **16** | 11+ | 卡片内边距、FAQ `px` |
| **9** | 11+ | swap `box` 内纵向 gap |
| **5** | 17+ | rail `rit` 图标与标签 |
| **18** | 7+ | FAQ 卡 `py`、section 内边距 |
| **24** | 7+ | `wcol`/`dcol` 水平 padding |
| **20** | 6+ | widget 列 `pt`、stage 边距 |
| **34** | 6+ | Home 区块间距（PC） |

核心 Tailwind 映射：`1(4) · 2(8) · 3(12) · 3.5(14) · 4(16) · 4.5(18) · 6(24) · 8.5(34)`。

### 7.2 组件间距（Figma 结构 → 工程）

| 区域 | 间距模式 | Figma 层 |
|------|----------|----------|
| Rail 导航项 | `gap-[6px]` 栈；项内 icon↔label `gap-[5px]` | `rail` → `rit` |
| Widget 列顶 | 标题区 ↔ 首卡：~`pt-[20px]` 列 + 卡间默认流 | `wcol` |
| Swap 金额卡 | 卡内 `p-[14px]` `gap-[9px]`；卡间由列 gap 承担 | `box` |
| Meta 条 | `px-[14px] py-[13px] gap-[8px]` | `meta` |
| FAQ 块 | 卡间 `gq` 占位 **12px**；卡内 `px-[24px] py-[18px] gap-[12px]` | `qa` / `gq` |
| 百分比按钮行 | `gap-[6px]` `pt-[10px]` | `pcts` |
| Detail 列区块 | 标题 ↔ 内容 **16px**（`sechead` 节奏） | `dcol` |
| Home 区块 | PC **34px** / H5 **24px** 段间距 | `section` |

**原则**：同级组件间距由 **父容器 `gap`** 或 **专用 spacer 层（`gq`）** 表达；子组件不自带 margin（与 Text 不设 margin 一致）。

### 7.3 DApp shell

- PC app-window：**1320px**；列 **84 / 400 / 836**（rail / work / detail）。
- Collapse：第三列 `0fr`，窗宽 **30rem**。
- H5：单栏 **402px** app 宽；rail 隐藏，内容 `wcol` 全宽。
- **topbar**：高 **76px**，`px-[26px]`（PC DApp）。
- **app-window**：高 **826px**（PC Swap 帧），`rounded-[28px]`，`shadow` 见 MCP。

**归属**：[`shell-layout.ts`](../src/app/shell-layout.ts)、[`dapp-detail-layout.ts`](../src/app/dapp-detail-layout.ts)、`DappWidgetFrame` — **不进 Text variant**。

---

## 7.4 页面清单（Frame title → 代码）

| Frame title | Node（示例） | 平台 | 主要实现 |
|-------------|--------------|------|----------|
| `Homepage` | `7:2` | PC | `src/views/home/*` |
| `H5 — Homepage` | `53:2` | H5 | 同上 + `max-dapp` |
| `DApp — Swap` | `12:2` | PC 三列 | `SwapWidget` + `SwapContent` |
| `DApp — Swap`（折叠） | `182:17` | PC 两列 | `DappShell` collapse |
| `DApp — Swap · 未连接钱包` | `74:3` | PC | disconnected 变体 |
| `DApp — Genesis` | `31:2` | PC | `GenesisWidget` + `GenesisContent` |
| `DApp — Rewards` | `32:2` | PC | `RewardsWidget` + `RewardsContent` |
| `DApp — Community 未连接` | `33:2` | PC | `CommunityWidget` |
| `DApp — Community · 已连接` | `82:430` | PC | connected 变体 |
| `H5 — Swap` / `Genesis` / `Rewards` / `Community` | `62:2` 等 | H5 | 同 tab + mobile 规则 |
| `Modal — Connect Wallet` / `Wallet Detail` | — | 双端 | shell modals |
| `Drawer — Mobile Nav` | — | H5 | `dapp-mobile-nav` |

Frame **title** 决定页面归属（根 AGENTS §8.6）；`DApp — Swap` 内 Genesis 说明仍属 Swap tab。

---

## 7.5 组件词汇表（Figma `data-name` → 工程）

| Figma 层名 | 含义 | 工程归属 |
|------------|------|----------|
| `topbar` / `tb` / `tr` | 顶栏、品牌、右侧操作 | shell topbar |
| `net` / `wal` / `lang` | 网络、钱包、语言 | `ConnectButton` / chips |
| `stage` / `app-window` | 外层舞台、DApp 窗 | `DappShell` |
| `rail` / `rit` | 侧栏、tab 项 | `DappRail` |
| `wcol` / `wh` / `ham` | Widget 列、标题行、折叠钮 | `SwapWidgetHeader` 等 |
| `dcol` / `dl` | Detail 列、说明列表 | `*Content` 详情区 |
| `box` | 金额输入卡 | `SwapAmountBox` |
| `meta` / `r` | 费率/滑点等 meta 行 | `DappMetaList` |
| `pcts` / `pct` | 百分比快捷按钮 | slippage / amount presets |
| `fl` / `flb` | 交换方向钮 | swap flip |
| `s2` / `cta` / `ld` / `wp` | 主/次 CTA | `Button` / `DappActionButton` |
| `qa` / `qhd` / `gq` | FAQ 卡、问题头、卡间距 | FAQ section |
| `tbl` / `cell` / `trow` | 表格 | `DappTable` |
| `scard` / `tcard` / `card` | 统计/排行/通用卡 | 各 tab cards |
| `htab` / `htabs` | 水平 pill tab | token / filter tabs |
| `badge` / `mode-badge` | 状态徽章 | `StatusBadge` |
| `kicker` | 区块 eyebrow | `Text variant="kicker"` |
| `sechead` | 区块标题组 | section head 组件 |
| `nav` / `links` / `hero` / `footer` | Home 结构 | `home-*` sections |

**禁止**：为 Figma 缩写再建 `RankTitleWithSuperCommunity` 式 wrapper；应 `Text variant` + 布局 `className`。

---

## 8. Text API 映射（目标态）

> **工程实施 SSOT**：[`text-refactor-plan.md`](./text-refactor-plan.md)（API 定稿、字重策略、迁移阶段、验收）。本节为设计层摘要。

**公开 API**：仅 **`variant` + `tone`**（+ `tabular` / `as`）；**无 `weight` prop**。

| 轴 | 职责 |
|----|------|
| `variant` | 字号（CSS var）+ **该角色最常见字重** + leading rhythm + tracking（或 parity 例外） |
| `tone` | 语义色 |
| `className` | 布局；**极少数**单字重 utility（`font-semibold` 等） |

**字重**：写进 variant 默认；罕见 / 动态态用 `className`；段内混排用 `<strong>` / `<em>`（字号继承父 variant）。详见 refactor plan §4。

### 8.1 DApp 目标 variant（iOS flat + 15 / 17 独立档）

| variant | Size PC→H5 | 默认 weight | Leading | Tracking | Figma 角色 |
|---------|------------|-------------|---------|----------|------------|
| `caption2` | 10→11 | medium | compact | −0.20px | `badge` |
| `caption1` | 12→13 | normal | body | −0.24px | `rit` rail |
| `footnote` | **13→12** | **normal** | body | −0.26px | `box`/`meta` 正文 |
| `callout` | 13→12 | semibold | body | −0.26px | 同档强调 |
| `body` | **14→13** | reg/sb | body/title | −0.28px | token 名、FAQ **答案** |
| **`subheadline`** | **15→14** | semibold | title | **−0.30px** | **`qhd` FAQ 问题** |
| `headline` | 16→15 | semibold | title | −0.48px | 卡片小标题 |
| **`title3`** | **17→18** | semibold | title | **−0.34 / −0.68** | **顶栏品牌、侧栏/ rank 标题** |
| `title2` | 21→22 | semibold | title (H5 compact) | −0.42~−0.63px | widget `wh` 标题 |
| `title1` | 22→23 | semibold | title | −0.54 / H5 −0.66 | `amount` |
| `largeTitle` | 26–30+ | semibold | compact | display 档 | Home stat |

**parity 角色**（保留名或 compound，不膨胀 flat 表）：`kicker`、`table-cell`（tracking `0`）等 — 见 §6.2。

默认省略 `variant` → `footnote`。

### 8.2 Home

独立一组（`hero-*`、`section-*`、`metric-*`、`footer-*`），**与 DApp 分文件**（目标：`home-text.tsx` 或 namespace）。

### 8.3 删除 / 合并方向

| 删除或 alias | 并到 |
|--------------|------|
| `title-xl` | `title2` / `panel-title`（parity 定） |
| `home-eyebrow` / `home-display` / `home-lead` | `section-*` / `hero-*` |
| `referral-amount` | `title1` |
| `hint` | `caption1` |
| `body` / `compact-body` / `program-body` | `footnote` |
| `label`（semibold 多数） | `callout` 或 `caption1`（computed 定默认字重） |
| `swap-hub-title` / `rank-title` | `title2` / **`title3`**（17px 用 title3） |
| `body-md` / `title-sm` | `headline` / **`title3`** |
| `faq-question` | **`subheadline`（15px）** |
| `faq-answer` | **`body`（14px）** |
| dev 轴 `xs`–`display` | 上表 |
| `dapp-type-scale.ts` | 删除 → `@theme` + `@utility` |

---

## 9. Figma 噪声清单

迁移时**不**为下列差异新增 variant：

- 13px ↔ 14px 局部互换
- tracking ±0.02px
- ≤0.5px 浏览器取整
- 动效 / hover 态字号
- 动态数值占位
- 整卡 SVG 污染导出

---

## 10. 迁移门禁

1. **推断规则**写入本文（不直接改组件）。
2. **样式栈表**（playbook §2） per call site。
3. **4175 探针**：`compare:screenshots` → `compare:diff-audit` → `compare:computed`。
4. **改 `text.tsx` / 删 alias** 单切片 PR。
5. **锚点必验**：`panel-title`（含 tab）、`amount`、`kicker`、`table-cell`、`rank-title`。

Leading / tracking 变更必须以 **computed lineHeight + letterSpacing** 探针通过为准，不能只看 Figma MCP。

---

## 11. 与现有文档关系

| 文档 | 关系 |
|------|------|
| [`typography-baseline.md`](./typography-baseline.md) | 工程 **dev computed** 字阶 SSOT；迁移时优先 parity，再向本文靠拢 |
| [`design-system-audit.md`](./design-system-audit.md) | Figma 帧 → 代码、tv() 判定规则 |
| [`style-refactor-playbook.md`](./style-refactor-playbook.md) | 写盘强制流程 |
| [`text-refactor-plan.md`](./text-refactor-plan.md) | Text **重构实施** SSOT（API、字重、迁移阶段） |
| 本文 | Figma **推断**目标态；设计师可在 Figma 中正向确认或修订 |

---

## 12. 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-07-08 | 初版：MCP 聚合 + 5-agent 仲裁；含 leading/tracking 表 |
| v0.2 | 2026-07-08 | §8：`variant`+`tone` 定稿；iOS flat 字阶；链 [`text-refactor-plan.md`](./text-refactor-plan.md) |
| v0.3 | 2026-07-08 | MCP 全量：`n8nD6qq…` 页 4:2；**15/17px 独立档**；§7.4 页面、§7.5 组件、§7.1–7.2 间距聚合 |
