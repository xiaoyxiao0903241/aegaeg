# PrincipalReleaseVault 合约文档

> 来源：`doc-contracts-principalreleasevault`
> ABI：[`abis/principalreleasevault.json`](../abis/principalreleasevault.json)

## 完整 ABI

abi/PrincipalReleaseVault.json
SHA-256 4cedda91eeed…
45
22
8
15

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/principalreleasevault.json`](../abis/principalreleasevault.json)（45 entries）。

</details>

## PrincipalReleaseVault 合约文档

### 概述

`PrincipalReleaseVault` 是 AEGIS X 的本金线性释放合约。LiquidStaking、三个 LockedStaking、EarlyStaking、三个 BondDepository、三个 BurnBondDepository 和 XStakingPool 的本金退出都会进入此合约，经过管理员配置的周期线性释放后用户才可以领取；新部署默认周期为 30 天。

**部署 key**: `PrincipalReleaseVault`

**BNB Chain 主网 proxy**：本轮重新部署，以最终完整 manifest 为准。

**ABI 路径**: `abi/PrincipalReleaseVault.json`

---

### 关键概念

#### 1. 线性释放机制

- DEFAULT_RELEASE_DURATION = 30 天 ， releaseDuration 可由 owner 调整
- 每笔释放单在创建时把当前周期写入 release.duration ，后续改参不会改变既有释放单
- 释放按时间线性计算： vested = amount * elapsed / release.duration
- 可多次部分领取
- 每笔释放单到达自身 endTime 后全部可领取

#### 2. 创建流程

只有授权的 LiquidStaking、三个 LockedStaking、EarlyStaking、三个 BondDepository、三个 BurnBondDepository 和 XStakingPool 可以调用 `createRelease()`，将用户本金转入此合约并创建释放记录。上述业务合约未配置本合约时会回滚本金退出，不存在直接转入钱包的兜底路径。

#### 3. 账户迁移

- PrincipalReleaseVault 已接入 AccountMigrationManager 。
- 迁移后释放数组仍保存在原始存储槽，不做可能超出 gas 的逐条复制；新地址通过受控别名读取和领取。
- 已迁出的旧地址不能再调用 claim() 或 claimMany() 。
- 新地址必须没有既有释放记录，也不能参与过其他迁移，避免两组本金记录被合并。
- 迁移后新创建的释放单也会归入同一组记录，并由新地址领取。

---

### 前端 API

#### 视图函数

##### getReleaseCount(address) -> (uint256)

返回用户的释放记录数。

js

```js
const count = await vault.getReleaseCount(userAddress)
console.log('Release records:', count)
```

##### getRelease(address, uint256 index) -> (ReleaseView)

获取指定释放记录的完整视图。

**ReleaseView 返回值:**

- release.amount - 总金额
- release.claimed - 已领取金额
- release.startTime - 开始时间
- release.duration - 创建时锁定的释放周期（秒）
- claimableAmount - 当前可领取金额
- remainingAmount - 剩余待领取
- endTime - 释放结束时间
- fullyClaimed - 是否全部领取

js

```js
const view = await vault.getRelease(userAddress, 0)
console.log('Total:', ethers.formatUnits(view.release.amount, 9), 'AGX')
console.log('Claimed:', ethers.formatUnits(view.release.claimed, 9))
console.log('Claimable now:', ethers.formatUnits(view.claimableAmount, 9))
console.log('Remaining:', ethers.formatUnits(view.remainingAmount, 9))
console.log('Duration:', view.release.duration, 'seconds')
console.log('Ends:', new Date(Number(view.endTime) * 1000).toLocaleDateString())
```

##### claimable(address, uint256 index) -> (uint256)

返回指定记录当前可领取金额。

js

```js
const claimable = await vault.claimable(userAddress, 0)
console.log('Can claim:', ethers.formatUnits(claimable, 9), 'AGX')
```

##### getReleaseDuration(address user, uint256 index) -> (uint256)

返回指定释放单创建时锁定的释放周期（秒）。索引越界触发 `ErrorIndexOutOfBounds`。

js

```js
const duration = await vault.getReleaseDuration(userAddress, 0)
console.log('Duration:', Number(duration), 'seconds')
```

#### 状态修改函数

##### setReleaseDuration(uint256 duration)（owner）

设置后续新释放单的周期，单位为秒，必须大于 0。已经创建的释放单继续使用各自的 `release.duration`。

##### setAuthorizedCaller(address caller, bool allowed) — onlyOwner

授权/撤销可调用 `createRelease` 的业务合约（零地址拒绝）。触发 `AuthorizedCallerUpdated`。

##### setMigrationManager(address manager) — onlyOwner

设置统一账户迁移管理器（`migrationManager` 设为非零后不可更改，触发 `MigrationManagerImmutable`）。触发 `MigrationManagerUpdated`。

##### migrateAccount(address oldAccount, address newAccount) — 仅 migrationManager

将 `oldAccount` 的释放记录领取权别名映射到 `newAccount`（仅写别名，不搬运数据）。`newAccount` 必须无既有释放记录且未参与过迁移，否则 `ErrorAlreadyMigrated`。触发 `AccountMigrated`。

##### claim(uint256 index)

领取指定记录的已释放部分。

js

```js
async function claimRelease(vault, index, signer) {
  const claimable = await vault.claimable(await signer.getAddress(), index)
  if (claimable === 0n) {
    console.log('Nothing to claim')
    return
  }

  const tx = await vault.connect(signer).claim(index)
  await tx.wait()
  console.log('Claimed:', ethers.formatUnits(claimable, 9), 'AGX')
}
```

##### claimMany(uint256 start, uint256 limit)

批量领取多条记录。

js

```js
async function claimManyReleases(vault, signer) {
  const count = await vault.getReleaseCount(await signer.getAddress())
  if (count === 0n) {
    console.log('No releases to claim')
    return
  }

  try {
    const tx = await vault.connect(signer).claimMany(0, Number(count))
    const receipt = await tx.wait()
    console.log('Batch claim successful')
  } catch (err) {
    if (err.message?.includes('ErrorNothingToClaim')) {
      console.log('Nothing claimable right now')
    } else {
      throw err
    }
  }
}
```

---

### 事件

#### ReleaseCreated(address indexed user, address indexed caller, uint256 indexed index, uint256 amount, uint256 startTime, uint256 duration, uint256 timestamp)

创建释放记录时触发。

#### AuthorizedCallerUpdated(address indexed caller, bool allowed, uint256 timestamp)

`setAuthorizedCaller` 授权/撤销 caller 时触发。

#### PrincipalClaimed(address indexed user, uint256 indexed index, uint256 amount, uint256 timestamp)

领取本金时触发。

#### AccountMigrated(address indexed oldAccount, address indexed newAccount)

释放记录领取权迁移完成时触发。

#### MigrationManagerUpdated(address indexed oldManager, address indexed newManager)

迁移管理器更新时触发。

#### ReleaseDurationUpdated(uint256 oldDuration, uint256 newDuration, uint256 timestamp)

owner 更新后续新释放单的默认周期时触发。

### 错误码

| 错误                            | 原因                                      | 解决方案                          |
| ------------------------------- | ----------------------------------------- | --------------------------------- |
| `ErrorZeroAddress()`            | 地址为空                                  | 检查参数                          |
| `ErrorZeroAmount()`             | 金额为 0                                  | 增加金额                          |
| `ErrorNotAuthorized()`          | 非授权调用者                              | 只有 Bond/Staking 等可创建        |
| `ErrorIndexOutOfBounds()`       | 索引越界                                  | 使用有效索引                      |
| `ErrorNothingToClaim()`         | 无可领取                                  | 等待释放                          |
| `ErrorCallerNotAuthorized()`    | 非迁移管理器调用迁移                      | 通过 AccountMigrationManager 执行 |
| `ErrorAlreadyMigrated()`        | 旧/新地址已参与迁移，或新地址已有释放记录 | 使用全新且无释放记录的地址        |
| `ErrorInvalidReleaseDuration()` | 新周期为 0                                | 设置大于 0 的秒数                 |

### 配置参数

| 参数                       | 默认值       | 说明                                    |
| -------------------------- | ------------ | --------------------------------------- |
| `DEFAULT_RELEASE_DURATION` | 30 天        | 新部署默认释放周期（常量）              |
| `releaseDuration`          | 30 天        | 后续新释放单采用的周期，可由 owner 修改 |
| `agx`                      | 初始化时设置 | AGX 地址                                |
| `authorizedCallers`        | 初始化后设置 | 允许创建释放的合约                      |
| `migrationManager`         | 初始化后设置 | 统一账户迁移管理器                      |
