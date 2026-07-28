# BondHelper (AegisBondZapHelper) 合约文档

> 来源：`doc-contracts-bondhelper`
> ABI：[`abis/bondhelper.json`](../abis/bondhelper.json)

## 完整 ABI

abi/AegisBondZapHelper.json
SHA-256 501d9b419845…
31
14
4
13

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/bondhelper.json`](../abis/bondhelper.json)（31 entries）。

</details>

## BondHelper (AegisBondZapHelper) 合约文档

### 概述

`AegisBondZapHelper` 是债券 Zap 辅助合约，帮助用户一步完成"换币+添加流动性+购买债券"操作。支持流动性债券和销毁债券两种 Zap 类型。

**部署 key**: `BondHelper`

**ABI 路径**: `abi/AegisBondZapHelper.json`

---

### 关键概念

#### 1. Zap Into Liquidity Bond

流程：USD -> 一半换 AGX -> 添加 LP -> 存入 BondDepository

#### 2. Zap Into Burn Bond

流程：USD -> 全部换 AGX -> 存入 BurnBondDepository

---

### 前端 API

#### 视图函数

##### getPair(address tokenA, address tokenB) -> (address)

获取 LP 交易对地址（通过 `factory` 查询 PancakeFactory.getPair）。

> 合约**未提供** `quoteUsdInForAgxOut` 视图入口。若需链下预估 USD->AGX 兑换数量，应在前端调用 `IPancakeRouter.getAmountsOut(amountIn, [swapToken, AGX])` 自行估算（合约内 `_swapToMainToken` 即用该方法）。

#### 状态修改函数

##### zapIntoLiquidityBond(bond, swapToken, depositAmount) -> (uint256 bondAmount)

Zap 进入流动性债券。

js

```js
async function zapLiquidityBond(helper, bondAddr, swapToken, amount, signer) {
  // 授权 swapToken
  await (await swapTokenContract.approve(await helper.getAddress(), amount)).wait()

  const tx = await helper.connect(signer).zapIntoLiquidityBond(bondAddr, swapToken, amount)
  const receipt = await tx.wait()
  console.log(
    'Zapped! Bond amount:',
    receipt.logs.find((l) => helper.interface.parseLog(l)?.name === 'ZapExecuted')?.args
      ?.bondAmount,
  )
}
```

##### zapIntoBurnBond(bond, swapToken, depositAmount) -> (uint256 bondAmount)

Zap 进入销毁债券。

### 错误码

| 错误                       | 原因                           | 解决方案               |
| -------------------------- | ------------------------------ | ---------------------- |
| `ErrorNotApproved()`       | 债券未授权                     | 联系管理员             |
| `ErrorPairNotExist()`      | LP 交易对不存在                | 使用正确的代币         |
| `ErrorInvalidBalance()`    | 余额不足                       | 检查余额               |
| `ErrorInvalidBondAmount()` | 债券金额为 0                   | 重试                   |
| `ErrorZeroAmount()`        | 存入金额为 0                   | 传入大于 0 的金额      |
| `ErrorZeroAddress()`       | `setAuthorizedBond` 传入零地址 | 传入有效债券地址       |
| `ErrorBondHelper()`        | `setSlippage` 参数 ≥ 100       | 传入 0-99 的滑点百分比 |

### 配置参数

| 参数            | 说明                                                                        | 设置者                      |
| --------------- | --------------------------------------------------------------------------- | --------------------------- |
| `token`         | AGX 代币地址 (public)                                                       | `initialize` 一次性设置     |
| `swapRouter`    | PancakeSwap 路由器 (public)                                                 | `initialize` 一次性设置     |
| `factory`       | PancakeFactory 地址 (public)，`initialize` 时由 `swapRouter.factory()` 派生 | 不可改                      |
| `slippage`      | 滑点百分比，默认 3（`_getMinAmount` 用 `(100-slippage)/100` 计算）          | owner (`setSlippage`, <100) |
| `authContracts` | 授权的债券合约映射 (public mapping)                                         | owner (`setAuthorizedBond`) |

### 管理函数

| 函数                                              | 权限        | 说明                                                                          |
| ------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `initialize(address _token, address _router)`     | initializer | 一次性初始化 `token`/`swapRouter`/`factory`/`slippage=3`                      |
| `setSlippage(uint256 _slippage)`                  | onlyOwner   | 设置滑点百分比；≥100 回滚 `ErrorBondHelper`                                   |
| `setAuthorizedBond(address _bond, bool _allowed)` | onlyOwner   | 维护授权债券列表；零地址回滚 `ErrorZeroAddress`，触发 `AuthorizedBondUpdated` |

### 事件

| 事件                                                                                                                                                              | 说明                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `AuthorizedBondUpdated(address indexed _bond, bool _allowed, uint256 timestamp)`                                                                                  | `setAuthorizedBond` 修改授权时触发                         |
| `ZapExecuted(address indexed user, address indexed bond, address indexed swapToken, uint256 depositAmount, uint256 bondAmount, uint8 zapType, uint256 timestamp)` | Zap 成功执行；`zapType=0` 流动性债券，`zapType=1` 销毁债券 |
