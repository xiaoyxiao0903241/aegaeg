# AegisDailyPurchaseTracker 合约文档

> 来源：`doc-contracts-aegisdailypurchasetracker`
> ABI：[`abis/aegisdailypurchasetracker.json`](../abis/aegisdailypurchasetracker.json)

## 完整 ABI

abi/AegisDailyPurchaseTracker.json
SHA-256 e9eaf48c8f41…
72
38
18
16

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegisdailypurchasetracker.json`](../abis/aegisdailypurchasetracker.json)（72 entries）。

</details>

## AegisDailyPurchaseTracker 合约文档

### 概述

`AegisDailyPurchaseTracker` 是 AEGIS X 的日常购买追踪与资格缓冲合约。它记录用户每轮的购买金额，抽奖资格按单笔 `amount >= minPurchaseAmount` 判定。每次 `recordPurchase` 会先 best-effort 尝试 LuckyPool upkeep，再读取当前轮并归属本次购买，因此到期轮不会先吞掉新购买。Pool 暂停、窗口无效、关轮或异常都不会连带回滚主质押/债券交易。有效窗口内但暂时无法写入的资格会按原购买时间等待补同步；无法安全确定轮次的购买进入 deferred 队列。

**部署 key**: `DailyPurchaseTracker`

**BNB Chain 主网 proxy**：`0xf4328953616607aCc04F1e7Ba90bc379987c1945`（release `bb680398-e7c0-46fa-ad87-139446fb4120`，当前暂停）。

**ABI 路径**: `abi/AegisDailyPurchaseTracker.json`

---

### 关键概念

#### 1. 购买记录与奖池资格

- 授权购买源（如 BondDepository、LockedStaking）调用 recordPurchase()
- 每轮累计购买金额仅用于统计展示
- 当单笔 amount >= minPurchaseAmount 时，自动添加到当前奖轮
- 用户只能在每轮中获得一次参与资格

#### 2. fail-soft 与关轮一致性

- 每笔购买在轮次归属前都会尝试 checkUpkeep/performUpkeep ；若上一轮已到期且能够推进，本笔购买记录到新一轮。
- upkeep 失败、Pool 不可读或推进后仍没有有效 Open 窗口时，本笔购买进入 DeferredPurchase ，不会写进过期轮。
- 正常窗口内直接调用 LuckyPool.addEligibleUser 。
- 轮次可读、购买时间有效，但 Pool/Tracker 暂停或写入异常时，资格状态保存为 Pending ，任何地址可调用 retryQualification 。
- Pool 正常可读但购买时间确实位于轮次窗口外时发出 QualificationSkipped ，只保留购买统计，不进入 pending，也不回滚来源交易。
- Pool 完全不可读时，购买保存为 DeferredPurchase ；核对轮次后调用 assignDeferredPurchase ，无法归属时由 owner 调用 discardDeferredPurchase 。
- qualificationPurchaseAt 保存原始链上购买时间。LuckyPool 的 syncEligibleUser 依据原时间校验 [startTime,endTime) ，因此允许在窗口结束后补写。
- LuckyPool 在当前轮 pending 未清零时拒绝关轮；全局 deferred 保留给运维及时 assign/discard，但不阻塞无关轮次。

#### 3. 精确购买来源

生产配置固定为 10 个来源：`LiquidStaking`、`LockedStaking180d/360d/540d`、`BondDepository180d/360d/540d`、`BurnBondDepository180d/360d/540d`。每个来源都必须同时满足 Tracker 白名单和来源合约 `purchaseTracker` 指针回读。

#### 4. 迁移兼容

支持账户迁移后的记录合并查询；前端使用公开的 `getUserRoundStat(roundId,user)`，不要依赖内部 `_mergedStat()`。

---

### 前端 API

#### 视图函数

##### getUserRoundStat(uint256 roundId, address user) -> (totalAmount, qualified, qualifiedAt)

获取用户在指定轮次的购买统计。

js
```js
const currentRound = await tracker.luckyPool().then(lp => lp.currentRoundId());
const stat = await tracker.getUserRoundStat(currentRound, userAddress);
console.log('Total purchase:', ethers.formatUnits(stat.totalAmount, 18));
console.log('Qualified:', stat.qualified);
if (stat.qualifiedAt > 0n) {
  console.log('Qualified at:', new Date(Number(stat.qualifiedAt) * 1000).toLocaleString());
}
```

##### roundUserStats(uint256 roundId, address) -> (totalAmount, qualified, qualifiedAt)

直接访问 mapping。

##### 管理员视图

js
```js
const luckyPool = await tracker.luckyPool();
const minAmount = await tracker.minPurchaseAmount();
const paused = await tracker.paused();
const safetyVersion = await tracker.trackingSafetyVersion(); // 3
const pending = await tracker.pendingQualificationCount(currentRound);
const unresolved = await tracker.unresolvedDeferredPurchaseCount();
```

#### 状态修改函数

##### recordPurchase(address user, uint256 amount)

记录购买（仅购买源合约调用）。

**前提条件:**

- 调用者是授权的购买源
- amount > 0

Tracker 的 `paused=true` 只暂停向 LuckyPool 的即时转发，不暂停摄取授权来源的购买；能确定有效窗口的达标购买进入 pending，不能安全确定轮次的购买进入 deferred。

**事件:**

- PurchaseRecorded(roundId, user, source, amount, totalAmount)
- UserQualified(roundId, user, totalAmount, qualifiedAt) （当本次单笔金额达到阈值时）
- Pool 不可读时改为 PurchaseDeferred ；同步暂不可用时发出 QualificationDeferred ，不会使来源交易回滚

##### retryQualification(uint256 roundId, address user) -> bool

无权限限制。仅可重试已经由授权来源记录为 `Pending` 的资格；成功后发出 `QualificationSynced` 并减少该轮 pending 计数。

##### assignDeferredPurchase(uint256 deferredPurchaseId, uint256 roundId) -> bool

无权限限制，但合约会严格验证原始 `purchaseAt` 位于目标轮窗口。用于把 Pool 不可读期间的购买归属到唯一正确轮次。

##### discardDeferredPurchase(uint256 deferredPurchaseId)

仅 owner。仅用于人工核对后确认无法归属的记录；会减少全局 unresolved 计数并发出 `DeferredPurchaseDiscarded`。

##### refreshRoundCache() -> uint256 roundId

刷新 fail-soft 使用的当前轮缓存。升级 Tracker 后脚本会调用一次；Pool 恢复后也可再次调用。

##### 资格状态视图

- trackingSafetyVersion() -> 3
- isQualificationPending(roundId,user)
- qualificationSyncState(roundId,user) ： None/Pending/Syncing/Synced/Expired
- qualificationPurchaseAt(roundId,user)
- pendingQualificationCount(roundId)
- deferredPurchases(id) / unresolvedDeferredPurchaseCount()

##### setPurchaseSource(address source, bool enabled)

owner 增删授权购买源。`source=address(0)` revert `ErrorZeroAddress`。触发 `PurchaseSourceUpdated(source, enabled)`。

##### setMinPurchaseAmount(uint256 newAmount)

owner 设置单笔参与门槛。`newAmount=0` revert `ErrorZeroAmount`。触发 `MinPurchaseAmountUpdated(oldAmount, newAmount)`。

##### setLuckyPool(address newPool)

owner 切换奖池合约。`newPool=address(0)` revert `ErrorZeroAddress`。触发 `LuckyPoolUpdated(oldPool, newPool)`。

##### setPaused(bool flag)

owner 暂停/恢复即时资格同步。暂停期间仍接收授权来源的购买并保留 pending/deferred 证据。触发 `PausedUpdated(flag)`。

##### setMigrationManager(address _manager)

owner 设置迁移管理器。`_manager=address(0)` revert `ErrorZeroAddress`；一旦设置非零 manager，只允许设为相同地址，否则 revert `MigrationManagerImmutable(currentManager)`。触发 `MigrationManagerUpdated(manager)`。

##### migrateAccount(address oldAccount, address newAccount)

仅 `migrationManager` 可调用。把 `oldAccount` 别名指向 `newAccount`，root 经 `_original` 链解析。自迁移/回迁/环/已迁移/脏目标地址全部 revert `ErrorAccountMigrated`。触发 `AccountMigrated(oldAccount, newAccount)`。

##### originalOf(address account) -> (address)

迁移感知 view：返回账户的 root 原始地址。

##### canonicalOf(address account) -> (address)

迁移感知 view：返回账户当前的有效 canonical 地址。

---

### 事件

#### PurchaseRecorded(uint256 indexed roundId, address indexed user, address indexed source, uint256 amount, uint256 totalAmount)

购买记录时触发。

#### UserQualified(uint256 indexed roundId, address indexed user, uint256 totalAmount, uint256 qualifiedAt)

用户本次单笔购买达到参与资格时触发。事件中的 `totalAmount` 是本轮累计统计值，不是资格判定依据。

#### fail-soft 事件

- LuckyPoolUpkeepAttempted(observedRoundId, checkSucceeded, upkeepNeeded, performSucceeded) ：每次 recordPurchase 前对 LuckyPool 执行的 best-effort upkeep 结果。 checkSucceeded=false 表示 checkUpkeep 读取失败； upkeepNeeded=true 且 performSucceeded=false 表示尝试推进轮次但失败。两种情况都不回滚主购买/质押/债券交易，监控端应进行告警并以链上轮次状态为准。
- PurchaseDeferred ：Pool 完全不可读，购买等待轮次归属。
- QualificationSkipped ：该笔购买不属于当前可接受的轮次/窗口，因此只记统计、不授予该轮资格。
- QualificationDeferred ：资格已记录但尚未写入 Pool。
- QualificationSynced ：待同步资格已补写。
- DeferredPurchaseAssigned / DeferredPurchaseDiscarded ：待归属记录已处理。
- RoundCacheUpdated ：轮次缓存刷新。

#### PurchaseSourceUpdated(address indexed source, bool enabled)

`setPurchaseSource` 增删购买源时触发。

#### MinPurchaseAmountUpdated(uint256 oldAmount, uint256 newAmount)

`setMinPurchaseAmount` 调整门槛时触发。

#### LuckyPoolUpdated(address indexed oldPool, address indexed newPool)

`setLuckyPool` 切换奖池合约时触发。

#### PausedUpdated(bool paused)

`setPaused` 切换暂停状态时触发。

#### MigrationManagerUpdated(address indexed manager)

`setMigrationManager` 设置迁移管理器时触发。

#### AccountMigrated(address indexed oldAccount, address indexed newAccount)

`migrateAccount` 完成账户别名绑定时触发。

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorNotPurchaseSource()` | 非授权购买源 | 联系管理员授权 |
| `ErrorPaused()` | 兼容保留错误；当前 `recordPurchase` 不因 Tracker 暂停而抛出 | 前端不要把 Tracker 暂停理解为来源交易会失败 |
| `ErrorZeroAmount()` | 金额为 0 | 增加金额 |
| `ErrorZeroAddress()` | 传入 address(0) | 传入有效地址 |
| `ErrorNotMigrationManager(address caller)` | 非 migrationManager 调用 `migrateAccount` | 仅由迁移管理器调用 |
| `ErrorAccountMigrated(address account)` | 自迁移/回迁/环/已迁移或脏目标地址 | 使用 canonical 地址或未参与过的新地址 |
| `MigrationManagerImmutable(address currentManager)` | 已设非零 manager 后试图改成不同地址 | 保留相同地址或保持不变 |
| `ErrorQualificationNotPending(roundId, account)` | 重试的资格不是 Pending | 先读取 `qualificationSyncState` |
| `ErrorDeferredPurchaseNotPending(id)` | 待归属记录不存在或已处理 | 刷新记录状态 |
| `ErrorDeferredRoundNotOpen(roundId, currentRoundId, status)` | 待归属购买的目标不是当前 Open 轮次 | 只向当前仍为 Open 的原始轮次归属；否则人工核对后丢弃 |
| `ErrorPurchaseOutsideRound(...)` | 原购买时间不属于指定轮 | 重新核对目标轮次，不得伪造时间 |
| `ErrorRoundUnavailable()` | 刷新缓存或归属时无法读取轮次 | 等待 Pool/RPC 恢复后重试 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `luckyPool` | 初始化时设置 | 奖池合约地址 | owner |
| `minPurchaseAmount` | 初始化时设置 | 参与门槛 | owner |
| `purchaseSources` | 初始化后设置 | 购买源合约列表 | owner |
| `paused` | false | 是否暂停 | owner |
| `trackingSafetyVersion` | 3 | fail-soft 实现版本 | 只读常量语义 |
| `pendingQualificationCount` | 0 | 每轮尚未同步的资格数 | 通过重试自动减少 |
| `unresolvedDeferredPurchaseCount` | 0 | 全局待归属购买数 | assign/discard 自动减少 |
