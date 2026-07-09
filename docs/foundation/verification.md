# Foundation 验收（SSOT）

> **流程**：[`runbook.md`](./runbook.md) · **API**：[`api.md`](./api.md)  
> **Baseline**：当前分支 + Figma 正式稿

---

## 1. 双 Gate（每个切片）

| Gate | 含义 | 怎么验 |
|------|------|--------|
| **API** | 公开轴 / 键数与 api.md 一致；无 legacy API | `rg` + `tsc` |
| **视觉** | 红块标签清零或已标；人工对照 Figma / 当前 UI | heatmap 或肉眼；scoped 探针仅确认 |

**发现序**：红块 + 同位置源码优先。整页 `%`、全页 DOM 探针不作发现工具。

**标签**：`REGRESSION` 必修 · `INTENTIONAL` 须理由 · `IGNORE`（动态数 / 1–2px 取整 / 环境差）。

---

## 2. 日常最小命令

```bash
pnpm build:tokens          # 改 tokens.json 后
pnpm exec tsc --noEmit
pnpm exec eslint <paths>
# 可选视觉：pnpm compare:screenshots
```

---

## 3. 切片记录（历史 + 增量）

> 以下 §5* 为已落地切片标签，**保留作回归记忆**。新切片追加一节，勿改旧结论除非回滚。

### 快速索引

| 主题 | 节 |
|------|-----|
| 视觉 SSOT / baseline | §5g |
| Button / flb 动效 | §5ac · §5af · §5aj · §5ak |
| 表头 / flb radius | §5ae |
| FAQ / Collapsible / Pagination | §5ad · §5ag · §5ah · §5ai |
| CommunityProgramCard coral | §5al |
| Text tracking（panel/section） | §5am |
| Text wrap + shell-layout 去字阶 | §5an |
| CommunityProgramCard fluid | §5ao |
| 去硬编码 px tracking / ch / rays hex | §5ap |
| themeHex / toaster / scrollbar 收束 | §5aq |
| 对抗审核共识优化（Chip/Card/字距） | §5ar |
| 分页 Figma | §5u |
| Card / Metric / dark banner | §5m–§5o |

---

## 5. 历史切片标签

> 已落地切片的回归记忆。新切片追加一节；勿改旧结论除非回滚。

### 对照表模板（新切片）

```text
组件: <path>
Figma: <node>
变更: <旧 → 新>
标签: REGRESSION|INTENTIONAL|IGNORE
可接受: Y/N
```

### 可选回归命令

```bash
pnpm exec tsc --noEmit
pnpm lint:all
# 可选：相对旧 worktree
pnpm compare:screenshots
rg 'panel-title|table-cell|on-dark|text-ink-|text-faq-text|coral-bright' src --glob '*.{tsx,ts}'
```

---

## 5a. dapp-genesis-desktop 视觉标签（历史）

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
| Rewards table head faint 30% | REGRESSION→fixed | 曾用 `foreground/30`；现统一 `muted-foreground`（见 §5ae） |
| FAQ answer 盒高 42→70 | REGRESSION→fixed | DApp `FaqList`/`Accordion` answer `py-[1em]` + H5 `max-dapp:text-xs`（≡4175 text-sm/xs）；Home `variant=home` 无 py、H5 `text-xs` |
| Invite step leading 1.3→1.5 | REGRESSION→fixed | 对齐 4175 `dappCaptionClass` |
| Community/Rewards `DappSection` h3 lh 24.75→23.4 | REGRESSION→fixed | 同 §5 section leading 已对齐 1.3 |
| Hero / Global kicker `coral-bright`→`primary` | REGRESSION→fixed | 正式 tone `primary-bright` ≡ Figma `#f4a98f`；禁 `primary` 近似、禁 `text-coral-bright` |
| Hero body `on-dark`→`inverse-muted` | REGRESSION→fixed | 正式 tone；禁 `inverse`+opacity 近似 |
| Input disabled opacity 50→60 | INTENTIONAL | Foundation Input SSOT |
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

## 5g. 视觉 SSOT（2026-07-09 · 定稿：当前 = baseline）

| 角色 | SSOT | 用途 |
|------|------|------|
| **设计意图** | 正式 Figma 画板**实节点** + 可选 `docs/figma-export/raw|frames` | 色 / 字 / 间距 / 组件结构 |
| **实现 baseline** | **当前分支** | 代码与人工验收真相；不再以 Phase0 / 4175 快照为结构 SSOT |
| **可选回归** | `dev` @ 4175 / `compare:*` | 仅回答「相对旧 worktree 是否坏了」 |

**已删除、禁止再引用**：Phase0 `docs/baselines/`、`docs/archive/`、旧规范全书、audit-v2、world-class-goals、废止 stub、口号 Spec JSON。

## 5h. CSS 瘦身切片（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 删 `.aegis-btn-loading-icon` / `aegis-btn-spin` | INTENTIONAL | `ButtonLoadingIcon` → lucide `animate-spin` |
| 删 `.aegis-wallet-connect-intro` | INTENTIONAL | 零 call site |
| 删 `[data-spotlight-card]` | INTENTIONAL | 零属性绑定 |
| heading/section/panel-header 同值 tab 类合并 | INTENTIONAL | 视觉等价；Swap heading 仍 `-0.04em`；panel H5 swap `leading-[1.5]` 保留 |
| InviteFlow 去 `group-data-[tab=community]` | INTENTIONAL | 仅 Community 挂载；布局数值不变 |
| GenesisPromoCard `group-data-[tab=genesis]` | **KEEP** | 亦挂在 Swap footer；删守卫会污染 Swap |
| `home-motion` / `wallet.css` 主路径 | **KEEP** | 见 runbook §5 保留清单 |

## 5i. 左卡 / 标题 / pill CTA 统一（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `DappSideCard` / Rewards·Community 左卡去 `px-4 py-3.5` | INTENTIONAL | 统一 Card `outlined` = `p-3.5` + `rounded-md`（Figma box 14px） |
| Claim / Copy / Join Genesis / Connect promo pill | INTENTIONAL | density：card **42** · external **44** · inverse **38**（Connect/Join Genesis） |
| `DappPanelHeader` PC tracking | INTENTIONAL | 四 tab 共用 `dapp:tracking-[-0.42px]` |
| `DappMetaList` | INTENTIONAL | 不再叠 `rounded-sm px-3.5 py-3`；用 Card 默认 |
| Community 左卡 padding 旧锁 | **解除** | 用户要求跨 tab 统一 |
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

## 5l. DappInlineAlert chrome（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| trade / flash / shell DEV 警告抽 `DappInlineAlert` | INTENTIONAL | destructive border/wash/pad 一处；间距仍 call site |
| `density=compact` vs `comfortable` | INTENTIONAL | widget `px-3.5 py-2.5` · shell `px-4 py-3` |
| 未并入 CalloutCard / Card inverse | KEEP | 浅底告警 ≠ 深色 CTA 卡 |
| Text tracking / tone 轴（标题等） | INTENTIONAL | §5am：panel/section `-0.04em`；正文 `-0.02em` |

## 5m. Card surface / shadow 契约（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `SwapPromoCard` 去 `shadow-subtle` + 重复 `rounded-2xl` | INTENTIONAL | 保留 `soft` → E1；禁 call-site 改 elevation |
| 浅色 `CommunityStatCard`：`elevated`+`shadow-faq` → `soft` | INTENTIONAL | sc = E1；ovc MetricCard 仍 elevated E2 |
| composite 仍 `rounded-lg` / `p-4.5` | KEEP | 抹平 soft 默认 2xl；≡ Figma sc 18（§5z） |
| 暗色 CommunityStat `inverse` + `shadow-none` | KEEP | 艺术卡清影 |
| H5 `max-dapp:shadow-card` | KEEP | 既有移动壳 |

## 5n. 暗色横幅 dappDarkBanner（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `RewardsHeroCard` 去重复 `bg-dark+shadow-card` 基槽 | INTENTIONAL | layout 变体只叠 pad/flex；chrome 来自 `dappDarkBanner` |
| `GenesisGlobalCard` 接入 `dappDarkBanner` | INTENTIONAL | 删手写 dark chrome；pad 仍 composite |
| 未并入 Card `inverse` | KEEP | banner E2 ≠ CalloutCard E3 |
| Text tracking on banner titles | DEFER | A7 |

## 5o. ProgramCard / DappTableCard → Card elevated（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `SwapProgramCard` 裸 div → `Card as="button" elevated` | INTENTIONAL | 去手写 `shadow-card`；pad 仍 `p-4` |
| `CommunityProgramCard` | KEEP | 已是 elevated；文案结构不并 Swap |
| `DappTableCard` / Shell → `Card elevated` | INTENTIONAL | elevation 来自 surface；壳抹 `rounded-2xl`+`p-0`（§5ab 去外边框） |
| `aegis-thirdweb-button*` → `Button` | DEFER | 可迁；高度 36/40 vs sm/md 42/44、玻璃底需 density 或 className；另切片 |

## 5p. Button hover 统一（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| Community shareholder 去 `shadow-primary-hover-xl` | INTENTIONAL | 与 Swap/Claim 同用 `shadow-primary-hover` |
| `ghost` 补 lift + focus-visible | INTENTIONAL | 与 primary/secondary 同 lift 契约 |
| Slippage Confirm → `Button primary md pill` | INTENTIONAL | 删手写 hover |
| wallet `shadow-primary-hover-lg` | DEFER | thirdweb CSS 另切片 |

## 5q. 隐藏面（modal / drawer）第一刀（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| WalletDetails CTA 去 `h-11 text-sm` + 内嵌 Text | INTENTIONAL | 高度/字阶走 Button `md`；连接/未连接两态保留 |
| Token 行 → `Card outlined` | INTENTIONAL | 抹 `rounded-xl` + 浅边/底 |
| `aegisDialogCloseClass`（details + slippage） | INTENTIONAL | Connect / Home popup / mobile-nav close KEEP 分轨 |
| glass modal/drawer ≠ Card surface | KEEP | 禁并轴 |

## 5r. LanguageMenu + mobile-nav vs `dev`（2026-07-09）

对照 worktree `dev` @ `/private/tmp/aegis-dev-baseline`（路径已迁 `shared/ui` / `shell/components`）。

| 面 | vs `dev` | 标签 | 说明 |
|----|----------|------|------|
| LanguageMenu trigger | 视觉对齐 | INTENTIONAL | `coral-wash` / `shadow-card` ≡ 原 oklch wash；DRY `languageTriggerClass` |
| LanguageMenu panel | 视觉对齐 | INTENTIONAL | `shadow-menu` ≡ 原 arbitrary 菜单影 |
| LanguageMenu 行 | 视觉对齐 | KEEP | `text-sm`/`text-xs` 覆盖（防 headline 溢出） |
| mobile-nav 标签 | **REGRESSION→fixed** | 曾用 Text `caption`(10px)；改回 `copy`+`text-sm font-semibold` ≡ `dev` 继承 |
| drawer item 行 | INTENTIONAL | 字阶只在 Text；`shellMobileDrawerItemClass` 只留色/间距 |
| drawer close | KEEP | 透明 X ≠ `aegisDialogCloseClass`（modal 圆框） |
| `data-dapp-mobile-nav*` | KEEP | 动效钩子 |
| 删 `--shadow-primary-hover-xl` | INTENTIONAL | 无 call site；`*-lg` 仍给 wallet.css |
| ConnectEmbed / thirdweb button | DEFER | 另切片 |
| Text tracking A7 | DEFER | 另切片 |

## 5s. Genesis 全球卡「查看合约」按钮（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `contractButton` 恢复 `!` 覆盖 secondary | REGRESSION→fixed | `dev`：透明底 + 白边；无 `!` 时被 `bg-card`/`border-border`/coral lift 盖掉 |
| `!w-auto` 压掉 md+pill `w-full` | REGRESSION→fixed | `dev` 仅 sm+pill 全宽；现 sm\|md+pill→`w-full` 把 absolute 钮拉满，看起来不靠右 |
| content `pr-36` / H5 `pr-28` | REGRESSION→fixed | 见 §5v：非 flex gap；H5 预留应在 kicker 且够 EN 钮宽 |
| 额外压掉 secondary hover lift/shadow | INTENTIONAL | 暗色横幅上勿抬升/灰影 |
| 未新增 Button variant | KEEP | 单 call site；用 className 抹平 |

## 5v. Genesis 全球卡 H5 标题↔合约钮间距（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 去掉 content `pr-36` / `max-dapp:pr-28` | REGRESSION→fixed | CTA `absolute`，不是兄弟 flex `gap`；整块 content 右垫会误伤 value/body |
| kicker `max-dapp:pr-44` | INTENTIONAL | ≡ `dev` 把预留放 kicker；`pr-28` 对 EN “View contract”(~150px) 不够，换行顶到钮 |
| PC 不强制 kicker pr | KEEP | 宽卡上标题单行自然让位；与 `dev` 一致 |

## 5t. LanguageMenu 间距 + 分页菜单字阶（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| LanguageMenu panel `gap-0.5` → `gap-1.5` | INTENTIONAL | 项间距过挤；trigger/行高仍 ≡ `dev` |
| 分页 trigger/菜单项恢复 `text-xs` | REGRESSION→fixed | 曾用 Text `headline`(16) 撑大；≡ `dev` `text-xs font-semibold` |
| 分页去 `tabular` + `min-w-22`→hug | INTENTIONAL | 过渡态；已被 §5u Figma 固定宽覆盖 |
| 菜单项 active 色回 `font-semibold text-primary` | REGRESSION→fixed | 过渡态；已被 §5u `text-coral` 覆盖 |

## 5u. 分页 ↔ Figma `4067:258`（2026-07-09）

SSOT：`n8nD6qqAtikNhP3xuH8PRS` node `4067:258`（非 4175/`dev` 结构）。

| 变更 | 标签 | 说明 |
|------|------|------|
| 控件圆角 `rounded-[6px]` | INTENTIONAL | Figma 6px；`rounded-sm` token=14px 不可用 |
| 页码 pill `w-20 h-8 px-3` + `gap-0.5` | INTENTIONAL | Figma 80×32 · px12 · gap2 |
| 页码/chevron/菜单 active → `text-coral` + `bg-accent` | INTENTIONAL | Figma `#c85c3f` / coral@10%；≡ Chip soft coral（非 `primary`） |
| 控件簇 `gap-1`；「每页」↔控件 `gap-4` | INTENTIONAL | Figma 4px / 16px |
| 左右文案 `text-xs` muted | INTENTIONAL | Figma 12 Regular body@70% |
| prev/next `text-coral` on `pill-muted-bg` | INTENTIONAL | Figma 灰底 + coral 箭头 |
| 下拉菜单不在本节点 | KEEP | 保留 portal 菜单；圆角/active 色跟控件收敛 |

## 5w. 数字比例字 SSOT（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 删除 `Text` / `Card.Value` / `MetricCard` `tabular` prop | INTENTIONAL | 等宽偏疏；定稿比例字 |
| 全仓去掉 `tabular` / `tabular-nums` | INTENTIONAL | wallet / Genesis metrics / SwapMetricCard / responsive-table |
| tracking 收紧实验 | DEFER | 不跟等宽一起做；A7 标题另切片 |

## 5x. Community 邀请人 Bind ↔ Input / MAX Chip（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 未绑定 input → `Input` default | REGRESSION→fixed | 删手写 `communityReferrerInput`（muted 字色 / 无 placeholder token / 无 focus） |
| Bind → Chip soft coral + `fieldActionChipClass` | INTENTIONAL | ≡ Genesis MAX；删 `DappActionButton shape="inline"` |
| `fieldActionChipClass` 抽到 `chip.tsx` | INTENTIONAL | MAX / Bind 共用 field-adjacent chrome |
| 布局 `flex gap-2` | INTENTIONAL | ≡ shares 行（input + chip） |

## 5y. Community 开始邀请步骤线 + 未登录顶距（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| InviteFlow PC：`gap-x-0` + 线两侧各 `gap-2.5`/`pr-2.5` | REGRESSION→fixed | 横线两端与序号间距相等；去掉列 `gap-3.5`+`px-1` 造成的不对称 |
| `DappDetailPage` `[&>section:first-child]:mt-0` | INTENTIONAL | 未登录「开始邀请」为首段时去掉 `DappSection` 的 `mt-8.5` |

## 5z. CommunityStat 浅色 sc ↔ Figma `4040:7313`（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| value `muted-foreground` → `foreground` | REGRESSION→fixed | Figma ink `#0b0e14`，非 70% body |
| volume `primary` → `text-coral` | REGRESSION→fixed | Figma accent/coral `#c85c3f`（≠ primary `#e86a43`） |
| today `foreground/30` → `/40` | INTENTIONAL | Figma text/muted 40% |
| value `tracking-[-1.2px]` · `leading-[1.2]` | INTENTIONAL | Figma 30px 字距/行高 |
| volume / label / today tracking+leading | INTENTIONAL | Figma -0.28 / -0.24 / -0.12 · lh 1.2/1.5 |
| radius `rounded-md` → `rounded-lg` (18) | INTENTIONAL | Figma sc `rounded-[18px]` |
| skeleton light → `soft` + 同 chrome | REGRESSION→fixed | 曾用 elevated；与 sc soft 不一致 |
| 暗色 sc | KEEP | inverse + coral-bright；艺术卡清影 |

## 5aa. Swap `flb` 中间钮 ↔ Figma `4040:1662`（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `swapFlowButtonClass` SSOT | INTENTIONAL | 34×34 · `rounded-control` · border · card · text-sm/-0.28 |
| Trade flip：`size-8`/`rounded-sm` → `swapFlowButtonClass` | REGRESSION→fixed | ≡ Figma flb；保留 hover lift + 旋转 |
| Flash divider 共用同一 chrome | INTENTIONAL | 仍用 chevron SVG；壳与 Trade 一致 |

## 5ab. flb 圆角 / InviteFlow desc / 表壳无边框（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| flb `rounded-control` → `rounded-[11px]` | SUPERSEDED | 见 §5ae：用户定稿回 `rounded-control` |
| InviteFlow desc 去 `text-foreground/30` | REGRESSION→fixed | Figma `4040:7330` text/body 70% = `muted-foreground` |
| `DappTableCard` shell `border-0` | INTENTIONAL | 仅阴影；内部分隔线保留 |

## 5ac. Button / flb 平滑 hover + 按下（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| Button 过渡 `180ms ease-out` → `220ms cubic-bezier(.2,.8,.2,1)` | INTENTIONAL | 去生硬 snap |
| `active:translate-y-0` + 清影 | INTENTIONAL | 按下回落；hover 仍 lift |
| flb `swapFlowButtonInteractiveClass` 同曲线 + active | INTENTIONAL | Trade flip 与 Button 手感一致 |

## 5ad. CommunityProgramCard / FAQ chevron / Collapsible 展开（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `CommunityProgramCard` ≡ Figma `4040:7354` | REGRESSION→fixed | pad/gap/字阶；accent 见 §5al（coral，非 primary） |
| FAQ `FaqChevron` 换 path → 固定 path + `rotate-180` | REGRESSION→fixed | 箭头转动；色仍 open=`primary` |
| Collapsible `overflow-visible` 打断 `0fr→1fr` | INTENTIONAL | settle 后再挂；CSS 覆盖见 §5ag（删覆盖会裁表卡阴影） |

## 5ae. flb `rounded-control` + 全表表头 ≡ Community（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `swapFlowButtonClass`：`rounded-[11px]` → `rounded-control` | INTENTIONAL | 用户允许的 control radius；禁再写 11px 字面量 |
| 基线 class 去掉 transition（交互态只在 Interactive） | INTENTIONAL | 静态 Flash divider 不带 hover 过渡 |
| `ResponsiveTable` 表头去 Rewards `foreground/30` | REGRESSION→fixed | ≡ Community「我的社区成员」`muted-foreground` |
| 删 `headCellClassName` / `rewardsHistoryTableHead` | INTENTIONAL | 表头无 call-site 分叉 |

## 5af. Button / flb 轻微缩放（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 去 `-translate-y-px` lift | REGRESSION→fixed | H5 无 hover，抬起无效 |
| hover `scale-[1.02]` · active `scale-[0.97]` | INTENTIONAL | 按下缩放触控可感知；PC 仍有轻微 hover 放大 |
| flb Interactive 同策略（1.04 / 0.94） | INTENTIONAL | 小钮略大一点幅度 |

## 5ag. Collapsible 恢复 overflow-visible 覆盖（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 恢复 `[data-open=true] .overflow-visible { overflow: visible }` | REGRESSION→fixed | 基类 `overflow:hidden` 盖住 Tailwind；Rewards 表卡 `shadow-card` 被裁 |
| settle 后再挂 `overflow-visible` | KEEP | 展开高度动画仍可用 |

## 5ah. FAQ chevron rotate + color（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| Chevron 改 CSS `.faq-chevron` + `[data-state=open]` | REGRESSION→fixed | 旋转 + 颜色同 280ms；不靠 React 条件 class |
| 关态 `foreground@40%` → 开态 `primary` | INTENTIONAL | 与展开态强调色一致 |

## 5ai. Pagination 页码箭头随菜单开关旋转（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 箭头只跟 `menuOpen`：关下 / 开上 | REGRESSION→fixed | 不再跟 menuPlacement 翻转 |
| `transition-transform` 220ms | INTENTIONAL | 与 Button / FAQ 手感一致 |

## 5aj. Button / flb 平滑 scale（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| scale `1.02/0.97` → `1.015/0.98` | SUPERSEDED | 见 §5ak |
| ease → `cubic-bezier(0.22,1,0.36,1)` · 200ms | SUPERSEDED | 见 §5ak |
| 去掉 `active:shadow-none` | REGRESSION→fixed | 阴影硬切是不平滑主因之一 |

## 5ak. Button / flb 极轻 scale（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| scale → `1.008` / `0.992` | INTENTIONAL | 用户要更轻；几乎无弹感 |
| `duration-160 ease-out` · `active:duration-75` | INTENTIONAL | 短、直、不抢戏 |

## 5al. CommunityProgramCard coral accent（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| label/CTA `primary` → `text-coral` | REGRESSION→fixed | Figma `4040:7354` accent `#c85c3f`（≠ primary `#e86a43`） |
| 锁 `11` / `16` / `13` 字阶 | INTENTIONAL | 对齐稿面；禁 H5 平行缩字 |

## 5am. Text tracking ≡ Figma Genesis（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `panel` / `section` token `-0.02em` → `-0.04em` | REGRESSION→fixed | ≡ Figma `31:2` 标题（21→`-0.84px`、18→`-0.72px`） |
| `WidgetHeader` 去 `tracking-[-0.02625em]` | REGRESSION→fixed | 跟 panel token；禁半档覆盖 |
| MetaList / SwapMeta / Shares label 去 `tracking-normal` | REGRESSION→fixed | 正文 `-0.02em`；禁抹成 0 |
| `ResponsiveTable` cell `tracking-[-0.02em]` | REGRESSION→fixed | ≡ 表单元格 `-0.26px` @13 |
| copy/detail/caption 等保持 `-0.02em` | INTENTIONAL | 已对齐稿面；非偏宽根因 |
| Input / Button 内 `tracking-normal` | INTENTIONAL | 控件 chrome；不跟正文 token |

## 5an. 全站 Text 包裹 + shell-layout 去平行字阶（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `shellRailItemClass` 去掉 `text-xs/font/leading/tracking` | REGRESSION→fixed | 布局+色 only；字阶在 rail `Text` |
| auth-prompt / connect-promo → `Text` | REGRESSION→fixed | 禁裸 `<p>`/`<strong>` 自管字阶 |
| collapsible title | INTENTIONAL | `DappSection` 已 `<Text section>`；内层 span 仅布局 |
| `ResponsiveTable` / `DataTable` 表头与标量 cell → `Text copy` | REGRESSION→fixed | th/td chrome 不带 type scale |
| swap-program-card / language trigger / wallet chip → `Text` | REGRESSION→fixed | |
| Home header nav·CTA / hero eyebrow / security checks → `Text` | REGRESSION→fixed | brand 链布局壳保留；字在 `Text` |
| `Text as="label"` | INTENTIONAL | form a11y（slippage sr-only） |
| Button `asChild` 内链文案 | INTENTIONAL | Button 自管字阶（runbook §3） |
| MetaList label 内联 tooltip 文案 | INTENTIONAL | 外层 `Text detail` 已包；内层勿叠 |

## 5ao. CommunityProgramCard 去 px / ch 锁（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 去掉 `text-[11px]`/`[13px]`/`max-w-[38ch]` | REGRESSION→fixed | 高分屏 `site-fluid` 下 px 不随根 rem；ch 限宽挤窄 |
| 字阶改走 Text eyebrow/headline/copy token | INTENTIONAL | ≡ Figma 11/16/13 @16px；fluid 时同比放大 |
| CTA 进 `Text copy` + coral | INTENTIONAL | 与正文同 token；禁 action 手写 px |
| 去 `overflow-hidden` | INTENTIONAL | 避免 fluid 后裁切；卡高随内容 |

## 5ap. 去硬编码 px tracking / ch / rays hex（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| 全仓 `tracking-[…px]` → `em` 或删（跟 Text token） | REGRESSION→fixed | px 不随 `site-fluid`；相对字号用 em |
| 去掉 `max-w-[24\|34\|70ch]` | REGRESSION→fixed | 禁 ch 锁宽；布局用 max-w-none / 容器 |
| hero-rays `#8a8f98`/`#868b94` → `--hero-rays-*` | REGRESSION→fixed | engineering vars in generate-tokens |
| Rewards/Genesis `text-[1.125rem]`/`[0.875rem]` → type token / brand | REGRESSION→fixed | 禁 rem 字号字面量盖 Text |
| security check `text-[0.9375rem]` → detail token | REGRESSION→fixed | |
| `theme.ts` / wallet CSS oklch | → §5aq | 见下节 |

## 5aq. themeHex / toaster / scrollbar 收束（2026-07-09）

| 变更 | 标签 | 说明 |
|------|------|------|
| `tokens.ts` 生成 `colorHex`；`themeHex` 从中取 brand 色 | INTENTIONAL | JS runtime SSOT ≡ tokens.json；禁平行 hex 表 |
| thirdweb Connect 灰阶 / `#3A201A` 保留字面量 | INTENTIONAL | Connect chrome-only，非产品色轴；`dark`/`inverse`/`success`/`coral-emphasis` 已 alias |
| toaster / scrollbar idle·track / wallet ring·modal shadow → CSS vars | REGRESSION→fixed | engineering `:root`；E7–E10 已在 tokens.json shadows |
| home security section `min-h` → `--home-security-section-min-h*` | INTENTIONAL | 布局 rem 进 engineering vars |
| Button `sm` `min-h-[2.625rem]`、widget subtitle `max-w-[17.5rem]`、season card rem | INTENTIONAL | API / 布局字面量；非色硬编码 |

## 5ar. 对抗审核共识优化（2026-07-09）

5 agent（3×Grok + 2×Composer）独立审 UI/样式/组件后仲裁。**共识 Verdict：NEAR / 未达世界级** — primitive/shell 强；call-site 半迁移 + 交互语言分叉。

| 变更 | 标签 | 说明 |
|------|------|------|
| Chip press ≡ Button scale `1.008`/`0.992`；去 `translate-y`；duration 160 | REGRESSION→fixed | 交互语言统一（审核 B/E） |
| `SwapMetaPanel` 去叠 `rounded-xl`/pad → Card outlined 默认 | REGRESSION→fixed | ≡ `DappMetaList`（审核 C） |
| Home security/roadmap Card `outlined`+`shadow-card` → `elevated` | REGRESSION→fixed | 禁 call site 改 elevation（审核 E） |
| Home eyebrow / partners / footer / roadmap / program-card 去手写 tracking | REGRESSION→fixed | 跟 Text token（审核 A） |
| partners 名包 `<Text>`；分页去 `tracking-normal` | REGRESSION→fixed | |
| `season-card` 槽位去平行 font/leading/tracking；title→`headline` | REGRESSION→fixed | 字阶交 Text（审核 A/C） |
| `shared.css` body wash → `--app-body-wash`；删 `themeHex.faqText` | REGRESSION→fixed | 工程洁癖（审核 D） |
| wallet hover `translateY`→scale；`*-hover-lg`→`shadow-primary-hover` | REGRESSION→fixed | 手感对齐；全量 thirdweb→Button 仍 DEFER |
| Home hero 6xl / DApp views 非法 `max-dapp` 字阶 / slippage preset 手写钮 | DEFER | 需 marketing type 轴或另切片；本轮不扩 Text 轴 |
| `staticExtraTheme` 平行影 / CalloutCard 死码 / composite 豁免收窄 | DEFER | 另切片 |

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
| v2.8 | §5h CSS 瘦身切片标签；motion/wallet 保留规则指向 runbook §5 |
| v2.9 | §5i 左卡/标题/pill CTA 跨 tab 统一 |
| v2.10 | §5j Button 高度三档：card 42 / external 44 / inverse 38 |
| v2.11 | §5k 标题跨 tab 统一；MetricCard overview chrome SSOT |
| v2.12 | §5l `DappInlineAlert`；Text A7 另切片 |
| v2.13 | §5m Card surface 契约：promo / CommunityStat 消叠影 |
| v2.14 | §5n `dappDarkBanner` 暗色横幅 SSOT |
| v2.15 | §5o ProgramCard / DappTableCard → elevated；thirdweb→Button DEFER |
| v2.16 | §5p Button hover SSOT |
| v2.17 | §5q 隐藏面第一刀：WalletDetails / dialog close |
| v2.18 | §5r LanguageMenu DRY + mobile-nav 字阶对齐 `dev`；删 hover-xl |
| v2.19 | §5s Genesis 全球卡合约按钮 vs `dev` 回归修复 |
| v2.20 | §5t LanguageMenu gap；分页菜单 text-xs；全球卡 content pr |
| v2.21 | §5u 分页对齐 Figma `4067:258`（6px / coral / 80×32 / 4·16 gap） |
| v2.22 | §5v Genesis 全球卡 H5：kicker `pr-44` 预留绝对定位 CTA（非 flex gap） |
| v2.23 | §5w 删除 `tabular` / `tabular-nums`；数字定稿比例字 |
| v2.24 | §5x Community Bind → Input + fieldActionChip（≡ Genesis MAX） |
| v2.25 | §5y InviteFlow 步骤线等距；Detail 首段 `mt-0` |
| v2.26 | §5z CommunityStat 浅色 sc ≡ Figma `4040:7313` |
| v2.27 | §5aa Swap flb 中间钮 ≡ Figma `4040:1662` |
| v2.28 | §5ab flb 11px；InviteFlow desc 70%；表壳无外边框 |
| v2.29 | §5ac Button/flb 平滑 hover + active 按下 |
| v2.30 | §5ad CommunityProgramCard ≡ `4040:7354`；FAQ rotate；Collapsible settle overflow |
| v2.31 | §5ae flb → `rounded-control`；全表表头 ≡ Community muted |
| v2.32 | §5af Button/flb 轻微 scale（替 translate lift） |
| v2.33 | §5ag 恢复 collapsible overflow-visible 覆盖（表卡阴影） |
| v2.34 | §5ah FAQ chevron CSS rotate + color |
| v2.35 | §5ai Pagination 页码箭头关下开上 + 动画 |
| v2.36 | §5aj Button/flb 更平滑 scale |
| v2.37 | §5ak Button/flb 极轻 scale `1.008`/`0.992` |
| v2.38 | §5al CommunityProgramCard label/CTA → coral |
| v2.39 | 当前分支 = baseline；删过时文档 / Phase0 baselines / archive |
| v3.0 | 规范收束：双 gate + 日常命令 + 切片索引前置；历史 §5* 仅作回归记忆；对齐 runbook/api v3.0 |
| v3.1 | §5am Text tracking：panel/section → `-0.04em`；去 meta/table `tracking-normal` |
| v3.2 | §5an 全站 Text 包裹；`shell-layout` 去平行字阶 |
| v3.3 | §5ao CommunityProgramCard：去 px/ch 锁，跟 site-fluid |
| v3.4 | §5ap 去硬编码 px tracking / ch / hero-rays hex |
| v3.5 | §5aq themeHex←colorHex；toaster/scrollbar/wallet 色影走 vars |
| v3.6 | §5ar 对抗审核共识：Chip/Card/字距/wallet hover；世界级仍 NEAR |
