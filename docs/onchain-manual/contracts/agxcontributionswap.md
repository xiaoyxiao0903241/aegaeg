# AgxContributionSwap (AegisAgxContributionSwap) 合约文档

> 来源：`doc-contracts-agxcontributionswap`
> ABI：[`abis/agxcontributionswap.json`](../abis/agxcontributionswap.json)

## 完整 ABI

abi/AegisAgxContributionSwap.json
SHA-256 991d287fb5c6…
85
50
13
22

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/agxcontributionswap.json`](../abis/agxcontributionswap.json)（85 entries）。

</details>

## AgxContributionSwap (AegisAgxContributionSwap) 合约文档

### 概述

`AegisAgxContributionSwap` 是 AEGIS X 的贡献点转换合约。用户销毁 AGX 代币获取贡献点（contribution points），销毁的 AGX 一部分被永久销毁，一部分注入 LP 流动性池。贡献点是参与复投（restake）的必需品。

**部署 key**: `AgxContributionSwap`

**ABI 路径**: `abi/AegisAgxContributionSwap.json`

---

### 关键概念

#### 1. AGX 销毁与贡献点

用户调用 `convert(agxAmount)` 时：

- burnAmount = agxAmount * burnSplitBps / 10000 → 销毁到 dead 地址
- injectAmount = agxAmount - burnAmount → 转入 xLpInjector 地址
- contributionAmount = agxAmount * contributionRateBps / 10000 → 用户获得贡献点

默认配置：

- burnSplitBps = 5000 → 50% 销毁，50% 注入 LP
- contributionRateBps → 贡献点转化率（可配置）
- contributionDivisor = 6 → 贡献消耗除数

#### 2. 贡献消耗

- consumeContribution(user, rewardAmount) 由授权的 consumer 合约调用
- 消耗量 = rewardAmount / contributionDivisor
- 用于 RestakeLib 验证用户是否有足够贡献点

#### 3. 通缩机制

每次转换都销毁一部分 AGX，减少流通供应量：

- totalAgxBurned 记录累计销毁量
- totalAgxInjected 记录累计注入 LP 量

---

### 前端 API

#### 视图函数

##### quoteContributionOut(uint256 agxAmount) -> (uint256)

预览指定 AGX 数量可获得的贡献点。

js
```js
const agxAmount = ethers.parseUnits('100', 9); // 100 AGX
const contribution = await swap.quoteContributionOut(agxAmount);
console.log('Contribution points:', ethers.formatUnits(contribution, 9));
```

##### quoteSplit(uint256 agxAmount) -> (burnAmount, injectAmount)

预览 AGX 的销毁/注入分配。

js
```js
const [burn, inject] = await swap.quoteSplit(agxAmount);
console.log('Will burn:', ethers.formatUnits(burn, 9), 'AGX');
console.log('Will inject:', ethers.formatUnits(inject, 9), 'AGX');
```

##### quoteRequiredContribution(uint256 rewardAmount) -> (uint256)

预览指定奖励金额需要消耗的贡献点。

js
```js
const rewardAmount = ethers.parseUnits('10', 9); // 10 AGX
const needed = await swap.quoteRequiredContribution(rewardAmount);
console.log('Need contribution:', ethers.formatUnits(needed, 9));
```

##### getConfig() -> (agxToken, decimals, rateBps, isPaused, minIn, maxIn, totalBurned, totalContribution)

获取合约完整配置。

js
```js
const config = await swap.getConfig();
console.log('AGX:', config.agxToken);
console.log('Rate:', Number(config.rateBps_) / 100, '%');
console.log('Paused:', config.isPaused);
console.log('Min:', ethers.formatUnits(config.minIn, 9));
console.log('Max:', ethers.formatUnits(config.maxIn, 9));
console.log('Total burned:', ethers.formatUnits(config.totalBurned, 9));
console.log('Total contribution:', ethers.formatUnits(config.totalContribution, 9));
```

##### getSplitConfig() -> (injector, splitBps, totalIn, totalBurned, totalInjected)

获取销毁分配配置。

js
```js
const split = await swap.getSplitConfig();
console.log('LP injector:', split.injector);
console.log('Split:', Number(split.splitBps) / 100, '%');
```

##### 用户数据

js
```js
// 公开 mapping
const root = await swap.originalOf(userAddress);
const userContrib = await swap.userContribution(root);
const userBurned = await swap.userAgxBurned(userAddress);
const userIn = await swap.userAgxIn(userAddress);
const userConsumed = await swap.userContributionConsumed(userAddress);
```

##### 管理员视图

js
```js
const contributionRate = await swap.contributionRateBps();
const burnSplit = await swap.burnSplitBps();
const divisor = await swap.contributionDivisor();
const minAgxIn = await swap.minAgxIn();
const maxAgxIn = await swap.maxAgxIn();
const paused = await swap.paused();
const xLpInjector = await swap.xLpInjector();
```

---

#### 状态修改函数

##### convert(uint256 agxAmount)

销毁 AGX 获取贡献点。

**前提条件:**

- 合约未暂停
- agxAmount > 0
- agxAmount >= minAgxIn （如果设置）
- agxAmount <= maxAgxIn （如果设置）
- 用户有足够的 AGX
- xLpInjector 已设置（如果有注入部分）

**事件:**

- ContributionConverted(user, agxAmount, burnedAmount, injectedAmount, contributionAmount, rateBps, burnSplitBps)

js
```js
async function convertAgx(swapContract, agxContract, agxAmount, signer) {
  const user = await signer.getAddress();

  // 1. 检查状态
  if (await swapContract.paused()) {
    throw new Error('Conversion is paused');
  }

  // 2. 检查限额
  const minIn = await swapContract.minAgxIn();
  const maxIn = await swapContract.maxAgxIn();
  if (minIn > 0n && agxAmount < minIn) {
    throw new Error(`Minimum: ${ethers.formatUnits(minIn, 9)} AGX`);
  }
  if (maxIn > 0n && agxAmount > maxIn) {
    throw new Error(`Maximum: ${ethers.formatUnits(maxIn, 9)} AGX`);
  }

  // 3. 预览
  const [contribution] = await Promise.all([
    swapContract.quoteContributionOut(agxAmount),
  ]);
  const [burn, inject] = await swapContract.quoteSplit(agxAmount);
  console.log('Burning:', ethers.formatUnits(burn, 9), 'AGX');
  console.log('Injecting:', ethers.formatUnits(inject, 9), 'AGX');
  console.log('Getting:', ethers.formatUnits(contribution, 9), 'contribution');

  // 4. 授权 AGX
  await (await agxContract.approve(await swapContract.getAddress(), agxAmount)).wait();

  // 5. 转换
  const tx = await swapContract.connect(signer).convert(agxAmount);
  const receipt = await tx.wait();

  console.log('Conversion successful!');
  console.log('New contribution balance:',
    ethers.formatUnits(await swapContract.userContribution(await swapContract.originalOf(user)), 9));
}
```

##### setRateBps(uint256 newRateBps) — onlyAuthorized（owner + operators）

设置贡献转化率 `contributionRateBps`（BPS，必须非零，`0` 直接 revert `ErrorZeroRate`）。触发 `RateUpdated`。

##### setBurnSplitBps(uint256 newSplitBps) — onlyAuthorized（owner + operators）

设置销毁比例 `burnSplitBps`（>10000 拒绝）。触发 `BurnSplitBpsUpdated`。

##### setXLpInjector(address newInjector) — onlyOwner

设置 LP 注入地址。触发 `XLpInjectorUpdated`。

##### setContributionDivisor(uint256 newDivisor) — onlyOwner

设置贡献消耗除数（范围 2-20）。触发 `ContributionDivisorUpdated`。

##### setConsumer(address consumer, bool enabled) — onlyOwner

授权/撤销 consumer 合约（可调用 `consumeContribution`）。触发 `ConsumerUpdated`。

##### consumeContribution(address user, uint256 rewardAmount) -> (uint256 usedContribution) — 仅授权 consumer

按 `rewardAmount / contributionDivisor` 消耗用户的贡献点。触发 `ContributionConsumed`。

##### setPaused(bool flag) — onlyAuthorized（owner + operators）

暂停/恢复转换。触发 `PausedUpdated`。

##### setLimits(uint256 newMinAgxIn, uint256 newMaxAgxIn) — onlyOwner

设置单笔转换最小/最大限额（0 表示不限）。触发 `LimitsUpdated`。

##### setOperator(address operator, bool enabled) — onlyOwner

授权/撤销 operator。触发 `OperatorUpdated`。

##### emergencyWithdraw(address token, address to, uint256 amount) — onlyOwner

紧急提取合约内任意 ERC20 代币。触发 `EmergencyWithdrawn`。

##### setMigrationManager(address _manager) — onlyOwner

设置账户迁移管理器（`migrationManager` 设为非零后不可更改，触发 `MigrationManagerImmutable`）。

##### migrateAccount(address oldAccount, address newAccount) — 仅 migrationManager

将 `oldAccount` 的贡献/累计数据别名映射到 `newAccount`（仅写别名，不搬运数据）。`newAccount` 必须无历史状态。

##### originalOf(address a) -> (address) — 视图

返回账户的原始根账户（迁移链起点）。

##### canonicalOf(address a) -> (address) — 视图

返回账户的规范地址（沿 `migratedTo` 链解析到当前活跃账户）。

---

### 事件

#### ContributionConverted(address indexed user, uint256 agxAmount, uint256 burnedAmount, uint256 injectedAmount, uint256 contributionAmount, uint256 rateBps, uint256 burnSplitBps)

AGX 转换时触发。

js
```js
swap.on('ContributionConverted', (user, agxAmount, burned, injected, contribution) => {
  console.log(`${user} converted ${ethers.formatUnits(agxAmount, 9)} AGX`);
  console.log(`Burned: ${ethers.formatUnits(burned, 9)}, Got: ${ethers.formatUnits(contribution, 9)} contribution`);
});
```

#### ContributionConsumed(address indexed consumer, address indexed user, uint256 rewardAmount, uint256 contributionAmount)

贡献点被消耗时触发（由 consumer 合约调用）。

#### RateUpdated(uint256 oldRateBps, uint256 newRateBps)

转换率更新时触发。

#### BurnSplitBpsUpdated(uint256 oldSplitBps, uint256 newSplitBps)

销毁比例更新时触发。

#### PausedUpdated(bool paused)

`setPaused` 切换暂停状态时触发。

#### LimitsUpdated(uint256 minAgxIn, uint256 maxAgxIn)

`setLimits` 修改限额时触发。

#### OperatorUpdated(address indexed operator, bool enabled)

`setOperator` 授权/撤销 operator 时触发。

#### XLpInjectorUpdated(address indexed oldInjector, address indexed newInjector)

`setXLpInjector` 修改 LP 注入地址时触发。

#### ContributionDivisorUpdated(uint256 oldDivisor, uint256 newDivisor)

`setContributionDivisor` 修改除数时触发。

#### ConsumerUpdated(address indexed consumer, bool enabled)

`setConsumer` 授权/撤销 consumer 时触发。

#### EmergencyWithdrawn(address indexed token, address indexed to, uint256 amount)

`emergencyWithdraw` 提取代币时触发。

---

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorPaused()` | 合约已暂停 | 等待恢复 |
| `ErrorZeroAmount()` | 金额为 0 | 增加金额 |
| `ErrorBelowMin(amount, minAmount)` | 低于最小限额 | 增加金额 |
| `ErrorAboveMax(amount, maxAmount)` | 超过最大限额 | 减少金额 |
| `ErrorInsufficientContribution(user, available, required)` | 贡献点不足 | 转换更多 AGX |
| `ErrorBurnAmountMismatch(expected, actual)` | 销毁数量不匹配 | 重试或报告 |
| `ErrorInjectAmountMismatch(expected, actual)` | 注入数量不匹配 | 重试或报告 |
| `ErrorCallerNotAuthorized()` | consumer 未授权 | 联系管理员 |
| `ErrorZeroAddress()` | 地址为零 | 使用非零地址 |
| `ErrorZeroRate()` | `contributionRateBps` 为 0 | 设置非零汇率 |
| `ErrorInvalidLimits(minAmount, maxAmount)` | 限额配置非法（max<min） | 修正限额 |
| `ErrorInvalidSplitBps(splitBps)` | `burnSplitBps > 10000` | 设置 ≤10000 |
| `ErrorInvalidDivisor(divisor)` | 除数不在 2-20 范围 | 设置 2-20 |
| `ErrorAccountMigrated(oldAccount)` | 账户已迁移或目标已有状态 | 使用规范地址 |
| `ErrorNotMigrationManager(caller)` | 非 `migrationManager` 调用迁移 | 检查调用者 |
| `MigrationManagerImmutable(currentManager)` | `migrationManager` 已设且试图改 | 保持原管理器 |

---

### 调用示例

#### 贡献点仪表盘

js
```js
async function contributionDashboard(swapContract, userAddress) {
  const [contrib, burned, consumed, config] = await Promise.all([
    swapContract.userContribution(await swapContract.originalOf(userAddress)),
    swapContract.userAgxBurned(userAddress),
    swapContract.userContributionConsumed(userAddress),
    swapContract.getConfig(),
  ]);

  console.log('=== Contribution Dashboard ===');
  console.log('Available:', ethers.formatUnits(contrib, 9), 'points');
  console.log('Total burned:', ethers.formatUnits(burned, 9), 'AGX');
  console.log('Total consumed:', ethers.formatUnits(consumed, 9), 'points');
  console.log('Rate:', Number(config.rateBps_) / 100, '%');

  // 预览转换
  const testAmount = ethers.parseUnits('100', 9);
  const [newContrib] = await Promise.all([
    swapContract.quoteContributionOut(testAmount),
  ]);
  console.log(`\nConverting 100 AGX would give: ${ethers.formatUnits(newContrib, 9)} points`);
}
```

---

### 依赖合约

| 合约 | 用途 |
| --- | --- |
| AGX | 销毁代币 |
| RestakeConfig | 贡献消耗验证 |
| RestakeLib | `consumeContribution()` 调用 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `contributionRateBps` | 初始化时设置 | 贡献转化率（BPS） | owner/operator |
| `burnSplitBps` | 5000 (50%) | 销毁/注入比例 | owner/operator |
| `contributionDivisor` | 6 | 贡献消耗除数 | owner |
| `minAgxIn` | 0（无限制） | 最小转换量 | owner |
| `maxAgxIn` | 0（无限制） | 最大转换量 | owner |
| `xLpInjector` | 初始化后设置 | LP 注入地址 | owner |
| `paused` | false | 是否暂停 | owner/operator |
| `operators` | 初始化后设置 | 操作员列表 | owner |
| `consumers` | 初始化后设置 | 消耗授权列表 | owner |
