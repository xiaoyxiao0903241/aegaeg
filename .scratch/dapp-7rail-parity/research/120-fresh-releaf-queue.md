# DApp 全页 releaf · 2026-08-02 晚（作废旧 page-done）

> **用户锁定（2026-08-02）：全部 28 页都必须重新从 Figma 拉取**——无一例外；旧 leaf/page-done **一律作废**；**禁止**以既有 scratch / 旧矩阵 / 「大概像」当 SSOT。  
> **每页硬门禁（缺一不可标 page-done）：**  
> 1. 对本页 PC node 现场调用 `get_metadata`（全树 w/h/x/y）  
> 2. 对页帧 + **每一个用户可见最小 leaf** 调用 `get_design_context`（`skillNames=figma-design-to-code`）  
> 3. leaf 文档须写明：**拉取时间、fileKey、nodeId 清单、MCP 拉取证据**（禁止只抄旧表 nodeId）  
> 4. WebBridge 本站实测矩阵 → 修 FAIL → `pnpm check` → commit  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **流程：** [`docs/agents/ui-leaf-parity-workflow.md`](../../../docs/agents/ui-leaf-parity-workflow.md)  
> **基线 commit（本轮起点）：** `671c09f1`

## 强制承认

先前标 PASS 的 leaf 未钻到最小节点（例：`4285:232` tags 错用描边 check；`4518:7174` 错用珊瑚上箭头；空态 Card 误用 outlined border）。**说明 leaf 提取不完整。**

## 队列（PC 产品帧 · node 来自 Figma 直拉 / 本轮核验）

| # | 页 | PC node | Status | 本轮 leaf |
|---|----|---------|--------|-----------|
| 01 | 资产 Hub | `4281:212` | **page-done** | `research/120-assets-hub-fresh-leaf.md` · `58b12163` |
| 02 | 资产·质押仓位 | `4518:5594` | **page-done** | `research/121-assets-stake-pos-fresh-leaf.md` · `b72c13df` |
| 03 | 资产·LP Bond | `4518:5993` | **page-done** | `research/124-assets-lp-bond-fresh-leaf.md` · `5ecc14a8` |
| 04 | 资产·Burn Bond | `4518:6384` | **page-done** | `research/125-assets-burn-bond-fresh-leaf.md` · `9671a26c` |
| 05 | 资产·Xmine | `4518:6775` | **page-done** | `research/126-assets-xmine-fresh-leaf.md` · code `9efc8106` · leaf `7223a6e7` |
| 06 | 兑换 Hub | `4267:212` | **page-done** | `research/122-exchange-hub-fresh-leaf.md` · `6b64a42c` |
| 07 | 闪兑 | `4430:220` | pending | |
| 08 | 交易 | `4433:220` | pending | |
| 09 | Burn | `4434:220` | pending | |
| 10 | Turbine | `4435:220` | pending | |
| 11 | 质押 Hub | `4287:212` | **page-done** | `research/123-staking-hub-fresh-leaf.md` · `5ffdec64` |
| 12 | Stake | `4448:220` | **page-done** | `research/131-staking-stake-fresh-leaf.md` · `9e06f63e` |
| 13 | Bond LP | `4454:220` | **page-done** | `research/132-bond-lp-fresh-leaf.md` · `77af7ce4` |
| 14 | Bond Burn | `4458:220` | **page-done** | `research/133-bond-burn-fresh-leaf.md` · `a664f1f2` |
| 15 | Xmine | `4460:220` | **page-done** | `research/134-staking-xmine-fresh-leaf.md` · `93b10f91` |
| 16 | Calc | `4462:220` | **page-done** | `research/135-staking-calc-fresh-leaf.md` · `c672fdaa` |
| 17 | 奖励 Hub | `4291:212` | **page-done** | `research/136-rewards-hub-fresh-leaf.md` |
| 18 | Lucky | `4390:220` | pending | |
| 19 | 推荐 | `4403:220` | pending | |
| 20 | 参与 | `4407:220` | pending | |
| 21 | 共建 | `4408:220` | pending | |
| 22 | Grant | `4410:220` | pending | |
| 23 | 创世奖 | `4413:220` | pending | |
| 24 | 释放 Hub | `4298:212` | **page-done** | `research/143-release-hub-fresh-leaf.md` · `a664f1f2` |
| 25 | 队列 | `4466:220` | **page-done** | `research/144-release-queue-fresh-leaf.md` · `f11a060e` |
| 26 | 缓冲 | `4469:220` | **page-done** | `research/145-release-buffer-fresh-leaf.md` · `9cb8a214` |
| 27 | 社区 Hub | `4300:212` | **page-done** | `research/146-community-hub-fresh-leaf.md` |
| 28 | 创世 Hub | `4303:212` | **page-done** | `research/147-genesis-hub-fresh-leaf.md` |

**完成定义：** 上表全部 Status=`page-done`（含本轮 Figma 直拉 leaf 表 + 实测矩阵 + Critical=0）后 **通知用户**。
