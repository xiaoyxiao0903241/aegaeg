# Usd1Swap 合约文档

> 来源：`doc-contracts-usd1swap`
> ABI：[`abis/usd1swap.json`](../abis/usd1swap.json)

## 完整 ABI

abi/AegisUsd1Swap.json
SHA-256 d74c842d7416…
58
30
10
18

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/usd1swap.json`](../abis/usd1swap.json)（58 entries）。

</details>

## Usd1Swap 合约文档

### 概述

`AegisUsd1Swap` 是 USDT 到 USD1 的固定汇率兑换合约。用户存入 USDT，按设定的 `rateBps` 获得 USD1。兑换的 USDT 转入国库钱包。

**部署 key**: `Usd1Swap`

**ABI 路径**: `abi/AegisUsd1Swap.json`

---

### 前端 API

#### 视图函数

##### quoteUsd1Out(uint256 usdtAmount) -> (uint256)

预览兑换 USD1 数量。

js
```js
const config = await usd1Swap.getConfig();
const usdtIn = ethers.parseUnits('1000', config.usdtDec); // 1000 输入 token
const usd1Out = await usd1Swap.quoteUsd1Out(usdtIn);
console.log('Will receive:', ethers.formatUnits(usd1Out, config.usd1Dec), 'USD1');
```

##### usd1Reserve() -> (uint256)

返回合约中的 USD1 储备。

js
```js
const reserve = await usd1Swap.usd1Reserve();
console.log('USD1 reserve:', ethers.formatUnits(reserve, 18));
```

##### getConfig() -> (usdtToken, usd1Token, wallet, currentRateBps, usdtDec, usd1Dec, isPaused, minIn, maxIn, reserve)

获取完整配置。

##### totalUsdtIn() -> (uint256) / totalUsd1Out() -> (uint256)

累计输入 USDT 总量 / 累计输出 USD1 总量（全局）。

##### userUsdtIn(address account) -> (uint256) / userUsd1Out(address account) -> (uint256)

按账户查询累计输入 USDT / 累计输出 USD1（每次 `swap` 后累加，见 `Swapped` 事件）。前端展示用户历史兑换量时使用这两个 getter，而非自行累加事件。

#### 状态修改函数

##### swap(uint256 usdtAmount, uint256 minUsd1Out)

USDT 兑换 USD1。

**前提条件:**

- 合约未暂停
- 有足够的 USD1 储备
- minUsd1Out 滑点保护

js
```js
async function swapUsdtForUsd1(usd1Swap, usdtContract, usdtAmount, signer) {
  const config = await usd1Swap.getConfig();
  // 1. 预览
  const usd1Out = await usd1Swap.quoteUsd1Out(usdtAmount);
  console.log('Expected USD1:', ethers.formatUnits(usd1Out, config.usd1Dec));

  // 2. 授权 USDT
  await (await usdtContract.approve(await usd1Swap.getAddress(), usdtAmount)).wait();

  // 3. 兑换（设置 1% 滑点保护）
  const minOut = usd1Out * 99n / 100n;
  const tx = await usd1Swap.connect(signer).swap(usdtAmount, minOut);
  await tx.wait();

  console.log('Swapped', ethers.formatUnits(usdtAmount, config.usdtDec), 'input token for', ethers.formatUnits(usd1Out, config.usd1Dec), 'USD1');
}
```

输入 token 的 decimals 不是固定 18；XXToken（USDT）为 18 位，但生产前端必须读取 `getConfig()` 返回的 `usdtDec` / `usd1Dec`（或对应 ERC20 `decimals()`）。本轮主网 Usd1Swap 全新部署，USDT 输入为本轮部署的 XXToken（USDT），USD1 输出为本轮部署的 Faucet/USD1。

##### depositUsd1(uint256 amount)

向合约注入 USD1 储备。

js
```js
// 向合约注入 USD1 以确保兑换流动性
await usd1Contract.approve(await usd1Swap.getAddress(), amount);
await usd1Swap.depositUsd1(amount);
```

##### setRateBps(uint256 newRateBps) — onlyAuthorized（owner + operators）

设置兑换比例 `rateBps`（BPS，必须非零，`0` 直接 revert `ErrorZeroRate`）。触发 `RateUpdated`。

##### setTreasuryWallet(address newWallet) — onlyOwner

设置 USDT 接收国库钱包。触发 `TreasuryWalletUpdated`。

##### setPaused(bool flag) — onlyAuthorized（owner + operators）

暂停/恢复兑换。触发 `PausedUpdated`。

##### setLimits(uint256 newMinUsdtIn, uint256 newMaxUsdtIn) — onlyOwner

设置单笔兑换最小/最大限额（0 表示不限）。触发 `LimitsUpdated`。

##### setOperator(address operator, bool enabled) — onlyOwner

授权/撤销 operator（operator 可调用 `onlyAuthorized` 接口）。触发 `OperatorUpdated`。

##### emergencyWithdraw(address token, address to, uint256 amount) — onlyOwner

紧急提取合约内任意 ERC20 代币。触发 `EmergencyWithdrawn`。

---

### 事件

#### Swapped(address indexed user, uint256 usdtAmount, uint256 usd1Amount, uint256 rateBps, address indexed treasuryWallet)

兑换时触发。

#### Usd1Deposited(address indexed from, uint256 amount)

注入 USD1 储备时触发。

#### RateUpdated(uint256 oldRateBps, uint256 newRateBps)

`setRateBps` 修改汇率时触发。

#### TreasuryWalletUpdated(address oldWallet, address newWallet)

`setTreasuryWallet` 修改国库钱包时触发。

#### PausedUpdated(bool paused)

`setPaused` 切换暂停状态时触发。

#### LimitsUpdated(uint256 minUsdtIn, uint256 maxUsdtIn)

`setLimits` 修改限额时触发。

#### OperatorUpdated(address indexed operator, bool enabled)

`setOperator` 授权/撤销 operator 时触发。

#### EmergencyWithdrawn(address indexed token, address indexed to, uint256 amount)

`emergencyWithdraw` 提取代币时触发。

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorPaused()` | 合约已暂停 | 等待恢复 |
| `ErrorInsufficientUsd1(available, required)` | USD1 储备不足 | 等待注入 |
| `ErrorBelowMin(amount, minAmount)` | 低于最小限额 | 增加金额 |
| `ErrorAboveMax(amount, maxAmount)` | 超过最大限额 | 减少金额 |
| `ErrorInsufficientOutput(actual, minRequired)` | 滑点超限 | 减少 minUsd1Out |
| `ErrorTransferAmountMismatch(token, expected, actual)` | 转账数量不匹配 | 重试 |
| `ErrorZeroAddress()` | 地址为零 | 使用非零地址 |
| `ErrorSameToken()` | USDT 与 USD1 相同 | 使用不同代币 |
| `ErrorZeroAmount()` | 金额为零 | 使用正数金额 |
| `ErrorZeroRate()` | `rateBps` 为 0 | 设置非零汇率 |
| `ErrorCallerNotAuthorized()` | 调用者非 owner/operator | 检查权限 |
| `ErrorInvalidLimits(minAmount, maxAmount)` | 限额配置非法（max<min） | 修正限额 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `rateBps` | 初始化时设置 | 兑换比例（BPS） | owner/operator |
| `treasuryWallet` | 初始化时设置 | USDT 接收地址 | owner |
| `minUsdtIn` / `maxUsdtIn` | 0（无限制） | 兑换限额 | owner |
| `paused` | false | 是否暂停 | owner/operator |
