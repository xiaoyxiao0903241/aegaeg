# RewardManager（AegisEpochRewardManager）

> 来源：`doc-contracts-rewardmanager`
> ABI：[`abis/rewardmanager.json`](../abis/rewardmanager.json)

## 完整 ABI

abi/AegisEpochRewardManager.json
SHA-256 82bd0d206c38…
54
30
12
12

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/rewardmanager.json`](../abis/rewardmanager.json)（54 entries）。

</details>

## RewardManager（AegisEpochRewardManager）

**部署 key**：`RewardManager`

**BNB Chain 主网 proxy**：`0x7ccaA7890A44d6Ef2a507F73509A209cc98A9941`（release `bb680398-e7c0-46fa-ad87-139446fb4120`）。

**ABI**：`abi/AegisEpochRewardManager.json`

### 职责

`AegisEpochRewardManager` 在 `StakingPool` 每次区块 Epoch Rebase 时原子完成 AGX 配资：

- 按 ppm 给 StakingPool 和其他普通 recipient 铸币（普通 recipient 按 supply * rate / 1,000,000 ，源码 src/RewardManager.sol:270 ）。
- 按本期刚完成的实际 Rebase profit 百分比给 DaoPool 补充奖励储备。
- 按各长期池本金及基础 Rebase 加成比例铸币，并同步 globalExtraIndex 。

> 注意：RewardManager 源码中**没有 MarketFund 专属分配逻辑，也没有 `MARKET_FUND_REBASE_FUNDING_BPS` 常量**。MarketFund 如需参与 RewardManager 分配，只能通过 `addRecipient(marketFund, rate)` 作为普通 recipient 按 ppm 配置；其真实业务负债由 scanner 侧按实际 delta 独立偿付，不在 RewardManager 内置。

任何地址都能调用无参数 `distributeEpochRewards()`；该入口只读取 `StakingPool.epoch.endBlock`，未到期返回 `false`，到期后委托 `StakingPool.rebase()`。真正的 `settleEpochRewards(epochNumber)` 结算回调只接受已配置的 StakingPool，并要求参数恰好等于 StakingPool 刚完成的 `epoch.number - 1`。执行前会用 `Treasury.excessReserves()` 一次性检查本轮全部分配，余额不足则整轮回滚，不会留下“铸了币但索引没更新”的半结算状态。

### 比例与公式

| 配置 | 单位 | 当前默认 | 公式/含义 |
| --- | --- | --- | --- |
| `REWARD_STAKING_RATE` | ppm | `2500` | 基础 Rebase：`sAGX.circulatingSupply × rate / 1,000,000` |
| `DAO_REWARD_RATIO` | % | `168` | DAO 储备预算：`本期实际 Rebase profit × ratio / 100` |
| `LOCKED_180_BONUS_BPS` | BPS | `1000` | 180 天池获得基础 Rebase 收益的 10% 加成 |
| `LOCKED_360_BONUS_BPS` | BPS | `1500` | 360 天池获得基础 Rebase 收益的 15% 加成 |
| `LOCKED_540_BONUS_BPS` | BPS | `2000` | 540 天池获得基础 Rebase 收益的 20% 加成 |

> 上表为部署配置值（见 `script/configure-reward-manager.ts` 与白皮书），**非合约常量**：基础 rate 经 `addRecipient(stakingPool, rate)` 配置、加成经 `setLockedPoolReward` 配置。

白皮书明确的是每 12 小时基础 Rebase 0.25%—0.5%，以及 180/360/540 天池至少 10%/15%/20% 的“基础收益加成”。`DAO_REWARD_RATIO=168` 表示 DaoPool 获得本期实际 Rebase profit 的 168%，比例仍可由 owner 在 0—500 范围内调整。

长期池每轮额外索引：

text
```text
bonusRatePpm = baseRatePpm × bonusBps / 10,000
extraIndex   = bonusRatePpm × 1e9 / 1,000,000
poolReward   = totalLockedPrincipal × extraIndex / 1e9
```

### 关键接口

- previewEpochRewards() ：返回下一轮普通 recipient/长期池奖励、本期待结算 DAO 奖励以及总资金需求。
- baseRewardRate() ：按显式 stakingPool 地址查基础 rate，不依赖 info[0] 。
- setStakingPool(address) ：设置唯一 Epoch 调用方。
- setLockedPoolReward(pool, bonusBps, enabled) ：幂等配置长期池加成。
- addRecipient(recipient, rate) ：按地址幂等新增或更新普通 recipient。
- removeRecipient(index, recipient) ：清零指定 recipient（需地址匹配）。
- setAdjustment(index, add, rate, target) ：配置 recipient rate 的渐变调整。
- distributeEpochRewards() ：任何地址可调用的公开触发入口，时钟完全以 StakingPool 为准。
- settleEpochRewards(epochNumber) ：仅由 StakingPool 调用的原子结算回调。

RewardManager 不保存 `epochLength` 或 `nextEpochTime`，也不提供独立 Epoch 重置入口；唯一时钟是 `StakingPool.epoch`。

### 视图函数

| 函数 | 说明 |
| --- | --- |
| `nextRewardAt(uint256 _rate)` | 按 ppm rate 预估下一轮奖励：`circulatingSupply × rate / 1,000,000`。源码 `:319` |
| `nextRewardFor(address _recipient)` | 按地址查该 recipient 下一轮奖励。源码 `:324` |
| `baseRewardRate()` | 基础 Rebase rate（ppm）。源码 `:334` |
| `recipientCount()` | 普通 recipient 数量。源码 `:345` |
| `lockedPoolRewardCount()` | 长期池奖励配置数量。源码 `:349` |

### Admin / 状态修改函数

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `addRecipient(address _recipient, uint256 _rewardRate)` | `onlyOwner` | 幂等新增或更新普通 recipient 的 ppm rate。源码 `:354` |
| `removeRecipient(uint256 _index, address _recipient)` | `onlyOwner` | 清零指定 index 的 recipient（需 `_recipient == info[_index].recipient`）。源码 `:372` |
| `setAdjustment(uint256 _index, bool _add, uint256 _rate, uint256 _target)` | `onlyOwner` | 配置 recipient rate 的渐变调整（加/减至 target）。源码 `:380` |
| `setDaoRewardAddress(address _dao)` | `onlyOwner` | 更新 DAO 奖励地址（不可为零地址）。源码 `:390` |
| `setDaoRewardRatio(uint256 _newRatio)` | `onlyOwner` | 更新本期实际 Rebase profit 的 DAO 奖励比例，要求 `_newRatio <= 500`。源码 `:397` |
| `setSAgx(address _sAGX)` | `onlyOwner` | 更新 sAGX 地址（不可为零地址）。源码 `:404` |
| `setStakingPool(address _stakingPool)` | `onlyOwner` | 设置唯一 Epoch 调用方（不可为零地址）。源码 `:410` |
| `setLockedPoolReward(address _pool, uint256 _bonusBps, bool _enabled)` | `onlyOwner` | 幂等配置长期池加成，`_bonusBps <= 10_000`。源码 `:416` |
| `distributeEpochRewards()` | 公开 | 任何地址可调用，触发 StakingPool rebase。源码 `:149` |
| `settleEpochRewards(uint256 _epochNumber)` | 仅 `stakingPool` | 原子结算回调。源码 `:163` |

### 事件

| 事件 | 说明 |
| --- | --- |
| `RecipientAdded(uint256 indexed index, address recipient, uint256 rate)` | 新增 recipient |
| `RecipientRateUpdated(uint256 indexed index, address recipient, uint256 oldRate, uint256 newRate)` | 更新 recipient rate |
| `RecipientRemoved(uint256 indexed index, address recipient)` | 移除 recipient |
| `AdjustmentSet(uint256 indexed index, bool add, uint256 rate, uint256 target)` | 设置渐变调整 |
| `DaoRewardAddressUpdated(address indexed oldDao, address indexed newDao)` | DAO 地址变更 |
| `DaoRewardRatioUpdated(uint256 oldRatio, uint256 newRatio)` | DAO 比例变更 |
| `SAgxUpdated(address indexed oldSAgx, address indexed newSAgx)` | sAGX 地址变更 |
| `StakingPoolUpdated(address indexed oldStakingPool, address indexed newStakingPool)` | StakingPool 地址变更 |
| `LockedPoolRewardConfigured(address indexed pool, uint256 bonusBps, bool enabled)` | 长期池加成配置 |
| `LockedPoolRewardDistributed(address indexed pool, uint256 indexed epochNumber, uint256 principal, uint256 bonusRatePpm, uint256 amount, uint256 extraIndex)` | 长期池奖励分发 |

源码：`src/RewardManager.sol:84-115`

### 错误码

| 错误 | 说明 |
| --- | --- |
| `ErrorZeroAddress()` | 零地址非法 |
| `ErrorInvalidRewardRatio()` | `bonusBps > 10_000` |
| `ErrorUnauthorizedCaller()` | `settleEpochRewards` 调用方非 stakingPool |
| `ErrorInvalidStakingPoolBinding()` | `distributeEpochRewards` 中 stakingPool.rewardManager() 不指向本合约 |
| `ErrorEpochAlreadyDistributed()` | `_epochNumber <= lastDistributedEpoch` |
| `ErrorInvalidEpochNumber()` | epoch 号不等于 `currentEpochNumber - 1` 或 `currentEpochNumber == 0` |
| `ErrorTreasuryUnderfunded(uint256 required, uint256 available)` | Treasury excessReserves 不足本轮总分配 |

源码：`src/RewardManager.sol:117-129`

### 部署配置

完整部署后执行：

bash
```bash
npm run config:reward-manager
```

脚本会配置并回读 StakingPool、DaoPool、MarketFund 和三个长期 LockedStaking；180/360/540 天池分别配置为 1000/1500/2000 BPS。当前产品不部署 30/90 天 LockedStaking 实例。
