# Money Path Map

金钱与会话路径（以代码为准）。e2e 全链路可选，不进 `pnpm check`。

**接线原则（AGENTS §8.0 R4a · 用户锁定 2026-07-31）：** 手册（`frontend-manual` / 本图）**有**写/读与门闸 → **按手册**；手册对该表面**沉默**但本仓曾有可证旧接线 → **按旧码恢复/保持**；二者皆无 → 禁发明，关写并暴露。旧码须 `git`/leaf 可证。

```text
钱包连接 (thirdweb)
    → SIWE (login-with-wallet) → JWT (auth-store) → sessionReady

读/写 API ──requestWithSession──→ 401 → invalidateSession

写链：createWriteIntent → preflight → 再读 address/chainId → assert → send
      writeReady = 已连接且 chain === defaultChain

Swap:  quote → canSubmit → [approve?] → live 二次门闸(quote + sellBalance)
       → swap → invalidateAfterExchange
Genesis: bind/pause → [approve?] → live 二次门闸(bind + pause + 阶段/用户剩余)
       → purchase → invalidateAfterGenesisPurchase
Claim: 签名 API → 链上 claim → confirm → success: invalidate
                              ↘ confirm_failed: 保留 txHash，不乐观清空
Rewards Mixed Lucky: live winner/reward vs pre intent + 贡献/plans → claimRewardMixed → WRITE_PATH.REWARD_CLAIM
Rewards Mixed Dao: 签名额 + live DaoPool AGX solvency/贡献/plans → claimRewardsMixed → REWARD_CLAIM
Rewards simple: Incentive/Market/CommunityFund/RewardClaimer → 签名 claim → REWARD_CLAIM
Staking: bind + migration(isOldAccount) + AGX bal/allow + quota(/status) → [approve?] → live 重读
       → liquidStake / lockedStake → WRITE_PATH.STAKING
BondZap: bind + migration(isOldAccount) + USD1 bal/allow + authContracts → [approve?] → live 重读
       → BondHelper zap → WRITE_PATH.BOND_ZAP
Flash / Trade: 无 referral / migration 写门禁（手册未要求）；quote → canSubmit → [approve?] → live
       → swap（USD1→AGX: `swapExactTokensForTokens`；AGX→USD1: 税折净额报价 + SupportingFee）
       → invalidateAfterExchange
Xmine: gAGX bal/allow + miningQuotaOf → [approve?] → live 重读
       → stakeGagxForMining → WRITE_PATH.XMINE
Assets Mixed: live 重读奖励+贡献+plans → claim*Mixed → WRITE_PATH.ASSETS_CLAIM
Assets redeem: live 重读可赎额 → claimPrincipal / redeem / startUnstake → ASSETS_CLAIM
Assets xmine: live pending/warmup → claimReward / activateWarmup / startUnstake → ASSETS_CLAIM
Release queue: live plan claimable → claimAllVestedRewards → WRITE_PATH.RELEASE_CLAIM + invalidate turbineRoot (EX-U5)
Release buffer: live PRV claimable → claimMany → RELEASE_CLAIM（钱包 AGX）
Referral bind: parentBound precheck → bindReferral → WRITE_PATH.REFERRAL_BIND + invalidateAfterReferralBind

Unknown 结果 → WRITE_PATH lock（含 referral-bind）；同 path 在飞互斥；禁立即重提
```

## §1.4 写按钮态 → 现码

| 手册态             | 现码                                                        |
| ------------------ | ----------------------------------------------------------- |
| need_wallet        | `!walletReady` → Connect promo                              |
| wrong_network      | `!writeReady`（`useWriteReadiness`）                        |
| need_referral      | `evaluateNeedReferral` / gate `notBound` → CTA → community  |
| account_migrated   | `readMigrationStatus.isOldAccount` → gate `accountMigrated` |
| need_allowance     | 既有 approve 流 + live 二次门闸                             |
| unknown            | `WRITE_PATH` lock                                           |
| ready / submitting | `evaluateWriteButtonPhase`（stake/bond 示范）               |

迁移写（申请/激活 §17.4）本轮 **DEFER**；`migrationEnabled=false` → `migrationWritesAllowed=false`。

## 关键路径

| 主题                                   | 路径                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Write intent / writeReady              | `web3/wallet/assert-write-intent.ts` · `use-write-readiness.ts`                                                                                                                                                                                                                                                                                                  |
| Write session（wallet→account/client） | `web3/wallet/require-write-session.ts`（submit 入口；禁第二套 wallet store）                                                                                                                                                                                                                                                                                     |
| §1.4 phase adapter                     | `core/wallet/write-button-phase.ts`                                                                                                                                                                                                                                                                                                                              |
| Referral gate                          | `core/referral/need-referral.ts` · `web3/referral/*`                                                                                                                                                                                                                                                                                                             |
| Migration read / gate                  | `web3/migration/*` · `core/migration/migration-user.ts`                                                                                                                                                                                                                                                                                                          |
| Unknown receipt lock                   | `web3/wallet/unknown-receipt-lock.ts` · `submit-with-unknown-receipt-lock.ts`（**全部** `WRITE_PATH` 写入口须经信封；per-path in-flight 互斥；unknown latch 带 owner——**显式 `clearLock`/刷新**才是解锁通道；信封 success 的 owner clear 仅为配对防御，不能代替解锁；`useChainMutation.isLocked` ≡ busy（latch∨in-flight），历史名非 latch-only；禁手写 `lock`） |
| Approve → live 双读                    | `web3/wallet/approve-then-live-write.ts`（stake/bond/xmine；域仍拥有 evaluate）                                                                                                                                                                                                                                                                                  |
| 提交呈现 / CTA 纯函数                  | `web3/errors/get-error-message.ts` · `web3/errors/error-messages.ts` · `hooks/use-chain-mutation.ts` · `core/wallet/write-cta.ts` · `app/shell/go-bind-referral.ts`                                                                                                                                                                                              |
| 链上展示读（非 L）                     | `hooks/use-chain-query.ts` · `shared/api/query/chain-wallet-query-key.ts` · `core/wallet/chain-query-enabled.ts`                                                                                                                                                                                                                                                 |
| Assets Mixed dual-gate                 | `core/assets/dual-check-mixed-claim.ts`（intent×live；禁自证）                                                                                                                                                                                                                                                                                                   |
| Swap 门闸                              | `core/exchange/live-quoted-out.ts` · `views/dapp/exchange/use-exchange-quote.ts`                                                                                                                                                                                                                                                                                 |
| Genesis 二次门闸                       | `fetch-live-genesis-post-approve.ts` · `evaluateGenesisPostApprove` + `evaluateGenesisPurchaseAmountLive`                                                                                                                                                                                                                                                        |
| Turbine unlock live                    | `evaluateTurbineUnlockLive`（余额+授权+配额+报价）· `submit-turbine-exchange.ts`                                                                                                                                                                                                                                                                                 |
| Turbine claim live                     | `readTurbineIsVested` 后再 `claimCooledGagx`                                                                                                                                                                                                                                                                                                                     |
| Liquid warmup claim                    | `submitLiquidWarmupClaim` live `isWarmupExpired`                                                                                                                                                                                                                                                                                                                 |
| Assets action owner                    | claim/redeem 打开时绑 `owner`；写前 `actionOwnerMatches`；切钱包清空                                                                                                                                                                                                                                                                                             |
| Staking / BondZap / Xmine              | `core/staking/staking-block-reasons.ts` · `web3/staking/*`                                                                                                                                                                                                                                                                                                       |
| Assets Mixed / redeem                  | `core/assets/assets-block-reasons.ts` · `views/dapp/assets/submit-assets.ts`                                                                                                                                                                                                                                                                                     |
| Rewards Mixed / simple                 | `core/rewards/rewards-block-reasons.ts` · `views/dapp/rewards/submit-rewards.ts`                                                                                                                                                                                                                                                                                 |
| Release queue / buffer                 | `core/release/release-block-reasons.ts` · `views/dapp/release/submit-release.ts`                                                                                                                                                                                                                                                                                 |
| 写链                                   | `web3/wallet/wallet-contract-write.ts`                                                                                                                                                                                                                                                                                                                           |

## 必跑单测

| 主题                        | 文件                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Write intent                | `write-intent.test.mjs`                                                                                                                           |
| §1.4 / referral / migration | `write-button-phase.test.mjs` · `need-referral.test.mjs` · `migration-user.test.mjs`                                                              |
| Unknown receipt lock        | `unknown-receipt-lock.test.mjs` · `submit-with-unknown-receipt-lock.test.mjs` · `approve-then-live-write.test.mjs` · `write-cta-helpers.test.mjs` |
| Assets Mixed dual-gate      | `dual-check-mixed-claim.test.mjs`                                                                                                                 |
| Live post-approve / balance | `live-post-approve.test.mjs`                                                                                                                      |
| Live evaluate completeness  | `live-evaluate-completeness.test.mjs` · `migration-root-reads.test.mjs`                                                                           |
| Decision freshness          | `decision-freshness.test.mjs`                                                                                                                     |
| Rail claimable probes       | `rail-claimable-probes.test.mjs`                                                                                                                  |
| Quote / unknown 门闸        | `react-quality-checks.test.mjs`                                                                                                                   |
| Trade AGX 卖税              | `agx-sell-tax.test.mjs` · `fetch-exchange-quote.test.mjs` · `swap-router-abi.test.mjs`                                                            |
| Genesis gate                | `claim-reward-confirm.test.mjs`（`evaluateGenesisPostApprove`）                                                                                   |
| Claim confirm / 401         | `claim-reward-confirm.test.mjs` · `claim-reward-outcome.test.mjs`                                                                                 |
| Rewards Mixed / simple gate | `rewards-block-reasons.test.mjs`                                                                                                                  |
| Release queue / buffer gate | `release-block-reasons.test.mjs`                                                                                                                  |
| 登录 / 封禁                 | `classify-login-failure.test.mjs` · `account-banned.test.mjs`                                                                                     |
| Auth machine                | `auth-executor.test.mjs`                                                                                                                          |
| Invalidate / wallet switch  | `query-invalidate.test.mjs`                                                                                                                       |
| 错误不泄漏 raw              | `contract-error-message.test.mjs` · `api-user-facing-error.test.mjs`                                                                              |

## 不变量

1. 读/写 JWT 对 401 一致 purge session。
2. `confirm_failed` 不得当未领取清空余额。
3. Approve 后必须 live 重跑 submit/purchase 门闸（勿闭包渲染快照）。
4. 发交易前 address + chain fail-closed（`assertWriteIntentMatches`）。
5. Unknown → `WRITE_PATH` lock（owner 配对）；同 path 在飞互斥；金额变更 / 显式 `clearLock` / 刷新等重置前禁重提。`useChainMutation.isLocked` ≡ busy（latch∨in-flight）。
6. `genesisPurchaseBlock.inFlight` 为模块级单例（跨 tab remount 保活）；信封层另有 per-`WRITE_PATH` in-flight。
7. Trade/Flash Provider 按需挂载（`viewsNeedingProvider`）；离开子视图丢本地 quote/submit 状态。
8. **展示 vs 决策**：`keepPreviousData` 仅可画 UI；**balance / allowance / quota / claimable / write CTA / canSubmit** 禁用 placeholder。决策用 `isDecisionFresh` / `decisionBigint`（`core/query/decision-freshness.ts`）；报价轴已有 `liveQuotedOut`。
9. **轨红点 probe ≠ 全表 snapshot**：Turbine `readTurbineHasClaimable` 只 `silencesSize`+`isVested` 短电路；Release `readReleaseHasClaimable` 用 queue 汇总 + vault `claimable` 短电路。
10. **Assets 列表读预算（书面）**：`readStakePositions` / locked `getStakesCount`×`getStake` 为 O(仓位数)，无分页；仓位膨胀前保持现状，分页另票（禁在红点路径复用全表）。

## Unknown 解锁通道

| 路径族                                       | 解锁方式（不发明稿外 CTA）                                                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Exchange / stake / bond / assets claim modal | 金额或选项变更 → 既有 `clearLock`                                                                                                            |
| Genesis                                      | 既有购买流重置 / `clearLock`                                                                                                                 |
| REWARD_CLAIM / RELEASE_CLAIM / xmine         | 目前无稿面「确认后重试」控件；unknown 后 CTA 保持禁用至刷新（刷新清内存 latch）。**产品若补 Figma 解锁文案再接线**，禁止为逻辑单独发明按钮。 |
| REFERRAL_BIND                                | 软失败（校验/冷却）可冷却后重试；**unknown latch** 须刷新或显式 `clearLock`（冷却结束不解 unknown）                                          |

## 跨标签页边界（已知接受）

Latch / in-flight 均为**单标签页内存态**。两标签同时点同一可重复写（swap / stake / purchase）→ 可各自弹钱包并双花；签名类 claim 有链上 salt 幂等兜底。前端原理性无解；最后防线是钱包确认弹窗。勿假装有跨 tab 互斥。
