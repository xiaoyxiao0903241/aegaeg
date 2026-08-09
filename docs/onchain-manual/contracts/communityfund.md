# CommunityFund (AegisCommunityFund) 合约文档

> 来源：`doc-contracts-communityfund`
> ABI：[`abis/communityfund.json`](../abis/communityfund.json)

## 完整 ABI

abi/AegisCommunityFund.json
SHA-256 6ee6f2d2f08f…
33
14
5
14

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/communityfund.json`](../abis/communityfund.json)（33 entries）。

</details>

## CommunityFund (AegisCommunityFund) 合约文档

### 概述

`AegisCommunityFund` 是 AEGIS X 的社区基金合约。用户存入 USD 代币，通过 ECDSA 签名验证领取奖励。采用防重放机制（salt + signature hash）。

**部署 key**: `CommunityFund`

**ABI 路径**: `abi/AegisCommunityFund.json`

---

### 关键概念

#### 1. 签名领取机制

- 奖励通过后端签发的 ECDSA 签名领取
- 签名内容： keccak256(abi.encodePacked(this, salt, user, amount, expireTime, signType))
- 防重放： rewardSignUse[signature] 和 signatureSalts[salt] 双标记

#### 2. 资金存入

- 任何人都可以 deposit() 向社区基金注入 USD
- 仅授权签名者可批准领取

---

### 前端 API

#### 视图函数

##### useSalt(bytes32 _salt) -> (bool)

检查 salt 是否已被使用。

js
```js
const used = await communityFund.useSalt(salt);
console.log('Salt used:', used);
```

##### 管理员视图

js
```js
const usd = await communityFund.usd();
const signer = await communityFund.rewardSigner();
const fundBalance = await usdContract.balanceOf(communityFundAddress);
```

#### 状态修改函数

##### deposit(uint256 _amount)

向社区基金注入 USD。

js
```js
async function depositToFund(communityFund, usdContract, amount, signer) {
  await (await usdContract.approve(await communityFund.getAddress(), amount)).wait();
  const tx = await communityFund.connect(signer).deposit(amount);
  await tx.wait();
  console.log('Deposited', ethers.formatUnits(amount, 18), 'USD to community fund');
}
```

##### claimReward(signType, amount, expireTime, salt, signature)

使用签名领取奖励。

js
```js
async function claimCommunityReward(communityFund, signType, amount, expireTime, salt, signature, signer) {
  // 验证签名未使用
  const used = await communityFund.useSalt(salt);
  if (used) throw new Error('Signature already used');

  const tx = await communityFund.connect(signer).claimReward(signType, amount, expireTime, salt, signature);
  await tx.wait();
  console.log('Reward claimed:', ethers.formatUnits(amount, 18), 'USD');
}
```

##### setSigner(address _signer) (onlyOwner)

更新后端签名验证者。零地址回滚 `ErrorZeroAddress`，触发 `SignerUpdated(oldSigner, newSigner)`。

##### emergencyWithdraw(address _to, uint256 _amount) (onlyOwner, nonReentrant)

应急提取合约 USD 余额到 `_to`。`_to` 零地址回滚 `ErrorZeroAddress`。

##### recoverSign(bytes32 _msgHash, bytes memory _signature, address _signer) -> (bool) (public pure)

链下/前端可复用的签名恢复校验工具，返回签名是否由 `_signer` 签出 `_msgHash`。常用于调试 `ErrorInvalidSigner` 时本地复现合约的签名校验逻辑。

---

### 事件

#### Claimed(address indexed user, uint256 amount, bytes32 salt, uint256 signType, uint256 timestamp)

领取奖励时触发。

#### SignerUpdated(address indexed oldSigner, address indexed newSigner)

`setSigner` 切换签名者时触发。

#### Deposited(address indexed depositor, uint256 amount, uint256 timestamp)

存入资金时触发。

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ErrorAlreadyUsed()` | 签名或 salt 已使用 | 使用新的签名/salt |
| `ErrorInvalidSigner()` | 签名验证失败 | 检查签名数据 |
| `ErrorSignatureExpired()` | 签名已过期 | 获取新的签名 |
| `ErrorZeroAmount()` | 金额为 0 | 增加金额 |
| `ErrorZeroAddress()` | `initialize`/`setSigner`/`emergencyWithdraw` 传入零地址 | 传入有效地址 |

### 配置参数

| 参数 | 说明 | 设置者 |
| --- | --- | --- |
| `usd` | USD 代币地址 | 初始化时设置 |
| `rewardSigner` | 签名验证地址 | owner |
