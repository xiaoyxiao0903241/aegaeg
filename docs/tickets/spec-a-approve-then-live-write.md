# Spec-A：写链编排统一到 `approveThenLiveWrite`

> 标签：`ready-for-agent`  
> 来源：[World-Class Audit Pack](../decisions/world-class-audit-pack.md) §5 Spec-A（P0 #1；测缝随 #15）  
> 状态：**closed（实现已落地，待用户明示 commit）** · 全仓迁移 · 2026-08-08  
> 实现票：[`spec-a-approve-then-live-write/`](./spec-a-approve-then-live-write/)（01–09 done）

## Problem Statement

资产 / 质押等路径已用「预检 → 按需授权 → 实时重读复核 → 写入」同一编排；创世认购、闪兑 / 市价 / 销毁 / Turbine、幸运奖领取等仍手写近似顺序。授权窗口内链上状态可能变化，平行实现靠人工对齐，新路径容易漏「授权后必须再闸」或把额度不足当成硬失败。用户侧表现为：有时该弹授权却直接失败、有时授权后本应阻断却仍点得动，最终链上 revert 或浪费 gas。

## Solution

把「授权后二次门闸写」定为唯一写链编排：域代码只提供读快照、判定、映射错误、可选授权、最终写入；顺序与软阻断（额度不足可先授权）由现有编排统一负责。报价类路径用薄适配接入，不另起第三套「看起来像」的手写序。先补编排契约测与代表域适配，再按票迁移 call site。

## User Stories

1. As a 认购用户, I want 授权 USD1 后系统重新核对阶段与额度, so that 授权等待期间阶段切换时不会误提交。
2. As a 闪兑用户, I want 授权 USDT 后重新读暂停 / 限额 / 汇率, so that 批准窗口内的配置变化能挡住坏单。
3. As a 市价兑换用户, I want 卖出授权后用最新余额与报价再闸, so that placeholder 报价不能驱动上链。
4. As a 销毁兑换用户, I want 补授权后实时复核贡献与可销毁量, so that 不会在余额已变时仍发送。
5. As a Turbine 用户, I want 解锁 / 领取补授权后走同一复核序, so that 与资产领取一样可靠。
6. As a 幸运奖领取用户, I want 提交只钉展示层选出的轮次并对该轮做预检与实时复核, so that 不会用偏小金额假放行贡献闸。
7. As a 共建奖 / 推荐 / 参与领取用户, I want 签名领取后的混合写也服从实时复核, so that 计划档位与贡献在写入前仍成立。
8. As a 已走统一编排的资产用户, I want 行为不变, so that 迁移不回归 Mixed / 赎回 / xmine。
9. As a 质押开仓用户, I want 既有统一编排保持不变, so that Spec-A 不重写已正确路径。
10. As a 债券 zap 用户, I want 既有统一编排保持不变, so that 无无故扩改。
11. As an 代理实现者, I want 额度不足在预检阶段可走授权而实时复核阶段不可软过, so that 不会无限授权循环。
12. As an 代理实现者, I want 非额度类硬阻断在预检直接失败且不发起授权, so that 用户不被无意义签名打扰。
13. As an 代理实现者, I want 有授权步骤时必须声明哪些预检原因可软过, so that 漏配在类型或测试期暴露。
14. As a 审阅者, I want 新写路径禁止第三套手写序, so that 回归只盯一个编排核。
15. As a 测试维护者, I want 编排核已有顺序与软预检单测继续绿, so that 适配层只测域差异。
16. As a 测试维护者, I want 每个迁移域至少一条「预检软过 → 授权 → 实时硬挡 → 不写」行为测, so that 迁移可验收。
17. As a 测试维护者, I want 幸运奖提交测钉「intent 轮与 live 轮不一致则阻断」, so that 假放行不再回归。
18. As a 产品负责人, I want 本切片不改按钮文案与相位文案策略, so that 与已否的 CTA 改文案决策不冲突。
19. As a 产品负责人, I want 展示用倒计时可不改, so that 只动钱路旁路写入序。
20. As a 钱包用户, I want 未知回执锁与提交信封行为不变, so that 禁双提交不因编排迁移被拆掉。
21. As a 异网用户, I want 写就绪与链校验仍在会话层失败, so that 编排迁移不绕过写会话。
22. As a 迁移中的开发者, I want 可按域分票落地, so that 不必一刀切全仓。
23. As a 迁移中的开发者, I want `approveErc20IfNeeded` 可另票迁出兑换袋, so that Spec-A 不绑模块搬家。
24. As a 审计跟进者, I want Pack P0 #1 与 #15 测缝在本 Spec 收口说明里可追踪, so that backlog 账本可更新。
25. As a 失败恢复用户, I want 实时复核失败时看到既有阻断错误而不是静默成功, so that 钱路仍关闭失败。
26. As a 多腿资产领取用户, I want 半成功恢复不在本 Spec 解决, so that 范围不膨胀到 Assets Mixed 半成功 UX。
27. As a Turbine 领取用户, I want 无授权步骤的写路径仍可走「预检 → 实时复核 → 写」（approve 可选）, so that 不硬造授权。
28. As a 闪兑 gAGX 用户, I want 包装方向的授权同样进入统一序, so that pair 差异只在读快照与 write 钩子。
29. As a 代码阅读者, I want 注释说明「为什么必须实时重读」而非黑话堆砌, so that 符合注释规范。
30. As an agent, I want 实现票写明 blocking 边（编排核类型收紧 → 域迁移）, so that 可 blockers-first 开工。

## Implementation Decisions

1. **编排唯一来源**：继续以现有「授权后二次门闸写」为唯一顺序核；禁止再新增平行「手写 pre / approve / live / write」。
2. **域只提供钩子**：各域 submit 负责 `readSnapshot`、`evaluate`、`mapBlockError`、可选 `approve`、`write(live)`；不在域内复制顺序。
3. **软预检**：仅预检阶段允许「额度不足 → 先授权」；实时复核阶段任何阻断都必须失败且不得再授权消除。
4. **类型收紧（本 Spec 内小步）**：有授权步骤时必须同时声明可软过的预检原因（或等价的单一参数），避免漏配导致「永远点不动」或跳过授权；若改签名，先改核与单测，再改 call site。
5. **迁移优先级（建议票序）**：
   - 幸运奖混合领取（已钉轮；收束到编排核，消灭手写双段差异）
   - 创世认购（approve + 购后 live 已存在 → 收进核）
   - 闪兑 USDT / gAGX 包装
   - 市价 / 销毁 / Turbine（经报价提交信封的薄适配，保留「报价仍可提交」断言，但不另起第三序）
6. **薄适配允许**：报价路径可保留「仍可提交 / 最新报价」辅助，但其授权与实时复核必须调用编排核，不得只在注释里声称同序。
7. **已合规路径不动行为**：资产 Mixed / 赎回 / xmine、质押开仓、债券 zap、xmine 质押等已用编排核的路径，本 Spec 默认只加测或不改。
8. **通用 ERC20 授权助手搬家**不阻塞本 Spec：可列后续 Uplift 票；本 Spec 不强制迁目录。
9. **未知回执锁 / 链上写 mutation 信封**保持外层：编排核只管钱路顺序，不管路径锁。
10. **注释**：逻辑层写清「授权窗口内状态可能变，所以必须实时重读」；禁止 latch / SSOT / 同构等黑话堆在注释里。
11. **落盘**：实现过程产出进 `docs/tickets/` 子票；本文件为 Spec SSOT，不复活 `.scratch/` 过程坟。

## Testing Decisions

**测什么（外部行为，不测实现细节）：**

- 编排核：顺序、预检硬失败跳过授权、软预检走授权、实时失败在授权之后、无软配时额度不足硬失败（已有单测须保持）。
- 每个新迁移的 submit：在注入假 `readSnapshot` / `approve` / `write`（或模块级 mock）下，断言「软预检 → 授权调用 → 实时硬挡 → write 未调用」与「双读通过 → write 恰好一次且吃 live 快照」。
- 幸运奖：intent 轮与 live 轮不一致或 live 金额变化导致贡献闸变化时必须阻断。

**测缝（请确认）：**

1. **主缝（已有）**：编排核单元测 — 不扩第二套编排测。
2. **域缝（新增）**：各 `submit*` 对编排契约的行为测（优先最高层 submit，不测 UI hook）。
3. **不做**：整页 RTL、链上 fork 集成、CTA 文案快照。

**先验：** `tests/unit/web3/approve-then-live-write.test.mjs`；资产侧字符串锁 / 源码契约测可作迁移验收参考，但新域优先真行为测而非仅 `assert.match` 源码。

## Out of Scope

- `WriteButtonPhase` / 按钮文案全量同构（Pack #2；文案策略未定）
- Assets Mixed 多腿半成功恢复 UX（Pack #9）
- Lucky 展示 lookback「加载更多」（submit 已钉轮）
- 全站 `useDappHost` 订阅收窄
- 改手册 / API / 链合约
- 授权助手目录搬家（可另票）
- `isLocked` 命名诚实化大改
- Community / home 新域审

## Further Notes

- Pack 全仓指数 7.8；本 Spec 吃掉横切 High「写链编排双轨」，是冲世界级条的主工程债之一。
- 创世阶段块时间门闸、闪兑授权后重读配置、幸运钉轮等正确性补丁已先落地；本 Spec 是把平行序**收回唯一核**，不是从零发明钱路。
- 实现须分票：先类型/核（若需要）→ Lucky → Genesis → Exchange 族；每票可独立合入。
- **测缝确认：** 若你希望主缝改成「只测域 submit、编排核当实现细节不测」，说一声再改 Testing Decisions；默认保留核测 + 域测。
