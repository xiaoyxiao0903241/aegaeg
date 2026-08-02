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

> 待补表。

## 5. 释放（Release）

> 待补表。

## 6. 社区（Community）

> 待补表。

## 7. 创世（Genesis）

> 待补表。

---

## 变更记录

| 日期       | 变更                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
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
