# LiquidStaking 合约文档

> 来源：`doc-contracts-liquidstaking`
> ABI：[`abis/liquidstaking.json`](../abis/liquidstaking.json)

## 完整 ABI

abi/LiquidStaking.json
SHA-256 44f15231da4e…
80
44
11
25

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/liquidstaking.json`](../abis/liquidstaking.json)（80 entries）。

</details>

## LiquidStaking 合约文档

### 概述

`LiquidStaking` 是 AEGIS X 的活期质押合约，用户可以将 AGX 质押到 StakingPool 并获得 sAGX 生息奖励。质押后需要经过 2 个 epoch 的预热期，之后可以随时提取本金或领取奖励。

Lucky 购买上报采用 gas 上限保护的 best-effort。价格读取或 Tracker 异常会发出 `PurchaseTrackingFailed(user,agxAmount,stage,reason)`，但不会回滚已经完成的活期质押；前端应以 `Staked` 和仓位回读判断业务成功，以该告警事件提示资格可能需要运维补查。

**部署 key**: `LiquidStaking`

**ABI 路径**: `abi/LiquidStaking.json`

---

### 关键概念

#### 1. gons 模型

sAGX 使用 gons（gons = "goes") 作为内部记账单位，用户的实际余额通过以下公式计算：

text

```text
实际余额 = balanceForGons(gons) = gons / index
gons = gonsForBalance(实际余额) = 实际余额 * index
```

- index 会随着每次 rebase 增加而增加
- 用户的 gons 数量不变，但随着 index 增加，实际余额自动增长

#### 2. 预热期（Warmup）

新质押的 AGX 进入预热状态，持续 2 个 epoch：

- 预热期内不能提取本金
- 预热期内仍然获得奖励（累积到 warmupStakes）
- 预热期结束后需要调用 claim() 将奖励合并到主仓位

#### 3. 原始账户与规范账户

- _original(user) - 返回迁移前的原始地址
- _canonical(user) - 返回迁移后的当前有效地址（兼容定义，内部未使用）
- 所有操作都使用 _stakeOwner （沿迁移链查找有效状态账户）进行状态查询

#### 4. Restake 混合模式

`claimRewardMixed()` 支持将奖励分成两部分：

- 释放部分 - 进入 RewardQueue 线性释放
- 复投部分 - 重新质押到 LockedStaking 获取更高收益

---

### 前端 API

#### 视图函数

##### getStakeRewards(user)

获取用户的待生效利息和可领取利息。

javascript

```javascript
const [warmupInterest, stakeInterest] = await liquidStaking.getStakeRewards(userAddress)
```

**返回值**:

- warmupInterest (uint256) - 预热期内的待生效利息
- stakeInterest (uint256) - 主仓位的可领取利息

##### remainingStakeAmount()

获取当前时间桶内还可质押的额度。

javascript

```javascript
const remaining = await liquidStaking.remainingStakeAmount()
```

##### timeBucket()

获取当前时间桶编号（天）。

javascript

```javascript
const bucket = await liquidStaking.timeBucket()
```

##### isWarmupExpired(user)

检查用户的预热期是否已结束。

javascript

```javascript
const expired = await liquidStaking.isWarmupExpired(userAddress)
```

---

#### 状态修改函数

##### liquidStake(stakeAmount)

质押 AGX 到 StakingPool。

javascript

```javascript
const agxAmount = ethers.parseUnits('10', 9) // 10 AGX

// 先授权 AGX
await (await agxContract.approve(LIQUID_STAKING_ADDRESS, agxAmount)).wait()

// 质押
const tx = await liquidStaking.liquidStake(agxAmount)
const receipt = await tx.wait()

// 监听事件
const event = receipt.logs.find((l) => l.fragment?.name === 'Staked')
console.log(`质押成功: ${event.args._amount}`)
```

**前置条件**:

- 用户已绑定推荐人 ( Referral.isBindReferral(user) == true )
- 未超过当日全局新增质押上限 ( stakingLimit ，按 UTC 时间桶重置)
- 未超过单地址当前未提取本金上限 ( singleAddressLimit )
- 未超过单地址日质押上限 ( singleAddressDailyLimit )

**触发事件**: `Staked(user, amount, 0, timestamp, 0, gonsDelta)`

##### claim()

将预热期的奖励合并到主仓位。

javascript

```javascript
const tx = await liquidStaking.claim()
await tx.wait()
console.log('预热奖励已合并到主仓位')
```

**前置条件**:

- 存在预热仓位 ( warmupStakes[user].exists == true )
- 预热期已结束 ( epoch >= warmupStakes[user].expiry )

##### claimPrincipal(amount)

提取指定数量的本金，进入 PrincipalReleaseVault 按当前配置锁定周期的线性释放。

javascript

```javascript
const principalAmount = ethers.parseUnits('5', 9) // 提取 5 AGX
const tx = await liquidStaking.claimPrincipal(principalAmount)
await tx.wait()
console.log('本金提取成功，进入释放队列')
```

**前置条件**:

- 存在主仓位 ( stakes[user].exists == true )
- 提取金额 > 0 且 <= 主仓位本金
- PrincipalReleaseVault 已设置

**触发事件**: `Claimed(user, amount, 0, timestamp, 0, gonsDelta)`

##### claimRewardMixed(releasePlanIndex, amount, restakePlanIndex, restakeBps)

领取奖励，可选择部分释放、部分复投。

javascript

```javascript
const releasePlanIndex = 0 // 释放计划索引（对应 RewardQueue 中的 vesting plan）
const rewardAmount = ethers.parseUnits('10', 9) // 领取 10 AGX 奖励
const restakePlanIndex = 1 // 复投计划索引（对应 LockedStaking 中的锁仓计划）
const restakeBps = 5000 // 50% 复投（BPS = basis points, 10000 = 100%）

const tx = await liquidStaking.claimRewardMixed(
  releasePlanIndex,
  rewardAmount,
  restakePlanIndex,
  restakeBps,
)
const receipt = await tx.wait()

// 解析事件获取详细信息
const event = receipt.logs.find((l) => l.fragment?.name === 'RewardClaimedMixed')
if (event) {
  console.log(`总奖励: ${ethers.formatUnits(event.args._reward, 9)} AGX`)
  console.log(`释放金额: ${ethers.formatUnits(event.args._releaseAmount, 9)} AGX`)
  console.log(`复投金额: ${ethers.formatUnits(event.args._restakeAmount, 9)} AGX`)
  console.log(`所需贡献点: ${event.args._requiredContribution}`)
}
```

**前置条件**:

- 存在主仓位
- 奖励金额 > 0
- 奖励金额 <= 可用利息余额
- 如果复投金额 > 0，则 restakeConfig 必须已设置，复投目标地址由 RestakeConfig plan 决定（ RestakeLib.calculateRestake 返回的 r.target ）

**触发事件**:

- RestakeClaimed(user, reward, restakeAmount, taxBP, planIndex, period, 0, timestamp, gonsDelta)
- RewardClaimedMixed(user, reward, releaseAmount, restakeAmount, ...)

---

### 事件

#### Staked

用户质押 AGX 时触发。

solidity

```solidity
event Staked(
  address indexed _user,
  uint256 _amount,
  uint256 stakeIndex,
  uint256 timestamp,
  uint256 periodTime,
  int256 gonsDelta
)
```

#### Claimed

用户提取本金时触发。

solidity

```solidity
event Claimed(
  address indexed _user,
  uint256 _amount,
  uint256 stakeIndex,
  uint256 timestamp,
  uint256 periodTime,
  int256 gonsDelta
)
```

#### RewardClaimedMixed

用户领取混合奖励时触发。

solidity

```solidity
event RewardClaimedMixed(
  address indexed _user,
  uint256 _reward,
  uint256 _releaseAmount,
  uint256 _restakeAmount,
  uint8 _releasePlanIndex,
  uint256 _restakePlanIndex,
  uint256 _restakeBps,
  uint256 _requiredContribution,
  uint256 stakeIndex,
  uint256 timestamp,
  int256 gonsDelta
)
```

---

### 错误码

| 错误                                 | 原因                 | 解决方案                         |
| ------------------------------------ | -------------------- | -------------------------------- |
| `ErrorStakeAmount()`                 | 质押金额为 0         | 确保金额 > 0                     |
| `ErrorStakeNotApproved()`            | 未绑定推荐人         | 先调用 `Referral.bindReferral()` |
| `ErrorStakeAmountLimit()`            | 超过质押上限         | 检查 `remainingStakeAmount()`    |
| `ErrorStakeNotExists()`              | 不存在质押仓位       | 先进行质押                       |
| `ErrorStakeWarmupNotEnded()`         | 预热期未结束         | 等待足够 epoch                   |
| `ErrorStakeAmountExceedsBalance()`   | 提取金额超过余额     | 减少提取金额                     |
| `ErrorStakeAmountExceedsInterest()`  | 提取金额超过可用利息 | 减少提取金额                     |
| `ErrorStakeInterestAmountZero()`     | 利息为 0             | 等待 rebase 积累利息             |
| `ErrorAlreadyMigrated()`             | 账户已迁移           | 使用迁移后的新地址               |
| `ErrorPrincipalReleaseVaultNotSet()` | 本金释放保险库未设置 | 联系管理员配置                   |

---

### 调用示例

#### 完整质押流程

javascript

```javascript
import { ethers } from 'ethers'

// 初始化
const provider = new BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const userAddress = await signer.getAddress()

const liquidStaking = new Contract(LIQUID_STAKING_ADDRESS, LIQUID_STAKING_ABI, signer)
const agx = new Contract(AGX_ADDRESS, AGX_ABI, signer)

// 1. 检查是否已绑定推荐人
const referral = new Contract(REFERRAL_ADDRESS, REFERRAL_ABI, signer)
const isBound = await referral.isBindReferral(userAddress)
if (!isBound) {
  console.error('请先绑定推荐人')
  return
}

// 2. 检查 AGX 余额
const balance = await agx.balanceOf(userAddress)
const stakeAmount = ethers.parseUnits('10', 9) // 10 AGX
if (balance < stakeAmount) {
  console.error('AGX 余额不足')
  return
}

// 3. 检查质押上限
const remaining = await liquidStaking.remainingStakeAmount()
if (remaining < stakeAmount) {
  console.error('已达到质押上限')
  return
}

// 4. 授权并质押
await (await agx.approve(LIQUID_STAKING_ADDRESS, stakeAmount)).wait()
const tx = await liquidStaking.liquidStake(stakeAmount)
const receipt = await tx.wait()

console.log('质押成功！')

// 5. 监控预热状态
const checkWarmup = async () => {
  const expired = await liquidStaking.isWarmupExpired(userAddress)
  if (expired) {
    console.log('预热期已结束，可以领取奖励')
    const claimTx = await liquidStaking.claim()
    await claimTx.wait()
  } else {
    console.log('仍在预热中...')
    setTimeout(checkWarmup, 60000) // 每分钟检查一次
  }
}
checkWarmup()
```

#### 领取混合奖励

javascript

```javascript
async function claimMixedReward() {
  const [warmupInterest, stakeInterest] = await liquidStaking.getStakeRewards(userAddress)

  if (stakeInterest === 0n) {
    console.log('暂无可领取奖励')
    return
  }

  // 决定释放/复投比例
  const releasePercent = 40 // 40% 释放
  const restakePercent = 60 // 60% 复投

  const releaseAmount = (stakeInterest * BigInt(releasePercent)) / 100n
  const restakeBps = BigInt(restakePercent * 100) // 转换为 BPS

  const tx = await liquidStaking.claimRewardMixed(
    0, // releasePlanIndex (默认计划)
    releaseAmount,
    1, // restakePlanIndex (LockedStaking 的某个计划)
    restakeBps,
  )
  const receipt = await tx.wait()

  console.log('奖励领取成功！')
}
```

---

### 依赖合约

| 合约                    | 用途           |
| ----------------------- | -------------- |
| `StakingPool`           | 实际质押池     |
| `sAGX`                  | 生息代币       |
| `AGX`                   | 质押代币       |
| `Referral`              | 推荐系统验证   |
| `RewardQueue`           | 奖励线性释放   |
| `LockedStaking`         | 复投目标       |
| `PrincipalReleaseVault` | 本金释放保险库 |
| `RestakeConfig`         | Restake 配置   |
| `DailyPurchaseTracker`  | 购买记录追踪   |

---

### 配置参数

| 参数                      | 默认值      | 说明                                       |
| ------------------------- | ----------- | ------------------------------------------ |
| `warmupEpochs`            | 2           | 预热期 epoch 数                            |
| `stakingLimit`            | 10000 * 1e9 | 每日全局新增质押上限，次日使用新时间桶     |
| `singleAddressLimit`      | 50 * 1e9    | 单地址当前本金上限，提取本金后恢复相应额度 |
| `singleAddressDailyLimit` | 50 * 1e9    | 单地址日质押上限                           |

这些参数可通过管理员函数修改：

- setStakingLimitAmount(limit, singleLimit)
- setSingleAddressDailyLimit(singleDailyLimit)

部署配置可通过 `LIQUID_STAKING_DAILY_GLOBAL_LIMIT`、 `LIQUID_STAKING_SINGLE_ADDRESS_LIMIT` 和 `LIQUID_STAKING_SINGLE_ADDRESS_DAILY_LIMIT` 分别设置上述三项；数值均使用 AGX 最小单位（9 位精度）。
