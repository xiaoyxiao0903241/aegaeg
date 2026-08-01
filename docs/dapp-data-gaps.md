# DApp 展示数据缺口与精度 SSOT

> 用户可见数字位：有手册源 → 真读；无源 → 控件保留、值 `0`/`0.00`（禁假数）。  
> 本表从**质押 Hub**起维护；兑换 / 资产 / 奖励等 tab 按同一列形续补。  
> 实现审计草稿另见 `.scratch/dapp-7rail-parity/research/45-staking-hub-number-audit.md`（研究用，非 docs SSOT）。

## 精度约定（展示）

| 类型             | 展示                      | 说明                                                      |
| ---------------- | ------------------------- | --------------------------------------------------------- |
| 法币 / 单价 `$`  | 固定 **2** 位（`$55.00`） | `formatGroupedNumber(…, { digits: 2 })`；禁 trim 掉 `.00` |
| `≈ $` 估值       | 固定 **2** 位；≥1k 可 K/M | `formatApproxUsd` / `formatApproxCompactUsd`              |
| AGX 量（Hub 卡） | **2** 位；≥1k → K/M       | `formatCompactNumber`：&lt;1k **补齐** digits             |
| 流通量           | 千分位 + **2** 位         | 空态 `0.00 AGX`                                           |
| 收益率 `%`       | **2** 位（`0.00%`）       | 表加成列整数 `0%`（稿）                                   |
| 地址数 / 页码    | **0** 位整数              |                                                           |
| PreSale 定价     | USD1 **18** dec wei       | **仅**创世 / 预售购买；≠ 市场参考价                       |

## AGX 价格两源（勿混）

| 源               | 读法                                                                       | 用途                                                   |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| **市场参考价**   | AGX/USD1 Pair `getReserves` → `readAgxUsd1SpotPriceWei` / `useAgxPriceUsd` | 质押 Hub 价格格、TVL/市值/智库 `≈$`、资产估值          |
| **PreSale 定价** | `PreSale.agxPrice` → `usePresaleAgxPriceQuery`                             | 创世 / 预售额度与折扣（管理员设定；可刚好为整数如 55） |

即时 pair 价 **不是** TWAP（见 `pancakepair.md`）。池未建或储备为 0 → 价 `null` → 展示 `$0.00` / `≈ $0.00`。

## 质押 Hub 字段表

| 指标                            | 精度                     | 链上/API 源                                          | 状态                                                  |
| ------------------------------- | ------------------------ | ---------------------------------------------------- | ----------------------------------------------------- |
| 质押总量 TVL                    | AGX 2 + compact；`≈ $` 2 | `StakingPool.poolAgxBalance` × 市场价                | 已接                                                  |
| 总市值                          | `$` 2 + compact          | `circulatingSupply` × 市场价                         | 已接                                                  |
| AGX 流通量                      | AGX 2                    | `sAGX.circulatingSupply`                             | 已接                                                  |
| 智库储备                        | AGX 2 + compact；`≈ $` 2 | `Treasury.totalReserves`（AGX-value · 9dec）× 市场价 | 已接；稿/FAQ 曾写 USD1 — 单位张力，值跟手册 AGX-value |
| AGX 价格                        | `$` **2**                | Pair spot（非 Presale）                              | 已接                                                  |
| 总销毁量                        | AGX 2 + compact          | contribution `getConfig().totalBurned`               | 已接（BurnBond 另路未汇总 → 部分）                    |
| Rebase 收益率                   | `%` 2                    | `epoch` + `sAGX.rebases`（1e18）                     | 已接                                                  |
| 可运行周期                      | —                        | 手册无公式                                           | **缺口** → `runwayUnknown`（`—`）                     |
| 质押地址数                      | 整数                     | API `stake-address-count`（需 session）              | 已接；未登录 → `0`                                    |
| 周期表 日收益 / 加成 / 周期收益 | `0.00%` / `0%`           | 无链上表 view                                        | **缺口**                                              |
| 图 TVL/市值历史                 | `$0.00` / `+0.0%`        | 无 history API                                       | **缺口**（壳保留）                                    |

## 兑换 rail（待续补）

从兑换起逐页补：闪兑 / 交易 / 涡轮 / 销毁 — 报价 `getAmountsOut`、税后净额、历史表金额小数位等。未填前禁止用演示数冒充。

## 变更记录

| 日期       | 变更                                                  |
| ---------- | ----------------------------------------------------- |
| 2026-08-02 | 初版：质押 Hub；价改 Pair spot；compact &lt;1k 补两位 |
