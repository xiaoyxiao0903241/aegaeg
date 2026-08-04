# Governance 合约文档

> 来源：`doc-contracts-governance`
> ABI：[`abis/governance.json`](../abis/governance.json)

## 完整 ABI

abi/Governance.json
SHA-256 733c1c28f76a…
62
40
14
8

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/governance.json`](../abis/governance.json)（62 entries）。

</details>

## Governance 合约文档

### 概述

`Governance` 是 AEGIS X 的治理投票合约。用户通过质押 AGX 参与提案投票，支持三种投票类型（For/Against/Abstain）。投票期间质押的 AGX 会获得利息收益（sAGX gons 增长 + extraIndex 额外利息）。投票结束后可提取本金和全部收益。

**部署 key**: `Governance`

**ABI 路径**: `abi/Governance.json`

---

### 关键概念

#### 1. 提案生命周期

text

```text
Pending → Active → Succeeded/Defeated → (Succeeded → Executed)
  ↓
Canceled (任何时候投票开始前)
Expired (投票结束后未执行)
```

- Pending : 投票未开始（ block.timestamp < voteStart ）
- Active : 投票进行中（ voteStart <= block.timestamp <= voteEnd ）
- Succeeded : 投票通过（有法定人数且 For > Against）
- Defeated : 投票失败（无法定人数或 For <= Against）
- Executed : 已执行
- Canceled : 已取消

#### 2. 投票质押机制

投票时需要质押 AGX：

- AGX 转入 Governance 合约
- 自动质押到 StakingPool 获得 sAGX 利息
- 投票结束后提取 = 本金 + blockReward（sAGX 增长）+ extraInterest（额外利息）

#### 3. 投票配额限制

- 每次投票至少 1 AGX（ amount >= 1e9 ）
- 总投票数受 maxQuorumGlobal 限制
- 可对同一提案多次投票增加票数（需保持相同投票类型）

#### 4. 利息模型

投票者获得双重收益：

- blockReward = balanceForGons(gons) - principal （sAGX 增长）
- extraInterest = (globalExtraIndex - extraIndex) * principal / 1e9 + creditExtra

---

### 前端 API

#### 视图函数

##### lastProposalId() -> (uint256)

返回最新提案 ID。

js

```js
const lastId = await governance.lastProposalId()
console.log('Latest proposal ID:', lastId)
```

##### getProposal(uint256 proposalId) -> (...)

获取提案详细信息。

**返回值:**

- proposer - 提案发起人
- proposalState - 提案状态（0=Pending, 1=Active, 2=Succeeded, 3=Defeated, 4=Canceled, 5=Expired, 6=Executed）
- voteStart - 投票开始时间
- voteEnd - 投票结束时间
- forVotes - 赞成票数
- againstVotes - 反对票数
- abstainVotes - 弃权票数
- totalVoters - 总投票人数
- minQuorumSnapshot - 法定人数门槛

js

```js
const stateNames = ['Pending', 'Active', 'Succeeded', 'Defeated', 'Canceled', 'Expired', 'Executed']

async function displayProposal(proposalId) {
  const p = await governance.getProposal(proposalId)
  console.log(`Proposal #${proposalId}`)
  console.log(`State: ${stateNames[p.proposalState]}`)
  console.log(
    `For: ${ethers.formatUnits(p.forVotes, 9)} | Against: ${ethers.formatUnits(p.againstVotes, 9)} | Abstain: ${ethers.formatUnits(p.abstainVotes, 9)}`,
  )
  console.log(`Voters: ${p.totalVoters} | Quorum: ${ethers.formatUnits(p.minQuorumSnapshot, 9)}`)
  console.log(
    `Voting: ${new Date(Number(p.voteStart) * 1000).toLocaleString()} - ${new Date(Number(p.voteEnd) * 1000).toLocaleString()}`,
  )
}
```

##### queryProposalState(uint256) -> (ProposalState)

单独查询提案状态。

js

```js
const state = await governance.queryProposalState(proposalId)
// 0=Pending, 1=Active, 2=Succeeded, 3=Defeated, 4=Canceled, 5=Expired, 6=Executed
```

##### getVoteReceipt(uint256 proposalId, address voter) -> (VoteReceipt)

获取用户的投票凭证。

**返回值:**

- hasVoted - 是否已投票
- support - 投票类型（0=Against, 1=For, 2=Abstain）
- votes - 投票数量
- principal - 质押本金
- gons - sAGX gons 数量
- expiry - 过期时间
- extraIndex - 投票时记录的全局额外利息索引快照（用于计算 extraInterest ，见下方公式）
- creditExtra - 已记账但尚未领取的额外利息（累积值）

js

```js
const receipt = await governance.getVoteReceipt(proposalId, userAddress)
console.log('Has voted:', receipt.hasVoted)
console.log('Support:', ['Against', 'For', 'Abstain'][receipt.support])
console.log('Votes:', ethers.formatUnits(receipt.votes, 9))
console.log('Principal:', ethers.formatUnits(receipt.principal, 9))
```

##### getVoteRewards(uint256 proposalId, address voter) -> (principal, blockReward, extraInterest)

获取用户可领取的投票奖励。

js

```js
const [principal, blockReward, extraInterest] = await governance.getVoteRewards(
  proposalId,
  userAddress,
)
console.log('Principal:', ethers.formatUnits(principal, 9), 'AGX')
console.log('Block reward (interest):', ethers.formatUnits(blockReward, 9), 'AGX')
console.log('Extra interest:', ethers.formatUnits(extraInterest, 9), 'AGX')
console.log('Total:', ethers.formatUnits(principal + blockReward + extraInterest, 9), 'AGX')
```

##### 管理员视图

js

```js
// 查询参数
const votingDelay = await governance.votingDelay() // 投票延迟
const threshold = await governance.proposalStakeThreshold() // 提案质押门槛
const maxQuorum = await governance.maxQuorumGlobal() // 全局最大票数
```

---

#### 状态修改函数

##### vote(uint256 proposalId, uint8 support, uint256 amount)

对提案投票。调用者质押 AGX 并投票。

**前提条件:**

- 用户已绑定推荐关系
- 提案状态为 Active
- amount >= 1e9 （至少 1 AGX）
- 总票数 + amount <= maxQuorumGlobal
- 如果已投票，必须保持相同的投票类型

**参数:**

- proposalId - 提案 ID
- support - 0=Against, 1=For, 2=Abstain
- amount - 投票数量（AGX，wei 精度）

**事件:**

- VoteCast(voter, proposalId, support, votes, times, timestamp)

js

```js
async function castVote(governance, agxContract, proposalId, support, amount, signer) {
  const user = await signer.getAddress()

  // 1. 检查提案状态
  const state = await governance.queryProposalState(proposalId)
  if (state !== 1n) {
    // 1 = Active
    throw new Error('Voting is not active')
  }

  // 2. 检查推荐关系
  const referral = new Contract(await governance.referral(), REFERRAL_ABI, signer)
  if (!(await referral.isBindReferral(user))) {
    throw new Error('Must bind referral first')
  }

  // 3. 检查是否已投票
  const receipt = await governance.getVoteReceipt(proposalId, user)
  if (receipt.hasVoted && Number(receipt.support) !== support) {
    throw new Error(
      'Cannot change vote type. Already voted ' + ['Against', 'For', 'Abstain'][receipt.support],
    )
  }

  // 4. 授权 AGX
  await (await agxContract.approve(await governance.getAddress(), amount)).wait()

  // 5. 投票
  const tx = await governance.connect(signer).vote(proposalId, support, amount)
  const receipt2 = await tx.wait()

  console.log('Vote cast successfully!')
  console.log('Amount:', ethers.formatUnits(amount, 9), 'AGX')
}
```

##### withdrawal(uint256 proposalId)

投票结束后提取本金和奖励。

**前提条件:**

- 投票已结束（ block.timestamp > voteEnd ）
- 提取窗口未关闭（ block.timestamp <= voteEnd + 10 days ）
- 用户已投票且本金 > 0

js

```js
async function withdrawVoteRewards(governance, proposalId, signer) {
  const user = await signer.getAddress()

  // 1. 检查提取窗口
  const p = await governance.getProposal(proposalId)
  const now = Math.floor(Date.now() / 1000)
  const voteEnd = Number(p.voteEnd)
  const deadline = voteEnd + 10 * 86400 // 10 days

  if (now <= voteEnd) {
    throw new Error('Voting still active')
  }
  if (now > deadline) {
    throw new Error('Withdrawal window expired')
  }

  // 2. 查看可领取奖励
  const [principal, blockReward, extraInterest] = await governance.getVoteRewards(proposalId, user)
  console.log(
    'Total rewards:',
    ethers.formatUnits(principal + blockReward + extraInterest, 9),
    'AGX',
  )

  // 3. 提取
  const tx = await governance.connect(signer).withdrawal(proposalId)
  const receipt = await tx.wait()

  const event = receipt.logs.find((l) => governance.interface.parseLog(l)?.name === 'Withdraw')
  const parsed = governance.interface.parseLog(event)
  console.log('Principal:', ethers.formatUnits(parsed.args.principal, 9))
  console.log('Rebase (interest):', ethers.formatUnits(parsed.args.rebase, 9))
  console.log('Extra:', ethers.formatUnits(parsed.args.extra, 9))
}
```

##### initProposal(uint256 proposalId, uint64 voteEnd, uint256 minQuorum, uint256 winRateBps) — external

创建提案，当前唯一的提案创建入口（旧的 `propose/execute` 已废弃）。仅 `onlyProposer` 且 `onlyActiveAccount` 可调。

**前提条件:**

- 调用者是授权提案人（ proposers[msg.sender] ）且账户未迁移
- proposalId == proposalCount + 1
- voteEnd > block.timestamp
- minQuorum >= 1_000e9

**参数:**

- proposalId - 提案 ID（必须等于 proposalCount + 1 ）
- voteEnd - 投票结束时间戳
- minQuorum - 法定人数门槛
- winRateBps - 通过所需赞成比例（基点）

**事件:**

- ProposalCreated(proposalId, proposer, voteStart, voteEnd, minQuorum, timestamp)

##### 提案取消、结算与执行

- cancelProposal(proposalId) ：只能在投票开始前由 proposer 或 owner 调用。
- finalizeProposal(proposalId) ：投票结束后任何地址可调用；失败提案会发出 ProposalDefeated ，用于固化结果通知。
- executeProposal(proposalId) ：任何地址可触发，但 queryProposalState 必须为 Succeeded ；成功发出 ProposalQueued 和 ProposalExecuted 。

前端不能把 `executeProposal` 错误限制为 onlyOwner，也不能使用旧入口 `propose/execute`。

---

### 事件

#### VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 votes, uint256 times, uint256 timestamp)

投票时触发。

#### Withdraw(address indexed voter, uint256 indexed proposalId, uint256 principal, uint256 rebase, uint256 extra, uint256 times, uint256 timestamp)

提取投票质押时触发。包含本金、利息和额外利息。

#### ProposalCreated(uint256 indexed proposalId, address indexed proposer, uint64 voteStart, uint64 voteEnd, uint256 minQuorum, uint256 timestamp)

创建提案时触发。

#### ProposalExecuted(uint256 indexed proposalId)

提案执行时触发。

#### ProposalDefeated(...)

提案失败时触发。

#### ProposalCanceled(uint256 indexed proposalId, address indexed by)

`cancelProposal` 取消提案时触发。

#### ProposalQueued(uint256 indexed proposalId, uint256 executionTime)

`executeProposal` 成功执行后将提案入队时触发。

#### ParametersUpdated(uint64 votingDelay, uint256 proposalStakeThreshold)

`setGlobalParameters` 修改投票延迟与提案质押门槛时触发。

#### ProposalContentSet(uint256 indexed proposalId, string contentURI, bytes32 contentHash)

`setProposalContent` 设置提案内容 URI 与哈希时触发。

#### ExpiredTokensDestroyed(uint256 sTokenAmount, uint256 tokenAmount, uint256 timestamp)

`destroyExpiredTokens` 销毁所有提取窗口已过期的提案剩余 sAGX/AGX 时触发。

#### MigrationManagerSet(address indexed oldManager, address indexed newManager)

`setMigrationManager` 设置/更新迁移管理器时触发。

#### AccountMigrated(address indexed oldAccount, address indexed newAccount)

`migrateAccount` 完成账户迁移时触发。

---

### 错误码

| 错误字符串                            | 原因                                          | 解决方案                       |
| ------------------------------------- | --------------------------------------------- | ------------------------------ |
| `"Not approved"`                      | 未绑定推荐关系                                | 先绑定 Referral                |
| `"invalid support"`                   | 投票类型无效                                  | 使用 0/1/2                     |
| `"no proposal"`                       | 提案不存在                                    | 检查提案 ID                    |
| `"voting not active"`                 | 不在投票期                                    | 等待 Active 状态               |
| `"threshold"`                         | 投票数量 < 1 AGX                              | 增加投票数量                   |
| `"votes limited"`                     | 超过 maxQuorumGlobal                          | 减少投票数量                   |
| `"support mismatch"`                  | 已投不同票                                    | 保持相同投票类型               |
| `"Stake failure"`                     | 质押失败                                      | 检查 StakingPool 状态          |
| `"has not voted"`                     | 未投票就提取                                  | 先投票                         |
| `"insufficient principal"`            | 本金为 0                                      | 检查投票记录                   |
| `"voting active"`                     | 在投票窗口内                                  | 等待结束                       |
| `"not proposer or owner"`             | 非提案人                                      | 无权操作                       |
| `"already finalized"`                 | 提案已被取消或执行                            | 不再可操作                     |
| `"already active"`                    | 投票已开始，无法取消                          | 取消须在 voteStart 之前        |
| `"invalid proposalId"`                | `initProposal` proposalId ≠ proposalCount+1   | 传入下一个连续 ID              |
| `"invalid vote end"`                  | voteEnd ≤ 当前时间                            | 设置未来时间戳                 |
| `"invalid min quorum"`                | minQuorum < 1_000e9                           | 提高法定人数                   |
| `"account migrated"`                  | 调用者/旧账户已迁移                           | 使用迁移后新账户               |
| `"not authorized"`                    | 非 migrationManager 调用 `migrateAccount`     | 仅迁移管理器调用               |
| `"not succeeded"`                     | `executeProposal` 时状态非 Succeeded          | 等 `finalizeProposal` 固化结果 |
| `"voting not ended"`                  | `finalizeProposal` 时投票未结束               | 等 voteEnd 之后                |
| `"voteEnd can only be extended"`      | `setVoteEnd` 新值 ≤ 旧值                      | 只能向后延长                   |
| `"withdrawal window open"`            | `destroyExpiredTokens` 时仍有提案提取窗口未过 | 等所有窗口过期                 |
| `"Can not pre increment extra index"` | `addVoteRewards` _lastEpoch > 当前 epoch      | 等到该 epoch 完成              |
| `"This epoch has extra rebased"`      | `addVoteRewards` _lastEpoch ≤ lastEpoch       | 每个 epoch 只能加一次          |
| `MigrationManagerZeroAddress()`       | `setMigrationManager` 传入零地址              | 传入有效地址                   |
| `MigrationManagerImmutable(address)`  | 二次修改 migrationManager                     | 一次性不可变                   |

#### 账户迁移

Governance 支持统一迁移接口（源码: Governance.sol:167-190）：

- setMigrationManager(address _manager) (onlyOwner, 一次性不可变) — 设置迁移管理器； migrationManager 非零后再改回滚 MigrationManagerImmutable ，触发 MigrationManagerSet 。
- migrateAccount(address oldAccount, address newAccount) (only migrationManager) — 把旧账户迁移到新账户；新账户必须无历史（ everHadAccountState / proposers / migratedTo / _originalOf 全空），否则回滚 "target not clean" 。 onlyActiveAccount 守卫在旧账户 vote / withdrawal / initProposal / cancelProposal 时回滚 "account migrated" 。触发 AccountMigrated 。

#### 管理函数（owner only）

| 函数                                                                               | 说明                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setGlobalParameters(uint64 _votingDelay, uint256 _proposalStakeThreshold)`        | 一次设置投票延迟与提案质押门槛，触发 `ParametersUpdated`                                                                                                         |
| `setMaxQuorum(uint256 _maxQuorum)`                                                 | 设置全局最大票数 `maxQuorumGlobal`                                                                                                                               |
| `setProposalMinQuorum(uint256 proposalId, uint256 _minQuorum)`                     | 调整特定提案的法定人数门槛                                                                                                                                       |
| `setVoteEnd(uint256 proposalId, uint64 voteEnd)`                                   | 只能向后延长投票结束时间（`voteEnd > 旧值`，否则回滚 `"voteEnd can only be extended"`）                                                                          |
| `setStakingPool(address _pool)`                                                    | 设置 StakingPool 地址                                                                                                                                            |
| `setProposalContent(uint256 proposalId, string _contentURI, bytes32 _contentHash)` | 设置提案内容 URI 与哈希，触发 `ProposalContentSet`；提案不存在回滚 `"no proposal"`                                                                               |
| `addVoteRewards(uint256 _lastEpoch, uint256 _extraIndex)`                          | 累加全局额外利息 `globalExtraIndex`；`_lastEpoch` 必须在 `(lastEpoch, epoch]`，否则回滚 `"Can not pre increment extra index"` / `"This epoch has extra rebased"` |
| `destroyExpiredTokens()`                                                           | 销毁所有提取窗口已过期提案的剩余 sAGX/AGX；任一窗口未关回滚 `"withdrawal window open"`，触发 `ExpiredTokensDestroyed`                                            |
| `setProposer(address _proposer, bool _flag)`                                       | 维护授权提案人列表（按 root 账户归集）                                                                                                                           |

---

### 调用示例

#### 完整投票流程

js

```js
async function fullVoteFlow(governance, agxContract, proposalId, signer) {
  const user = await signer.getAddress()

  // 1. 查看提案
  const p = await governance.getProposal(proposalId)
  console.log(
    `Proposal #${proposalId}: ${['Pending', 'Active', 'Succeeded', 'Defeated'][p.proposalState]}`,
  )

  if (p.proposalState !== 1n) {
    console.log('Not active, skipping')
    return
  }

  // 2. 查看当前票数
  console.log(
    `For: ${ethers.formatUnits(p.forVotes, 9)} | Against: ${ethers.formatUnits(p.againstVotes, 9)}`,
  )
  console.log(`Quorum needed: ${ethers.formatUnits(p.minQuorumSnapshot, 9)}`)

  // 3. 计算当前领先方
  const forVotes = p.forVotes
  const againstVotes = p.againstVotes
  const totalVotes = forVotes + againstVotes + p.abstainVotes
  const isQuorumMet = totalVotes >= p.minQuorumSnapshot

  // 4. 投票（投给少数派）
  const voteAmount = ethers.parseUnits('100', 9) // 100 AGX
  const support = forVotes > againstVotes ? 0 : 1 // 投少数派
  const supportName = ['Against', 'For', 'Abstain'][support]
  console.log(`Voting ${supportName} with ${ethers.formatUnits(voteAmount, 9)} AGX`)

  await (await agxContract.approve(await governance.getAddress(), voteAmount)).wait()
  await (await governance.connect(signer).vote(proposalId, support, voteAmount)).wait()
  console.log('Vote cast!')

  // 5. 投票结束后提取（需要等待）
  console.log(
    `Withdrawal window: ${new Date(Number(p.voteEnd) * 1000).toLocaleString()} - ${new Date((Number(p.voteEnd) + 10 * 86400) * 1000).toLocaleString()}`,
  )
}
```

---

### 依赖合约

| 合约        | 用途                      |
| ----------- | ------------------------- |
| StakingPool | 投票期间质押 AGX 获得利息 |
| sAGX        | gons 模型计算利息         |
| Referral    | 验证投票者推荐关系        |
| Treasury    | 可能涉及提案执行          |

### 配置参数

| 参数                     | 默认值     | 说明                   | 设置者 |
| ------------------------ | ---------- | ---------------------- | ------ |
| `votingDelay`            | 1 分钟     | 创建后延迟多久开始投票 | owner  |
| `proposalStakeThreshold` | 5,000 AGX  | 提案质押门槛           | owner  |
| `maxQuorumGlobal`        | 20,000 AGX | 全局最大投票数         | owner  |
| `proposers[addr]`        | -          | 授权提案人列表         | owner  |
