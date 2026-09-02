# StakingPool (AegisStakingPool) 合约文档

> 来源：`doc-contracts-stakingpool`
> ABI：[`abis/stakingpool.json`](../abis/stakingpool.json)

## 完整 ABI

abi/AegisStakingPool.json
SHA-256 9fc81f8daf55…
38
21
5
12

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/stakingpool.json`](../abis/stakingpool.json)（38 entries）。

</details>

## StakingPool (AegisStakingPool) 合约文档

### 概述

`AegisStakingPool` 是 AEGIS X 的核心质押中枢。所有质押/解质押操作通过此合约进行，它管理 sAGX 与 AGX 的兑换，并在每个 epoch 结束时触发 rebase（利息分配）。

**部署 key**: `StakingPool`

**ABI 路径**: `abi/AegisStakingPool.json`

---

### 关键概念

#### 1. Epoch 机制

- epoch.length - epoch 区块间隔
- epoch.number - 当前 epoch 编号
- epoch.endBlock - epoch 结束区块高度
- epoch.distribute - 待分配的利息量
- 当 endBlock <= block.number 时可触发 rebase
- 初始化要求 number > 0 、 length > 0 且 endBlock > block.number ； resetRebaseParam 同样校验区块参数

#### 2. Rebase

- 将 epoch.distribute 分配到 sAGX 持有者
- 触发 sAGX.rebase() 更新 index
- 回调 RewardManager.settleEpochRewards(currentEpochNumber) ，使用同一个唯一 Epoch 分配额外奖励
- 任意地址也可通过 RewardManager.distributeEpochRewards() 公开入口触发本合约的到期 Rebase
- Rebase 原子结算期间， stake 、 bondStake 、 presaleStake 、 unstake 和再次 rebase 均禁止重入

#### 3. 白名单质押合约

只有 `stakeContracts` 中登记的合约可以调用 `stake`/`bondStake`/`presaleStake`；`unstake()` 为用户直接调用入口，无白名单校验（详见下方"注意"）。

---

### 前端 API

#### 视图函数

js
```js
// Epoch 信息
const epoch = await stakingPool.epoch();
console.log('Epoch #:', epoch.number);
console.log('Ends at block:', epoch.endBlock);
console.log('Distribute:', ethers.formatUnits(epoch.distribute, 9), 'AGX');

// 当前 index
const index = await stakingPool.index();
console.log('sAGX index:', ethers.formatUnits(index, 9));

// 合约 AGX 余额
const poolBal = await stakingPool.poolAgxBalance();
console.log('Pool AGX balance:', ethers.formatUnits(poolBal, 9));
```

#### 注意

`stake()`、`bondStake()`、`presaleStake()` 仅授权 stakeContract 可调（通过 `stakeContracts[msg.sender]` 白名单校验，如 LockedStaking/LiquidStaking/Governance 等）；`unstake()` 为用户直接调用入口，无白名单校验。前端不直接调用 stake/bondStake/presaleStake。

### 事件

#### RebaseExecuted(uint256 indexed epochNumber, uint256 profit, uint256 totalStaked, uint256 timestamp)

Rebase 执行时触发。

### 配置参数

| 参数 | 说明 | 设置者 |
| --- | --- | --- |
| `epoch.length` | epoch 区块间隔 | owner/operator 通过 `resetRebaseParam` |
| `stakeContracts` | 质押合约白名单 | owner |
| `rewardManager` | 奖励管理者 | owner |
| `operators` | operator 列表（`mapping(address=>bool)`），`resetRebaseParam` 允许 owner 或任意 operator 调用 | owner 经 `setBondOperator` 设置 |

#### Setter

- setRewardManager(address _address) — owner 设置 rewardManager ， address(0) revert ErrorInvalidAddress 。
- setBondOperator(address _operator, bool _flag) — owner 增删 operator。
- resetRebaseParam(uint256 _len, uint256 _block) — owner 或 operator 重置 epoch 调度； _len == 0 revert ErrorInvalidEpochLength ， _block <= block.number revert ErrorInvalidEpochBlock 。

已有代理从时间戳版本升级时必须执行 `script/upgrade-staking-pool.ts`，由脚本在升级后重置并验证区块调度状态。
