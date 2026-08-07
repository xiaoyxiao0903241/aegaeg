# AegisSplitterManager 合约文档

> 来源：`doc-contracts-aegissplittermanager`
> ABI：[`abis/aegissplittermanager.json`](../abis/aegissplittermanager.json)

## 完整 ABI

abi/AegisSplitterManager.json
SHA-256 9d1fcbd00346…
50
26
10
14

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegissplittermanager.json`](../abis/aegissplittermanager.json)（50 entries）。

</details>

## AegisSplitterManager 合约文档

### 概述

`AegisSplitterManager` 是 AEGIS X 的分流器管理合约（路由层）。本金领取（12 个本金合约）与涡轮 gAGX（Turbine）统一先进入本合约，按用户 Referral 绑定时间戳命中 `headSplitters` 区间，路由到对应的头部分流器（`AegisSplitter`）做线性释放。

**部署 key**: `AegisSplitterManager`

**BNB Chain 主网 proxy**: `0x951d22EDBbFeC93ecD40B9fE7faC979A0EA7471F`（release `bb680398-e7c0-46fa-ad87-139446fb4120`）

**ABI 路径**: `abi/AegisSplitterManager.json`

**代理**: TransparentUpgradeableProxy（升级：`npm run upgrade:splitter-manager`）

---

### 关键概念

#### 1. 统一存款入口 createRelease(user, amount)

与已删除的 `PrincipalReleaseVault.createRelease` ABI 完全兼容（返回 `uint256`，无调用方使用返回值）。6 类本金合约（共 12 实例）通过 `setPrincipalReleaseVault(manager)` 零代码改动接入：

text

```text
createRelease(user, amount)
  → token = callerToken[msg.sender]          // 本金合约→AGX，Turbine→gAGX
  → headSplitter = getHeadSplitterForUser(user)   // 按绑定时间命中区间
  → IERC20(token).transferFrom(msg.sender, headSplitter, amount)
  → IAegisSplitter(headSplitter).deposit(user, amount, token)   // 记账式存款
```

#### 2. 新老用户区分与释放周期

- newUserThreshold ：分界时间戳。 getBindTimestamp(user) != 0 && > threshold 视为新用户（绑定时间读取自 AegisReferral.getBindTimestamp ，已做迁移解析）。
- newUserSwitchEnabled ：新用户释放周期开关。
- effectiveDuration(user) ：开关开且新用户 → newUserReleasePeriod ；否则 30 days 。
- 头部分流器在 deposit 时通过 manager.effectiveDuration(user) 快照释放周期。

#### 3. 头部分流器数组

`headSplitters: HeadSplitterEntry[]`，每项 `{ startTime, endTime, splitter }`。路由规则：

- bindTime 命中 [startTime, endTime] → 该 entry 的 splitter。
- bindTime == 0 （未绑定）或无区间命中 → 回落到 startTime 最早 entry（第一期）。

#### 4. 调用方白名单与代币映射

- authorizedCallers ：允许调用 createRelease 的合约（12 个本金合约 + Turbine）。
- callerToken ：每个调用方存入的代币（本金合约→AGX，Turbine→gAGX），通过 setAuthorizedCaller(caller, token, enabled) 一次配置。

---

### 状态变量

| 变量                   | 类型                | 说明                                         |
| ---------------------- | ------------------- | -------------------------------------------- |
| `referral`             | address             | AegisReferral 地址，读取绑定时间戳           |
| `newUserThreshold`     | uint256             | 新老用户分界时间戳                           |
| `newUserSwitchEnabled` | bool                | 新用户释放周期开关                           |
| `newUserReleasePeriod` | uint256             | 新用户释放周期（秒）                         |
| `headSplitters`        | HeadSplitterEntry[] | 头部分流器数组（startTime/endTime/splitter） |
| `authorizedCallers`    | mapping             | 存款入口白名单                               |
| `callerToken`          | mapping             | 调用方 → 存入代币                            |

### 常用函数

| 函数                                              | 权限              | 说明                           |
| ------------------------------------------------- | ----------------- | ------------------------------ |
| `createRelease(user, amount)`                     | authorizedCallers | 统一存款入口，路由到头部分流器 |
| `effectiveDuration(user)`                         | view              | 用户有效释放周期               |
| `getHeadSplitterForUser(user)`                    | view              | 按绑定时间路由头部分流器       |
| `isNewUser(user)`                                 | view              | 是否新用户                     |
| `callerToken(caller)`                             | view              | 调用方存入代币                 |
| `setAuthorizedCaller(caller, token, enabled)`     | owner             | 配置白名单与代币               |
| `addHeadSplitter(start, end, splitter)`           | owner             | 新增头部分流器                 |
| `updateHeadSplitter(index, start, end, splitter)` | owner             | 更新                           |
| `removeHeadSplitter(index)`                       | owner             | 移除（swap-pop）               |
| `setNewUserThreshold/Switch/ReleasePeriod`        | owner             | 新老配置                       |

### 事件

`AuthorizedCallerUpdated`、`NewUserThresholdUpdated`、`NewUserSwitchUpdated`、`NewUserReleasePeriodUpdated`、`HeadSplitterAdded/Updated/Removed`、`Routed(user, caller, token, headSplitter, amount, timestamp)`。

### 使用注意事项

1. 路由兜底 ：未绑定用户或无区间命中走 startTime 最早的 entry；部署时确认第一期已就绪。
2. 迁移 ：分流器是账户迁移目标（ AegisSplitterHead_0 已注册，21 目标清单之一）；迁移后新地址可领取分流器释放记录。
3. 升级 ：新增存储只能 append； upgrade:splitter-manager 依赖 OZ manifest 布局校验。
