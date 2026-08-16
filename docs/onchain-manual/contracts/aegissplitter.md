# AegisSplitter 合约文档

> 来源：`doc-contracts-aegissplitter`
> ABI：[`abis/aegissplitter.json`](../abis/aegissplitter.json)

## 完整 ABI

abi/AegisSplitter.json
SHA-256 809d316e54dc…
53
28
9
16

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegissplitter.json`](../abis/aegissplitter.json)（53 entries）。

</details>

## AegisSplitter 合约文档

### 概述

`AegisSplitter` 是 AEGIS X 的分流器（存款 + 线性释放）合约。**同一字节码部署多实例**：头部分流器（`headManager != 0`，`pre = AegisSplitterManager`）与普通分流器（`headManager = 0`，`pre = 上游分流器`）。支持 `next` 链式串联：领取时若配置了 `next`，资金转入下游分流器开启新一轮 30 天线性释放；否则直接发放到用户钱包。多代币共存（每条释放记录带 `token`）。

**部署 key**: `AegisSplitterHead_0`（头部分流器）/ `AegisSplitterNormal_0` 等

**BNB Chain 主网头部分流器 proxy**: `0x193eBD30a5f0827e91880fF404600f5b699df510`（release `bb680398-e7c0-46fa-ad87-139446fb4120`）

**ABI 路径**: `abi/AegisSplitter.json`

**代理**: TransparentUpgradeableProxy（本地默认升级：`SPLITTER_INSTANCE_KEY=<实例> npm run upgrade:splitter`；主网显式运行 `SPLITTER_INSTANCE_KEY=<实例> npx hardhat run script/upgrade-splitter.ts --network bsc`）

---

### 关键概念

#### 1. 头部 vs 普通

| 类型 | `headManager` | `pre` | 释放周期 |
| --- | --- | --- | --- |
| 头部分流器 | 非零（所属 Manager） | `AegisSplitterManager` | `manager.effectiveDuration(user)`（新老判定） |
| 普通分流器 | 0 | 上游分流器 | 固定 `30 days` |

#### 2. 记账式存款 deposit(user, amount, token)

仅 `pre` 可调用；资金由 `pre` 先转入本合约，本函数只建立线性释放记录：

- depositedTotal[token] += amount 记录背书余额
- 释放记录 SplitterRelease{ token, amount, claimed, startTime, duration } 按 _releaseOwner(user) （根账户，支持迁移）归档

#### 3. 领取与链式转发

`claim(index)` / `claimMany(start, limit)`：

- 可领取量 = amount * elapsed / duration （ elapsed >= duration 时全额）， claimable = vested - claimed
- next != 0 ：可领取金额转入 next 并调用 next.deposit(user, amount, token) （ next 的 pre 必须是本合约），开启新一轮 30 天释放—— 非链尾领取不会到用户钱包
- next == 0 （链尾）：直接 safeTransfer 到用户钱包

分页读取使用 `getReleases(user, start, limit)`，同次返回 `items` 和 `totalCount`。`limit` 必须在 `1..50`；尾页自动截断，`start >= totalCount` 返回空页。每个 `items[i]` 与 `getRelease(user, start + i)` 字段一致，并包含动态的 `claimableAmount`、`remainingAmount`、`endTime` 和 `fullyClaimed`。

#### 4. 多代币核算

`depositedTotal[token] - claimedTotal[token]` 为背书余额；`sweepExcess(token, to)`（owner）回收未被背书的多余代币（防外部直接转入造成悬空余额）。

#### 5. 账户迁移

实现 `IMigrationTarget`（`migrateAccount` 仅 `migrationManager` 可调用）。`AegisSplitterHead_0` 已注册为迁移目标（21 目标清单）；迁移后 `_releaseOwner(newAccount)` 解析到根账户，新地址可领取。

---

### 状态变量

| 变量 | 类型 | 说明 |
| --- | --- | --- |
| `pre` | address | 唯一允许调用 deposit 的上游地址 |
| `next` | address | 下游分流器；0 = 链尾 |
| `headManager` | address | 所属 Manager；0 = 普通分流器 |
| `releases` | mapping | 用户 → 释放记录数组 |
| `depositedTotal` / `claimedTotal` | mapping | 每种代币背书/已领取累计 |
| `migratedTo` / `_originalOf` / `migrationManager` | — | 账户迁移三件套 |
| `MAX_RELEASE_PAGE_SIZE` | uint256 constant | 单页最多 50 条，不占代理存储槽 |

### 常用函数

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `deposit(user, amount, token)` | pre | 记账式存款（资金由 pre 转入） |
| `claim(index)` / `claimMany(start, limit)` | 用户 | 领取（转发下游或到钱包） |
| `claimable(user, index)` | view | 可领取金额 |
| `getReleaseCount(user)` / `getRelease(user, index)` / `getReleaseDuration(user, index)` | view | 释放记录查询 |
| `getReleases(user, start, limit)` | view | 分页返回完整释放单详情和 `totalCount`；`limit` 为 1–50 |
| `setNext(addr)` / `setPre(addr)` | owner | 链式配置（`setNext` 禁设自身） |
| `sweepExcess(token, to)` | owner | 回收超额代币 |
| `migrateAccount(old, new)` | migrationManager | 账户迁移 |

### 事件

`Deposited`、`Claimed(user, index, next, token, amount, forwarded, timestamp)`、`NextUpdated`、`PreUpdated`、`SweepExcess`、`MigrationManagerUpdated`、`AccountMigrated`。

### 使用注意事项

1. 链式瀑布语义 ：非链尾领取 = 资金推下游再释放 30 天；用户逐级领取到链尾才到钱包。前端须明确展示"第几级/还剩几级"。
2. `next` 禁环 ： setNext 禁设自身；完整防环由部署脚本校验。
3. 多代币 ：同实例可共存 AGX + gAGX； sweepExcess 只回收未被背书余额。
4. 迁移 ：分流器已注册迁移目标；新地址迁移后可领取释放记录。
5. 升级 ：新增存储只能 append； upgrade:splitter 用 SPLITTER_INSTANCE_KEY 指定实例。本次分页接口只新增常量、错误和 view/helper，不新增存储。主网 AegisSplitterHead_0 已于区块 114490066 升级到实现 0x5b9D6B8c88973d8c028C1C83956fF5474CE38B7d ，链上可调用 getReleases ；其他实例需逐个核对并升级。
