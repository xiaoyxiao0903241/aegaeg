# FeeBot (AegisFeeRoutingBot) 合约文档

> 来源：`doc-contracts-feebot`
> ABI：[`abis/feebot.json`](../abis/feebot.json)

## 完整 ABI

abi/AegisFeeRoutingBot.json
SHA-256 747a38e37c49…
32
19
5
8

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/feebot.json`](../abis/feebot.json)（32 entries）。

</details>

## FeeBot (AegisFeeRoutingBot) 合约文档

### 概述

`AegisFeeRoutingBot` 是自动费用路由机器人，累积 AGX 费用并自动交换为 USD 分发给多个接收者。

**部署 key**: `FeeBot`

**ABI 路径**: `abi/AegisFeeRoutingBot.json`

---

### 关键概念

- 当余额达到 threshold 时，自动将 AGX 交换为 USD
- 按接收者列表轮询分发
- 单笔最大交换 5e10 AGX

### 前端 API

#### 视图函数

##### isExecSwap() -> (uint256 swapAmount, bool shouldExecute)

检查是否满足交换条件。

js

```js
const [amount, shouldExec] = await feeBot.isExecSwap()
if (shouldExec) {
  console.log('Ready to swap:', ethers.formatUnits(amount, 9), 'AGX')
}
```

#### 状态修改函数

##### exec()

执行费用交换和分发。

js

```js
// 任何人都可以调用 exec，当达到阈值时自动执行
const tx = await feeBot.exec()
await tx.wait()
```

##### initialize(address _token, address _usd, address _router) — initializer

初始化合约：设置费用代币、目标 USD、路由器，授予调用者 `DEFAULT_ADMIN_ROLE` 与 `ADMIN_ROLE`，默认 `threshold = 1e10`。

##### addReceiver(address _receiver) — DEFAULT_ADMIN_ROLE

向 `receivers` 列表追加接收者（零地址拒绝，触发 `ZeroAddress`）。

##### removeReceiver(uint256 _index) — DEFAULT_ADMIN_ROLE

按索引删除接收者（用末尾元素填补并 pop）。索引越界触发 `IndexOutOfBounds`。

##### setThreshold(uint256 _threshold) — DEFAULT_ADMIN_ROLE

设置交换触发阈值（0 拒绝，触发 `InvalidThreshold`）。

### 事件

#### FeeRouted(address indexed receiver, uint256 agxAmount, uint256 usdAmount, uint256 timestamp)

`exec` 成功将费用交换为 USD 并路由给接收者时触发。

### 错误码

| 错误                 | 原因                      | 解决方案     |
| -------------------- | ------------------------- | ------------ |
| `ZeroAddress()`      | 接收者地址为零            | 使用非零地址 |
| `InvalidThreshold()` | `threshold` 设为 0        | 设置正数阈值 |
| `IndexOutOfBounds()` | `removeReceiver` 索引越界 | 使用有效索引 |

### 配置参数

| 参数        | 默认值 | 说明         | 设置者       |
| ----------- | ------ | ------------ | ------------ |
| `threshold` | 1e10   | 交换触发阈值 | ADMIN_ROLE   |
| `receivers` | []     | 接收者列表   | ADMIN_ROLE   |
| `token`     | AGX    | 费用代币     | 初始化时设置 |
| `usd`       | USD    | 目标代币     | 初始化时设置 |
