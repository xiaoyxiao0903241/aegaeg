# RBS (AegisReserveMarketMaker) 合约文档

> 来源：`doc-contracts-rbs`
> ABI：[`abis/rbs.json`](../abis/rbs.json)

## 完整 ABI

abi/AegisReserveMarketMaker.json
SHA-256 f3c90278d0b6…
55
40
10
5

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/rbs.json`](../abis/rbs.json)（55 entries）。

</details>

## RBS (AegisReserveMarketMaker) 合约文档

### 概述

`AegisReserveMarketMaker` 负责协议储备做市、LP 管理、Treasury 储备入库，以及按 PreSale 累计分配量为 EarlyStaking 增量铸造 AGX。

- 部署 key： RBS
- BNB Chain 主网 proxy： 0xde591E8C3DD60be77481Ea335d7A038e09357034 （当前实现与新增预售配置已通过增量 release f25c7887-1ec0-43a2-b16c-32de9dbbb314 升级终验）
- ABI： abi/AegisReserveMarketMaker.json
- AGX 精度：9 位
- USD1 精度：18 位
- 新增储备/预售写入口：仅 owner
- Keeper：无需增加或改变调用；新增操作是管理动作

### 权限模型

| 权限 | 可调用方法 |
| --- | --- |
| `owner` | 全部方法，包括 `mint`、`addReserve`、`mintPresaleAgx` 和配置方法 |
| `operator` | 仅 `swap`、`addLiquidity`、`burnLP`、`removeLiquidity` |
| 普通地址 | 只读方法 |

`operator` 不能调用储备入库、AGX 铸造或配置方法。

### 预售记账模型

核心状态：

| Getter | 含义 |
| --- | --- |
| `earlyStaking()` | 预售 AGX 的最终接收池 |
| `preSaleContract()` | `totalAllocatedAgx()` 的来源 |
| `presaleMintedAmount()` | RBS 已处理的累计预售 AGX |
| `maxPresaleMint()` | Owner 可调整的累计铸造上限 |
| `getPresaleMintAmount()` | PreSale 当前累计分配总量；不是本次待铸量 |

每次 `mintPresaleAgx` 只铸造新增差额：

text
```text
pending = PreSale.totalAllocatedAgx - RBS.presaleMintedAmount
```

同一累计值重复调用会在任何资金转移前以 `No new AGX to mint` 回滚。PreSale 暂停或重开不影响该算法；有新购买时只处理新增部分，但累计值不能超过 `maxPresaleMint`。

### 精度与抵押价值

PreSale 的累计分配量和 RBS 的铸币状态都使用 AGX 9 位原始精度。储备代币使用自身精度。以 18 位 USD1 为例：

text
```text
500,000 AGX raw = 500,000 × 1e9
500,000 USD1 raw = 500,000 × 1e18

Treasury.valueOf(USD1, amount)
  = amount / 1e9
  = 500,000 × 1e9
```

`mintPresaleAgx` 要求 `Treasury.valueOf(token, amount) >= pending`。前端必须按所选 ERC-20 的链上 `decimals()` 解析输入，不能统一写死 18 位。合约不接收链下确认的 pending 参数，交易执行时会重新读取 PreSale 累计量。

### 主要写方法

#### addReserve(address token, uint256 amount)

仅 owner。将 RBS 持有的、已被 Treasury 接受的储备代币存入 Treasury，`payout=0`，不铸造 AGX。

合约校验：

- token 非零、 amount > 0 且不超过 RBS 余额；
- RBS 使用 safeIncreaseAllowance 授权 Treasury；
- 调用 Treasury.depositStableReserve(token, amount, 0) ；
- 成功发出 ReserveAdded 。

该版本不额外核对 Treasury 实际到账差额，也不检查 Treasury 的返回值；生产配置只应使用 Treasury 已接受的标准储备代币。

#### mintPresaleAgx(address token, uint256 amount)

仅 owner。将储备代币存入 Treasury，铸造当前待铸 AGX，并把全部新铸 AGX 转给 `earlyStaking`。

链上按以下顺序校验：

1. EarlyStaking、PreSale、token、amount 和 RBS 余额非零或有效；
2. totalAllocatedAgx > presaleMintedAmount ；
3. 新累计值不超过 maxPresaleMint ；
4. Treasury 估值覆盖本次待铸 AGX；
5. Treasury 返回的铸币量等于待铸量；
6. 更新 presaleMintedAmount ，并把相同数量 AGX 转给 EarlyStaking。

任一步回滚时，当前交易内的储备转账、AGX 铸造和 `presaleMintedAmount` 更新都会回滚。该版本不额外核对 Treasury/RBS/EarlyStaking 的真实余额增量。

#### mint(uint256 usdAmount, uint256 profitAmount)

原有仅 owner 的 Treasury 铸币入口，仍受 30 分钟冷却、单次 200,000 USD1 上限和 monitorToken 条件约束。它与预售增量记账相互独立；预售应使用 `mintPresaleAgx`。

#### 做市方法

- swap(path, amountIn, amountOutMin, deadline)
- addLiquidity(tokenA, tokenB, amountAIn, amountBIn, deadline)
- burnLP(amount)
- removeLiquidity(pair, liquidity, amountAMin, amountBMin, deadline)

这些方法允许 owner 或 operator 调用。

### 配置与升级

| 方法 | 约束 |
| --- | --- |
| `setEarlyStaking(address)` | 地址非零；Owner 可再次修改 |
| `setPreSaleContract(address)` | 地址非零，且只能在 `presaleMintedAmount == 0` 时修改 |
| `setMaxPresaleMint(uint256)` | 大于 0；Owner 后续可再次修改 |

新增状态严格追加在旧布局 slots 9–12。升级旧 RBS 后，这四个槽默认都是 0；升级交易只替换实现，不携带初始化调用。随后必须由 RBS owner 分别设置 EarlyStaking、PreSale 和累计上限。

这一语义要求目标代理历史上没有已经铸造并交付、但未记录到 `presaleMintedAmount` 的预售 AGX。若存在历史铸造，第一次执行会从 0 开始重新计算累计分配并可能重复铸币，不能直接采用本升级流程。

### 主网升级与配置

`.env.mainnet` 可选配置：

dotenv
```dotenv
RBS_MAX_PRESALE_MINT=        # 可留空；留空表示不限额
RBS_EARLY_STAKING=            # 预售 AGX 接收地址
RBS_PRESALE_CONTRACT=         # PreSale 地址
```

`RBS_EARLY_STAKING` 和 `RBS_PRESALE_CONTRACT` 留空时使用当前发布快照中的 canonical 地址。`RBS_MAX_PRESALE_MINT` 留空时写入 `uint256.max`；实际待铸量始终按 `PreSale.totalAllocatedAgx() - RBS.presaleMintedAmount()` 计算。

bash
```bash
# 直接执行 12 个代理升级、RBS 配置、Tracker 切换与迁移拓扑收口
npm run upgrade:mainnet

# 最终只读验收
npm run upgrade:mainnet:verify
```

升级和配置不是单笔原子交易；脚本会在 AccountMigrationManager 已关闭且无 pending 的窗口内逐步完成，已升级或已配置的项目在重跑时自动跳过。升级后到三个配置交易全部确认前，禁止调用 `mintPresaleAgx`。最终验收会回读 owner、EarlyStaking、PreSale、累计上限和已铸量，并拒绝 `presaleMintedAmount` 超过累计上限。

### 事件

| 事件 | 用途 |
| --- | --- |
| `Minted` | 原有 `mint` 成功 |
| `Burned` | LP 已销毁 |
| `OperatorUpdated` | operator 状态变化 |
| `ReserveAdded` | 储备代币已从 RBS 入 Treasury |
| `PresaleAgxMinted` | 预售新增 AGX 已铸造并转入 EarlyStaking |
| `EarlyStakingSet` | EarlyStaking 地址更新 |
| `PreSaleContractSet` | PreSale 地址更新 |
| `MaxPresaleMintSet` | 累计上限更新 |

### 前端接入要求

- 新增操作只展示给 RBS owner，operator 不得启用按钮。
- addReserve 和 mintPresaleAgx 的 token 输入要动态读取 decimals() 与 balanceOf(RBS) 。
- 预售卡片同时展示累计分配、已铸、待铸和累计上限；待铸量由前端计算 getPresaleMintAmount() - presaleMintedAmount() 。
- 任何关键读取失败都必须禁用写按钮，不能把 undefined 当成 0。
- 提交两参数 mintPresaleAgx(token, amount) 前应在 BSC 上立即执行 simulation；交易上链时会按最新累计分配量重新计算待铸量。
- 非幂等管理交易广播后应等待确定回执，不应因前端超时重新开放并诱导重复提交。
- 成功后刷新 RBS 状态、RBS/Treasury token 余额和 EarlyStaking AGX 余额。
- 扫链方新增监听 ReserveAdded 、 PresaleAgxMinted 和配置事件时，应以 txHash + logIndex 幂等入库。

### 常见回滚

| 错误 | 含义 |
| --- | --- |
| `Early staking not set` / `Presale not set` | 预售接线未完成 |
| `No new AGX to mint` | 当前没有新增预售分配 |
| `Already minted` | 已发生预售铸币后尝试修改 PreSale 地址 |
| `Exceeds max presale mint` | 新累计值超过硬上限 |
| `Insufficient deposit value` | Treasury 估值不足以覆盖本次待铸量 |
| `Mint amount mismatch` | Treasury 返回的铸币量与本次增量不一致 |
