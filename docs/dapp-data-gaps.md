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

| 数据位                  | 是否已接 | 源                                          |
| ----------------------- | -------- | ------------------------------------------- |
| 质押总量 TVL            | 是       | 链上 `StakingPool.poolAgxBalance` × spot    |
| 总市值                  | 是       | 流通 × spot                                 |
| AGX 流通量              | 是       | 链上 `sAGX.circulatingSupply`               |
| 智库储备                | 是       | 链上 `Treasury.totalReserves` × spot        |
| AGX 价格                | 是       | Pair spot                                   |
| 总销毁量                | 是       | 链上 `getConfig.totalBurned`                |
| Rebase 收益率           | 是       | 链上 `epoch` + `sAGX.rebases`               |
| 可运行周期              | 否       | 无数据源                                    |
| 质押地址数              | 是       | API `POST /performance/stake-address-count` |
| 周期表 基础日收益       | 是       | `2 ×` 链上 epoch rebase%（stake 段）        |
| 周期表 收益率加成       | 是       | 手册 `LOCKED_*_BONUS_BPS`（活期 0）         |
| 周期表 周期收益率       | 是       | 本地：基础日收益复利至 tenure               |
| 周期表 LP/销毁 段收益列 | 否       | 无数据源                                    |
| 图 TVL/市值历史         | 否       | 无数据源                                    |

### 3.2 Stake 子页

| 数据位                                    | 是否已接 | 源                        |
| ----------------------------------------- | -------- | ------------------------- |
| 左栏 meta：基础日收益                     | 是       | `2 ×` 链上 epoch rebase%  |
| 左栏 meta：周期收益                       | 是       | 本地：基础日复利 × tenure |
| 左栏 meta：加成                           | 是       | 手册 `LOCKED_*_BONUS_BPS` |
| 左栏锁定 / 合约                           | 是       | 周期派生 + 池地址         |
| 概览：pool TVL / Epoch / rebase% / 倒计时 | 是       | 链上 pool + epoch         |
| 仓位：持仓 / 已领 / 待释 / Rebase         | 是       | API holdings + stake-flow |
| TVL 历史图                                | 否       | 无数据源                  |

### 3.3 LP 债券 / 销毁债券

| 数据位                                        | 是否已接 | 源                    |
| --------------------------------------------- | -------- | --------------------- |
| 周期卡：当前折扣                              | 是       | 链上 `discountRateBP` |
| 周期卡：折扣价 `$`                            | 是       | spot × 折扣%          |
| 周期卡：折扣区间                              | 是       | FAQ 不变量            |
| 周期卡：已售 `$` / 周期收益率                 | 否       | 无数据源              |
| meta：滑点 / 支付 / 获得 / 上限 / 释放 / 合约 | 是       | quote + market + 地址 |
| 概览：债券 TVL / 溢价率                       | 否       | 无数据源              |
| 概览：rebase 倒计时 / %                       | 是       | 与 Stake 同源         |
| 仓位 / 购买记录                               | 是       | bond-flow API         |

### 3.4 X 挖矿

| 数据位                              | 是否已接 | 源               |
| ----------------------------------- | -------- | ---------------- |
| 额度 / 用户仓位                     | 是       | API + 链上 quota |
| meta 日收益                         | 否       | 无数据源         |
| 概览：协议 X 池 TVL / X 价 / 日产出 | 否       | 无数据源         |

### 3.5 收益计算器

| 数据位              | 是否已接 | 源                                            |
| ------------------- | -------- | --------------------------------------------- |
| 左栏输入 → 右栏结果 | 是       | 本地：`2×rebase` 日复利 + 手册加成；spot 种子 |
| 收益曲线 day 1..720 | 是       | 同上本地公式                                  |
| Xmine 产品收益      | 否       | 无数据源                                      |

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

| 日期       | 变更                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| 2026-08-03 | 资产 Hub：拆列 mode 仓位/总收益/缓冲 gAGX；记 API 路径总收益无源；hideZero 派生说明 |
| 2026-08-02 | 全表改为「数据位 / 是否已接 / 源」；无源统一写「无数据源」；删掉易混的 API 对照措辞 |
| 2026-08-02 | 兑换缺口双 agent 核实；按 `tabOrder` 重排；只记链上/API                             |
| 2026-08-02 | 资产 Hub：补 APR 无源；holdings/reward/buffer 已接                                  |
| 2026-08-02 | 初版：质押 Hub；价改 Pair spot                                                      |
