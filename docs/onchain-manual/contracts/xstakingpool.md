# XStakingPool (AegisXMiningPool) 合约文档

> 来源：`doc-contracts-xstakingpool`
> ABI：[`abis/xstakingpool.json`](../abis/xstakingpool.json)

## 完整 ABI

abi/AegisXMiningPool.json
SHA-256 6822894182cd…
91
51
14
26

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/xstakingpool.json`](../abis/xstakingpool.json)（91 entries）。

</details>

## XStakingPool (AegisXMiningPool) 合约文档

### 概述

`AegisXMiningPool` 是 AEGIS X 的 X 代币挖矿池。用户质押 gAGX（生息 AGX）来挖掘 X 代币。质押需要 24 小时预热期，预热后开始累积挖矿奖励。挖矿量受用户锁定本金配额限制。

**部署 key**: `XStakingPool`

**BNB Chain 主网 proxy**：`0x38af581462e25aABE1A25Ae128aE5a63aE015e1c`（当前实现已通过增量 release `f25c7887-1ec0-43a2-b16c-32de9dbbb314` 升级终验，`settleRewards()` 冷却时间为 86,400 秒）。

**ABI 路径**: `abi/AegisXMiningPool.json`

---

### 关键概念

#### 1. 挖矿机制

- 用户质押 gAGX（而非原始 AGX）
- 基于 yieldRateBP 按天计息：源码公式为 principal * yieldRateBP * elapsed / 10000 / 1 days
- 奖励以 X 代币和奖励价值（gAGX 计价）两种形式分配
- 使用累加器（accumulator）模式： accXPerGon 和 accRewardValuePerGon

#### 2. 预热期（Warmup）

- 新质押进入 24 小时预热
- 预热期内不产生奖励
- 预热到期后可调用 activateWarmup() 激活
- 取消预热已禁用（ cancelWarmup() 直接 revert）

#### 3. 挖矿配额

- miningQuotaOf(user) = 锁定本金总和 * maxStakeRatioBP / 10000
- 锁定本金来源固定配置为 EarlyStaking、三个 LockedStaking、三个 BondDepository、三个 BurnBondDepository
- 配额通过 setMiningQuotaSource() 配置
- miningQuotaOf(user) 把传入地址交给每个来源的 alias-aware getUserLockedPrincipal(user) ；A→B→C 后各来源仍解析 root A 的本金，因此迁移不会丢失配额，也不需要复制本金数组
- 本轮会重新部署 XStakingPool 及 10 个本金来源；前端必须固定本轮配置和只读终验通过后的最终完整 manifest，不得使用六地址基线或混用历史快照

#### 4. 奖励结算

- settleRewards() 更新 X/AGX 价格比
- 价格通过 LP 交易对获取
- 每次结算后更新 xPerAgx
- 两次成功结算至少间隔 SETTLEMENT_COOLDOWN = 24 hours ；首次显式调用立即允许
- 冷却由独立 lastSettlementTime 记录，不受用户操作更新 lastRewardTime 的影响
- 结算读取的是调用所在区块的 Pair 即时储备；当前没有 TWAP/价格偏差门禁。管理员/操作员必须避免在储备异常波动时结算，并在生产上线前接入经审计的可信价格方案

#### 5. 提取流程

- 调用 startUnstake() 开始退出
- 本金通过 principalReleaseVault 线性释放
- 已累积的 claimableX 仍可领取

---

### 前端 API

`stakes(address)` 是原始 public mapping getter，不会解析迁移别名。A→B→C 后若要展示底层结构，先用 `AccountMigrationManager.migratedFrom(current)` 取得首次 root（零地址时使用 current），再调用 `stakes(root)`；`miningStakeAmountOf`、`miningQuotaOf`、`pendingReward` 等业务 view 可直接传当前 canonical 地址。

#### 视图函数

##### miningStakeAmountOf(address) -> (uint256)

返回用户的挖矿质押总量（含预热中）。

js
```js
const staked = await xPool.miningStakeAmountOf(userAddress);
console.log('Mining stake:', ethers.formatUnits(staked, 9), 'gAGX');
```

##### miningQuotaOf(address) -> (uint256)

返回用户的挖矿配额上限。

js
```js
const quota = await xPool.miningQuotaOf(userAddress);
console.log('Mining quota:', ethers.formatUnits(quota, 9), 'gAGX');
```

##### pendingReward(address) -> (uint256)

返回用户待领取的 X 代币数量。

js
```js
const pending = await xPool.pendingReward(userAddress);
console.log('Pending X:', ethers.formatUnits(pending, 18));
```

##### pendingRewardValue(address) -> (uint256)

返回用户待领取奖励的 gAGX 价值。

js
```js
const value = await xPool.pendingRewardValue(userAddress);
console.log('Reward value:', ethers.formatUnits(value, 9), 'gAGX');
```

##### 管理员视图

js
```js
const yieldRate = await xPool.yieldRateBP(); // 按天计息的 BP 参数
const maxStakeRatio = await xPool.maxStakeRatioBP(); // 质押比例
const xPerAgx = await xPool.xPerAgx(); // X/AGX 价格比
const totalGons = await xPool.totalGons(); // 总 gons
const activeGons = await xPool.activeGons(); // 活跃 gons
const lastReward = await xPool.lastRewardTime(); // 上次奖励时间
const lastSettlement = await xPool.lastSettlementTime(); // 上次成功价格结算时间，0 表示尚未调用
const settlementCooldown = await xPool.SETTLEMENT_COOLDOWN(); // 固定 24 小时
```

##### stakes(address) -> (gons, warmupGons, warmupStartTime, warmupEndTime, rewardStartTime)

查看用户质押详情。

js
```js
const s = await xPool.stakes(userAddress);
console.log('Active gons:', s.gons);
console.log('Warmup gons:', s.warmupGons);
if (s.warmupEndTime > 0n) {
  console.log('Warmup ends:', new Date(Number(s.warmupEndTime) * 1000).toLocaleString());
}
```

##### rewardPricePair() -> (address)

返回 AGX/X 价格 LP 地址。gAGX 的奖励价值按其底层 AGX 1:1 价值计价。

---

#### 状态修改函数

##### stakeGagxForMining(uint256 _amount)

质押 gAGX 进行挖矿。

**前提条件:**

- _amount > 0
- 用户有足够的 gAGX
- 未超过挖矿配额

**事件:**

- Staked(user, amount, gons, warmupEndTime, timestamp)

js
```js
async function stakeForMining(xPool, gagxContract, amount, signer) {
  const user = await signer.getAddress();

  // 1. 检查余额
  const balance = await gagxContract.balanceOf(user);
  if (balance < amount) {
    throw new Error('Insufficient gAGX balance');
  }

  // 2. 检查配额
  const quota = await xPool.miningQuotaOf(user);
  const current = await xPool.miningStakeAmountOf(user);
  if (current + amount > quota) {
    console.log('Warning: exceeds mining quota, may be rejected');
  }

  // 3. 授权
  await (await gagxContract.approve(await xPool.getAddress(), amount)).wait();

  // 4. 质押
  const tx = await xPool.connect(signer).stakeGagxForMining(amount);
  const receipt = await tx.wait();

  const event = receipt.logs.find(
    l => xPool.interface.parseLog(l)?.name === 'Staked'
  );
  const parsed = xPool.interface.parseLog(event);
  console.log('Staked!');
  console.log('Warmup ends:', new Date(Number(parsed.args.warmupEndTime) * 1000).toLocaleString());
}
```

##### activateWarmup()

激活预热完成的质押。

**前提条件:**

- 有预热中的 gons
- block.timestamp >= warmupEndTime

js
```js
async function activateMiningWarmup(xPool, signer) {
  const user = await signer.getAddress();
  const s = await xPool.stakes(user);

  if (s.warmupGons === 0n) {
    console.log('No warmup pending');
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now < Number(s.warmupEndTime)) {
    const hoursLeft = (Number(s.warmupEndTime) - now) / 3600;
    console.log(`Warmup still active, ${hoursLeft.toFixed(1)} hours remaining`);
    return;
  }

  const tx = await xPool.connect(signer).activateWarmup();
  await tx.wait();
  console.log('Warmup activated, now earning rewards!');
}
```

##### claimReward()

领取已累积的 X 代币奖励。

js
```js
async function claimXReward(xPool, signer) {
  const user = await signer.getAddress();
  const pending = await xPool.pendingReward(user);

  if (pending === 0n) {
    console.log('No X rewards to claim');
    return;
  }

  console.log('Claiming:', ethers.formatUnits(pending, 18), 'X tokens');

  const tx = await xPool.connect(signer).claimReward();
  const receipt = await tx.wait();

  const event = receipt.logs.find(
    l => xPool.interface.parseLog(l)?.name === 'RewardClaimed'
  );
  const parsed = xPool.interface.parseLog(event);
  console.log('Claimed X:', ethers.formatUnits(parsed.args.XAmount, 18));
  console.log('Reward value:', ethers.formatUnits(parsed.args.rewardValueGagx, 9), 'gAGX');
}
```

##### startUnstake()

开始退出挖矿，质押的 gAGX 进入线性释放。

**前提条件:**

- 无预热中的 gons
- 有活跃质押
- principalReleaseVault 已设置

js
```js
async function startMiningUnstake(xPool, signer) {
  const user = await signer.getAddress();
  const s = await xPool.stakes(user);

  if (s.gons === 0n) {
    console.log('No active stake');
    return;
  }

  if (s.warmupGons > 0n) {
    console.log('Cannot unstake while warmup is pending');
    return;
  }

  const tx = await xPool.connect(signer).startUnstake();
  await tx.wait();
  console.log('Unstake started, gAGX entering release vault');
}
```

#### 管理/Operator 写方法

- settleRewards() ：按当前 AGX/X Pair 储备结算价格与奖励，只允许 owner/operator；两次成功调用至少间隔 24 小时，冷却中回滚 ErrorSettlementCooldown(nextAllowedTime) 。
- injectRewards(rewardAmount, 0) ：给池子补充 X；先对 XStakingPool 授权 X。第二参数当前未使用，但 ABI 调用仍必须传入。

成功后分别监听 `RewardSettlement` / `RewardFunded` 并刷新池内 X 余额、`xPerAgx`、累计器和用户 pending。

---

### 事件

#### Staked(address indexed user, uint256 amount, uint256 gons, uint256 warmupEndTime, uint256 timestamp)

质押时触发。

#### WarmupActivated(address indexed user, uint256 amount, uint256 reward, uint256 timestamp)

预热激活时触发。

#### RewardClaimed(address indexed user, uint256 XAmount, uint256 rewardValueGagx, uint256 timestamp)

领取 X 奖励时触发。

#### Unstaked(address indexed user, uint256 amount, uint256 rawGons, uint256 timestamp)

开始退出时触发。

#### YieldRateUpdated(uint256 bp, uint256 timestamp)

收益率更新时触发。

#### RewardSettlement(uint256 xPerAgx, uint256 elapsed, uint256 rewardValueGagx, uint256 xReward, uint256 timestamp)

奖励结算时触发。

#### RewardFunded(uint256 amount, uint256 poolBalance, uint256 timestamp)

注入奖励时触发。

#### WarmupExitRejected(address indexed user, uint256 timestamp)

预热取消被拒绝时触发（源码 :186）。当前 `cancelWarmup` 在 `ErrorWarmupExitDisabled` 下 revert，不会触发本事件；保留用于启用取消路径时。

#### RewardPricePairUpdated(address indexed pair, uint256 timestamp)

`setRewardPricePair` 切换 AGX/X LP 时触发（源码 :196）。

#### MiningQuotaSourceUpdated(address[] principalSources, uint256 timestamp)

`setMiningQuotaSource` 重置挖矿配额来源列表时触发（源码 :198）。

#### MaxStakeRatioUpdated(uint256 bp, uint256 timestamp)

`setMaxStakeRatioBP` 调整质押配额比例时触发（源码 :200）。

#### PrincipalReleaseVaultUpdated(address indexed vault, uint256 timestamp)

`setPrincipalReleaseVault` 切换本金释放入口（当前指向 `AegisSplitterManager`）时触发（源码 :202）。

---

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorAmountZero()` | 金额为 0 | 增加金额 |
| `ErrorStakeNotExist()` | 无活跃质押 | 先质押 |
| `ErrorStillLocked()` | 预热未到期 | 等待预热结束 |
| `ErrorNoWarmup()` | 无预热中 gons | 检查质押状态 |
| `ErrorWarmupPending()` | 有预热中的 gons | 先激活或等待 |
| `ErrorMiningQuotaExceeded(user, requested, quota)` | 超过挖矿配额 | 增加锁定本金 |
| `ErrorRewardPricePairNotSet()` | LP 未设置 | 联系管理员 |
| `ErrorSettlementPriceNotSet()` | 价格未结算 | 等待管理员 settle |
| `ErrorSettlementCooldown(nextAllowedTime)` | 距离上次成功结算不足 24 小时 | 等待到 `nextAllowedTime` 后重试 |
| `ErrorPrincipalReleaseVaultNotSet()` | 分流器 Manager 未设置 | 联系管理员配置 `AegisSplitterManager` |
| `ErrorWarmupExitDisabled()` | 取消预热已禁用 | 无法取消 |
| `ErrorZeroAddress()` | 传入 address(0) | 传入有效地址 |
| `ErrorInvalidRewardPair()` | `setRewardPricePair` 校验失败（非 PancakePair / token 不匹配） | 使用正确的 AGX/X LP |
| `ErrorEmptyRewardPair()` | 价格对储备为 0 | 等池子有流动性后再设置 |
| `ErrorInvalidRatio()` | `setMaxStakeRatioBP` 超过 `MAX_STAKE_RATIO_BP(20000)` | 使用 ≤ 20000 的 BP 值 |
| `ErrorYieldRateTooHigh()` | `setYieldRate` 的 `_bp > BASE_100(10000)` | 使用 ≤ 10000 的 BP 值 |
| `ErrorCallerNotAuthorized()` | 非 owner/operator 调用受限 setter（如 `setYieldRate`） | 由 owner 或 operator 调用 |
| `XMiningPoolMigratedAccount(address account)` | `migrateAccount` 涉及已迁移/有历史状态的地址 | 使用 canonical 地址 |
| `XMiningPoolNotMigrationManager(address caller)` | 非 migrationManager 调用 `migrateAccount` | 仅由迁移管理器调用 |
| `MigrationManagerImmutable(address currentManager)` | 已设非零 manager 后改成不同地址 | 保留相同地址 |

---

### 调用示例

#### 挖矿仪表盘

js
```js
async function miningDashboard(xPool, userAddress) {
  const [stakeInfo, staked, quota, pending, pendingValue, gagxBalance] = await Promise.all([
    xPool.stakes(userAddress),
    xPool.miningStakeAmountOf(userAddress),
    xPool.miningQuotaOf(userAddress),
    xPool.pendingReward(userAddress),
    xPool.pendingRewardValue(userAddress),
    xPool.gAGX(),
  ]);

  const gagx = new Contract(gagxBalance, ERC20_ABI, provider);
  const gagxDecimals = await gagx.decimals?.() ?? 9;

  console.log('=== X Mining Dashboard ===');
  console.log('Staked:', ethers.formatUnits(staked, gagxDecimals), 'gAGX');
  console.log('Quota:', ethers.formatUnits(quota, gagxDecimals), 'gAGX');
  console.log('Utilization:', (Number(staked) / Number(quota) * 100).toFixed(1) + '%');

  if (stakeInfo.warmupGons > 0n) {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(stakeInfo.warmupEndTime) - now;
    console.log('Warmup:', (remaining / 3600).toFixed(1), 'hours remaining');
  } else if (stakeInfo.gons > 0n) {
    console.log('Status: Active, earning rewards');
  }

  console.log('Pending X:', ethers.formatUnits(pending, 18));
  console.log('Reward value:', ethers.formatUnits(pendingValue, gagxDecimals), 'gAGX');
}
```

---

### 依赖合约

| 合约 | 用途 |
| --- | --- |
| gAGX (RedeemableGAGXPrincipal) | 质押代币 |
| X | 挖矿奖励代币 |
| RewardPricePair (LP) | AGX/X 价格 |
| AegisSplitterManager / AegisSplitter | 本金退出经 Manager 路由的线性释放 |
| StakingPool | epoch 查询 |
| EarlyStaking / LockedStaking×3 / BondDepository×3 / BurnBondDepository×3 | alias-aware 挖矿配额来源（共 10 个） |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `WARMUP_PERIOD` | 24 小时 | 预热期（常量） | - |
| `SETTLEMENT_COOLDOWN` | 24 小时 | 两次成功 `settleRewards()` 的最短间隔（常量） | - |
| `yieldRateBP` | 1 | 按天计息的 BP 参数，公式分母为 `10000 * 1 days` | owner/operator |
| `maxStakeRatioBP` | 10000 (100%) | 质押配额比例，上限 `MAX_STAKE_RATIO_BP = 20000`（200%）；由 `setMaxStakeRatioBP` 设置，超过上限 revert `ErrorInvalidRatio` | owner |
| `principalSources` | 初始化后设置 | 挖矿配额来源 | owner |
| `rewardPricePair` | 初始化时设置 | AGX/X LP 地址 | owner |
| `principalReleaseVault` | 初始化后设置 | 本金释放入口（指向 `AegisSplitterManager`） | owner |
| `operators` | 初始化后设置 | 操作员列表（`setBondOperator`），`setYieldRate`/`settleRewards`/`injectRewards` 允许 owner 或 operator | owner |

### Setter 汇总

| Setter | 权限 | 说明 |
| --- | --- | --- |
| `setMaxStakeRatioBP(uint256)` | owner | 设置 `maxStakeRatioBP`，≤ `MAX_STAKE_RATIO_BP(20000)` |
| `setMiningQuotaSource(address[] calldata)` | owner | 重置 `principalSources` 挖矿配额来源列表 |
| `setRewardPricePair(address)` | owner | 设置 AGX/X LP，校验通过才生效 |
| `setPrincipalReleaseVault(address)` | owner | 设置本金释放入口（`AegisSplitterManager`），`address(0)` revert |
| `setYieldRate(uint256)` | owner / operator | 设置 `yieldRateBP`，≤ `BASE_100(10000)` |
| `setBondOperator(address, bool)` | owner | 增删 operator |
