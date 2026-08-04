# EarlyStaking 合约文档

> 来源：`doc-contracts-earlystaking`
> ABI：[`abis/earlystaking.json`](../abis/earlystaking.json)

## 完整 ABI

abi/EarlyStaking.json
SHA-256 d1c386abec78…
70
34
10
26

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/earlystaking.json`](../abis/earlystaking.json)（70 entries）。

</details>

## EarlyStaking 合约文档

### 概述

`EarlyStaking` 是 AEGIS X 的预售用户专属质押合约。管理员批量为预售用户质押 AGX，每个用户只有一个仓位。本金按 `periodTime` 线性释放，利息可以通过混合模式领取。与 LockedStaking 不同，EarlyStaking 由管理员批量操作，用户不能自行质押。

**部署 key**: `EarlyStaking`

**ABI 路径**: `abi/EarlyStaking.json`

---

### 关键概念

#### 1. 管理员批量质押

- 只有 ADMIN_ROLE 可以调用 earlyStake()
- 批量为多个用户创建质押仓位
- 每个用户只能有一个仓位（ stakes[user].exists 检查）

#### 2. 单一仓位模型

与 LockedStaking 的多仓位不同，EarlyStaking 每用户只有一个仓位：

- stakes[address] 直接映射，非数组
- 无需索引参数

#### 3. 与 LockedStaking 的差异

| 特性     | EarlyStaking   | LockedStaking                                                     |
| -------- | -------------- | ----------------------------------------------------------------- |
| 质押方式 | 管理员批量操作 | 用户自行质押                                                      |
| 仓位数量 | 每用户 1 个    | 每用户多个                                                        |
| 索引参数 | 不需要         | 需要                                                              |
| 推荐检查 | 不需要         | 需要                                                              |
| 质押限制 | 无             | 可选 UTC 日全局新增 + 单 root 历史累计；任一值为 0 时对应门禁关闭 |
| 额外利息 | 无             | 有                                                                |

#### 4. 线性释放

与 LockedStaking 相同的本金释放机制：

- claimPrincipal() 领取按 Early 周期已释放的本金，并在 PrincipalReleaseVault 创建按当前配置锁定周期的新释放单；不会直接转入钱包，PRV 未配置时交易回滚
- claimRewardMixed() 领取利息

---

### 前端 API

#### 视图函数

##### getStake(address) -> (StakeData)

获取用户的质押数据。

**StakeData 返回值:**

- pending - 待释放本金
- blockReward - 区块利息
- extraInterest - 0（EarlyStaking 无额外利息）
- claimableBalance - 可领取本金
- expiry - 到期时间

js

```js
const stake = await earlyStaking.getStake(userAddress)
console.log('Pending:', ethers.formatUnits(stake.pending, 9), 'AGX')
console.log('Block reward:', ethers.formatUnits(stake.blockReward, 9), 'AGX')
console.log('Claimable:', ethers.formatUnits(stake.claimableBalance, 9), 'AGX')
console.log('Expires:', new Date(Number(stake.expiry) * 1000).toLocaleDateString())
```

##### getReleasedPrincipal(address) -> (uint256)

获取用户可领取的本金数量。

js

```js
const claimable = await earlyStaking.getReleasedPrincipal(userAddress)
console.log('Claimable principal:', ethers.formatUnits(claimable, 9), 'AGX')
```

##### getUserLockedPrincipal(address) -> (uint256)

获取用户的锁定本金。

js

```js
const locked = await earlyStaking.getUserLockedPrincipal(userAddress)
console.log('Locked principal:', ethers.formatUnits(locked, 9), 'AGX')
```

##### 管理员视图

js

```js
const periodTime = await earlyStaking.periodTime()
const status = await earlyStaking.status()
const token = await earlyStaking.token()
const sToken = await earlyStaking.sToken()
```

---

#### 状态修改函数

##### claimPrincipal()

领取按 Early 锁仓周期已释放的本金，并在 PrincipalReleaseVault 创建按当前配置锁定周期的线性释放单；本次调用不会让钱包 AGX 立即增加。

js

```js
async function claimEarlyPrincipal(earlyContract, signer) {
  const user = await signer.getAddress()

  // 1. 检查可领取金额
  const claimable = await earlyContract.getReleasedPrincipal(user)
  if (claimable === 0n) {
    console.log('No principal to claim yet')
    return
  }

  // 2. 领取
  const tx = await earlyContract.connect(signer).claimPrincipal()
  const receipt = await tx.wait()

  console.log('Principal release created in PRV:', ethers.formatUnits(claimable, 9), 'AGX')
}
```

##### claimRewardMixed(uint256 amount, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)

领取利息。

js

```js
async function claimEarlyReward(earlyContract, signer) {
  const user = await signer.getAddress()
  const stake = await earlyContract.getStake(user)

  if (stake.blockReward === 0n) {
    console.log('No reward to claim')
    return
  }

  const tx = await earlyContract.connect(signer).claimRewardMixed(
    stake.blockReward, // 全部利息
    1, // 20 天释放
    0, // 复投计划
    5000, // 50% 复投
  )
  await tx.wait()
  console.log('Reward claimed')
}
```

##### earlyStake(address[] calldata _users, uint256[] calldata _amounts)

ADMIN_ROLE 批量为预售用户质押（源码 `earlyStake`，:251）。`_users.length != _amounts.length` revert `ErrorInvalidData`；合约关闭时 revert `ErrorNotAllowed`；任一用户已迁移（`migratedTo != 0`）revert `EarlyStakingMigratedAccount`；root 已有仓位（`stakes[_orig].exists`）revert `ErrorAlreadyExists`。循环内累加总额并写入每用户单一仓位，最后一次性 `safeIncreaseAllowance` + `IStakingPool.presaleStake(total, address(this))`；`presaleStake` 返回 false 时 revert `ErrorStakeFailure`。每用户触发 `Staked`。

---

### 事件

#### Staked(address indexed user, uint256 amount, uint256 stakeIndex, uint256 timestamp, uint256 periodTime, int256 gonsDelta)

管理员批量质押时触发。

#### Claimed(address indexed user, uint256 amount, uint256 stakeIndex, uint256 timestamp, uint256 periodTime, int256 gonsDelta)

领取本金时触发。

#### RewardClaimed(...) / RewardClaimedMixed(...)

领取利息时触发。

---

### 错误码

| 错误                                                | 原因                                                 | 解决方案                              |
| --------------------------------------------------- | ---------------------------------------------------- | ------------------------------------- |
| `ErrorStakeNotExist()`                              | 用户未质押                                           | 等待管理员批量操作                    |
| `ErrorNoPrincipal()`                                | 无本金可领取                                         | 等待释放                              |
| `ErrorPrincipalExceeds()`                           | 提取超过利息                                         | 减少金额                              |
| `ErrorAmountExceeds()`                              | 金额超过可用余额                                     | 减少金额                              |
| `ErrorInsufficientBalance()`                        | 合约余额不足                                         | 联系管理员                            |
| `ErrorAlreadyExists()`                              | 用户已有仓位                                         | 无法重复质押                          |
| `ErrorNotAllowed()`                                 | 合约已关闭                                           | 等待管理员开启                        |
| `ErrorAmountZero()`                                 | 质押金额为 0                                         | 增加金额                              |
| `ErrorInvalidData()`                                | `earlyStake` 的 `_users.length != _amounts.length`   | 对齐两个数组长度                      |
| `ErrorStakeFailure()`                               | 底层 `presaleStake` 返回 false                       | 检查 StakingPool 状态与额度           |
| `ErrorZeroAddress()`                                | 传入 address(0)                                      | 传入有效地址                          |
| `ErrorPrincipalReleaseVaultNotSet()`                | 未配置 PrincipalReleaseVault 时调用 `claimPrincipal` | 先 `setPrincipalReleaseVault`         |
| `EarlyStakingMigratedAccount(address account)`      | `earlyStake`/`migrateAccount` 涉及已迁移地址         | 使用 canonical 地址或未参与过的新地址 |
| `EarlyStakingNotMigrationManager(address caller)`   | 非 migrationManager 调用 `migrateAccount`            | 仅由迁移管理器调用                    |
| `MigrationManagerImmutable(address currentManager)` | 已设非零 manager 后改成不同地址                      | 保留相同地址                          |

---

### 调用示例

#### 用户查看与领取

js

```js
async function checkEarlyStaking(earlyContract, userAddress) {
  const stake = await earlyContract.getStake(userAddress)

  if (stake.pending === 0n) {
    console.log('No early staking found')
    return null
  }

  console.log('=== Early Staking ===')
  console.log('Pending principal:', ethers.formatUnits(stake.pending, 9), 'AGX')
  console.log('Block reward:', ethers.formatUnits(stake.blockReward, 9), 'AGX')
  console.log('Claimable principal:', ethers.formatUnits(stake.claimableBalance, 9), 'AGX')
  console.log('Expires:', new Date(Number(stake.expiry) * 1000).toLocaleDateString())

  return stake
}
```

---

### 账户迁移

EarlyStaking 使用 root 别名读取历史仓位，不复制 `stakes` 数据。`everHadAccountState` 在首次 `earlyStake` 时永久标记 root；即使本金已经全部领取、`exists` 已变为 false，该历史使用过的地址也不能作为新的迁移目标。`migrationManager` 首次配置后不可替换，只能由统一 Manager 执行 A→B→C。

---

### 依赖合约

| 合约                  | 用途                                                               |
| --------------------- | ------------------------------------------------------------------ |
| StakingPool           | 底层质押                                                           |
| sAGX                  | 生息代币                                                           |
| RewardQueue           | 利息释放                                                           |
| RestakeConfig         | 复投配置                                                           |
| PrincipalReleaseVault | 必需；本金提取统一创建按配置周期锁定的线性释放单，未配置时交易回滚 |

### 配置参数

| 参数                    | 默认值       | 说明                                                                       | 设置者     |
| ----------------------- | ------------ | -------------------------------------------------------------------------- | ---------- |
| `periodTime`            | 初始化时设置 | 锁定期（秒）                                                               | ADMIN_ROLE |
| `status`                | true         | 是否开放                                                                   | ADMIN_ROLE |
| `stakingPool`           | 初始化后设置 | 质押池地址                                                                 | ADMIN_ROLE |
| `rewardQueue`           | 初始化后设置 | 奖励队列                                                                   | ADMIN_ROLE |
| `restakeConfig`         | 初始化后设置 | 复投配置（`setRestakeConfig`）                                             | ADMIN_ROLE |
| `principalReleaseVault` | 初始化后设置 | 本金释放金库（`setPrincipalReleaseVault`），未设置时 `claimPrincipal` 回滚 | ADMIN_ROLE |
