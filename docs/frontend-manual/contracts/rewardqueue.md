# RewardQueue (AegisRewardVestingQueue) 合约文档

> 来源：`doc-contracts-rewardqueue`
> ABI：[`abis/rewardqueue.json`](../abis/rewardqueue.json)

## 完整 ABI

abi/AegisRewardVestingQueue.json
SHA-256 a06b4d142882…
54
35
6
13

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/rewardqueue.json`](../abis/rewardqueue.json)（54 entries）。

</details>

## RewardQueue (AegisRewardVestingQueue) 合约文档

### 概述

`AegisRewardVestingQueue` 是 AEGIS X 的奖励线性释放（vesting）系统。来自 Bond、LockedStaking、EarlyStaking 等合约的奖励被放入 RewardQueue，按照不同的释放计划（Plan）线性解锁。用户解锁后可以领取到 Turbine 合约进行售卖。

**部署 key**: `RewardQueue`

**ABI 路径**: `abi/AegisRewardVestingQueue.json`

---

### 关键概念

#### 1. 释放计划（Vesting Plans）

默认 4 个计划，释放时间越长，手续费越低：

| Plan Index | 释放周期 | 手续费率 | 适用场景             |
| ---------- | -------- | -------- | -------------------- |
| 0          | 5 天     | 20%      | 快速变现             |
| 1          | 20 天    | 10%      | 中等释放             |
| 2          | 40 天    | 5%       | 长期释放             |
| 3          | 60 天    | 1%       | 最长释放，最低手续费 |

源码没有“最多 32 条”的计划或用户记录门禁；单个用户在任一计划下的 queue 记录会按实际业务动态增长。计划模板和相关 ABI 的 `planIndex` 使用 `uint8`（编码域 0～255），且多个聚合查询用 `uint8` 自增遍历；当模板数达到 256 时遍历会溢出回滚，因此当前实现必须保持 `plans.length <= 255`。运营应通过 `queueSize()` 读取实际模板数并只创建真实需要的少量计划。迁移目标干净性检查会按实际计划数量扫描。

#### 2. 队列（Queue）机制

每个用户的奖励进入独立的队列：

- QueueData 存储： lockedAmount （剩余锁定量）、 lastClaimTime 、 warmupTime 、 remainingDuration 、 releasedAmount
- 释放速率基于时间线性计算
- 可多次进入队列（同一 plan 可有多个条目）

#### 3. 领取流程

1. 调用 claimVestedReward 或 claimAllVestedRewards 释放已解锁部分
2. 释放的 AGX 自动转入 Turbine 的售卖配额
3. 用户通过 Turbine 合约出售 AGX

#### 4. 领取起算时间

新进入队列的奖励会记录 `warmupTime = block.timestamp` 和 `lastClaimTime = block.timestamp`。当前源码没有额外未来预热等待；可领取量从入队时间开始按计划线性释放。

---

### 前端 API

#### 视图函数

##### queuePlans() -> (QueuePlan[])

返回所有释放计划。

js

```js
const plans = await rewardQueue.queuePlans()
plans.forEach((plan, i) => {
  console.log(
    `Plan ${i}: ${Number(plan.releaseDuration) / 86400} days, fee: ${Number(plan.feeRate) / 100}%`,
  )
})
```

##### queuePlanInfo(uint256 _index) -> (feeRate, feeRecipient)

查询指定计划的手续费率和收款地址。

js

```js
const [feeRate, feeRecipient] = await rewardQueue.queuePlanInfo(0)
console.log(`Plan 0 fee: ${Number(feeRate) / 100}%, recipient: ${feeRecipient}`)
```

##### getUserTotalClaimable(address _user) -> (uint256)

返回用户所有计划中可领取的总量。

js

```js
const totalClaimable = await rewardQueue.getUserTotalClaimable(userAddress)
console.log('Total claimable:', ethers.formatUnits(totalClaimable, 9), 'AGX')
```

##### getUserClaimableList(address, uint256 start, uint256 limit) -> (items[], totalCount)

分页获取用户所有可领取的队列条目。

**返回值 `UserQueueItem`:**

- planIndex - 计划索引
- index - 队列内索引
- data - QueueData 详情
- claimableAmount - 可领取数量

js

```js
const { items, totalCount } = await rewardQueue.getUserClaimableList(userAddress, 0, 20)
console.log('Total queue items:', totalCount)

for (const item of items) {
  const planDays = Number(item.data.remainingDuration) / 86400
  console.log(
    `Plan ${item.planIndex}: ${ethers.formatUnits(item.claimableAmount, 9)} claimable, ${planDays.toFixed(1)}d remaining`,
  )
}
```

##### getReleasedRewardsWithPlanIndex(address, uint8 planIndex) -> (uint256)

返回指定计划下所有条目已解锁的总量（可领取部分）。

js

```js
const claimable = await rewardQueue.getReleasedRewardsWithPlanIndex(userAddress, 1)
console.log('Plan 1 claimable:', ethers.formatUnits(claimable, 9), 'AGX')
```

##### getReleasedRewardsWithOffset(address, uint8 planIndex, uint256 start, uint256 limit) -> (uint256)

分页查询指定范围内的可领取量。

js

```js
const claimable = await rewardQueue.getReleasedRewardsWithOffset(userAddress, 1, 0, 10)
```

##### getQueuePlanSize(address, uint8 planIndex) -> (uint256)

返回指定计划的队列条目数。

js

```js
const size = await rewardQueue.getQueuePlanSize(userAddress, 0)
console.log('Plan 0 queue items:', size)
```

##### getQueueData(address, uint8 planIndex, uint256 index) -> (QueueData)

获取指定队列条目的详细数据。

##### getRewards(address, uint8 planIndex, uint256 index) -> (uint256)

返回指定队列条目的锁定总量。

##### getRewardsWithPlanIndex(address, uint8 planIndex) -> (uint256)

返回指定计划所有条目的锁定总量（含未解锁部分）。

##### queueSize() -> (uint256)

返回释放计划模板数量。源码 `src/RewardQueue.sol:110`

##### getReleasedRewards(address _user, uint8 _planIndex, uint256 _index) -> (uint256)

返回指定队列条目的可领取数量。源码 `:187`

##### getRewardsWithOffset(address _user, uint8 _planIndex, uint256 _start, uint256 _limit) -> (uint256)

分页返回指定范围内条目的锁定总量。源码 `:163`

##### getUserQueueTotalCount(address _user) -> (uint256 totalCount)

返回用户在所有计划下的队列条目总数。源码 `:234`

---

#### 状态修改函数

##### claimVestedReward(uint8 planIndex, uint256 index)

领取指定队列条目的已解锁部分。

**前提条件:**

- planIndex 有效
- index 在范围内
- 有可领取数量

**事件:**

- RewardReleased(user, planIndex, index, amount, timestamp)
- RewardClaimedFromQueue(user, planIndex, amount, index, timestamp)

js

```js
async function claimReward(rewardQueue, planIndex, index, signer) {
  // 1. 检查可领取数量
  const claimable = await rewardQueue.getReleasedRewards(
    await signer.getAddress(),
    planIndex,
    index,
  )
  if (claimable === 0n) {
    console.log('Nothing to claim')
    return
  }

  // 2. 领取
  const tx = await rewardQueue.connect(signer).claimVestedReward(planIndex, index)
  const receipt = await tx.wait()

  console.log('Claimed from queue, AGX sent to Turbine')
}
```

##### claimAllVestedRewards(uint8 planIndex)

领取指定计划下所有条目的已解锁部分。

js

```js
async function claimAllRewards(rewardQueue, planIndex, signer) {
  // 1. 检查总量
  const claimable = await rewardQueue.getReleasedRewardsWithPlanIndex(
    await signer.getAddress(),
    planIndex,
  )
  if (claimable === 0n) {
    console.log('Nothing to claim for plan', planIndex)
    return
  }

  console.log('Total claimable for plan', planIndex, ':', ethers.formatUnits(claimable, 9))

  // 2. 领取全部
  const tx = await rewardQueue.connect(signer).claimAllVestedRewards(planIndex)
  await tx.wait()

  console.log('All rewards claimed and sent to Turbine')
}
```

##### claimVestedRewardsInRange(uint8 planIndex, uint256 start, uint256 limit)

领取指定范围内条目的已解锁部分。适合大量队列条目分批领取。

js

```js
// 分批领取前 10 个条目
await rewardQueue.connect(signer).claimVestedRewardsInRange(planIndex, 0, 10)
```

##### enqueueReward(address _user, uint256 _amount, uint8 _planIndex)

将奖励入队（仅 `authorizedCallers`，源码 `src/RewardQueue.sol:322`）。会按 `_original(_user)` 写入根账户队列，并标记 `everHadAccountState`。

##### addVestingPlan(uint256 _releaseDuration, uint256 _feeRate, address _feeRecipient)

新增释放计划模板（`onlyOwner`，源码 `:525`）。

##### setVestingPlan(uint256 _index, uint256 _releaseDuration, uint256 _feeRate, address _feeRecipient)

更新指定计划模板（`onlyOwner`，源码 `:535`）。

##### setTurbineHub(address _turbine)

更新 Turbine 地址（`onlyOwner`，非零，源码 `:547`）。

##### setAuthorizedCaller(address _caller, bool _allowed)

配置可调用 `enqueueReward` 的合约（`onlyOwner`，源码 `:553`）。

##### setMigrationManager(address _manager)

设置账户迁移管理者（`onlyOwner`，一次性不可变：一旦设过非零 manager，只能传同一地址，否则 revert `MigrationManagerImmutable`，源码 `:492`）。

##### migrateAccount(address oldAccount, address newAccount)

将 `oldAccount` 的队列归属迁移到 `newAccount`（仅 `migrationManager`，源码 `:500`）。要求 `newAccount` 从未有账户状态（`everHadAccountState`、直接队列、`migratedTo`、`_originalOf` 均为空），否则 revert `RewardQueueMigratedAccount`。

---

### 事件

#### EnteredQueue(address indexed user, uint256 index, uint256 amount, uint256 timestamp)

奖励进入队列时触发（由其他合约调用 `enqueueReward`）。

#### RewardReleased(address indexed user, uint8 planIndex, uint256 index, uint256 amount, uint256 timestamp)

领取释放的奖励时触发。

js

```js
rewardQueue.on('RewardReleased', (user, planIndex, index, amount) => {
  console.log(`Released ${ethers.formatUnits(amount, 9)} AGX from plan ${planIndex}[${index}]`)
})
```

#### RewardClaimedFromQueue(address indexed user, uint8 planIndex, uint256 amount, uint256 count, uint256 timestamp)

领取成功后奖励转入 Turbine 时触发。

#### AuthorizedCallerUpdated(address indexed caller, bool allowed, uint256 timestamp)

授权调用者更新时触发。

---

### 账户迁移

为支持账户升级/换地址，RewardQueue 维护一条 canonical 别名链：

- migratedTo[old] -> new ：公开 mapping，标记 old 已迁移到 new。
- _originalOf[new] -> root （private）：反向指针，指向根账户。
- everHadAccountState[root] ：根账户是否曾有过队列状态。
- onlyActiveAccount modifier： claimVestedReward / claimAllVestedRewards / claimVestedRewardsInRange 在 migratedTo[msg.sender] != address(0) 时 revert RewardQueueMigratedAccount ，已迁移的旧地址不能再 claim。
- _original(user) / _canonical(user) ：通过 _originalOf 链回溯到根账户； enqueueReward 按 _original(_user) 写入根队列，迁移前后入队都会归并到同一根账户。
- setMigrationManager ：一次性配置，不可变更（只能重复设置同一地址）。
- migrateAccount(old, new) ：要求 new 账户完全干净（无历史状态、无队列、未被迁移过）。

源码：`src/RewardQueue.sol:62-73`、`:492-515`

---

### 错误码

| 错误                                                | 原因                                    | 解决方案                       |
| --------------------------------------------------- | --------------------------------------- | ------------------------------ |
| `ErrorZeroAmount()`                                 | 金额为 0                                | 检查参数                       |
| `ErrorIndexOutOfBounds()`                           | 索引越界                                | 使用有效索引                   |
| `ErrorNotAuthorized()`                              | 非授权调用者 enqueue                    | 只有 Bond/Staking 等合约可调用 |
| `ErrorZeroAddress()`                                | 地址为空                                | 检查参数                       |
| `RewardQueueMigratedAccount(address account)`       | 账户已迁移或目标账户已有状态            | 使用规范账户                   |
| `RewardQueueNotMigrationManager(address caller)`    | 非 migrationManager 调用 migrateAccount | 用 migrationManager            |
| `MigrationManagerImmutable(address currentManager)` | 重复设置不同的 migrationManager         | 保留原 manager 或一次性配置    |

---

### 调用示例

#### 查看用户全部奖励状态

js

```js
async function getUserRewardDashboard(rewardQueue, userAddress) {
  const plans = await rewardQueue.queuePlans()
  const dashboard = []

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i]
    const size = await rewardQueue.getQueuePlanSize(userAddress, i)
    const totalLocked = await rewardQueue.getRewardsWithPlanIndex(userAddress, i)
    const totalClaimable = await rewardQueue.getReleasedRewardsWithPlanIndex(userAddress, i)

    dashboard.push({
      planIndex: i,
      duration: Number(plan.releaseDuration) / 86400 + ' days',
      feeRate: Number(plan.feeRate) / 100 + '%',
      queueItems: size,
      totalLocked: ethers.formatUnits(totalLocked, 9),
      totalClaimable: ethers.formatUnits(totalClaimable, 9),
    })
  }

  const totalAllClaimable = await rewardQueue.getUserTotalClaimable(userAddress)
  console.log('Total claimable across all plans:', ethers.formatUnits(totalAllClaimable, 9), 'AGX')

  return dashboard
}
```

#### 批量领取所有计划

js

```js
async function claimAllPlans(rewardQueue, signer) {
  const planCount = await rewardQueue.queueSize()

  for (let i = 0; i < planCount; i++) {
    const claimable = await rewardQueue.getReleasedRewardsWithPlanIndex(
      await signer.getAddress(),
      i,
    )

    if (claimable > 0n) {
      console.log(`Plan ${i}: claiming ${ethers.formatUnits(claimable, 9)} AGX`)
      await (await rewardQueue.connect(signer).claimAllVestedRewards(i)).wait()
    }
  }
}
```

---

### 依赖合约

| 合约           | 用途                      |
| -------------- | ------------------------- |
| Turbine        | 接收释放后的 AGX 进行售卖 |
| BondDepository | 将奖励 enqueue            |
| LockedStaking  | 将奖励 enqueue            |
| EarlyStaking   | 将奖励 enqueue            |

### 配置参数

| 参数                | 默认值         | 说明                | 设置者     |
| ------------------- | -------------- | ------------------- | ---------- |
| Plan 0              | 5 天, 20% fee  | 快速释放            | 初始化默认 |
| Plan 1              | 20 天, 10% fee | 中等释放            | 初始化默认 |
| Plan 2              | 40 天, 5% fee  | 长期释放            | 初始化默认 |
| Plan 3              | 60 天, 1% fee  | 最长释放            | 初始化默认 |
| `authorizedCallers` | 初始化后设置   | 允许 enqueue 的合约 | owner      |
| `turbine`           | 初始化时设置   | Turbine 合约地址    | owner      |
