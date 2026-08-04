# AccountMigrationManager 合约文档

> 来源：`doc-contracts-accountmigrationmanager`
> ABI：[`abis/accountmigrationmanager.json`](../abis/accountmigrationmanager.json)

## 完整 ABI

abi/AccountMigrationManager.json
SHA-256 20293ab2477e…
92
42
17
33

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/accountmigrationmanager.json`](../abis/accountmigrationmanager.json)（92 entries）。

</details>

## AccountMigrationManager 合约文档

### 概述

`AccountMigrationManager` 是 AEGIS X 的统一账户迁移管理中心。当用户需要更换钱包地址时，通过此合约原子协调已配置的下游目标，确保推荐关系、质押记录、债券、释放单和奖励仍归属于同一个身份根地址。当前标准部署清单为 21 个目标，合约允许在 1–32 个目标范围内维护。

**部署 key**: `AccountMigrationManager`

**BNB Chain 主网**：本轮重新部署，地址以最终完整 manifest 为准。由于六个复用合约禁止管理写入，新 Manager 本轮保持 `migrationEnabled=false`，不能把历史 Manager 地址当作当前发布地址。

**ABI 路径**: `abi/AccountMigrationManager.json`

---

### 关键概念

#### 1. 迁移流程（三步式）

text

```text
用户请求 → 操作员审核 → 用户确认 → 执行迁移
```

**步骤 1: `requestMigration(newAccount)`**

- 用户（旧地址）提交迁移请求，指定新地址
- 进入 Pending 状态

**步骤 2: `approveMigration(oldAccount)` 或 `operatorMigrateAccount(oldAccount, newAccount)`**

- 操作员审核通过 → Approved 状态
- 或者在 old 不存在 Pending/Approved 请求时直接执行迁移

**步骤 3: `activateMigration(oldAccount)`**

- 用户（新地址）确认激活
- 执行所有目标合约的 migrateAccount()

#### 2. 目标合约

迁移会自动调用以下所有合约的 `migrateAccount()`：

- Referral、PreSale、EarlyStaking、XStakingPool
- BondDepository 180/360/540 天、BurnBondDepository 180/360/540 天
- LockedStaking 180/360/540 天、RewardQueue、Turbine
- LiquidStaking、PrincipalReleaseVault、Governance
- LuckyPool、DailyPurchaseTracker、AgxContributionSwap

当前标准清单合计 21 个唯一合约地址。owner 只能在迁移暂停时修改清单；调用 `setTargets`、`addMigrationTarget` 或 `removeMigrationTarget` 后会自动解除 `targetsLocked`，必须重新调用 `lockTargets()` 完整校验后才能再次开启迁移。Referral 必须始终是数组第一个元素，首次配置后不能替换且禁止单独移除。每个 target 的 `migrationManager` 首次设置后也不可替换，只允许幂等写入同一个 Manager 代理地址，避免 target owner 绕过统一原子迁移制造状态分叉。

目标清单允许在已经发生迁移后继续维护，因为后续迁移仍统一由 Manager 循环调用当前清单。不过，新增目标不会自动重放过去的 A→B，移除目标也不会清理其历史数据。因此新增项必须是新部署或已经完成历史 alias 回填的实例；移除项必须已经退役且不再需要参与账户迁移。这是部署治理前提，不是合约能够自动证明的状态。

#### 3. 状态机

text

```text
None → Pending → Approved → Finalized
                  ↓
              Rejected
```

- None - 无请求
- Pending - 等待审核
- Approved - 已审核通过
- Rejected - 被拒绝或由旧钱包取消
- Finalized - 已完成

#### 4. 安全校验

- 新地址不能是合约地址（防止误操作）
- 新地址不能已迁移过
- 旧地址必须有推荐人
- 新地址不能有推荐人
- 新地址不能被其他请求预留，且所有目标合约都必须判定其没有历史业务状态
- old、新地址或首次 root 任一被拉黑时，申请、激活和 operator 直迁均会失败
- 目标清单必须非空、不超过 32 个、唯一、已绑定本 Manager，并在启用前完成锁定校验
- 所有目标在同一笔交易中执行；任一失败则全量回滚
- 执行采用 effects-first： _executeMigration 先写 migratedTo / migratedFrom / migrationFinalized / requestStatus 等本地状态，再逐个调用当前目标数组的 migrateAccount 。任一 target 调用 revert 会回滚整笔交易，避免出现“本地已标记迁移但目标未迁移”的半完成状态
- 仅 Manager 可以调用目标的 migrateAccount ，owner/admin 无直迁旁路
- A→B→C 时业务数据始终留在 root A；不遍历、不复制用户数组
- maxMigrationHops 默认 8，可由 owner 在迁移暂停时配置；超限由 Manager 主体回滚，具体目标合约不重复设置跳数限制
- 每次重新启用迁移前重新验证全部当前目标的代码、唯一性和 Manager 绑定

---

### 前端 API

#### 视图函数

##### requestCount() -> (uint256)

返回迁移请求总数。

js

```js
const count = await migrationManager.requestCount()
console.log('Total requests:', count)
```

##### pendingCount() -> (uint256)

返回待审核的迁移请求数。

js

```js
const pending = await migrationManager.pendingCount()
console.log('Pending requests:', pending)
```

##### getRequests(uint256 offset, uint256 limit) -> (MigrationRequestView[])

分页获取所有迁移请求（每页最多 20 条）。

**MigrationRequestView 返回值:**

- oldAccount - 旧地址
- newAccount - 新地址
- reviewed - 是否已审核（Approved/Rejected）

js

```js
const requests = await migrationManager.getRequests(0, 20)
requests.forEach((r) => {
  console.log(`${r.oldAccount} -> ${r.newAccount} | reviewed: ${r.reviewed}`)
})
```

##### getPendingRequests(uint256 offset, uint256 limit) -> (MigrationRequestView[])

分页获取待审核请求。

js

```js
const pending = await migrationManager.getPendingRequests(0, 20)
console.log('Pending:', pending.length, 'requests')
```

##### canonicalAccount(address) -> (address)

返回迁移后的当前有效地址。

js

```js
const current = await migrationManager.canonicalAccount(oldAddress)
console.log('Current address:', current)
```

##### isOldAccount(address) -> (bool)

检查地址是否为已迁移的旧地址。

js

```js
const isOld = await migrationManager.isOldAccount(oldAddress)
console.log('Is migrated old account:', isOld)
```

##### migratedTo(address) -> (address)

查询迁移目标地址。

##### requestedNewOf(address) -> (address)

查询用户请求的新地址。

##### migratedFrom(address) -> (address)

查询当前/历史新地址所属的首次 root 地址。A→B→C 后，`migratedFrom(B)` 与 `migratedFrom(C)` 都是 A。

##### requestedOldOf(address) -> (address)

查询新地址当前被哪个旧地址预留；请求取消、拒绝或完成后会清零。

##### requestStatus(address) -> (uint8)

查询迁移请求状态（0=None, 1=Pending, 2=Approved, 3=Rejected, 4=Finalized）。

js

```js
const statusNames = ['None', 'Pending', 'Approved', 'Rejected', 'Finalized']
const status = await migrationManager.requestStatus(oldAddress)
console.log('Status:', statusNames[status])
```

##### migrationFinalized(address) -> (bool)

检查迁移是否已完成。

js

```js
const done = await migrationManager.migrationFinalized(oldAddress)
console.log('Migration finalized:', done)
```

##### 管理员视图

js

```js
const referralTarget = await migrationManager.referralTarget()
const targets = await migrationManager.getMigrationTargets()
console.log('Referral:', referralTarget)
console.log('Migration targets:', targets)
if (targets[0].toLowerCase() !== referralTarget.toLowerCase()) {
  throw new Error('Referral must be migrationTargets[0]')
}

const enabled = await migrationManager.migrationEnabled()
console.log('Migration enabled:', enabled)

const blacklisted = await migrationManager.blacklisted(userAddress)
console.log('Blacklisted:', blacklisted)

console.log('Targets locked:', await migrationManager.targetsLocked())
console.log('Max migration hops:', await migrationManager.maxMigrationHops()) // 默认 8
console.log('Min targets:', await migrationManager.MIN_MIGRATION_TARGET_COUNT()) // 1
console.log('Max targets:', await migrationManager.MAX_MIGRATION_TARGET_COUNT()) // 32
```

---

#### 状态修改函数

##### requestMigration(address newAccount)

用户（旧地址）提交迁移请求。

**前提条件:**

- 迁移已启用
- old、新地址和首次 root 均不在黑名单；激活时会重新检查
- newAccount 不是零地址
- newAccount 不是合约地址
- 旧地址尚未迁移
- 旧地址必须有推荐人
- 新地址不能有推荐人

**事件:**

- MigrationRequested(oldAccount, newAccount)

js

```js
async function requestMigration(migrationManager, newAccount, signer) {
  const oldAccount = await signer.getAddress()

  // 1. 检查当前状态
  const isOld = await migrationManager.isOldAccount(oldAccount)
  if (isOld) {
    throw new Error('Already migrated')
  }

  const finalized = await migrationManager.migrationFinalized(oldAccount)
  if (finalized) {
    throw new Error('Migration already finalized')
  }

  // 2. 检查新地址有效性
  const code = await migrationManager.provider.getCode(newAccount)
  if (code !== '0x') {
    throw new Error('New account cannot be a contract address')
  }

  // 3. 检查推荐关系（旧地址必须有，新地址不能有）
  const referral = new Contract(REFERRAL_ADDRESS, REFERRAL_ABI, signer)
  const oldReferrer = await referral.getReferral(oldAccount)
  if (oldReferrer === ethers.ZeroAddress) {
    throw new Error('Old account must have a referrer')
  }

  // 4. 提交请求
  const tx = await migrationManager.connect(signer).requestMigration(newAccount)
  const receipt = await tx.wait()

  console.log('Migration requested!')
  console.log('Status: Pending review')
}
```

##### activateMigration(address oldAccount)

用户（新地址）确认激活迁移。

**前提条件:**

- 旧地址状态为 Approved
- 新地址 = msg.sender
- 新地址与请求的一致

**事件:**

- MigrationCompleted(oldAccount, newAccount)

js

```js
async function activateMigration(migrationManager, oldAccount, signer) {
  const newAccount = await signer.getAddress()

  // 1. 检查状态
  const status = await migrationManager.requestStatus(oldAccount)
  if (status !== 2n) {
    // 2 = Approved
    throw new Error('Migration not approved yet. Current status: ' + status)
  }

  // 2. 确认地址匹配
  const requested = await migrationManager.requestedNewOf(oldAccount)
  if (requested.toLowerCase() !== newAccount.toLowerCase()) {
    throw new Error('Address mismatch. Requested: ' + requested)
  }

  // 3. 激活
  const tx = await migrationManager.connect(signer).activateMigration(oldAccount)
  const receipt = await tx.wait()

  console.log('Migration completed!')
  console.log(`${oldAccount} -> ${newAccount}`)

  // 4. 验证
  const canonical = await migrationManager.canonicalAccount(oldAccount)
  console.log('Canonical address:', canonical)
}
```

##### approveMigration(address oldAccount) (仅 operator)

操作员审核通过迁移请求。

js

```js
// 由后端服务调用
await migrationManager.connect(operatorSigner).approveMigration(oldAccount)
```

##### rejectMigration(address oldAccount) (仅 owner)

管理员拒绝 Pending 或 Approved 请求，并释放新地址预留。

js

```js
await migrationManager.connect(ownerSigner).rejectMigration(oldAccount)
```

##### cancelMigrationRequest()（旧地址）

旧地址可取消自己的 Pending 或 Approved 请求；状态转为 Rejected，并释放 `requestedOldOf[newAccount]`。

js

```js
await migrationManager.connect(oldSigner).cancelMigrationRequest()
```

##### operatorMigrateAccount(address oldAccount, address newAccount) (仅 operator)

操作员直接执行迁移（跳过用户确认步骤）。

若 old 已有 Pending/Approved 请求，本方法会拒绝，必须先取消或由 owner 拒绝，避免遗留新地址预留。

该入口只跳过“用户申请、审批和新地址激活”流程，不跳过安全校验。它与普通激活最终都会执行 `_ensureMigrationDepthAvailable`，因此超过 `maxMigrationHops` 同样回滚。owner 不是天然 operator；即使 owner 先将自己设为 operator，也仍受当前配置限制。

##### setMigrationEnabled(bool enabled) — onlyOwner

启用/禁用迁移。启用前要求 `targetsLocked && _validateTargets(targets)` 且 `maxMigrationHops > 0`；否则触发 `AM__TargetNotConfigured` / `AM__InvalidMigrationHops`。触发 `MigrationEnabledChanged`。

##### setMaxMigrationHops(uint256 newValue) — onlyOwner

设置迁移跳数上限（默认 8）。必须 `!migrationEnabled`（启用中不可改，触发 `AM__MigrationMustBeDisabled`），且 `newValue > 0`（否则 `AM__InvalidMigrationHops`）。触发 `MaxMigrationHopsUpdated`。

##### setTargets(address referralTarget_, address[] calldata migrationTargets_) — onlyOwner

整体替换目标清单。仅允许在 `migrationEnabled=false` 时调用；清单长度必须为 1–32，Referral 必须位于第一个元素且首次配置后不可替换，所有目标均须非零、有代码、Manager 反向绑定正确且互不重复。调用成功会解除现有锁定并触发 `TargetsUpdated`。

##### addMigrationTarget(address target) — onlyOwner

在迁移暂停时单独新增目标。目标必须有代码、已反向绑定当前 Manager、未重复且新增后总数不超过 32。调用成功会解除现有锁定并触发 `MigrationTargetAdded`。

##### removeMigrationTarget(address target) — onlyOwner

在迁移暂停时单独移除非 Referral 目标。数组按原顺序左移，Referral 不允许移除；目标不存在时回滚。调用成功会解除现有锁定并触发 `MigrationTargetRemoved`。

##### lockTargets() — onlyOwner

校验并锁定当前目标清单（`targetsLocked = true`）。锁定后可以开启迁移；若以后先暂停迁移并修改清单，锁定会自动解除，修改完成后必须再次调用本函数。触发 `TargetsLocked`。

标准安全操作顺序：

text

```text
setMigrationEnabled(false)
  → setTargets / addMigrationTarget / removeMigrationTarget
  → 回读 referralTarget、getMigrationTargets 和每个 target.migrationManager()
  → lockTargets()
  → setMigrationEnabled(true)
```

不要调用旧 ABI 中的 `targets()`、`getLockedStakings()`、`getBondDepositories()` 或 `getBurnBondDepositories()`；动态数组版本已经删除这些固定结构接口。

##### setOperator(address operator, bool enabled) — onlyOwner

授权/撤销 operator（可审批与直迁）。触发 `OperatorUpdated`。

##### setBlacklist(address account, bool enabled) — onlyOwnerOrOperator

拉黑/解除拉黑账户（零地址拒绝）。触发 `BlacklistUpdated`。

---

### 事件

#### MigrationRequested(address indexed oldAccount, address indexed newAccount)

用户提交迁移请求时触发。

#### MigrationApproved(address indexed oldAccount, address indexed newAccount, address indexed operator)

操作员审核通过时触发。

#### MigrationRejected(address indexed oldAccount, address indexed newAccount)

迁移被拒绝时触发。

#### MigrationCancelled(address indexed oldAccount, address indexed newAccount)

旧地址主动取消请求时触发。

#### MigrationCompleted(address indexed oldAccount, address indexed newAccount)

迁移完成时触发。

#### OperatorMigrationCompleted(address indexed oldAccount, address indexed newAccount, address indexed operator)

操作员直接迁移时触发。

js

```js
migrationManager.on('MigrationCompleted', (oldAccount, newAccount) => {
  console.log(`Account migrated: ${oldAccount} -> ${newAccount}`)
  // 更新本地存储的用户地址
  updateUserAddress(oldAccount, newAccount)
})
```

#### BlacklistUpdated(address indexed account, bool enabled)

黑名单更新时触发。

#### TargetsUpdated(address indexed referralTarget, address[] migrationTargets)

`setTargets` 整体配置目标清单时触发。

#### MigrationTargetAdded(address indexed target, uint256 index)

单独新增目标时触发。

#### MigrationTargetRemoved(address indexed target, uint256 index)

单独移除目标时触发。

#### MigrationEnabledChanged(bool enabled)

`setMigrationEnabled` 启用/禁用迁移时触发。

#### OperatorUpdated(address indexed operator, bool enabled)

`setOperator` 授权/撤销 operator 时触发。

#### TargetsLocked() / TargetsUnlocked()

完成目标校验并锁定时触发 `TargetsLocked`；暂停迁移后首次修改清单、解除原锁定时触发 `TargetsUnlocked`。

#### MaxMigrationHopsUpdated(uint256 oldValue, uint256 newValue)

`setMaxMigrationHops` 修改跳数上限时触发。

---

### 错误码

| 错误                                            | 原因                             | 解决方案                                                                                           |
| ----------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `AM__InvalidAddress()`                          | 地址为零地址                     | 检查参数                                                                                           |
| `AM__AlreadyRequested(address)`                 | 已有待处理请求                   | 等待审核完成                                                                                       |
| `AM__MigrationAlreadyFinalized(address)`        | 已迁移完成                       | 无需重复                                                                                           |
| `AM__RequestMismatch(address, expected)`        | 地址不匹配                       | 使用正确的地址                                                                                     |
| `AM__NewAccountNotClean(address)`               | 新地址已迁移过                   | 使用全新地址                                                                                       |
| `AM__SelfMigration()`                           | 新旧地址相同                     | 使用不同地址                                                                                       |
| `AM__TargetNotConfigured()`                     | 目标合约未配置                   | 联系管理员                                                                                         |
| `AM__MigrationDisabled()`                       | 迁移已禁用                       | 等待启用                                                                                           |
| `AM__ContractAddressNotAllowed()`               | 新地址是合约                     | 使用 EOA 地址                                                                                      |
| `AM__NotOperator()`                             | 非操作员                         | 使用操作员账户                                                                                     |
| `AM__NotPending(address)`                       | 非待审核状态                     | 检查状态                                                                                           |
| `AM__NotApproved(address)`                      | 未审核通过                       | 等待审核                                                                                           |
| `AM__Blacklisted(address)`                      | 账户在黑名单                     | 联系管理员                                                                                         |
| `AM__OldAccountHasNoReferrer(address)`          | 旧地址无推荐人                   | 先绑定推荐关系                                                                                     |
| `AM__NewAccountAlreadyHasReferrer(address)`     | 新地址已有推荐人                 | 使用无推荐人的地址                                                                                 |
| `AM__InvalidPagination()`                       | 分页参数无效                     | limit 必须在 1-20 范围内                                                                           |
| `AM__NewAccountReserved(address)`               | 新地址已被其他请求预留           | 更换新地址或取消原请求                                                                             |
| `AM__TargetsLocked()`                           | 已锁定时重复调用 `lockTargets`   | 无需重复锁定；如需调整，先暂停迁移并修改清单                                                       |
| `AM__InvalidTarget(address)`                    | 目标为零地址或无合约代码         | 修复部署地址                                                                                       |
| `AM__InvalidTargetManager(address,address)`     | 目标未反向绑定当前 Manager       | 先执行目标的 `setMigrationManager`                                                                 |
| `AM__DuplicateTarget(address)`                  | 目标清单存在重复地址             | 修复目标清单                                                                                       |
| `AM__InvalidTargetCount(uint256)`               | 目标数量为 0 或超过 32           | 将目标数量调整为 1–32                                                                              |
| `AM__ReferralTargetMismatch(address,address)`   | Referral 与目标数组第 0 项不一致 | 将首次 Referral 放在 `migrationTargets[0]`                                                         |
| `AM__ReferralTargetImmutable(address,address)`  | 试图在首次配置后替换 Referral    | 保持初始 Referral 地址不变                                                                         |
| `AM__TargetNotFound(address)`                   | 尝试移除未配置的目标             | 使用当前目标数组中的地址                                                                           |
| `AM__ReferralTargetRemovalForbidden()`          | 尝试单独移除 Referral            | Referral 是永久核心目标，不能移除或替换                                                            |
| `AM__MaxMigrationHopsExceeded(address,uint256)` | 身份已达到当前迁移次数上限       | 停止并执行链下人工审计；如决定提高，owner 先暂停迁移、调用 `setMaxMigrationHops`、完成回读后再开启 |
| `AM__InvalidMigrationHops()`                    | `maxMigrationHops` 为 0          | 设置 ≥1 的跳数                                                                                     |
| `AM__MigrationMustBeDisabled()`                 | 启用迁移时尝试改跳数或目标清单   | 先 `setMigrationEnabled(false)`                                                                    |

### 升级前置条件

动态目标数组版本与旧版 `Targets` 结构体的存储布局不兼容，旧 Manager 代理即使没有历史请求也禁止原地升级，必须全新部署代理。升级脚本会先调用动态数组版本特有的只读接口识别布局，并在任何暂停或升级写交易前 fail-closed。只有已经运行动态目标数组布局的代理，才可按后续版本的正常存储兼容规则升级。

---

### 调用示例

#### 用户完整迁移流程

js

```js
async function fullMigrationFlow(migrationManager, newAccount, signer) {
  const oldAccount = await signer.getAddress()

  console.log('=== Account Migration ===')
  console.log(`From: ${oldAccount}`)
  console.log(`To:   ${newAccount}`)

  // Step 1: 请求迁移
  console.log('\nStep 1: Requesting migration...')
  await (await migrationManager.connect(signer).requestMigration(newAccount)).wait()

  let status = await migrationManager.requestStatus(oldAccount)
  console.log('Status:', ['None', 'Pending', 'Approved', 'Rejected', 'Finalized'][status])

  // Step 2: 等待审核（由操作员完成）
  console.log('\nStep 2: Waiting for operator approval...')
  console.log('Please contact support to approve your migration.')

  // 轮询检查状态
  const checkStatus = async () => {
    const s = await migrationManager.requestStatus(oldAccount)
    if (s === 2n) {
      console.log('\nStep 3: Migration approved!')
      return true
    }
    if (s === 3n) {
      console.log('\nMigration rejected.')
      return false
    }
    return null // still pending
  }

  // Step 3: 用户确认
  const approved = await checkStatus()
  if (approved) {
    console.log('\nStep 4: Activating migration...')
    const tx = await migrationManager
      .connect(signer) // 注意: 这里应该用新地址的 signer
      .activateMigration(oldAccount)
    await tx.wait()
    console.log('Migration completed successfully!')
    console.log('Use', newAccount, 'as your new address')
  }
}
```

#### 管理员审核面板

js

```js
async function adminMigrationPanel(migrationManager) {
  // 获取所有待审核请求
  const pendingCount = await migrationManager.pendingCount()
  const pages = Math.ceil(Number(pendingCount) / 20)

  console.log(`Pending migration requests: ${pendingCount}`)

  for (let page = 0; page < pages; page++) {
    const requests = await migrationManager.getPendingRequests(page * 20, 20)

    for (const req of requests) {
      console.log(`\nRequest:`)
      console.log(`  Old: ${req.oldAccount}`)
      console.log(`  New: ${req.newAccount}`)

      // 检查黑名单
      const blacklisted = await migrationManager.blacklisted(req.oldAccount)
      if (blacklisted) {
        console.log('  ⚠️ Blacklisted!')
      }
    }
  }
}
```

---

### 依赖合约

| 合约                      | 用途         |
| ------------------------- | ------------ |
| Referral                  | 迁移推荐关系 |
| PreSale                   | 迁移购买记录 |
| BondDepository            | 迁移债券     |
| BurnBondDepository        | 迁移销毁债券 |
| LockedStaking             | 迁移质押     |
| EarlyStaking              | 迁移预售质押 |
| XStakingPool              | 迁移挖矿     |
| RewardQueue               | 迁移奖励队列 |
| LiquidStaking             | 迁移活期质押 |
| Governance                | 迁移投票记录 |
| LuckyPool                 | 迁移彩票记录 |
| AegisDailyPurchaseTracker | 迁移购买追踪 |
| AgxContributionSwap       | 迁移贡献点   |
| PrincipalReleaseVault     | 迁移释放记录 |
| Turbine                   | 迁移售卖配额 |

### 配置参数

| 参数               | 默认值       | 说明               | 设置者         |
| ------------------ | ------------ | ------------------ | -------------- |
| `migrationEnabled` | false        | 是否启用迁移       | owner          |
| `targets`          | 初始化后设置 | 目标合约列表       | owner          |
| `operators`        | 初始化后设置 | 操作员列表         | owner          |
| `blacklisted`      | -            | 黑名单账户         | owner/operator |
| `MAX_PAGE_SIZE`    | 20           | 分页最大值（常量） | -              |
