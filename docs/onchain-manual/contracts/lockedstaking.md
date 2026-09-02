# LockedStaking 合约文档

> 来源：`doc-contracts-lockedstaking`
> ABI：[`abis/lockedstaking.json`](../abis/lockedstaking.json)

## 完整 ABI

abi/LockedStaking.json
SHA-256 e01df5b0e22d…
109
61
14
34

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/lockedstaking.json`](../abis/lockedstaking.json)（109 entries）。

</details>

## LockedStaking 合约文档

### 概述

`LockedStaking` 是 AEGIS X 的定期质押合约。用户质押 AGX 获得 sAGX 利息，本金按线性释放（vesting），利息可以通过混合模式（release + restake）领取。每个用户可拥有多个质押仓位，每个仓位有独立的 `periodTime`（锁定期）。

**部署 key**: `LockedStaking180d` / `LockedStaking360d` / `LockedStaking540d`

**BNB Chain 主网地址**（当前实现已通过增量 release `f25c7887-1ec0-43a2-b16c-32de9dbbb314` 升级终验）：180d `0xb64C7718F372eB7792EdE434f93F0b556e444406`、360d `0xCA6bf54Dd4f7D05CA1b0C34Da4AC8fBC97dD8CeD`、540d `0x5aa7e8996FE0661B3D487f660E6a043BCe000487`。

**ABI 路径**: `abi/LockedStaking.json`

---

### 关键概念

#### 1. 定期质押与线性释放

- 当前产品固定三个 periodTime ：180/360/540 天；同一源码部署为三个独立代理实例
- 本金按时间线性释放： releaseRate = elapsed * 10000 / vesting
- claimPrincipal() 提取已释放的本金
- 未释放部分仍继续释放
- 已释放本金不会直接转入钱包，而是经 AegisSplitterManager 路由到 AegisSplitterHead_* 等头部分流器，按创建时配置锁定的周期线性释放（新部署默认 30 天，新用户按 Manager 配置周期）
- 分流器 Manager 未配置时 claimPrincipal() 整笔交易回滚，禁止绕过释放规则

#### 2. 双利息系统

- Block Reward - sAGX gons 增长产生的利息
- Extra Interest - 基于 globalExtraIndex 的额外利息

额外利息只能由配置的 RewardManager 在真实 StakingPool Epoch 中通过 `applyEpochExtraReward` 原子写入。历史管理员入口 `updateGlobalIndex` 已废弃并始终回滚，避免产生没有 AGX 资金覆盖的账面奖励。`totalLockedPrincipal` 记录池级本金，RewardManager 按该值和 10%/15%/20% 的基础 Rebase 加成分别为 180/360/540 天实例计算实际铸币。

#### 3. Restake 混合模式

`claimRewardMixed()` 将利息分为两部分：

- release - 进入 RewardQueue 线性释放
- restake - 重新质押到 LockedStaking（或其他目标）获取更高收益

#### 4. 可选额度限制

LockedStaking 保留每日全局新增量和单 root 历史累计质押量两层门禁。`stakingLimit` 或 `singleAddressLimit` 为 `0` 时表示对应门禁关闭；大于 `0` 时，普通质押、代付质押和本池收益复投都会先检查并累计额度。提取本金不会返还 `userStakingAmounts[root]`，迁移后新地址继续使用首次 root 的历史累计值。

---

### 前端 API

#### 视图函数

##### getStakesCount(address) -> (uint256)

返回用户的质押仓位总数。

js
```js
const count = await lockedStaking.getStakesCount(userAddress);
console.log('Stake positions:', count);
```

##### getStake(address _user, uint256 _index) -> (StakeData)

获取指定仓位的详细数据。

**StakeData 返回值:**

- pending - 待释放本金
- blockReward - 区块利息（sAGX 增长）
- extraInterest - 额外利息
- claimableBalance - 可领取本金
- expiry - 到期时间

js
```js
const stake = await lockedStaking.getStake(userAddress, 0);
console.log('Pending principal:', ethers.formatUnits(stake.pending, 9), 'AGX');
console.log('Block reward:', ethers.formatUnits(stake.blockReward, 9), 'AGX');
console.log('Extra interest:', ethers.formatUnits(stake.extraInterest, 9), 'AGX');
console.log('Claimable:', ethers.formatUnits(stake.claimableBalance, 9), 'AGX');
```

##### getStakes(address, uint256 start, uint256 limit) -> (StakeData[])

分页获取用户仓位。

js
```js
const stakes = await lockedStaking.getStakes(userAddress, 0, 10);
stakes.forEach((s, i) => {
  console.log(`Stake ${i}: ${ethers.formatUnits(s.pending, 9)} pending, ${ethers.formatUnits(s.claimableBalance, 9)} claimable`);
});
```

##### getReleasedPrincipal(address, uint256 index) -> (uint256)

获取指定仓位当前可领取的本金。

js
```js
const claimable = await lockedStaking.getReleasedPrincipal(userAddress, 0);
console.log('Claimable principal:', ethers.formatUnits(claimable, 9), 'AGX');
```

##### getExtraReward(address, uint256 index) -> (uint256)

获取指定仓位的额外利息。

js
```js
const extra = await lockedStaking.getExtraReward(userAddress, 0);
console.log('Extra rewards:', ethers.formatUnits(extra, 9), 'AGX');
```

##### remainingStakeAmount() -> (uint256)

返回当前 UTC 日全局剩余额度。`stakingLimit == 0` 时返回 `type(uint256).max`；已使用量达到或超过限额时返回 0，避免下溢。

js
```js
const remaining = await lockedStaking.remainingStakeAmount();
console.log('Today remaining stake:', ethers.formatUnits(remaining, 9), 'AGX');
```

##### getUserLockedPrincipal(address) -> (uint256)

返回用户的总锁定本金。

##### 管理员视图

js
```js
const periodTime = await lockedStaking.periodTime(); // 锁定期（秒）
const warmupTime = await lockedStaking.warmupTime(); // 预热时间
const status = await lockedStaking.status(); // 是否开放
const globalIndex = await lockedStaking.globalExtraIndex(); // 全局额外利息索引
```

---

#### 状态修改函数

##### lockedStake(uint256 _amount)

质押 AGX。调用者为自己质押。

**前提条件:**

- 用户已绑定推荐关系
- _amount > 0
- 合约状态开放

**事件:**

- Staked(user, amount, stakeIndex, timestamp, periodTime, gonsDelta)

js
```js
async function lockedStake(lockedContract, agxContract, amount, signer) {
  const user = await signer.getAddress();

  // 1. 检查合约状态
  if (!await lockedContract.status()) {
    throw new Error('Staking is currently paused');
  }

  // 2. 检查推荐关系
  const referral = new Contract(await lockedContract.referral(), REFERRAL_ABI, signer);
  if (!await referral.isBindReferral(user)) {
    throw new Error('Must bind referral first');
  }

  // 3. 提交前应查询并检查所有已启用额度；额度为 0 时对应门禁关闭
  await (await agxContract.approve(await lockedContract.getAddress(), amount)).wait();

  // 5. 质押
  const tx = await lockedContract.connect(signer).lockedStake(amount);
  const receipt = await tx.wait();

  const event = receipt.logs.find(
    l => lockedContract.interface.parseLog(l)?.name === 'Staked'
  );
  const parsed = lockedContract.interface.parseLog(event);
  console.log('Staked at index:', parsed.args.stakeIndex);
  console.log('Period:', Number(parsed.args.periodTime) / 86400, 'days');

  return parsed.args.stakeIndex;
}
```

##### lockedStake(uint256 _amount, address _recipient)

该入口只允许 `restakeSources[msg.sender] == true` 的受信协议合约调用，用于把用户已经产生的收益复投到 `_recipient` 的定期仓位。普通用户不能通过该重载给其他地址代付或赠予质押；用户新购买必须调用单参数 `lockedStake(amount)`。

约束：

- _recipient 必须已绑定推荐关系。
- 调用者和 _recipient 都不能是已经迁移的旧地址。
- 仓位、本金统计和 Staked 事件归 _recipient 。
- 调用者只承担 AGX 转出，不获得该仓位的领取权。
- 该受信复投重载不会把协议奖励再次算作一笔新购买，也不会调用 Tracker，避免奖励复投重复增加 Lucky 累计或资格。

单参数 `lockedStake(amount)` 才是用户的新购买路径。它对价格换算和 Tracker 使用强原子调用；配置缺失或 Tracker/LuckyPool 失败会回滚整笔锁仓购买。收益复投入口不会允许终端用户指定其他受益人：上游协议固定把实际领取用户作为 recipient。

##### claimPrincipal(uint256 _index)

领取指定仓位按 Locked 周期已释放的本金，并经 `AegisSplitterManager` 路由到 `AegisSplitterHead_*` 创建按当前配置锁定周期的线性释放单；本次调用不会让钱包 AGX 立即增加。

js
```js
async function claimPrincipal(lockedContract, stakeIndex, signer) {
  // 1. 检查可领取本金
  const claimable = await lockedContract.getReleasedPrincipal(await signer.getAddress(), stakeIndex);
  if (claimable === 0n) {
    console.log('No principal to claim yet');
    return;
  }

  // 2. 领取
  const tx = await lockedContract.connect(signer).claimPrincipal(stakeIndex);
  await tx.wait();
  console.log('Principal release created via splitter (AegisSplitterManager):', ethers.formatUnits(claimable, 9), 'AGX');
}
```

##### claimRewardMixed(uint256 stakeIndex, uint256 amount, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)

领取利息，支持 release + restake 混合。

js
```js
async function claimReward(lockedContract, stakeIndex, signer) {
  const user = await signer.getAddress();

  // 1. 查看仓位
  const stake = await lockedContract.getStake(user, stakeIndex);
  if (stake.blockReward === 0n) {
    console.log('No reward to claim');
    return;
  }

  // 2. 配置释放
  const claimAmount = stake.blockReward; // 领取全部利息
  const releasePlanIndex = 1; // 20 天释放
  const restakePlanIndex = 0; // 复投到 LockedStaking
  const restakeBps = 5000; // 50% 复投

  const tx = await lockedContract.connect(signer).claimRewardMixed(
    stakeIndex, claimAmount, releasePlanIndex, restakePlanIndex, restakeBps
  );
  await tx.wait();
  console.log('Reward claimed');
}
```

##### claimExtraRewardMixed(uint256 stakeIndex, uint256 amount, uint8 releasePlanIndex, uint256 restakePlanIndex, uint256 restakeBps)

领取额外利息（extra interest）。用法与 `claimRewardMixed` 类似。

##### setRewardManager(address _rewardManager)

ADMIN_ROLE 设置 RewardManager（源码 `setRewardManager`，:770）。`address(0)` revert `ErrorZeroAddress`。触发 `RewardManagerUpdated(old, new)`。

##### setPrincipalReleaseVault(address _vault)

ADMIN_ROLE 设置本金释放入口（源码 `setPrincipalReleaseVault`，:763），当前指向 `AegisSplitterManager`（原 `PrincipalReleaseVault` 已于 2026-08-03 删除，ABI 归档 `archive/PrincipalReleaseVault/`）。`address(0)` revert `ErrorZeroAddress`。触发 `PrincipalReleaseVaultUpdated(old, new)`。未设置时 `claimPrincipal` 整笔回滚 `ErrorPrincipalReleaseVaultNotSet`。

##### applyEpochExtraReward(uint256 _epochNumber, uint256 _extraIndex, uint256 _rewardAmount)

仅 `rewardManager` 可调用（源码 `applyEpochExtraReward`，:720）。在真实 StakingPool Epoch 中原子写入额外利息：`expectedAmount = totalLockedPrincipal * _extraIndex / 1e9`，`_rewardAmount` 必须精确匹配，否则 revert `ErrorRewardAmountMismatch`；`_epochNumber <= lastEpoch` 或 `_extraIndex > 1e18` revert `ErrorEpoch`；非 RewardManager 调用 revert `ErrorUnauthorizedRewardManager`。更新 `lastEpoch` 与 `globalExtraIndex`，触发 `EpochExtraRewardApplied`。

##### setStakingLimitAmount(uint256 _stakingLimit, uint256 _singleLimit)

ADMIN_ROLE 同时设置 UTC 日全局新增限额与单 root 历史累计质押限额（源码 :736）。0 表示对应门禁关闭。触发 `StakingLimitsUpdated`。

##### setPeriodTime(uint256 _time) / setContract(address _stakingPool, address _rewardQueue) / setStatus(bool _status)

ADMIN_ROLE 配置入口（源码 :777 / :745 / :711）。`setContract` 任一参数为 `address(0)` revert `ErrorZeroAddress`。`updateGlobalIndex(uint256, uint256)` 已废弃，调用恒 revert `ErrorDeprecated`。

##### setMigrationManager(address _manager) / migrateAccount(address oldAccount, address newAccount)

ADMIN_ROLE 设置迁移管理器（源码 :840，一旦设非零 manager 后只允许设相同地址，否则 revert `MigrationManagerImmutable`）；`migrateAccount`（:848）仅由 `migrationManager` 调用，否则 revert `LockedStakingNotMigrationManager`。`newAccount` 必须从未有过仓位/本金/累计统计，否则 revert `LockedStakingMigratedAccount`。

---

### 事件

#### Staked(address indexed user, uint256 amount, uint256 stakeIndex, uint256 timestamp, uint256 periodTime, int256 gonsDelta)

质押时触发。

#### Claimed(address indexed user, uint256 amount, uint256 stakeIndex, uint256 timestamp, uint256 periodTime, int256 gonsDelta)

领取本金时触发。

#### RewardClaimed(...)

领取利息时触发。

#### ExtraRewardClaimed(...)

领取额外利息时触发。

#### RestakeClaimed(address indexed _user, uint256 _reward, uint256 _restakeAmount, uint256 _taxBP, uint256 _planIndex, uint256 _period, uint256 stakeIndex, uint256 timestamp, int256 gonsDelta)

复投时触发。

#### StakingLimitsUpdated(uint256 oldDailyGlobalLimit, uint256 newDailyGlobalLimit, uint256 oldSingleAddressLimit, uint256 newSingleAddressLimit, address indexed actor)

`setStakingLimitAmount` 更新两层限额时触发（源码 :149）。

#### PrincipalReleaseVaultUpdated(address indexed oldVault, address indexed newVault)

`setPrincipalReleaseVault` 切换本金释放入口（当前指向 `AegisSplitterManager`）时触发（源码 :151）。

#### RewardManagerUpdated(address indexed oldRewardManager, address indexed newRewardManager)

`setRewardManager` 切换 RewardManager 时触发（源码 :152）。

#### EpochExtraRewardApplied(uint256 indexed epochNumber, uint256 extraIndex, uint256 rewardAmount)

RewardManager 调用 `applyEpochExtraReward` 原子写入 epoch 额外利息时触发（源码 :156）。

---

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorAmountZero()` | 质押金额为 0 | 增加金额 |
| `ErrorStakeNotApproved()` | 未绑定推荐关系 | 先绑定 Referral |
| `ErrorStakeAmountLimit()` | 超过质押限制 | 减少金额或等待第二天 |
| `ErrorIndexOutOfBounds()` | 仓位索引无效 | 使用有效索引 |
| `ErrorStakeNotExist()` | 仓位不存在 | 检查索引 |
| `ErrorStakeWarmupPeriod()` | 预热期未过 | 等待预热结束 |
| `ErrorNotPrincipal()` | 无本金可领取 | 等待释放 |
| `ErrorExceedsBalance()` | 合约余额不足 | 联系管理员 |
| `ErrorExtraAmount()` | 额外利息不足 | 减少提取量 |
| `ErrorEpoch()` | epoch 参数无效 | 联系管理员 |
| `ErrorZeroAddress()` | 传入 address(0) | 传入有效地址 |
| `ErrorPrincipalReleaseVaultNotSet()` | 未配置 `AegisSplitterManager` 时调用 `claimPrincipal` | 先 `setPrincipalReleaseVault` 指向分流器 Manager |
| `ErrorUnauthorizedRewardManager()` | 非 RewardManager 调用 `applyEpochExtraReward` | 仅由配置的 RewardManager 调用 |
| `ErrorRewardAmountMismatch()` | `applyEpochExtraReward` 的 `_rewardAmount` 与 `totalLockedPrincipal * _extraIndex / 1e9` 不等 | RewardManager 须按公式精确铸币 |
| `ErrorDeprecated()` | 调用已废弃的 `updateGlobalIndex` | 改用 `applyEpochExtraReward` |
| `ErrorStakeFailure()` | 底层 StakingPool `stake` 返回 false | 检查 StakingPool 状态 |
| `LockedStakingMigratedAccount(address account)` | `migrateAccount` 的目标/源地址非法（自迁移/已迁移/有历史仓位） | 使用未参与过的 canonical 地址 |
| `LockedStakingNotMigrationManager(address caller)` | 非 migrationManager 调用 `migrateAccount` | 仅由迁移管理器调用 |
| `MigrationManagerImmutable(address currentManager)` | 已设非零 manager 后改成不同地址 | 保留相同地址 |

##### RestakeLib 复投错误（经 claimRewardMixed / claimExtraRewardMixed 可达）

`claimRewardMixed` / `claimExtraRewardMixed` 无条件调用 `RestakeLib.splitReward` / `consumeContribution`，若 `RestakeConfig` 或 `contributionLedger` 未配置会直接回滚。下列错误已编入 LockedStaking ABI，前端解码领取失败时需处理：

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorConfigNotSet()` | `restakeConfig` 未配置（地址 0） | 先调用 `setRestakeConfig` 配置 RestakeConfig |
| `ErrorContributionLedgerNotSet()` | `contributionLedger` 未配置 | 在 RestakeConfig 中配置 contributionLedger |
| `ErrorInvalidRestakeBps(uint256)` | `restakeBps > 10000` | 传入 ≤ 10000 的复投比例 |
| `ErrorRestakeBelowMinimum(uint256,uint256)` | 启用 forceRestake 且 `restakeBps < minRestakeBps` | 提高 restakeBps 或关闭 forceRestake |
| `ErrorInvalidRestakePlan()` | 复投目标计划未注册或地址为 0 | 在 RestakeConfig 注册有效计划 |

> 与 LiquidStaking 一致：`claimRewardMixed` / `claimExtraRewardMixed` 要求 `restakeConfig` 与 `contributionLedger` 已正确配置，否则即使 `_restakeBps == 0` 也会在 RestakeLib 内回滚。

---

### 调用示例

#### 查看用户所有仓位

js
```js
async function getUserStakes(lockedContract, userAddress) {
  const count = await lockedContract.getStakesCount(userAddress);
  const stakes = await lockedContract.getStakes(userAddress, 0, count);

  console.log(`Total positions: ${count}`);
  let totalPending = 0n, totalReward = 0n, totalClaimable = 0n;

  for (let i = 0; i < count; i++) {
    const s = stakes[i];
    totalPending += s.pending;
    totalReward += s.blockReward;
    totalClaimable += s.claimableBalance;

    const extra = await lockedContract.getExtraReward(userAddress, i);
    totalReward += extra;

    console.log(`Position ${i}:`);
    console.log(`  Pending: ${ethers.formatUnits(s.pending, 9)} AGX`);
    console.log(`  Rewards: ${ethers.formatUnits(s.blockReward + extra, 9)} AGX`);
    console.log(`  Claimable: ${ethers.formatUnits(s.claimableBalance, 9)} AGX`);
    console.log(`  Expires: ${new Date(Number(s.expiry) * 1000).toLocaleDateString()}`);
  }

  console.log(`\nTotal: ${ethers.formatUnits(totalPending, 9)} pending, ${ethers.formatUnits(totalReward, 9)} rewards, ${ethers.formatUnits(totalClaimable, 9)} claimable`);
}
```

---

### 依赖合约

| 合约 | 用途 |
| --- | --- |
| StakingPool | 底层质押 |
| sAGX | 生息代币 |
| Referral | 推荐关系验证 |
| RewardQueue | 利息释放 |
| RestakeConfig | 复投配置 |
| AegisSplitterManager / AegisSplitter | 必需；定期本金提取后经 Manager 路由按配置周期锁定的线性释放 |
| AegisDailyPurchaseTracker | 必需；仅用户单参数新购买路径原子记录，协议奖励复投不重复计入 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `periodTime` | 初始化时设置 | 锁定期（秒） | ADMIN_ROLE |
| `warmupTime` | 0 | 当前源码固定为 0，无外部 setter | - |
| `status` | true | 是否开放质押 | ADMIN_ROLE |
| `restakeConfig` | 初始化后设置 | 复投配置 | ADMIN_ROLE |
| `stakingLimit` | 0 | UTC 日全局新增限额；0=无限 | ADMIN_ROLE |
| `singleAddressLimit` | 部署参数，脚本默认 0 | 单 root 历史累计质押限额；0=无限 | ADMIN_ROLE |

`setStakingLimitAmount(dailyGlobal, singleRootCumulative)` 同时更新两项。新部署未配置时默认无限；代理升级不会自动清空旧 storage，若要关闭旧限额必须显式写 0。
