# RBS (AegisReserveMarketMaker) 合约文档

> 来源：`doc-contracts-rbs`
> ABI：[`abis/rbs.json`](../abis/rbs.json)

## 完整 ABI

abi/AegisReserveMarketMaker.json
SHA-256 37a3971e2403…
40
30
5
5

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/rbs.json`](../abis/rbs.json)（40 entries）。

</details>

## RBS (AegisReserveMarketMaker) 合约文档

### 概述

`AegisReserveMarketMaker` 是 AEGIS X 的储备做市商合约，负责 LP 管理、价格查询、流动性添加/移除和向 Treasury 铸造。

**部署 key**: `RBS`

**ABI 路径**: `abi/AegisReserveMarketMaker.json`

---

### 前端 API

#### 视图函数

##### getTokenPrice(address token) -> (uint256 price)

获取指定代币的 LP 价格（按 1e18 定点）。

js

```js
const price = await rbs.getTokenPrice(agxAddress)
console.log('AGX price:', ethers.formatUnits(price, 18))
```

##### estimateLiquidityAmount(amount0, amount1) -> (lpAmount, totalSupply)

预估添加流动性可获得的 LP 数量（使用默认 `pair`）。

##### estimateLiquidityAmountForPair(address _pair, uint256 _amount0, uint256 _amount1) -> (lpAmount, totalSupply)

针对指定 Pair 预估 LP 数量。源码 `src/RBS.sol:235`

##### getAmountForPair(address _pair, address _token, uint256 _amountIn) -> (uint256 amount)

按指定 Pair 储备计算等价 amount。源码 `:214`

##### quote(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) -> (uint256)

纯函数 Uniswap quote。源码 `:245`

##### calculateLiquidityAmount(amount0, amount1, reserve0, reserve1, totalSupply) -> (uint256)

纯函数计算 LP 数量。源码 `:252`

##### getAmountsIn(amountOut, path) -> (uint[]) / getAmountsOut(amountIn, path) -> (uint[])

路由器价格查询代理。

#### 状态修改函数

##### mint(uint256 _usdAmount, uint256 _profitAmount)

向 Treasury 存入储备并铸造 AGX（仅 `owner`，源码 `src/RBS.sol:335`）。三条硬约束：

1. _usdAmount <= IERC20(usd).balanceOf(address(this)) ，否则 revert "Insufficient balance"
2. lastMintTime == 0 || block.timestamp > lastMintTime + MINT_COOLDOWN ，否则 revert "invalid times" （30 分钟冷却）
3. _usdAmount <= 200_000 * 1e18 ，否则 revert "max balance" （单次上限 20 万 USD）
4. monitorToken == address(0) || _normalizedMonitorBalance() < monitorTokenCap ，否则 revert "Unauthorized" （监控代币归一化余额超上限）

##### swap(path, amountIn, amountOutMin, deadline)

执行代币交换（`onlyOwnerOrOperator`）。

##### addLiquidity(tokenA, tokenB, amountAIn, amountBIn, deadline)

添加流动性（`onlyOwnerOrOperator`）。

##### burnLP(uint256 amount)

销毁 LP 代币到 dead 地址（`onlyOwnerOrOperator`）。

##### removeLiquidity(address _pair, uint256 _liquidity, uint256 _amountAMin, uint256 _amountBMin, uint256 _deadline)

移除指定 Pair 的流动性（`onlyOwnerOrOperator`，源码 `src/RBS.sol:312`）。

#### Admin 函数

| 函数                                            | 权限        | 说明                                                                  |
| ----------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `setMonitorToken(address _token)`               | `onlyOwner` | 设置监控代币，非零地址时自动读取其 decimals。源码 `:124`              |
| `setMonitorTokenCap(uint256 _cap)`              | `onlyOwner` | 设置监控代币归一化余额上限。源码 `:132`                               |
| `setOperator(address _operator, bool _enabled)` | `onlyOwner` | 设置 operator（要求非零地址，否则 `"Invalid operator"`）。源码 `:137` |

---

### 事件

| 事件                                                                         | 说明              |
| ---------------------------------------------------------------------------- | ----------------- |
| `Minted(address indexed _send, uint256 _amount, uint256 timestamp)`          | mint 成功铸造     |
| `Burned(address indexed _to, uint256 _amount, uint256 timestamp)`            | burnLP 销毁       |
| `OperatorUpdated(address indexed operator, bool enabled, uint256 timestamp)` | operator 状态变更 |

源码：`src/RBS.sol:117-121`

### 错误码

| 错误字符串                          | 原因                                  | 解决方案            |
| ----------------------------------- | ------------------------------------- | ------------------- |
| `"RBS: not authorized"`             | 非 owner/operator                     | 使用正确地址        |
| `"Invalid operator"`                | setOperator 传零地址                  | 传入非零地址        |
| `"Zero address"`                    | getTokenPrice 传零地址                | 传入非零地址        |
| `"Empty pool"`                      | 储备为 0                              | 检查 Pair 储备      |
| `"Insufficient balance"`            | swap/addLiquidity 余额不足            | 充值                |
| `"Insufficient input amount"`       | quote amountIn 为 0                   | 传入正数            |
| `"Insufficient liquidity"`          | quote 储备为 0                        | 检查储备            |
| `"Insufficient liquidity for mint"` | calculateLiquidityAmount 最小 LP 不足 | 增大输入数量        |
| `"Insufficient LP balance"`         | burnLP/removeLiquidity LP 余额不足    | 充值 LP             |
| `"invalid times"`                   | mint 命中 30 分钟冷却                 | 等待冷却结束        |
| `"max balance"`                     | mint 单次超过 200_000 * 1e18          | 拆分多次            |
| `"Unauthorized"`                    | 监控代币归一化余额 >= monitorTokenCap | 调高 cap 或减少余额 |

### 配置参数

| 参数                   | 默认值            | 说明                   | 设置者                        |
| ---------------------- | ----------------- | ---------------------- | ----------------------------- |
| `swapRouter`           | -                 | PancakeSwap 路由器     | 初始化时设置                  |
| `pair`                 | -                 | 默认 LP 交易对         | 初始化时设置                  |
| `treasury`             | -                 | 国库地址               | 初始化时设置                  |
| `usd`                  | -                 | USD 代币地址           | 初始化时设置                  |
| `monitorToken`         | 初始化时设置      | 监控代币地址           | owner（`setMonitorToken`）    |
| `monitorTokenDecimals` | 跟随 monitorToken | 监控代币精度           | 随 setMonitorToken 自动设置   |
| `monitorTokenCap`      | `20_000 * 1e9`    | 监控代币归一化余额上限 | owner（`setMonitorTokenCap`） |
| `operators`            | -                 | operator 白名单        | owner（`setOperator`）        |
| `lastMintTime`         | 0                 | 上次 mint 时间戳       | mint 时自动更新               |
| `MINT_COOLDOWN`        | 30 minutes        | mint 冷却（常量）      | -                             |

> 权限模型：`mint` 为 `onlyOwner`；`swap` / `addLiquidity` / `burnLP` / `removeLiquidity` 为 `onlyOwnerOrOperator`（owner 或 operators 中地址）。
