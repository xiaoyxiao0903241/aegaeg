# Money Path Map

金钱与会话路径（以代码为准）。e2e 全链路可选，不进 `pnpm check`。

```text
钱包连接 (thirdweb)
    → SIWE (login-with-wallet) → JWT (auth-store) → sessionReady

读/写 API ──requestWithSession──→ 401 → invalidateSession

写链：createWriteIntent → preflight → 再读 address/chainId → assert → send
      writeReady = 已连接且 chain === defaultChain

Swap:  quote → canSubmit → [approve?] → live 二次门闸(quote + sellBalance)
       → swap → invalidateAfterSwap
Genesis: bind/pause → [approve?] → live 二次门闸(bind + pause)
       → purchase → invalidateAfterGenesisPurchase
Claim: 签名 API → 链上 claim → confirm → success: invalidate
                              ↘ confirm_failed: 保留 txHash，不乐观清空

Unknown 结果 → WRITE_PATH latch（swap / genesis / reward_claim），禁立即重提
```

## 关键路径

| 主题 | 路径 |
|------|------|
| Write intent / writeReady | `web3/wallet/assert-write-intent.ts` · `use-write-readiness.ts` |
| Unknown latch | `web3/wallet/pending-unknown-latch.ts` |
| Swap 门闸 | `core/swap/resolve-live-quoted-out.ts` · `views/dapp/swap/use-swap-quote.ts` |
| Genesis 二次门闸 | `fetch-live-genesis-post-approve-gate.ts` · `evaluateGenesisPostApproveGate` |
| 写链 | `web3/wallet/wallet-contract-write.ts` |

## 必跑单测

| 主题 | 文件 |
|------|------|
| Write intent | `write-intent.test.mjs` |
| Unknown latch | `pending-unknown-latch.test.mjs` |
| Live post-approve / balance | `live-post-approve-gates.test.mjs` |
| Quote / unknown 门闸 | `react-quality-gates.test.mjs` |
| Genesis gate | `reward-claim-confirm.test.mjs`（`evaluateGenesisPostApproveGate`） |
| Claim confirm / 401 | `reward-claim-confirm.test.mjs` · `resolve-reward-claim-outcome.test.mjs` |
| 登录 / 封禁 | `classify-login-failure.test.mjs` · `account-banned.test.mjs` |
| Auth machine | `auth-executor.test.mjs` |
| Invalidate / wallet switch | `query-invalidate.test.mjs` |
| 错误不泄漏 raw | `resolve-contract-error-message.test.mjs` · `resolve-api-user-facing-error.test.mjs` |

## 不变量

1. 读/写 JWT 对 401 一致 purge session。
2. `confirm_failed` 不得当未领取清空余额。
3. Approve 后必须 live 重跑 submit/purchase 门闸（勿闭包渲染快照）。
4. 发交易前 address + chain fail-closed（`assertWriteIntentMatches`）。
5. Unknown → `WRITE_PATH` latch；金额变更等显式重置前禁重提。
6. `genesisPurchaseGate.inFlight` 为模块级单例（跨 tab remount 保活）。
7. Trade/Flash Provider 按需挂载（`viewsNeedingProvider`）；离开子视图丢本地 quote/submit 状态。
