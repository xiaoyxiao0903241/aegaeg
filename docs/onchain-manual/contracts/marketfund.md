# MarketFund（AegisMarketFund）

> 来源：`doc-contracts-marketfund`
> ABI：[`abis/marketfund.json`](../abis/marketfund.json)

## 完整 ABI

abi/AegisMarketFund.json
SHA-256 ef877768533d…
33
14
5
14

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/marketfund.json`](../abis/marketfund.json)（33 entries）。

</details>

## MarketFund（AegisMarketFund）

### 概述

`AegisMarketFund` 是独立的做市社区发展津贴 AGX 领取合约，实现方式与 CommunityFund 的签名领取一致，但资产固定为 9 位精度 AGX。

**部署 key**：`MarketFund`

**ABI**：`abi/AegisMarketFund.json`

后端/扫描器按业务规则计算用户可领取金额并签名；用户调用：

solidity
```solidity
claimReward(signType, amount, expireTime, salt, signature)
```

签名消息包含 `address(this)`、`salt`、用户、金额、过期时间和 `signType`，因此签名不能跨用户或跨合约复用。合约同时核销 signature 和 salt。

### 资金来源

> **来源说明**：`MARKET_FUND_REBASE_FUNDING_BPS`、`MARKET_FUND_DEPOSIT_AMOUNT`、`rate_bp=800` **均不在本合约 ABI 中**，前端不要在 `AegisMarketFund` ABI 上查找这些字段。RewardManager 源码亦未提供 MarketFund 专属分配常量（详见 `docs/contracts/RewardManager.md`）：MarketFund 若要参与 RewardManager 分配，只能通过 `addRecipient(marketFund, rate)` 作为普通 recipient 按 ppm 配置。`rate_bp=800` 是 scanner 侧的业务口径参数，不是合约常量。

- 实际资金入口是 deposit(amount) （任意地址可调用，向合约补充 AGX）以及 scanner/运营按业务 delta 偿付。
- scanner 当前真实口径是业务 AGX 净增减 delta × rate_bp / 10,000 ，默认 rate_bp=800 。这与"基础 Rebase 的 8% 储备预算"是两个不同基数，生产环境必须监控 MarketFund AGX 余额 >= 已签发未领取负债 。

### 管理接口

- setSigner(address) ：owner 更新签名者（零地址回滚 ErrorZeroAddress ，触发 SignerUpdated ）。
- emergencyWithdraw(to, amount) ：owner 应急提取（ to 零地址回滚 ErrorZeroAddress ）。
- rewardSigner() 、 useSalt(salt) ：签名配置与核销查询。
- recoverSign(msgHash, signature, signer) ：public pure，前端可复用的签名校验工具，用于调试 ErrorInvalidSigner 。

生产环境的 owner 和 signer 应使用不同的多签/受控服务账户；签名前必须先校验资金覆盖。

### 事件

| 事件 | 说明 |
| --- | --- |
| `Claimed(address indexed user, uint256 amount, bytes32 salt, uint256 signType, uint256 timestamp)` | 用户成功领取 AGX 津贴 |
| `SignerUpdated(address indexed oldSigner, address indexed newSigner)` | `setSigner` 切换签名者 |
| `Deposited(address indexed depositor, uint256 amount, uint256 timestamp)` | `deposit` 补充 AGX 库存 |

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorZeroAddress()` | `initialize`/`setSigner`/`emergencyWithdraw` 传入零地址 | 传入有效地址 |
| `ErrorZeroAmount()` | `deposit`/`claimReward` 金额为 0 | 传入大于 0 的金额 |
| `ErrorInvalidSigner()` | 签名验证失败 | 重新向后端申请签名 |
| `ErrorAlreadyUsed()` | 签名或 salt 已核销 | 使用新的签名/salt |
| `ErrorSignatureExpired()` | `expireTime <= block.timestamp` | 获取未过期签名 |
