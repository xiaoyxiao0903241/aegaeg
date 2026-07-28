# AegisLuckyPool 合约文档

> 来源：`doc-contracts-aegisluckypool`
> ABI：[`abis/aegisluckypool.json`](../abis/aegisluckypool.json)

## 完整 ABI

abi/AegisLuckyPool.json
SHA-256 4faee3bcf161…
155
76
32
47

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegisluckypool.json`](../abis/aegisluckypool.json)（155 entries）。

</details>

## AegisLuckyPool 合约文档

### 概述

`AegisLuckyPool` 是 AEGIS X 的彩票奖池合约。Chainlink VRF v2.5 负责生成和回调随机数；项目自建 keeper 每 1～5 分钟检查轮次并触发关轮。用户通过购买/质押等行为获得参与资格，VRF 回调确定中奖名单，中奖者随后手动领取奖励。

生产配置每轮固定为 `86,400` 秒（24 小时）。首轮显式开始时间必须晚于部署区块；本轮计划使用 `1784851200`（北京时间 2026-07-24 08:00），部署预检还要求至少保留 2 小时提前量。后续轮次始终以上一轮 `endTime` 为锚点，不会因为 Keeper 延迟而漂移。

**合约地址 key**: `LuckyPool`（生产固定使用本轮主网累计快照或其已审批不可变副本，不运行时扫描目录）

**BNB Chain 主网 proxy**：本轮重新部署，以最终完整 manifest 为准。

**ABI 路径**: `abi/AegisLuckyPool.json`

---

### 关键概念

#### 1. 奖池轮次（Round）

每轮彩票有独立的状态：

- None → Open → RandomRequested → Drawn / Cancelled
- 每轮有独立的参与者列表、获奖者列表、奖励金额
- 轮次由无 owner 权限的自建 keeper 调用 checkUpkeep -> performUpkeep 推进；有资格用户时请求 VRF，零资格时以 0 人中奖自动跳过

#### 2. 参与资格

- 用户通过 AegisDailyPurchaseTracker 记录购买行为
- 正常窗口由 purchaseTracker 调用 addEligibleUser(roundId, user) 添加参与者
- Tracker v3 在 Pool 暂停/异常时保存资格，恢复后调用 syncEligibleUser(roundId,user,purchaseAt) 按原购买时间补写
- 每轮只能被添加一次
- addEligibleUser 必须在实时窗口内； syncEligibleUser 可在窗口结束后执行，但原 purchaseAt 必须位于该轮 [startTime,endTime) 且该轮仍为当前 Open 轮
- 当前轮 pending 未清零或 Tracker backlog 不可读时，keeper 与直接关轮入口都不能推进该轮；无法归属到当前轮的全局 deferred 会保留给运维处理，但不会锁死无关轮次
- 每笔 Tracker 购买都会在 gas 安全范围内尝试 checkUpkeep/performUpkeep ；Keeper 仍是没有新购买时的兜底

#### 3. Chainlink VRF 开奖

- 轮次结束后由 keeper 触发 VRF 随机数请求
- 最多 NUM_WORDS = 10 个随机数 → 最多 10 名获奖者
- 使用 Fisher-Yates 洗牌算法确保无重复获奖者
- VRF_TIMEOUT_BLOCKS = 600 只保留为废弃兼容/告警参考；不得取消或重新请求在途随机数

#### 4. 奖励分配

- defaultRewardAmount - 新轮 Open 阶段的每位中奖者 USD1 价值目标（变量名为历史兼容命名）
- defaultMaxWinners - 最大获奖者数量
- 关轮时按实时 AGX/USD1 价格把价值目标向上取整为 AGX，并按 rewardAmount * min(eligibleCount, maxWinners) 锁定
- VRF 回调只记录中奖者和待领奖励，不转账；中奖者必须调用 claimRewardMixed

---

### 前端 API

#### 视图函数

##### getRound(uint256 roundId) -> (Round)

获取指定轮次的完整信息。

**Round 返回值:**

- roundId - 轮次 ID
- displayDay - 展示日编号
- startTime - 开始时间
- endTime - 结束时间
- rewardAmount - 每位获奖者奖励
- rewardPerWinner - 实际每位获奖金额
- maxWinners - 最大获奖者数
- requestId - VRF 请求 ID
- eligibleCount - 参与人数
- winnerCount - 获奖者数
- randomRequestBlock - VRF 请求区块
- status - 轮次状态

js

```js
const statusNames = ['None', 'Open', 'RandomRequested', 'Drawn', 'Cancelled']

async function displayRound(luckyPool, roundId) {
  const round = await luckyPool.getRound(roundId)
  console.log(`Round #${round.roundId} (Day ${round.displayDay})`)
  console.log(`Status: ${statusNames[round.status]}`)
  console.log(
    `Time: ${new Date(Number(round.startTime) * 1000).toLocaleString()} - ${new Date(Number(round.endTime) * 1000).toLocaleString()}`,
  )
  console.log(`Eligible: ${round.eligibleCount}`)
  console.log(`Winners: ${round.winnerCount} / ${round.maxWinners}`)
  const rewardDecimals = round.status === 1n ? 18 : 9
  const rewardUnit = round.status === 1n ? 'USD1 value target' : 'AGX locked'
  console.log(
    `Reward per winner: ${ethers.formatUnits(round.rewardAmount, rewardDecimals)} ${rewardUnit}`,
  )
}
```

##### roundCount() -> (uint256)

返回总轮次数。

js

```js
const count = await luckyPool.roundCount()
console.log('Total rounds:', count)
```

##### getRoundIds(uint256 offset, uint256 limit) -> (uint256[])

分页获取轮次 ID 列表。

js

```js
const roundIds = await luckyPool.getRoundIds(0, 10)
console.log('Latest 10 rounds:', roundIds)
```

##### currentRoundId() -> (uint256)

返回当前开放轮次 ID。

js

```js
const current = await luckyPool.currentRoundId()
console.log('Current round:', current)
```

##### eligibleCount(uint256 roundId) -> (uint256)

返回指定轮次的参与人数。

js

```js
const count = await luckyPool.eligibleCount(roundId)
console.log('Eligible users:', count)
```

##### getEligibleUsers(uint256 roundId, uint256 offset, uint256 limit) -> (address[])

分页获取参与者地址列表。

js

```js
const users = await luckyPool.getEligibleUsers(roundId, 0, 20)
console.log('First 20 eligible:', users)
```

##### winnerCount(uint256 roundId) -> (uint256)

返回指定轮次的获奖者数量。

##### getWinners(uint256 roundId) -> (address[])

获取指定轮次的全部获奖者地址。

js

```js
const winners = await luckyPool.getWinners(roundId)
console.log('Winners:', winners)
```

##### getWinnerInfo(uint256 roundId, address user) -> (bool won, uint256 rewardAmount)

查询用户是否获奖及奖励金额。

js

```js
const [won, reward] = await luckyPool.getWinnerInfo(roundId, userAddress)
if (won) {
  console.log('Winner! Reward:', ethers.formatUnits(reward, 9), 'AGX')
} else {
  console.log('Not a winner')
}
```

##### isEligible(uint256 roundId, address user) -> (bool)

`isEligible` 是 public mapping getter（`mapping(uint256 => mapping(address => bool))`），只读取该地址本身的布尔位，**不解析账户迁移别名**。对已迁移账户（A→B→C 中 A/B）查询会返回 false。

js

```js
const eligible = await luckyPool.isEligible(roundId, userAddress)
console.log('Eligible:', eligible)
```

##### isUserEligible(uint256 roundId, address user) -> (bool)

迁移感知视图（源码 `isUserEligible`，内部走 `_original` 链 + `MigrationAliasLib.next` 遍历 `_originalOf`/`migratedTo` 别名）。前端应优先使用本视图而非 `isEligible`：对 A→B→C 迁移链，从 C 查询会沿 root 链回溯命中 A 的资格位。受 `migrationManager.maxMigrationHops`（默认 8）约束。

js

```js
const eligible = await luckyPool.isUserEligible(roundId, userAddress)
console.log('Eligible (migration-aware):', eligible)
```

##### getRandomWords(uint256 roundId) -> (uint256[])

获取指定轮次的 VRF 随机数（开奖后可用）。

js

```js
const words = await luckyPool.getRandomWords(roundId)
console.log('Random words:', words)
```

##### rewardReserve() -> (uint256)

返回合约中的奖励代币余额。

js

```js
const reserve = await luckyPool.rewardReserve()
console.log('Reward reserve:', ethers.formatUnits(reserve, 9), 'AGX')
```

##### quoteRewardAgx(uint256 rewardValueUsd1) -> (uint256)

view 函数。按当前 `restakeConfig` 提供的 `agxPrice()`，把 USD1 价值目标向上取整换算为 AGX 锁定额（`Math.mulDiv(rewardValueUsd1, 1e9, price, Ceil)`）。`rewardValueUsd1=0` revert `ErrorZeroAmount`；`restakeConfig` 未设置 revert `ErrorRestakeConfigNotSet`；`agxPrice=0` revert `ErrorInvalidAgxPrice`。前端可用它在关轮前预估每位中奖者的 AGX 奖励。

js

```js
const rewardValueUsd1 = ethers.parseUnits('10', 18)
const agx = await luckyPool.quoteRewardAgx(rewardValueUsd1)
console.log('Locked AGX per winner:', ethers.formatUnits(agx, 9))
```

##### 管理员视图

js

```js
const defaults = await Promise.all([
  luckyPool.defaultRewardAmount(),
  luckyPool.defaultRoundDuration(),
  luckyPool.defaultMaxWinners(),
])
console.log('Reward target in USD1:', ethers.formatUnits(defaults[0], 18))
console.log('Round duration:', Number(defaults[1]) / 3600, 'hours')
console.log('Max winners:', defaults[2])

const paused = await luckyPool.paused()
```

---

#### 状态修改函数

##### setDefaults(uint256 rewardValueUsd1, uint256 roundDuration, uint256 maxWinners)

owner 设置新轮次的默认参数：`rewardValueUsd1` 为每位中奖者的 USD1 价值目标，`roundDuration` 为轮次时长（秒），`maxWinners` 为最大获奖者数（须 `1..=NUM_WORDS(10)`）。零值或 `maxWinners > 10` revert `ErrorZeroAmount` / `ErrorInvalidMaxWinners`。仅影响此后创建的轮次，不动当前轮。触发 `DefaultsUpdated`。

##### setCurrentRoundRewardValueUsd1(uint256 rewardValueUsd1)

owner 校正当前 Open 轮次的 USD1 价值目标。用于把升级前存储为裸 AGX 数额的遗留 Open 轮次纠正为 USD1 定价。`rewardValueUsd1=0` revert `ErrorZeroAmount`；当前轮非 `Open` revert `ErrorInvalidRoundStatus`。若 `rewardValuePricingEnabled` 此前为 false，会顺带置 true 并触发 `RewardValuePricingEnabled`；同时触发 `CurrentRoundRewardValueUsd1Updated`。

##### migrateLegacyRequestCoordinatorBindings(uint256 maxRounds)

代理升级专用的 owner 分页迁移。必须先暂停 LuckyPool；函数扫描历史轮次，把升级前仍为 `RandomRequested` 的请求绑定到升级时的 Coordinator。迁移完成前，`setVrfConfig` 不能切换 Coordinator。全新部署的 `legacyRequestBindingComplete` 初始化为 `true`，无需执行。

##### keeper：checkUpkeep(bytes) / performUpkeep(bytes)

`checkUpkeep("0x")` 是只读检查，返回 `(upkeepNeeded, performData)`。自建 keeper 只在 `upkeepNeeded=true` 时原样传递 `performData` 调用 `performUpkeep`。

`performUpkeep` 没有 `onlyKeeper` 或 `onlyOwner`，只有 `nonReentrant`、`whenNotPaused` 和内部轮次/时间校验。有资格用户时继续执行价格、奖池和 VRF 请求校验；零资格时直接跳过。keeper 不需要任何权限，也不应持有 owner 私钥。

Tracker backlog 可读且 `pendingQualificationCount(currentRoundId)==0` 时，零资格过期轮的 `checkUpkeep` 同样返回 `true`。否则返回 false；直接关轮和 owner 取消入口也会回滚。全局 `unresolvedDeferredPurchaseCount()` 不阻塞无关当前轮，但运维必须及时归属或丢弃。当前轮 pending 清零后，`performUpkeep` 会把空轮标记为 `Drawn`，记录 0 人中奖和 0 奖励，触发 `RoundSkipped`，不请求 VRF，然后创建下一轮。`cancelCurrentAndCreateNextRound()` 仅保留为 owner 主动取消当前空轮的兼容入口；`closeCurrentAndRequestRandomness()` 是 permissionless 应急推进入口，不是脚本的常规调用路径。

##### syncEligibleUser(uint256 roundId, address user, uint256 purchaseAt)

仅 `purchaseTracker` 可调用。用于补同步 Tracker v3 已在原窗口记录、但因 Pool 暂停或异常未及时写入的资格。目标必须仍为当前 Open 轮，`purchaseAt` 必须落在该轮原始 `[startTime,endTime)`；允许实际调用时间晚于 `endTime`。重复同步保持幂等并发出 `EligibleUserSynchronized(..., alreadyEligible=true)`。

##### depositRewards(uint256 amount)

向奖池注入奖励代币。

**前提条件:**

- amount > 0
- 调用者有足够的奖励代币
- 调用者已授权奖励代币

js

```js
async function depositRewards(luckyPool, tokenContract, amount, signer) {
  // 1. 授权
  await (await tokenContract.approve(await luckyPool.getAddress(), amount)).wait()

  // 2. 注入
  const tx = await luckyPool.connect(signer).depositRewards(amount)
  await tx.wait()

  const reserve = await luckyPool.rewardReserve()
  console.log('Deposited! New reserve:', ethers.formatUnits(reserve, 9), 'AGX')
}
```

##### claimRewardMixed(uint256 roundId, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)

中奖者手动领取已开奖的幸运奖，与 rebase/DAO/Bond 的 Mixed 领奖一致：按贡献值系数消费贡献值、释放部分入 RewardQueue 线性释放、复投部分进 LockedStaking 并扣税。

**前提条件**:

- restakeConfig 与 rewardQueue 已由 owner 设置（否则 revert ErrorRestakeConfigNotSet / ErrorRewardQueueNotSet ）。
- 当前地址是中奖者（ isWinner ），否则 ErrorNotWinner 。
- 尚未领取，否则 ErrorRewardAlreadyClaimed 。
- 中奖者贡献值足够覆盖 rewardAmount / contributionDivisor ，否则 revert ErrorInsufficientContribution 。

**处理流程**:

1. RestakeLib.splitReward 按 restakeBps 把 winnerReward 拆成 releaseAmount + restakeAmount 。
2. RestakeLib.consumeContribution 按贡献值系数消费贡献值（不足 revert）。
3. 标记 rewardClaimed = true ，扣减 reservedRewards 。
4. 释放部分 _enqueueRelease ：按 RewardQueue.queuePlanInfo(releasePlanIndex) 的 feeRate 扣手续费转 feeRecipient ，剩余 enqueueReward 进入用户释放队列。
5. 复投部分 RestakeLib.calculateRestake ： safeIncreaseAllowance 后 LockedStaking.lockedStake ，税费转 taxReceiver 。
6. 触发 LuckyRewardReleased / LuckyRestakeClaimed / LuckyRewardClaimedMixed + RewardClaimed / RewardPaid 。

账户迁移采用 root 别名模型，统一 Manager 的 `maxMigrationHops` 默认 8 且可在暂停迁移时配置。A→B→C 后 B/C 都以 A 为 root，历史资格、中奖与 claimed 状态不复制数组；A、B 停用，仅 C 可以继续查询和领取。自迁移、回迁、环和脏目标地址会被拒绝。

js

```js
// restakeBps: 0 = 全部释放, 10000 = 全部复投
async function claimLuckyRewardMixed(
  luckyPool,
  roundId,
  signer,
  releasePlanIndex = 0,
  restakePlanIndex = 0,
  restakeBps = 5000n,
) {
  const [won, reward] = await luckyPool.getWinnerInfo(roundId, await signer.getAddress())
  if (!won) {
    console.log('Not a winner')
    return
  }
  try {
    const tx = await luckyPool
      .connect(signer)
      .claimRewardMixed(roundId, releasePlanIndex, restakePlanIndex, restakeBps)
    await tx.wait()
    console.log('Reward claimed (mixed):', ethers.formatUnits(reward, 9), 'AGX')
  } catch (err) {
    if (err.message?.includes('ErrorRewardAlreadyClaimed')) {
      console.log('Reward already claimed')
    } else if (err.message?.includes('ErrorInsufficientContribution')) {
      console.log('Contribution insufficient — 用户需先通过 AgxContributionSwap.convert 获取贡献值')
    } else {
      throw err
    }
  }
}
```

---

### 事件

#### RoundCreated(uint256 indexed roundId, uint256 displayDay, uint256 startTime, uint256 endTime, uint256 rewardAmount, uint256 maxWinners)

新轮次创建时触发。

#### EligibleUserAdded(uint256 indexed roundId, address indexed user, uint256 eligibleCount)

用户被添加为参与者时触发。

#### EligibleUserSynchronized(uint256 indexed roundId, address indexed user, uint256 purchaseAt, bool alreadyEligible)

Tracker v3 补同步资格时触发。`purchaseAt` 是原购买区块时间，`alreadyEligible` 表示该 root 已经在名单中，因此本次未重复增加人数。

#### RoundSkipped(uint256 indexed roundId)

已到期轮次没有任何合格用户时触发。该轮以 `Drawn`、0 人中奖、0 奖励完成，不会请求 VRF。

#### RandomnessRequested(uint256 indexed roundId, uint256 indexed requestId)

请求 VRF 随机数时触发。

#### RandomnessFulfilled(uint256 indexed roundId, uint256 indexed requestId)

VRF 回调完成时触发。

#### WinnerSelected(uint256 indexed roundId, address indexed winner, uint256 winnerSlot, uint256 eligibleIndex, uint256 rewardAmount)

选出获奖者时触发。

js

```js
luckyPool.on('WinnerSelected', (roundId, winner, slot, index, reward) => {
  console.log(`Round #${roundId}: ${winner} wins slot #${slot}!`)
  console.log(`  Prize: ${ethers.formatUnits(reward, 9)} AGX`)
})
```

#### RewardClaimed(uint256 indexed roundId, address indexed winner, uint256 amount)

`claimRewardMixed` 完成时触发。

#### LuckyRewardClaimedMixed(address indexed user, uint256 indexed roundId, uint256 amount, uint256 releaseAmount, uint256 restakeAmount, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps, uint256 requiredContribution, uint256 timestamp)

混合领奖主事件：记录本次领取的总额、释放额、复投额、两个 planIndex、复投比例和消费的贡献值。

#### LuckyRewardReleased(address indexed user, uint256 indexed roundId, uint256 releaseAmount, uint8 releasePlanIndex, uint256 timestamp)

释放部分入 RewardQueue 时触发。

#### LuckyRestakeClaimed(address indexed user, uint256 indexed roundId, uint256 restakeAmount, uint256 finalRestakeAmount, uint256 taxBP, uint256 restakePlanIndex, uint256 period, uint256 timestamp)

复投部分进入 LockedStaking 时触发。

#### RestakeConfigUpdated(address indexed oldConfig, address indexed newConfig) / RewardQueueUpdated(address indexed oldQueue, address indexed newQueue)

owner 更新复投配置 / 释放队列时触发。

#### LegacyRequestCoordinatorBound(...) / LegacyRequestBindingProgress(...)

代理升级后分页迁移旧 VRF 请求时触发，分别记录单个请求绑定和整体扫描进度。

#### RewardDeposited(address indexed depositor, uint256 amount)

奖励注入时触发。

#### RoundCancelled(uint256 indexed roundId)

owner 主动取消当前空轮次时触发；正常的零资格自动推进触发 `RoundSkipped`。

`RoundTimeoutCancelled(uint256 indexed roundId, uint256 blocksElapsed)` 是废弃的 ABI 兼容事件，当前实现不再触发。

#### CurrentRoundRewardValueUsd1Updated(uint256 indexed roundId, uint256 oldValue, uint256 newValue)

owner 调用 `setCurrentRoundRewardValueUsd1` 校正当前 Open 轮次 USD1 价值目标时触发。

#### LuckyRewardAmountLocked(uint256 indexed roundId, uint256 agxPrice, uint256 rewardAmount)

关轮并请求 VRF 时，按实时 `agxPrice` 把 USD1 价值目标向上取整为 AGX 锁定额时触发。`rewardAmount` 即该轮每位中奖者的 AGX 奖励。

#### RewardValuePricingEnabled(uint256 indexed roundId, uint256 rewardValueUsd1)

`rewardValuePricingEnabled` 由 false 切到 true 时触发。初始化即为 true 的全新部署不会触发；`setCurrentRoundRewardValueUsd1` 在遗留合约上首次校正时会触发。

---

### 错误码

| 错误                                                       | 原因                                          | 解决方案                                                          |
| ---------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| `ErrorPaused()`                                            | 合约已暂停                                    | 等待恢复                                                          |
| `ErrorInvalidRound(roundId)`                               | 轮次不存在                                    | 检查轮次 ID                                                       |
| `ErrorNotCurrentRound(roundId, currentRoundId)`            | 不是当前轮次                                  | 使用 currentRoundId                                               |
| `ErrorAlreadyEligible(roundId, user)`                      | 用户已参与                                    | 无法重复参与                                                      |
| `ErrorInvalidRoundStatus(roundId, status)`                 | 轮次状态不匹配                                | 检查轮次状态                                                      |
| `ErrorRoundNotEnded(roundId, endTime)`                     | 轮次未结束                                    | 等待结束                                                          |
| `ErrorNoEligibleUsers(roundId)`                            | 无参与者                                      | 无法开奖                                                          |
| `ErrorNotWinner(roundId, user)`                            | 用户未获奖                                    | 检查获奖信息                                                      |
| `ErrorRewardAlreadyClaimed(roundId, user)`                 | 奖励已领取                                    | 无需重复                                                          |
| `ErrorRestakeConfigNotSet()`                               | owner 未设置 restakeConfig                    | 调用 `setRestakeConfig`                                           |
| `ErrorRewardQueueNotSet()`                                 | owner 未设置 rewardQueue                      | 调用 `setRewardQueue`                                             |
| `ErrorInsufficientContribution(user, required, available)` | 中奖者贡献值不足                              | 通过 `AgxContributionSwap.convert` 补充贡献值                     |
| `ErrorInsufficientRewardBalance(available, required)`      | 奖励余额不足                                  | 注入更多奖励                                                      |
| `ErrorRandomnessCancellationDisabled(roundId)`             | 调用了已停用的随机请求取消入口                | 不要取消或重请求；排查并等待原 VRF 回调                           |
| `ErrorVrfNotTimedOut(roundId, blocks, required)`           | 已废弃的 ABI 兼容错误                         | 当前实现不再产生                                                  |
| `ErrorOnlyCoordinator(caller, coordinator)`                | 非 VRF 协调器调用                             | 仅 Chainlink 可调用                                               |
| `ErrorOnlyRequestCoordinator(caller, requestId)`           | 回调者不是该请求发起时绑定的 Coordinator      | 使用原请求对应的 Chainlink Coordinator 回调                       |
| `ErrorLegacyRequestBindingIncomplete(cursor, roundCount)`  | 升级前请求尚未完成分页绑定                    | 保持暂停并继续调用迁移函数，完成后再切换 Coordinator              |
| `ErrorLegacyRequestBindingRequiresPause()`                 | 未暂停时执行旧请求绑定迁移                    | 先暂停 LuckyPool 和 Tracker                                       |
| `ErrorInvalidAgxPrice(uint256 price)`                      | 关轮/报价时 `restakeConfig.agxPrice()` 返回 0 | 检查 RestakeConfig 的 AGX 价格喂价                                |
| `ErrorRewardValuePricingNotEnabled()`                      | 关轮时 `rewardValuePricingEnabled` 仍为 false | 调用 `setCurrentRoundRewardValueUsd1` 启用定价                    |
| `ErrorPurchaseOutsideRound(purchaseAt,start,end)`          | 补同步使用的原购买时间不属于该轮              | 核对 Tracker 保存的 `qualificationPurchaseAt`                     |
| `ErrorPendingQualifications(roundId,count)`                | 当前轮仍有待同步资格                          | 批量调用 Tracker `retryQualification` 后重试关轮                  |
| `ErrorDeferredPurchases(count)`                            | 仍有 Pool 不可读期间的购买待归属              | 调用 Tracker `assignDeferredPurchase`，无法归属时由 owner discard |
| `ErrorTrackerBacklogUnavailable()`                         | Tracker 未配置、未达到 v3 或 backlog 读取异常 | 检查双向绑定、实现版本和 RPC，再恢复 keeper                       |

---

### 调用示例

#### 查看最新轮次状态

js

```js
async function latestRoundStatus(luckyPool, userAddress) {
  const currentId = await luckyPool.currentRoundId()
  const round = await luckyPool.getRound(currentId)

  const statusNames = ['None', 'Open', 'RandomRequested', 'Drawn', 'Cancelled']
  const now = Math.floor(Date.now() / 1000)

  console.log(`=== Round #${currentId} (Day ${round.displayDay}) ===`)
  console.log(`Status: ${statusNames[round.status]}`)
  console.log(`Eligible: ${round.eligibleCount} participants`)

  // 检查用户是否参与
  const isUserEligible = await luckyPool.isEligible(currentId, userAddress)
  console.log(`You are ${isUserEligible ? 'ELIGIBLE' : 'NOT eligible'}`)

  if (round.status === 0n) {
    // Open
    const timeLeft = Number(round.endTime) - now
    console.log(`Time remaining: ${(timeLeft / 3600).toFixed(1)} hours`)
  }

  if (round.status === 3n) {
    // Drawn
    const [won, reward] = await luckyPool.getWinnerInfo(currentId, userAddress)
    if (won) {
      console.log('🎉 YOU WON!', ethers.formatUnits(reward, 9), 'AGX')
    } else {
      console.log('Not a winner this round')
    }
  }
}
```

#### 查看所有获奖者

js

```js
async function showAllWinners(luckyPool) {
  const count = await luckyPool.roundCount()
  const roundIds = await luckyPool.getRoundIds(0, Number(count))

  for (const roundId of roundIds) {
    const round = await luckyPool.getRound(roundId)
    if (round.status >= 3n && round.winnerCount > 0n) {
      // Drawn
      const winners = await luckyPool.getWinners(roundId)
      console.log(`Round #${roundId}: ${winners.length} winners`)
      for (let i = 0; i < winners.length; i++) {
        console.log(`  #${i + 1}: ${winners[i]}`)
      }
    }
  }
}
```

---

### 依赖合约

| 合约                              | 用途                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------ |
| Chainlink VRF Coordinator V2 Plus | 可验证随机数                                                                   |
| 自建 keeper                       | 定时执行 `checkUpkeep -> performUpkeep`；独立 EOA、无 owner 权限、少量 BNB gas |
| RewardToken                       | 奖励代币                                                                       |
| AegisDailyPurchaseTracker         | 添加参与者                                                                     |

### 配置参数

| 参数                   | 默认值       | 说明                                                         | 设置者 |
| ---------------------- | ------------ | ------------------------------------------------------------ | ------ |
| `defaultRewardAmount`  | 初始化时设置 | Open 轮次的每位中奖者 USD1 价值目标；关轮时转换为 AGX 锁定额 | owner  |
| `defaultRoundDuration` | 初始化时设置 | 每轮持续时间（秒）                                           | owner  |
| `defaultMaxWinners`    | 初始化时设置 | 最大获奖者数（<=10）                                         | owner  |
| `purchaseTracker`      | 初始化后设置 | 参与者管理合约                                               | owner  |
| `paused`               | false        | 是否暂停                                                     | owner  |
| VRF 配置               | 初始化时设置 | Chainlink VRF 参数                                           | owner  |
| `nextDisplayDay`       | 初始化时设置 | 下一轮展示日编号                                             | owner  |
