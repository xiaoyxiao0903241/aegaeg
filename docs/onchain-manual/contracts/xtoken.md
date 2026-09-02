# XToken 合约文档

> 来源：`doc-contracts-xtoken`
> ABI：[`abis/xtoken.json`](../abis/xtoken.json)

## 完整 ABI

abi/XToken.json
SHA-256 8dc8e0ffb1a6…
48
26
9
12

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/xtoken.json`](../abis/xtoken.json)（48 entries）。

</details>

## XToken 合约文档

### 概述

`XToken` (X) 是 AEGIS X 生态系统中的流动性凭证代币，用于表示用户在协议中的流动性头寸。继承自 OpenZeppelin 的 ERC20 实现，支持标准的代币操作。

核心行为：总供应 210M（`TOTAL_SUPPLY = 210_000_000 ether`，源码 `src/X.sol:17`）；卖出税 25%（`SELL_TAX_BP = 2500`，源码 `:23`）；非白名单地址从 Pair 买入会被拒绝（`BuyNotAllowed`，源码 `:113`）；`burnPoolBalance` 受 `BALANCE_COOLDOWN = 6 hours` 冷却约束（源码 `:29`）。

**部署 key**: `XToken`

**ABI 路径**: `abi/XToken.json`

---

### 关键概念

#### 1. 流动性凭证

XToken 代表用户在协议中的流动性份额，可以通过提供流动性获得，也可以通过销毁流动性头寸赎回。

#### 2. 与 StakingPool 的关系

XToken 可以被质押到 XStakingPool 中挖矿获得奖励，是 gAGX 封装系统的重要组成部分。

---

### 前端 API

#### 视图函数（ERC20标准）

javascript
```javascript
// 查询余额
const balance = await xToken.balanceOf(userAddress);

// 查询授权额度
const allowance = await xToken.allowance(ownerAddress, spenderAddress);

// 查询总供应量
const totalSupply = await xToken.totalSupply();
```

#### 状态修改函数

##### transfer(to, amount)

转账 XToken。

javascript
```javascript
const tx = await xToken.transfer(receiverAddress, amount);
await tx.wait();
console.log(`转账成功: ${ethers.formatUnits(amount, 18)} X`);
```

##### approve(spender, amount)

授权其他地址使用 XToken。

javascript
```javascript
const tx = await xToken.approve(spenderAddress, amount);
await tx.wait();
console.log(`授权成功: ${ethers.formatUnits(amount, 18)} X`);
```

##### transferFrom(from, to, amount)

执行授权转账。

javascript
```javascript
const tx = await xToken.transferFrom(fromAddress, toAddress, amount);
await tx.wait();
console.log(`授权转账成功`);
```

##### 管理函数

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `setPair(address _pair)` | `onlyOwner` | 设置交易对 Pair（不可为零地址）。源码 `src/X.sol:79` |
| `addSystemWhitelist(address _addr)` | `onlyOwner` | 添加白名单地址（免卖出税/可买入）。源码 `:86` |
| `removeSystemWhitelist(address _addr)` | `onlyOwner` | 移除白名单地址。源码 `:92` |
| `setPoolBurnRatio(uint256 _newRatio)` | `onlyOwner` | 设置 LP 销毁比例 `targetRatio`，`_newRatio <= 500`。源码 `:98` |
| `burnPoolBalance()` | `onlyOwner` | 按比例销毁 Pair 中 X，受 6 小时冷却与 `targetRatio <= 500` 约束。源码 `:130` |

---

### 事件

#### Transfer

solidity
```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
```

#### Approval

solidity
```solidity
event Approval(address indexed owner, address indexed spender, uint256 value);
```

#### 其他事件

| 事件 | 说明 |
| --- | --- |
| `PairUpdated(address indexed _pair, uint256 timestamp)` | Pair 设置变更（源码 `:54`） |
| `WhitelistAdded(address indexed _addr, uint256 timestamp)` | 添加白名单（源码 `:57`） |
| `WhitelistRemoved(address indexed _addr, uint256 timestamp)` | 移除白名单（源码 `:60`） |
| `SellTaxBurned(address indexed _from, uint256 _amount, uint256 timestamp)` | 卖出税销毁（源码 `:63`） |
| `BalanceTargetRateChanged(uint256 _ratio, uint256 timestamp)` | LP 销毁比例变更（源码 `:66`） |
| `BalancePoolBurned(uint256 _burnAmount, uint256 timestamp)` | LP 余额销毁执行（源码 `:69`） |

---

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `ERC20InsufficientBalance` | 余额不足 | 确保有足够余额 |
| `ERC20InvalidApprover` | 授权地址无效 | 检查授权地址 |
| `ERC20InvalidReceiver` | 接收地址无效 | 检查接收地址 |
| `ERC20InvalidSender` | 发送地址无效 | 检查发送地址 |
| `ERC20InvalidSpender` | 花费者地址无效 | 检查花费者地址 |
| `BuyNotAllowed()` | 非白名单地址从 Pair 买入被拒 | 加入白名单或用白名单路径 |
| `InvalidAddress()` | 零地址非法 | 检查地址参数 |
| `InvalidRatio()` | 销毁比例 > 500 | 设置 _newRatio <= 500 |
| `ErrorCooldown()` | burnPoolBalance 命中 6h 冷却或 burnAmount 为 0 | 等待冷却结束 |

---

### 调用示例

#### 完整转账流程

javascript
```javascript
import { BrowserProvider, Contract } from 'ethers';

async function transferXToken() {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const xToken = new Contract(X_TOKEN_ADDRESS, ERC20_ABI, signer);

  // 1. 检查余额
  const balance = await xToken.balanceOf(userAddress);
  if (balance === 0n) {
    console.log('没有可用的 XToken');
    return;
  }

  // 2. 转账
  const receiver = '0x...';  // 接收地址
  const amount = ethers.parseUnits('10', 18);  // 10 X

  const tx = await xToken.transfer(receiver, amount);
  const receipt = await tx.wait();

  console.log(`✅ 转账成功: ${ethers.formatUnits(amount, 18)} X`);
}

transferXToken().catch(console.error);
```

---

### 依赖关系

XToken 是独立的 ERC20 代币，不依赖其他合约。但在以下场景中使用：

- XStakingPool : 用户质押 gAGX 获得 X 奖励
- 流动性池 : 与其他代币组成交易对
