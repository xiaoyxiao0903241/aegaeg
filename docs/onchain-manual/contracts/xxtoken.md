# XXToken（USDT）合约文档

> 来源：`doc-contracts-xxtoken`
> ABI：[`abis/xxtoken.json`](../abis/xxtoken.json)

## 完整 ABI

abi/USDT.json
SHA-256 24bd20d2e540…
25
13
3
8

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/xxtoken.json`](../abis/xxtoken.json)（25 entries）。

</details>

## XXToken（USDT）合约文档

### 概述

`XXToken` 的合约名为 `USDT`（源码 `src/XXToken.sol`），是 AEGIS X 生态系统中的 USDT 代币，用于 Usd1Swap 和其他需要稳定币交易的场景。继承自 OpenZeppelin 的 ERC20 实现，支持标准的代币操作。

合约构造为 `USDT("USDT","USDT")`，在项目内充当 USDT 使用；构造函数 `constructor(uint256 initialSupply)`（源码 `src/XXToken.sol:8`）需要传入 `initialSupply` 参数，部署时一次性铸造给 `msg.sender`。

**部署 key**: `XXToken`

**ABI 路径**: `abi/USDT.json`

---

### 关键概念

#### 1. USDT 代币

XXToken 代表 USDT（Tether），在协议中用作稳定币交易媒介。

#### 2. 与 Usd1Swap 集成

XXToken（USDT）是 Usd1Swap 的输入 token，用户可以使用 XXToken 按固定汇率兑换 USD1。本地 e2e 与本轮主网均部署 XXToken 作为 Usd1Swap 的 USDT 输入。

---

### 前端 API

#### 视图函数（ERC20标准）

javascript

```javascript
// 查询余额
const balance = await xxToken.balanceOf(userAddress)

// 查询授权额度
const allowance = await xxToken.allowance(ownerAddress, spenderAddress)

// 查询总供应量
const totalSupply = await xxToken.totalSupply()
```

#### 状态修改函数

##### transfer(to, amount)

转账 XXToken。

javascript

```javascript
const tx = await xxToken.transfer(receiverAddress, amount)
await tx.wait()
console.log(`转账成功: ${ethers.formatUnits(amount, 18)} XX`)
```

##### approve(spender, amount)

授权其他地址使用 XXToken。

javascript

```javascript
const tx = await xxToken.approve(spenderAddress, amount)
await tx.wait()
console.log(`授权成功: ${ethers.formatUnits(amount, 18)} XX`)
```

##### transferFrom(from, to, amount)

执行授权转账。

javascript

```javascript
const tx = await xxToken.transferFrom(fromAddress, toAddress, amount)
await tx.wait()
console.log(`授权转账成功`)
```

##### mint(to, amount)

solidity

```solidity
function mint(address to, uint256 amount) external onlyOwner;
```

仅 owner 可调用的增发函数（源码 `src/XXToken.sol:12`）。

javascript

```javascript
const tx = await xxToken.mint(recipient, amount)
await tx.wait()
```

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

---

### 错误码

| 错误                       | 原因           | 解决方案       |
| -------------------------- | -------------- | -------------- |
| `ERC20InsufficientBalance` | 余额不足       | 确保有足够余额 |
| `ERC20InvalidApprover`     | 授权地址无效   | 检查授权地址   |
| `ERC20InvalidReceiver`     | 接收地址无效   | 检查接收地址   |
| `ERC20InvalidSender`       | 发送地址无效   | 检查发送地址   |
| `ERC20InvalidSpender`      | 花费者地址无效 | 检查花费者地址 |

---

### 调用示例

#### 完整转账流程

javascript

```javascript
import { BrowserProvider, Contract } from 'ethers'

async function transferXXToken() {
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const userAddress = await signer.getAddress()

  const xxToken = new Contract(XX_TOKEN_ADDRESS, ERC20_ABI, signer)

  // 1. 检查余额
  const balance = await xxToken.balanceOf(userAddress)
  if (balance === 0n) {
    console.log('没有可用的 XXToken')
    return
  }

  // 2. 转账
  const receiver = '0x...' // 接收地址
  const amount = ethers.parseUnits('100', 18) // 100 XX

  const tx = await xxToken.transfer(receiver, amount)
  const receipt = await tx.wait()

  console.log(`✅ 转账成功: ${ethers.formatUnits(amount, 18)} XX`)
}

transferXXToken().catch(console.error)
```

---

### 依赖关系

XXToken 是独立的 ERC20 代币，不依赖其他合约。但在以下场景中使用：

- Usd1Swap : 作为输入 token 兑换 USD1
- 流动性池 : 与其他代币组成交易对
