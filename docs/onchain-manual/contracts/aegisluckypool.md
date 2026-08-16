# AegisLuckyPool 前端与运维说明

> 来源：`doc-contracts-aegisluckypool`
> ABI：[`abis/aegisluckypool.json`](../abis/aegisluckypool.json)

## 完整 ABI

abi/AegisLuckyPool.json
SHA-256 006b17542bfd…
168
84
33
51

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegisluckypool.json`](../abis/aegisluckypool.json)（168 entries）。

</details>

## AegisLuckyPool 前端与运维说明

`AegisLuckyPool` 是 AEGIS X 的每日抽奖合约。当前 canonical Pool 最初与 `AegisDailyPurchaseTracker` 成对全新部署，提供可重排首轮、O(1) 续轮、空轮跳过、双 FIFO 两阶段 VRF 和单 seed 派生最多 10 名不重复赢家。旧版 Pool/Tracker 仍不是本实现的升级来源；只有当前 canonical Pool 可按专用发布证据执行窄范围代理升级。

**BNB Chain 主网 proxy**：`0x6ACdd260F7926EA60991b566B272b338E0222C44`（增量 release `f25c7887-1ec0-43a2-b16c-32de9dbbb314`，部署块 `115038536`）。2026-08-10 首轮重排升级已通过：implementation `0x89dC32FE0B88cbd44dB68cFc54Cf063950F301cD → 0x01a861bAebB88cB17aB8b7c4d6A0D645C0774Fa3`，升级交易 `0x7e70efdb3eba105877c68f68b6a224df7eb02f936178011e5ee980fa891600d2`，排期交易 `0x40da34b95883baeafa88d8ea7c32f01390d6c61ca3cdf70a755966ca617541e2`。终验块 `115134221` 回读 `paused=true`、`activated=false`、零轮次、`firstStartTime=1786320000`（2026-08-10 00:00 UTC）、`endTime=1786406400`（2026-08-11 00:00 UTC）；权威回执见 [`20260810220903012...upgrade.json`](../../deployments/verifications/20260810220903012.bsc.lucky-pool-first-start-time-upgrade.json)。Pool 尚未激活，必须在 end 到达前完成激活；由于 start 已经过，激活后首轮只使用剩余窗口。

### 首轮计划与激活语义

初始化参数 `_firstStartTime` 的含义是“第一轮精确开始时间”：

- _firstStartTime > 0 ：第一轮固定为 [_firstStartTime, _firstStartTime + roundDuration) 。
- _firstStartTime == 0 ：第一轮从 activate() 交易的区块时间开始。
- activate() 只是打开系统并创建计划轮，可以在 _firstStartTime 之前、当时或之后调用。
- setFirstStartTime(newStartTime) 只允许 owner 在 activated == false && currentRoundId == 0 时调用，可重复修改并发出 FirstStartTimeUpdated 。
- newStartTime 可以在过去、现在或未来；唯一时间门禁是按当时 defaultRoundDuration 算出的 endTime 必须严格大于交易区块时间。过去时间会得到一个已经开始、但尚未结束的缩短首轮。
- setFirstStartTime() 与 activate() 都执行相同的终点复检； endTime <= block.timestamp 时以 ErrorFirstRoundWindowExpired 回滚。修改默认轮长后，激活使用最新轮长重新检查。
- 到达 startTime 时不需要 Keeper、owner 或用户再发一笔“开始交易”。是否已开始完全由 block.timestamp 决定。

例如首轮计划为 10:00～次日 10:00，可以在 08:00 完成配置并调用 `activate()`。08:00～10:00 期间轮次状态已经是 `Open`，但 `isRoundAcceptingPurchases(roundId)` 为 `false`；10:00 后自动变为可接受购买。如果 12:00 才激活，只要次日 10:00 尚未到达，首轮仍保持原来的 10:00～次日 10:00，并立即接受购买。

激活前必须已经配置 Tracker、RestakeConfig、RewardQueue、MigrationManager，并向 Pool 充值奖励。Pool 还会在链上强制验证 `Tracker.luckyPool() == address(this)` 和 `Tracker.trackingSafetyVersion() == REQUIRED_TRACKING_SAFETY_VERSION == 5`；错误绑定或旧版 Tracker 以 `ErrorInvalidPurchaseTrackerBinding` 回滚。其他缺失配置分别以 `ErrorActivationConfigIncomplete` 或余额错误失败。

### 后续轮次与 O(1) 续轮

当前轮到达 `endTime` 后，任意一次合法 Keeper 动作或 Tracker 的 `ensureOpenRound()` 都只处理当前轮一次：

- 空轮：直接设为 Drawn ，奖励和中奖人数为 0，发出 RoundSkipped 。
- 非空轮：设为 AwaitingRandomness ，加入等待随机数 FIFO，发出 RoundSealed 。
- 随后立即创建下一轮；新轮从该笔 rollover 交易的区块时间开始，并拥有完整 defaultRoundDuration 。

合约不会循环补建错过的历史日历轮，因此单笔购买和 Keeper 调用的工作量不随停机天数增长。

### 状态机

`RoundStatus` 数值如下：

| 值 | 状态 | 含义 |
| --- | --- | --- |
| 0 | `None` | 不存在 |
| 1 | `Open` | 当前开放轮；仍需结合时间窗判断是否接受购买 |
| 2 | `AwaitingRandomness` | 已封存并进入请求 FIFO |
| 3 | `RandomRequested` | 已锁定奖励并请求一个 VRF word |
| 4 | `RandomReady` | 回调 seed 已验证和保存，等待结算 FIFO |
| 5 | `Drawn` | 已开奖或空轮跳过 |
| 6 | `Cancelled` | owner 对到期空轮执行应急取消 |

非空轮正常事件顺序：

text
```text
RoundCreated
  → EligibleUserAdded (0..N)
  → RoundSealed
  → LuckyRewardAmountLocked
  → RandomnessRequested
  → RandomnessReady
  → WinnerSelected (1..10)
  → RandomnessFulfilled
```

空轮事件顺序：

text
```text
RoundCreated → RoundSkipped → RoundCreated(next)
```

空轮不会读取价格、不会预留奖励，也不会请求 VRF；因此前端不能假设每个 `Drawn` 轮都有 `RandomnessRequested` 或 `RandomnessFulfilled`。

### 单 seed 与不重复赢家

`VRF_NUM_WORDS` 和兼容 getter `NUM_WORDS` 都返回 `1`。回调只保存 `randomWords[0]`：

- RandomnessReady(roundId,requestId,seed) 证明 seed 已到达；
- 回调不遍历用户、不选人、不转账；
- 后续 settleRound 使用带 chainId 、Pool 地址、Coordinator、requestId、roundId 和 slot 域隔离的 keccak256 派生每个槽位；
- 合约使用局部 Fisher-Yates 交换表，每选出一个索引就从剩余候选集合移除，因此同一轮最多 10 名且绝不会重复；
- 实际人数为 min(eligibleCount, round.maxWinners) 。

`WinnerSelected` 全部发出后，`RandomnessFulfilled` 是同一笔结算交易的最后一个 Pool 终态事件，供 scanner 原子确认中奖人数和开奖证明。

### Keeper 调用保持不变

外部 Keeper API 没有改变：

javascript
```javascript
const [needed, performData] = await luckyPool.checkUpkeep('0x');
if (needed) {
  const gas = await luckyPool.performUpkeep.estimateGas(performData);
  await luckyPool.performUpkeep(performData, { gasLimit: gas * 135n / 100n });
}
```

Keeper 必须把 `performData` 当作不透明字节串原样传回，不能自行解码、缓存后重编码或根据轮次猜动作。数据内部绑定版本、动作、轮次和 `queueSequence`，过期数据会被拒绝。

生产 Keeper 同时监听 `RoundSealed` 与 `RandomnessReady` 作为低延迟唤醒信号；事件回调不直接调用 `performUpkeep`，连续事件会合并，所有检查和交易仍由唯一串行循环执行。默认每 5 秒轮询必须保留，以覆盖 HTTP RPC 日志过滤器过期、漏事件、断线和进程重启。

`UpkeepAction`：

| 值 | 动作 | 结果 |
| --- | --- | --- |
| 0 | `None` | 当前无动作 |
| 1 | `RolloverCurrent` | 结束当前轮并立即创建新轮 |
| 2 | `RequestRandomness` | 对等待 FIFO 队首锁奖励并请求 VRF |
| 3 | `SettleRound` | 对回调到达 FIFO 队首派生赢家 |

每次 `performUpkeep` 只执行一个动作。优先级是当前轮 rollover、ready FIFO 结算、awaiting FIFO 请求；每条队列内部严格 FIFO。

### 前端读取

#### 当前轮与时间窗

javascript
```javascript
const roundId = await luckyPool.currentRoundId();
const [round, accepting, activated, paused] = await Promise.all([
  luckyPool.getRound(roundId),
  luckyPool.isRoundAcceptingPurchases(roundId),
  luckyPool.activated(),
  luckyPool.paused(),
]);
```

购买按钮判断至少应使用 `activated && !paused && accepting`。不要只使用 `round.status == 1`，因为计划开始前也属于 `Open`。

#### 用户累计与资格

累计金额不存放在 Pool，必须从 Tracker 读取：

javascript
```javascript
const [statRoundId, totalAmount, qualified, qualifiedAt] =
  await tracker.getCurrentRoundUserStat(user);
const eligible = await luckyPool.isUserEligible(statRoundId, user);
```

`qualified` 与 `eligible` 在正常强原子路径下应一致。累计可以大于门槛但 `qualified=false`，因为资格按单笔判断。

#### 队列与开奖

javascript
```javascript
const [awaitingCount, nextAwaitingRoundId, readyCount, nextReadyRoundId] =
  await luckyPool.getQueueState();

const seedWords = await luckyPool.getRandomWords(roundId); // [] 或 [seed]
const winners = await luckyPool.getWinners(roundId);
const [won, rewardAmount] = await luckyPool.getWinnerInfo(roundId, user);
```

轮次分页使用 `roundCount()` 和 `getRoundIds(offset,limit)`；资格列表使用 `eligibleCount(roundId)` 与 `getEligibleUsers(roundId,offset,limit)`。

### 奖励单位与预留

`RoundCreated.rewardAmount` 在当前 USD1 定价模式中是每名赢家目标 USD1 价值，使用 18 位精度。请求随机数时：

1. 从 RestakeConfig.agxPrice() 读取 AGX 的 USD1 价格；
2. 向上取整换算为 9 位精度 AGX 数量；
3. 发出 LuckyRewardAmountLocked(roundId,agxPrice,rewardAmount) ；
4. 按实际赢家数量增加 reservedRewards 。

因此 scanner 和前端必须以 `LuckyRewardAmountLocked` 区分“目标 USD1 价值”和“最终每名赢家 AGX 数量”。`rewardReserve()` 返回合约持有的奖励 Token 总余额；可自由提取额为该余额减去 `reservedRewards`，紧急提取会在链上强制执行这一预留保护。

### 领取

中奖不会自动转账。用户调用：

solidity
```solidity
claimRewardMixed(roundId, releasePlanIndex, restakePlanIndex, restakeBps)
```

合约在同一交易内标记已领取、扣减 `reservedRewards`，再按比例进入 RewardQueue 与 LockedStaking。前端应先读取：

- getWinnerInfo(roundId,user) ；
- rewardClaimed(roundId,user) ；
- restakeConfig 中的贡献值与复投限制；
- RewardQueue 计划和 LockedStaking 计划。

迁移后的旧地址不能再次领取；迁移感知 getter 会把新地址映射到原始中奖记录。

### 管理接口

| 方法 | 说明 |
| --- | --- |
| `activate()` | 一次性开启系统并按精确首轮计划创建第一轮；允许在 start 前后调用，但不能晚于 end |
| `setPurchaseTracker(address)` | 激活前一次性绑定 fresh Tracker |
| `setDefaults(rewardValueUsd1,roundDuration,maxWinners)` | 设置后续默认值；`maxWinners <= 10` |
| `setFirstStartTime(newStartTime)` | 仅激活前且零轮次可调用；允许过去/现在/未来，但首轮结束必须仍在未来 |
| `setCurrentRoundRewardValueUsd1(value)` | 调整当前 Open 轮每名赢家目标 USD1 价值 |
| `setVrfConfig(...)` | 更新 VRF 参数；管理台仍需按 BNB Chain 官方边界硬校验 |
| `setRestakeConfig(address)` / `setRewardQueue(address)` | 配置领取依赖 |
| `setPaused(flag)` | 暂停 Pool；未激活时不能直接取消暂停 |
| `depositRewards(amount)` | 任何地址可预充值奖励 token |
| `cancelCurrentAndCreateNextRound()` | owner 对已到期空轮的应急取消；正常路径使用 Keeper 的 `RoundSkipped` |
| `cancelTimedOutRound(roundId)` | 兼容入口，永久回滚；随机数请求不能取消 |
| `setMigrationManager(address)` (onlyOwner, 一次性不可变) | 设置统一迁移管理器；`address(0)` 回滚 `ErrorZeroAddress`，**`migrationManager` 已设非零值后再改回滚 `MigrationManagerImmutable`**——部署前必须确认目标地址 |
| `migrateAccount(oldAccount,newAccount)` | 仅由 `migrationManager` 调用的内部协作入口；真实迁移走 `AccountMigrationManager` 流程，前端/EOA 不直接调用 |
| `emergencyWithdraw(token,to,amount)` (onlyOwner) | 应急提取合约内任意 token；提取奖励 token 时受 `reservedRewards` 保护，仅可提取超出已计入轮次奖励预留的部分，超额回滚 `ErrorInsufficientRewardBalance` |

### 关键事件消费

| 事件 | 前端/scanner 行为 |
| --- | --- |
| `RoundCreated` | 建立轮次和精确时间窗 |
| `Activated` | 记录系统已开启；不是“到点开始”的第二次交易 |
| `FirstStartTimeUpdated` | 记录激活前首轮计划的 old/new 时间；scanner 可审计，不属于抽奖轮次事件 |
| `EligibleUserAdded` | 更新资格人数 |
| `RoundSkipped` | 将空轮直接显示为已完成、0 人中奖、0 奖励 |
| `RoundSealed` | 状态变为等待随机数 |
| `LuckyRewardAmountLocked` | 固化每名赢家 AGX 数量和价格证明 |
| `RandomnessRequested` | 保存 requestId |
| `RandomnessReady` | 保存 seed 与回调交易证明，状态变为待结算 |
| `WinnerSelected` | 保存槽位、候选索引和赢家 |
| `RandomnessFulfilled` | 结算终态，必须与同交易 WinnerSelected 数量一致 |
| `UpkeepPerformed` | 记录实际执行动作和队列序号 |

### 部署/升级验收

- 首次切换时 Pool 与 Tracker 都是新代理，旧轮次和扫描数据不迁移；后续只允许当前 canonical Pool 按固定 release manifest/OZ manifest 升级。
- defaultRoundDuration == 86400 ， defaultMaxWinners <= 10 ， NUM_WORDS == 1 。
- setFirstStartTime 仅 owner、仅激活前零轮次可调用；首轮结束已到达时 setter 与 activate() 都回滚。
- activate() 成功后，非零计划保持 startTime == firstStartTime 、 endTime == firstStartTime + 86400 ；零值从激活区块开始。
- 开始前 isRoundAcceptingPurchases == false ，到点后无需交易即变为 true。
- 空轮只出现 RoundSkipped + RoundCreated ，无价格读取、奖励预留和 VRF 请求。
- 非空轮 rollover 与新轮创建同交易完成，购买不等待旧轮开奖。
- VRF 回调只发 RandomnessReady ，不发赢家事件。
- settle 产生 min(eligibleCount,maxWinners) 名不重复赢家，并以 RandomnessFulfilled 收尾。
- Keeper 原样透传 performData ，旧数据因 queueSequence 变化而失败关闭。
