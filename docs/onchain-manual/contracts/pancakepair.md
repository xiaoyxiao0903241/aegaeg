# PancakePair 前端集成说明

> 来源：`doc-contracts-pancakepair`
> ABI：[`abis/pancakepair.json`](../abis/pancakepair.json)

## 完整 ABI

abi/PancakePair.json
SHA-256 4722e6bfe8e6…
23
18
5
0

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/pancakepair.json`](../abis/pancakepair.json)（23 entries）。

</details>

## PancakePair 前端集成说明

这是项目内的简化 V2 Pair/LP ERC20。普通用户兑换和增减流动性应通过已审核的 Router 流程，不应直接拼装 `swap/mint/burn` 调用。

**部署 key**：`PancakePair`（当前默认 AGX/USD1 pair；其他 pair 由 Factory 查询）

**ABI**：`abi/PancakePair.json`

### 前端读取

| 方法                                | 说明                                                                 |
| ----------------------------------- | -------------------------------------------------------------------- |
| `token0()` / `token1()`             | 交易对资产顺序；永远先读取，不能假设 AGX 在 token0                   |
| `getReserves()`                     | `reserve0, reserve1, blockTimestampLast`，按各 token decimals 格式化 |
| `totalSupply()` / `balanceOf(user)` | LP 总量与用户 LP 余额                                                |
| `factory()`                         | 创建该 pair 的 Factory                                               |

`Sync` 用于储备更新通知，`Swap` 用于成交历史，`Transfer`（含 from=0）/`Burn` 用于流动性变化（无独立 `Mint` 事件，`mint()` 仅 emit `Transfer(address(0), to, liquidity)` + `Sync`）。事件触发后仍需重新读取 reserves。

### 写入边界

- initialize 只应由 Factory 在创建 pair 时调用。
- mint 、 burn 、 swap 涉及资产先转入、K 值和接收地址等约束；普通前端使用 Router，不直接调用。
- sync 会把记录储备同步到实际余额，不应作为普通用户按钮。

读取 Pair 即时储备用于展示或部分合约定价时，要明确它不是 TWAP，可能受同区块交易影响；不能在前端把即时储备包装成“可信预言机价格”。
