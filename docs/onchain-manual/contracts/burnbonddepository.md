# BurnBondDepository 合约文档

> 来源：`doc-contracts-burnbonddepository`
> ABI：[`abis/burnbonddepository.json`](../abis/burnbonddepository.json)

## 完整 ABI

abi/BurnBondDepository.json
SHA-256 54ca4a03b254…
107
52
15
40

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/burnbonddepository.json`](../abis/burnbonddepository.json)（107 entries）。

</details>

## BurnBondDepository 合约文档

### 概述

`BurnBondDepository` 与 BondDepository 功能相似，但关键区别在于：用户存入的 principle 代币会被**销毁**（转入 dead 地址）而非存入流动性储备。这实现了通缩机制，减少流通供应量。

Lucky 购买追踪是销毁债券购买交易的强原子组成部分。价格换算和 `AegisDailyPurchaseTracker.recordPurchase` 任一步失败都会回滚销毁转账、债券仓位、自动质押及相关事件，因此不会留下“资产已销毁但购买记录缺失”的部分成功状态。前端只在 receipt 成功后更新债券和 Lucky 状态。

**白皮书 7.1 基准**（销毁债券）：线性释放周期 180 / 360 / 540 天，动态折扣区间 85%-100% / 80%-100% / 75%-100%（与 LP 债券一致）。当前部署采用三个独立代理实例 `BurnBondDepository180d`、`BurnBondDepository360d`、`BurnBondDepository540d`，各实例的 `vestingTerm` 固定为对应期限；初始折扣分别由 `BOND_180D_DISCOUNT_RATE_BP`（默认 8500）、`BOND_360D_DISCOUNT_RATE_BP`（默认 8000）、`BOND_540D_DISCOUNT_RATE_BP`（默认 7500）配置。

**部署 key**: `BurnBondDepository`

**BNB Chain 主网 proxies**（当前实现已通过增量 release `f25c7887-1ec0-43a2-b16c-32de9dbbb314` 升级终验）：180d `0x7E45475E5729578eb4F08af7d2115491591295d6`、360d `0x63b399D2fe5a13c58d92E6a74771867516471deF`、540d `0xFb833116349280880E722203B1D80B69682F738E`。

**ABI 路径**: `abi/BurnBondDepository.json`

---

### 关键概念

#### 1. 与 BondDepository 的区别

| 特性 | BondDepository | BurnBondDepository |
| --- | --- | --- |
| principle 去向 | 存入 Treasury（bondReserve/bond 或 stableReserve） | 销毁（转入 dead 地址） |
| Treasury 调用 | `depositBondReserve` / `depositStableReserve` | `depositBurnReserve` |
| LP 依赖 | 需要 liquidityPool 获取 AGX 价格 | 无需 LP，通过价值反推价格 |
| 用途 | 标准债券购买 | 通缩型债券购买 |

#### 2. 价格计算差异

BurnBondDepository 不依赖 LP 获取 AGX 价格，而是通过：

text
```text
agxPrice = value * 1e9 / payout * 10000 / discountRateBP
```

#### 3. 共享核心机制

- Vesting 线性解锁 - 完全相同
- 自动质押到 StakingPool - 完全相同
- 利润提取（claimStakeProfitMixed）- 完全相同
- 错误码和事件 - 几乎完全相同

---

### 前端 API

#### 视图函数

与 BondDepository **完全相同**：

js
```js
// 以下函数用法与 BondDepository 一致
await burnBond.getBondCount(userAddress);
await burnBond.getBondInfo(userAddress, bondIndex);
await burnBond.percentVestedFor(userAddress, bondIndex);
await burnBond.pendingPayoutFor(userAddress, bondIndex);
await burnBond.getStakeProfit(userAddress, bondIndex);
await burnBond.getUserLockedPrincipal(userAddress);
await burnBond.terms();
await burnBond.discountRateBP();
await burnBond.maxPayout();
```

#### 预估 payout（输入 USD1 → 预估 AGX）

BurnBond 的 principle 是 AGX，`Treasury.valueOf(AGX, amount)` 直接返回 amount，因此预估公式比 BondDepository 简单（BurnBondDepository.sol:755-757）：

text
```text
payout = agxAmount * 10000 / discountRateBP
netPayout = payout - payout * terms.fee / 10000
```

**方法一：`eth_call` 模拟（最精确）** —— 以用户地址模拟 `zapIntoBurnBond` 交易，读取返回的 payout（需用户已 approve）：

js
```js
const data = bondHelper.interface.encodeFunctionData('zapIntoBurnBond', [burnBondAddr, usd1Addr, usd1Amount]);
const payout = await provider.call({ from: user, to: bondHelperAddr, data });
```

**方法二：前端计算（无需授权）** —— 走 zap 时 helper 先把全部 USD1 换成 AGX 再存入：

js
```js
// ① 全部 USD1 换 AGX（getAmountsOut 精确含手续费 + 滑点）
const agxOut = (await router.getAmountsOut(usd1Amount, [usd1Addr, agxAddr]))[1];
// ② 折扣
const payout = agxOut * 10000n / await burnBond.discountRateBP();
const netPayout = payout - payout * (await burnBond.terms()).fee / 10000n;
```

直接存 AGX（不经 zap）时，`payout = agxAmount * 10000n / discountRateBP` 即可，无需换币与价格。

**示例**（主网 2026-08 池子：AGX≈55 USDT，discount 8500，fee=0）：1000 USD1 → ≈21.3 AGX；10000 USD1 → ≈213 AGX。实际以 `eth_call`/实时 view 为准。

**边界检查**：同样对照 `ErrorBondTooSmall` / `ErrorBondTooLarge` / `ErrorDebtCapacityReached`。

#### 购买流程

1. 检查 Referral.isBindReferral(user) 、 BondHelper.authContracts(bond) 、Pair 存在、容量未满。
2. USD1.approve(BondHelper, amount) 。
3. BondHelper.zapIntoBurnBond(burnBondDepository, USD1, amount) ：helper 把全部 USD1 换 AGX → 把 AGX 转入本合约 deposit(AGX, user) 。
4. deposit 内部：定价 payout = value*10000/discountRateBP → 边界检查 → 扣费 → Treasury.depositBurnReserve （AGX 销毁到 dead，Treasury 铸币）→ 记账 + 自动质押。

**成功判定**：以 `AgxBurned` + `BondPurchased` + Tracker `PurchaseValued` 事件及 `getBondInfo` 回读为准。`PurchaseValued.amount` 才是本次购买的权威 18 位 USD1 金额。

#### 状态修改函数

##### deposit(uint _amount, address _depositor) -> (uint payout)

购买销毁型债券。principle 代币会被销毁。

**前提条件:** 与 BondDepository 相同

付款人是 `msg.sender`，仓位归 `depositor`；两者只要有一个是已迁移旧地址，`deposit` 就会回滚，旧地址不能通过当前地址继续追加 BurnBond。

**额外事件:**

- AgxBurned(buyer, burnAmount, bondValue, bondIndex, timestamp, termSeconds) - 记录销毁数量

js
```js
async function purchaseBurnBond(bondContract, principleContract, amount, signer) {
  const user = await signer.getAddress();

  // 1. 检查推荐关系
  const referral = new Contract(await bondContract.referral(), REFERRAL_ABI, signer);
  if (!await referral.isBindReferral(user)) {
    throw new Error('Must bind referral first');
  }

  // 2. 授权
  await (await principleContract.approve(await bondContract.getAddress(), amount)).wait();

  // 3. 购买
  const tx = await bondContract.deposit(amount, user);
  const receipt = await tx.wait();

  // 4. 解析销毁事件
  const burnEvent = receipt.logs.find(
    l => bondContract.interface.parseLog(l)?.name === 'AgxBurned'
  );
  if (burnEvent) {
    const parsed = bondContract.interface.parseLog(burnEvent);
    console.log('Burned:', ethers.formatUnits(parsed.args.burnAmount, 9), 'AGX');
  }

  const bondIndex = receipt.logs.find(
    l => bondContract.interface.parseLog(l)?.name === 'BondPurchased'
  )?.args?.bondIndex;

  console.log('Burn bond purchased, index:', bondIndex);
  return bondIndex;
}
```

##### redeem(...) / claimStakeProfitMixed(...)

与 BondDepository 的处理一致：`redeem(..., true)` 将已解锁本金重新质押到 StakingPool；`redeem(..., false)` 必须经 `AegisSplitterManager` 路由到 `AegisSplitterHead_*` 等头部分流器创建按当前配置锁定周期的线性释放单，不会直接转入钱包。Manager 未配置时赎回交易回滚。收益仍通过 `claimStakeProfitMixed(...)` 按 RewardQueue、复投与税费规则拆分。

---

### 事件

#### AgxBurned(address indexed buyer, uint256 burnAmount, uint256 bondValue, uint256 bondIndex, uint256 timestamp, uint256 termSeconds)

**仅在 BurnBondDepository 中触发**。ABI 为兼容保留参数名 `buyer`，当前实现写入的是债券受益人 `_depositor`，不是付款调用者 `msg.sender`；经 `BondHelper` 购买时也会得到最终用户地址，不会得到 Helper 地址。

`burnAmount` 是本合约 `principle` 的实际存入/销毁数量。当前标准 180/360/540 天 BurnBond 的 `principle` 都是 AGX，因此它是 9 位 AGX 数量。`bondValue` 是 `Treasury.valueOf(principle, burnAmount)` 返回的债券定价基数；当前 AGX principle 下同样是 9 位 AGX 记账值，**不是**本次购买的 USD1 金额。权威 USD1 金额必须读取同交易 Tracker `PurchaseValued.amount`（18 位）。

js
```js
burnBond.on('AgxBurned', (buyer, burnAmount, bondValue, bondIndex, timestamp) => {
  // 当前标准部署：buyer 是债券受益人；burnAmount/bondValue 均为 9 位 AGX 口径。
  console.log(`${buyer} burned ${ethers.formatUnits(burnAmount, 9)} AGX for bond #${bondIndex}`);
});
```

其余事件与 BondDepository 相同。

---

### 错误码

与 BondDepository **完全相同**（含 5 个 RestakeLib 复投错误 `ErrorConfigNotSet` / `ErrorContributionLedgerNotSet` / `ErrorInvalidRestakeBps` / `ErrorRestakeBelowMinimum` / `ErrorInvalidRestakePlan`，经 `claimStakeProfit` 复投分支可达，完整说明见 BondDepository.md 错误码）。额外关注：

- ErrorNotApproved() - 未绑定推荐关系
- ErrorDebtCapacityReached() - 达到债务上限

---

### 调用示例

#### Burn Bond vs Standard Bond 选择

js
```js
async function chooseBondType(userAddress) {
  const [stdTerms, burnTerms, stdDiscount, burnDiscount] = await Promise.all([
    bondDepository.terms(),
    burnBondDepository.terms(),
    bondDepository.discountRateBP(),
    burnBondDepository.discountRateBP(),
  ]);

  console.log('Standard Bond - vesting:', stdTerms.vestingTerm, 's, discount:', stdDiscount, 'bps');
  console.log('Burn Bond    - vesting:', burnTerms.vestingTerm, 's, discount:', burnDiscount, 'bps');

  // 选择更优的折扣率
  const betterDiscount = stdDiscount < burnDiscount ? 'standard' : 'burn';
  console.log('Better discount:', betterDiscount);
}
```

#### 追踪销毁总量

销毁总量应通过聚合 `AgxBurned` 事件获得。**不要**从 `getBondInfo(...).pricePaid` 累加——`pricePaid` 存的是购买时的 `discountRateBP`（折扣率 BPS），与销毁数量无关（BurnBondDepository.sol:557 附近 `pricePaid: discountRateBP`）。

js
```js
async function getBurnStats(burnBondContract, provider, fromBlock = 0) {
  // 聚合 AgxBurned 事件得到累计 principle 销毁数量与 Treasury 定价基数。
  // 当前标准部署的两者都是 9 位 AGX 口径；精确 USD1 需聚合同交易 PurchaseValued。
  const filter = burnBondContract.filters.AgxBurned();
  const events = await burnBondContract.queryFilter(filter, fromBlock, 'latest');

  let totalPrincipleBurned = 0n;
  let totalBondValue = 0n;
  for (const log of events) {
    const { burnAmount, bondValue } = log.args;
    totalPrincipleBurned += burnAmount; // 当前标准部署：AGX 数量（9 位）
    totalBondValue += bondValue;        // 当前标准部署：AGX 定价基数（9 位）
  }

  // 全局已发行债务（AGX, 9 位）
  const terms = await burnBondContract.terms();
  console.log('Total deposits:', ethers.formatUnits(terms.totalDeposit, 9), 'AGX');
  console.log('Total AGX burned:', ethers.formatUnits(totalPrincipleBurned, 9));
  console.log('Total bond accounting value:', ethers.formatUnits(totalBondValue, 9), 'AGX');

  return { totalPrincipleBurned, totalBondValue };
}
```

---

### 依赖合约

| 合约 | 用途 |
| --- | --- |
| Treasury | `depositBurnReserve` 接收销毁后的储备 |
| StakingPool | 自动质押 AGX |
| sAGX | 生息代币 |
| RewardQueue | 利润释放 |
| RestakeConfig | 复投配置 |
| Referral | 推荐关系验证 |
| 0x00...dead | 代币销毁地址 |

### 账户迁移

BurnBondDepository 与 BondDepository 共享同一套迁移接口（源码: BurnBondDepository.sol:1052-1080 附近）：

- setMigrationManager(address _manager) (onlyOwner, 一次性不可变) — 设置迁移管理器；非零后再改回滚 MigrationManagerImmutable 。
- migrateAccount(address oldAccount, address newAccount) (only migrationManager) — 把旧账户迁移到新账户；新账户必须无任何历史状态（ bondInfo / stakes / userLockedPrincipal / everHadAccountState 全空），否则回滚 BondDepositoryMigratedAccount 。
- everHadAccountState(address) -> (bool) (public view) — 标记账户是否曾经拥有过债券状态；可用于判断账户能否作为迁移目标。
- onlyActiveAccount 守卫： redeem / claimStakeProfitMixed 在 msg.sender 已迁移时回滚 BondDepositoryMigratedAccount ； deposit 内部还会检查 _depositor 是否已迁移。

### 配置参数

BurnBondDepository 与 BondDepository 的配置**并不完全相同**，关键差异：

- 无 `isLiquidityBond` / `liquidityPool` ：BurnBond 不依赖 LP 取价，没有这两个字段，也没有 depositBondReserve / depositStableReserve 分支。
- `setContract` 签名不同 ：仅 3 个参数 (stakingPool, rewardQueue, dao) （BurnBondDepository.sol:454-462），BondDepository 是 5 个参数 (stakingPool, rewardQueue, dao, isLiquidityBond, liquidityPool) 。
- `restakeConfig` ：BurnBond 同样存在，用于利润复投与 USD1 价值定价。
- 其余条款（ vestingTerm / maxPayout / fee / maxDebt / discountRateBP ）语义与 BondDepository 一致。

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `terms.vestingTerm` | 初始化时设置 | 解锁时间（秒） | owner/operator (`setVestingTerm`, ≥10000) |
| `terms.maxPayout` | 初始化时设置 | 最大 payout 比例 | owner/operator (`setMaxPayout`, ≤5000) |
| `terms.fee` | 初始化时设置 | 手续费（BPS） | owner/operator (`setFee`, ≤10000) |
| `terms.maxDebt` | 初始化时设置 | 债务上限 | owner/operator (`setMaxDebt`) |
| `discountRateBP` | 初始化时设置 | 折扣率（BPS，(0,10000]） | owner/operator (`setDiscountRate`) |
| `callerWhitelistEnabled` | false | 是否启用调用者白名单 | owner (`setCallerWhitelistEnabled`) |
| `restakeConfig` | 初始化后设置 | 复投配置地址 | owner (`setRestakeConfig`) |
| `principalReleaseVault` | 初始化后设置 | 本金释放入口（`AegisSplitterManager`） | owner (`setPrincipalReleaseVault`) |
| `stakingPool` / `rewardQueue` / `DAO` | `setContract` 设置 | 核心依赖地址 | owner (`setContract`, 3 参数) |
| `purchaseTracker` | 正式部署必需 | 强原子购买贡献追踪 | owner (`setPurchaseTracker`) |
