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

#### 1. Zap Into Liquidity Bond（zapIntoLiquidityBond）

流程（USD1 输入 → LP Bond）：

1. 校验 authContracts[bond]=true 、金额 > 0、USD1/AGX Pair 存在。
2. transferFrom(user, helper, amount) 收 USD1。
3. 一半 USD1 换 AGX（ router.swapExactTokensForTokensSupportingFeeOnTransferTokens ，含 0.25% 手续费 + 滑点）。
4. 剩下一半 USD1 + 换来的 AGX 组 LP（ router.addLiquidity ）；多余的 AGX/USD1 退回用户。
5. 把 LP approve 给 bond，调 bond.deposit(lpBalance, user) ，返回 payout。

#### 2. Zap Into Burn Bond（zapIntoBurnBond）

流程（USD1 输入 → Burn Bond）：

1. 同样校验 + 收 USD1。
2. 全部 USD1 换 AGX。
3. 把 AGX approve 给 bond，调 bond.deposit(agxBalance, user) ，返回 payout；多余 AGX 退回。

#### 3. 预估 AGX 输出（输入 USD1 → 预估 AGX）

Zap 的产出 = `bond.deposit()` 的返回值。前端以**方法二（前端计算）** 为标准实现，**方法一（eth_call 模拟）** 用于提交前精确校验：

**方法一：`eth_call` 模拟（精确校验）** —— 以用户地址模拟 zap 交易读取返回的 payout（需已 approve）：

js
```js
const data = helper.interface.encodeFunctionData('zapIntoLiquidityBond', [bondAddr, usd1Addr, usd1Amount]);
const payout = await provider.call({ from: user, to: helperAddr, data });
```

**方法二：前端计算（标准做法，无需授权）** —— 按 zap 内部逻辑复算（LP Bond）：

js
```js
const usdtForSwap = usd1Amount / 2n;                                   // 一半换币
const estimatedOhm = (await router.getAmountsOut(usdtForSwap, [usd1Addr, agxAddr]))[1];
const [r0, r1] = await pair.getReserves();                             // 组 LP（Uniswap V2 min）
const totalSupply = await pair.totalSupply();
const [reserveU, reserveAGX] = token0IsAgx ? [r1, r0] : [r0, r1];
const lp0 = estimatedOhm * totalSupply / reserveAGX;
const lp1 = usdtForSwap * totalSupply / reserveU;
const estimatedLP = lp0 < lp1 ? lp0 : lp1;                             // ≈ 输入的 USD 价值
// 再套债券 payout 公式：payout = valuation(pair, estimatedLP) * 1e9 / agxPrice * 10000 / discountRateBP
```

Burn Bond 直接 `agxOut = getAmountsOut(usd1, [USD1, AGX])[1]` 后套 `payout = agxOut * 10000 / discountRateBP`。

> 合约未内置 `estimateLPInfo`/`payoutFor` 这类预估 view，前端按上述 JS 复算（方法二为标准做法）；若未来需要链上只读预估，可再把换币 + 组 LP 逻辑封装成 `estimateLPInfo(amountIn, principle)` view。

**示例**（主网 2026-08 池子：AGX≈55 USDT，discount 8500，fee=0）：LP Bond 1000 USD1 → ≈21.3 AGX；10000 USD1 → ≈213 AGX。实际以实时链上数据为准。

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
  await (await swapTokenContract.approve(await helper.getAddress(), amount)).wait();

  const tx = await helper.connect(signer).zapIntoLiquidityBond(bondAddr, swapToken, amount);
  const receipt = await tx.wait();
  console.log('Zapped! Bond amount:', receipt.logs.find(l => helper.interface.parseLog(l)?.name === 'ZapExecuted')?.args?.bondAmount);
}
```

##### zapIntoBurnBond(bond, swapToken, depositAmount) -> (uint256 bondAmount)

Zap 进入销毁债券。

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorNotApproved()` | 债券未授权 | 联系管理员 |
| `ErrorPairNotExist()` | LP 交易对不存在 | 使用正确的代币 |
| `ErrorInvalidBalance()` | 余额不足 | 检查余额 |
| `ErrorInvalidBondAmount()` | 债券金额为 0 | 重试 |
| `ErrorZeroAmount()` | 存入金额为 0 | 传入大于 0 的金额 |
| `ErrorZeroAddress()` | `setAuthorizedBond` 传入零地址 | 传入有效债券地址 |
| `ErrorBondHelper()` | `setSlippage` 参数 ≥ 100 | 传入 0-99 的滑点百分比 |

### 配置参数

| 参数 | 说明 | 设置者 |
| --- | --- | --- |
| `token` | AGX 代币地址 (public) | `initialize` 一次性设置 |
| `swapRouter` | PancakeSwap 路由器 (public) | `initialize` 一次性设置 |
| `factory` | PancakeFactory 地址 (public)，`initialize` 时由 `swapRouter.factory()` 派生 | 不可改 |
| `slippage` | 滑点百分比，默认 3（`_getMinAmount` 用 `(100-slippage)/100` 计算） | owner (`setSlippage`, <100) |
| `authContracts` | 授权的债券合约映射 (public mapping) | owner (`setAuthorizedBond`) |

### 管理函数

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `initialize(address _token, address _router)` | initializer | 一次性初始化 `token`/`swapRouter`/`factory`/`slippage=3` |
| `setSlippage(uint256 _slippage)` | onlyOwner | 设置滑点百分比；≥100 回滚 `ErrorBondHelper` |
| `setAuthorizedBond(address _bond, bool _allowed)` | onlyOwner | 维护授权债券列表；零地址回滚 `ErrorZeroAddress`，触发 `AuthorizedBondUpdated` |

### 事件

| 事件 | 说明 |
| --- | --- |
| `AuthorizedBondUpdated(address indexed _bond, bool _allowed, uint256 timestamp)` | `setAuthorizedBond` 修改授权时触发 |
| `ZapExecuted(address indexed user, address indexed bond, address indexed swapToken, uint256 depositAmount, uint256 bondAmount, uint8 zapType, uint256 timestamp)` | Zap 成功执行；`zapType=0` 流动性债券，`zapType=1` 销毁债券 |
