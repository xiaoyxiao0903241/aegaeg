# DApp 链上 / API 数据源与使用对照

> 最后更新：2026-06-18  
> 范围：BSC Mainnet EVM DApp（Genesis / Rewards / Community / Swap）  
> API 前缀：`/api`；鉴权：`Authorization: Bearer <JWT>`（`POST /auth/login` 除外）

**图例**：✅ 已展示或参与业务逻辑 · ⚠️ 部分使用 · ❌ 已接入类型/接口但未读 · 🔧 写操作/流程 · — 无前端接入

---

## 1. 总览

| 类别 | 数量 | 说明 |
|------|------|------|
| 后端 API 路径 | 11 | 均在 `src/lib/api/endpoints.ts` |
| 文档有 Schema 无 path | 2 | `/sales/total`、`RewardTotal(claimed/pending)` 形态 |
| 链上合约（读） | 4 类 | preSale / referral / ERC20 / Pair+Router |
| 链上合约（写） | 4 类 | purchase / bindReferral / approve / claim |
| 链上 view 已封装未调用 | 2 | `referral.getChildren`、`rewardClaimer.rewardSigner` |

**合约地址**（`src/config/contracts.ts`）：

| 合约 | 地址 |
|------|------|
| preSale | `0xf10feC936B15c27C59068F71e319e667ECda56e5` |
| referral | `0xe0F3AE113dD3997982AE9ad7d5510ffA4E3Cce71` |
| rewardClaimer | `0x697B55FCFBC4Cd5401f605EE4D9905816c127f07` |
| usd1 | `0x32Bb0be09F62bbE69764906d80e9A5782C7F7633` |
| xxToken | `0x558D83257Cfb97a994ACC25233fe741062F9AcC2` |
| xxUsd1Pair | `0x606211E7e7276149fc503fe8Db858745479a9100` |
| pancakeRouter | `0x10ED43C718714eb63d5aA57B78B54704E256024E` |

### 1.1 单源 SSOT 约定

以下业务语义**禁止**再做多源 `max()` / fallback 混读；口径以本表为准。

| 业务语义 | SSOT | 消费位置 | 不再读取 |
|----------|------|----------|----------|
| 团队 / 体系业绩 | `GET /team/overview` → `sales_team_market` | Community 统计卡；Rewards 体系业绩进度 | `/performance.sales_team_market` |
| 单期个人预售累计（Widget 空投预览） | 链上 `preSale.userTotalAmount` | `use-genesis-widget` → `periodContributedUsd` | `/performance.presale_volume` |
| 单期个人预售累计（Content 累计共建进度） | 链上 `preSale.userTotalAmount` | `genesis-tab` → `contributedUsd` | `/performance.presale_volume`、`sum_invest_usdt`、`/sales/logs` 金额合计 |

**例外（仍双源）**：创世等级个人业绩在 `useShareholderRank` 中取 `max(API presale_volume, 链上 userTotal)`，用于等级展示兜底；与 Genesis 认购进度条 / 空投预览口径分离。

---

## 2. 后端 API

### 2.1 接口级对照

| # | 方法 | 路径 | Hook | 主要页面 | 状态 |
|---|------|------|------|----------|------|
| 1 | POST | `/auth/login` | `login()` | 全局 SIWE | ✅ |
| 2 | GET | `/performance` | `usePerformance()` | Rewards / Community(等级) | ⚠️ 10 字段仅用 2 |
| 3 | GET | `/sales/logs` | `useSalesLogs()` | Genesis 认购记录表 | ⚠️ |
| 4 | GET | `/rewards/logs` | `useRewardLogs()` | Rewards 推荐奖励历史 | ⚠️ |
| 5 | GET | `/referral/total` | `useReferralTotal()` | Rewards 直推奖励余额 | ⚠️ |
| 6 | GET | `/team-reward/total` | `useTeamRewardTotal()` | Rewards 等级奖励可领额 | ⚠️ |
| 7 | GET | `/team/referrals` | `useTeamReferrals()` | Community 邀请列表 | ⚠️ |
| 8 | GET | `/team/overview` | `useTeamOverview()` | Community 统计卡；Rewards 体系业绩 | ✅ |
| 9 | GET | `/team-reward/logs` | `useTeamRewardClaimLogs()` | Rewards 等级奖励历史 | ⚠️ |
| 10 | POST | `/claim/team-reward` | `requestTeamRewardSignature()` | 领取流程 | 🔧 |
| 11 | POST | `/claim/confirm` | `confirmTeamRewardClaim()` | 领取后回写 | ⚠️ `order.amount` 用于成功 toast |

### 2.2 `GET /performance`

| 字段 | 含义 | 状态 | 用在哪里 |
|------|------|------|----------|
| `presale_volume` | 预售自购 | ⚠️ | 仅 `useShareholderRank` 个人等级兜底（与链上取 max）；Genesis 进度/空投不读 |
| `presale_rank` | 创世等级 S1–S10 | ✅ | Community 第三张卡；Rewards 等级/hero/等级表高亮 |
| `sales_team_market` | 体系/团队业绩 | ❌ | SSOT 为 `/team/overview` |
| `address` | 用户地址 | ❌ | 使用 thirdweb `account.address` |
| `direct_presale_volume` | 直推业绩 | ❌ | SSOT 为 `/team/overview` |
| `sum_invest_usdt` | 总投资 USDT | ❌ | 见 [§5](#5-总投资与-5000-门槛) |
| `presale_referral_reward` | 预售推荐奖累计 | ❌ | 金额走 `/referral/total` |
| `market_team_reward` | 做市团队极差奖累计 | ❌ | 走 `/team-reward/total` |
| `presale_team_reward` | 预售团队极差奖累计 | ❌ | 同上 |
| `team_reward_claimed` | 团队奖已领取 | ❌ | 同上 |

### 2.3 `GET /team/overview`

| 字段 | 含义 | 用在哪里 |
|------|------|----------|
| `direct_referral_count` | 直推人数 | Community 统计卡「直推人数」 |
| `descendant_count` | 全部下级数 | Community「我的团队」；邀请区标题 `{count}` |
| `direct_presale_volume` | 直推业绩 | Community 直推业绩副文案 |
| `sales_team_market` | 团队业绩 | Community 团队业绩副文案；**Rewards 体系业绩进度（SSOT）** |

### 2.4 列表类接口字段摘要

**`/sales/logs` 单条 `SalesLogItem`**

| 字段 | 展示 |
|------|------|
| `amount`, `block_time`, `phase_id`, `tokens`, `tx_hash` | ✅ Genesis 认购表 |
| `total`, `page`, `page_size` | ✅ 分页 |
| `id`, `node_type`, `status`, `block_number`, `log_index`, `created_at` | ❌ |

**`/rewards/logs` 单条 `RewardLogItem`**

| 字段 | 展示 |
|------|------|
| `amount`, `from_address`, `order_amount`, `block_time`, `status` | ✅ Rewards 推荐历史表 |
| `reward_type`, `to_address`, `tx_hash`, `id`, … | ❌ |

**`/team/referrals` 单条 `TeamReferralItem`**

| 字段 | 展示 |
|------|------|
| `address`, `register_time`, `presale_rank`, `direct_referral_count`, `sales_team_market` | ✅ Community 邀请表 |

**`/team-reward/logs` 单条 `TeamRewardClaimLogItem`**

| 字段 | 展示 |
|------|------|
| `amount`, `status`, `claimed_at` / `created_at` | ✅ Rewards 等级奖励历史 |
| `bonusRate` 列 | ⚠️ | 非 API 字段；由当前等级静态表 `getTeamBonusRateLabel` 推导贡献额 |

**`/referral/total` / `/team-reward/total`**

| 字段 | 展示 |
|------|------|
| `total`, `claimed` | ✅ Rewards 余额卡 |
| `items[].source_type/total/claimed` | ✅ 仅团队奖 meta 拆分（MARKET / PRESALE） |

**领取流程 `POST /claim/*`**

| 数据 | 用途 |
|------|------|
| `signature`, `salt`, `amountWei` | 🔧 链上 `rewardClaimer.claim()` |
| `ClaimConfirmResult.order.amount` | ⚠️ | 领取成功 toast `+{amount}` |
| `ClaimConfirmResult.summary` | ❌ | 完整汇总未展示 |

### 2.5 文档有、前端未接

| 接口/Schema | 说明 |
|-------------|------|
| `GET /sales/total` → `total_amount` | OpenAPI 有 Schema，无 path |
| `RewardTotal`（`claimed_amount` / `pending_amount`） | 与现有 `RewardTotals` 结构不同，无 path |

---

## 3. 链上数据

### 3.1 `preSale`

| 方法/字段 | 读/写 | 状态 | 用在哪里 |
|-----------|-------|------|----------|
| `phases(i).minAmount` / `maxAmount` | 读 | ✅ | Genesis 份额上下限、quota |
| `phases(i).discountBps` | 读 | ✅ | 折扣、AGX 估算、Season 选项 |
| `phases(i).startTime` / `endTime` | 读 | ✅ | 阶段激活、倒计时、Season 日期 |
| `phases(i).purchasedAmount` | 读 | ✅ | Widget `quotaLabel` 阶段池进度 `%` |
| `userTotalAmount(user)` | 读 | ✅ | Genesis 累计共建进度 + 空投预览（SSOT）；等级链上兜底 |
| `totalPurchasedAmount()` | 读 | ✅ | Genesis「全球累计共建」 |
| `agxPrice()` | 读 | ✅ | AGX 估价、Season 价格 |
| `purchase(phase, amount)` | 写 | 🔧 | Genesis 认购 |

### 3.2 `referral`

| 方法 | 读/写 | 状态 | 用在哪里 |
|------|-------|------|----------|
| `isBindReferral` | 读 | ✅ | Community 绑定态 |
| `getReferral` | 读 | ✅ | 已绑定推荐人展示 |
| `getReferralCount` | 读 | ✅ | `useReferral`（Community 统计已改 API） |
| `getChildren` | 读 | ❌ | 已封装 `readReferralChildren`，未调用 |
| `bindReferral` | 写 | 🔧 | Community 绑定推荐人 |

### 3.3 `rewardClaimer`

| 方法 | 读/写 | 状态 |
|------|-------|------|
| `claim(salt, amount, signature)` | 写 | 🔧 Rewards 团队奖领取 |
| `rewardSigner()` | 读 | ❌ 未调用 |

### 3.4 ERC20 / Router / Pair

| 方法 | 用在哪里 |
|------|----------|
| `balanceOf` | Genesis USD1；Swap 余额；钱包详情 |
| `allowance` | Genesis / Swap 授权检查 |
| `approve` | 🔧 授权交易 |
| `getAmountsOut` | Swap 报价 |
| `getReserves` + `token0/1` | DApp Rail / Swap 池率 `usePairSpotRate` |
| `swapExactTokensForTokensSupportingFeeOnTransferTokens` | 🔧 Swap 成交 |

### 3.5 钱包（非合约 view）

| 数据 | 用在哪里 |
|------|----------|
| thirdweb `account.address` | 登录、推荐链接、全站钱包态 |
| `signMessage` | SIWE 登录 |

---

## 4. 按页面汇总

| 页面 | 链上 | API | 静态配置 |
|------|------|-----|----------|
| Genesis 左栏 Widget | phases、agxPrice、**userTotal（SSOT）**、USD1 余额/授权；quota 含阶段池 `%` | — | `PRESALE_CONFIG` fallback |
| Genesis 右栏 Content | **userTotal（SSOT）**、activePhase.max、totalPurchased | `/sales/logs`（仅认购表） | FAQ、等级表、`data.ts` seasons fallback |
| Rewards 左栏 Widget | userTotal（等级兜底） | `/performance`（个人）、`/team/overview`（团队业绩）、`/referral/total`、`/team-reward/total`、claim | `tier-table` 阈值；未连接占位 |
| Rewards 右栏 Content | — | `/rewards/logs`、`/team-reward/logs` | 等级表、FAQ；历史奖励比例来自静态表 |
| Community 左栏 Widget | referral 绑定/推荐人 | — | 推荐链接=钱包地址；QuickLinks `#` 占位 |
| Community 右栏 Content | — | `/team/overview`、`/team/referrals`；等级经 `/performance` | FAQ；三张卡 `today` 均为 i18n 静态文案 |
| Swap | 余额、allowance、quote | — | `SWAP_CONFIG` |
| DApp Rail | Pair 现货率 | — | — |
| 全局 Auth | 签名 | `/auth/login` | — |

---

## 5. 总投资与 5000 门槛

### 5.1 `sum_invest_usdt`（API）

- 定义：`GET /performance` 响应字段，表示后端汇总的「总投资 USDT」。
- **前端状态：❌ 未使用**（仅在 `src/lib/api/types.ts` 类型定义）。
- Genesis 累计共建进度 SSOT 为链上 `userTotalAmount`，不读本字段。

### 5.2 前端现有的 5000 USD 逻辑

| 场景 | 规则 | 数据来源（SSOT） | 代码位置 |
|------|------|------------------|----------|
| **X 空投预览资格** | 单期累计共建 + 本次认购 ≥ **5,000 USD** | 链上 `userTotalAmount` + 当前 `payUsd1` | `use-genesis-widget` |
| **创世等级 S5** | 个人认购 ≥ **$5,000** | `max(API presale_volume, 链上 userTotal)`（等级例外） | `use-shareholder-rank` |
| **体系业绩 S1 团队门槛** | 团队业绩 ≥ **$5,000** | `/team/overview.sales_team_market` | `rewards-tab` |

X 空投判断核心代码：

```ts
// src/lib/presale/presale-math.ts
export const X_AIRDROP_MIN_PERIOD_USD = 5_000

export function resolveXTokenAirdropUsdForPurchase(
  periodContributedUsd: number,
  payUsd1: number,
  phaseIndex: number,
): number {
  const periodTotalUsd = periodContributedUsd + payUsd1
  if (periodTotalUsd < X_AIRDROP_MIN_PERIOD_USD || payUsd1 <= 0) return 0
  return estimateXTokenAirdropUsd(payUsd1, phaseIndex)
}
```

```ts
// src/hooks/use-genesis-widget.ts
const periodContributedUsd = Number(formatTokenAmount(userTotal, USD1_DECIMALS, 0))
const xTokenAirdropUsd = resolveXTokenAirdropUsdForPurchase(
  periodContributedUsd,
  payUsd1,
  phaseIndex,
)
```

```ts
// src/app/tabs/genesis-tab.tsx
const contributedUsd = Number(formatTokenAmount(genesis.userTotal, 18, 0))
```

### 5.3 字段口径对照

| 字段 | 来源 | 用于 ≥5000？ | 说明 |
|------|------|-------------|------|
| `sum_invest_usdt` | API `/performance` | ❌ | 未接入 |
| `presale_volume` | API `/performance` | ❌（空投/进度） | 仅等级兜底双源 |
| `userTotalAmount` | 链上 preSale | ✅（空投 + 累计共建） | Genesis Widget / Content SSOT |
| `sales_team_market` | API `/team/overview` | ✅（S1 团队） | Community + Rewards SSOT |

链上 **没有** 返回「是否满 5000」的 view；空投门槛为前端本地预览。

### 5.4 链上与 API 索引延迟

认购成功后，链上 `userTotalAmount` 立即更新；`/sales/logs` 与 `presale_volume` 可能滞后。累计共建进度与空投预览 intentionally 只信链上，避免双源 max 掩盖延迟差异。表为空但链上 > 0 时仍显示 `showSalesSyncHint`。

---

## 6. 已知缺口与建议

| 缺口 | 建议 |
|------|------|
| Community「今日 +N」直推/团队增量 | 无 API 字段；UI 保留 i18n 静态占位（`statDirectToday` / `statTeamToday`）；若需真实数据需后端新接口 |
| `claim/confirm` 的 `summary` 未完整展示 | 可复用 `order` 外字段做领取后余额刷新提示 |
| `/performance` 多数字段未用 | 含 `presale_volume`（Genesis 已不读）、`sum_invest_usdt`、`sales_team_market` 等 |
| `sum_invest_usdt` | 若产品要以「总投资」驱动进度/资格，需先对齐 §1.1 再改 SSOT |
| `getChildren` / `rewardSigner` 未用 | 无需求则保持；直推列表继续走后端 |
| Community QuickLinks `href: '#…'` | 待运营提供真实文档/社媒 URL |
| Rewards 历史表 `reward_type` / `tx_hash` | API 有字段，UI 未展示 |
| `GET /sales/total` | OpenAPI 有 Schema 无 path，待后端暴露 |
| 钱包详情弹窗 | 仅展示原生币；Swap 代币余额可补链上 `balanceOf` |

---

## 7. 全站组件审计（文案 / 数据）

> 按 **左 Widget + 右 Content** 拆分；「静态」= i18n 文案或本地配置，非运行时 API/链上。

### 7.1 Genesis

| 组件 / 区域 | 展示内容 | 数据源 | 可接入？ |
|-------------|----------|--------|----------|
| Widget 标题/季介绍 | Season N、折扣 | 链上 `phases` + i18n | 已接 |
| 份额输入、USD1 余额 | 份数、余额 | 本地 state + 链上 ERC20 | 已接 |
| 贡献价值 / AGX 估算 | USD、AGX | 链上 `agxPrice`、折扣 bps | 已接 |
| X 空投预览 | 预估 USD | 链上 `userTotal`（SSOT）+ 本地数学 | 已接 |
| Quota 行 | `$min–$max · N%` | 链上 phase 限额 + `purchasedAmount` 池进度 | 已接 |
| 授权 / 认购按钮 | 状态、错误 | 链上 write | 已接 |
| Promo 卡 | 季卖点摘要 | `buildGenesisPromoSnapshot`（链上） | 已接 |
| Content 四季指标 | 倒计时、参考价、折扣、全球累计 | 链上 phases / agxPrice / totalPurchased | 已接 |
| 累计共建进度条 | 已投 / 上限 | 链上 `userTotal`（SSOT）/ `activePhase.maxAmount` | 已接 |
| 认购记录表 | 时间、金额、折扣、AGX、tx | `GET /sales/logs` | 已接；同步延迟有空表 hint |
| Season 选择器 | 各季状态、日期、quota | 链上 phases（失败时 `data.ts` seasons） | 已接 |
| 等级表、FAQ | 阈值、说明 | `tier-table` + i18n | 静态配置 |

### 7.2 Rewards

| 组件 / 区域 | 展示内容 | 数据源 | 可接入？ |
|-------------|----------|--------|----------|
| 当前头衔卡 | S1–S10 / 提示 | `/performance.presale_rank` + 链上兜底 | 已接 |
| 个人认购进度 | 当前/目标 USD、% | `max(presale_volume, userTotal)` + `tier-table`（等级例外） | 已接 |
| 体系业绩进度 | 团队 USD、% | `/team/overview.sales_team_market`（SSOT） | 已接 |
| 直推奖励余额 | USD | `/referral/total` | 已接 |
| 等级奖励可领 | USD、MARKET/PRESALE 拆分 | `/team-reward/total` | 已接 |
| 领取按钮 + toast | 可领额、`+amount` | 链上 claim + `confirm.order.amount` | 已接 |
| 未连接占位 | 进度数字 | `REWARDS_PROGRESS_PLACEHOLDERS` | 静态（预期） |
| Hero 区 | 等级标题、正文 | rank hooks + i18n | 已接 |
| 等级表 | 行高亮 | rank + 静态表 | 已接 |
| 推荐奖励历史 | 时间、金额、来源、状态 | `/rewards/logs` 部分字段 | 已接；`reward_type`/`tx_hash` 未展示 |
| 等级奖励历史 | 时间、金额、来源、贡献、比例、状态 | `/team-reward/logs` + 静态 bonusRate | 已接；比例非 API |
| FAQ | 问答 | i18n | 静态 |

### 7.3 Community

| 组件 / 区域 | 展示内容 | 数据源 | 可接入？ |
|-------------|----------|--------|----------|
| 推荐链接 | URL | 钱包 `account.address` | 已接 |
| 绑定推荐人 | 输入、状态 | 链上 `referral` read/write | 已接 |
| QuickLinks | 文档/Twitter/Telegram | `href: '#…'` | ❌ 待真实 URL |
| 邀请流程步骤 | 1–4 步说明 | i18n + tab 跳转 | 静态（预期） |
| 统计卡·直推 | 人数、直推业绩、`today` | `/team/overview` + i18n `statDirectToday` | 已接；`today` 为静态占位 |
| 统计卡·团队 | 人数、团队业绩、`today` | `/team/overview` + i18n `statTeamToday` | 已接；`today` 为静态占位 |
| 统计卡·创世股东 | 等级、副文案、`today` | `/performance` rank + i18n | 已接；`today` 为产品说明文案 |
| 我的邀请表 | 地址、时间、等级、直推数、业绩 | `/team/referrals` | 已接 |
| FAQ | 问答 | i18n | 静态 |

### 7.4 Swap

| 组件 / 区域 | 展示内容 | 数据源 | 可接入？ |
|-------------|----------|--------|----------|
| 卖/买代币、余额 | 金额、余额 | 链上 ERC20 `balanceOf` | 已接 |
| 汇率 / 报价 | rate、买入量 | Router `getAmountsOut`、Pair reserves | 已接 |
| 滑点 | % | 本地 state | 静态配置 |
| 授权 / Swap | 交易 | 链上 write | 已接 |
| 代币介绍轮播 | 文案 | i18n | 静态 |
| FAQ | 问答 | i18n | 静态 |
| Genesis Promo 卡 | 跳转 Genesis | 共享 genesis context | 已接 |

### 7.5 全局 Shell

| 组件 | 展示内容 | 数据源 |
|------|----------|--------|
| DApp Rail Swap tooltip | 现货率 + 结算说明 | `usePairSpotRate`（链上 Pair） |
| 钱包 Chip / 弹窗 | 地址、BNB 余额 | thirdweb；代币余额部分未接 |
| SIWE 登录 | JWT | `POST /auth/login` |
| Nav tab 文案 | Genesis / Rewards / … | i18n |

---

## 8. 变更记录

### 2026-06-18 — 全站数据源审计与接入

| 变更 | 文件 | 说明 |
|------|------|------|
| 团队业绩单源 `/team/overview` | `rewards-tab.tsx` | `teamVolumeUsd` 仅读 `useTeamOverview` |
| Genesis 个人预售单源链上 | `use-genesis-widget.ts`、`genesis-tab.tsx` | 空投 `periodContributedUsd`、累计共建 `contributedUsd` 仅 `userTotalAmount` |
| Community `today` 静态占位保留 | `community-content.tsx` | 直推/团队卡展示 `statDirectToday` / `statTeamToday`（非 API） |

---

## 9. 相关代码入口

| 模块 | 路径 |
|------|------|
| API endpoints | `src/lib/api/endpoints.ts` |
| API types | `src/lib/api/types.ts` |
| React Query hooks | `src/hooks/use-api-data.ts` |
| 链上 presale 读 | `src/web3/presale-read.ts` |
| 链上 referral 读 | `src/web3/referral-read.ts` |
| 链上 swap 读 | `src/web3/swap-read.ts` |
| 等级 / 空投数学 | `src/lib/presale/rank.ts`、`src/lib/presale/presale-math.ts`、`src/lib/presale/tier-progress.ts` |
| Query invalidate | `src/lib/query/invalidate.ts` |
