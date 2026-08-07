# Matrix draft — genesis（共建 / 预售）`GN-`

> 只读草稿 · 2026-08-08 · **未**并入 [`docs/dapp-data-coverage-matrix.md`](../dapp-data-coverage-matrix.md)  
> Ticket 指针：[#14](https://github.com/xiaoyxiao0903241/aegaeg/issues/14) · Map [#3](https://github.com/xiaoyxiao0903241/aegaeg/issues/3)  
> 判定 **V2** · 归因 **T1** · 继承 **H**（A/C=`inherit`；B 读/写/刷新=`recheck-B`）  
> 范围：产品轨 `genesis`（`src/views/dapp/genesis/` + `src/core/presale/*` + `src/web3/presale/*`）。**勿**与 `rewards/genesis`（创世共建**团队奖**领取）混淆。  
> Complete-known：允许 `待核实`（须原因/下一步）。无业务代码改动。

---

## 1. 方法笔记（新鲜度）

本轮**现场重读**（不以 `docs/research/*` 索引作结论缓存）：

| 源             | 路径 / 锚点                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 新手册流程     | `docs/onchain-manual/01-frontend-integration-guide.md` §6 预售                                                                                                    |
| 新手册合约     | `contracts/presale.md` · `contracts/reward.md`（领奖边界）                                                                                                        |
| Legacy（缺口） | `docs/onchain-manual-legacy.md` §3 创世预售 · §4 团队奖励领取                                                                                                     |
| 审计 / H       | `docs/ui-manual-api-alignment-audit.md`（C-10/11/12）· `docs/research/abc-inheritance-index-for-coverage-matrix.md`（B-42 closed → recheck）                      |
| 代码根         | `src/views/dapp/genesis/**` · `src/core/presale/**` · `src/web3/presale/**` · `GenesisPromoSync`（host，供季节文案）                                              |
| API            | 一期 `POST /sales/logs`（贡献表）；团队奖 `/team-reward/*` · `/claim/team-reward` → **rewards** 章                                                                |
| Prod 只读（L） | BSC `PreSale` `0x469a…a0c1`：`paused=false` · `getPhaseCount=0` · `totalPurchasedAmount=0` · `AIRDROP_THRESHOLD=5000e18` · `agxPrice=55e18`。写路径**未**发交易。 |

盘点：UI+Code 双扫；动态位 = Num+Copy（Visible+FAQ）；读=字段级；写=动作级（门闸 / approve 后 live 重闸 / 成功后刷新）。

---

## 2. 主表（`GN-`）

| 行号   | 章节    | 页面/表面         | 数据或动作                                                                                             | 读/写     | 权威来源                                 | 是否正确接入 | T1归因                        | 继承自           | 证据                                                                                                     | A/B/C链 | 备注                                                |
| ------ | ------- | ----------------- | ------------------------------------------------------------------------------------------------------ | --------- | ---------------------------------------- | ------------ | ----------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------- |
| GN-001 | genesis | Dock·季卡轮播     | 全部 `phases()`（名/状态 LIVE·Ended·Upcoming）                                                         | 读        | 手册 §6.3 `getPhaseCount`+`phases`       | ✅           | —                             | —                | `readAllPresalePhases` → `seasonOptionsFromPhases` → `GenesisSeasonCarousel`                             | —       | Prod 现 `phaseCount=0` → 骨架；接线仍正确           |
| GN-002 | genesis | Dock·季卡         | 阶段折扣 `%`（`discount` bps）                                                                         | 读        | `phases.discount`                        | ✅           | —                             | —                | `SeasonCard` meta + dock intro `{discount}` via promo store                                              | —       |                                                     |
| GN-003 | genesis | Dock·季卡         | 阶段空投比例 `airdropValueRatio`                                                                       | 读        | `phases.airdropValueRatio`               | ✅           | —                             | —                | `desktopMeta.airdrop` `+N%` / `—`                                                                        | —       |                                                     |
| GN-004 | genesis | Dock·季卡         | 阶段起止日期                                                                                           | 读        | `startTime`/`endTime`                    | ✅           | —                             | —                | `formatPhaseDateRange` → 季卡 `date`                                                                     | —       |                                                     |
| GN-005 | genesis | Dock·季卡         | 折后参考价 `≈ $x`（`agxPrice×(1−discount)`）                                                           | 读        | `agxPrice()` + discount                  | ❌           | FE 缺接线                     | —                | `seasonOptions.price` 已算，但 `SeasonCard` **不渲染** `price`                                           | —       | Code 有、UI 无                                      |
| GN-006 | genesis | Dock 字幕         | 进行中期号 + 折扣 intro                                                                                | 读        | 活动阶段 + discount                      | ✅           | —                             | —                | `formatGenesisSeasonIntro` / `introEnded`                                                                | —       | 数据来自 `GenesisPromoSync` store                   |
| GN-007 | genesis | Dock·份额标签     | 1 份 = `minAmount` USD1；最大份数                                                                      | 读        | `minAmount` + 剩余额度/余额              | ✅           | —                             | —                | `sharePriceWei`=`minAmount`；`genesisMaxShares`；`interpolate(shares)`                                   | —       | 步进与 `BASE_UNIT=100e18` 一致时份数×min 为合法金额 |
| GN-008 | genesis | Dock·清单         | 「本期共建额度」min–max                                                                                | 读        | `minAmount`/`maxAmount`                  | ✅           | —                             | —                | `quotaLabel`                                                                                             | —       |                                                     |
| GN-009 | genesis | Dock·清单         | 「支付」USD1 金额                                                                                      | 读        | shares × minAmount                       | ✅           | —                             | —                | `payUsd1Label` `N USD1`                                                                                  | —       |                                                     |
| GN-010 | genesis | Dock·清单         | 「将获得 AGX」估算                                                                                     | 读        | 手册 AGX 公式（展示估算）                | 部分         | FE 读源/算法/门闸/刷新错误    | —                | `estimateAgxFromUsd1` 浮点；链记账 `amount*1e9/discountPrice`（AGX 9 decimals）未对拍事件/`userTotalAgx` | —       | 展示用；Prod 无阶段未做数值 L 核实                  |
| GN-011 | genesis | Dock·清单         | 「认购价值」USD                                                                                        | 读        | 产品公式（手册无同名字段）               | 部分         | 设计取舍（故意空/0）          | —                | `estimateContributionValueUsd` = `amount/(1−discount)`，非链 getter                                      | —       | 与链 `agxAmount` 不同义                             |
| GN-012 | genesis | Dock·清单         | 「将获得 X 初始空投价值」                                                                              | 读        | `previewAirdropValue`                    | ✅           | —                             | —                | `usePresalePreviewAirdropValueQuery` → `addedAirdropValue`                                               | —       | 金额 0 时显 `$0`（注释明示）                        |
| GN-013 | genesis | Dock·空投 hint    | 门槛文案「单期累计 ≥ {threshold}」                                                                     | 读·Copy   | `AIRDROP_THRESHOLD` + i18n               | ✅           | —                             | recheck-B ← B-42 | `airdropThresholdLoading`/`null` → hint 用 `—`；FAQ 同                                                   | B-42    | B-42 closed：loading 不再冒充 `$0`                  |
| GN-014 | genesis | Dock·空投门槛数值 | `AIRDROP_THRESHOLD`                                                                                    | 读        | 手册 / legacy 5000U                      | ✅           | —                             | —                | Prod cast = `5000e18`；`presaleAirdropThresholdToUsd`                                                    | —       | L 已核实常量                                        |
| GN-015 | genesis | Detail·全球卡     | `totalPurchasedAmount`                                                                                 | 读        | 手册 §6.3                                | ✅           | —                             | —                | `usePresaleTotalPurchasedQuery`；loading Skeleton                                                        | —       | Prod = 0（无阶段）                                  |
| GN-016 | genesis | Detail·进度头     | 「本期共建」`userPhaseAmountCurrent` / 上限                                                            | 读        | `getUserPhaseRemainingAmount`            | ✅           | —                             | —                | `seasonContributedUsd` / `seasonContributionMaxWei`（limit>0?limit:maxAmount）                           | —       | 须钱包；迁移 root 见 GN-034                         |
| GN-017 | genesis | Detail·页脚       | 「累计共建」`userTotalAmount`                                                                          | 读        | `userTotalAmount(root)`                  | ✅           | —                             | —                | `usePresaleUserTotalQuery` → footer `$`                                                                  | —       |                                                     |
| GN-018 | genesis | Detail·贡献表     | `/sales/logs` 分页行                                                                                   | 读        | API 一期 sales                           | ✅           | —                             | —                | `useSalesLogs` + `sessionReady`；未登录 Auth 槽                                                          | —       | 连接≠登录门闩正确                                   |
| GN-019 | genesis | Detail·贡献表     | 行内「预计 AGX」                                                                                       | 读        | API `tokens` 或 FE 回退估算              | 部分         | FE 读源/算法/门闸/刷新错误    | —                | `formatSalesLogAgx`：优先 `item.tokens`，否则 `estimateAgxFromUsd1`                                      | —       | 非链 `userTotalAgx`/`Purchased.agxAmount`           |
| GN-020 | genesis | Detail·贡献表     | 行内折扣                                                                                               | 读        | 链 `phases[phase_id].discount`           | ✅           | —                             | —                | `phaseDiscountBps` + `formatDiscountBps`                                                                 | —       |                                                     |
| GN-021 | genesis | Detail·同步 hint  | 链有累计、API 空表                                                                                     | 读        | 产品同步态                               | ✅           | —                             | —                | `userTotal>0 && rows==0` → `contributionsSyncPending`；购后 `pollGenesisContributions`                   | —       |                                                     |
| GN-022 | genesis | FAQ               | `{phaseCount}` / `{discounts}` / `{phaseQuotas}` / `{minUsd}` / `{shareIncrement}` / `{airdropRatios}` | 读·Copy   | 链 phases                                | ✅           | —                             | —                | `genesisFaqTemplateValues`                                                                               | —       | `phaseDurationDays` 已算但 FAQ 文案未用（见 Z）     |
| GN-023 | genesis | FAQ               | 空投资格「单账户累计」vs 链/hint「单期累计」                                                           | Copy      | 手册：单档累计超门槛                     | ❌           | 文案/单位与链不匹配（稿如此） | C-10             | zh FAQ「单账户累计」；hint「单期累计」；链 per-phase                                                     | C-10    | inherit                                             |
| GN-024 | genesis | FAQ               | 「X 空投 12 月线性释放 / 合约自动」                                                                    | Copy      | 新手册：无 `claimAirdrop`；仅价值统计    | ❌           | 链/手册/API 未提供            | C-11             | FAQ 承诺释放机制；`presale.md` 明确无领取入口                                                            | C-11    | inherit                                             |
| GN-025 | genesis | FAQ / errors      | 「100 USD」倍数文案                                                                                    | Copy      | `BASE_UNIT=100e18` **USD1**              | ❌           | 文案/单位与链不匹配（稿如此） | C-12             | `errors.invalidAmount`「100 USD」；份额标签已写 USD1                                                     | C-12    | inherit                                             |
| GN-026 | genesis | FAQ               | 「AGX 540 天释放周期」                                                                                 | Copy      | 手册：purchase 不转入钱包 AGX            | ❌           | 链/手册/API 未提供            | —                | 无 Genesis 侧释放/领取接线；与 EarlyStaking/释放池分章                                                   | —       | 建议新 C（见 §4）                                   |
| GN-027 | genesis | Dock              | 阶段倒计时 Num（starts/ends）                                                                          | 读        | `startTime`/`endTime`                    | ❌           | FE 缺接线                     | —                | `useGenesisCountdownClock` 写入 session，**无 UI 消费**；i18n 有 `startsIn`/`endsIn`/`statsTitle`        | —       | 仅用于跨期 `invalidateAfterGenesisPhaseTransition`  |
| GN-028 | genesis | Dock              | AGX 开盘参考价展示                                                                                     | 读        | `agxPrice()`                             | ❌           | FE 缺接线                     | —                | `referencePriceLabel` 已组装；i18n `referencePrice`；Dock 未渲染。Prod `agxPrice=$55`                    | —       | 季卡 `price` 亦未渲染（GN-005）                     |
| GN-029 | genesis | Dock              | USD1 余额展示                                                                                          | 读        | ERC20 `balanceOf`                        | ❌           | FE 缺接线                     | —                | `usd1Balance` 参与 `maxShares`/门闸；`usd1BalanceLabel` 无 UI                                            | —       |                                                     |
| GN-030 | genesis | Dock              | `paused()` 门闸                                                                                        | 读        | 手册 §6.4                                | ✅           | —                             | —                | `isPaused`/`isPausedUnknown` → `canPurchase` false；购前 live 重读                                       | —       | Prod `paused=false`                                 |
| GN-031 | genesis | Dock CTA          | 推荐未绑定 → 去绑定                                                                                    | 读·写门闸 | `isBindReferral` / `PreSaleUserNotBound` | ✅           | —                             | —                | `needsReferralBind` 换 CTA；mutation 亦拦                                                                | —       | 绑定本身在 community/host                           |
| GN-032 | genesis | Dock CTA          | 程序结束 / 即将开始                                                                                    | 读        | phases 全结束或仅 Upcoming               | ✅           | —                             | —                | `isGenesisProgramEnded`；`seasonUpcoming` label                                                          | —       |                                                     |
| GN-033 | genesis | 写·授权           | `approve(USD1→PreSale)`                                                                                | 写        | 手册 §6.4                                | ✅           | —                             | —                | `approveUsd1ForPresaleIfNeeded` 合入购买 mutation                                                        | —       | 无独立 Approve 按钮（合批）                         |
| GN-034 | genesis | 写·购买           | `purchase(phaseIndex,amount)`                                                                          | 写        | 手册 §6.4                                | ✅           | —                             | —                | `purchasePresale`；`WRITE_PATH.GENESIS`；前置 bound/paused/active/额度                                   | —       | 未真发交易 → 运行时 L 待核实                        |
| GN-035 | genesis | 写·approve 后重闸 | live：bound / paused / phase+user remaining                                                            | 写门闸    | AGENTS 写链 + 手册                       | ✅           | —                             | —                | `fetchLiveGenesisPostApprove` + balance/allowance 重读                                                   | —       |                                                     |
| GN-036 | genesis | 写·成功后刷新     | 链查询 + sales 轮询                                                                                    | 写刷新    | 手册成功后刷新表                         | ✅           | —                             | —                | `invalidateAfterGenesisPurchase` 乐观累加 + `pollGenesisContributions`；toast 后 `invalidateGenesisPage` | —       |                                                     |
| GN-037 | genesis | 读·迁移           | 额度/累计按 migration root                                                                             | 读        | 手册 presale 迁移段 · §17                | ✅           | —                             | —                | `readMigratedFrom` + `migrationStakeRoot` 于 `userTotal`/`getUserPhaseRemainingAmount`                   | —       |                                                     |
| GN-038 | genesis | 面板              | `userPhaseAirdropValue` / `userTotalAirdropValue`                                                      | 读        | legacy §3.8 建议展示                     | ❌           | FE 缺接线                     | —                | 仅有本次 `preview`；无累计空投价值面板                                                                   | —       | 手册建议；稿面亦未见                                |
| GN-039 | genesis | 面板              | `userTotalAgx` 累计应得 AGX                                                                            | 读        | 手册常用查询                             | ❌           | FE 缺接线                     | —                | 仅有当笔/行估算；无链累计 AGX 读数 UI                                                                    | —       |                                                     |
| GN-040 | genesis | 边界              | 团队奖签名领取                                                                                         | 写        | `RewardClaimer.claimReward` + API        | 不适用       | —                             | —                | UI 在 `rewards/genesis`；`invalidateAfterTeamClaim`                                                      | —       | 归 **W-** 章；勿双计                                |
| GN-041 | genesis | 边界              | `claimAirdrop` 用户领取                                                                                | 读/写     | 新手册明确无入口                         | ✅           | —                             | —                | FE 未实现 claimAirdrop（正确）                                                                           | —       | 与 GN-024 FAQ 承诺冲突在 Copy 层                    |
| GN-042 | genesis | 空态 FAQ          | `phases.length===0` 时 FAQ 插值                                                                        | Copy      | —                                        | 部分         | 设计取舍（故意空/0）          | —                | `ZERO_FAQ`：`phaseCount=0`、`minUsd=$0` 等；门槛为 `—`                                                   | —       | Prod 当前即无阶段；易被读成「最低 $0」              |
| GN-043 | genesis | Host 角标（交叉） | rail/community 季号折扣 chrome                                                                         | 读        | 同 phases/agxPrice                       | ✅           | —                             | —                | `useGenesisPromoChrome`；**主责 host**，本行仅交叉证明同源                                               | —       | 不占 host 章行号                                    |

**行数：43**（GN-001…GN-043）

---

## 3. Code 反查附录候选（建议 `Z-`）

主表 UI 无对应展示、但代码/ABI 仍有 call site：

| 建议    | 符号 / 能力                                                                                        | 说明                                                                      |
| ------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Z-GN-01 | `countdown` / `countdownMode`                                                                      | session 暴露；仅驱动跨期 invalidate                                       |
| Z-GN-02 | `referencePriceLabel` · season `price`                                                             | 已算未渲                                                                  |
| Z-GN-03 | `usd1BalanceLabel`                                                                                 | 余额只进门闸                                                              |
| Z-GN-04 | `phaseDurationDays` FAQ 插值键                                                                     | `genesisFaqTemplateValues` 产出，FAQ items 未引用                         |
| Z-GN-05 | `quotePhaseAirdropValue` / `userPhaseAirdropValue` / `userTotalAirdropValue` / `totalAirdropValue` | ABI/legacy 有；FE 未读展示                                                |
| Z-GN-06 | `userTotalAgx` / `totalAllocatedAgx` / `hasPurchased`                                              | 只读能力未接线 UI                                                         |
| Z-GN-07 | `getPhaseRemainingAmount`                                                                          | FE 改用 `getUserPhaseRemainingAmount`（更完整）——非缺陷，记「有能力未用」 |
| Z-GN-08 | i18n `statsTitle` / `discountRatio` / `startsIn` / `endsIn` / `referencePrice`                     | 文案库存，无组件引用                                                      |

---

## 4. 建议新增 A/B/C（仅提案，不改审计正文）

| 提案 | 类型              | Gist                                                                                         |
| ---- | ----------------- | -------------------------------------------------------------------------------------------- |
| C-xx | C                 | Genesis FAQ「AGX 540 天释放」无本轨/手册领取或释放入口（与 C-11 并列的产品承诺）             |
| B-xx | B（若产品要显示） | Dock 倒计时 / 参考价 / USD1 余额 / 季卡折后价 — 数据已备、UI 未接（对应 GN-005/027/028/029） |
| —    | 非新号            | C-10/11/12 仍 open → 矩阵已 `inherit`；B-42 已 closed，本轮 recheck 通过（GN-013）           |

---

## 5. 顶层 ❌ / 部分（摘要）

| V2   | 行                 | 一句话                                            |
| ---- | ------------------ | ------------------------------------------------- |
| ❌   | GN-023 ← C-10      | FAQ「单账户」vs 链/hint「单期」                   |
| ❌   | GN-024 ← C-11      | FAQ 空投线性释放无合约入口                        |
| ❌   | GN-025 ← C-12      | 「100 USD」vs 标的 USD1                           |
| ❌   | GN-026             | FAQ AGX 540 天释放无本轨支撑                      |
| ❌   | GN-027/028/029/005 | 倒计时 / 参考价 / 余额 / 季卡价 — FE 算而未展示   |
| ❌   | GN-038/039         | 累计空投价值 / 累计 AGX 链字段未展示              |
| 部分 | GN-010/019         | AGX 数为 FE 估算，非链 `agxAmount`/`userTotalAgx` |
| 部分 | GN-011             | 「认购价值」为产品公式，手册无 SSOT               |
| 部分 | GN-042             | 无阶段时 FAQ 回落 `$0` 易误解                     |

**购买写路径（GN-033…036）代码门闸完整 → ✅**；金钱 Prod 仅核实公共常量/总额（阶段未配置），用户购后数值仍 **待核实**（需有阶段 + 只读对拍或受控 e2e）。
