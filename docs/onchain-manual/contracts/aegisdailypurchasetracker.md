# AegisDailyPurchaseTracker 前端与集成说明

> 来源：`doc-contracts-aegisdailypurchasetracker`
> ABI：[`abis/aegisdailypurchasetracker.json`](../abis/aegisdailypurchasetracker.json)

## 完整 ABI

abi/AegisDailyPurchaseTracker.json
SHA-256 0be92f05b5b8…
50
24
12
14

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegisdailypurchasetracker.json`](../abis/aegisdailypurchasetracker.json)（50 entries）。

</details>

## AegisDailyPurchaseTracker 前端与集成说明

`AegisDailyPurchaseTracker` 是购买精确计价事件与 LuckyPool 轮次归属合约。当前全新部署版本的 `trackingSafetyVersion()` 固定返回 `5`：每笔合法来源购买都会产生权威的 `PurchaseValued`；Lucky 跟踪开启时，每轮累计和单笔达标资格仍与来源购买保持强原子。

**BNB Chain 主网 proxy**：`0xAC1ba469F79Ac63698af66BA6824A718b964Cc81`（增量 release `f25c7887-1ec0-43a2-b16c-32de9dbbb314`，部署块 `115038546`）。当前 `paused=true`，10 个购买来源已完成白名单和 `purchaseTracker` 指针切换。

### 核心业务规则

- 每笔合法购买在参数校验后都先发出一个 PurchaseValued(user,source,amount) 。
- paused == true 只表示 Lucky 跟踪关闭：再发出 PurchaseLuckySkipped 后成功返回，不访问 LuckyPool、不累计、不授予资格。
- paused == false 时才调用 LuckyPool 的 ensureOpenRound() ；此路径继续保持强原子。
- 若当前轮已经结束， ensureOpenRound() 只处理这一轮并创建一个从当前交易时间开始的完整新轮，复杂度为 O(1)。
- 只有当前区块位于 [round.startTime, round.endTime) 时才累计购买额。
- 每轮累计金额保存在 roundUserStats(roundId,user) ，前端优先使用迁移感知的 getter。
- 资格按“单笔达到门槛”判断：只有本笔 amount >= minPurchaseAmount 才能使用户获得资格；多笔小额累计超过门槛不会获得资格。
- 每个用户每轮最多加入一次资格列表。
- Lucky 跟踪开启后的正式轮次路径不存在 pending、deferred、retry 或 best-effort 分支。
- 关闭期间的购买不会在重新开启后补累计或补资格。

### 提前激活与首轮开始前购买

LuckyPool 可以在 `firstStartTime` 之前或之后调用 `activate()`；只要首轮 end 仍在未来，非零 start/end 都按配置精确保留。此时第一轮已经创建，状态为 `Open`，但在时间到达之前：

- LuckyPool.isRoundAcceptingPurchases(roundId) 返回 false ；
- 来源合约的主购买可以成功；
- Tracker 不累计本轮金额，也不授予资格；
- Tracker 先发出通用 PurchaseValued ，再发出 PurchaseIgnoredBeforeRoundStart(roundId,user,source,amount) 作为未进入轮次的明确审计记录。

到达 `firstStartTime` 后不需要额外交易来“开始”轮次。区块时间自然满足窗口条件，此后的有效购买会立即被记录。

### 金额单位

`recordPurchase(user,amount)` 的 `amount` 是来源合约归一化后的 USD1 价值，统一使用 18 位精度。普通 Bond 直接把 `Treasury.valueOf()` 已返回的 9 位 USD1 价值扩展为 18 位，不再二次计价；BurnBond、Liquid 与 Locked 才会把 AGX 数量交给 `RestakeConfig.agxUsdValue` 换算：

text
```text
1 USD1 = 1_000_000_000_000_000_000
```

前端展示时使用 `formatUnits(value, 18)`，不得把该值当作 AGX 的 9 位精度数量。

### 前端推荐读取

#### 当前用户本轮累计与资格

javascript
```javascript
const [roundId, totalAmount, qualified, qualifiedAt] =
  await tracker.getCurrentRoundUserStat(user);

const round = await luckyPool.getRound(roundId);
const accepting = await luckyPool.isRoundAcceptingPurchases(roundId);

return {
  roundId,
  totalUsd1: ethers.formatUnits(totalAmount, 18),
  qualified,
  qualifiedAt,
  startTime: round.startTime,
  endTime: round.endTime,
  accepting,
};
```

不要只根据 `round.status == Open` 判断能否计入购买。提前激活后的计划轮在开始前也是 `Open`，必须同时读取 `isRoundAcceptingPurchases(roundId)` 或比较链上时间窗。

#### 指定轮次统计

javascript
```javascript
const [totalAmount, qualified, qualifiedAt] =
  await tracker.getUserRoundStat(roundId, user);
```

该 getter 会合并账户迁移链上的历史数据；业务页面不要直接只读某一个地址的 `roundUserStats`。

#### 配置状态

javascript
```javascript
const [version, pool, threshold, paused, luckyTrackingEnabled, sourceEnabled] = await Promise.all([
  tracker.trackingSafetyVersion(),
  tracker.luckyPool(),
  tracker.minPurchaseAmount(),
  tracker.paused(),
  tracker.luckyTrackingEnabled(),
  tracker.purchaseSources(sourceAddress),
]);
```

正式环境必须满足：

- version == 5 ；
- pool 等于全新 LuckyPool 代理地址；
- luckyTrackingEnabled == !paused ；正式参与幸运奖时必须为 true ；
- 精确的购买来源已启用；
- 每个来源的 purchaseTracker() 反向指向当前 Tracker。

### 写入接口

#### recordPurchase(address user, uint256 amount)

仅 `purchaseSources[msg.sender] == true` 的来源合约可以调用。EOA 和前端不能直接调用。

所有成功调用的公共前缀：

1. 检查来源、用户和金额。
2. 把迁移身份归一到原始 root，并发出唯一的 PurchaseValued 。
3. 若 paused == true ，发出 PurchaseLuckySkipped 后返回；来源购买保持成功。

Lucky 跟踪开启后的轮内路径：

1. 调用 LuckyPool.ensureOpenRound() 。
2. 确认当前轮正在接受购买；计划开始前只追加忽略事件并返回。
3. 累加用户本轮 totalAmount 并发出 PurchaseRecorded 。
4. 若本笔达到门槛且用户尚未获资格，强制调用 LuckyPool.addEligibleUser 。
5. 成功后写入 qualified/qualifiedAt 并发出 UserQualified 。

Lucky 跟踪开启时，上述 Pool 路径任一步失败都会向上传播 revert，使来源购买和先前发出的 `PurchaseValued` 一起回滚。EVM 不能在回滚交易中保留事件。Lucky 跟踪关闭时则完全不访问 Pool，因此 Pool 未激活、暂停或故障都不会阻止购买。

#### 管理接口

| 方法 | 权限 | 说明 |
| --- | --- | --- |
| `setPurchaseSource(source,enabled)` | owner | 启用或停用购买来源；地址必须非零 |
| `setMinPurchaseAmount(amount)` | owner | 设置单笔资格门槛；必须大于 0 |
| `setPaused(flag)` | owner | 仅开关 Lucky 轮次累计和资格；不关闭 `PurchaseValued`，也不阻止合法来源购买 |
| `setMigrationManager(manager)` | owner | 一次性绑定账户迁移 Manager |
| `migrateAccount(old,new)` | Migration Manager | 迁移用户读取身份；前端不能直接调用 |

LuckyPool 地址在初始化时绑定，当前 fresh-deploy 版本没有更换 Pool 的管理函数。需要替换 LuckyPool 时应重新部署成对的 Pool/Tracker。

### 事件

| 事件 | 含义 |
| --- | --- |
| `PurchaseValued(user,source,amount)` | 每笔成功合法来源购买的权威 18 位 USD1 原始值；与来源业务事件同交易 |
| `PurchaseLuckySkipped(user,source,amount)` | Lucky 跟踪关闭，本次购买成功但永久不进入轮次累计或资格 |
| `PurchaseRecorded(roundId,user,source,amount,totalAmount)` | 有效窗口内的购买已累计；`totalAmount` 是该用户本轮累计 USD1 价值 |
| `PurchaseIgnoredBeforeRoundStart(roundId,user,source,amount)` | 提前激活后、计划开始前的购买已成功但明确不计入轮次 |
| `UserQualified(roundId,user,totalAmount,qualifiedAt)` | 本笔购买达到门槛，用户已原子加入 LuckyPool 资格 |
| `PurchaseSourceUpdated(source,enabled)` | 来源白名单变化 |
| `MinPurchaseAmountUpdated(oldAmount,newAmount)` | 单笔门槛变化 |
| `PausedUpdated(paused)` | Lucky 跟踪状态变化；`paused=true` 不代表计价事件关闭 |
| `MigrationManagerUpdated(manager)` / `AccountMigrated(old,new)` | 迁移配置或迁移完成 |

scanner 使用同交易 `PurchaseValued.amount` 作为 Bond、BurnBond、Liquid 和普通 Locked 购买的历史 `usd_value`，不再用扫链时最新价反推。`PurchaseRecorded` 与 `UserQualified` 只用于 Lucky 轮次投影；`PurchaseLuckySkipped` 和 `PurchaseIgnoredBeforeRoundStart` 只进入审计账，不得伪造成某一轮累计。

### 常见失败

| 错误 | 原因 | 处理 |
| --- | --- | --- |
| `ErrorNotPurchaseSource` | 调用方没有来源权限 | 检查双向配置和新代理地址 |
| `ErrorRoundUnavailable` | Pool 没有返回有效轮次 | 检查 Pool 是否已激活及状态机是否正常 |
| `ErrorEligibilityNotRecorded` | 达标资格未能写入 Pool | 整笔购买会回滚；修复 Pool 配置后重试购买 |
| `ErrorNotContract(account)` | 初始化 Pool 不是合约 | 使用已部署的新 Pool 代理地址 |

### 集成验收清单

- Tracker 与 LuckyPool 均为本次全新部署代理，不复用旧 Pair。
- trackingSafetyVersion() == 5 且 Pool 的 required version 也是 5。
- tracker.luckyPool() 与 pool.purchaseTracker() 双向一致。
- Liquid、3 个 Locked、3 个 Bond、3 个 BurnBond 共 10 个来源全部双向接入。
- Lucky 跟踪关闭时购买成功，严格出现一个 PurchaseValued 和一个 PurchaseLuckySkipped ，Pool 与轮次统计保持不变。
- 开始前购买出现 PurchaseValued 与 PurchaseIgnoredBeforeRoundStart ，统计保持 0。
- 开始后低于门槛购买增加累计但不获资格。
- 两笔小额累计超过门槛仍不获资格。
- 单笔达到门槛时 PurchaseRecorded 、 EligibleUserAdded 、 UserQualified 同交易成功。
- Lucky 跟踪开启时破坏 Pool 路径会使来源购买和所有事件整体回滚。
- Scanner 对缺失或歧义的 PurchaseValued 失败关闭，不回退到 Redis/DB 最新价。
