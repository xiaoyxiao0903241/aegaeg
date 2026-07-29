# Money Path Map

金钱与会话路径（以代码为准）。e2e 全链路可选，不进 `pnpm check`。

```text
钱包连接 (thirdweb)
    → SIWE (login-with-wallet) → JWT (auth-store) → sessionReady

读/写 API ──requestWithSession──→ 401 → invalidateSession

写链：createWriteIntent → preflight → 再读 address/chainId → assert → send
      writeReady = 已连接且 chain === defaultChain

Swap:  quote → canSubmit → [approve?] → live 二次门闸(quote + sellBalance)
       → swap → invalidateAfterExchange
Genesis: bind/pause → [approve?] → live 二次门闸(bind + pause)
       → purchase → invalidateAfterGenesisPurchase
Claim: 签名 API → 链上 claim → confirm → success: invalidate
                              ↘ confirm_failed: 保留 txHash，不乐观清空
Rewards Mixed Lucky: live winner/reward vs pre intent + 贡献/plans → claimRewardMixed → WRITE_PATH.REWARD_CLAIM
Rewards Mixed Dao: 签名额 + live DaoPool AGX solvency/贡献/plans → claimRewardsMixed → REWARD_CLAIM
Rewards simple: Incentive/Market/CommunityFund/RewardClaimer → 签名 claim → REWARD_CLAIM
Staking: bind + AGX bal/allow + quota(/status) → [approve?] → live 重读
       → liquidStake / lockedStake → WRITE_PATH.STAKING
BondZap: bind + USD1 bal/allow + authContracts → [approve?] → live 重读
       → BondHelper zap → WRITE_PATH.BOND_ZAP
Xmine: gAGX bal/allow + miningQuotaOf → [approve?] → live 重读
       → stakeGagxForMining → WRITE_PATH.XMINE
Assets Mixed: live 重读奖励+贡献+plans → claim*Mixed → WRITE_PATH.ASSETS_CLAIM
Assets redeem: live 重读可赎额 → claimPrincipal / redeem / startUnstake → ASSETS_CLAIM
Assets xmine: live pending/warmup → claimReward / startUnstake → ASSETS_CLAIM

Unknown 结果 → WRITE_PATH lock（swap / genesis / reward-claim / staking / bond-zap / xmine / assets-claim），禁立即重提
```

## 关键路径

| 主题                      | 路径                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Write intent / writeReady | `web3/wallet/assert-write-intent.ts` · `use-write-readiness.ts`                          |
| Unknown receipt lock      | `web3/wallet/unknown-receipt-lock.ts`                                                    |
| Swap 门闸                 | `core/exchange/resolve-live-quoted-out.ts` · `views/dapp/exchange/use-exchange-quote.ts` |
| Genesis 二次门闸          | `fetch-live-genesis-post-approve-gate.ts` · `evaluateGenesisPostApproveGate`             |
| Staking / BondZap / Xmine | `core/staking/staking-gates.ts` · `web3/staking/*`                                       |
| Assets Mixed / redeem     | `core/assets/assets-gates.ts` · `views/dapp/assets/submit-assets.ts`                     |
| Rewards Mixed / simple    | `core/rewards/rewards-gates.ts` · `views/dapp/rewards/submit-rewards.ts`                 |
| 写链                      | `web3/wallet/wallet-contract-write.ts`                                                   |

## 必跑单测

| 主题                        | 文件                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Write intent                | `write-intent.test.mjs`                                                              |
| Unknown receipt lock        | `unknown-receipt-lock.test.mjs`                                                      |
| Live post-approve / balance | `live-post-approve-gates.test.mjs`                                                   |
| Quote / unknown 门闸        | `react-quality-gates.test.mjs`                                                       |
| Genesis gate                | `claim-reward-confirm.test.mjs`（`evaluateGenesisPostApproveGate`）                  |
| Claim confirm / 401         | `claim-reward-confirm.test.mjs` · `resolve-claim-reward-outcome.test.mjs`            |
| Rewards Mixed / simple gate | `rewards-gates.test.mjs`                                                             |
| 登录 / 封禁                 | `classify-login-failure.test.mjs` · `account-banned.test.mjs`                        |
| Auth machine                | `auth-executor.test.mjs`                                                             |
| Invalidate / wallet switch  | `query-invalidate.test.mjs`                                                          |
| 错误不泄漏 raw              | `resolve-contract-error-message.test.mjs` · `resolve-api-user-facing-error.test.mjs` |

## 不变量

1. 读/写 JWT 对 401 一致 purge session。
2. `confirm_failed` 不得当未领取清空余额。
3. Approve 后必须 live 重跑 submit/purchase 门闸（勿闭包渲染快照）。
4. 发交易前 address + chain fail-closed（`assertWriteIntentMatches`）。
5. Unknown → `WRITE_PATH` lock；金额变更等显式重置前禁重提。
6. `genesisPurchaseGate.inFlight` 为模块级单例（跨 tab remount 保活）。
7. Trade/Flash Provider 按需挂载（`viewsNeedingProvider`）；离开子视图丢本地 quote/submit 状态。
