# DApp releaf 重启队列 · 2026-08-02 晚

> **用户锁定（会话铁律）：**  
> 1. **从 #01 顺序执行**；**每次只做一页**；本页未 `page-done` 禁止开下一页、禁止并行改多页 `src/`。  
> 2. **先 Figma 全量最小 leaf**：本轮 `get_metadata(页帧)` + 对页帧与**每一个**可见最小 leaf 的 `get_design_context`（`skillNames` 含 `figma-design-to-code`）。  
> 3. **清单齐了才能写盘**；leaf 须有拉取时间 · fileKey · 全 nodeId 清单。  
> 4. **测本站 ≠ 拉稿**；WebBridge / `pnpm check` 不能冒充 Figma 拉取。  
> 5. **缺 MCP 证据不许 `page-done`**。  
> 6. **视觉：** 有稿 → 在 guideline 内**尽量对齐 Figma**；稿无/未设计完全的状态（例：资产空态）→ **HTML 原型**为准。  
> 7. **组件：** 优先复用现有 primitive；同 chrome / chart 等**尽量抽取**共用（见 ui-leaf §8.2）。  
> 8. **§8.2a（2026-08-03）：** 已抽且稿面一眼同构的块（如运行机制 `DappProcessSteps`）→ **复用不深钻**；本页独有 chrome 仍全 leaf。  
>
> **流程 SSOT：** [`docs/agents/ui-leaf-parity-workflow.md`](../../../docs/agents/ui-leaf-parity-workflow.md) §0 / §8 · [`implement-checklist.md`](../../../docs/agents/implement-checklist.md)  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **旧文档：** 假 page-done / 旧 fresh leaf **作废**；`manual-coverage/` 仅手册 G-id。  
> **PC node：** 开页时用 `get_metadata` 复核帧名。

## 当前指针

| 项 | 值 |
|----|-----|
| **当前页** | **#24 释放 Hub**（`4298:212` · `#release`） · 机制已复用 `DappProcessSteps` |
| **Status** | `committed`（R7 复审：可 commit；**A5 过期 → 禁 page-done**） |
| **规则** | §2.3a 全量计叶；实现走 Foundation；禁 reuse 折叠独有 chrome；一页一闭环 |

> **队列跳转（用户 2026-08-04）：** 开释放轨 #24–26（Section `4585:634`）；奖励 #17–23 贴稿已交 / gaps §4 已纠 R4a。

## DApp 页面表（28 PC 产品帧）

| # | 轨 | 页 | PC node（待开页复核） | 本站 hash | Status | 本轮 leaf |
|---|----|----|----------------------|-----------|--------|-----------|
| 01 | 兑换 | Hub | `4267:212` | `#exchange` | **page-done** | `research/201-exchange-hub-leaf.md` |
| 02 | 兑换 | 闪兑 | `4430:220` | `#exchange/flash` | **page-done** | `research/202-flash-exchange-leaf.md` |
| 03 | 兑换 | 交易 | `4433:220` | `#exchange/trade` | **page-done** | `research/203-trade-leaf.md` |
| 04 | 兑换 | Burn | `4434:220` | `#exchange/burn` | **page-done** | `research/204-burn-leaf.md` |
| 05 | 兑换 | Turbine | `4435:220` | `#exchange/turbine` | **page-done** | `research/205-turbine-leaf.md` |
| 06 | 资产 | Hub | `4281:212` | `#assets` | **committed**（A5 R=140；gaps 已记；未 page-done；用户跳过收口） | `research/206-assets-hub-leaf.md` |
| 07 | 资产 | 质押仓位 | `4518:5594` | `#assets/stake` | **page-done** `224b788d` | `research/212-assets-stake-leaf.md` |
| 08 | 资产 | LP Bond | `4518:5993` | `#assets/lpbond` | **deferred**（用户：无数据暂缓） | |
| 09 | 资产 | Burn Bond | `4518:6384` | `#assets/burnbond` | **deferred**（用户：无数据暂缓） | |
| 10 | 资产 | Xmine | `4518:6775` | `#assets/xmine` | **deferred**（用户：无数据暂缓） | |
| 11 | 质押 | Hub | `4287:212` | `#staking` | **committed**（A5·check·用户继续子页；未标 page-done） | `research/207-staking-hub-leaf.md` |
| 12 | 质押 | Stake | `4448:220` | `#staking/stake` | **page-done** | `research/208-staking-stake-leaf.md` |
| 13 | 质押 | Bond LP | `4454:220` | `#staking/lpbond` | **page-done** | `research/209-staking-bond-leaf.md` |
| 14 | 质押 | Bond Burn | `4458:220` | `#staking/burnbond` | **page-done** | 同上 |
| 15 | 质押 | Xmine | `4460:220` | `#staking/xmine` | **page-done** | `research/210-staking-xmine-leaf.md` |
| 16 | 质押 | Calc | `4462:220` | `#staking/calc` | **page-done** `947ecfe5` | `research/211-staking-calc-leaf.md` |
| 17 | 奖励 | Hub | `4291:212` | `#rewards` | **page-done**（gaps §4.1；写链 R4a 已纠） | `213-rewards-hub-leaf.md` |
| 18 | 奖励 | Lucky | `4390:220` | `#rewards/lucky` | **page-done** | `215-lucky-leaf.md` |
| 19 | 奖励 | 推荐 | `4403:220` | `#rewards/referral` | **page-done** | `research/216-referral-leaf.md` |
| 20 | 奖励 | 参与 | `4407:220` | `#rewards/participate` | **page-done** | `research/217-participate-leaf.md` |
| 21 | 奖励 | 共建 | `4408:220` | `#rewards/cobuild` | **page-done** | `research/218-cobuild-leaf.md` |
| 22 | 奖励 | Grant | `4410:220` | `#rewards/grant` | **page-done** | `research/219-grant-leaf.md` |
| 23 | 奖励 | 创世奖 | `4413:220` | `#rewards/genesis` | **page-done** | `research/220-genesis-leaf.md` |
| 24 | 释放 | Hub | `4298:212` | `#release` | **committed**（R7 PASS 条件放行；A5 待重测；禁 page-done） | `research/221-release-hub-leaf.md` |
| 25 | 释放 | 队列 | `4466:220` | `#release/queue` | **pre-design** | `research/222-release-queue-leaf.md` |
| 26 | 释放 | 缓冲 | `4469:220` | `#release/buffer` | not-started | |
| 27 | 社区 | Hub | `4300:212` | `#community` | not-started | |
| 28 | 创世 | Hub | `4303:212` | `#genesis` | not-started | |

## 单页硬序

```text
[ ] A0 登记 · 只做本帧 · 停掉其它页任务
[ ] A1 手册逐行
[ ] A2 OpenAPI
[ ] A3 原型 WebBridge（IA；稿缺态以此为准）
[ ] A4 Figma 全最小 leaf · MCP 证据进 leaf
[ ] A5 本站实测（对照 A4；≠拉稿）
[ ] A6–A7 审计 + 尺寸硬禁 + 复用/抽取检查（§8.2）
[ ] ✅ 允许写盘 → 收全部 FAIL
[ ] 再测 · pnpm check · R7
[ ] 用户明示 commit → page-done → 更新本表 → 下一页
```

## 完成定义

上表 28 行全部 `page-done` 后通知用户。
