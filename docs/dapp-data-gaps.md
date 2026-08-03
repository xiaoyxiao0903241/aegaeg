# DApp 展示数据缺口与精度 SSOT

> **范围：** 只登记用户可见数字位的 **链上 / 后端 API** 接线。不记 UI chrome。  
> **组织：** 侧栏菜单序（`tabOrder`）→ 子页 → 数据位。  
> **列含义：** `是否已接` = 现码是否读到可用数据；无可用源时写 **否**，源列写 **无数据源**。  
> 细则见 [`agents/ui-leaf-parity-workflow.md`](./agents/ui-leaf-parity-workflow.md) §2.1b。

## 精度约定

| 类型            | 展示                  |
| --------------- | --------------------- |
| 法币 / 单价 `$` | 固定 2 位             |
| `≈ $` 估值      | 固定 2 位；≥1k 可 K/M |
| AGX 量          | 2 位；≥1k → K/M       |
| 收益率 `%`      | 2 位（`0.00%`）       |
| 地址数 / 页码   | 整数                  |

## AGX 价格两源（勿混）

| 源           | 读法                                  | 用途                   |
| ------------ | ------------------------------------- | ---------------------- |
| 市场参考价   | Pair `getReserves` → `useAgxPriceUsd` | Hub / TVL / 资产估值等 |
| PreSale 定价 | `PreSale.agxPrice`                    | 创世 / 预售            |

---

## 1. 兑换（Exchange）

> 兑换专用 API 仅：`/agx-contribution/{burn-logs,consume-logs,summary}` · `/turbine/{logs,summary}`。无 flash/trade quote 或流水 path；报价走链上。

### 1.1 Hub（`#exchange`）

| 数据位               | 是否已接 | 源                                               |
| -------------------- | -------- | ------------------------------------------------ |
| 贡献点数获取比率正文 | 是       | 链上 `AgxContributionSwap.getConfig` → `rateBps` |

### 1.2 闪兑（`#exchange/flash`）

| 数据位         | 是否已接 | 源                                       |
| -------------- | -------- | ---------------------------------------- |
| Sell/Buy 余额  | 是       | 链上 ERC20 `balanceOf`                   |
| gAGX↔AGX 出量  | 是       | 协议 1:1 wrap/redeem                     |
| USDT→USD1 报价 | 是       | 链上 `Usd1Swap.quoteUsd1Out` / `rateBps` |
| 概览兑换价格   | 是       | 同上                                     |

### 1.3 交易（`#exchange/trade`）

| 数据位                   | 是否已接 | 源                                 |
| ------------------------ | -------- | ---------------------------------- |
| Sell/Buy 余额            | 是       | 链上 ERC20 `balanceOf`             |
| 报价                     | 是       | Pancake Router `getAmountsOut`     |
| AGX 卖税 / 税后净额      | 是       | 链上卖税视图 + 手册净额公式        |
| 兑换价格 / 路径 / 提供方 | 是       | spot + pair + Pancake              |
| 允许滑点                 | 是       | 用户设定（默认 `EXCHANGE_CONFIG`） |

### 1.4 销毁（`#exchange/burn`）

| 数据位             | 是否已接 | 源                                                                    |
| ------------------ | -------- | --------------------------------------------------------------------- |
| AGX 余额           | 是       | 链上 ERC20 `balanceOf`                                                |
| 获得贡献点数       | 是       | 链上 `quoteContributionOut`                                           |
| 销毁比率           | 是       | 链上 `getConfig` → `rateBps`                                          |
| 概览：累计销毁 AGX | 是       | 链上：已连接 `userAgxBurned`，否则 `getConfig.totalBurned`            |
| 概览：累计获得贡献 | 是       | 链上：已连接 `contributionEarned`，否则 `getConfig.totalContribution` |
| 概览：累计消耗贡献 | 是       | 链上 `contributionConsumed`（未连接 → `0`）                           |
| 销毁记录表         | 是       | `POST /agx-contribution/burn-logs`（后端索引空，现返回空列表）        |
| 消耗记录表         | 是       | `POST /agx-contribution/consume-logs`                                 |

### 1.5 涡轮（`#exchange/turbine`）

| 数据位                 | 是否已接 | 源                                            |
| ---------------------- | -------- | --------------------------------------------- |
| 可解锁配额             | 是       | 链上 `turbineBalances`                        |
| 等额买入 USD1 金额     | 是       | 链上 `quoteUsdInForAgxOut`                    |
| 买入 AGX 量            | 是       | = 解锁量（数量 1:1）                          |
| AGX 价格               | 是       | 链上 `quoteUsdInForAgxOut(1 AGX)`             |
| 允许滑点               | 是       | 链上 `swapSlippageBP`                         |
| 冷却周期               | 是       | 链上 `currentCooldownDuration`                |
| 冷却列表 / 到期门闸    | 是       | 链上 `silences` + `isVested`                  |
| 概览：待解锁 / 冷却中  | 是       | 链上配额 + silence × 单价                     |
| 概览：累计已提取       | 是       | API `POST /turbine/summary` → `claimed_total` |
| 概览：累计已提取 `≈ $` | 否       | 无数据源                                      |
| 涡轮记录表             | 是       | API `POST /turbine/logs`                      |

---

## 2. 资产（Assets）

### 2.1 Hub（`#assets`）

| 数据位               | 是否已接 | 源                                                                                                      |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| 总资产价值           | 是       | API `reward-summary.stake_invest_usd_value`（链兜底无 USD 汇总 → `$0.00`）                              |
| 可领 / 已领 / 贡献点 | 是       | API `reward-summary`（链兜底：可领有数；已领无源 → `0`）                                                |
| 持仓本金 / 已释放    | 是       | API `holdings-summary` · 链仓位合计                                                                     |
| 缓冲池 AGX           | 是       | API `holdings-summary` buffer 字段 · 链 PRV                                                             |
| 缓冲池 gAGX          | 否       | 无数据源（手册 PRV 仅 AGX；UI 恒 `0`）                                                                  |
| 持仓分布（有数态）   | 是       | API `holdings-distribution`（无仓 → 空态 UI）                                                           |
| mode 仓位            | 是       | API `holdings-distribution`（`stake_total_agx` / `bond_lp` / `bond_burn` / `stake_x_pool`）· 链仓位合计 |
| mode 总收益          | 否       | API 无分 mode 收益字段；现码 API 路径恒 `0`；仅链兜底路径有数                                           |
| mode APR %           | 否       | 无数据源（稿空态展示 `0.00%`，非协议读）                                                                |

> **隐藏0资产：** UI 筛选，派生自 mode `hasBalance`（API=仓位>0；链兜底=仓位或收益>0）。不单列数据位。

### 2.2 仓位 · 质押 / LP / 销毁（`#assets/stake|lpbond|burnbond`）

| 数据位                                | 是否已接 | 源                                                                                           |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| 左栏仓位卡：本金 / 已释 chip          | 是       | 链 `readStakePositions` / `readLpBondPositions` / `readBurnBondPositions`                    |
| 左栏仓位卡：收益 / 加成               | 部分     | 质押：`blockReward` + `extraInterest`；LP/Burn：`profit` 已接，**加成无协议字段** → 占位 `0` |
| 左栏仓位卡：AGX↔USD 展示              | 是       | 本地 Quote + `useAgxPriceUsd`（Pair spot）                                                   |
| 左栏仓位卡：凭证地址                  | 是       | 池合约地址 → BSCScan                                                                         |
| 写：领取 Mixed                        | 是       | 手册 §9：贡献 + plans + `claim*Mixed`（`submitMixedClaim` · dual-check）                     |
| 写：赎回 / 领本金                     | 是       | live 可赎额 → `claimPrincipal` / `redeem`；确认弹窗手册 §13 30 天缓冲文案                    |
| 右栏统计：持仓 / 已释放 / 待释放      | 是       | 上列仓位聚合                                                                                 |
| 右栏统计：Rebase 收益 / 加成 / 总收益 | 部分     | 质押六格全接；LP/Burn「总收益」**无累计 API/链汇总** → UI 诚实 `—`                           |
| 操作记录表                            | 是       | API `stake-flow/positions` · `bond-flow/lp-purchases` · `burn-purchases`                     |

### 2.3 仓位 · X 挖矿（`#assets/xmine`）

| 数据位                            | 是否已接 | 源                                                                           |
| --------------------------------- | -------- | ---------------------------------------------------------------------------- |
| 左栏仓位：质押 / warmup / 产出    | 是       | 链 `readXminePosition`（`miningStake` / `warmupGons` / `pendingReward`）     |
| 左栏仓位：产出 `≈ $`（USD Quote） | 否       | X 无独立 USD 价源 · UI 诚实 `≈ —`                                            |
| 写：领 X / 激活 warmup / 解押     | 是       | `claimReward` / `activateWarmup` / `startUnstake`（money-path Assets xmine） |
| 右栏：挖矿质押 / 已释放启发式     | 部分     | 质押接链；已释放=warmup 外全额、warmup 内 `0`（无 PRV 已释 view）            |
| 右栏：挖矿产出                    | 是       | `pendingReward`                                                              |
| 右栏：累计产出                    | 否       | 无协议累计 X view / 历史 API · UI 诚实 `0.00 X`                              |
| 挖矿记录表                        | 是       | API `POST /x0-mining/logs`                                                   |

---

## 3. 质押（Staking）

### 3.1 Hub

| 数据位                  | 是否已接 | 源                                                                                                                       |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 质押总量 TVL            | 是       | 链上 `StakingPool.poolAgxBalance` × spot                                                                                 |
| 总市值                  | 是       | 流通 × spot                                                                                                              |
| AGX 流通量              | 是       | 链上 `sAGX.circulatingSupply`                                                                                            |
| 智库储备                | 是       | 链上 `Treasury.totalReserves`（AGX-value）· 副值 × spot                                                                  |
| AGX 价格                | 是       | Pair spot                                                                                                                |
| 总销毁量                | 是       | 链上 `getConfig.totalBurned`                                                                                             |
| Rebase 收益率           | 部分     | 链上 `epoch` + `sAGX.rebases`；**现网** `index` 仍为初始 1e9、`rebases(n)` 越界 revert → 诚实 `null`/`0.00%`（非未接线） |
| 可运行周期              | 否       | 无数据源 · UI `—`（`runwayUnknown`）                                                                                     |
| 质押地址数              | 是       | API `POST /performance/stake-address-count`（需 session）                                                                |
| 周期表 基础日收益       | 部分     | `2 ×` 链上 epoch rebase%（stake 段）；种子 null 时诚实 `0.00%`                                                           |
| 周期表 收益率加成       | 是       | 手册 `LOCKED_*_BONUS_BPS`（活期 0）                                                                                      |
| 周期表 周期收益率       | 部分     | 本地：基础日收益复利至 tenure；依赖 rebase 种子                                                                          |
| 周期表 LP/销毁 段收益列 | 否       | 无数据源                                                                                                                 |
| 图 TVL/市值历史         | 否       | 无数据源                                                                                                                 |

### 3.2 Stake 子页

| 数据位                                    | 是否已接 | 源                                                                                            |
| ----------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| 左栏 meta：基础日收益                     | 部分     | `2 ×` 链上 epoch rebase%（种子空 → 诚实 0）                                                   |
| 左栏 meta：周期收益                       | 部分     | 本地：基础日复利 × tenure（依赖 rebase 种子）                                                 |
| 左栏 meta：加成                           | 是       | 手册 `LOCKED_*_BONUS_BPS`（周期档位展示，非仓位应计）                                         |
| 左栏锁定 / 合约                           | 是       | 周期派生 + 池地址                                                                             |
| 左栏余额 / CTA                            | 是       | 链上 preflight 余额 + `liquidStake` / `lockedStake`                                           |
| 概览：pool TVL / Epoch / rebase% / 倒计时 | 部分     | 链上 `readStakingHubOverview`；rebase% 经数组下标探测，空仓诚实 null                          |
| 仓位：持仓 / 已释放 / 待释放              | 是       | 链上 `readStakePositions`（含活期 `warmupStakes` + `stakes`；与资产仓位同源）                 |
| 仓位：当前 Rebase 收益                    | 是       | 链上 `blockReward` 合计（**禁**用 `reward-summary.claimable_gagx`：其为 DAO+释放池+涡轮混桶） |
| 仓位：当前 Rebase 加成                    | 是       | 链上 `extraInterest` 合计                                                                     |
| 仓位记录表                                | 是       | API `POST /stake-flow/positions`（空态无表头/脚跟原型）                                       |
| 记录表脚「累计质押 / 共 N 条」            | 部分     | 有行时才有脚；空态仅 empty message                                                            |
| TVL 历史图（序列）                        | 否       | 无数据源 · 空图 copy                                                                          |
| TVL 图头 `$0.00` / `+0.0%`                | 否       | 无历史序列；头值占位与 Hub 同形，**非**协议读                                                 |

### 3.3 LP 债券 / 销毁债券

| 数据位                                        | 是否已接 | 源                                                                                                      |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| 左栏余额 / CTA                                | 是       | USD1 preflight + `BondHelper` zap（money-path BondZap）                                                 |
| 周期卡：当前折扣                              | 是       | 链上 `discountRateBP`                                                                                   |
| 周期卡：折扣价 `$`                            | 是       | spot × 折扣%                                                                                            |
| 周期卡：折扣区间                              | 是       | FAQ 不变量（`BOND_DISCOUNT_RANGES`）                                                                    |
| 周期卡：已售 `$` / 周期收益率                 | 否       | 无数据源 · UI 诚实 `$0.00` / `0.00%`                                                                    |
| meta：滑点 / 支付 / 获得 / 上限 / 释放 / 合约 | 是       | quote + market + 地址                                                                                   |
| 写：购买                                      | 是       | `BondHelper.zapIntoLiquidityBond` / `zapIntoBurnBond`                                                   |
| 概览：债券 TVL / 溢价率                       | 否       | 无数据源 · UI 诚实 `0`                                                                                  |
| 概览：rebase 倒计时 / %                       | 部分     | 与 Stake 同源 `readStakingHubOverview`；% 种子可空                                                      |
| 仓位：持仓 / 已释放 / 待释放                  | 是       | 链上 `readLpBondPositions` / `readBurnBondPositions`（与资产同源：`payoutRemaining` / `pendingPayout`） |
| 仓位：当前 Rebase 收益                        | 是       | 链上 `getStakeProfit` 合计（**禁** `claimable_gagx` 混桶）                                              |
| 购买记录表                                    | 是       | API `bond-flow/lp-purchases` · `burn-purchases`                                                         |
| TVL 历史图 / 图头占位                         | 否       | 无历史序列 · 空图；头值占位同 Stake                                                                     |

### 3.4 X 挖矿

| 数据位                                   | 是否已接 | 源                                                                                              |
| ---------------------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| 左栏：钱包 gAGX / 质押额度 / CTA         | 是       | 链 `RewardGAGX.balanceOf` + `miningQuotaOf` + `stakeGagxForMining`（money-path Xmine）          |
| meta：最大质押 / 锁定 24h / 合约         | 是       | quota + FAQ 不变量 + 池地址                                                                     |
| meta：收益率(日)                         | 是       | 链 `yieldRateBP`（`%/日 = BP/100`）                                                             |
| 概览：X挖矿总质押量                      | 是       | 链 `activeGons`（按 gAGX 9dec 展示；与本金同刻度）                                              |
| 概览：累计产出                           | 否       | 无协议累计 X view / 历史 API · UI 诚实 `0`                                                      |
| 概览：X 价                               | 是       | 链 `xPerAgx`（1e18 标度 X-per-AGX → 展示 AGX/X + AGX USD 副值）                                 |
| 概览：当日收益率                         | 是       | 同 `yieldRateBP`                                                                                |
| 概览：下一次挖矿产出（倒计时）           | 否       | 仅有 `lastRewardTime`；无下次结算时刻 / 固定周期 view · UI 诚实 `—`                             |
| X 长期价值系统（210M / 47.62% / 52.38%） | 是       | FAQ 不变量文案（静态）；H5 `%`/标题上下排（稿横排放不下·产品纠偏）                              |
| 仓位：我的挖矿质押                       | 是       | 链 `miningStakeAmountOf`（`readXminePosition`）；API `total_stake_amount` / `stake_x_pool` 兜底 |
| 仓位：已释放                             | 否       | 本页无 PRV 已释字段 · UI 诚实 `0`（资产页 warmup 启发式另表，语义分叉）                         |
| 仓位：挖矿产出（pending X）              | 是       | 链 `pendingReward` + 副值 `pendingRewardValue`→USD                                              |
| 挖矿记录表                               | 是       | API `POST /x0-mining/logs`（**禁**用 positions 冒充流水）                                       |
| TVL 历史图 / 图头占位                    | 否       | 无历史序列 · 空图；头值占位                                                                     |

### 3.5 收益计算器

| 数据位                             | 是否已接 | 源                                                                                      |
| ---------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| 左栏输入 → 右栏结果                | 是       | 本地：`2×rebase` 日复利 + 手册 `LOCKED_*_BONUS_BPS`（10/15/20%）；spot 种子；**无写链** |
| 收益曲线 day 1..720                | 是       | 同上本地公式（`CALC_MAX_DAYS`）                                                         |
| 日收益种子                         | 部分     | 链 hub overview `rebaseRate1e18`；现网 rebases 空/越界 → 诚实 `0.00%`（见 §3.1）        |
| notes 加成% 文案                   | 是       | **跟手册** 10/15/20（**禁**跟稿演示 15/25/35）                                          |
| notes「本金线性释放 / 收益扣 1/6」 | 文案在   | **未进** `calcLocalInterest` · 产品叙事 DEFER（gaps）；结果公式不含这两项               |
| Xmine 产品收益                     | 否       | 无协议 APR view · `calcLocalInterest` → interest `0`                                    |

---

## 4. 奖励（Rewards）

### 4.1 Hub（`#rewards` · PC `4291:212`）

> **读源裁决（2026-08-03）：** 手册 `01` §9.5 / LuckyPool + OpenAPI `~/Downloads/新/api-docs.html`。Hub **只读 + 导航**；写在子页。

| 数据位                      | 是否已接  | 源                                                                                        |
| --------------------------- | --------- | ----------------------------------------------------------------------------------------- |
| 右栏 · 总奖励（gAGX）       | 已接      | `POST /performance/making-overview` → `total_reward`                                      |
| 右栏 · 总奖励 ≈$            | 已接      | gAGX × Pair spot（`useAgxPriceUsd`）                                                      |
| 右栏 · 共建级别             | 已接      | `making_rank` → `A{n}`；≤0 空文案                                                         |
| 右栏 · 个人持仓 $ / AGX     | 已接      | `personal_position`（AGX）× spot / 原文                                                   |
| 右栏 · 总业绩 $ / AGX       | 已接      | `making_market`                                                                           |
| 右栏 · 小区业绩 $ / AGX     | 已接      | `small_market`                                                                            |
| 右栏 · 贡献点数             | 已接      | API `agx-contribution/summary` 或链 `userContribution`                                    |
| 左卡 · 创世可领 $           | 已接      | `POST /team-reward/total`（total−claimed）                                                |
| 左卡 · 发展津贴可领         | 已接      | `POST /market-allowance/summary` → `unlocked_claimable`（OpenAPI：AGX；稿面 gAGX chrome） |
| 左卡 · 幸运可领             | 已接      | 链 `readLuckyClaimSnapshot`（**非** `lucky-reward/summary` 池 USD）                       |
| 左卡 · 推荐 / 参与 / 共建   | 诚实空    | 见下「三签可领」；**禁**用二期 `*/summary` 累计冒充                                       |
| 创世卡 ·「即将关闭」badge   | 静态 i18n | 手册与 OpenAPI **均无**关闭时间 / flag → 保持稿面文案                                     |
| 机制表 A1–A13 / About / FAQ | N/A       | 静态 i18n（About chrome：Figma `4297:213` lavender wash + 人物）                          |

**三签可领（推荐 / 参与 / 共建）— 读源对照**

| path / 源                                                          | 语义                                                       | Hub「可领取/余额」                                                                                 |
| ------------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /referral-award/summary` → `total_referral_reward`           | 累计 awarded_gross（gAGX）                                 | **禁**冒充可领                                                                                     |
| `POST /participation-award/summary` → `total_participation_reward` | 同上                                                       | **禁**                                                                                             |
| `POST /rank-reward/summary` → `total_rank_reward`                  | 同上（RANK+SURPASS）                                       | **禁**                                                                                             |
| `POST /claim/dao-reward`                                           | 取签时才返回 `amount`（ledger READY→ISSUED；有写副作用）   | **不**作 Hub 预览读                                                                                |
| `POST /referral/total`（一期 `sq_referral_totals`）                | OpenAPI：与二期 summary **不同**，属可领汇总 total/claimed | **可选**推荐卡预览；现码仅创世详情 `useReferralTotal`，**Hub 未接**（单位/与稿 gAGX 未钉前保持空） |
| `POST /community-fund/total` → `unlocked_claimable`                | 预售 **USDT** 发展基金                                     | **勿**塞推荐卡（≠ 推荐奖 gAGX）                                                                    |
| 手册 §9.5 IncentivePool / DaoPool / CommunityFund                  | 签名领取；合约无「当前可领余额」视图 getter                | Hub 三签可领预览诚实空。写链归属子页（见 §4.3 / R4a）                                              |

**缺口 / 张力**

| 项                                    | 说明                                                                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 发展津贴单位                          | OpenAPI `unlocked_claimable` 标 AGX；稿卡 `0.0000gAGX`。Hub 按稿 chrome 展示；若后端实为 AGX human 与 gAGX 1:1 则显示同数，否则子页再核                                                                                   |
| 推荐奖写链                            | **现行（R4a · `4f03b8ab`）：** 子页 `CommunityFund` 简单签 `/claim/community-fund`；可领预览用 `community-fund/total.unlocked_claimable`（USDT）。二期 OpenAPI 推荐走 `claim/dao-reward`（signType 42）≠ 现码；Hub 只导航 |
| 参与奖写链                            | **现行（R4a）：** 子页 `IncentivePool` 简单签 `/claim/incentive`；可领门闸用发放记录 `READY`/`PARTIALLY_CLAIMED`（summary 无 unlocked）。OpenAPI 已删 `/claim/incentive` → 签名阶段 fail-closed 记债                      |
| 共建奖写链                            | 仍 Dao Mixed `claim/dao-reward`（RANK/SURPASS · signType 41/44）+ 贡献点 1:1                                                                                                                                              |
| 推荐卡可领预览                        | 一期 `/referral/total` 理论上可接；接前须钉单位与稿面币种；未钉前诚实空                                                                                                                                                   |
| 参与 / 共建可领预览                   | OpenAPI **无** total−claimed / unlocked 读口；保持诚实空                                                                                                                                                                  |
| 「即将关闭」                          | 无动态源；静态 badge；若产品要按活动开关须另补 API/手册                                                                                                                                                                   |
| lucky-reward/summary                  | 仅池统计 / 是否中奖 / 次数；**不可**作 Hub 可领额                                                                                                                                                                         |
| market-allowance.unlockable_allowance | 「可解锁未领」；Hub 稿面仅「可领取」→ 不接                                                                                                                                                                                |

### 4.2 幸运奖详情（`#rewards/lucky` · PC `4390:220`）

> **读源裁决（2026-08-03 · Pre-Design A1/A2）：** 手册 `01` §14.1 + contracts LuckyPool/Tracker；OpenAPI `POST /lucky-reward/{summary,winners,my-rounds}`；写 = `claimRewardMixed`（money-path Rewards Mixed Lucky）。证据见 `.scratch/dapp-7rail-parity/research/215-lucky-a1a2.md`。G 册 `14-lucky-pool.md` 原「无锁帧 DEFER」对本页升格 MUST（索引可后补）。

| 数据位             | 是否已接 | 源                                                                                           |
| ------------------ | -------- | -------------------------------------------------------------------------------------------- |
| 今日奖池           | 已接     | `POST /lucky-reward/summary` → `today_total_prize`（USD 整池）                               |
| 累计中奖           | 已接     | 同 → `win_count`                                                                             |
| 开奖表             | 已接     | `POST /lucky-reward/winners`（date←近 5 UTC 日 `SelectMenu`；空结果隐藏表顶 controls）       |
| 抽奖记录           | 已接     | `POST /lucky-reward/my-rounds`                                                               |
| 可领额（左 Mixed） | 已接     | 链 `readLuckyClaimSnapshot`（**非** summary 池 USD）                                         |
| 贡献点数（左）     | 已接     | `readContributionSnapshot` / required；burn 深链                                             |
| 今日抽奖资格       | 已接     | 链 `LuckyPool.isUserEligible(currentRoundId, user)`（迁移感知；优于 mapping `isEligible`）   |
| 倒计时             | 已接     | 链 `getRound(currentRoundId).endTime` → HH:MM:SS；未连接 / 读失败 → 文案内 `—`               |
| 资格辅助额         | 部分     | Tracker `getUserRoundStat.totalAmount`（**累计** USD1）；稿文案「最大单笔」无链上 max-single |
| 验证教程 URL       | 无源     | 按钮 disabled                                                                                |

**缺口 / 张力**

| 项                             | 说明                                                                        |
| ------------------------------ | --------------------------------------------------------------------------- |
| 稿「最大单笔」vs `totalAmount` | 链仅累计购买额；UI 文案改为「今日累计购买」展示 Tracker 值；无单笔 max 读源 |
| FAQ 活期资格                   | 已按手册改为「活期可获资格（单笔达标）」；旧「不能」文案废弃                |
| API `reward_amount` 标 gAGX    | 展示可跟 API；写链金额以链 AGX snapshot 为准                                |
| `participation_amount`         | 日业绩 USDT 快照 ≠ 单笔达标门槛；勿当资格证明                               |
| summary 不可作可领             | 与 §4.1 同；子页可领仅链 snapshot                                           |

### 4.3 推荐 / 参与 / 共建详情（`#rewards/{referral,participate,cobuild}`）

> 2026-08-03 · §8.2a 复用贴齐。**写链（2026-08-04 · R4a 收口 `4f03b8ab`）：** 推荐=`CommunityFund` 简单签；参与=`IncentivePool` 简单签 + logs READY 门闸；共建=Dao Mixed `claim/dao-reward`。右栏 API summary/logs。

| 数据位                                         | 是否已接 | 源                                                                                                                        |
| ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| 总奖励 / 仓位 / 贡献 / 直推数等                | 已接     | 各 `*/summary`                                                                                                            |
| 记录表 / 直推·邀请人表                         | 已接     | 各 logs / directs / inviter                                                                                               |
| 推荐 · 左栏可领 $                              | 已接     | `POST /community-fund/total` → `unlocked_claimable`（USDT）；CTA 门闸 amount>0                                            |
| 参与 · 左栏可领                                | 部分     | summary **无** unlocked；CTA 以 logs `READY`/`PARTIALLY_CLAIMED` 为可领信号；有 READY 时展示 `awarded_gross` 合计         |
| 共建 · 左栏 Mixed                              | 已接     | `claim/dao-reward` + 贡献点 live                                                                                          |
| 下一次奖励发放（倒计时）                       | 诚实空   | OpenAPI summary **无** next payout / settle 时刻；稿演示 HH:MM:SS → UI `—`                                                |
| 总奖励 ≈$                                      | 诚实空   | summary 无 USD 字段；Hub 有 spot 换算，子页未接（避免与累计口径混淆）                                                     |
| 共建 · 下一级别 / 比例徽章 / 目标门槛 / 已达成 | 派生     | 下一级：`making_rank≤0`→A1，否则机制表下一档；门槛/进度% 来自 hub `tierTable` + summary 持仓/账户/业绩（无独立 next API） |

### 4.4 发展津贴详情（`#rewards/grant` · PC `4410:220`）

| 数据位                  | 是否已接 | 源                                                                                                         |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| 档位 / 累计已领         | 已接     | `market-allowance/summary`                                                                                 |
| 发放 / 领取记录         | 已接     | paid / claim logs                                                                                          |
| 左栏待审批额 / 可领额   | 已接     | 待审批=`unlockable_allowance`；可领+CTA=`unlocked_claimable`（OpenAPI AGX；稿 chrome gAGX，与 Hub 同口径） |
| 稿「可领取·进入释放池」 | 张力     | 手册 MarketFund = 签领至钱包；卡头 chrome 跟稿「进入释放池」，CTA 跟钱路「至钱包」                         |

### 4.5 创世奖详情（`#rewards/genesis` · PC `4413:220`）

| 数据位                    | 是否已接 | 源                                                                      |
| ------------------------- | -------- | ----------------------------------------------------------------------- |
| 等级 hero / 档位表 / 历史 | 已接     | rank / team / referral / community API                                  |
| 左栏团队 / 社区基金领取   | 已接     | `useTeamRewardClaim` · `useCommunityFundClaim`（R4a 旧接线）            |
| Hero 人物                 | 已换     | 2026-08-03 自稿 `4719:2483` 重导 `rewards-character.webp`（去镜像翻转） |

## 5. 释放（Release）

### 5.1 Hub（`#release`）

| 数据位             | 是否已接 | 源                                                                                                           |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------ |
| 释放池 %           | 是       | 链 `readReleaseQueueSnapshot` claimable/(claimable+releasing)                                                |
| 释放池「释放中」   | 是       | `sessionReady` → API `POST /release-pool/summary.releasing_amount`；否则链 `totalReleasing`（展示单位 gAGX） |
| 释放池「已释放」   | 是       | API `released_amount` \|\| 链 `totalClaimable`                                                               |
| 释放池 ≈$ ×2       | 是       | `formatApproxUsd` × `useAgxPriceUsd`（空态 `≈ $0.00`）                                                       |
| 缓冲池 %           | 是       | 链 PRV claimable/(claimable+releasing)                                                                       |
| 缓冲池 AGX 总额    | 是       | API `POST /buffer-pool/summary.cumulative_amount` \|\| 链 claimable+releasing                                |
| 缓冲池 gAGX 总额   | 否       | **无数据源**（PRV 仅 AGX）→ UI 空态 `0.0000 gAGX`（禁 —）                                                    |
| 缓冲池 ≈$（AGX）   | 是       | `formatApproxUsd` × spot                                                                                     |
| 缓冲池 ≈$（gAGX）  | 是       | 空态 `≈ $0.00`（无量）                                                                                       |
| 缓冲「已释放」AGX  | 是       | API `released_amount` \|\| 链 `totalClaimable`                                                               |
| 缓冲「已释放」gAGX | 否       | **无数据源** → `0.0000 gAGX`                                                                                 |
| About / 机制 / FAQ | 是       | i18n 静态（机制税率叙事档；写路径在子页跟链 `queuePlans`）                                                   |
| 写链               | N/A      | Hub 仅导航 `openReleaseView`                                                                                 |

### 5.2 释放池（`#release/queue`）

| 稿面位               | 有源？ | 真源 / 空态                                                                                      |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| Plan×4 天数 pill     | 是     | UI 行现绑 `RELEASE_DURATION_DAYS`；链 `queuePlans` duration 匹配 index（§12.5；演示档≠链时跟链） |
| Plan 已释放 / 释放中 | 是     | 链 `getReleasedRewardsWithPlanIndex` / total−claimable（snapshot）                               |
| Plan 进度 % / ≈$     | 是     | `formatReleasePct`；`formatApproxUsd(claimable, useAgxPriceUsd)`（空 `≈ $0.00`）                 |
| Plan 领取 CTA        | 是     | **live** `claimAllVestedRewards` / `submitReleaseQueueClaim` + `turbineRoot` invalidate          |
| Plan 右上刷新        | UI     | 产品替稿（原 radio）→ `RefreshCw`；单档链读 + patch 缓存；loading 图标旋转                       |
| 右栏释放中 / 已释放  | 是     | API summary \|\| 链 totals（单位 gAGX）                                                          |
| 累计从释放池领取     | 部分   | API `total_claimed_amount`；无会话/无字段 → **`0.0000 gAGX`**（无 lifetime 链 view）             |
| 右栏 ≈$ ×3           | 是     | `formatApproxUsd` × spot（空 `≈ $0.00`）                                                         |
| 记录表               | 是     | `POST /release-pool/logs`（需登录）；空 → empty message                                          |
| FAQ                  | 是     | i18n 静态                                                                                        |

### 5.3 缓冲池（`#release/buffer`）

> 待补表（#26）。

## 6. 社区（Community）

> 待补表。

## 7. 创世（Genesis）

> 待补表。

---

## 变更记录

| 日期       | 变更                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-04 | 释放池 §5.2：plan 链读+claimAll 写 live；累计领取 API/无源→0；≈$ 接价；右上产品改单档刷新（替稿 radio）                      |
| 2026-08-04 | 奖励 §4.1/§4.3：纠偏 R4a 写链（推荐 CommunityFund / 参与 IncentivePool / 共建 Dao Mixed）；参与 READY 门闸记缺口             |
| 2026-08-03 | 奖励详情 #19–23：§4.3–4.5 记 nextPayout/共建下一档/Grant 待审批/稿释放池张力；创世人物重导                                   |
| 2026-08-03 | 幸运奖详情 §4.2：资格/倒计时接链；累计购买≠稿「最大单笔」记缺口；FAQ 活期跟手册；Hub §4.1 保留                               |
| 2026-08-03 | 幸运奖详情 §4.2：A1/A2 接线表（奖池/表已接；资格假零；倒计时链 endTime；FAQ 活期 vs 手册张力）；Hub §4.1 保留                |
| 2026-08-03 | 奖励 Hub §4.1：补三签/即将关闭/一期 referral/total 读源裁决；右栏+幸运/津贴/创世已接；参与共建仍无 Hub 可领预览              |
| 2026-08-03 | 奖励 Hub §4.1：接 making-overview / grant unlocked / lucky 链可领；三签卡诚实空；禁累计 summary 冒充可领                     |
| 2026-08-03 | 资产仓位：补 §2.2/§2.3（质押/债券/Xmine 读写下与剩余缺口）；Mixed/赎回/Quote 已接；LP·Burn 总收益与 X 累计/USD 仍无源        |
| 2026-08-03 | 资产仓位 LP/Burn「总收益」无累计 API/链汇总 → UI 诚实 `—`（禁硬编码 0.00）                                                   |
| 2026-08-03 | 写后刷新：`invalidateAfterStaking`→staking+assets+lucky+indexer poll；活期读 `warmupStakes`                                  |
| 2026-08-03 | rebase：按 `rebases[]` append 下标探测（禁用 epoch.number）；gaps 依赖位改「部分」；poll 收窄                                |
| 2026-08-03 | Calc：gaps §3.5 澄清手册加成 10/15/20、notes 线性释放/1/6 DEFER、Xmine 诚实 0；#16 Pre-Design 重启                           |
| 2026-08-03 | Xmine：接 `yieldRateBP`/`xPerAgx`/`activeGons`（meta 日收益 + 概览 TVL/X 价/日收益）；累计产出与下次倒计时仍无源             |
| 2026-08-03 | Xmine：pending 副值接 `pendingRewardValue`；gaps 澄清 xPerAgx/yieldRateBP 未接；H5 价值卡双栏+%上下排                        |
| 2026-08-03 | Xmine：仓位链读 + 记录改 logs；概览 pair-plus(2+3)；gaps 补全协议无源位；§8.2a 复用机制/图/FAQ                               |
| 2026-08-03 | Bond LP/Burn：仓位改链读（修 `claimable_gagx`）；gaps 补全左栏/仓位/无源位；H5 机制竖时间线恢复（`4665:1252`）；仓位文案跟稿 |
| 2026-08-03 | Bond LP/Burn：澄清已售/周期收益/TVL/溢价无源；右栏复用 Stake chrome（`DappProcessSteps` / `MetricGrid`）                     |
| 2026-08-03 | Stake 子页：仓位五卡改接 `readStakePositions`（修错用 `claimable_gagx`）；加成=`extraInterest`；记图头占位无源               |
| 2026-08-03 | Stake 子页：记记录表脚仅有行时；空态无表头跟原型                                                                             |
| 2026-08-03 | 质押 Hub：核对 Hub 读路径仍齐；澄清智库 AGX-value + 副值 spot；可运行周期/图历史/LP·销毁表列仍无源                           |
| 2026-08-03 | 资产 Hub：拆列 mode 仓位/总收益/缓冲 gAGX；记 API 路径总收益无源；hideZero 派生说明                                          |
| 2026-08-02 | 全表改为「数据位 / 是否已接 / 源」；无源统一写「无数据源」；删掉易混的 API 对照措辞                                          |
| 2026-08-02 | 兑换缺口双 agent 核实；按 `tabOrder` 重排；只记链上/API                                                                      |
| 2026-08-02 | 资产 Hub：补 APR 无源；holdings/reward/buffer 已接                                                                           |
| 2026-08-02 | 初版：质押 Hub；价改 Pair spot                                                                                               |
