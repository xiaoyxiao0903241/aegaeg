# TokenFeeBot (AegisTokenFeeRoutingBot) 合约文档

> 来源：`doc-contracts-tokenfeebot`
> ABI：[`abis/tokenfeebot.json`](../abis/tokenfeebot.json)

## 完整 ABI

abi/AegisTokenFeeRoutingBot.json
SHA-256 4a09dd2534fd…
47
27
8
12

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/tokenfeebot.json`](../abis/tokenfeebot.json)（47 entries）。

</details>

## TokenFeeBot (AegisTokenFeeRoutingBot) 合约文档

### 概述

`AegisTokenFeeRoutingBot` 与 FeeBot 类似，是代币费用路由机器人，自动将累积的代币费用交换为 USD 并分发给接收者。

**部署 key**: `TokenFeeBot`

**BNB Chain 主网 proxy**: `0x379B3BFD7e5D1A7C07C7bb132870044b3E156Fe2`（release `bb680398-e7c0-46fa-ad87-139446fb4120`）

**ABI 路径**: `abi/AegisTokenFeeRoutingBot.json`

---

### 前端 API

#### 视图函数

##### isExecSwap() -> (uint256 swapAmount, bool shouldExecute)

检查是否满足交换条件。

js
```js
const [amount, shouldExec] = await tokenFeeBot.isExecSwap();
```

#### 状态修改函数

##### exec()

执行费用交换和分发，仅 `KEEPER_ROLE` 可调用。成功交换间隔默认 1 小时；未达阈值时直接返回且不刷新时间。

##### initialize(address _token, address _usd, address _router) — initializer

初始化合约：设置费用代币、目标 USD、路由器，授予调用者 `DEFAULT_ADMIN_ROLE` 与 `ADMIN_ROLE`，默认 `threshold = 3e9`。

##### addReceiver(address _receiver) — DEFAULT_ADMIN_ROLE

向 `receivers` 列表追加接收者（零地址拒绝，触发 `ZeroAddress`）。

##### removeReceiver(uint256 _index) — DEFAULT_ADMIN_ROLE

按索引删除接收者（用末尾元素填补并 pop）。索引越界触发 `IndexOutOfBounds`。

##### setThreshold(uint256 _threshold) — DEFAULT_ADMIN_ROLE

设置交换触发阈值（0 拒绝，触发 `InvalidThreshold`）。

##### setMinExecInterval(uint256 _interval) — DEFAULT_ADMIN_ROLE

设置成功交换的最小时间间隔；允许设为 0 关闭限频。

##### setMaxSwapPerCall(uint256 _cap) — DEFAULT_ADMIN_ROLE

设置单次交换上限，默认 `1e10`；0 会触发 `InvalidCap`。

##### setSlippageBps(uint256 _bps) — DEFAULT_ADMIN_ROLE

设置滑点保护，默认 `500` BPS，范围 `0–5000`；超出范围触发 `InvalidSlippage`。

### 事件

#### FeeRouted(address indexed receiver, uint256 tokenAmountIn, uint256 minUsdOut, uint256 timestamp)

`exec` 成功将代币费用交换为 USD 并路由给接收者时触发。`minUsdOut` 是提交给 Router 的最小输出，不是实际 USD 到账量。

- MinExecIntervalUpdated(oldInterval, newInterval) ：最小执行间隔更新。
- MaxSwapPerCallUpdated(oldCap, newCap) ：单笔上限更新。
- SlippageUpdated(oldBps, newBps) ：滑点 BPS 更新。

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ZeroAddress()` | 接收者地址为零 | 使用非零地址 |
| `InvalidThreshold()` | `threshold` 设为 0 | 设置正数阈值 |
| `IndexOutOfBounds()` | `removeReceiver` 索引越界 | 使用有效索引 |
| `ErrorTooSoon(nextAllowedAt)` | 距上次成功交换未满最小间隔 | 在 `nextAllowedAt` 后重试 |
| `ZeroReceiver()` | 当前轮询接收者为零地址 | 修复接收者集合 |
| `InvalidCap()` | 单笔上限设为 0 | 设置正数上限 |
| `InvalidSlippage()` | 滑点超过 5000 BPS | 设置 `0–5000` |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `threshold` | 3e9 | 交换触发阈值 | DEFAULT_ADMIN_ROLE |
| `maxSwapPerCall` | 1e10 | 单笔交换上限 | DEFAULT_ADMIN_ROLE |
| `slippageBps` | 500 | Router 最小输出滑点 | DEFAULT_ADMIN_ROLE |
| `minExecInterval` | 1 hour | 成功交换最小间隔 | DEFAULT_ADMIN_ROLE |
| `receivers` | [] | 接收者列表 | DEFAULT_ADMIN_ROLE |
| `token` | - | 费用代币 | 初始化时设置 |
| `usd` | - | 目标代币 | 初始化时设置 |
