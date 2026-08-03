# 215 · 幸运奖页 A1/A2（只读 Pre-Design）

> **日期：** 2026-08-03 · 模型 `cursor-grok-4.5-high`  
> **队列：** #18 · 页 `#rewards/lucky` · Figma PC `4390:220`  
> **范围：** 子页 **读展示（右栏）+ Mixed 写（左栏）**；Hub 导航见 [`213-rewards-hub-a1a2.md`](./213-rewards-hub-a1a2.md) / gaps §4.1  
> **禁：** 本文件不改 `src/`  
> **SSOT：** `docs/frontend-manual/01-frontend-integration-guide.md` §14 · `docs/frontend-manual/contracts/aegisluckypool.md` · `aegisdailypurchasetracker.md` · `docs/money-path-map.md` · OpenAPI `~/Downloads/新/api-docs.html` · G 册 [`manual-coverage/14-lucky-pool.md`](./manual-coverage/14-lucky-pool.md)

### 本页登记头

| 项 | 值 |
|----|-----|
| 路由 | `#rewards/lucky` |
| Figma | `4390:220`（锁帧 **有** → G-14 原「无锁帧 DEFER」对本页相关条 **升格 MUST**） |
| 左栏写 | `RewardsMixedClaimWidget` + `useRewardsMixedClaimView('lucky')` → `submitLuckyMixedClaim` → `writeLuckyMixedClaim` → `claimRewardMixed` |
| 右栏读 | `RewardsLuckyContent` ← `useRewardsLuckyContentView` ← `POST /lucky-reward/{summary,winners,my-rounds}` |
| 钱路 | money-path **Rewards Mixed Lucky** → `WRITE_PATH.REWARD_CLAIM` |
| 既有 R7 | [`109-r7-rewards-lucky-20260802.md`](./109-r7-rewards-lucky-20260802.md) / 79-post-*（chrome PASS；数据位本票重裁） |

---

## 1. 章节清单（A1）

| 章 / 源 | 用途 | 本页 |
|---------|------|------|
| `01` §14.1 用户抽奖页 | 读方法表 + `claimRewardMixed` + 资格注意 | **逐行 MUST** |
| `01` §14.2 管理抽奖页 | keeper / VRF / deposit / owner | **N/A**（admin） |
| `contracts/aegisluckypool.md` | Round / VRF / `claimRewardMixed` 前提与事件 | 写门闸 + 读语义 |
| `contracts/aegisdailypurchasetracker.md` | 单笔门槛 / `getUserRoundStat` / fail-soft | 资格读源 |
| `money-path-map.md` Rewards Mixed Lucky | live winner/reward + 贡献/plans → claim | 写路径 SSOT |
| G 册 `14-lucky-pool.md` | G-14.* disposition | 原 DEFER「无锁帧」→ **本页 surface 重裁**（下表） |
| Hub A1A2 / gaps §4.1 | Hub 幸运卡可领 = 链 snapshot；summary 禁冒充可领 | 子页继承；不删 Hub 表 |

```
[x] A1 章节清单齐（§14.1 逐行；§14.2 admin；contracts×2；money-path；G-14 重裁）
```

---

## 2. G-id 逐条对照表（手册行 → 现码 / 缺口）

> **裁决规则：** 锁帧 `4390:220` 已有 → 用户可见读/写/门闸相关条 **MUST · surface=`#rewards/lucky`**；管理台保持 `admin`；资格**副作用写入**仍在 stake/bond call site，本页只消费读态与 FAQ 诚实。

### 2.1 §14.1 展示字段 / ABI

| G-id | 手册行（摘要） | disposition（本页） | 现码路径或缺口 |
|------|----------------|---------------------|----------------|
| `G-14.1-T01` | ABI `AegisLuckyPool` + Tracker | **MUST** | `LUCKY_POOL_METHODS` / env `luckyPool`；Tracker ABI 在手册，**本页资格读尚未接 Tracker** |
| `G-14.1-T02` | 地址 key `LuckyPool`, `DailyPurchaseTracker` | **MUST** | `BSC_CONTRACTS.luckyPool` fail-closed；Tracker 地址若未接读则缺口 |
| `G-14.1-T03` | `currentRoundId()` | **MUST** | `readLuckyClaimSnapshot` 读 current，再取 `roundId-1` 作中奖候选轮（claim 用） |
| `G-14.1-T04`/`T05` | `roundCount` / `getRoundIds` | **DEFER→链列表** | 历史列表走 **API** `my-rounds`；链分页 **非本页必接**（API 已覆盖抽奖记录） |
| `G-14.1-T06` | `getRound(roundId)`（含 `endTime` / reward 语义） | **MUST（若稿有倒计时）** | **现码未读 `getRound`** → 倒计时无源；OpenAPI 亦无 countdown 字段 |
| `G-14.1-T07` | `quoteRewardAgx` | **可选展示** | 未接；今日奖池用 API `today_total_prize`（USD）即可，不必链报价 |
| `G-14.1-T08` | `isEligible(roundId,user)` | **MUST** | **未接**；右栏「今日抽奖资格」现 `formatApiDecimalAmount(null)`→**假零 `0.00`** |
| `G-14.1-T09` | Tracker `getUserRoundStat` | **MUST（资格辅助）** | **未接**；可与 T08 二选一或并用（qualified 布尔 / totalAmount） |
| `G-14.1-T10` | `minPurchaseAmount` | **MUST（门槛文案/资格）** | 未接；FAQ 写死 `$5,000`（产品文案；与链门槛应对齐核） |
| `G-14.1-T11` | `trackingSafetyVersion()==3` | **运维/自检** | 本页 UI N/A；写盘前可探针，不挡用户面 |
| `G-14.1-T12`/`T13`/`T14` | pending / deferred / syncState | **可选 CTA** | 手册「可为」重试按钮；**稿无则勿发明**；记缺口 |
| `G-14.1-T15` | `getEligibleUsers` | **N/A 榜单** | 本页开奖表是 **中奖名单** 非全量资格榜 |
| `G-14.1-T16` | `getWinners` | **双源** | 右栏开奖表走 API `winners`（已接）；链 `getWinners` 可作校验备源 |
| `G-14.1-T17` | `getWinnerInfo` | **MUST 写/可领** | `readLuckyClaimSnapshot` **已接**（左栏可领） |
| `G-14.1-T18` | `rewardClaimed` | **MUST** | snapshot **已接** → `claimable` |
| `G-14.1-T19`/`T20` | `rewardReserve` / `reservedRewards` | **admin / 刷新旁路** | 用户页不展示；领取成功后按 N11 刷新语义 |
| `G-14.1-T21` | `claimRewardMixed(...)` | **MUST 写** | `submitLuckyMixedClaim` → `writeLuckyMixedClaim` **已接**（见 §4 R4a） |
| `G-14.1-T22`–`T25` | 资格来源 liquid/locked/bond/restake | **跨页副作用** | 写在 stake/bond；本页 FAQ/资格读消费结果 |

### 2.2 §14.1 注意事项

| G-id | 摘录 | 本页 | 现码 / 缺口 |
|------|------|------|-------------|
| `G-14.1-N01` | 不能 `enterRound` | MUST 守 | 无 enter 写入口 |
| `G-14.1-N02` | 勿直调 `recordPurchase` | MUST 守 | 无 |
| `G-14.1-N03` | 单笔 ≥ min，非累计 | MUST 文案/资格 | FAQ「第一笔≥$5k」≈；须与链 `minPurchaseAmount` 对齐 |
| `G-14.1-N04`–`N05` | upkeep / PurchaseDeferred / fail-soft | 跨页 | 质押成功≠资格保证；本页资格须链/索引诚实 |
| `G-14.1-N06` | Pending → `retryQualification` | 可选 | 稿无按钮 → 勿发明；sync Pending 可诚实提示 |
| `G-14.1-N07`–`N09` | keeper / 空轮 / VRF 选人 | 读语义 | VRF 卡静态文案；空轮 `RoundSkipped` 时 winners 可空 |
| `G-14.1-N10` | 默认 500 USD1 → 锁 AGX | 展示 | API 池 USD × maxWinners；单人奖额链上 AGX |
| `G-14.1-N11` | won && !claimed → 领取；刷新 claimed/贡献/RQ | MUST | CTA 门闸 + `invalidateAfterTeamClaim`（核是否覆盖 lucky/贡献 query） |
| `G-14.1-N12` | 贡献不足 → revert；引导 burn | MUST | Mixed 左栏贡献门闸 + `goBurn` **已有** |
| `G-14.1-N13` | restakeBps / planIndex | MUST | `restakeBpsFromPct` + `matchClaimPlanIndices` **已接** |
| `G-14.1-N14`/`N15` | 迁移旧址不可领；canonical | MUST 门闸 | 依赖全局 migration gate；须确认 lucky submit 路径有 `accountMigrated` |

### 2.3 §14.2 管理

| G-id | disposition |
|------|-------------|
| `G-14.2-T01`…`T10` | **N/A admin**（保持 G 册；非本 app） |

### 2.4 money-path

| 项 | 手册 / map | 现码 |
|----|------------|------|
| Rewards Mixed Lucky | live winner/reward vs pre intent + 贡献/plans → `claimRewardMixed` → `REWARD_CLAIM` | `submitLuckyMixedClaim`：pre `readLuckyClaimSnapshot` + plans + contrib → live 二次读 → `writeLuckyMixedClaim` |
| unknown latch | REWARD_CLAIM 刷新清 latch；无「确认后重试」CTA | 跟 map §1.4 / unknown 表 |

```
[x] A1 G-id 对照齐（本页 MUST 重裁；admin 仍 N/A）
```

---

## 3. OpenAPI 对照 + 接线裁决（A2）

**源：** `~/Downloads/新/api-docs.html` 内嵌 OpenAPI 3.0.3 · tag `lucky-reward（幸运奖）`  
**现码：** `getLuckyRewardSummary` / `Winners` / `MyRounds` · hooks `useLuckyReward*` · `useRewardsLuckyContentView`

### 3.1 Paths

| path | summary | description 要点 | schema 关键字段 |
|------|---------|------------------|-----------------|
| `POST /lucky-reward/summary` | 当前用户幸运奖概览 | `today_total_prize`=今日整池 **USD**（`reward_value_usd1 × max_winners`）；`is_winner`；`win_count` 累计次数；需登录 | `date`, `today_total_prize`, `is_winner`, `win_count` |
| `POST /lucky-reward/winners` | 按日期中奖名单 | 按 `DATE(created_at)`；同日多轮取 **最大 round_id**；`participation_amount`=当日 `sum_invest_usdt`；`reward_amount`=**gAGX**（API 标注）；`draw_tx_hash` | req: `date`；data: `date`, `draw_tx_hash`, `items[]`（rank/address/participation/reward） |
| `POST /lucky-reward/my-rounds` | 我的参与轮（含未中） | eligible JOIN rounds；LEFT winners/claims；分页倒序 | `LuckyRewardMyRoundItem`：date/round_id/participation/is_winner/rank/reward/draw_tx/winner_status/claim_* |

### 3.2 稿面数字位 → 源 / 裁决

| 稿面数字位 | 源 | 单位 / 语义 | 接线裁决 |
|------------|----|-------------|----------|
| 今日奖池 | API `summary.today_total_prize` | **USD** 整池 | **必接线**（现码已接 `formatApiStatLabel`） |
| 倒计时 | 链 `getRound(current).endTime`（手册 T06）；API **无** | 秒 → 剩余时长 | **UI MUST（若稿有）**；钱路/数据：**接链 endTime** 或诚实 `—`；**禁止假倒计时** |
| 资格 | 链 `isEligible` / Tracker `qualified`；API **无**资格布尔给「今日资格」瓦（`is_winner`≠资格） | 布尔 / 达标态 | **必接线链读**；现码 `formatApiDecimalAmount(null)`→`0.00` = **假零 Critical** |
| 累计中奖 | API `summary.win_count` | 次数 int | **必接线**（现码已接） |
| 开奖表 | API `winners`（date←summary.date） | USDT 质押额 + gAGX 奖金（API） | **必接线**（现码已接）；日期 pill 现 disabled → 换日 UX 缺口 |
| 抽奖记录 | API `my-rounds` | 同上 + claim/claim 状态 | **必接线**（现码已接） |
| 可领额 | 链 `getWinnerInfo` + `!rewardClaimed`（**非** summary） | AGX（手册 Mixed）；稿 chrome 或标 gAGX | **必接线**（左栏 snapshot **已接**）；禁用 `today_total_prize` / `win_count` 冒充 |
| 贡献点数 | 链 `userContribution` / `quoteRequiredContribution`（Mixed）；API `agx-contribution/summary` 可选 | 贡献点 | **必接线**（左栏 Mixed **已接**）；右栏无独立贡献瓦 |

### 3.3 单位 / 语义张力

| 张力 | 说明 | 写盘前 |
|------|------|--------|
| API `reward_amount` 标 **gAGX** vs 手册 claim **AGX** | 展示跟 API 标注或跟稿；**写链金额以链 snapshot AGX wei 为准** | 分列 UI 文案 vs 写 |
| `participation_amount` = 日业绩 USDT 快照 | ≠ 单笔达标金额；表列「质押金额」可能与资格单笔语义不完全同构 | 诚实展示 API；勿当资格证明 |
| FAQ「活期不能获资格」vs 手册 `liquidStake` **可记录** | **Critical 产品文案 vs 手册** | 暴露；勿静默改钱路；FAQ 须产品/grilling 或跟手册改文案 |
| 日期 pill disabled | winners 已支持任意 `date`，UI 未开换日 | UX 缺口；非无源 |

```
[x] A2 OpenAPI summary/description/schema 已读；稿面八位对照齐
```

---

## 4. R4a 写入口核

| 项 | 证据 |
|----|------|
| 手册写方法 | §14.1 / contracts：`claimRewardMixed(roundId, releasePlanIndex, restakePlanIndex, restakeBps)` |
| money-path | `Rewards Mixed Lucky` → `WRITE_PATH.REWARD_CLAIM` |
| 旧码可证 | `fb55acf8`（`feat(rewards): six-card hub with signed and Mixed claim paths`）引入 `writeLuckyMixedClaim` → `functionName: 'claimRewardMixed'`；现仍 `src/web3/rewards/rewards-write.ts` + `submitLuckyMixedClaim` |
| 门闸 | pre+live：`readLuckyClaimSnapshot`（paused/won/amount/claimed）+ `readClaimPlans` + `readContributionSnapshot` + `evaluateRewardsMixedClaim` |
| 裁决 | **保持 / 恢复旧码写链**；禁止改签名 claim 或关写；稿面 Mixed chrome 跟既有左栏 |

**禁止：** 用「手册缺 API 可领」拆掉 `claimRewardMixed`；用 summary 池 USD 当可领意图。

---

## 5. UI ∥ 钱路 分列摘要（R5a）

| 面 | UI（跟稿） | 钱路 / 数据（跟手册∩API） |
|----|------------|---------------------------|
| 左栏 Mixed | 可领、需扣贡献、slider、释放/复投 plan、双行 CTA、burn 深链 | `claimRewardMixed` + live 双读；贡献不足 fail-closed |
| 右栏三瓦 | 今日奖池 / 资格 / 累计中奖 | 奖池+累计=API；资格=链（现假零） |
| 倒计时 | 若稿有 → MUST 画 | `getRound.endTime`；无则 `—` |
| VRF 卡 | Chainlink 说明 + 验证教程按钮 | 教程 URL 无源 → disabled 诚实；勿假链接 |
| 开奖表 / 记录 | 表头跟稿；空态 | API winners / my-rounds |
| FAQ | chrome MUST | 活期资格文案与手册冲突 → **不得**用 FAQ 否决 liquidStake 记录；改文案或产品书面杀 |

钱路 PASS **不**关闭资格假零 / FAQ 冲突 FAIL。

---

## 6. gaps 增删建议

### 写入 `docs/dapp-data-gaps.md`（建议新 §4.2；**勿删** Hub §4.1）

| 数据位 | 是否已接 | 源 / 说明 |
|--------|----------|-----------|
| 今日奖池 | 已接 | `POST /lucky-reward/summary` → `today_total_prize`（USD） |
| 累计中奖 | 已接 | 同 → `win_count` |
| 开奖表 | 已接 | `POST /lucky-reward/winners`（date←summary.date）；换日 pill 未开 |
| 抽奖记录 | 已接 | `POST /lucky-reward/my-rounds` |
| 可领额（左） | 已接 | 链 `readLuckyClaimSnapshot`（currentRound−1 + getWinnerInfo + rewardClaimed） |
| 贡献（左 Mixed） | 已接 | `readContributionSnapshot` / required |
| 今日资格 | **假零** | 应接 `isEligible` / Tracker `qualified`；现 `formatApiDecimalAmount(null)`→`0.00`；API 无此瓦字段 |
| 倒计时 | 无源接线 | 链 `getRound.endTime`；API 无；稿有则接链或 `—` |
| 验证教程 URL | 无源 | 按钮 disabled |
| Hub 幸运可领 | （§4.1 已记） | 链 snapshot；**禁** summary 池 USD |

**张力条目（gaps Notes）：**

1. FAQ「活期不能获资格」↔ 手册 §14.1 liquidStake 可记录（Critical 文案）。  
2. API `reward_amount` gAGX 标注 ↔ 链 claim AGX。  
3. G 册 `14-lucky-pool.md` 仍标 DEFER「无锁帧」——**索引滞后**；以本文件本页 MUST 为准（可选后续回写 G 册 disposition，非本任务强制）。

---

## 收口

1. **锁帧已有** → G-14.1 用户面读/写对本页 **MUST**（不再因「无锁帧」DEFER）。  
2. **写入口 R4a PASS**：`claimRewardMixed` 旧码可证（`fb55acf8`）且现码在线。  
3. **读：API 三 path 已接奖池/累计/表**；**资格假零 + 倒计时未接** 为写盘前优先。  
4. **FAQ 活期资格 vs 手册** 为 Critical 产品张力，须暴露后再改文案或保持诚实。
