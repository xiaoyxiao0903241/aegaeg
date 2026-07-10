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
| Quote 门闸 | `react-quality-gates.test.mjs`（`canSubmitQuotedSwap`） |
| Claim confirm 重试 / 401 | `reward-claim-confirm.test.mjs` |
| Genesis approve 后门闸 | 同上（`evaluateGenesisPostApproveGate`） |

## 不变量

1. 读/写 JWT 路径对 401 的处理一致（purge session）。
2. `confirm_failed` 不得当作未领取去清空余额。
3. Approve 等待后必须再跑 submit/purchase 门闸。
