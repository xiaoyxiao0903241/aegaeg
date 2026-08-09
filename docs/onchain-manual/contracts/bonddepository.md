# BondDepository 合约文档

> 来源：`doc-contracts-bonddepository`
> ABI：[`abis/bonddepository.json`](../abis/bonddepository.json)

## 完整 ABI

abi/BondDepository.json
SHA-256 bb83a039e27e…
106
54
15
37

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/bonddepository.json`](../abis/bonddepository.json)（106 entries）。

</details>

## BondDepository 合约文档

### 概述

`BondDepository` 是 AEGIS X 的 Olympus 风格债券购买合约。用户可以用稳定币（principle）以折扣价购买 AGX 债券，经过线性解锁期（vesting）后领取 AGX。购买的 AGX 自动质押到 StakingPool 获得 sAGX 利息收益。

Lucky 购买上报采用 gas 上限保护的 best-effort。债券本金、仓位和自动质押成功后，价格读取或 Tracker 异常只发出 `PurchaseTrackingFailed(user,agxAmount,stage,reason)`，不会回滚债券购买；前端应以债券事件和 `getBondInfo` 回读为成功依据。

**白皮书 7.1 基准**：线性释放周期 180 / 360 / 540 天，动态折扣区间 85%-100% / 80%-100% / 75%-100%。当前部署采用三个独立代理实例 `BondDepository180d`、`BondDepository360d`、`BondDepository540d`，各实例的 `vestingTerm` 固定为对应期限；初始折扣分别由 `BOND_180D_DISCOUNT_RATE_BP`（默认 8500）、`BOND_360D_DISCOUNT_RATE_BP`（默认 8000）、`BOND_540D_DISCOUNT_RATE_BP`（默认 7500）配置。

**部署 key**: `BondDepository`

**ABI 路径**: `abi/BondDepository.json`

---

### 关键概念

#### 1. 债券购买与折扣

用户存入 principle 代币（如 USD1），根据折扣率（discountRateBP）获得 AGX 债券：

- 折扣计算： payout = valueOf(principle) * 1e9 / agxPrice * 10000 / discountRateBP
- discountRateBP 为基准点（BPS），10000 = 无折扣，9500 = 5% 折扣
- 每次购买会收取少量 fee（BPS），fee 部分转给 DAO

> 安全边界：`agxPrice` 当前直接来自 Pancake Pair 的即时储备比，没有 TWAP/独立预言机或价格偏差门禁。该价格直接影响 Treasury 可铸造的 payout，属于主网上线前必须专项处理的价格操纵风险；`maxPayout/maxDebt` 只能限制损失上限，不能证明定价安全。

#### 2. Vesting 线性解锁

债券有 vestingTerm（秒），期间可以分批提前赎回：

- percentVestedFor() 返回已解锁百分比（0-10000）
- 可随时调用 redeem() 部分或全部领取
- 部分领取后，剩余 vesting 时间继续计时

#### 3. 自动质押与利润提取

购买债券时 AGX 自动质押到 StakingPool：

- 本金和利息都通过 sAGX gons 模型增长
- claimStakeProfitMixed() 可提取利息利润，支持：
- release - 进入 RewardQueue 线性释放
- restake - 复投到 LockedStaking 获取更高收益

#### 4. 债务上限

合约有 maxDebt 限制防止超发：

- terms.maxDebt 为最大债务上限
- terms.totalDeposit 为当前已发行债务
- totalDeposit + netPayout > maxDebt 时购买失败

---

### 前端 API

#### 视图函数

##### getBondCount(address) -> (uint256)

返回用户的债券总数（含迁移前的历史债券）。

js
```js
const count = await bondDepository.getBondCount(userAddress);
console.log('Total bonds:', count);
```

##### getBondInfo(address, uint256) -> (...)

返回指定债券的详细信息。

**返回值:**

- payout - 总支付额（AGX, raw）
- vesting - 剩余解锁时间（秒）
- lastTime - 最后操作时间
- pricePaid - 购买时的折扣 BP
- exists - 债券是否存在
- percentVested - 已解锁百分比（0-10000）
- payoutRemaining - 剩余待领取
- vestingEndTime - 解锁结束时间戳
- currentDiscountBP - 当前折扣 BP
- profit - 质押利润（AGX）

js
```js
const info = await bondDepository.getBondInfo(userAddress, bondIndex);
console.log('Payout:', ethers.formatUnits(info.payout, 9), 'AGX');
console.log('Vested:', Number(info.percentVested) / 100, '%');
console.log('Profit:', ethers.formatUnits(info.profit, 9), 'AGX');
```

##### percentVestedFor(address, uint256) -> (uint256)

返回指定债券的已解锁百分比（0-10000，即 0%-100%）。

js
```js
const percent = await bondDepository.percentVestedFor(userAddress, bondIndex);
console.log('Vested:', Number(percent) / 100, '%');
```

##### pendingPayoutFor(address, uint256) -> (uint256)

返回当前可领取的 payout 数量。

js
```js
const pending = await bondDepository.pendingPayoutFor(userAddress, bondIndex);
console.log('Pending payout:', ethers.formatUnits(pending, 9), 'AGX');
```

##### getStakeProfit(address, uint256) -> (uint256)

返回指定债券对应的质押利润（sAGX 增长部分）。

js
```js
const profit = await bondDepository.getStakeProfit(userAddress, bondIndex);
console.log('Stake profit:', ethers.formatUnits(profit, 9), 'AGX');
```

##### getUserLockedPrincipal(address) -> (uint256)

返回用户的锁定本金总额。

js
```js
const locked = await bondDepository.getUserLockedPrincipal(userAddress);
console.log('Locked principal:', ethers.formatUnits(locked, 9), 'AGX');
```

##### bondInfo(address, uint256) -> (payout, vesting, lastTime, pricePaid, exists)

直接访问 bondInfo mapping（索引从 0 开始）。

js
```js
const bond = await bondDepository['bondInfo(address,uint256)'](userAddress, 0);
console.log('Bond exists:', bond.exists);
console.log('Payout:', bond.payout.toString());
```

##### terms() -> (vestingTerm, maxPayout, fee, maxDebt, totalDeposit)

返回当前债券条款。

js
```js
const terms = await bondDepository.terms();
console.log('Vesting term (seconds):', terms.vestingTerm);
console.log('Fee (BPS):', terms.fee);
console.log('Max debt:', terms.maxDebt);
```

##### discountRateBP() -> (uint256)

返回当前折扣率（BPS）。

##### maxPayout() -> (uint256)

返回单笔债券最大 payout，计算为 `AGX.totalSupply() * terms.maxPayout / 100000`。

##### stakes(address, uint256) -> (principal, gons, startEpoch, expiry, exists)

查看用户质押信息。

---

#### 预估 payout（输入 USD1 → 预估 AGX）

购买前预估 AGX 输出必须与 `_payoutWithDiscount`（BondDepository.sol:633-638）一致：

text
```text
payout = value * 1e9 / agxPrice * 10000 / discountRateBP
netPayout = payout - payout * terms.fee / 10000
```

- value = Treasury.valueOf(principle, amount) 。本合约 principle 是 AGX/USD1 LP 代币，value 由 AegisLpBondingCalculator.valuation(pair, lpAmount) 给出（修复后为真实 USD 口径；旧版 2×√k 公式会低估约 7.4 倍，已于 2026-08 主网替换）。
- agxPrice = LP 池 reserveU / reserveAGX （USDT-per-AGX），与 _getAgxPrice() 一致： token0 == AGX 时 reserveU = reserve1, reserveAGX = reserve0 ，否则相反。
- discountRateBP = discountRateBP() ，8500 = 付市场价 85%（多拿约 17.6% AGX）。

**方法一：`eth_call` 模拟（精确校验）** —— 以用户地址模拟 `zapIntoLiquidityBond` 交易，读取返回的 payout（需用户已 approve，`transferFrom` 会被模拟）：

js
```js
const data = bondHelper.interface.encodeFunctionData('zapIntoLiquidityBond', [bondAddr, usd1Addr, usd1Amount]);
const payout = await provider.call({ from: user, to: bondHelperAddr, data });
```

**方法二：前端计算（无需授权）** —— 按 zap 内部逻辑复算换币 + 组 LP + 估值 + 折扣：

js
```js
// ① 一半 USD1 换 AGX（getAmountsOut 精确含手续费 + 滑点）
const agxOut = (await router.getAmountsOut(usd1Amount / 2n, [usd1Addr, agxAddr]))[1];
// ② 组 LP（Uniswap V2 min 公式）
const [r0, r1] = await pair.getReserves();
const totalSupply = await pair.totalSupply();
const [reserveU, reserveAGX] = token0IsAgx ? [r1, r0] : [r0, r1];
const lpFromAgx = agxOut * totalSupply / reserveAGX;
const lpFromUsd = (usd1Amount - usd1Amount / 2n) * totalSupply / reserveU;
const lpAmount = lpFromAgx < lpFromUsd ? lpFromAgx : lpFromUsd;
// ③ LP 价值 + ④ 折扣
const value = await bondingCalculator.valuation(pairAddr, lpAmount);
const agxPrice = reserveU * 10n ** 9n / reserveAGX;
const payout = value * 10n ** 9n / agxPrice * 10000n / await bond.discountRateBP();
const netPayout = payout - payout * (await bond.terms()).fee / 10000n;
```

直接存 LP 代币（不经 zap）时，`value = await treasury.valueOf(await bond.principle(), lpAmount)` 后直接套 `payout` 公式即可。合约未内置预估 view，前端按上述 JS 复算。

**示例**（主网 2026-08 池子：AGX≈55 USDT，discount 8500，fee=0）：1000 USD1 → ≈21.3 AGX；10000 USD1 → ≈213 AGX。实际以 `eth_call`/实时 view 为准。

**边界检查**：`ErrorBondTooSmall`（payout < 0.01 AGX）、`ErrorBondTooLarge`（payout > `maxPayout()`）、`ErrorDebtCapacityReached`（`totalDeposit + netPayout > maxDebt`）。

#### 购买流程

用户入口（推荐走 `BondHelper` zap，USD1 输入）：

1. 检查 Referral.isBindReferral(user) 、 BondHelper.authContracts(bond) 、Pair 存在、容量未满。
2. USD1.approve(BondHelper, amount) （可一次性 approve 多笔总金额）。
3. BondHelper.zapIntoLiquidityBond(bondDepository, USD1, amount) ：

- helper 把一半 USD1 换 AGX → 剩下一半 USD1 + AGX 组 LP → 把 LP 转入本合约 deposit(LP, user) 。

1. deposit 内部流程见下方"状态修改函数"小节（定价、边界、Treasury 铸币、自动质押）。

**成功判定**：以 `BondPurchased` 事件 + `getBondInfo` 回读为准；payout 已自动质押成 sAGX，不用钱包 AGX 余额判断。

---

#### 状态修改函数

##### deposit(uint _amount, address _depositor) -> (uint payout)

购买债券。存入 principle 代币（如USD1），获得 AGX 债券。

**实际流程**（基于 BondDepository.sol:438-503）:

进入资金计算前，合约会同时检查 `migratedTo[msg.sender]` 与 `migratedTo[depositor]`。任一地址已经迁移都会回滚；付款人始终是 `msg.sender`，债券仓位归 `depositor`。

javascript
```javascript
// 1. 检查白名单（如果启用）
if (callerWhitelistEnabled && msg.sender有code && !allowedCallers[msg.sender]) revert ...

// 2. 检查推荐人绑定
require(IReferral(referral).isBindReferral(_depositor))

// 3. 计算价值
value = Treasury.valueOf(principle, _amount)  // 根据小数位转换
payout = value * 1e9 / agxPrice * 10000 / discountRateBP  // 应用折扣（与 _payoutWithDiscount 一致）

// 4. 检查限制
if (payout < 10000000) revert ErrorBondTooSmall()
if (payout > maxPayout()) revert ErrorBondTooLarge()
if (maxDebt > 0 && totalDeposit + netPayout > maxDebt) revert ErrorDebtCapacityReached()

// 5. 转移资金
IERC20(principle).transferFrom(msg.sender, BondDepository, _amount)
IERC20(principle).approve(Treasury, _amount)

// 6. 存入Treasury
if (isLiquidityBond) {
    Treasury.depositBondReserve(principle, _amount, payout)
    // → transfer token到Treasury
    // → transfer token到DEAD销毁
    // → Treasury.mint(payout)给BondDepository
} else {
    Treasury.depositStableReserve(principle, _amount, payout)
    // → transfer token到Treasury
    // → Treasury.mint(payout)给BondDepository
}

// 7. 记录债券信息
bondInfo[_original(depositor)].push(BondInfo({  // 按 root 账户归集（_original 返回迁移根地址）
    payout: netPayout,  // payout - fee
    vesting: vestingTerm,
    lastTime: block.timestamp,
    pricePaid: discountRateBP,
    exists: true
}))

// 8. Stake到StakingPool
_stake(_amount, netPayout, depositor)
// → AGX.approve(StakingPool)
// → StakingPool.bondStake(netPayout, address(this))  // recipient 是合约自身

// 9. 支付fee给DAO
if (fee > 0) IERC20(AGX).transfer(DAO, fee)

// 10. best-effort 记录购买行为；失败只发 PurchaseTrackingFailed，不回滚债券
DailyPurchaseTracker.recordPurchase(depositor, usdValue)
```

**完整前端示例**:

javascript
```javascript
async function purchaseBond(bondContract, principleContract, amount, depositor, signer) {
  // 1. 检查推荐人绑定
  const referralAddr = await bondContract.referral();
  const referral = new Contract(referralAddr, REFERRAL_ABI, signer);
  const isBound = await referral.isBindReferral(depositor);
  if (!isBound) throw new Error('必须先绑定推荐人');

  // 2. 授权principle代币（USD1等）
  await (await principleContract.connect(signer).approve(await bondContract.getAddress(), amount)).wait();

  // 3. 预览 payout（与 _payoutWithDiscount 一致：value * 1e9 / agxPrice * 10000 / discountRateBP）
  const treasuryAddr = await bondContract.treasury();
  const treasury = new Contract(treasuryAddr, TREASURY_ABI, signer);
  const value = await treasury.valueOf(await bondContract.principle(), amount);
  const discountBP = await bondContract.discountRateBP();
  const pairAddr = await bondContract.liquidityPool();
  const pair = new Contract(pairAddr, PAIR_ABI, signer);
  const [r0, r1] = await pair.getReserves();
  const token0 = await pair.token0();
  const agxAddr = await bondContract.AGX();
  const [reserveU, reserveAGX] = token0.toLowerCase() === agxAddr.toLowerCase() ? [r1, r0] : [r0, r1];
  const agxPrice = reserveU * 10n ** 9n / reserveAGX; // USDT-per-AGX，18 位
  const payout = value * 10n ** 9n / agxPrice * 10000n / discountBP;

  console.log(`存入: ${ethers.formatUnits(amount, 18)} USD1`);
  console.log(`预期payout: ${ethers.formatUnits(payout, 9)} AGX`);

  // 4. 执行购买
  try {
    const tx = await bondContract.connect(signer).deposit(amount, depositor);
    const receipt = await tx.wait();

    // 解析事件
    const event = receipt.logs.find(l => l.fragment?.name === 'BondPurchased');
    if (event) {
      const parsed = bondContract.interface.parseLog(event);
      console.log(`债券ID: ${parsed.args.bondIndex}`);
      console.log(`净payout: ${ethers.formatUnits(parsed.args.payout, 9)} AGX`);
      console.log(`vesting: ${parsed.args.termSeconds}秒`);
    }

    return receipt;
  } catch (err) {
    if (err.message?.includes('ErrorDebtCapacityReached')) {
      throw new Error('债务上限已满，请稍后重试');
    }
    if (err.message?.includes('ErrorBondTooLarge')) {
      throw new Error('金额超过最大payout限制');
    }
    if (err.message?.includes('ErrorBondTooSmall')) {
      throw new Error('金额太小，最小payout为0.01 AGX');
    }
    throw err;
  }
}

// 使用示例
const usdAmount = ethers.parseUnits('1000', 18);  // 1000 USD1
await purchaseBond(bondContract, usd1Contract, usdAmount, userAddress, signer);
```

**关键差异说明**:

1. LP债券 vs 稳定币债券 :

- LP债券: isLiquidityBond=true → depositBondReserve() → token转到Treasury并销毁到DEAD
- 稳定币债券: isLiquidityBond=false → depositStableReserve() → token只转到Treasury

1. Treasury铸造 :

- 两种债券都会触发 Treasury.mint(payout) 铸造新AGX
- LP债券还会将LP token销毁到DEAD地址

1. 自动质押 :

- deposit后自动调用 _stake() 将payout stake到StakingPool
- 用户获得sAGX奖励自动累积

##### redeem(address _recipient, uint256 _bondIndex, bool _shouldStake) -> (uint)

领取债券 payout。可全部或部分领取。

**前提条件:**

- _recipient == msg.sender
- 债券存在且未完全领取
- _bondIndex 有效

**参数:**

- _shouldStake - true : 自动质押到 StakingPool； false : 将本金经 AegisSplitterManager 路由到 AegisSplitterHead_* 等头部分流器创建按当前配置锁定周期的线性释放单，不会直接转入钱包

**事件:**

- BondRedeemed(recipient, payout, remaining, bondIndex, ...)
- Claimed(recipient, amount, bondIndex, ...)

js
```js
async function redeemBond(bondContract, bondIndex, shouldStake, signer) {
  const userAddr = await signer.getAddress();

  // 1. 检查可领取金额
  const pending = await bondContract.pendingPayoutFor(userAddr, bondIndex);
  if (pending === 0n) {
    console.log('Nothing to redeem');
    return;
  }

  // 2. 检查债券信息
  const info = await bondContract.getBondInfo(userAddr, bondIndex);
  console.log(`Bond ${bondIndex}: ${Number(info.percentVested) / 100}% vested`);

  // 3. 执行领取
  const tx = await bondContract.connect(signer).redeem(userAddr, bondIndex, shouldStake);
  const receipt = await tx.wait();

  const event = receipt.logs.find(
    l => bondContract.interface.parseLog(l)?.name === 'BondRedeemed'
  );
  const parsed = bondContract.interface.parseLog(event);
  console.log('Redeemed:', ethers.formatUnits(parsed.args.payout, 9), 'AGX');
  console.log('Remaining:', ethers.formatUnits(parsed.args.remaining, 9), 'AGX');
}
```

##### claimStakeProfitMixed(...)

提取质押利润，支持 release + restake 混合模式。

**参数:**

- _recipient - 利润接收者
- _amount - 提取金额
- _releasePlanIndex - RewardQueue 释放计划索引；不要硬编码 0-3，应先通过 RewardQueue queueSize() / queuePlans() 读取当前配置
- _bondIndex - 债券索引
- _restakePlanIndex - 复投计划索引
- _restakeBps - 复投比例（BPS）

js
```js
async function claimBondProfit(bondContract, bondIndex, amount, signer) {
  const userAddr = await signer.getAddress();

  // 1. 检查利润
  const profit = await bondContract.getStakeProfit(userAddr, bondIndex);
  if (profit === 0n) {
    console.log('No profit to claim');
    return;
  }

  const claimAmount = amount > profit ? profit : amount;

  // 2. 配置 release/restake 比例
  // 两类 index 必须从链上配置读取；不要把示例数字或过滤后数组下标写死
  const releasePlanIndex = selectedQueuePlanIndex;
  const restakePlanIndex = selectedRestakePlanIndex;
  const restakeBps = 5000; // 50% 复投

  const tx = await bondContract.connect(signer).claimStakeProfitMixed(
    userAddr,
    claimAmount,
    releasePlanIndex,
    bondIndex,
    restakePlanIndex,
    restakeBps
  );
  await tx.wait();
  console.log('Profit claimed successfully');
}
```

---

### 事件

#### BondPurchased(...)

用户购买债券时触发。包含 bondIndex、payout、折扣、AGX 价格等完整信息。

#### BondRedeemed(...)

用户领取债券 payout 时触发。包含已领取和剩余金额。

#### Staked(...)

债券 AGX 自动质押时触发。

#### Claimed(...)

从质押中提取本金时触发。

#### RewardClaimed(...)

通过单一 release 计划领取质押利润时触发（与 `RewardClaimedMixed` 区别在于不含复投分支）。包含 `_user`、`_amount`、`_index`（RewardQueue 释放计划索引）、`bondIndex`、`timestamp`、`gonsDelta`、`termSeconds`。

#### RestakeClaimed(...)

利润以 restake 模式领取并复投到 LockedStaking 时触发。包含 `_user`、`_reward`、`_restakeAmount`、`_taxBP`、`_planIndex`、`_period`、`bondIndex`、`timestamp`、`gonsDelta`。

#### RewardClaimedMixed(...)

混合模式领取利润时触发。包含 release 和 restake 详情。

#### PrincipalReleaseVaultUpdated(address indexed oldVault, address indexed newVault)

`setPrincipalReleaseVault` 修改本金释放入口时触发（当前指向 `AegisSplitterManager`，原 `PrincipalReleaseVault` 已于 2026-08-03 删除，ABI 归档 `archive/PrincipalReleaseVault/`）。

#### DiscountRateUpdated(uint256 indexed _newRate)

`setDiscountRate` 修改折扣率时触发。

#### MaxPayoutUpdated(uint256 _newMax)

`setMaxPayout` 修改最大 payout 比例时触发。

#### VestingTermUpdated(uint256 _newVesting)

`setVestingTerm` 修改解锁时长时触发。

#### FeeUpdated(uint256 _newFee)

`setFee` 修改手续费时触发。

---

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorNotApproved()` | 存款人未绑定推荐关系 | 先绑定 Referral |
| `ErrorDebtCapacityReached()` | 达到债务上限 | 等待管理员调整 maxDebt |
| `ErrorBondTooSmall()` | payout < 0.01 AGX | 增加购买金额 |
| `ErrorBondTooLarge()` | 超过 maxPayout | 减少购买金额 |
| `ErrorBondIndexOutOfBounds()` | 债券索引无效 | 使用有效索引 |
| `ErrorBondNotExist()` | 债券不存在或已领取 | 检查债券状态 |
| `ErrorUserNotAuthorized()` | 领取人与调用者不匹配 | 必须自己领取自己的 |
| `ErrorStakeNotActive()` | 质押不存在 | 检查债券状态 |
| `ErrorProfitExceedsAmount()` | 提取金额超过利润 | 减少提取金额 |
| `ErrorCallerNotAllowed(address)` | 调用者不在白名单 | 联系管理员 |
| `ErrorPrincipalReleaseVaultNotSet()` | `redeem(..., false)` 时未配置 `AegisSplitterManager` | 先调用 `setPrincipalReleaseVault` 指向分流器 Manager |
| `ErrorZeroAmount()` | 金额为 0 或储备为 0 | 传入有效金额 |
| `ErrorInvalidAmount()` | 提取金额非法（0 或大于本金） | 校验金额范围 |
| `ErrorAmountExceedsBalance()` | 提取金额超过 sAGX 余额 | 减少提取金额 |
| `ErrorZeroAddress()` | 传入零地址 | 传入有效地址 |
| `ErrorNotInitialized()` | `initializeBondTerms` 在 `initialize` 之前调用 | 先调用 `initialize` |
| `ErrorStakeFailure()` | `StakingPool.bondStake` 返回 false | 检查 StakingPool 状态 |
| `ErrorProfitNotAvailable()` | 无可提取利润（gons=0 或 profit=0） | 等待利润累积 |
| `ErrorInvalidVesting()` | vesting < 10000 秒 | 提高解锁时长 |
| `ErrorInvalidPayout()` | maxPayout > 5000 | 降低 maxPayout |
| `ErrorInvalidFee()` | fee > 10000 BPS | 降低手续费 |
| `ErrorInvalidDiscount()` | discountRateBP == 0 或 > 10000 | 校正折扣率 |
| `ErrorCallerNotAuthorized()` | 非 owner 且非 operator 调用受限函数 | 通过 owner 或 operator 调用 |
| `BondDepositoryMigratedAccount(address)` | 账户已迁移或被迁移占用 | 使用迁移后的新账户 |
| `BondDepositoryNotMigrationManager(address)` | 非 migrationManager 调用 `migrateAccount` | 仅由迁移管理器调用 |
| `MigrationManagerImmutable(address)` | `setMigrationManager` 二次修改管理器 | 一次性不可变，部署前确认 |

#### 账户迁移

合约支持把旧账户的债券/质押状态归集到新账户，供 AccountMigrationManager 统一编排。

##### setMigrationManager(address _manager) (onlyOwner, 一次性不可变)

设置迁移管理器。`migrationManager` 一旦设为非零地址，无法再次修改（`MigrationManagerImmutable`）。前端必须在部署后一次性配置，不可重置。

##### migrateAccount(address oldAccount, address newAccount) (only migrationManager)

将 `oldAccount` 标记为已迁移到 `newAccount`。仅由 `migrationManager` 调用，旧账户此后无法 `deposit`/`redeem`/`claimStakeProfitMixed`（`onlyActiveAccount` 守卫回滚 `BondDepositoryMigratedAccount`）。新账户必须没有任何历史状态（`bondInfo`/`stakes`/`userLockedPrincipal`/`everHadAccountState` 全空），否则回滚。

##### everHadAccountState(address) -> (bool) (public view)

标记账户是否曾经拥有过债券状态。`migrateAccount` 用它来拒绝新账户已存在历史；前端可用它判断账户是否能作为迁移目标。

##### onlyActiveAccount 守卫语义

`redeem` 与 `claimStakeProfitMixed` 带 `onlyActiveAccount` 修饰器：若 `msg.sender` 已被迁移（`migratedTo[msg.sender] != address(0)`），直接回滚 `BondDepositoryMigratedAccount(msg.sender)`。`deposit` 内部还会额外检查 `_depositor` 是否已迁移。

#### 管理函数（owner / operator）

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `initialize(referral, token, sToken, principle, treasury)` | initializer | 一次性初始化合约核心地址，置 `initialized=true` |
| `initializeBondTerms(vestingTerm, maxPayout, fee, maxDebt, discountRateBP)` | onlyOwner | 初始化债券条款；需先 `initialize`，`discountRateBP` 必须在 (0, 10000] |
| `setContract(stakingPool, rewardQueue, dao, isLiquidityBond, liquidityPool)` | onlyOwner | 设置 StakingPool/RewardQueue/DAO 及是否 LP 债券与流动性池地址 |
| `setRestakeConfig(address config)` | onlyOwner | 设置 RestakeConfig 地址（复投配置） |
| `setPurchaseTracker(address tracker)` | onlyOwner | 设置 AegisDailyPurchaseTracker；零地址回滚 |
| `setPrincipalReleaseVault(address vault)` | onlyOwner | 设置本金释放入口（指向 `AegisSplitterManager`）；零地址回滚，触发 `PrincipalReleaseVaultUpdated` |
| `setBondOperator(address operator, bool flag)` | onlyOwner | 增删 operator |
| `setAllowedCaller(address caller, bool allowed)` | onlyOwner | 维护调用者白名单；零地址回滚 |
| `setCallerWhitelistEnabled(bool enabled)` | onlyOwner | 开关调用者白名单（仅对有 code 的调用者生效） |
| `setDiscountRate / setMaxPayout / setVestingTerm / setFee / setMaxDebt` | owner 或 operator | 调整债券条款，各自触发对应 `*Updated` 事件（`setMaxDebt` 不触发事件） |
| `setReferral(address referral)` | onlyOwner | 设置 Referral 合约 |

---

### 调用示例

#### 完整债券购买与领取流程

js
```js
async function fullBondLifecycle(bondContract, signer) {
  const user = await signer.getAddress();
  const principleAddr = await bondContract.principle();
  const principle = new Contract(principleAddr, ERC20_ABI, signer);

  // --- Phase 1: Purchase ---
  const amount = ethers.parseUnits('1000', 18); // 1000 USD
  await (await principle.approve(await bondContract.getAddress(), amount)).wait();

  const tx1 = await bondContract.deposit(amount, user);
  const r1 = await tx1.wait();
  const bondIndex = r1.logs.find(
    l => bondContract.interface.parseLog(l)?.name === 'BondPurchased'
  )?.args?.bondIndex;

  console.log('Bond purchased, index:', bondIndex);

  // --- Phase 2: Wait for vesting ---
  const info = await bondContract.getBondInfo(user, bondIndex);
  console.log('Vesting ends:', new Date(Number(info.vestingEndTime) * 1000).toLocaleString());

  // 定期检查解锁进度
  const checkVesting = async () => {
    const pct = await bondContract.percentVestedFor(user, bondIndex);
    return Number(pct) / 100; // percentage
  };

  // --- Phase 3: Redeem ---
  // 等到 100% 解锁
  while ((await checkVesting()) < 100) {
    console.log('Still vesting:', await checkVesting(), '%');
    await new Promise(r => setTimeout(r, 60000)); // wait 1 min
  }

  const tx2 = await bondContract.redeem(user, bondIndex, false); // don't auto-stake
  await tx2.wait();
  console.log('Bond fully redeemed');

  // --- Phase 4: Claim profit ---
  const profit = await bondContract.getStakeProfit(user, bondIndex);
  if (profit > 0n) {
    const tx3 = await bondContract.claimStakeProfitMixed(
      user, profit, 1, bondIndex, 0, 5000
    );
    await tx3.wait();
    console.log('Profit claimed:', ethers.formatUnits(profit, 9), 'AGX');
  }
}
```

#### 常见陷阱

js
```js
// 1. 忘记先 approve principle 代币
// 必须先: principle.approve(bondAddress, amount)

// 2. 使用错误的 depositor 地址
// deposit(amount, user) 中的 user 必须已绑定 referral

// 3. 领取时 recipient 必须是 msg.sender
// redeem(otherAddress, ...) 会失败

// 4. 部分领取后债券依然存在
// 需要多次 redeem 直到 payout 为 0

// 5. 利润提取与本金是分开的
// getStakeProfit() 查看利润, redeem() 领取本金
```

---

### 依赖合约

| 合约 | 用途 |
| --- | --- |
| Treasury | 接收 principle 存款，计算价值，铸造 AGX |
| StakingPool | 自动质押购买的 AGX |
| sAGX | 生息代币，gons 模型 |
| RewardQueue | 利润线性释放 |
| RestakeConfig | 复投配置 |
| Referral | 验证存款人推荐关系 |
| AegisSplitterManager / AegisSplitter | 必需；`redeem(..., false)` 的本金统一经 Manager 路由进入按配置周期锁定的线性释放，未配置时交易回滚 |
| AegisDailyPurchaseTracker | 记录购买贡献 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `terms.vestingTerm` | 初始化时设置 | 解锁时间（秒） | owner/operator |
| `terms.maxPayout` | 初始化时设置 | 最大 payout 比例 | owner/operator |
| `terms.fee` | 初始化时设置 | 手续费（BPS） | owner/operator |
| `terms.maxDebt` | 初始化时设置 | 债务上限 | owner/operator |
| `discountRateBP` | 初始化时设置 | 折扣率（BPS） | owner/operator |
| `callerWhitelistEnabled` | false | 是否启用调用者白名单 | owner |
| `restakeConfig` | 初始化后设置 | 复投配置地址 | owner |
| `principalReleaseVault` | 初始化后设置 | 本金释放入口（`AegisSplitterManager`） | owner |
