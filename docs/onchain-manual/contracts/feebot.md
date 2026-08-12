# FeeBot (AegisFeeRoutingBot) 合约文档

> 来源：`doc-contracts-feebot`
> ABI：[`abis/feebot.json`](../abis/feebot.json)

## 完整 ABI

abi/AegisFeeRoutingBot.json
SHA-256 4a09dd2534fd…
47
27
8
12

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/feebot.json`](../abis/feebot.json)（47 entries）。

</details>

## FeeBot (AegisFeeRoutingBot) 合约文档

### 概述

`AegisFeeRoutingBot` 是自动费用路由机器人，累积 AGX 费用并自动交换为 USD 分发给多个接收者。

**部署 key**: `FeeBot`

**BNB Chain 主网 proxy**: `0x7E31365dcEdDD37CD9eAB383531fD32907568ab9`（release `bb680398-e7c0-46fa-ad87-139446fb4120`）

**ABI 路径**: `abi/AegisFeeRoutingBot.json`

---

### 关键概念

- 当余额达到 threshold 时，自动将 AGX 交换为 USD
- 按接收者列表轮询分发
- 单笔交换上限默认 5e10 AGX，可由 DEFAULT_ADMIN_ROLE 调整
- 滑点默认 500 BPS（5%），每次交换前通过 Router 报价计算 minUsdOut
- 成功交换间隔默认 1 小时；未达阈值时 exec() 直接返回且不刷新时间

### 前端 API

#### 视图函数

##### isExecSwap() -> (uint256 swapAmount, bool shouldExecute)

检查是否满足交换条件。

js
```js
const [amount, shouldExec] = await feeBot.isExecSwap();
if (shouldExec) {
  console.log('Ready to swap:', ethers.formatUnits(amount, 9), 'AGX');
}
```

#### 状态修改函数

##### exec()

执行费用交换和分发，仅 `KEEPER_ROLE` 可调用。

js
```js
// 当前 signer 必须持有 KEEPER_ROLE
const tx = await feeBot.exec();
await tx.wait();
```

##### initialize(address _token, address _usd, address _router) — initializer

初始化合约：设置费用代币、目标 USD、路由器，授予调用者 `DEFAULT_ADMIN_ROLE`、`ADMIN_ROLE` 与 `KEEPER_ROLE`，默认 `threshold = 1e10`。

##### addReceiver(address _receiver) — DEFAULT_ADMIN_ROLE

向 `receivers` 列表追加接收者（零地址拒绝，触发 `ZeroAddress`）。

##### removeReceiver(uint256 _index) — DEFAULT_ADMIN_ROLE

按索引删除接收者（用末尾元素填补并 pop）。索引越界触发 `IndexOutOfBounds`。

##### setThreshold(uint256 _threshold) — DEFAULT_ADMIN_ROLE

设置交换触发阈值（0 拒绝，触发 `InvalidThreshold`）。

##### setMinExecInterval(uint256 _interval) — DEFAULT_ADMIN_ROLE

设置成功交换的最小时间间隔；允许设为 0 关闭限频。

##### setMaxSwapPerCall(uint256 _cap) — DEFAULT_ADMIN_ROLE

设置单次交换上限；0 会触发 `InvalidCap`。

##### setSlippageBps(uint256 _bps) — DEFAULT_ADMIN_ROLE

设置滑点保护，范围 `0–5000` BPS；超出范围触发 `InvalidSlippage`。

### 事件

#### FeeRouted(address indexed receiver, uint256 tokenAmountIn, uint256 minUsdOut, uint256 timestamp)

`exec` 成功将费用交换为 USD 并路由给接收者时触发。`minUsdOut` 是提交给 Router 的最小输出，不是实际 USD 到账量。

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
| `threshold` | 1e10 | 交换触发阈值 | DEFAULT_ADMIN_ROLE |
| `maxSwapPerCall` | 5e10 | 单笔交换上限 | DEFAULT_ADMIN_ROLE |
| `slippageBps` | 500 | Router 最小输出滑点 | DEFAULT_ADMIN_ROLE |
| `minExecInterval` | 1 hour | 成功交换最小间隔 | DEFAULT_ADMIN_ROLE |
| `receivers` | [] | 接收者列表 | DEFAULT_ADMIN_ROLE |
| `token` | AGX | 费用代币 | 初始化时设置 |
| `usd` | USD | 目标代币 | 初始化时设置 |
