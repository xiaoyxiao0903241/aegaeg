# 预售奖励领取（AegisPresaleRewardClaimer）前端使用指南

> 来源：`doc-contracts-reward`
> ABI：[`abis/reward.json`](../abis/reward.json)

## 完整 ABI

abi/AegisPresaleRewardClaimer.json
SHA-256 6ee6f2d2f08f…
33
14
5
14

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/reward.json`](../abis/reward.json)（33 entries）。

</details>

## 预售奖励领取（AegisPresaleRewardClaimer）前端使用指南

`AegisPresaleRewardClaimer` 保存预售 USD1 奖励库存，并根据后端 signer 的一次性签名向用户发放。它不是 `PreSale.purchase`，也不存在 `claimAirdrop`。

**部署 key**：`RewardClaimer`

**ABI**：`abi/AegisPresaleRewardClaimer.json`

### 用户流程

后端返回：`signType`、`amount`、`expireTime`、`salt`、`signature`。签名消息必须是：

text
```text
keccak256(abi.encodePacked(
  address(this), salt, user, amount, expireTime, signType
))
```

用户调用：

solidity
```solidity
claimReward(signType, amount, expireTime, salt, signature)
```

前置检查：

- amount > 0 。
- expireTime > latestBlock.timestamp ，不要用本机时间作为最终判断。
- useSalt(salt) == false ；同一 signature 也只能使用一次。
- 合约 USD1 余额足够。
- 签名来自当前 rewardSigner() ，且绑定当前合约与当前用户。

成功后刷新 USD1 `balanceOf(user)`、`useSalt(salt)`，并解析 `Claimed(user,amount,salt,signType,timestamp)`。

### 运营接口

| 方法 | 权限 | 用途 |
| --- | --- | --- |
| `deposit(amount)` | 任意地址 | 先 approve USD1，再补充奖励库存 |
| `setSigner(signer)` | owner | 更新后端签名者 |
| `emergencyWithdraw(to,amount)` | owner | 应急提取 |

常见错误：`ErrorAlreadyUsed`、`ErrorInvalidSigner`、`ErrorSignatureExpired`、`ErrorZeroAmount`、`ErrorZeroAddress`（`initialize`/`setSigner`/`emergencyWithdraw` 传入零地址时回滚）。前端不能在签名失败后自行改变字段重试，必须重新向后端申请完整签名包。

### 事件

| 事件 | 说明 |
| --- | --- |
| `Claimed(address indexed user, uint256 amount, bytes32 salt, uint256 signType, uint256 timestamp)` | 用户成功领取奖励 |
| `SignerUpdated(address indexed oldSigner, address indexed newSigner)` | `setSigner` 切换签名者时触发 |
| `Deposited(address indexed depositor, uint256 amount, uint256 timestamp)` | `deposit` 补充奖励库存时触发 |
