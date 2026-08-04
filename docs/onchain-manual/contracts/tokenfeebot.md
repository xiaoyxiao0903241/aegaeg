# TokenFeeBot (AegisTokenFeeRoutingBot) 合约文档

> 来源：`doc-contracts-tokenfeebot`
> ABI：[`abis/tokenfeebot.json`](../abis/tokenfeebot.json)

## 完整 ABI

abi/AegisTokenFeeRoutingBot.json
SHA-256 315fb3f8cda4…
32
19
5
8

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/tokenfeebot.json`](../abis/tokenfeebot.json)（32 entries）。

</details>

## TokenFeeBot (AegisTokenFeeRoutingBot) 合约文档

### 概述

`AegisTokenFeeRoutingBot` 与 FeeBot 类似，是代币费用路由机器人，自动将累积的代币费用交换为 USD 并分发给接收者。

**部署 key**: `TokenFeeBot`

**ABI 路径**: `abi/AegisTokenFeeRoutingBot.json`

---

### 前端 API

#### 视图函数

##### isExecSwap() -> (uint256 swapAmount, bool shouldExecute)

检查是否满足交换条件。

js

```js
const [amount, shouldExec] = await tokenFeeBot.isExecSwap()
```

#### 状态修改函数

##### exec()

执行费用交换和分发。

##### initialize(address _token, address _usd, address _router) — initializer

初始化合约：设置费用代币、目标 USD、路由器，授予调用者 `DEFAULT_ADMIN_ROLE` 与 `ADMIN_ROLE`，默认 `threshold = 3e9`。

##### addReceiver(address _receiver) — DEFAULT_ADMIN_ROLE

向 `receivers` 列表追加接收者（零地址拒绝，触发 `ZeroAddress`）。

##### removeReceiver(uint256 _index) — DEFAULT_ADMIN_ROLE

按索引删除接收者（用末尾元素填补并 pop）。索引越界触发 `IndexOutOfBounds`。

##### setThreshold(uint256 _threshold) — DEFAULT_ADMIN_ROLE

设置交换触发阈值（0 拒绝，触发 `InvalidThreshold`）。

> 单笔交换上限 `1e10`（源码 `exec` 中硬编码 cap）。

### 事件

#### FeeRouted(address indexed receiver, uint256 tokenAmount, uint256 usdAmount, uint256 timestamp)

`exec` 成功将代币费用交换为 USD 并路由给接收者时触发。

### 错误码

| 错误                 | 原因                      | 解决方案     |
| -------------------- | ------------------------- | ------------ |
| `ZeroAddress()`      | 接收者地址为零            | 使用非零地址 |
| `InvalidThreshold()` | `threshold` 设为 0        | 设置正数阈值 |
| `IndexOutOfBounds()` | `removeReceiver` 索引越界 | 使用有效索引 |

### 配置参数

| 参数        | 默认值 | 说明         | 设置者       |
| ----------- | ------ | ------------ | ------------ |
| `threshold` | 3e9    | 交换触发阈值 | ADMIN_ROLE   |
| `receivers` | []     | 接收者列表   | ADMIN_ROLE   |
| `token`     | -      | 费用代币     | 初始化时设置 |
| `usd`       | -      | 目标代币     | 初始化时设置 |
