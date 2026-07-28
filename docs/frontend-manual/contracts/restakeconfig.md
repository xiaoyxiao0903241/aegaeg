# RestakeConfig 合约文档

> 来源：`doc-contracts-restakeconfig`
> ABI：[`abis/restakeconfig.json`](../abis/restakeconfig.json)

## 完整 ABI

abi/RestakeConfig.json
SHA-256 5762805667e1…
65
33
13
19

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/restakeconfig.json`](../abis/restakeconfig.json)（65 entries）。

</details>

## RestakeConfig 合约文档

### 概述

`RestakeConfig` 是 AEGIS X 的复投配置中心，定义多种复投计划（period + tax + target），控制默认复投比例和强制复投策略。它是 LockedStaking、BondDepository 等合约执行 `claimRewardMixed` 时的配置来源。

**部署 key**: `RestakeConfig`

**ABI 路径**: `abi/RestakeConfig.json`

---

### 关键概念

#### 1. 复投计划（Restake Plan）

每个计划定义：

- period - 锁定期（秒）
- taxBP - 税率（BPS）
- target - 复投目标合约地址
- exists - 是否有效

#### 2. 复投比例配置

- defaultRestakeBps - 默认复投比例（BPS），默认 5000 = 50%
- forceRestakeEnabled - 是否强制复投
- minRestakeBps - 最小复投比例

#### 3. AGX 价格

通过 LP 交易对获取 AGX/USD 价格，用于 `agxUsdValue()` 计算。

当前读取的是 Pair 即时储备，不是 TWAP 或可信预言机。该数值用于 Lucky 购买资格换算时可能被同区块/MEV 操纵；正式环境必须限制调用来源、监控储备突变，并在完成可信价格方案前把它视为风险边界。

---

### 前端 API

#### 视图函数

##### getPlan(uint256 index) -> (period, taxBP, target, exists)

获取指定计划详情。

js

```js
const plan = await restakeConfig.getPlan(0)
console.log('Period:', Number(plan.period) / 86400, 'days')
console.log('Tax:', Number(plan.taxBP) / 100, '%')
console.log('Target:', plan.target)
```

##### getPlanByPeriod(uint256 period) -> (index, exists)

根据锁定期查找计划索引。

js

```js
const { index, exists } = await restakeConfig.getPlanByPeriod(180 * 86400) // 当前产品的 180 天长期计划
if (exists) console.log('Found plan at index:', index)
```

##### getAllPlans() -> (RestakePlan[])

获取所有有效计划，但返回值会过滤 `exists=false` 项，因此数组位置**不是可安全回传的链上 planIndex**。

js

```js
const plans = await restakeConfig.getAllPlans()
plans.forEach((p, i) => {
  console.log(
    `Active list item ${i}: ${Number(p.period) / 86400}d, tax ${Number(p.taxBP) / 100}%, target: ${p.target}`,
  )
})
```

前端制作复投选择器时，必须先读 `getPlanCount()`，再遍历 `getPlan(i)`，把原始 `i` 与有效计划一起保存；不能把 `getAllPlans()` 的过滤后下标传给 `claim*Mixed`。

##### getPlanCount() -> (uint256)

获取计划总数。

##### agxPrice() -> (uint256)

获取当前 AGX 价格（基于 LP）。

js

```js
const price = await restakeConfig.agxPrice()
console.log('AGX price:', ethers.formatUnits(price, 18))
```

##### agxUsdValue(uint256 agxAmountRaw) -> (uint256)

计算 AGX 数量的 USD 价值。

js

```js
const value = await restakeConfig.agxUsdValue(ethers.parseUnits('100', 9))
console.log('100 AGX = $', ethers.formatUnits(value, 18))
```

##### getRestakeBpsConfig() -> (defaultBps, forceEnabled, minBps)

获取复投比例配置。

js

```js
const config = await restakeConfig.getRestakeBpsConfig()
console.log('Default restake:', Number(config.defaultBps) / 100, '%')
console.log('Force restake:', config.forceEnabled)
console.log('Min restake:', Number(config.minBps) / 100, '%')
```

---

---

### 状态修改函数

#### 计划管理（owner 或 operator）

| 函数                                                        | 权限             | 说明                                        |
| ----------------------------------------------------------- | ---------------- | ------------------------------------------- |
| `addPlan(uint256 _period, uint256 _taxBP, address _target)` | owner / operator | 新增复投计划。源码 `:89`                    |
| `removePlan(uint256 _index)`                                | owner / operator | 软删除计划（`exists = false`）。源码 `:106` |
| `setPlanTax(uint256 _index, uint256 _taxBP)`                | owner / operator | 更新计划税率。源码 `:116`                   |
| `setPlanTarget(uint256 _index, address _target)`            | owner / operator | 更新计划复投目标。源码 `:127`               |

#### 系统配置（onlyOwner）

| 函数                                                                            | 说明                                    |
| ------------------------------------------------------------------------------- | --------------------------------------- |
| `setTaxReceiver(address _receiver)`                                             | 设置税收接收地址（非零）。源码 `:183`   |
| `setContributionLedger(address _ledger)`                                        | 设置贡献账本地址（非零）。源码 `:190`   |
| `setAgxToken(address _token)`                                                   | 设置 AGX 地址（非零）。源码 `:197`      |
| `setLiquidityPool(address _pool)`                                               | 设置 LP 地址（非零）。源码 `:204`       |
| `setDefaultRestakeBps(uint256 _bps)`                                            | 设置默认复投比例。源码 `:228`           |
| `setForceRestakeEnabled(bool _enabled)`                                         | 开关强制复投。源码 `:240`               |
| `setMinRestakeBps(uint256 _bps)`                                                | 设置最小复投比例。源码 `:252`           |
| `setRestakeBpsConfig(uint256 _defaultBps, bool _forceEnabled, uint256 _minBps)` | 一次性设置全部复投比例参数。源码 `:264` |
| `setBondOperator(address _operator, bool _flag)`                                | 设置 operator 白名单。源码 `:295`       |

### 事件

| 事件                                                                      | 说明             |
| ------------------------------------------------------------------------- | ---------------- |
| `PlanAdded(uint256 index, uint256 period, uint256 taxBP, address target)` | 新增计划         |
| `PlanRemoved(uint256 index)`                                              | 移除计划         |
| `PlanTaxUpdated(uint256 index, uint256 taxBP)`                            | 计划税率更新     |
| `PlanTargetUpdated(uint256 index, address target)`                        | 计划目标更新     |
| `TaxReceiverUpdated(address receiver)`                                    | 税收接收地址更新 |
| `ContributionLedgerUpdated(address ledger)`                               | 贡献账本更新     |
| `DefaultRestakeBpsUpdated(uint256 oldValue, uint256 newValue)`            | 默认复投比例更新 |
| `ForceRestakeUpdated(bool oldValue, bool newValue)`                       | 强制复投开关更新 |
| `MinRestakeBpsUpdated(uint256 oldValue, uint256 newValue)`                | 最小复投比例更新 |
| `AgxTokenUpdated(address token)`                                          | AGX 地址更新     |
| `LiquidityPoolUpdated(address pool)`                                      | LP 地址更新      |

源码：`src/RestakeConfig.sol:57-75`

### 错误码

| 错误                  | 原因                                 | 解决方案             |
| --------------------- | ------------------------------------ | -------------------- |
| `IndexOutOfBounds()`  | 计划索引越界                         | 使用有效索引         |
| `PlanNotExists()`     | 计划不存在或已删除                   | 使用有效计划         |
| `InvalidPeriod()`     | 周期为 0                             | 使用正数             |
| `InvalidTax()`        | 税率超过 10000                       | 使用 0-10000         |
| `InvalidTarget()`     | 目标地址为空                         | 提供有效地址         |
| `BelowMinRestake()`   | 低于最小复投比例                     | 增加比例             |
| `DefaultBelowMin()`   | 默认值低于最小值                     | 调整配置             |
| `PriceSourceNotSet()` | LP 地址未设置                        | 联系管理员           |
| `ZeroAgxReserve()`    | LP 中 AGX 储备为 0                   | 等待流动性恢复       |
| `InvalidReceiver()`   | taxReceiver 为零地址                 | 提供非零地址         |
| `NotAuthorized()`     | 非 owner/operator 调用 plan 管理函数 | 用 owner 或 operator |
| `InvalidLedger()`     | contributionLedger 为零地址          | 提供非零地址         |
| `InvalidToken()`      | agxToken 为零地址                    | 提供非零地址         |
| `InvalidPool()`       | liquidityPool 为零地址               | 提供非零地址         |
| `InvalidBps()`        | bps > 10000                          | 使用 0-10000         |

### 配置参数

| 参数                  | 默认值       | 说明            | 设置者                     |
| --------------------- | ------------ | --------------- | -------------------------- |
| `taxReceiver`         | 初始化时设置 | 税收接收地址    | owner                      |
| `defaultRestakeBps`   | 5000 (50%)   | 默认复投比例    | owner                      |
| `minRestakeBps`       | 5000 (50%)   | 最小复投比例    | owner                      |
| `forceRestakeEnabled` | false        | 是否强制复投    | owner                      |
| `agxToken`            | 初始化后设置 | AGX 地址        | owner                      |
| `liquidityPool`       | 初始化后设置 | LP 地址         | owner                      |
| `plans`               | 初始化后添加 | 复投计划列表    | owner/operator             |
| `contributionLedger`  | 初始化后设置 | 贡献账本地址    | owner                      |
| `operators`           | -            | operator 白名单 | owner（`setBondOperator`） |
