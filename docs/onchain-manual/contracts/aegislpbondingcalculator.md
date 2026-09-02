# AegisLpBondingCalculator 集成说明

> 来源：`doc-contracts-aegislpbondingcalculator`
> ABI：[`abis/aegislpbondingcalculator.json`](../abis/aegislpbondingcalculator.json)

## 完整 ABI

abi/AegisLpBondingCalculator.json
SHA-256 3b1d72a48085…
5
4
0
0

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/aegislpbondingcalculator.json`](../abis/aegislpbondingcalculator.json)（5 entries）。

</details>

## AegisLpBondingCalculator 集成说明

该合约为 BondDepository 提供 Pancake/Uniswap V2 LP 的只读估值，不是普通用户写入入口。

**部署 key**：`BondingCalculator`

**ABI**：`abi/AegisLpBondingCalculator.json`

### 构造

`constructor(address _agx)`：部署时绑定 AGX 地址，`_agx == address(0)` 时 `require` 回滚 `"Zero address: AGX"`。AGX 不可变（`immutable`），用于 `markdown` 识别 pair 中 AGX 一侧。

### 只读接口

| 方法 | 说明 |
| --- | --- |
| `getKValue(pair)` | 按 token0/token1/pair decimals 归一化后的储备乘积 |
| `getTotalValue(pair)` | `2 × reserveQuote / 10^(quoteDecimals − agxDecimals)` 的池子总价值口径（AGX 9 位 / USD1 18 位池即 `2×reserveQuote/1e9`） |
| `valuation(pair, amount)` | 指定 LP 数量对应的池子价值 |
| `markdown(pair)` | pair 另一侧储备相对 AGX 的 markdown 口径 |

> 2026-08-09 修复：`getTotalValue` 由旧版 `2×sqrt(k)` 口径（对 AGX/USD1 池低估约 7.4 倍）改为按 AGX 侧 `reserveQuote` 折算；主网 calculator 已替换为修复版 `0xf661D59D…`。

前端可把这些值用于透明度展示，但购买债券前的最终报价和校验必须以 BondDepository 的 view/交易模拟为准。`markdown` 要求 pair 的 token0 或 token1 确实是部署时绑定的 AGX，否则回滚 `Invalid pair`。

该合约没有写方法、owner 或事件；不要为它设计授权或交易按钮。
