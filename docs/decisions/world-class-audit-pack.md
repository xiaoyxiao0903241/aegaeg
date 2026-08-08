# 决策：World-Class Audit Pack（全仓汇总）

> 状态：**现行**（Destination 达成 · 待 HITL 确认后开 `/to-spec`）  
> 地图：[全仓世界级审计](./world-class-full-repo-audit-wayfinder.md)  
> 协议：[world-class-audit-protocol.md](./world-class-audit-protocol.md)  
> 汇总票：[WCA-10](../tickets/world-class-audit/wca-10-aggregate-audit-pack.md)  
> 日期：2026-08-08

**结论：** 九域域审已关闭；全仓加权指数 **7.8 / 10**（未达世界级条 ≥9）。**Critical = 0**（计分池）。钱路骨架（intent→preflight→live→assert→send、地址 fail-closed、unknown path lock）整体健全；未达世界级的主因是 **High 工程债**（写编排/CTA/时间 SSOT 同构、热路径、测缝）与大量可执行 **Uplift**。

本地图**不改产品代码**。下一步主流程：`/to-spec` → `/to-tickets` → `/implement`。

---

## 1. 分域记分卡

| 域 | 票 | 域加权 | Crit | High | Uplift | Findings |
|---|---|---|---|---|---|---|
| Auth | WCA-01 | **8.1** | 0 | 2 | 5 | [wca-01-auth.md](../tickets/world-class-audit/findings/wca-01-auth.md) |
| Exchange | WCA-02 | **8.0** | 0 | 2 | 6 | [wca-02-exchange.md](../tickets/world-class-audit/findings/wca-02-exchange.md) |
| Staking | WCA-03 | **7.8** | 0 | 2 | 6 | [wca-03-staking.md](../tickets/world-class-audit/findings/wca-03-staking.md) |
| Assets | WCA-04 | **8.1** | 0 | 2 | 5 | [wca-04-assets.md](../tickets/world-class-audit/findings/wca-04-assets.md) |
| Rewards | WCA-05 | **7.2** | 0 | 4 | 6 | [wca-05-rewards.md](../tickets/world-class-audit/findings/wca-05-rewards.md) |
| Release | WCA-06 | **7.9** | 0 | 2 | 5 | [wca-06-release.md](../tickets/world-class-audit/findings/wca-06-release.md) |
| Genesis | WCA-07 | **7.8** | 0 | 3 | 5 | [wca-07-genesis.md](../tickets/world-class-audit/findings/wca-07-genesis.md) |
| Host/shell | WCA-08 | **7.6** ×0.5 | 0 | 2 | 5 | [wca-08-host-shell.md](../tickets/world-class-audit/findings/wca-08-host-shell.md) |
| Cross-cutting | WCA-09 | **7.9** | 0 | 3 | 5 | [wca-09-cross-cutting.md](../tickets/world-class-audit/findings/wca-09-cross-cutting.md) |

**全仓指数**（协议公式）：  
`(8.1+8.0+7.8+8.1+7.2+7.9+7.8+7.9 + 7.6×0.5) / 8.5 = **7.8**`

无一域达世界级条（单维≥9 且域加权≥9）。最低：Rewards **7.2**；最高：Auth / Assets **8.1**。

---

## 2. Critical backlog

（空）计分池无 Critical。矩阵外因 / 链阻塞见各 findings 附录，不进本表。

---

## 3. High backlog（正确性优先 · 已去重）

横切伞项优先；域 call-site 在伞下标注，避免 to-spec 双开。

> **落地账本（相对本 Pack，截至 Spec-A 全仓迁移）：**  
> 已落地：#1 Spec-A 写链同构（核类型同配 + Lucky/Dao/Genesis/闪兑/市价/销毁/Turbine 均经 `approveThenLiveWrite`）· #3 · #4 · #5 · #6 · #7 · #8 · #10 迁移硬闸 · #11 submit 钉轮 · #12 · #13 深链部分 · #14 · #15 测缝（核测 + call-site 契约测 + Lucky 行为测）。  
> **仍开：** #2 WriteButtonPhase/CTA · #9 Assets Mixed 半成功 · #10 CTA 同构余项 · #11 展示 lookback · #13 全站订阅收窄。

### P0 · 钱路同构（建议第一批 to-spec）

1. **统一写链编排 → `approveThenLiveWrite`（或薄适配）** — WCA-09 — **已落地（Spec-A）**  
   - 覆盖 call-site：Genesis 购买（WCA-07）· Exchange flash/market/burn/turbine 平行序（WCA-02/09）· Rewards Lucky 对齐资产形（WCA-05 Uplift/High）  
2. **`WriteButtonPhase` + 全量 `writeCtaLabel` 覆盖 Exchange / Genesis / 残余路径** — WCA-09 · WCA-02 · WCA-07 · Staking xmine（WCA-03） — **仍开（文案策略待 grill）**  
3. **钱路旁路时间 SSOT：阶段/窗用块 timestamp（展示可留墙钟）** — WCA-09 · WCA-07 — **已落地（创世活跃阶段）**

### P1 · 域正确性 / 门闸

4. **Auth：`sessionReady` 续期尊重 permanent `loginError`；JWT 墙钟过期重派生 + 续期失败重调度** — WCA-01 — **已落地**（含瞬时失败 ≥5s 退避单测）  
5. **Rewards Lucky：live 钉 `roundId`+额；贡献闸按 live 额；禁 intent/live 错配假放行** — WCA-05 — **已落地**  
6. **Rewards：`WRITE_PATH.REWARD_CLAIM` 按领奖族拆锁** — WCA-05 — **已落地**（含 legacy 对称清；mixed 改意图 `clearLock`）  
7. **Exchange 闪兑：approve 后 live 重读 config，禁闭包 `liveConfig`** — WCA-02 — **已落地**  
8. **Release：缓冲双卡勿共享 `totalClaimable` 门闸；领取补迁移旧址预检** — WCA-06 — **已落地**  
9. **Assets Mixed 多腿：半成功恢复 UX + 剩余腿 intent** — WCA-04 — **仍开**  
10. **Staking xmine：迁移硬闸 + WriteButtonPhase 同构** — WCA-03 — **迁移硬闸已落地；CTA 同构仍开**

### P2 · 热路径 / 壳层

11. **Lucky 快照 lookback 热路径（≤1e4 轮×multicall；submit 再双扫）** — WCA-05 — **submit 已钉轮；展示 lookback 仍开**  
12. **Hub `readLatestSagxRebaseRate1e18` N 次 RPC** — WCA-03 — **已落地（缓存）**  
13. **Host：深链 hash 双写剥 `#tab/view`；`useDappHost` 宽订阅收窄** — WCA-08 — **深链已落地；全站收窄仍开**  
14. **Community 展示：`invite_address` 注释与 `displayReferrer` SSOT 对齐** — WCA-05 — **已落地**  
15. **Assets / 各域写路径行为测缝（approveThenLiveWrite 契约）** — WCA-04（及 09 Uplift） — **已落地（随 Spec-A；深度 mock 行为测可继续加）**

---

## 4. Uplift backlog（世界级推进 · 摘要）

完整条目在各 findings「Uplift」栏。跨域主题（正确性之后排期）：

| 主题 | 代表来源 | 预期收益 |
|---|---|---|
| `approveErc20IfNeeded` 迁出 exchange 袋 | WCA-09 | 模块边界 |
| softPre ∪ approve 类型同配 | WCA-09 | 可验证性 |
| Auth 死面删除 / JWT 类型收窄 | WCA-01 | 极简 |
| Rewards `shared.tsx` 深模块拆分 | WCA-05 | 清晰 |
| Genesis 未挂载字段 deletion-first | WCA-07 | YAGNI |
| Host/Foundation 注释纪律与订阅面 | WCA-08 | 壳纯度 |
| 横切 mutation / 墙钟 / multicall 测 | WCA-09 | 测缝 |
| Exchange/Staking/Release 域内 uplift | 02/03/06 | 见各卡 |

---

## 5. 建议 to-spec 切片边界

| 切片 | 纳入 High/主题 | 说明 |
|---|---|---|
| **Spec-A 写链同构** | P0 #1–3 | 横切原语 + Genesis/Exchange/Rewards 适配；先测后迁 |
| **Spec-B Auth 会话时间** | P1 #4 | 可独立合入；触 sessionReady SSOT |
| **Spec-C Rewards Lucky** | P1 #5–6 + P2 #11 | 正确性+性能同根 |
| **Spec-D 域门闸补强** | P1 #7–10 | Exchange/Release/Assets/Staking；可按域拆票 |
| **Spec-E 壳与热路径** | P2 #12–13 | Host + Sagx RPC |
| **Spec-F Uplift 批次** | §4 表 | 不挡钱路；按 ROI 打包 |

Community：**WCA-05 建议毕业后可拆独立域审**（fog 仍保留在地图 Not yet specified，直至 HITL 决定）。

---

## 6. 诚实边界

- 域审由并行子 agent + 父会话补完（WCA-04/07）；深度为「CODE ROOT 抽样 + 矩阵排除 + 钱路/结构重点」，**非**逐文件逐行证明。  
- 矩阵 📘/🚫/手册口径项已排除不计分；未做 prod 链上样本对账。  
- 全仓 7.8 表示「可安全迭代的强基线」，不是「已世界级」。

---

## 7. Destination 检查

- [x] 协议已锁定（含 defect+uplift）  
- [x] 九域 findings 均已链入  
- [x] Critical/High/Uplift backlog 可开 to-spec  
- [ ] **用户确认** Destination 达成并授权 `/to-spec`
