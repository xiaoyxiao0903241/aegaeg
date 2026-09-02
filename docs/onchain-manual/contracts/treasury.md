# Treasury (CryptoTreasury) 合约文档

> 来源：`doc-contracts-treasury`
> ABI：[`abis/treasury.json`](../abis/treasury.json)

## 完整 ABI

abi/CryptoTreasury.json
SHA-256 d31f4069bd2a…
61
46
10
5

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/treasury.json`](../abis/treasury.json)（61 entries）。

</details>

## Treasury (CryptoTreasury) 合约文档

### 概述

`CryptoTreasury` 是 AEGIS X 的国库管理合约，负责管理储备资产、铸造 AGX 代币、验证代币价值。它是 BondDepository、BurnBondDepository 等合约的底层储备层，通过队列-切换（queue-toggle）模式管理权限。

**部署 key**: `Treasury`

**ABI 路径**: `abi/CryptoTreasury.json`

---

### 关键概念

#### 1. 储备系统

Treasury 管理两类储备：

- Reserve Tokens - 稳定币等储备资产（如 USD1）
- Liquidity Tokens - LP 代币（如 Pancake LP）

每种储备有独立的：

- Depositors - 允许存入的合约
- Spenders - 允许支出的合约
- Managers - 管理储备的合约

#### 2. Queue-Toggle 权限模式

添加权限需要两步操作（防误操作）：

1. queue(MANAGING, address) - 将地址加入队列
2. toggle(MANAGING, address, calculator) - 经过 blocksNeededForQueue 个区块后切换状态

#### 3. AGX 铸造

Treasury 通过 `_permissionMint` 铸造 AGX：

- depositStableReserve / depositBondReserve / depositBurnReserve 时铸造
- mintRewards 时铸造奖励

铸造量 = `payout` 参数

#### 4. 价值计算

`valueOf(token, amount)` 计算代币价值：

- Reserve Token: 按精度换算（AGX 为 9 位小数）
- Liquidity Token: 通过 BondCalculator 估值

---

### 前端 API

#### 视图函数

##### excessReserves() -> (uint256)

返回 `totalReserves - supplied()`。这是刻意保留的硬储备约束：当总储备低于 AGX 总供应量时，Solidity 0.8 算术检查会以 Panic `0x11` 下溢回滚，不返回 0。调用方和运维必须先检查 `totalReserves >= supplied()`。

js
```js
const excess = await treasury.excessReserves();
console.log('Excess reserves:', ethers.formatUnits(excess, 9), 'AGX');
```

##### totalReserves() -> (uint256)

返回总储备价值。

js
```js
const total = await treasury.totalReserves();
console.log('Total reserves:', ethers.formatUnits(total, 9));
```

##### supplied() -> (uint256)

返回 AGX 总供应量。

js
```js
const supplied = await treasury.supplied();
console.log('AGX supplied:', ethers.formatUnits(supplied, 9));
```

##### valueOf(address _token, uint256 _amount) -> (uint256 value_)

计算指定代币数量对应的 AGX 价值。

js
```js
// 计算 1000 USD1 值多少 AGX
const usdAmount = ethers.parseUnits('1000', 18);
const agxValue = await treasury.valueOf(usdAddress, usdAmount);
console.log('AGX value:', ethers.formatUnits(agxValue, 9));
```

##### isReserveToken(address) -> (bool)

检查是否为储备代币。

##### isReserveDepositor(address) -> (bool)

检查是否为储备存入者。

##### isRewardManager(address) -> (bool)

检查是否为奖励管理者。

##### bondCalculator(address) -> (address)

返回 LP 代币的估值计算器地址。

##### reserveTokens(uint256 index) -> (address)

枚举储备代币列表。

##### 管理员视图

js
```js
const blocksNeeded = await treasury.blocksNeededForQueue(); // 队列等待区块数
const agxToken = await treasury.agxToken(); // AGX 地址
const usd = await treasury.usd(); // USD 地址
const rbs = await treasury.rbs(); // RBS 地址
```

---

#### 状态修改函数

##### depositStableReserve(address _token, uint256 _amount, uint256 _payout) -> (uint256 send)

存入稳定储备并铸造 AGX。

**前提条件:**

- 调用者是 RBS 或授权的储备存入者
- _token 是储备代币
- 调用者已授权代币

js
```js
// 通常由 BondDepository 等合约调用，前端不直接调用
const tx = await treasury.depositStableReserve(tokenAddr, amount, payout);
await tx.wait();
```

##### depositBondReserve(address _token, uint256 _amount, uint256 _payout) -> (uint256 send)

存入债券储备（LP 代币）。代币先转入 Treasury 再销毁到 dead 地址。

**前提条件:**

- _token 是流动性代币
- 调用者是授权的流动性存入者

##### depositBurnReserve(address _token, uint256 _amount, uint256 _payout) -> (uint256 send)

存入销毁储备。代币先 `safeTransferFrom` 转入 Treasury，再 `safeTransfer` 到 `dead` 地址销毁（源码 `src/Treasury.sol:227-229`），随后按价值铸造 AGX。

**前提条件:**

- _token 是储备代币
- 调用者是授权的储备存入者

##### mintRewards(address _recipient, uint256 _amount)

铸造奖励 AGX。

**前提条件:**

- 调用者是授权奖励管理者
- _amount <= excessReserves()

js
```js
// 由 RewardManager 等合约调用
const tx = await treasury.mintRewards(recipient, amount);
await tx.wait();
```

##### auditReserves() (仅 owner)

重新计算所有储备代币的余额，更新 `totalReserves`。

js
```js
// 管理员校准储备
const tx = await treasury.auditReserves();
await tx.wait();
```

##### setRbsContract(address _rbs) (仅 owner)

设置 RBS 合约地址，要求 `_rbs != address(0)`（否则 revert `"invalid rbs"`）。源码 `src/Treasury.sol:177`。

js
```js
await treasury.setRbsContract(rbsAddress);
```

##### queue(MANAGING _managing, address _address) 和 toggle(MANAGING, address, address _calculator)

两步权限管理。

js
```js
const MANAGING = {
  RESERVEDEPOSITOR: 0,
  RESERVESPENDER: 1,
  RESERVETOKEN: 2,
  RESERVEMANAGER: 3,
  LIQUIDITYDEPOSITOR: 4,
  LIQUIDITYTOKEN: 5,
  LIQUIDITYMANAGER: 6,
  REWARDMANAGER: 7,
};

// Step 1: 加入队列
await treasury.queue(MANAGING.RESERVEDEPOSITOR, newDepositorAddr);

// Step 2: 等待 blocksNeededForQueue 个区块后切换
await treasury.toggle(MANAGING.RESERVEDEPOSITOR, newDepositorAddr, ethers.ZeroAddress);
```

---

### 事件

#### DepositStableReserve(address indexed token, uint256 amount, uint256 value)

稳定储备存入时触发。

#### DepositBondReserve(address indexed token, uint256 amount, uint256 value)

债券储备存入时触发。

#### DepositBurnReserve(address indexed token, uint256 amount, uint256 value)

销毁储备存入时触发。

#### ReservesUpdated(uint256 indexed totalReserves)

储备更新时触发。

#### ReservesAudited(uint256 indexed totalReserves)

`auditReserves()` 重新计算并校准 `totalReserves` 后触发。源码 `src/Treasury.sol:132`。

#### RewardsMinted(address indexed caller, address indexed recipient, uint256 amount)

AGX 铸造时触发。

#### ChangeQueued(MANAGING indexed managing, address queued)

权限加入队列时触发。

#### ChangeActivated(MANAGING indexed managing, address activated, bool result)

权限切换完成时触发。

---

### 错误码

Treasury 使用 `require` 字符串错误：

| 错误字符串 | 原因 | 解决方案 |
| --- | --- | --- |
| `"unauthorized access"` | 调用者无权限 | 需要 RBS 或储备存入者 |
| `"Not accepted"` | 代币不是储备代币 | 检查代币是否在储备列表中 |
| `"Not approved"` | 调用者未授权 | 需要流动性存入者 |
| `Panic(0x11)` | `totalReserves < supplied()`，`excessReserves()` 按设计直接下溢 | 先补足国库储备；不得捕获后继续 |
| `"Insufficient reserves"` | 储备不低于供应量，但本次铸造量超过超额储备 | 等待更多储备存入 |
| `"Must queue"` | 未先加入队列 | 先调用 queue() |
| `"Queue not expired"` | 队列等待未完成 | 等待足够区块 |

---

### 调用示例

#### 查看国库健康状况

js
```js
async function treasuryHealth(treasury) {
  const [totalReserves, supplied, excess] = await Promise.all([
    treasury.totalReserves(),
    treasury.supplied(),
    treasury.excessReserves(),
  ]);

  const backingRatio = supplied > 0n
    ? (totalReserves * 10000n / supplied)
    : 0n;

  console.log('=== Treasury Health ===');
  console.log('Total reserves:', ethers.formatUnits(totalReserves, 9));
  console.log('AGX supply:', ethers.formatUnits(supplied, 9));
  console.log('Excess reserves:', ethers.formatUnits(excess, 9));
  console.log('Backing ratio:', Number(backingRatio) / 100, '%');

  return {
    totalReserves,
    supplied,
    excess,
    backingRatio: Number(backingRatio) / 100,
  };
}
```

#### 储备代币列表

js
```js
async function listReserveTokens(treasury) {
  // Treasury 不提供长度查询，需要预先知道或从事件获取
  // 可以通过 ReserveTokens 事件或尝试索引
  const tokens = [];
  let i = 0;
  try {
    while (true) {
      const token = await treasury.reserveTokens(i);
      if (token === ethers.ZeroAddress) break;
      tokens.push(token);
      i++;
    }
  } catch {
    // index out of bounds
  }
  console.log('Reserve tokens:', tokens);
  return tokens;
}
```

---

### 依赖合约

| 合约 | 用途 |
| --- | --- |
| AGX | 铸造代币 |
| BondCalculator | LP 代币估值 |
| BondDepository | 储备存入者 |
| BurnBondDepository | 储备存入者 |
| RBS | 储备存入者 |
| RewardManager | 奖励管理者 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `blocksNeededForQueue` | 1 | 权限切换等待区块数 | owner |
| `reserveTokens` | 初始化时 USD | 储备代币列表 | owner |
| `liquidityTokens` | 初始化时 LP | 流动性代币列表 | owner |
| 各类权限列表 | 初始化后逐步添加 | - | owner |
