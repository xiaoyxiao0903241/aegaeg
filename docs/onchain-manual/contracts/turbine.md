# Turbine (AegisTurbineVestingHub) 合约文档

> 来源：`doc-contracts-turbine`
> ABI：[`abis/turbine.json`](../abis/turbine.json)

## 完整 ABI

abi/AegisTurbineVestingHub.json
SHA-256 b092070c39b2…
77
44
12
21

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/turbine.json`](../abis/turbine.json)（77 entries）。

</details>

## Turbine (AegisTurbineVestingHub) 合约文档

### 概述

`AegisTurbineVestingHub` 是 AEGIS X 的奖励出售中枢。用户从 RewardQueue 领取的 AGX 先进入 Turbine 的余额（`turbineBalances`），然后通过"静默期"（cooldown）机制兑换为 gAGX。静默期长度根据国库健康度自适应调整（24-96 小时）。**冷却到期后 gAGX 经 `AegisSplitterManager` 路由到头部分流器做 30 天线性释放**（用户不直接收到 gAGX；在分流器链尾 `claim` 后才到钱包）。

**部署 key**: `Turbine`

**ABI 路径**: `abi/AegisTurbineVestingHub.json`

---

### 关键概念

#### 1. 余额与静默期流程

text

```text
RewardQueue → registerSellQuota() → turbineBalances[user]
                                         ↓
用户用 USD1 购买 AGX → buyAgxAndStartCooldown() → silences[user][]
                                                    ↓ (等待 cooldown)
                                    claimCooledGagx() → AegisSplitterManager → 头部分流器 → 30天线性释放 → 用户钱包
```

#### 2. 自适应冷却

- treasury 提供储备率数据
- 储备率健康 → 最短冷却 24 小时
- 储备率紧张 → 最长冷却 96 小时
- 中间值线性插值

#### 3. 出售配额

- 奖励通过 registerSellQuota() 进入（由 RewardQueue 调用）
- 用户余额记录在 turbineBalances[user]
- 用户用 USD1 购买等额 AGX 后，余额转为静默期

---

### 前端 API

#### 视图函数

##### turbineBalances(address) -> (uint256)

用户的可出售余额。

js

```js
const balance = await turbine.turbineBalances(userAddress)
console.log('Turbine balance:', ethers.formatUnits(balance, 9), 'AGX')
```

##### silencesSize(address) -> (uint256)

用户的静默期记录数。

js

```js
const size = await turbine.silencesSize(userAddress)
console.log('Silence records:', size)
```

##### silences(address user, uint256 index)

读取单条冷却记录的 `silenceBalance` 和 `startTime`。前端使用 `startTime + currentCooldownDuration()` 计算倒计时。`claimCooledGagx(index)` 使用 swap-and-pop 删除记录，成功后索引会重排，必须重新拉取整张列表。

##### isVested(address user, uint256 index) -> (bool)

检查指定静默期是否已到期。

js

```js
const isReady = await turbine.isVested(userAddress, 0)
console.log('Cooldown finished:', isReady)
```

##### currentCooldownDuration() -> (uint256)

返回当前冷却期长度（考虑自适应）。

js

```js
const duration = await turbine.currentCooldownDuration()
console.log('Current cooldown:', Number(duration) / 3600, 'hours')
```

##### quoteUsdInForAgxOut(uint256 agxAmount) -> (uint256)

预览购买指定 AGX 需要的 USD1 数量。

js

```js
const usdNeeded = await turbine.quoteUsdInForAgxOut(agxAmount)
console.log('Need USD1:', ethers.formatUnits(usdNeeded, 18))
```

#### 状态修改函数

##### registerSellQuota(uint256 _receiveId, address _user, uint256 _turbineAmount) — 仅授权 caller

由 RewardQueue 等授权合约调用，将用户的 AGX 余额拉入 Turbine 并记入 `turbineBalances[user]`（沿迁移链记到根账户）。零地址/零到账触发 `ErrorNotAuthorized` / `ErrorZeroAmount`。触发 `Received`。

##### buyAgxAndStartCooldown(uint256 usdAmount)

用 USD1 购买 AGX 并进入静默期。

**前提条件:**

- 用户有 turbineBalances
- usdAmount > 0
- usdAmount <= required amount
- 用户有足够的 USD1

实际消耗配额等于 swap 实得 AGX 与当前 quota 的较小值；部分 USD1 输入不会保证一次用完全部 quota。

**事件:**

- Silenced(user, agxAmount, usdAmount, timestamp)

js

```js
async function buyAndCooldown(turbine, usdContract, signer) {
  const user = await signer.getAddress()
  const balance = await turbine.turbineBalances(user)

  if (balance === 0n) {
    console.log('No turbine balance')
    return
  }

  // 计算需要的 USD1
  const usdNeeded = await turbine.quoteUsdInForAgxOut(balance)
  console.log('Balance:', ethers.formatUnits(balance, 9), 'AGX')
  console.log('Need USD1:', ethers.formatUnits(usdNeeded, 18))

  // 授权 USD1
  await (await usdContract.approve(await turbine.getAddress(), usdNeeded)).wait()

  // 购买并进入静默期
  const tx = await turbine.connect(signer).buyAgxAndStartCooldown(usdNeeded)
  const receipt = await tx.wait()

  const cooldown = await turbine.currentCooldownDuration()
  console.log('Silence started! Cooldown:', Number(cooldown) / 3600, 'hours')
}
```

##### claimCooledGagx(uint256 index)

静默期结束后领取 gAGX。**已接入分流器**：若 `splitterManager` 已配置（`setSplitterManager`），gAGX 不再直接 mint 给用户，而是：

1. mintWithAgx(address(this), silenceBalance) — 先 mint gAGX 到 Turbine 自身
2. safeIncreaseAllowance(splitterManager, silenceBalance) — 授权分流管理器
3. AegisSplitterManager.createRelease(msg.sender, silenceBalance) — 经管理器按用户注册时间路由到头部分流器，做 30 天（或新用户周期）线性释放

用户在分流器链尾 `claim` 后才收到 gAGX 到钱包。若 `splitterManager` 未配置（`address(0)`），保留旧行为（直接 mint 给用户）。

js

```js
async function claimGagx(turbine, index, signer) {
  const isReady = await turbine.isVested(await signer.getAddress(), index)
  if (!isReady) {
    console.log('Cooldown not finished')
    return
  }

  const tx = await turbine.connect(signer).claimCooledGagx(index)
  await tx.wait()
  console.log('gAGX routed to splitter for linear release')
}
```

##### setSplitterManager(address _manager) — onlyOwner

设置分流器管理合约地址。`address(0)` 关闭分流（回退为直接 mint gAGX 给用户）。触发 `SplitterManagerUpdated`。

##### setCooldownDuration(uint256 _duration) — onlyOwner

设置基础冷却期（范围 `MIN_COOLDOWN_DURATION` 24h - `MAX_COOLDOWN_DURATION` 96h，越界触发 `ErrorCooldownOutOfRange`）。触发 `CooldownUpdated`。

##### setTreasury(address _treasury) — onlyOwner

设置国库地址（提供储备率数据，零地址拒绝）。触发 `TreasuryUpdated`。

##### setRewardGagx(address _gagx) — onlyOwner

设置 gAGX 合约地址（零地址拒绝）。触发 `RewardGagxUpdated`。

##### setAdaptiveCooldownEnabled(bool _enabled) — onlyOwner

开关自适应冷却。触发 `CooldownUpdated`。

##### setReserveRatioThresholds(uint256 _stressedBP, uint256 _healthyBP) — onlyOwner

设置紧张/健康储备率阈值（须 `_stressedBP > 0` 且 `_healthyBP > _stressedBP`，否则 `ErrorInvalidThresholds`）。触发 `ReserveRatioThresholdsUpdated`。

##### setSwapConfig(uint256 _slippageBP, uint256 _deadlineOffset) — onlyOwner

设置交换滑点（BPS）与 deadline 偏移。触发 `SwapConfigUpdated`。

##### setAuthorizedCaller(address _caller, bool _allowed) — onlyOwner

授权/撤销可调用 `registerSellQuota` 的合约（零地址拒绝）。触发 `AuthorizedCallerUpdated`。

##### sweepExcess(address _to, uint256 _amount) — onlyOwner

提取合约内超出用户应得总额（`turbineBalances` + `silences`）的盈余 AGX。超出盈余触发 `ErrorExceedsExcess(requested, excess)`。

##### setMigrationManager(address _manager) — onlyOwner

设置迁移管理器（`migrationManager` 设为非零后不可更改，触发 `MigrationManagerImmutable`）。

##### migrateAccount(address oldAccount, address newAccount) — 仅 migrationManager

将 `oldAccount` 的 Turbine 余额/静默期别名映射到 `newAccount`（仅写别名，不搬运数据）。`newAccount` 必须无历史状态，否则 `TurbineMigratedAccount`。

---

### 事件

#### Received(address indexed recipient, uint256 amount, uint256 receiveId, uint256 timestamp)

奖励进入 Turbine 时触发。

#### Silenced(address indexed recipient, uint256 silenceAmount, uint256 usdtAmount, uint256 timestamp)

进入静默期时触发。

#### CooledGagxClaimed(address indexed recipient, uint256 amount, uint256 timestamp)

领取 gAGX 时触发。

#### AuthorizedCallerUpdated(address indexed caller, bool allowed, uint256 timestamp)

`setAuthorizedCaller` 授权/撤销 caller 时触发。

#### TreasuryUpdated(address indexed treasury, uint256 timestamp)

`setTreasury` 修改国库地址时触发。

#### CooldownUpdated(uint256 duration, bool adaptive, uint256 timestamp)

`setCooldownDuration` / `setAdaptiveCooldownEnabled` 修改冷却配置时触发。

#### RewardGagxUpdated(address indexed gagx, uint256 timestamp)

`setRewardGagx` 修改 gAGX 地址时触发。

#### ReserveRatioThresholdsUpdated(uint256 stressedBP, uint256 healthyBP, uint256 timestamp)

`setReserveRatioThresholds` 修改储备率阈值时触发。

#### SwapConfigUpdated(uint256 slippageBP, uint256 deadlineOffset, uint256 timestamp)

`setSwapConfig` 修改交换配置时触发。

### 错误码

| 错误                                        | 原因                                   | 解决方案                      |
| ------------------------------------------- | -------------------------------------- | ----------------------------- |
| `ErrorInsufficientBalance()`                | 无 Turbine 余额                        | 等待奖励发放                  |
| `ErrorSilentTime()`                         | 冷却期未结束                           | 等待到期                      |
| `ErrorNoSilenceBalance()`                   | 无静默期记录                           | 检查索引                      |
| `ErrorInvalidAmount()`                      | USD1 数量不匹配                        | 使用 quoteUsdInForAgxOut 预览 |
| `ErrorZeroAddress()`                        | 地址为零                               | 使用非零地址                  |
| `ErrorZeroAmount()`                         | 金额为零或到账为零                     | 使用正数金额                  |
| `ErrorIndexOutOfBounds()`                   | 静默期索引越界                         | 使用有效索引                  |
| `ErrorNotAvailable()`                       | 无静默期记录                           | 先买入冷却                    |
| `ErrorNotAuthorized()`                      | 非授权 caller 调用 `registerSellQuota` | 检查授权                      |
| `ErrorCooldownOutOfRange()`                 | 冷却期超出 24h-96h                     | 设置范围内值                  |
| `ErrorInvalidThresholds()`                  | 储备率阈值非法                         | 保证 healthy>stressed>0       |
| `TurbineMigratedAccount(account)`           | 账户已迁移或目标已有状态               | 使用规范地址                  |
| `TurbineNotMigrationManager(caller)`        | 非 `migrationManager` 调用迁移         | 检查调用者                    |
| `ErrorExceedsExcess(requested, excess)`     | `sweepExcess` 超出盈余                 | 减少 amount                   |
| `MigrationManagerImmutable(currentManager)` | `migrationManager` 已设且试图改        | 保持原管理器                  |

### 配置参数

| 参数                      | 默认值       | 说明       | 设置者 |
| ------------------------- | ------------ | ---------- | ------ |
| `coolingDuration`         | 24 小时      | 基础冷却期 | owner  |
| `adaptiveCooldownEnabled` | false        | 是否自适应 | owner  |
| `healthyReserveRatioBP`   | 20000 (200%) | 健康储备率 | owner  |
| `stressedReserveRatioBP`  | 15000 (150%) | 紧张储备率 | owner  |
| `swapSlippageBP`          | 300 (3%)     | 交换滑点   | owner  |
| `rewardGagx`              | 初始化后设置 | gAGX 地址  | owner  |
| `treasury`                | 初始化后设置 | 国库地址   | owner  |
