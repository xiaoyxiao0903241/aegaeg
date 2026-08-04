# DaoPool

> 来源：`doc-contracts-daopool`
> ABI：[`abis/daopool.json`](../abis/daopool.json)

## 完整 ABI

abi/DaoPool.json
SHA-256 34ed701e7498…
46
17
7
22

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/daopool.json`](../abis/daopool.json)（46 entries）。

</details>

## DaoPool

`DaoPool` 源码位于 `src/Dao.sol`，合约名为 `DaoPool`。当前主入口是混合领取，不是旧文档中的 `claimReward(planIndex, amount, signature)`。

**部署 key**：`DaoPool`

**ABI**：`abi/DaoPool.json`

### 当前用户入口

solidity

```solidity
function claimRewardsMixed(
    uint256 _signType,
    uint256 _amount,
    uint256 _expireTime,
    bytes32 _salt,
    bytes calldata _sign,
    uint8 _releasePlanIndex,
    uint256 _restakePlanIndex,
    uint256 _restakeBps
) external nonReentrant
```

### 关键规则

- _signType 必须等于 4 。
- 签名消息为：

text

```text
keccak256(abi.encodePacked(address(this), salt, user, amount, expireTime, signType))
```

- _sign 必须由 rewardSigner 签名。
- expireTime 必须大于当前时间。
- signHash 和 salt 都只能使用一次。
- 领取时会通过 RestakeLib.consumeContribution 消耗贡献值。
- 奖励按 _restakeBps 拆分：
- release 部分进入 RewardQueue。
- restake 部分进入配置的复投路径。

### 前端示例

javascript

```javascript
const signType = 4n
const amount = ethers.parseUnits('100', 9)
const expireTime = BigInt(Math.floor(Date.now() / 1000) + 3600)
const salt = ethers.hexlify(ethers.randomBytes(32))

const msgHash = ethers.solidityPackedKeccak256(
  ['address', 'bytes32', 'address', 'uint256', 'uint256', 'uint256'],
  [DAO_POOL_ADDRESS, salt, userAddress, amount, expireTime, signType],
)

const signature = await rewardSigner.signMessage(ethers.getBytes(msgHash))

await (
  await daoPool.claimRewardsMixed(
    signType,
    amount,
    expireTime,
    salt,
    signature,
    0, // releasePlanIndex
    0, // restakePlanIndex
    5000n, // 50% restake
  )
).wait()
```

### 视图函数

- useSalt(bytes32 _salt) -> (bool) ：检查 salt 是否已被核销（源码 Dao.sol:103）。
- recoverSign(bytes32 _msgHash, bytes _signature, address _signer) -> (bool) ：public pure 签名校验工具，用于前端调试 ErrorInvalidSigner 。

### 相关配置与管理函数

- setRewardsSigner(address) (onlyOwner)：设置后端签名者；零地址回滚 ErrorZeroAddress 。
- setRewardQueue(address) (onlyOwner)：设置 RewardQueue 地址；零地址回滚 ErrorZeroAddress 。
- setRestakeConfig(address) (onlyOwner)：设置 RestakeConfig 地址。
- setReStakeContract(address _contract, uint256 _feeRate, bool _exists) (onlyOwner)：配置复投目标合约及费率（ _feeRate > 10000 回滚 ErrorInvalidRate ）。
- burn(uint256 _amount) ：任意地址可调用，将 token （AGX）从 msg.sender 转入 dead 地址销毁，触发 Burned 。

> 贡献值不足时领取会失败，前端应先查询并在必要时调用 `AgxContributionSwap.convert`。

### 事件

| 事件                                                                                                                                                     | 说明                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `Claimed(address indexed _user, uint256 _amount, uint8 _planIndex, bytes32 _salt, uint256 signType, uint256 timestamp)`                                  | 混合领取的 release 部分入队时触发（携带 releasePlanIndex）                   |
| `RewardsClaimed(address indexed _user, uint256 _amount, bytes32 _salt, uint256 timestamp)`                                                               | 已声明但当前实现未 emit（保留兼容）                                          |
| `RestakeClaimed(address indexed _user, uint256 _reward, uint256 _restakeAmount, uint256 _taxBP, uint256 _planIndex, uint256 _period, uint256 timestamp)` | 复投领取                                                                     |
| `RewardsClaimedMixed(...)`                                                                                                                               | 混合领取（当前主入口 `claimRewardsMixed` 触发，含 release/restake 拆分详情） |
| `Burned(address indexed _user, uint256 _amount, uint256 timestamp)`                                                                                      | `burn` 销毁 AGX 时触发                                                       |

### 错误码

| 错误                         | 原因                                                                        | 解决方案         |
| ---------------------------- | --------------------------------------------------------------------------- | ---------------- |
| `ErrorUnauthorized()`        | 已声明但当前实现未使用（owner 限制由 OZ `OwnableUnauthorizedAccount` 抛出） | 通过 owner 调用  |
| `ErrorAlreadyUsed()`         | 签名或 salt 已核销                                                          | 申请新签名/salt  |
| `ErrorInvalidSigner()`       | 签名验证失败                                                                | 重新申请签名     |
| `ErrorSignatureExpired()`    | `expireTime <= block.timestamp`                                             | 获取未过期签名   |
| `ErrorInvalidRate()`         | `setReStakeContract` 费率 > 10000                                           | 校正费率         |
| `ErrorZeroAddress()`         | 传入零地址                                                                  | 传入有效地址     |
| `ErrorInvalidStakeAddress()` | 已声明但当前实现未使用（复投目标校验由 RestakeLib 处理）                    | 检查复投合约配置 |
| `ErrorInvalidSignType()`     | `_signType != 4`                                                            | 使用 signType=4  |
