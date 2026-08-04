# PreSale (AegisPreSale)

> 来源：`doc-contracts-presale`
> ABI：[`abis/presale.json`](../abis/presale.json)

## 完整 ABI

abi/AegisPreSale.json
SHA-256 8c6881438d31…
80
49
8
23

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/presale.json`](../abis/presale.json)（80 entries）。

</details>

## PreSale (AegisPreSale)

本文档按当前 `src/PreSale.sol` 重写。旧文档中的 `buy`、`claimAirdrop`、`72.5% saleWallet` 已不符合当前源码。

**部署 key**：`PreSale`

**ABI**：`abi/AegisPreSale.json`

### 职责

`AegisPreSale` 负责多阶段 USD1 预售记账、推荐奖励发放、空投价值统计和账户迁移兼容。

当前购买入口：

solidity

```solidity
function purchase(uint256 _phaseIndex, uint256 _amount) external nonReentrant
```

### 购买前置条件

- 合约未暂停。
- 用户已在 Referral 绑定推荐人。
- _amount > 0 。
- _amount % BASE_UNIT == 0 ，其中 BASE_UNIT = 100 ether 。
- _phaseIndex 存在。
- 当前时间在 phase 的 [startTime,endTime] 内。
- _amount 满足 phase 的 minAmount / maxAmount 。
- 若 phase 配置 userPurchaseLimit ，用户原始账户累计购买不能超过该限额。

### AGX 额度计算

text

```text
discountPrice = agxPrice * (10000 - phase.discount) / 10000
agxAmount = amount * AGX_BASE / discountPrice
AGX_BASE = 1e9
```

合约会更新：

- userPhaseAmount[original][phaseIndex]
- userTotalAmount[original]
- userTotalAgx[original]
- phase.soldAmount
- totalPurchasedAmount
- totalAllocatedAgx

### 资金分配

当前源码固定分配：

| 去向                  | 比例 | 调用/转账                                  |
| --------------------- | ---- | ------------------------------------------ |
| saleWallet            | 82%  | `usd.safeTransfer(saleWallet, saleAmount)` |
| rewardContract        | 10%  | `forceApprove` 后 `deposit(teamReward)`    |
| communityFundContract | 5%   | `forceApprove` 后 `deposit(systemReward)`  |
| referralBudget        | 3%   | `_issueReferralReward` 按推荐链匹配发放    |

未发完的推荐预算会转给 `unclaimedReceiver`。

PreSale 资金不进入 `Treasury`。

### 空投价值

如果用户阶段累计购买跨过 `AIRDROP_THRESHOLD = 5000 ether`，会按 phase 的 `airdropValueRatio` 记录新增空投价值。

当前源码只做空投价值统计：

- userPhaseAirdropValue
- userTotalAirdropValue
- totalAirdropValue
- AirdropValueAccrued 事件

本文档不再描述 `claimAirdrop`，因为当前 `src/PreSale.sol` 没有该用户领取入口。

### 前端购买示例

javascript

```javascript
const phaseIndex = 0n
const amount = ethers.parseUnits('5000', 18)

const bound = await referral.isBindReferral(userAddress)
if (!bound) throw new Error('bind referral first')

await (await usd1.approve(PRESALE_ADDRESS, amount)).wait()
await (await presale.purchase(phaseIndex, amount)).wait()
```

### 常用查询

javascript

```javascript
const phaseCount = await presale.getPhaseCount()
const remaining = await presale.getPhaseRemainingAmount(0)
const userInfo = await presale.getUserPhaseRemainingAmount(userAddress, 0)
const preview = await presale.previewAirdropValue(userAddress, 0, amount)
```

### 迁移与账户状态视图

源码（PreSale.sol:81-89, 431-460）提供迁移接口与账户状态视图：

- migrationManager (public) — 统一迁移管理器地址。
- migratedTo(address) -> address (public mapping) — 旧账户到新账户的迁移映射。
- everHadAccountState(address) -> bool (public mapping) — 标记账户是否曾经拥有过购买状态。 migrateAccount 用它拒绝已有历史的新账户；前端可用它判断账户能否作为迁移目标。
- setMigrationManager(address _manager) (onlyOwner, 一次性不可变 ) — 设置迁移管理器； migrationManager 一旦非零再改回滚 MigrationManagerImmutable 。部署前必须确认。
- migrateAccount(address oldAccount, address newAccount) (only migrationManager) — 仅由 migrationManager 调用，owner 没有单目标直迁旁路。旧账户被标记后 purchase 在 onlyActiveAccount 守卫下回滚 PreSaleMigratedAccount ；新账户必须无任何历史状态（ everHadAccountState / migratedTo 等全空）。

购买额度、AGX 额度和空投价值查询以 original/canonical 映射合并。前端先从 AccountMigrationManager 解析首次 root，再用该 root 调用现有 public mapping getter。

### Operator 入口（owner 或 operator）

下列函数 owner 或 operator（`operators[msg.sender]`）均可调用，否则回滚 `ErrorCallerNotAuthorized`。`setBondOperator(address,bool)` (onlyOwner) 用于维护 operator 列表。

#### addPhase(uint256 _minAmount, uint256 _maxAmount, uint256 _discount, uint256 _airdropValueRatio, uint256 _startTime, uint256 _endTime, uint256 _userPurchaseLimit)

追加一个新预售阶段。`_discount` 必须 < 10000，`_airdropValueRatio` 必须 ≤ 10000，否则分别回滚 `PreSaleInvalidDiscount` / `PreSaleInvalidAirdropValueRatio`。触发 `PhaseUpdated` 与 `PhaseUserPurchaseLimitUpdated`。

#### updatePhase(uint256 _phaseIndex, uint256 _minAmount, uint256 _maxAmount, uint256 _discount, uint256 _airdropValueRatio, uint256 _startTime, uint256 _endTime, uint256 _userPurchaseLimit)

更新现有阶段字段。`_phaseIndex` 越界回滚 `PreSalePhaseIndexOutOfBounds`。同样触发 `PhaseUpdated` 与 `PhaseUserPurchaseLimitUpdated`。

#### setPhaseUserPurchaseLimit(uint256 _phaseIndex, uint256 _userPurchaseLimit)

单独设置某阶段单用户购买上限（0 = 不限制）。触发 `PhaseUserPurchaseLimitUpdated`。

### 错误码

| 错误                                                                | 原因                                       |
| ------------------------------------------------------------------- | ------------------------------------------ |
| `PreSalePaused()`                                                   | 合约暂停                                   |
| `PreSaleUserNotBound()`                                             | 未绑定 Referral                            |
| `PreSaleInvalidAmount()`                                            | 金额为 0 或非 BASE_UNIT 倍数               |
| `PreSalePhaseIndexOutOfBounds(uint256,uint256)`                     | phase 索引越界                             |
| `PreSalePhaseNotActive(uint256)`                                    | 当前时间不在 phase 时间窗口内              |
| `PreSaleBelowMin(uint256)`                                          | 金额低于 phase minAmount                   |
| `PreSaleExceedsMax(uint256,uint256,uint256)`                        | 金额超过 phase maxAmount                   |
| `PreSalePhaseSoldOut(uint256)`                                      | phase 已售罄                               |
| `PreSaleInvalidDiscount(uint256)`                                   | discount ≥ 10000                           |
| `PreSaleInvalidAirdropValueRatio(uint256)`                          | airdropValueRatio > 10000                  |
| `PreSaleInvalidAgxPrice(uint256)`                                   | agxPrice 为 0                              |
| `PreSaleZeroAddress()`                                              | 传入零地址                                 |
| `PreSaleMigratedAccount(address)`                                   | 账户已迁移或被占用                         |
| `PreSaleNotMigrationManager(address)`                               | 非 migrationManager 调用 `migrateAccount`  |
| `MigrationManagerImmutable(address)`                                | 二次修改 migrationManager                  |
| `ErrorCallerNotAuthorized()`                                        | 非 owner/operator 调用受限函数             |
| `PreSaleUserPurchaseLimitExceeded(uint256,uint256,uint256,uint256)` | 用户在阶段累计购买超过 `userPurchaseLimit` |

### 事件

| 事件                                                                                                                                                              | 说明                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `Purchased(address indexed buyer, uint256 indexed phaseIndex, uint256 usdAmount, uint256 agxAmount, uint256 timestamp)`                                           | 用户购买                      |
| `ReferralRewardPaid(address indexed referrer, address indexed buyer, uint256 buyerAmount, uint256 usdAmount, uint256 reward, uint256 timestamp)`                  | 推荐奖励发放                  |
| `UnclaimedReferralWithdrawn(address indexed to, uint256 amount, uint256 timestamp)`                                                                               | 未发完推荐预算转出            |
| `PhaseUpdated(uint256 indexed phaseIndex, uint256 minAmount, uint256 maxAmount, uint256 discount, uint256 airdropValueRatio, uint256 startTime, uint256 endTime)` | `addPhase`/`updatePhase` 触发 |
| `AirdropValueAccrued(address indexed buyer, uint256 indexed phaseIndex, uint256 purchaseAmount, uint256 addedValue, uint256 totalPhaseValue, uint256 timestamp)`  | 空投价值累计                  |
| `PhaseUserPurchaseLimitUpdated(uint256 indexed phaseIndex, uint256 userPurchaseLimit)`                                                                            | 阶段单用户限额变更            |
