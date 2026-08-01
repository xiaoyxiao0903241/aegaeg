# DApp 展示数据缺口与精度 SSOT

> 用户可见数字位：有手册源和/或后端 API → **尽量真读**；二者皆无 → 控件保留、值诚实空（`0`/`0.00` 等），**禁止**抄演示数。  
> **流程锁定（2026-08-02）**：后续每一页 Pre-Design 须对照 **链上手册**（`docs/frontend-manual/`）**与** 后端 OpenAPI（`~/Downloads/新/api-docs.html` 的 summary/description/schema）；见 [`agents/ui-leaf-parity-workflow.md`](./agents/ui-leaf-parity-workflow.md) §2.1b、[`agents/implement-checklist.md`](./agents/implement-checklist.md)。  
> 本表从**质押 Hub**起维护；兑换 / 资产 / 奖励等 tab 按同一列形续补。  
> 实现审计草稿另见 `.scratch/dapp-7rail-parity/research/45-staking-hub-number-audit.md`（研究用，非 docs SSOT）。

## 接线优先级（每页强制）

1. **链上**（`frontend-manual` / contracts）— 协议状态、写门闸、spot 储备等。
2. **后端 API**（OpenAPI）— 用户流水、持仓投影、统计计数等。
3. **仅当 1+2 皆无** → 记本表缺口 + UI 诚实空；禁止未读 API 说明就标「无源」。

协议级指标与用户级流水勿混源（例：Hub TVL ≠ `stake-flow/positions` 用户合计）。

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

> **后端对照**：`~/Downloads/新/api-docs.html`（OpenAPI；已读各 path summary/description/schema）。  
> 已检索：**无** `runway` / `tvl` / `apy` / `yield` / `rebase` / `circulating` / `treasury` / `market_cap` / 协议级历史曲线字段。

| 指标                            | 精度                     | 链上/API 源                                                           | 状态                                    |
| ------------------------------- | ------------------------ | --------------------------------------------------------------------- | --------------------------------------- |
| 质押总量 TVL                    | AGX 2 + compact；`≈ $` 2 | 链上 `StakingPool.poolAgxBalance` × 市场价                            | 已接（API **无**协议 TVL）              |
| 总市值                          | `$` 2 + compact          | 链上流通 × 市场价                                                     | 已接（API **无**）                      |
| AGX 流通量                      | AGX 2                    | 链上 `sAGX.circulatingSupply`                                         | 已接（API **无**）                      |
| 智库储备                        | AGX 2 + compact；`≈ $` 2 | 链上 `Treasury.totalReserves`（AGX-value · 9dec）× 市场价             | 已接；稿/FAQ 曾写 USD1 — 单位张力跟手册 |
| AGX 价格                        | `$` **2**                | Pair spot（非 Presale）                                               | 已接（API **无**价）                    |
| 总销毁量                        | AGX 2 + compact          | 链上 contribution `totalBurned`；API `POST /agx-contribution/summary` | 已接链上；API summary 可作对照          |
| Rebase 收益率                   | `%` 2                    | 链上 `epoch` + `sAGX.rebases`                                         | 已接（API **无**）                      |
| 可运行周期                      | —                        | 手册无公式；**api-docs 无字段**                                       | **缺口** → `runwayUnknown`（`—`）       |
| 质押地址数                      | 整数                     | API `POST /performance/stake-address-count`（需 session）             | 已接；未登录 → `0`                      |
| 周期表 日收益 / 加成 / 周期收益 | `0.00%` / `0%`           | 链上无表 view；**api-docs 无 APY/bonus**                              | **缺口**                                |
| 图 TVL/市值历史                 | `$0.00` / `+0.0%`        | **api-docs 无 history/chart 序列**                                    | **缺口**（壳保留）                      |

### 同文档里有、但不覆盖 Hub 协议格的 API（勿误当成缺口填数）

| 接口                                              | 用途                         | 与 Hub 概览关系             |
| ------------------------------------------------- | ---------------------------- | --------------------------- |
| `POST /stake-flow/positions` · `/stake-flow/logs` | **当前用户**质押持仓 / 流水  | 资产/质押记录页；非协议 TVL |
| `POST /performance/making-overview`               | 用户做市业绩（持仓、小区等） | 奖励/做市，非 Hub 九宫格    |
| `POST /bond-flow/*` · `/x0-mining/*`              | 用户债券 / X 挖矿流水        | 子页记录                    |

## 兑换 rail（待续补）

从兑换起逐页补：闪兑 / 交易 / 涡轮 / 销毁 — 报价 `getAmountsOut`、税后净额、历史表金额小数位等；**每页仍须走 §「接线优先级」**。未填前禁止用演示数冒充。

## 变更记录

| 日期       | 变更                                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-02 | 流程锁定：后续页强制手册+OpenAPI 双对照、尽量接线；写入 AGENTS / ui-leaf §2.1b / implement-checklist                         |
| 2026-08-02 | 对照 `api-docs.html` 全文说明：确认 runway / 周期表 APY / 图历史仍无后端字段；补 stake-flow 等「有 API 但非 Hub 协议格」分表 |
| 2026-08-02 | 初版：质押 Hub；价改 Pair spot；compact &lt;1k 补两位                                                                        |
