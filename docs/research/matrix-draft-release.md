# Matrix draft — release（`L-`）

> **只读审计草稿** · 供合并入 [`docs/dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md) §4  
> 票：[#10](https://github.com/xiaoyxiao0903241/aegaeg/issues/10) · 锁定：[`dapp-data-coverage-matrix-wayfinder.md`](../decisions/dapp-data-coverage-matrix-wayfinder.md)  
> 填章日：2026-08-08 · **未改业务代码**

## 方法备注（新鲜度）

重读（非 `docs/research` 缓存）：

| 源       | 路径 / 结论要点                                                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 手册 §12 | `docs/onchain-manual/contracts/rewardqueue.md` — 线性释放；claim → **AGX** 进 Turbine；`queuePlans` / `getReleasedRewardsWithPlanIndex` / `claimAllVestedRewards`           |
| 手册 §13 | `aegissplittermanager.md` + `aegissplitter.md` — 原 PrincipalReleaseVault 已删；`createRelease`→Head→`next` 链；`claim`/`claimMany`；token=本金 **AGX** 或 Turbine **gAGX** |
| 集成指南 | `01-frontend-integration-guide.md` 点 6 — 本金/涡轮 gAGX 经 SplitterManager；历史 PRV 凭归档 ABI                                                                            |
| API      | `docs/backend-api/api.md` — `/release-pool/*` amount **标 gAGX**；`/buffer-pool/summary` **仅 AGX**、无 claimable                                                           |
| 审计     | `ui-manual-api-alignment-audit.md` — A-12/C-07 单位；A-16 缓冲可领 API 缺；B-28→C-07；B-29 **closed**（链优先）                                                             |
| 代码     | `src/views/dapp/release/**` · `src/web3/release/{release-read,release-write}.ts` · `submit-release.ts` · `hooks/api/release.ts` · i18n `app/zh.ts` `release.*`              |

**Prod 只读（L-bar）**

- FE 现网 `VITE_BSC_REWARD_QUEUE`=`0x3C7137…` → `token()`=`0x8d0771…`（=`VITE_BSC_AGX`，`symbol=AGX`）；`queuePlanInfo(0).feeRate=2000`（20%）。
- 手册地址表 `RewardQueue`=`0x320feF…` → `token()` 为**另一** AGX 地址（`symbol` 仍为 AGX）。FE 跟 `contracts.ts`/env，不以手册地址表为运行时 SSOT。
- 写路径：代码审阅门闸/刷新；**未**真发交易。

**UI+Code 双扫范围：** Hub dock/detail · Queue dock/detail · Buffer dock/detail · FAQ（hub/queue/buffer）· rail 红点 · 写（queue claim / buffer claim）。

**继承 H：** A/C 可继承；B **重审**（B-28→C-07 仍 open 文案；B-29 closed 现场确认链优先仍成立）。

---

## 判定摘要

| V2     | 约计                                       | 代表                                                                           |
| ------ | ------------------------------------------ | ------------------------------------------------------------------------------ |
| ✅     | 多数读/写接线                              | 链优先 snapshot、claim 双闸、splitter 链+归档 claimMany、税率表跟 `queuePlans` |
| ❌     | 单位 + Hub gAGX 可领槽                     | `units.queue=gAGX`；Hub 缓冲 gAGX「可领取」复用 **总量**                       |
| 部分   | FAQ/机制文案、lifetime API、Hub 进度仅 AGX | 缓冲 FAQ「进钱包」、机制「30 天」、累计领取仅 API                              |
| 待核实 | 手册 RQ 地址 vs FE env                     | 两套 proxy 均 token=AGX，部署是否双轨                                          |
| 不适用 | —                                          | （本表无空控件故意砍能力）                                                     |

---

## 全表（`L-`）

| 行号  | 章节    | 页面/表面     | 数据或动作                  | 读/写   | 权威来源                                                                      | 是否正确接入 | T1归因                        | 继承自      | 证据                                                                      | A/B/C链   | 备注                                             |
| ----- | ------- | ------------- | --------------------------- | ------- | ----------------------------------------------------------------------------- | ------------ | ----------------------------- | ----------- | ------------------------------------------------------------------------- | --------- | ------------------------------------------------ |
| L-001 | release | Hub·释放池卡  | 释放中金额                  | 读      | RewardQueue 聚合 `releasing=total−claimable`；无钱包时 API `releasing_amount` | ✅           | —                             | —           | `use-hub` + `formatReleaseApiOrChainLabel` 链优先；B-29 重审仍成立        | —         | 金额数值格式 4 位                                |
| L-002 | release | Hub·释放池卡  | 「可领取」金额              | 读      | 链 `totalClaimable`；API 派生 `released−claimed`                              | ✅           | —                             | —           | 注释明示勿把累计 `released_amount` 当可领                                 | —         | 标签文案=`可领取`                                |
| L-003 | release | Hub·释放池卡  | 进度 %                      | 读      | 链 claimable/(claimable+releasing) bps                                        | ✅           | —                             | —           | `releaseProgressBps`                                                      | —         |                                                  |
| L-004 | release | Hub·释放池卡  | 单位文案                    | Copy    | 链 `token()`=AGX；稿/i18n `units.queue=gAGX`                                  | ❌           | 文案/单位与链不匹配（稿如此） | C-07 · A-12 | zh `units.queue:'gAGX'`；Prod token=AGX                                   | C-07      | 全释放池 Num 后缀同源                            |
| L-005 | release | Hub·缓冲池卡  | AGX Total（池内剩余）       | 读      | 链 `claimable+releasing`；API `releasing_amount`（=cumulative−released）      | ✅           | —                             | —           | 注释：勿用累计入池作 Total                                                | —         | 与 API 字段名「releasing」语义对齐为「池内剩余」 |
| L-006 | release | Hub·缓冲池卡  | AGX「可领取」               | 读      | 链 `agx.totalClaimable`；**不用** API                                         | ✅           | —                             | A-16        | `apiRaw: undefined`；信链                                                 | A-16      | API 无同口径 claimable                           |
| L-007 | release | Hub·缓冲池卡  | gAGX Total                  | 读      | 链 `gagx.claimable+releasing`                                                 | ✅           | —                             | —           | splitter 多 token 桶；audit「勿当假零」                                   | —         | 未连钱包显示 0                                   |
| L-008 | release | Hub·缓冲池卡  | gAGX「可领取」              | 读      | 链 `gagx.totalClaimable`                                                      | ✅           | —                             | —           | Hub「可领取」绑 `bufferClaimableGagx`；总量大数为 `gagxTotalLabel`        | —         | —                                                |
| L-009 | release | Hub·缓冲池卡  | 进度 %                      | 读      | **仅 AGX** claimable/releasing                                                | 部分         | 设计取舍（故意空/0）          | —           | `bufferPct` 不含 gagx                                                     | —         | 入场卡单一进度；gAGX 细节在子页                  |
| L-010 | release | Hub·Detail    | 税率表周期/税率             | 读      | 链 `queuePlans`；fallback i18n                                                | ✅           | —                             | —           | `taxBps/100`↔手册 feeRate（Prod plan0=2000→20%）                          | —         |                                                  |
| L-011 | release | Hub·Detail    | aboutSlides / purpose       | Copy    | 产品叙事                                                                      | ✅           | —                             | —           | Visible 文案；无动态数                                                    | —         |                                                  |
| L-012 | release | Hub·Detail    | mechanismSteps「6:1」       | Copy    | 贡献 divisor 链=6                                                             | 部分         | 文案/单位与链不匹配（稿如此） | C-06        | 步骤写「6:1」与链一致；「50% 销毁」等属叙事                               | C-06      | 与奖励 Mixed 冲突同源，非本 tab 写路径           |
| L-013 | release | Hub·FAQ       | 「领取的 gAGX 去向」题干    | Copy    | 链到账 AGX→Turbine                                                            | 部分         | 文案/单位与链不匹配（稿如此） | C-07        | 题干写 gAGX；答案已澄清 AGX                                               | C-07      | Visible+FAQ                                      |
| L-014 | release | Queue·Dock    | 各档 claimable / releasing  | 读      | 链 per-plan snapshot                                                          | ✅           | —                             | —           | `readReleaseQueueSnapshot` Multicall                                      | —         | 数字算法对                                       |
| L-015 | release | Queue·Dock    | 单位 + token 图标           | Copy    | token=AGX                                                                     | ❌           | 文案/单位与链不匹配（稿如此） | C-07        | `units.queue` + `gagxIcon`                                                | C-07      | B-28 重审→仍属 C                                 |
| L-016 | release | Queue·Dock    | 进度 % / USD hint           | 读      | 链 + `useAgxPriceUsd`                                                         | ✅           | —                             | —           |                                                                           | —         |                                                  |
| L-017 | release | Queue·Dock    | 领取 CTA 门闸               | 写·门闸 | claimable>0 · writeReady · planIndex≥0 · unknown lock                         | ✅           | —                             | —           | `canClaimWhen` + `releaseClaimBlockReason`                                | —         |                                                  |
| L-018 | release | Queue·Dock    | claim（unlock）             | 写      | `claimAllVestedRewards(planIndex)`                                            | ✅           | —                             | —           | pre→live 双读闸 → write → `invalidateAfterReleaseClaim`（含 turbineRoot） | —         | 不真发；成功 toast「涡轮配额」                   |
| L-019 | release | Queue·Dock    | 单档刷新                    | 写·刷新 | `readReleaseQueuePlanByDays` patch cache                                      | ✅           | —                             | —           | 不整表重拉                                                                | —         |                                                  |
| L-020 | release | Queue·Detail  | 释放中 / 可领取 stats       | 读      | 链优先；API 派生可领                                                          | ✅           | —                             | —           | B-29 重审 OK；图标仍 gagx                                                 | C-07      | 单位 ❌ 见 L-004                                 |
| L-021 | release | Queue·Detail  | 累计从释放池领取            | 读      | API `total_claimed_amount` only                                               | 部分         | 链/手册/API 未提供            | A-12        | 无链上 lifetime view；API 标 gAGX                                         | A-12      | 诚实 0 当无 session                              |
| L-022 | release | Queue·Detail  | 释放池记录表                | 读      | API `/release-pool/logs`                                                      | ✅           | —                             | —           | `mapReleasePoolLogToRow`；金额无单位后缀                                  | A-12      | indexer 空态文案诚实                             |
| L-023 | release | Queue·FAQ     | gAGX 去向                   | Copy    | 链 AGX→Turbine                                                                | 部分         | 文案/单位与链不匹配（稿如此） | C-07        | 题干 gAGX；答案「涡轮配额」未点名 AGX                                     | C-07      |                                                  |
| L-024 | release | Buffer·Dock   | AGX 可领 / 释放中           | 读      | 链 `agx.*`                                                                    | ✅           | —                             | —           | 单位硬编码 `AGX`                                                          | —         |                                                  |
| L-025 | release | Buffer·Dock   | gAGX 可领 / 释放中          | 读      | 链 `gagx.*`                                                                   | ✅           | —                             | —           | 分流器 token 分桶                                                         | —         |                                                  |
| L-026 | release | Buffer·Dock   | intro `{days}`              | 读      | `effectiveDuration` / `DEFAULT_RELEASE_DURATION`                              | ✅           | —                             | —           | `usePrincipalReleaseDurationDays`                                         | —         |                                                  |
| L-027 | release | Buffer·Dock   | 提取 CTA 门闸               | 写·门闸 | `totalClaimable`(AGX+gAGX)                                                    | ✅           | —                             | —           | 双卡共用同一 claim                                                        | —         |                                                  |
| L-028 | release | Buffer·Dock   | claim（redeem/buffer）      | 写      | 各 hop `claimMany` + 归档 PRV `claimMany`                                     | ✅           | —                             | —           | 空窗跳过；每跳后 invalidate；双闸                                         | —         | 非链尾→下游再释放（手册）                        |
| L-029 | release | Buffer·Dock   | 刷新                        | 写·刷新 | refetch buffer snapshot                                                       | ✅           | —                             | —           |                                                                           | —         |                                                  |
| L-030 | release | Buffer·Dock   | claimSuccess 文案           | Copy    | 链尾→钱包；中继→next                                                          | 部分         | 文案/单位与链不匹配（稿如此） | —           | zh：「已提交领取，进入分流器释放」偏中继叙事                              | —         | 优于旧「仅 AGX 进钱包」                          |
| L-031 | release | Buffer·Detail | AGX 累计进入/提取/释放中    | 读      | 链优先；API cumulative/released/releasing                                     | ✅           | —                             | —           |                                                                           | —         |                                                  |
| L-032 | release | Buffer·Detail | gAGX 三元组                 | 读      | 仅链（API 无 gAGX summary）                                                   | ✅           | —                             | —           | 无钱包→0                                                                  | A-16 旁系 |                                                  |
| L-033 | release | Buffer·Detail | 缓冲记录表                  | 读      | API `/buffer-pool/logs`                                                       | ✅           | —                             | —           | `contract_address` 原值；金额无币种后缀                                   | —         |                                                  |
| L-034 | release | Buffer·Detail | mechanismSteps「30 天缓冲」 | Copy    | `effectiveDuration` 可≠30                                                     | 部分         | 文案/单位与链不匹配（稿如此） | —           | intro 已动态天数；步骤仍写死 30                                           | —         |                                                  |
| L-035 | release | Buffer·FAQ    | 「AGX 直接进入钱包」        | Copy    | 仅链尾 `next==0`；且可有 gAGX                                                 | ❌           | 文案/单位与链不匹配（稿如此） | —           | 忽略 next 瀑布与 gAGX 桶                                                  | **新C?**  | 与 L-030 成功文案不一致                          |
| L-036 | release | Buffer·FAQ    | AGX/gAGX 双资产             | Copy    | splitter 多 token                                                             | ✅           | —                             | —           | zh 已写「分流器释放单可为 AGX 或 gAGX」                                   | —         | audit 刻意不记假零                               |
| L-037 | release | Rail 红点     | hasClaimable                | 读      | queue total + splitter pages + archive                                        | ✅           | —                             | —           | `readReleaseHasClaimable` / `use-release-rail-dot`                        | —         | Host 表面，能力属 release                        |
| L-038 | release | 写后刷新      | invalidateAfterReleaseClaim | 写·刷新 | tab keys含 release+turbine+erc20+API                                          | ✅           | —                             | —           | `tab-query-keys.release`                                                  | —         | queue→涡轮配额可见性                             |
| L-039 | release | API 权威      | release-pool summary 币种   | 读      | 文档标 gAGX；链 AGX                                                           | ❌           | 手册或API与链不符             | A-12        | `api.md` 明示 gAGX                                                        | A-12      | FE 有链时不跟错单位语义，但仍用 gAGX **标签**    |
| L-040 | release | API 权威      | buffer-pool 无 claimable    | 读      | 链有 claimableAmount                                                          | 部分         | 链/手册/API 未提供            | A-16        | FE 信链正确                                                               | A-16      | 审计「刻意不记为缺口」对 FE                      |
| L-041 | release | 手册地址      | RewardQueue proxy           | 读      | 手册 `0x320feF…` vs FE `0x3C7137…`                                            | 待核实       | 手册或API与链不符             | —           | 两者 `token()` 均为 AGX（不同实现地址）                                   | **新A?**  | 换手册源拷贝/部署表；FE fail-closed 跟 env       |
| L-042 | release | Code 能力     | `claimVestedReward` 单条    | 写      | 手册有；FE 仅 `claimAll`                                                      | 不适用       | —                             | —           | 产品用按档 claimAll；单条无 UI                                            | Z?        | 反查附录候选                                     |
| L-043 | release | Code 能力     | `claimVestedRewardsInRange` | 写      | 手册有；FE 未暴露                                                             | 不适用       | —                             | —           |                                                                           | Z?        |                                                  |
| L-044 | release | Queue 入队    | enqueueReward               | 写      | 仅 authorized callers                                                         | 不适用       | —                             | —           | 由 staking/rewards/bond 写入；本 tab 只领                                 | —         | unlock 入口在上游 tab                            |

---

## B 重审

| ID   | 原状                       | 本轮                                                   | 结论                            |
| ---- | -------------------------- | ------------------------------------------------------ | ------------------------------- |
| B-28 | migrated→C-07              | 文案/图标仍 gAGX                                       | **保持 C-07**；非可单独改数的 B |
| B-29 | closed（releasing 链优先） | `formatReleaseApiOrChainLabel` / Queue Detail 仍链优先 | **保持 closed**                 |

## 建议新增 A/B/C（勿直接改审计表；供主表合并）

| 建议 ID                 | 类  | Gist                                                                        |
| ----------------------- | --- | --------------------------------------------------------------------------- |
| C-new-buffer-faq-wallet | C   | Buffer FAQ「AGX 直接进钱包」忽略 next 链与 gAGX                             |
| A-new-rq-address-drift  | A   | 手册 `00-addresses` RewardQueue 与 `VITE_BSC_REWARD_QUEUE` 不一致（均 AGX） |

---

## Code 反查候选（→ 正式表 `Z-` 或本表 L-042+）

| 候选                                              | 说明                                         |
| ------------------------------------------------- | -------------------------------------------- |
| `claimVestedReward` / `claimVestedRewardsInRange` | ABI 已解析能力，无 UI                        |
| `readReleaseQueueClaimable`                       | 红点/短读；主 UI 用 snapshot                 |
| 归档 `principalReleaseVault`                      | 已接线 claim；无独立 UI 入口（并入缓冲提取） |

---

## 行数

**主表数据行：44**（L-001…L-044）
