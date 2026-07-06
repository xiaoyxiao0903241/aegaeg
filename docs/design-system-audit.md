# AEGIS X 设计系统审计表

> SSOT 设计稿：[AEGIS X — Website](https://www.figma.com/design/sXWXDvBrLeg5r0NnP1SMZH/AEGIS-X--Copy---Copy---Copy-)  
> 断点：`max-[820px]` = H5，`min-[821px]` = PC  
> 代码 SSOT：`src/components/{button,card,text}.tsx`（`tv()` 与组件同文件）

---

## 1. 审计范围（Figma 帧）

| 区域 | PC 帧 | H5 帧 |
|------|-------|-------|
| 首页 | `Homepage` (7:2) | `H5 — Homepage` (53:2) |
| Swap | `DApp — Swap` (12:2)、未连接 (74:3) | `H5 — Swap` (62:2 / 101:347 等) |
| Genesis | `DApp — Genesis` (31:2) | `H5 — Genesis` (63:2) |
| Rewards | `DApp — Rewards` (32:2) | `H5 — Rewards` (64:2) |
| Community | 未连接 (33:2)、已连接 (82:430) | `H5 — Community` (64:111) |
| 共享 | `topbar`、`rail`、`wh`、`dl` 出现于所有 DApp 帧 | 同左（Rail 隐藏） |

### 1.1 Frame 归属 → 代码（DApp）

> Frame **title** 决定页面归属；`DApp — Swap` 内的 Genesis 说明仍属 Swap。细则同根 `AGENTS.md` §8.6。

| Node | Figma title | 归属 | 主要实现 |
|------|-------------|------|----------|
| `12:2` | `DApp — Swap` | Swap | `SwapWidget`, `SwapContent`（PC 已连接展开） |
| `182:17` | `DApp — Swap` | Swap | `DappShell` collapse + `SwapWidget` |
| `74:3` | `DApp — Swap · 未连接` | Swap | `SwapWidget`, `SwapContent` |
| `62:2` / `77:2` | `H5 — Swap` | Swap | 同上 + mobile 规则 |
| `31:2` / `63:2` | Genesis | Genesis | `GenesisWidget`, `GenesisContent` |
| `32:2` / `64:2` | Rewards | Rewards | `RewardsWidget`, `RewardsContent` |
| `33:2` / `82:430` / `75:2` | Community | Community | `CommunityWidget`, `CommunityContent` |
| `64:111` / `77:76` | `H5 — Community` | Community | mobile disconnected / connected 变体 |

**布局基线（PC app-window）**：`1320px` 宽、`84 / 400 / 836` 三列（rail / work / detail）；Swap 折叠 `182:17` 为 `84 / 400` 无 detail。H5 单栏 `378px` app-window 内宽。动态数值（余额、统计）不对齐占位数字。

---

## 2. 判定规则（variant vs className）

| 条件 | 处理 |
|------|------|
| 全站 ≥5 处、选错会破坏品牌一致性 | **`tv()` variant** |
| 正交维度（tone / 字号档 / 按钮语义色） | **variant 轴** |
| 仅差 1–2 个 Tailwind class（间距、圆角取整、H5 微调） | **`className`** |
| 布局（grid、mt、max-w、absolute） | **`className` 或 `lib/layout.ts`**，不进 variant |
| 业务 preset 名（`sideCard`、`referrerBound`） | **复合组件** 或调用处组合，不进 variant |
| 出现 &lt;3 次的一次性样式 | **`className` only** |

组件统一签名：`cn(variants({ ... }), className)` — `className` 始终最后，可覆盖。

### 2.1 轴职责（禁止轴污染）

| 组件 | 轴 | 只放什么 | 禁止放进轴里 |
|------|-----|----------|--------------|
| **Button** | `variant` | 语义色、边框色、hover 色、disabled 色 | `rounded-*`、`whitespace-*`、`w-full`、字号（除 link 重置） |
| | `size` | `min-h`、`px`、`text-*`、`leading-*` | 圆角、nowrap、width |
| | `shape` | `rounded-*`、`chip` 固定高宽 | 语义色 |
| | `compound` | 交叉组合（lg 全宽 sm、ghost/tab md pill、link 重置） | — |
| **Card** | `surface` | `outlined` / `elevated` | 空 `flat`、padding、圆角 |
| | `tone` | 仅 `dark`（非默认不写） | 空 `default` |
| | `base` | `rounded-md px-4 py-3.5 bg-card` | — |
| **Text** | `size` | `text-*`、档内 `tracking` | `leading-*`（走 compound） |
| | `weight` | 非 normal 字重 | 空 `normal` |
| | `tone` | 非默认语义色 | 空 `default` |
| | `base` | `font-normal text-foreground tracking-[0]` | — |

**反模式**：boolean 轴 `true: '' / false: ''` 只为 compound 占位；应改为显式 `variant` 值（如 `tab`）或删掉。

---

## 3. Button 审计

### 3.1 Figma 节点 → 视觉族

| Figma 节点 | 出现页面 | 视觉描述 | 频次 |
|------------|----------|----------|------|
| `ld` | Home nav、Hero | 珊瑚底、白字、圆角 full、≈36–48px 高 | 高 |
| `share` / `claim` / `cta` / `s2` | Community、Rewards、Swap、Genesis | 同上族，宽约 100%、≈42–44px 高 | 高 |
| `wp` | Home nav | 白底描边胶囊 secondary | 中 |
| `pct` | Swap | 小圆角 chip、≈25px 高、非 full pill | 中 |
| `ham` | DApp `wh` | 42×42 方钮、secondary 表面 | 低（2 处） |
| Program「Learn more →」 | Community | 文字链，非按钮 | 低 |

### 3.2 保留的 variant（`components/button.tsx`）

| 轴 | 值 | 默认 | 说明 |
|----|-----|------|------|
| `variant` | `primary` \| `secondary` \| `ghost` \| `tab` \| `link` | `primary` | 含选中 pill tab（`tab`） |
| `size` | `lg` \| `md` \| `sm` | `sm` | 仅尺寸 |
| `shape` | `pill` \| `chip` | `pill` | 仅轮廓 |

### 3.3 用 className，不做 variant

| 场景 | className 示例 |
|------|----------------|
| Nav 白皮书略小 | `!min-h-[39px] !px-[18px] !text-sm` |
| 面板切换 ham | `grid size-[42px] rounded-[13px] p-0 max-[820px]:hidden` |
| 暗色 banner 上 capsule | `!border-white/45 !bg-transparent !text-white` |
| H5 全宽 Hero | `max-[820px]:w-full` |
| Wallet 顶栏（thirdweb） | 保留 `wallet.css`，仅对齐 token 色 |

### 3.4 代码映射（待迁移）

| 旧 API | 新写法 |
|--------|--------|
| `homeBtnClass('primary')` | `<Button variant="primary" size="lg" asChild>` |
| `homeBtnClass('ghost', { sm })` | `<Button variant="secondary" size="md" className="!min-h-[39px]..." />` |
| `dappButtonClass('action','primary')` | `<Button variant="primary" size="sm" />` |
| `dappButtonClass('capsule','secondary')` | `<Button variant="secondary" size="md" />` |
| `dappButtonClass('pill', active?'active':'subtle')` | `<Button variant={active?'tab':'ghost'} size="md" shape="pill" />` |
| `PERCENT_BTN_CLASS` | `<Button variant="ghost" shape="chip" />` |

---

## 4. Card 审计

### 4.1 Figma 节点 → 视觉族

| Figma 节点 | 视觉描述 | 出现 | 频次 |
|------------|----------|------|------|
| `box` | 白底 + 描边 + rounded-md + p≈14–16 | Widget 侧卡、Swap 表单、Rewards 余额 | **很高** |
| `meta` | 与 box 同表面，内为 grid 键值行 | Swap、Genesis | 高 |
| `sc` | 白底 + shadow、无描边 | 指标卡、Community 统计 | 高 |
| `tbl` 外壳 | shadow 容器 + 表内 padding | 三张数据表 | 中 |
| `pcard` / Home `tcard` | shadow + p≈20 | Program、Home Token | 中 |
| `tc` / 底部 promo | **暗色** bg-dark | Rewards hero、Genesis global、Swap promo | 中 |
| `faq` 项 | shadow-faq + 水平 padding | Swap/Rewards/Genesis FAQ、Home FAQ | 中 |
| `qlink` | 描边行 + 图标，非 Card 族 | Community | 低（独立组件） |

**结论：只有 3 种表面 + 1 种 dark tone，没有 11 种 card variant。**

### 4.2 保留的 variant（建议收敛后）

| 轴 | 值 | 默认 | 说明 |
|----|-----|------|------|
| `surface` | `outlined` \| `elevated` | `outlined` | 无第三种空 `flat` |
| `tone` | `dark`（可选） | — | 默认正文色在 `base` |

**建议从 `tv()` 移除 `pad` / `radius`**（当前实现有，审计建议删掉）：默认值写在 `base`，差异用 `className`。

| 默认 base | Tailwind |
|-----------|----------|
| 圆角 | `rounded-md` |
| 内边距 | `px-4 py-3.5` |

### 4.3 用 className，不做 variant

| 场景 | className |
|------|-----------|
| 大圆角统计卡 | `rounded-[18px] p-[18px] shadow-[0_8px_24px_...]` |
| Meta 列表 grid | `grid gap-2 p-[14px] rounded-[12px]` |
| FAQ 容器 | `px-[18px] shadow-faq` |
| 表格外壳 | `overflow-x-auto px-4 py-[5.75px]` |
| H5 指标卡 | `max-[820px]:rounded-[14px] max-[820px]:p-3.5` |
| Widget 卡间距 | `mt-3.5 flex flex-col gap-2`（布局，非 card variant） |
| Home token 交互 hover | `hover:-translate-y-1 hover:shadow-card-strong` |

### 4.4 复合组件（Layer 2，非 variant）

| 组件 | 组合 |
|------|------|
| `MetricCard` | `<Card surface="elevated" className="flex flex-col gap-[7px] ..." />` |
| `DappSideCard` | `<Card surface="outlined" className="mt-3.5 flex flex-col gap-2" />` |
| `PromoBanner` | `<Card tone="dark" className="..." />` |
| Home `Card`（primitives） | `<Card surface="elevated" className={...} />` |

### 4.5 代码映射（待迁移）

| 旧 API | 新写法 |
|--------|--------|
| `dappCardClass('side')` | `<Card surface="outlined" className="mt-3.5 flex flex-col gap-2" />` |
| `dappCardClass('metric')` | `<Card surface="elevated" className="flex flex-col gap-[7px] ..." />` |
| `dappCardClass('promo')` | `<Card tone="dark" className="mt-auto grid ..." />` |
| `homeCardClass({ hover:'shadow' })` | `<Card surface="elevated" className="hover:shadow-[...]" />` |

---

## 5. Text 审计

### 5.1 Figma 字号阶梯（Home + DApp 共用）

| 档 | px（约） | 典型用途 | Figma/代码 |
|----|---------|----------|------------|
| xs | 11–12 | caption、kicker、hint、badge | `size="xs"` |
| sm | 13 | body、meta 值、表内文字 | `size="sm"` **默认** |
| md | 15–17 | 侧卡标题、FAQ 问题 | `size="md"` |
| lg | 18 | Content 分区 h3、卡片标题 | `size="lg"` |
| xl | 21–22 | Widget h1 | `size="xl"` |
| 2xl | 30 | 统计大数 | `size="2xl"` |
| display | 40→26 H5 | Home section 标题 | `size="display"` |

### 5.2 保留的 variant

| 轴 | 值 | 默认 |
|----|-----|------|
| `size` | xs \| sm \| md \| lg \| xl \| 2xl \| display | sm |
| `weight` | normal \| medium \| semibold \| bold | normal |
| `tone` | default \| muted \| body \| subtle \| coral \| success \| onDark \| faq | default |

### 5.3 用 className，不做 variant

| 场景 | className |
|------|-----------|
| Widget 标题字距 | `tracking-[-0.84px] m-0` |
| Section 居中+上限宽 | `mx-auto mt-3.5 max-w-[760px]` |
| Eyebrow 大写+字距 | `uppercase tracking-[1.82px]` |
| FAQ 答案间距 | `mb-4 mt-0` |
| 右对齐 meta 值 | `text-right` |
| 旧 `dappTextClass('caption')` 等 20+ 角色名 | **删除**；改为 `size`+`weight`+`className` |

### 5.4 标题（不进 Text variant）

| 层级 | 组件 | 样式来源 |
|------|------|----------|
| Widget h1 | `DappContentHeading` / `DappWidgetHeader` | `<Text as="h1" size="xl" weight="semibold" />` + 少量 className |
| Content h2 | `DappContentHeading` | `<Text as="h2" size="lg" weight="semibold" className="tracking-[-0.72px]" />` |
| Section h3 | `DappSection` | 同上 |
| Home section | `SectionHead` | `<Text as="h2" size="display" weight="semibold" className="mx-auto ..." />` |

---

## 6. 非 variant 资产（页面级 chrome，不进 variant）

**已删除**：`dapp-styles.ts`、`home-styles.ts`、`primitive-styles.ts`、`lib/layout.ts`、`primitives.tsx`。

| 类别 | 新归属 | 说明 |
|------|--------|------|
| DApp shell 列间距 | `shell-layout.ts` 内联常量 | 仅 shell 结构 |
| 首页 nav / hero 装饰 | 各 `src/views/home/components/home-*.tsx` 内局部 class | 禁止 `home-chrome.ts` 式全局 dump |
| 首页标题 | `Text` + section 组件内布局 class | 禁止 `home-typography` 角色名文件 |
| 首页文案 | `src/i18n/messages/home/*.ts` → `useHomeContent()` | 与 DApp 同 i18n 管线 |
| 领域布局 | 各 Layer 2 组件内 `className` | 如 `MetricGrid`、`InviteFlow` |

**禁止**：`const BORDERED = '...'`、`dappCardClass()`、`layout.seasonRadio`、`chip-styles.ts` 等字符串 dump。

---

## 7. 频次汇总（variant 是否值得保留）

| 组件 | 建议保留的 variant 组合数 | 建议删除/勿新增 |
|------|---------------------------|-----------------|
| **Button** | 4×3×2(shape) ≈ 24 理论，实际常用 **6–8** 种 | kind×tone、light、panel、homePrimary |
| **Card** | **3×2 = 6**（仅 surface×tone） | pad、radius、11 种 preset 名 |
| **Text** | 7×4×8 理论，常用 **~15** 档 | 30+ role 名、home/dapp 双 API |

---

## 8. 迁移状态（2025-06）

| 阶段 | 内容 | 状态 |
|------|------|------|
| **A** | 收敛 `card.tsx` / `button.tsx` / `text.tsx` | ✅ |
| **B** | 删除 `layout.ts` + 样式 dump 文件 | ✅ |
| **C** | DApp 领域组件迁 Layer 1 原语 | ✅ |
| **D** | Home `home-page` → `Button`/`Card`/`Text` + `home-chrome` | ✅ |
| **D2** | Home 区块拆为 `src/views/home/components/*` 领域组件 | ✅ |
| **E** | 全站无 `dappTextClass` / `homeBtnClass` 引用 | ✅ |
| **F** | i18n genesis FAQ 键补齐 | ✅ |

---

## 9. 示范片段（Community 已连接 Widget）

```tsx
// Referral link card — 旧 dappCardClass('side')
<Card surface="outlined" className="mt-3.5 flex flex-col gap-2">
  <Text size="xs" weight="semibold" tone="body">…</Text>
  <Text size="sm" weight="semibold">…</Text>
  <Button variant="primary" size="sm">Share referral link</Button>
</Card>

// Stat — 旧 CommunityStatCard / dappCardClass('communityStat')
<Card
  surface="elevated"
  className="flex flex-col gap-1 rounded-[18px] p-[18px] shadow-[0_8px_24px_rgba(18,26,51,0.06)] max-[820px]:..."
>
  <Text size="xs" tone="body">Direct referrals</Text>
  <Text size="2xl" weight="semibold">12</Text>
</Card>
```

---

*最后更新：2026-07-06 · Frame 归属并入原 `dapp-frame-ssot.md`*
