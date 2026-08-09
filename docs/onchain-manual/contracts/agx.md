# AGX (AegisXToken) 合约文档

> 来源：`doc-contracts-agx`
> ABI：[`abis/agx.json`](../abis/agx.json)

## 完整 ABI

abi/AegisXToken.json
SHA-256 40062dea6126…
113
65
25
22

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/agx.json`](../abis/agx.json)（113 entries）。

</details>

## AGX (AegisXToken) 合约文档

### 概述

`AegisXToken` (AGX) 是 AEGIS X 的核心治理和效用代币，9 位小数。合约同时提供单区块卖出额度防御与持续价格熔断。

**部署 key**: `AGX`

**ABI 路径**: `abi/AegisXToken.json`

---

### 关键概念

#### 1. Crash Fuse 防御机制

- 监控 LP 价格下跌（需要 2 个不同区块的有效低价观察，区块无需相邻）
- 触发条件：当前价格低于快照价格的 crashThresholdBP
- 同一区块只记录第一次有效观察；后续任意不同区块再次观察到低于阈值即激活
- 若在激活前观察到价格恢复至阈值线或以上，则清空已有确认
- 激活后：卖出税从 sellRatio 提高到 extraSellBP
- 持续时间： crashFuseDurationSeconds （默认 24 小时）
- 结束后：重新快照价格
- Governance 可通过 setDefenseMode(true/false) 手动开启或关闭持续熔断
- 手动关闭会清空低价确认并刷新价格快照，但不会重新开放当前区块已消耗的低税额度
- 治理调用 snapshotDefensePrice() 刷新快照时也会清空旧快照下的低价确认，旧确认不会跨快照累计

#### 2. 单区块毛卖出额度

- 每个区块第一笔非白名单卖出前读取并冻结 AGX 储备与跌幅阈值
- 低税额度为 blockStartAgxReserve × floor(blockSellThresholdBP / 2) / 10000
- 后续每笔卖出会按当前 AGX 储备重算额度；额度在同一区块只可收紧、不可扩大，防止撤出流动性后旧额度相对剩余池子过大
- 默认跌幅阈值为 5%，因此默认低税额度为观察到的 AGX 储备的 2.5%
- 使用毛卖出量 _amount 跨地址累计；不限制单笔金额
- 当 nextGross > blockSellLimit 时，越界交易整笔及该区块后续卖出使用 extraSellBP ，税进入 rbs
- 超额不会回滚交易，也不会单独开启 24 小时持续熔断
- 新区块第一笔受管控卖出会重置累计量并重新冻结额度
- setDefenseDropThreshold() 的修改从下一区块首次受管控卖出起生效，防止同块扩大额度

“区块开始储备”具体指该区块第一笔受管控卖出执行前从 Pair 读取到的储备，并非区块历史状态。

#### 3. 卖出税

- 正常卖出税： sellRatio （默认 3.5%）
- 防御税： extraSellBP （默认 30%，不得低于 sellRatio ）
- 税收转入 feeReceiver （基础税）或 rbs （持续熔断/区块额度超限）

#### 4. LP 余额销毁

- burnPoolBalance() 按比例销毁 LP 中的 AGX
- 销毁比例： targetRatio （BPS）

---

### 前端 API

#### 标准 ERC20 接口

js
```js
// 余额查询
const balance = await agx.balanceOf(userAddress);
console.log('AGX balance:', ethers.formatUnits(balance, 9));

// 转账
await (await agx.transfer(recipient, amount)).wait();

// 授权
await (await agx.approve(spender, amount)).wait();
```

#### 防御机制视图

js
```js
const config = await Promise.all([
  agx.sellRatio(),
  agx.extraSellBP(),
  agx.crashThresholdBP(),
  agx.crashFuseActive(),
  agx.snapshotPrice(),
  agx.defenseEndTime(),
  agx.consecutiveDropBlocks(),
  agx.blockSellQuotaBlock(),
  agx.blockStartAgxReserve(),
  agx.blockSellThresholdBP(),
  agx.blockSellLimit(),
  agx.grossSoldInBlock(),
  agx.pendingCrashThresholdBP(),
  agx.crashThresholdEffectiveBlock(),
  agx.crashThresholdUpdatePending(),
]);

console.log('Sell tax (normal):', Number(config[0]) / 100, '%');
console.log('Sell tax (defense):', Number(config[1]) / 100, '%');
console.log('Crash threshold:', Number(config[2]) / 100, '%');
console.log('Defense active:', config[3]);
// snapshotPrice 已按 AGX 与报价代币的实际 decimals 归一化为 18 位定点价格
console.log('Snapshot price (quote token per AGX):', ethers.formatUnits(config[4], 18));
console.log('Gross sold in observed block:', ethers.formatUnits(config[11], 9));
```

前端应监听：

- BlockSellQuotaInitialized ：新区块额度被冻结；
- BlockSellQuotaReduced ：同块储备下降，低税额度被单调收紧；
- BlockSellDefenseTaxApplied ：本笔交易因累计超额改用防御税；
- CrashThresholdUpdateScheduled / CrashThresholdUpdated ：阈值排期与实际应用；
- ExtraSellTaxActivated / ExtraSellTaxDeactivated ：持续熔断开关。

### 错误码

| 错误 | 原因 | 解决方案 |
| --- | --- | --- |
| `Disabled()` | 转账未启用（买入被禁用） | 等待管理员启用 |
| `InvalidRatio()` | 税率越界，或基础税高于防御税 | 联系管理员 |
| `CrashFuseAlreadyActive()` | 防御已激活 | 等待结束 |
| `SnapshotNotInitialized()` | 快照未初始化 | 等待管理员设置 |
| `PairAlreadySet()` | 流动性池已经完成一次性设置 | 重新部署前核对 Pair 地址 |
| `InvalidPair()` | Pair 未包含 AGX，或两侧配置异常 | 使用正确的 AGX/报价币 Pair |
| `UnsupportedDecimals()` | 报价币精度超过合约支持范围 | 使用精度不超过 36 位的报价币 |
| `InvalidAddress()` | 零地址非法 | 检查地址参数 |
| `Unauthorized()` | 调用方无权限（如非 treasury 调用 mint） | 用正确的权限账户 |
| `ErrorCooldown()` | 操作命中冷却限制 | 等待冷却结束 |
| `CrashThresholdTooHigh()` | 熔断跌幅阈值设置过高 | 降低阈值 |
| `ExtraSellTaxTooHigh()` | 防御卖出税设置过高 | 降低防御税率 |
| `PairNotSet()` | 流动性 Pair 尚未设置 | 先调用 setLiquidityPool |
| `ReserveZero()` | 储备为 0 | 检查 Pair 储备 |

### 配置参数

| 参数 | 默认值 | 说明 | 设置者 |
| --- | --- | --- | --- |
| `sellRatio` | 350 (3.5%) | 基础卖出税 | governance |
| `extraSellBP` | 3000 (30%) | 防御模式税 | governance |
| `crashThresholdBP` | 500 (5%) | 当前生效的下跌阈值；对应默认 2.5% 单区块低税额度 | governance |
| `crashFuseDurationSeconds` | 24 小时 | 防御持续时间 | governance |
| `targetRatio` | 100 (1%) | LP 销毁比例 | governance |
| `feeReceiver` | owner | 税收接收者 | governance |
| `transferStatus` | false | 是否启用买入 | owner |
| `whitelist` | - | 免税收地址 | owner |

---

### 状态修改函数

| 函数 | 权限 | 说明 |
| --- | --- | --- |
| `mint(address _to, uint256 _amount)` | 仅 `treasury`（`msg.sender != treasury` 时 revert `Unauthorized`） | 由 Treasury 调用的铸币入口，非 owner 后门。源码 `src/AGX.sol:593` |
| `snapshotDefensePrice()` | `onlyGovernance` | 立即刷新防御价格快照，并清空旧快照下的低价确认。源码 `:429` |
| `setDefenseSellTax(uint256 _bp)` | `onlyGovernance` | 设置防御模式卖出税。源码 `:440` |
| `setDefenseDropThreshold(uint256 _bp)` | `onlyGovernance` | 设置熔断跌幅阈值（下一区块首次受管控卖出起生效）。源码 `:448` |
| `setDefenseMode(bool _active)` | `onlyGovernance` | 手动开启/关闭持续熔断。源码 `:457` |
| `setDefenseDurationSeconds(uint256 _duration)` | `onlyGovernance` | 设置防御持续时间。源码 `:481` |
| `setBaseSellTax(uint256 _newTaxRate)` | `onlyGovernance` | 设置基础卖出税。源码 `:569` |
| `setSellFeeReceiver(address _newReceiver)` | `onlyGovernance` | 设置基础税接收者。源码 `:555` |
| `setPoolBurnRatio(uint256 _newRatio)` | `onlyGovernance` | 设置 LP 销毁比例 `targetRatio`。源码 `:534` |
| `burnPoolBalance()` | `onlyGovernance` | 按比例销毁 LP 中的 AGX。源码 `:576` |
| `setLiquidityPool(address _newPool)` | `onlyOwner` | 一次性设置流动性 Pair。源码 `:499` |
| `setPoolBuyEnabled(bool _enable)` | `onlyOwner` | 开启/关闭买入（`transferStatus`）。源码 `:541` |
| `setTreasuryVault(address _newTreasury)` | `onlyOwner` | 设置 Treasury 地址。源码 `:527` |
| `setRbsContract(address _newRbs)` | `onlyOwner` | 设置 RBS 合约地址。源码 `:562` |
| `setGovernance(address _newGovernance)` | `onlyOwner` | 设置 governance 地址。源码 `:548` |
| `addSystemWhitelist(address _addr)` | `onlyOwner` | 添加系统白名单。源码 `:487` |
| `removeSystemWhitelist(address _addr)` | `onlyOwner` | 移除系统白名单。源码 `:493` |

### 事件（防御关键）

除 `BlockSellQuotaInitialized` / `BlockSellQuotaReduced` / `BlockSellDefenseTaxApplied` / `ExtraSellTaxActivated` / `ExtraSellTaxDeactivated` / `CrashThresholdUpdateScheduled` / `CrashThresholdUpdated` 外，补充两个防御关键事件：

| 事件 | 说明 |
| --- | --- |
| `PriceSnapshotted(uint256 indexed price, uint256 indexed timestamp)` | 价格快照刷新（源码 `:185`） |
| `DropConfirmed(uint256 indexed consecutiveBlocks, uint256 curPrice, uint256 snapshotPrice, uint256 timestamp)` | 低价观察确认；`consecutiveBlocks` 为兼容保留的字段名，实际表示当前低价区间内不同区块的确认数（源码 `:199`） |

其他管理类事件：`TreasuryAddressUpdated` / `GovernanceAddressUpdated` / `FeeReceiverAddressUpdated` / `RbsAddressUpdated` / `SellRateChanged` / `BalanceTargetRateChanged` / `BalancePoolAddressUpdated` / `TokenTransferStateUpdated` / `WhitelistAdded` / `WhitelistRemoved` / `BalancePoolBurned` / `DefenseSellTaxUpdated` / `DefenseDurationUpdated`。
