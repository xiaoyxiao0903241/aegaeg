# Money Path Map

金钱与会话关键路径。单测见下表；e2e 全链路可 weekly，不进 `pnpm check`。

```text
钱包连接 (thirdweb)
    → SIWE 签名 (login-with-wallet)
    → JWT 写入 auth-store
    → sessionReady

读 API ──requestWithSession──→ 401 → invalidateSession
写 API ──requestWithSession──→ 401 → invalidateSession

Swap:  quote → canSubmit → [approve?] → 二次门闸(quote age) → swap → invalidateAfterSwap
Genesis: bind/pause 门闸 → [approve?] → 二次门闸 → purchase → invalidateAfterGenesisPurchase
Claim:  签名 API → 链上 claim → confirm(重试) → success: invalidate
                                      ↘ confirm_failed: 保留 txHash，不乐观清空
```

## 必跑单测（金钱 / 会话）

| 主题 | 文件 |
|------|------|
| 登录分类 / 裸 403 | `classify-login-failure.test.mjs`、`account-banned.test.mjs` |
| Auth 闩锁 / renew | `auth-executor.test.mjs`（machine） |
| Quote 门闸 / approve 后二次门闸 | `react-quality-gates.test.mjs`（`canSubmitQuotedSwap`、`assertQuotedSwapStillSubmittable`） |
| Claim confirm 重试 / 401 | `reward-claim-confirm.test.mjs` |
| Claim `confirm_failed` 不 invalidate | `resolve-reward-claim-outcome.test.mjs` |
| Claim 签名 normalize（snake/camel/精度） | `integration-helpers.test.mjs` |
| Genesis approve 后门闸 | `reward-claim-confirm.test.mjs`（`evaluateGenesisPostApproveGate`） |
| Swap/Claim 错误目录不泄漏 raw | `resolve-contract-error-message.test.mjs`、`resolve-api-user-facing-error.test.mjs` |

## 产品面 vs 链上域（双层，勿整目录 rename）

| UI / 产品 | 链上 / core |
|-----------|-------------|
| Genesis tab / `use-genesis-widget` | `core/presale/*`、`use-presale-*`、query keys `presale*` |
| `submitPurchase` / approve | PreSale write + `evaluateGenesisPostApproveGate` |

## 不变量

1. 读/写 JWT 路径对 401 的处理一致（purge session）。
2. `confirm_failed` 不得当作未领取去清空余额（`shouldInvalidate === false`）。
3. Approve 等待后必须再跑 submit/purchase 门闸（`assertQuotedSwapStillSubmittable` / Genesis post-approve gate）。
4. UI `confirm_failed` status 与 resolver 哨兵 `CLAIM_CONFIRM_SYNC_FAILED` 是两条路径：claim hook 用 status + warning toast，**不**经 `setError(CLAIM_CONFIRM_SYNC_FAILED)`。
5. `genesisPurchaseGate.inFlight` 为模块级单例（跨 tab remount 保活）；勿改成仅 React state。
6. Swap Trade/Flash Provider 按需挂载；离开子视图会丢 quote/submit 本地状态（刻意设计）。
