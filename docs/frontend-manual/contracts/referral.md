# Referral 合约文档

> 来源：`doc-contracts-referral`
> ABI：[`abis/referral.json`](../abis/referral.json)

## 完整 ABI

abi/AegisReferral.json
SHA-256 22daae6d201e…
38
19
5
14

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/referral.json`](../abis/referral.json)（38 entries）。

</details>

## Referral 合约文档

### 概述

`AegisReferral` 是 AEGIS X 的推荐系统合约，管理用户之间的推荐关系树。所有质押、债券等操作都要求用户已绑定推荐人。支持账户迁移后的推荐关系继承。

**部署 key**: `Referral`

**BNB Chain 主网 proxy**: `0xe0F3AE113dD3997982AE9ad7d5510ffA4E3Cce71`

**ABI 路径**: `abi/AegisReferral.json`

---

### 关键概念

#### 1. 推荐关系树

每个用户可以有一个父节点（parent），形成树状结构：

- 根节点（root）是系统的初始地址
- 新用户通过 bindReferral(parent) 绑定到某个父节点
- 父节点可以获得子节点活动的奖励分成

#### 2. 迁移兼容性

- migratedTo[old] = new - 旧地址映射到新地址
- _originalOf[new] = _original(old) - 新地址始终指向首次业务数据 root；A→B→C 时 B/C 的 root 都是 A
- _canonical(user) - 解析最终的有效地址
- 推荐关系在迁移后自动继承

#### 3. 绑定状态

- isBound - 用户是否已绑定推荐人
- parent - 用户的父节点地址（经过 _canonical 解析）
- childCount - 直接子节点数量

---

### 前端 API

#### 视图函数

##### isBindReferral(address)

检查用户是否已绑定推荐人。

javascript

```javascript
const isBound = await referral.isBindReferral(userAddress)
console.log(`用户已绑定推荐人: ${isBound}`)
```

**重要**: 在执行任何质押或债券操作前，必须先检查此项！

##### getReferral(address)

获取用户的直接推荐人（父节点）。

javascript

```javascript
const parent = await referral.getReferral(userAddress)
if (parent !== ethers.ZeroAddress) {
  console.log(`推荐人: ${parent}`)
}
```

##### getReferralCount(address)

获取用户的直接子节点数量。

javascript

```javascript
const childCount = await referral.getReferralCount(userAddress)
console.log(`直接子节点数: ${childCount}`)
```

##### getChildren(address)

获取用户的所有直接子节点地址列表。

javascript

```javascript
const children = await referral.getChildren(userAddress)
console.log(`子节点列表:`, children)
```

##### getRootAddress()

获取推荐树的根节点地址。

javascript

```javascript
const root = await referral.getRootAddress()
console.log(`根节点: ${root}`)
```

##### getReferrals(address, uint256)

获取用户的上溯 `_num` 层推荐链（源码 Referral.sol:230）。返回从直接父节点开始向上的地址数组，长度 ≤ `_num`。

javascript

```javascript
const chain = await referral.getReferrals(userAddress, 5)
console.log(`上溯推荐链:`, chain)
```

##### getChildAt(address, uint256 index)

获取用户指定下标的直接子节点（源码 Referral.sol:214）。`index` 越界回滚 `Referral__UserZero()`（无该子节点）。

javascript

```javascript
const child0 = await referral.getChildAt(userAddress, 0)
console.log(`第 0 个子节点:`, child0)
```

##### originalOf(address)

获取迁移前的原始地址。

javascript

```javascript
const original = await referral.originalOf(migratedAddress)
console.log(`原始地址: ${original}`)
```

##### canonicalOf(address)

获取迁移后的规范地址（最终有效地址）。

javascript

```javascript
const canonical = await referral.canonicalOf(oldAddress)
console.log(`规范地址: ${canonical}`)
```

---

#### 状态修改函数

##### bindReferral(referralAddress)

绑定推荐人。**这是使用任何质押/债券功能的前置条件**。

javascript

```javascript
// 选择一个已绑定推荐人的地址作为父节点
const parentAddress = '0x...' // 必须是已绑定的地址

// 检查父节点是否有效
const isParentBound = await referral.isBindReferral(parentAddress)
if (!isParentBound) {
  throw new Error('父节点未绑定推荐人')
}

// 绑定推荐人
const tx = await referral.bindReferral(parentAddress)
const receipt = await tx.wait()

// 监听事件
const event = receipt.logs.find((l) => l.fragment?.name === 'BindReferral')
if (event) {
  console.log(`成功绑定推荐人: ${event.args._address} -> ${event.args.parent}`)
}
```

**前置条件**:

- 用户尚未绑定推荐人 ( isBindReferral(user) == false )
- 父节点地址不为零地址
- 父节点不能是自己
- 父节点必须是已绑定的地址（或是根节点）

**触发事件**: `BindReferral(user, parent, timestamp)`

**注意**:

- 一旦绑定，无法更改推荐人
- 推荐关系永久记录在链上

##### setRootAddress(address[] chain) (onlyOwner)

重置/重建推荐树的根链（源码 Referral.sol:71）。`chain` 不能为空（空回滚 `Referral__RootZero()`）；链中每个 child→parent 必须未被绑定且 parent 已绑定（除根），否则回滚 `Referral__AlreadyBound` / `Referral__ParentNotBound` / `Referral__SelfReferral`。用于初始化或修复根链，触发 `RootUpdated`。

##### setMigrationManager(address manager) (onlyOwner, 一次性不可变)

设置统一迁移管理器（源码 Referral.sol:116）。`manager` 零地址回滚 `MigrationManagerZeroAddress`；`migrationManager` 非零后再改回滚 `MigrationManagerImmutable`。部署前必须确认。

##### migrateAccount(oldAccount, newAccount)

迁移账户（只能由统一 `migrationManager` 调用）。

前端和后端 EOA 都不应直接调用该 target 入口。真实迁移由 `AccountMigrationManager` 的 `requestMigration → approveMigration → activateMigration` 流程，或 operator 审核后的 `operatorMigrateAccount` 原子调用当前目标数组中的全部 target。`Referral.migrateAccount` 只是 Manager 在同一笔交易中调用的内部协作入口。

**前置条件**:

- 调用者必须是 migrationManager
- oldAccount 和 newAccount 都不为零地址
- oldAccount != newAccount
- oldAccount 尚未迁移过
- newAccount 未绑定且不是迁移目标

**触发事件**: `IdentityMigrated(from, to, timestamp)`

---

### 事件

#### BindReferral

用户绑定推荐人时触发。

solidity

```solidity
event BindReferral(
  address indexed _address,
  address indexed parent,
  uint256 timestamp
)
```

**前端监听示例**:

javascript

```javascript
referral.on('BindReferral', (user, parent, timestamp) => {
  console.log(`[${new Date(Number(timestamp) * 1000).toISOString()}] 用户 ${user} 绑定到 ${parent}`)
})
```

#### RootUpdated

`setRootAddress` 重建根链时触发。

solidity

```solidity
event RootUpdated(
  address indexed oldRoot,
  address indexed newRoot,
  uint256 timestamp
)
```

javascript

```javascript
referral.on('RootUpdated', (oldRoot, newRoot, timestamp) => {
  console.log(`根节点从 ${oldRoot} 切换到 ${newRoot}`)
})
```

#### IdentityMigrated

账户迁移时触发。

solidity

```solidity
event IdentityMigrated(
  address indexed from,
  address indexed to,
  uint256 timestamp
)
```

**前端监听示例**:

javascript

```javascript
referral.on('IdentityMigrated', (from, to, timestamp) => {
  console.log(`账户从 ${from} 迁移到 ${to}`)
  // 更新本地缓存的用户地址
  updateUserAddress(from, to)
})
```

---

### 错误码

| 错误                                     | 原因                             | 解决方案                 |
| ---------------------------------------- | -------------------------------- | ------------------------ |
| `Referral__RootZero()`                   | 根节点为零地址                   | 联系管理员初始化根节点   |
| `Referral__UserZero()`                   | 用户地址为零地址                 | 检查地址参数             |
| `Referral__ParentZero()`                 | 父节点地址为零地址               | 提供有效的父节点地址     |
| `Referral__SelfReferral()`               | 试图将自己设为父节点             | 使用不同的地址           |
| `Referral__AlreadyBound(address)`        | 用户已绑定推荐人                 | 推荐人无法更改           |
| `Referral__ParentNotBound(address)`      | 父节点未绑定                     | 选择已绑定的父节点       |
| `Referral__MigratedAccount(address)`     | 账户已迁移                       | 使用迁移后的新地址       |
| `Referral__NotMigrationManager(address)` | 调用者无迁移权限                 | 使用正确的调用者         |
| `MigrationManagerZeroAddress()`          | `setMigrationManager` 传入零地址 | 传入有效地址             |
| `MigrationManagerImmutable(address)`     | 二次修改 migrationManager        | 一次性不可变，部署前确认 |

---

### 调用示例

#### 完整绑定流程

javascript

```javascript
import { BrowserProvider } from 'ethers'

async function bindReferralFlow() {
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const userAddress = await signer.getAddress()

  const referralContract = new Contract(REFERRAL_ADDRESS, REFERRAL_ABI, signer)

  // 1. 检查是否已绑定
  const isBound = await referralContract.isBindReferral(userAddress)
  if (isBound) {
    console.log('已绑定推荐人，无需重复绑定')
    return
  }

  // 2. 获取推荐的父节点（从 UI 配置或 URL 参数）
  const suggestedParent = getUrlParameter('referrer') || DEFAULT_PARENT

  // 3. 验证父节点有效性
  const parentExists = await referralContract.isBindReferral(suggestedParent)
  if (!parentExists) {
    console.error('推荐的父节点无效，使用默认根节点')
    suggestedParent = await referralContract.getRootAddress()
  }

  // 4. 执行绑定
  console.log(`绑定推荐人: ${suggestedParent}`)
  const tx = await referralContract.bindReferral(suggestedParent)
  const receipt = await tx.wait()

  // 5. 确认绑定成功
  const isNowBound = await referralContract.isBindReferral(userAddress)
  if (isNowBound) {
    console.log('✅ 推荐人绑定成功！')

    // 可以开始进行质押、债券等操作
    await proceedToStaking()
  } else {
    console.error('❌ 绑定失败，请重试')
  }
}

// 辅助函数：从 URL 获取推荐人地址
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}
```

#### 显示推荐关系

javascript

```javascript
async function displayReferralTree(userAddress) {
  const referral = new Contract(REFERRAL_ADDRESS, REFERRAL_ABI, provider)

  // 获取用户信息
  const parent = await referral.getReferral(userAddress)
  const childCount = await referral.getReferralCount(userAddress)
  const children = await referral.getChildren(userAddress)

  console.log('=== 推荐关系 ===')
  console.log(`用户: ${userAddress}`)
  console.log(`推荐人: ${parent === ethers.ZeroAddress ? '无' : parent}`)
  console.log(`子节点数: ${childCount}`)

  if (children.length > 0) {
    console.log('\n子节点列表:')
    for (const child of children) {
      console.log(`  - ${child}`)
    }
  }
}
```

#### 监听推荐事件

javascript

```javascript
// 监听新的绑定事件
referral.on('BindReferral', (user, parent, timestamp) => {
  const date = new Date(Number(timestamp) * 1000)
  console.log(`[${date.toLocaleString()}] 新绑定: ${user} -> ${parent}`)

  // 更新 UI
  updateReferralUI(user, parent)
})

// 清理监听器（组件卸载时）
function cleanup() {
  referral.removeAllListeners('BindReferral')
}
```

#### 处理账户迁移

javascript

```javascript
async function requestAccountMigration(referral, migrationManager, oldSigner, newAddress) {
  const oldAddress = await oldSigner.getAddress()
  const canonical = await referral.canonicalOf(oldAddress)
  if (canonical !== oldAddress) {
    console.log('账户已迁移，使用新地址:', canonical)
    return canonical
  }

  // 旧地址只向统一 Manager 提交申请；后续由 operator 审批、新地址激活
  await (await migrationManager.connect(oldSigner).requestMigration(newAddress)).wait()
  console.log('迁移申请已提交，等待 operator 审批和新地址 activateMigration')
  return newAddress
}
```

---

### 依赖合约

Referral 合约是独立的，不依赖其他合约。但被以下合约依赖：

| 合约                 | 用途                         |
| -------------------- | ---------------------------- |
| LiquidStaking        | 验证推荐人绑定               |
| LockedStaking        | 验证推荐人绑定               |
| EarlyStaking         | 验证推荐人绑定               |
| BondDepository       | 验证推荐人绑定               |
| BurnBondDepository   | 验证推荐人绑定               |
| PreSale              | 验证推荐人绑定并分配推荐奖励 |
| DailyPurchaseTracker | 追踪购买资格                 |

---

### 最佳实践

#### 1. 推荐人来源

javascript

```javascript
// 推荐人可以从多个来源获取：
// a) URL 参数: ?referrer=0x...
// b) localStorage 缓存
// c) 默认根节点

function getReferrerAddress() {
  // 优先使用 URL 参数
  const fromUrl = getUrlParameter('referrer')
  if (isValidAddress(fromUrl)) return fromUrl

  // 其次使用缓存
  const cached = localStorage.getItem('referrer')
  if (isValidAddress(cached)) return cached

  // 最后使用根节点
  return DEFAULT_ROOT_ADDRESS
}

function isValidAddress(addr) {
  return addr && ethers.isAddress(addr) && addr !== ethers.ZeroAddress
}
```

#### 2. 错误处理

javascript

```javascript
try {
  const tx = await referral.bindReferral(parent)
  await tx.wait()
} catch (error) {
  if (error.message.includes('AlreadyBound')) {
    alert('您已经绑定过推荐人了')
  } else if (error.message.includes('ParentNotBound')) {
    alert('推荐的父节点无效，请联系客服')
  } else if (error.message.includes('SelfReferral')) {
    alert('不能将自己设为推荐人')
  } else {
    console.error('绑定失败:', error)
  }
}
```
