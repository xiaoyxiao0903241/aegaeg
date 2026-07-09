# Foundation 验收（L2 · P0–P8）

> **流程**：[`runbook.md`](./runbook.md) · **API**：[`api.md`](./api.md) · **审计**：[`design-system-audit-v2.md`](./design-system-audit-v2.md)

---

## 1. 双 Gate

| Gate | 含义 | 命令 |
|------|------|------|
| **API gate** | 代码键数 = api.md 键数，无 legacy API 命中 | `rg` 检查 + tsc |
| **视觉 gate** | heatmap 红块标签 + 人工对照表；scoped 探针仅确认 | `pnpm compare:screenshots` / 登录态 heatmap；可选 `compare:style-baseline` |

用户已确认：**红块 + 同位置源码优先**；整页 `%` 与全页 DOM 探针不作发现工具；scoped 探针仅肉眼分不清或修完硬验收。

---

## 2. 每阶段验收清单

### P0 Token
- [x] `tokens.json` 源文件存在且结构合法
- [x] `theme.css` / `tokens.ts` 可由脚本生成
- [x] 工程色（border-subtle / surface-glass / pill-muted-bg / coral-hover-border / status-success-bg / surface-wash-strong）已迁入 `tokens.json`；死 legacy（ink/faint/on-dark 等）已从生成器删除
- [x] `pnpm exec tsc --noEmit` 通过
- [x] `pnpm exec stylelint src/shared/styles/tokens/theme.css` 通过
- [x] legacy color/type alias 已在 P8 删除（见下）

### P1 Text
- [ ] `text.tsx` 只有 10 variant + 7 tone
- [ ] `rg 'panel-title|table-cell|on-dark' src --glob '*.{tsx,ts}'` 零命中
- [ ] 全仓 `variant=` / `tone=` 已迁移
- [ ] 人工对照表确认每个子组件样式对齐

### P2 Card
- [ ] `card.tsx` 只有 4 surface（outlined/elevated/soft/inverse），无 `context`/`fill`/`radius` 轴
- [ ] `rg 'surface="faq"|surface="promo"|surface="window"|surface="modal"|context=|fill=' src --glob '*.{tsx,ts}'` 零命中
- [ ] 全仓 call site 迁移到新 surface

### P3 Chip
- [ ] `chip.tsx` 存在，3 variant × **3** size（sm/md/lg）× 2 shape × **4** tone（default/primary/coral/success）
- [ ] pct / badge / tab 已替换为 Chip
- [ ] `rg 'shape="chip"|variant="tab"' src --glob '*.{tsx,ts}'`（Button 的 tab）零命中
- [ ] LIVE/MAX 用 `tone="coral"`，勿用 `tone="primary"` 冒充 `#c85c3f`

### P4 Input
- [ ] `input.tsx` 存在，3 variant：default/numeric/amount
- [ ] `amount-input.tsx` 已合并或删除
- [ ] genesis shares field 使用 `Input variant="numeric"`

### P5 Button
- [ ] `button.tsx` 4 variant × 3 size × 2 shape
- [ ] `rg 'variant="tab"|shape="chip"' src/shared/ui/button.tsx` 零命中
- [ ] link 内部使用 Text

### P6 Composite
- [ ] 9 个 Composite 文件存在：`top-bar.tsx` · `nav-rail.tsx` · `panel-header.tsx` · `amount-input.tsx` · `segment.tsx` · `metric-card.tsx` · `data-table.tsx` · `faq-list.tsx`（Accordion 行为）· `callout-card.tsx`
- [ ] 每个 Composite 都有 ≥2 个 call site 或明确的全局 shell 职责
- [ ] 无把 `box` / `dl` / `r` 等纯视觉层包装成 Composite

### P7 按页替换
- [x] Swap 页应用 Composite：`WidgetHeader` / `WidgetSubpageHeader` + `AmountBox` + `Segment` + `MetricCard` + `CalloutCard`
- [x] Genesis 页应用 Composite：`WidgetHeader` + `AmountBox` + `Segment` + `MetricCard` + `DataTable` + `CalloutCard`
- [x] Rewards 页应用 Composite：`WidgetHeader` + `DataTable` + `CalloutCard` + `Accordion`
- [x] Community 页应用 Composite：`WidgetHeader` + `DataTable` + `CalloutCard`
- [x] Home 页应用 Composite：`HomeSection` + `Text`/`Card` 新 API
- [x] 已删除旧组件：`swap-amount-box.tsx` · `swap-widget-header.tsx` · `swap-widget-primitives.tsx`
- [x] `pnpm exec tsc --noEmit` 通过
- [x] `pnpm run build` 通过
- [ ] 人工对照表确认（用户后续进行）

### P8 清债
- [x] 全站 `dapp-type-scale.ts` 删除
- [x] `rg 'text-ink-|text-faq-text|text-on-dark|coral-bright' src --glob '*.{tsx,ts}'` 零命中（仅注释）
- [x] 删除 `theme.css` 中 `@deprecated legacy colors` 与 `legacy type aliases` 静态块（`generate-tokens.mjs` 已移除；仍用色进 `tokens.json`）
- [x] `.stylelintrc.json` 临时规则保留：生成文件 hex+oklch 双声明仍需（非临时债）
- [ ] `docs/foundation/` 与 `SKILL.md` 命名与 api.md 一致（持续）

---

## 3. 常用命令

```bash
# TypeScript
pnpm exec tsc --noEmit

# Lint（关注 src/ 错误，tmp/ 脚本错误可后续清理）
pnpm lint:all

# 4175 parity（用户不强制，作为辅助）
# `dev:baseline` 会把当前仓库 `.env` / `.env.local` 同步到 worktree，再启 4175。
# 改 env 后必须重启 baseline（Vite 只在启动时注入）。跳过同步：AEGIS_DEV_BASELINE_SKIP_ENV_SYNC=1
pnpm dev:baseline
pnpm capture:phase0-baseline
pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5

# legacy API 检查
rg 'panel-title|table-cell|on-dark|text-ink-|text-faq-text|coral-bright' src --glob '*.{tsx,ts}'
rg 'surface="faq"|surface="promo"|surface="window"|surface="modal"|context=|fill=' src --glob '*.{tsx,ts}'
rg 'variant="tab"|shape="chip"' src/shared/ui/button.tsx
```

---

## 4. 人工对照表模板

每个页面/组件替换后填写：

```text
组件: <path>
Figma 层: <layer>
变更前: <className / 旧 API>
变更后: <新 Component + props/className>
样式对齐: Y / N / 差异说明
差异位置: <具体 selector 或 class>
是否可接受: <用户勾选>
```

---

## 5. dapp-genesis-desktop 视觉标签（4175 vs 5174）

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Rewards hero H5 title 19→18 | REGRESSION→fixed | mobile `text-[1.125rem]`（禁 `text-lg` H5 bump→19） |
| Rewards hero body H5 12→14 | REGRESSION→fixed | `max-dapp:text-[0.875rem]`（4175 raw `<p>` 吃 text-sm bump） |
| RewardBalanceCard H5 label 12→13 / amount | REGRESSION→fixed | label `text-xs`；value `max-dapp:text-xs`；referral 保留 figure |
| y299–377 Global 卡数值 | REGRESSION→fixed | 同上；`fs/lh/ls` 已对齐 21px / 27.3px / -0.63px |
| y378–412 Shares input tracking | REGRESSION→fixed | `Input` default/numeric `tracking-normal` |
| y473–490 MetaList | REGRESSION→fixed | `DappMetaList` `copy`→`detail`（14px） |
| muted-foreground vs 4175 50% | IGNORE | 对齐 Figma PC `text/body` 70%（`#000000b2`）；4175 全局 50% 为实现漂移，禁贴回 |
| radius-sm 10→14 | INTENTIONAL | Foundation `--radius-sm: 0.875rem`（api Card outlined） |
| globalBody `on-dark`→`inverse-muted` | REGRESSION→fixed | 正式 tone；禁 `inverse`+opacity 近似 |
| FAQ answer `faq-text`→`muted-foreground` | REGRESSION→fixed | 单处色 `text-[#5b6472]`（≡4175），不进 Text tone；禁复活 `--faq-text` token |
| panel 20→21 / subtitle 12→13 | INTENTIONAL | Foundation `--type-panel` / `--type-copy` vs 4175 fluid |
| section lh 1.375(24.75)→1.3(23.4) | REGRESSION→fixed | `--type-section-leading` 对齐 4175；禁回 1.375 |
| FAQ answer box h 42→70 | INTENTIONAL | UA margin→`py-[1em]` 等价撑开（盒模型含 padding） |
| 动态数值 / 倒计时文案 | IGNORE | 非静态对齐重点 |

## 5b. dapp-rewards / dapp-community 视觉标签（4175 vs 5174）

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Rewards h2 `Current tier` leading-snug + tracking -0.36px | REGRESSION→fixed | `DappContentHeading` 补 `group-data-[tab=rewards]` |
| Rewards table head faint 30% | REGRESSION→fixed | `ResponsiveTable` `text-foreground/30`（禁贴回 `text-faint`） |
| FAQ answer 盒高 42→70 | REGRESSION→fixed | DApp `FaqList`/`Accordion` answer `py-[1em]` + H5 `max-dapp:text-xs`（≡4175 text-sm/xs）；Home `variant=home` 无 py、H5 `text-xs` |
| Invite step leading 1.3→1.5 | REGRESSION→fixed | 对齐 4175 `dappCaptionClass` |
| Community/Rewards `DappSection` h3 lh 24.75→23.4 | REGRESSION→fixed | 同 §5 section leading 已对齐 1.3 |
| Hero / Global kicker `coral-bright`→`primary` | REGRESSION→fixed | 正式 tone `primary-bright` ≡ Figma `#f4a98f`；禁 `primary` 近似、禁 `text-coral-bright` |
| Hero body `on-dark`→`inverse-muted` | REGRESSION→fixed | 正式 tone；禁 `inverse`+opacity 近似 |
| Input disabled opacity 50→60 | INTENTIONAL | Foundation Input SSOT（见 p7-swap-delta） |
| Phase 日期 / 累计共建额 | IGNORE | 动态 |
| Community 左卡 padding | INTENTIONAL | 用户确认满意；禁按 4175/dev 改回 |
| CommunityStatCard label foreground 13px | REGRESSION→fixed | `muted-foreground` + PC `text-xs leading-normal`（≡ 4175 ink-strong/xs） |
| Community Copy link min-h 42 / leading-none | REGRESSION→fixed | `communityShareButton` → `min-h-11 w-full leading-normal` |
| Rewards 表行 1px 边框带（y831+/y913+） | IGNORE | section leading 级联 + 抗锯齿；非结构回归 |
| Community 推荐链 URL 端口 4175↔5174 | IGNORE | 环境 host，非 UI SSOT |
| Community section lh 级联 Y | REGRESSION→fixed | 同 §5 section leading 已对齐；禁改左卡 padding |
| Community referrer label/address lh·tracking | REGRESSION→fixed | `CommunityReferrer*` → `leading-normal tracking-[-0.24px]`；地址 `leading-[1.2] tracking-[-0.28px]` |
| Community bound 地址行 h46/r11/gap-2.5 | REGRESSION→fixed | ≡ 4175 `ReferrerAddressRow`：`h-11 rounded-sm bg-background` + 卡 `gap-2`（左卡 padding 仍锁定） |
| Community bound 卡高 126→174 | REGRESSION→fixed | 标签/note `my-3` ≡ 4175 裸 `<p>` UA margin（禁只靠 `m-0`+gap-2） |
| Rewards rank title 16→17 / lh 1.2→1.3 | REGRESSION→fixed | `RankTitleWithSuperCommunity` + post-launch → `variant="brand"` + tracking -0.34 |
| Claim CTA 宽 140→full | REGRESSION→fixed | Button `sm`+`pill` compound `w-full`（≡ 4175） |
| Rewards history tabs 用 Segment percent 网格 | REGRESSION→fixed | `RewardsHistoryPillTabs` → `DappPillTabs`（soft/outlined pill ≡ Trade FAQ） |
| Community referral URL tracking | REGRESSION→fixed | `tracking-tight` ≡ 4175 `-0.35px` |
| Genesis top ~13%（倒计时/报价） | IGNORE | 动态 Time remaining / 价格；非静态对齐 |
| Genesis mid/bottom 级联细带 | INTENTIONAL | radius-sm 14；section lh 已对齐 1.3；禁贴回 10px |
| Community 右栏 program 标题 Y 偏移 | REGRESSION→fixed | 同 §5 section leading 已对齐 |
| Rewards 表行细红带 | IGNORE | section lh 级联 + 抗锯齿（同既有表行标签） |
| Community 推荐链 URL 端口 | IGNORE | 环境 host |

## 5c. 登录态四 tab 共享 chrome（4175 vs 5174）

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Topbar brand 17→18 / lh / tracking | REGRESSION→fixed | `DappTopbar` `text-lg leading-7 tracking-tight` |
| Language menu item headline/copy 溢出叠字 | REGRESSION→fixed | `LanguageMenu` 行内 `text-sm`/`text-xs` + `leading-normal` |
| `--type-*-size` px-lock 高分屏不随 site-fluid | REGRESSION→fixed | `tokens.json` size → rem @16px；`generate-tokens.mjs` 注释同步 |
| Language menu item radius 10→14 | INTENTIONAL | Foundation `--radius-sm`；禁贴回 4175 10px |
| muted / FAQ 色 | IGNORE / REGRESSION→fixed | muted：同 §5（Figma PC `text/body` 70%；4175 50% IGNORE）；FAQ answer：单处 `#5b6472` |
| 动态报价 / 余额 / 成员数 | IGNORE | 非静态对齐重点 |

## 5d. Swap hub 左下 Genesis promo + Convert/Trade 子页

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Genesis promo title/body | REGRESSION→fixed | `tone="inverse-muted"` ≡ `#b8c0ce`（禁 `inverse`+opacity-70） |
| AmountBox Balance 满色 foreground | REGRESSION→fixed | `AmountBox` balance → `muted-foreground`（≡ 4175 `ink-strong` 70%） |
| Input placeholder 黑 70% | REGRESSION→fixed | `placeholder:text-placeholder`（`--placeholder` ≡ 4175）；禁 `muted-foreground` |
| AmountBox 未连接金额色 | REGRESSION→fixed | `sessionReady=false` → `text-amount-muted` / `placeholder:text-amount-muted`（≡ `#c9cfda`） |
| SwapMetaPanel label/value 13px | REGRESSION→fixed | `copy`→`detail`（14）+ `tracking-normal` |
| Exchange price 数值 1.0001 vs 1.001 | IGNORE | 动态报价 |
| Buy Balance 数值差异 | IGNORE | 链上余额 |
| FAQ question 14/1.3（PC）· H5 15/1.3 | REGRESSION→fixed | `variant="question"` H5 `--type-question-size: 0.9375rem` ≡ 4175 `text-sm` |
| Trade FAQ pill tabs（USD1 active） | REGRESSION→fixed | `DappPillTabs`：`soft`+`primary`+`lg`（`leading-snug`）；禁 `solid`+percent `md`；Chip `md` 去误挂 `bg-card`，`outlined` 自带 `bg-card`；`soft` 透明 1px border 对齐盒模型 |
| Convert/Trade TokenChip USDT/USD1 lh 21→16.8 | REGRESSION→fixed | `TokenChip` `leading-[1.2] tracking-[-0.28px]`（≡ 4175） |
| Convert Exchange rate `tabular-nums` 宽 89→70 | REGRESSION→fixed | `SwapMetricCard` → `MetricCard tabular={false}`（禁默认 Card.Value tabular） |
| muted-foreground vs 4175 50%（hub/子页正文） | IGNORE | 同 §5：Figma PC `text/body` 70%；4175 50% IGNORE |
| hub 底栏 / promo 1px Y / coral 级联细带 | IGNORE | 滚动/抗锯齿；非结构回归 |
| Convert 右栏 peach 卡顶边细带 | IGNORE | 1–2px 圆角抗锯齿 |

入口：hub → 点 **Convert**（`flash`）/ **Trade**；脚本 `swapView: 'flash'|'trade'`。

## 5e. Swap hub 登录态 heatmap 标签（env-aligned · 2026-07-09）

| 红块 | 标签 | 说明 |
|------|------|------|
| b5/b6/b9–b11 正文灰阶 | IGNORE | 同 §5：Figma PC `text/body` 70%；4175 50% IGNORE |
| b7/b8 promo↔FAQ 交界 | IGNORE | 1px Y + 抗锯齿；promo computed 已对齐 |
| b0–b4 底栏 / coral 细带 | IGNORE | 视口底 / 级联 |
| Convert/Trade 模式卡正文 | IGNORE | 同 muted（Figma PC 70%） |

## 5f. Figma 色阶复核（MCP · 2026-07-09）

正式稿：`sXWXDvBrLeg5r0NnP1SMZH`。变量：`text/body`=`#000000b2`（70%）· `text/muted`=`#00000066`（40%）· `accent/coral-bright`=`#f4a98f` · `accent/primary (coral)`=`#c85c3f`。

| 帧 | 节点 | 文案 | Figma variable |
|----|------|------|----------------|
| **DApp — Genesis** `31:2` | `31:70` Shares · `31:68` Upcoming · `31:79` Season quota · `31:126` Discount · `101:756` 日期 | 次级 | **`text/body` 70%** |
| **DApp — Genesis** `31:2` | `82:684` GLOBAL CONTRIBUTION | 暗色卡 kicker | **`accent/coral-bright`** |
| **DApp — Rewards** `32:2` | `32:83` GENESIS SHAREHOLDER | 暗色卡 kicker | **`accent/coral-bright`** |
| **DApp — Rewards** `32:2` | `32:47` CURRENT TITLE | 浅底侧栏 eyebrow | `accent/primary (coral)`（非 bright） |
| **H5 — Genesis** `63:2` | `63:42` Shares · `63:50` Season quota · `63:76` Starts in · `63:83` 折扣 · `63:86` 空投比例 · `63:19` 副标题 | 次级 | **`text/muted` 40%** |
| **H5 — Genesis** `63:2` | `63:79` AGX reference price | label | `text/body` 70%（同帧混用） |
| **H5 — Rewards** `64:2` | `64:50` GENESIS SHAREHOLDER | 暗色卡 kicker | **`accent/coral-bright`** |
| **H5 — Rewards** `64:2` | `64:21` CURRENT TITLE | 浅底 eyebrow | `accent/primary (coral)` |
| **H5 — Rewards** `64:2` | `64:19` / `64:23` 副文案 | 次级 | `text/muted` 40% |
| **H5 — Swap** `62:2` / **H5 — Community** `64:111` | 帧汇总 | 次级以 `text/muted` 为主 | 40% 居多 |

**裁决**：PC 文案色 SSOT = `text/body` 70% → `--muted-foreground`；4175 50% = IGNORE。H5 帧大量 `text/muted` 40% 与 PC 不一致；按 AGENTS「H5 是 PC 响应式 / PC 文案 SSOT」**当前不跟 H5 40%**，除非产品明确要求 H5 分叉。暗色卡珊瑚强调 = `primary-bright`（≡ coral-bright），浅底强调仍用 `primary`。

## 5g. 视觉 SSOT（2026-07-09）

**视觉真相只有两处，禁止第三套：**

| 角色 | SSOT | 用途 |
|------|------|------|
| **设计意图** | 正式 Figma 画板**实节点**（`sXWXDvBrLeg5r0NnP1SMZH`）+ 帧导出 `docs/figma-export/raw|frames` | 色 / 字 / 间距 / 组件结构；变量以节点绑定为准（见 §5f） |
| **回归基线** | `dev` @ **4175**（`pnpm dev:baseline`） | heatmap / 截图 diff；回答「视觉是否坏了」 |

**已删除、禁止再参考**（曾与画板冲突的口号规范）：

- `docs/figma-export/AEGIS X · Color.json`
- `docs/figma-export/AEGIS X · Layoutjson.json`
- `docs/figma-export/AEGIS X · Typography.json`
- `docs/figma-export/AEGIS X · 验收规范 Spec.json`

实现与验收时：不引用上述文件、不按其「验收 0x / card.padding=24 / 行高 1.2」等口号改码。冲突时以**画板实节点**定意图，以 **4175** 验回归；`dev` 仍不是结构 / class 字典 SSOT（见 skill）。

## 5h. CSS 瘦身切片（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 删 `.aegis-btn-loading-icon` / `aegis-btn-spin` | INTENTIONAL | `ButtonLoadingIcon` → lucide `animate-spin` |
| 删 `.aegis-wallet-connect-intro` | INTENTIONAL | 零 call site |
| 删 `[data-spotlight-card]` | INTENTIONAL | 零属性绑定 |
| heading/section/panel-header 同值 tab 类合并 | INTENTIONAL | 视觉等价；Swap heading 仍 `-0.04em`；panel H5 swap `leading-[1.5]` 保留 |
| InviteFlow 去 `group-data-[tab=community]` | INTENTIONAL | 仅 Community 挂载；布局数值不变 |
| GenesisPromoCard `group-data-[tab=genesis]` | **KEEP** | 亦挂在 Swap footer；删守卫会污染 Swap |
| `home-motion` / `wallet.css` 主路径 | **KEEP** | 见 runbook §6.1 保留清单 |

## 5i. 左卡 / 标题 / pill CTA 统一（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `DappSideCard` / Rewards·Community 左卡去 `px-4 py-3.5` | INTENTIONAL | 统一 Card `outlined` = `p-3.5` + `rounded-md`（Figma box 14px） |
| Claim / Copy / Join Genesis / Connect promo pill | INTENTIONAL | density：card **42** · external **44** · inverse **38**（Connect/Join Genesis） |
| `DappPanelHeader` PC tracking | INTENTIONAL | 四 tab 共用 `dapp:tracking-[-0.42px]` |
| `DappMetaList` | INTENTIONAL | 不再叠 `rounded-sm px-3.5 py-3`；用 Card 默认 |
| Community 左卡 padding 旧锁 | **解除** | 用户要求跨 tab 统一；见 world-class-goals |
| `CommunityReferrerBoundPanel` 去 `my-3`；删死包装 `DappReferrerBoundCard` | INTENTIONAL | 与 ReferralLink 同 `DappSideCard`；内部 `gap-2.5`（Figma bound≈10） |
| Detail 列 MetricCard `px-4 py-3.5` | KEEP（本切片） | 非 wcol 左卡；另切片再收 |

**Figma 对照（Community `82:430`）**：referral `box` 与 `box-referrer-bound` **同圆角 16**；水平 inset 均为 **16**（referral 垂直 14）。Swap `box` 多为 **14** inset。跨 tab 代码 SSOT 取 Card `outlined` **`p-3.5`**（≈14，对齐 Swap/meta）；Community 画板 16 标 INTENTIONAL 收敛，不回 per-card `p-4`。

SSOT：`src/app/dapp-detail-layout.ts` + Card `outlined` + `DappActionButton` density（card 42 / external 44 / inverse 38）。

## 5j. Button 高度三档（2026-07-09）

| 场景 | 高度 | 实现 |
|------|------|------|
| 浅色卡内（Claim / Copy / Bind） | **42** | `DappActionButton` 默认 `density="card"` → Button `sm` |
| 卡外主 CTA（Swap / Genesis Join / Community shareholder） | **44** | `density="external"` → Button `md` |
| 暗色 promo（Join Genesis / Connect） | **38** | `density="inverse"` / thirdweb `min-h-9.5` |
| Home hero | **48** | Button `lg`（未改语义） |

## 5k. 标题 / MetricCard 角色收敛（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `DappContentHeading` / `DappSection` 去 tab tracking/leading | INTENTIONAL | 一律 Text `section`；设计稿分叉不进代码 |
| `DappPanelHeader` 去 text-xl / H5 21px / tracking 分叉 | INTENTIONAL | 一律 Text `panel` + `copy` |
| Swap/Genesis MetricCard 共用 `metricCardChromeClass` | INTENTIONAL | overview 同档；value 默认 text-lg |
| CommunityStatCard / RewardsHeroCard | KEEP 分档 | 多行 `sc` / 暗色横幅 ≠ overview `ovc` |

## 6. 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 parity / slice 验收流程 |
| v2.0 | 更新为 P0–P7，增加人工对照表优先、Chip/Input/Composite gate |
| v2.1 | 同步最终命名：4 Card surface、Input default/numeric/amount、Composite 最终名、P8 清债 |
| v2.2 | dapp-genesis-desktop 红块标签 + panel leading 1.3 / Text max-dapp 覆盖修复 |
| v2.3 | 视觉 gate：红块优先；探针降级；Chip size=3；Community/Convert 标签同步 |
| v2.4 | P8：legacy 静态块删除；工程色迁入 tokens.json；dappPanelTitle 内联 |
| v2.5 | muted：INTENTIONAL→IGNORE（Figma PC body 70%；4175 50%）；§5f Figma MCP 色阶表；暗色卡 `primary-bright` |
| v2.6 | §5g 曾记规范 vs 画板对照表 |
| v2.7 | 删除四份 Spec JSON；§5g 改为视觉 SSOT = 画板实节点 + 4175；禁止再参考口号规范 |
| v2.8 | §5h CSS 瘦身切片标签；motion/wallet 保留规则指向 runbook §6.1 |
| v2.9 | §5i 左卡/标题/pill CTA 跨 tab 统一 |
| v2.10 | §5j Button 高度三档：card 42 / external 44 / inverse 38 |
| v2.11 | §5k 标题跨 tab 统一；MetricCard overview chrome SSOT |
