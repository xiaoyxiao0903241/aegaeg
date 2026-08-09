# gAGX（AegisRedeemableGAGX）前端使用指南

> 来源：`doc-contracts-redeemablegagx`
> ABI：[`abis/redeemablegagx.json`](../abis/redeemablegagx.json)

## 完整 ABI

abi/AegisRedeemableGAGX.json
SHA-256 7281efbc5285…
47
25
7
15

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/redeemablegagx.json`](../abis/redeemablegagx.json)（47 entries）。

</details>

## gAGX（AegisRedeemableGAGX）前端使用指南

`AegisRedeemableGAGX` 是由 AGX 1:1 全额支撑、可赎回的 9 位 ERC20。用户可包装 AGX 获得 gAGX，用于 XStakingPool；Turbine 等授权合约可用自己的 AGX 为用户铸造。

**部署 key**：`RewardGAGX`

**ABI**：`abi/AegisRedeemableGAGX.json`

### 读取

| 方法 | 说明 |
| --- | --- |
| `agx()` | backing AGX 地址 |
| `balanceOf(user)` | 用户 gAGX，9 decimals |
| `backingBalance()` | 合约持有的 AGX 支撑余额 |
| `totalSupply()` | gAGX 总供应量；正常应不高于 backing |
| `authorizedMinters(account)` | 是否允许 `mintWithAgx` |
| `index()` | 固定 `1e18`，本合约不是 rebase token |
| `gonsForBalance(amount)` | 1:1 返回 gons（本合约非 rebase，gons = amount） |
| `balanceForGons(gons)` | 1:1 返回 balance |
| `decimals()` | 固定 9 |

### 用户写方法

| 流程 | 方法 | 前置条件 |
| --- | --- | --- |
| AGX → gAGX | `wrap(amount)` | 先 `AGX.approve(RewardGAGX, amount)`；amount > 0 |
| 代收人包装 | `wrapFor(recipient, amount)` | payer 授权 AGX；recipient 非零 |
| gAGX → AGX | `redeem(amount)` | gAGX 余额足够 |
| 赎回给他人 | `redeemTo(recipient, amount)` | gAGX 余额足够；recipient 非零 |

所有包装/赎回都是 1:1 原始单位，不收手续费。成功后同时刷新 AGX、gAGX、`backingBalance` 和 `totalSupply`，并监听 `Wrapped` / `Redeemed`。

`mintWithAgx(recipient,amount)` 仅 `authorizedMinters` 可调用，而且会先从调用者转入同额 AGX 再 mint，不是无抵押增发。普通前端不要展示该按钮。

### 管理员方法

| 方法 | 说明 |
| --- | --- |
| `initialize(agx)` | 初始化：设置 backing AGX 地址、代币名 `Governance AEGIS X` / `gAGX`，授予部署者 owner。零地址拒绝 |
| `setAuthorizedMinter(minter, allowed)` | `onlyOwner`，授权/撤销 `mintWithAgx` 调用者；零地址拒绝，触发 `AuthorizedMinterUpdated` |

### 事件

| 事件 | 触发时机 |
| --- | --- |
| `AuthorizedMinterUpdated(address indexed minter, bool allowed, uint256 timestamp)` | `setAuthorizedMinter` 修改授权时 |
| `Wrapped(address indexed account, address indexed recipient, uint256 amount, uint256 timestamp)` | 包装 AGX → gAGX 时 |
| `Redeemed(address indexed account, address indexed recipient, uint256 amount, uint256 timestamp)` | 赎回 gAGX → AGX 时 |

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorZeroAddress()` | recipient/minter/agx 为零 | 使用非零地址 |
| `ErrorZeroAmount()` | amount 为 0 | 使用正数金额 |
| `ErrorNotAuthorized()` | 非 authorizedMinter 调用 `mintWithAgx` | 检查授权 |
