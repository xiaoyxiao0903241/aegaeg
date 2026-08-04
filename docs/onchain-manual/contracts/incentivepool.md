# IncentivePool 合约文档

> 来源：`doc-contracts-incentivepool`
> ABI：[`abis/incentivepool.json`](../abis/incentivepool.json)

## 完整 ABI

abi/IncentivePool.json
SHA-256 3cce08a008c7…
34
16
3
15

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/incentivepool.json`](../abis/incentivepool.json)（34 entries）。

</details>

## IncentivePool 合约文档

### 概述

`IncentivePool` 是 AEGIS X 的激励池，支持签名领取奖励和 PancakeSwap 代币交换。使用 ECDSA 签名验证防止未授权领取。

**部署 key**: `IncentivePool`

**ABI 路径**: `abi/IncentivePool.json`

---

### 前端 API

#### 视图函数

##### useSalt(bytes32 _salt) -> (bool)

检查 salt 是否已使用。

##### getAmountsOut(uint256 amountIn, address[] path) -> (uint256[])

预览交换输出量。

js

```js
const amounts = await incentivePool.getAmountsOut(amountIn, [tokenIn, tokenOut])
console.log('Expected output:', ethers.formatUnits(amounts[1], 18))
```

#### 状态修改函数

##### claimRewards(signType, amount, expireTime, salt, signature)

领取激励奖励。

js

```js
async function claimIncentive(
  incentivePool,
  signType,
  amount,
  expireTime,
  salt,
  signature,
  signer,
) {
  const used = await incentivePool.useSalt(salt)
  if (used) throw new Error('Signature already used')

  const tx = await incentivePool
    .connect(signer)
    .claimRewards(signType, amount, expireTime, salt, signature)
  await tx.wait()
  console.log('Incentive claimed:', ethers.formatUnits(amount, 18))
}
```

##### swap(path, amountIn, amountOutMin, deadline)

执行代币交换（仅 traders 地址可调用）。

##### initialize(address _token, address _router) — initializer

初始化：设置奖励代币、PancakeSwap 路由器，默认 `rewardSigner = 0x3A2C...648`。

##### recoverSign(bytes32 _msgHash, bytes _signature, address _signer) -> (bool) — pure 视图

用 ECDSA 恢复签名并校验是否与 `_signer` 一致。

##### setRewardsSigner(address _signer) — onlyOwner

设置奖励签名者（零地址拒绝，触发 `ErrorZeroAddress`）。

##### setTraders(address _traders) — onlyOwner

设置可调用 `swap` 的交易者地址（零地址拒绝，触发 `ErrorZeroAddress`）。

### 事件

#### Claimed(address indexed user, uint256 amount, uint8 planIndex, bytes32 salt, uint256 signType, uint256 timestamp)

`claimRewards` 成功领取时触发（`planIndex` 固定为 0）。

### 错误码

| 错误                         | 原因             | 解决方案     |
| ---------------------------- | ---------------- | ------------ |
| `ErrorAlreadyUsed()`         | 签名/salt 已使用 | 使用新的     |
| `ErrorInvalidSigner()`       | 签名验证失败     | 检查签名     |
| `ErrorSignatureExpired()`    | 签名已过期       | 获取新的     |
| `ErrorInsufficientBalance()` | 合约余额不足     | 等待充值     |
| `ErrorUnauthorized()`        | 非 traders 地址  | 无权限       |
| `ErrorZeroAddress()`         | 设置零地址       | 使用非零地址 |

### 配置参数

| 参数           | 说明               | 设置者       |
| -------------- | ------------------ | ------------ |
| `token`        | 奖励代币地址       | 初始化时设置 |
| `swapRouter`   | PancakeSwap 路由器 | 初始化时设置 |
| `rewardSigner` | 签名验证地址       | owner        |
| `traders`      | 交换交易者地址     | owner        |
