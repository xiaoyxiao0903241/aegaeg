# sAGX (Staked AEGIS X) 合约文档

> 来源：`doc-contracts-sagx`
> ABI：[`abis/sagx.json`](../abis/sagx.json)

## 完整 ABI

abi/sAGX.json
SHA-256 796dba060550…
29
22
6
0

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/sagx.json`](../abis/sagx.json)（29 entries）。

</details>

## sAGX (Staked AEGIS X) 合约文档

### 概述

`sAGX` 是 AEGIS X 的生息代币（rebasing token），使用 gons 模型实现自动复利。持有 sAGX 即相当于持有 AGX 的质押份额，每次 epoch rebase 后 sAGX 余额自动增长。

**部署 key**: `sAGX`

**ABI 路径**: `abi/sAGX.json`

---

### 关键概念

#### 1. Gons 模型

sAGX 使用 `gons` 作为内部记账单位：

- balanceOf(who) = _gonBalances[who] / _gonsPerFragment
- gonsForBalance(amount) = amount * _gonsPerFragment
- balanceForGons(gons) = gons / _gonsPerFragment

Rebase 时 `_totalSupply` 增加，`_gonsPerFragment` 减少，用户的 gons 不变但实际余额增加。

> 注意：`_gonBalances` 为 `private` mapping（源码 `src/sAGX.sol:253`），链上/前端不可直接读取。前端请用 `balanceOf(userAddress)` 获取已 rebase 后的余额。

#### 2. Rebase

- 仅 stakingContract 可调用
- 将 profit 按 totalSupply / circulatingSupply 比例分配
- 更新 _gonsPerFragment = TOTAL_GONS / _totalSupply
- 记录 rebases 数组

#### 3. 流通供应量

`circulatingSupply() = _totalSupply - balanceOf(stakingContract)`

---

### 前端 API

#### 视图函数

js
```js
// 余额（已 rebase）
const balance = await sagx.balanceOf(userAddress);
console.log('sAGX balance:', ethers.formatUnits(balance, 9));

// gons/余额 换算
const gonsForAmount = await sagx.gonsForBalance(ethers.parseUnits('100', 9));
const amountForGons = await sagx.balanceForGons(gonsForAmount);

// index（增长倍数）
const index = await sagx.index();
console.log('Index:', ethers.formatUnits(index, 9));

// 流通供应量
const circulating = await sagx.circulatingSupply();
console.log('Circulating:', ethers.formatUnits(circulating, 9));

// 总供应量
const totalSupply = await sagx.totalSupply();
console.log('Total supply:', ethers.formatUnits(totalSupply, 9));
```

#### Rebase 历史

`rebases(epoch)` 返回 `Rebase` 结构体，共 7 个字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `epoch` | `uint256` | epoch 编号 |
| `rebase` | `uint256` | rebase 百分比（1e18 基） |
| `totalStakedBefore` | `uint256` | rebase 前流通供应量 |
| `totalStakedAfter` | `uint256` | rebase 后流通供应量 |
| `amountRebased` | `uint256` | 本次 rebase 的 profit 数量 |
| `index` | `uint256` | 当时的 index |
| `blockNumberOccured` | `uint256` | 触发 rebase 的区块号 |

js
```js
// 查询指定 epoch 的 rebase
const rebase = await sagx.rebases(epochNumber);
console.log('Rebase %:', ethers.formatUnits(rebase.rebase, 18));
console.log('Index at time:', ethers.formatUnits(rebase.index, 9));
console.log('Profit:', ethers.formatUnits(rebase.amountRebased, 9));
console.log('Block:', rebase.blockNumberOccured);
```

---

### 状态修改函数

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `initialize(address stakingContract_)` | 仅 `initializer`（构造函数中设为 `msg.sender`，调用后清零） | 一次性设置 `stakingContract`，并向其铸造全部 TOTAL_GONS。源码 `src/sAGX.sol:266` |
| `setIndex(uint _INDEX)` | 仅 `initializer` 或 `stakingContract`，且当前 `INDEX == 0` 时可调一次 | 设置初始增长倍数 INDEX（以 gonsForBalance 形式存储）。源码 `src/sAGX.sol:282` |
| `rebase(uint256 profit_, uint256 epoch_)` | 仅 `stakingContract` | 按 `profit_ * totalSupply / circulatingSupply` 扩张 `_totalSupply`，更新 `_gonsPerFragment` 并写入 `rebases` 数组。源码 `src/sAGX.sol:290` |

---

### 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `LogSupply(uint256 indexed epoch, uint256 timestamp, uint256 totalSupply)` | epoch / 时间戳 / 总供应 | 每次 rebase 触发，记录总供应量 |
| `LogRebase(uint256 indexed epoch, uint256 rebase, uint256 index)` | epoch / rebase 百分比 / index | 每次 rebase 触发 |
| `LogStakingContractUpdated(address stakingContract)` | 质押合约地址 | `initialize` 时触发 |
| `TransferGons(address indexed from, address indexed to, uint256 gons)` | from / to / gons 数 | 转账与初始化时附带发出，记录 gons 层流动 |

源码：`src/sAGX.sol:212-221`

---

### 配置参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `INITIAL_FRAGMENTS_SUPPLY` | 10,000,000 * 1e9 | 初始供应量 |
| `TOTAL_GONS` | 2^256 - (2^256 % supply) | 总 gons |
| `stakingContract` | 初始化时设置 | 质押池地址 |
| `INDEX` | 初始化时设置 | 初始增长倍数 |
