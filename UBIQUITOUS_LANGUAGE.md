# Ubiquitous Language（AEGIS）

精炼词表。Owner 文件以代码为准。

| 术语 | 含义 | Owner |
|------|------|-------|
| **sessionReady** | 钱包已连接且 JWT 业务登录有效 | `useDappShell` / Auth 派生 |
| **SIWE** | 钱包签名登录消息（含 simple fallback） | `login-with-wallet` |
| **JWT / token** | 业务 API Bearer；按地址缓存在 `auth-store` | `auth-store` + `AuthProvider` |
| **invalidateSession** | 清当前地址会话（如 401） | `AuthProvider` |
| **classifyLoginFailure** | 登录错误纯分类（banned / reject / …） | `core/auth/classify-login-failure` |
| **quote** | 链上/路由报价；placeholder 不得驱动 submit | `canSubmitQuotedSwap` |
| **approve** | ERC20 allowance 授权；可跨分钟 | `*-write.ts` |
| **allowance** | 已授权额度 | 链上读 + query cache |
| **confirm_failed** | 链上 claim 成功但后端 confirm 失败 | `useRewardClaim` / `reward-claim` |
| **unknown**（tx） | pending 超时无回执；禁双提交 | `WalletTransactionWaitError` |
| **DappTab** | genesis / swap / rewards / community | `dapp-tabs` |
| **Flash / Trade** | Swap 子视图；Provider 按需挂载 | `swap-view-store` |
| **Genesis phase** | 预售季；链上 phases + active | presale queries |
| **promo SSOT** | 季/折扣 chrome 派生写入 store | `GenesisPromoSync` |
| **authenticatedMutation** | JWT 写路径；401 → purge | `shared/api/query/fetch-authenticated` |
