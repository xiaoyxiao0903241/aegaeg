# Ubiquitous Language（AEGIS）

业务词表。代码标识符优先用本表；工程实现细节不进对外 API 名。Owner 以代码为准。

## 登录与会话

| 业务术语         | 代码名                 | 含义                                 | Owner                              |
| ---------------- | ---------------------- | ------------------------------------ | ---------------------------------- |
| **业务已登录**   | `sessionReady`         | 钱包已连接且当前地址 JWT 有效        | `useAuth` / `useDappShell`         |
| **需要签名登录** | `needsSignIn`          | 钱包已连但尚无有效会话               | `useAuth`                          |
| **钱包签名登录** | SIWE / `login`         | 签名换 JWT（含 simple fallback）     | `login-with-wallet`                |
| **会话令牌**     | `token` / JWT          | 业务 API Bearer；按地址缓存          | `auth-store` + `AuthProvider`      |
| **清会话**       | `invalidateSession`    | 清当前地址会话（如 401）             | `AuthProvider`                     |
| **登录失败分类** | `classifyLoginFailure` | banned / reject / …                  | `core/auth/classify-login-failure` |
| **带会话请求**   | `requestWithSession`   | 读/写 API；401 → `invalidateSession` | `shared/api/query/session-request` |

> 禁止用 `isAuthenticated` 作 UI/对外同义词；状态机 `AuthState.kind` 用 `sessionReady`。

## 产品面与链上域

| 业务术语       | 代码名                        | 含义                                            | Owner                           |
| -------------- | ----------------------------- | ----------------------------------------------- | ------------------------------- |
| **Genesis**    | `genesis`（Tab / UI）         | 产品面：共建认购                                | `dapp-tabs` / genesis views     |
| **预售合约域** | `presale`（core / queries）   | 链上 PreSale 读写作；**不**整目录改名为 genesis | `core/presale`、`use-presale-*` |
| **认购**       | `purchase` / `submitPurchase` | 链上买入；CTA 可含先 approve                    | `use-genesis-widget`            |
| **授权**       | `approve`                     | ERC20 allowance；可跨分钟                       | `*-write.ts`                    |
| **额度**       | `allowance`                   | 已授权额度                                      | 链上读 + query cache            |

## 兑换与报价

| 业务术语            | 代码名           | 含义                                       | Owner                                          |
| ------------------- | ---------------- | ------------------------------------------ | ---------------------------------------------- |
| **兑换**            | `exchangeTokens` | Trade 路径链上 swap                        | `web3/exchange/exchange-write`                 |
| **闪兑**            | `flashExchange`  | Flash 路径链上 swap                        | `web3/exchange/flash-exchange-write`           |
| **报价**            | `quote`          | 链上/路由报价；placeholder 不得驱动 submit | `canSubmitQuotedExchange` / `useExchangeQuote` |
| **闪兑 / 市场交易** | Flash / Trade    | Exchange 子视图；Provider 按需挂载         | `exchange-view-store`                          |

## 奖励领取

| 业务术语         | 代码名                     | 含义                                 | Owner                                                 |
| ---------------- | -------------------------- | ------------------------------------ | ----------------------------------------------------- |
| **领取团队奖励** | `claimTeamReward`          | 签名 → 上链 → confirm                | `claim-reward`                                        |
| **领取社区基金** | `claimCommunityFund`       | 同上                                 | `claim-reward`                                        |
| **领取签名**     | `TeamRewardClaimSignature` | 后端签名包（字段名兼容 snake/camel） | `claim-reward` / `parseTeamRewardClaim`               |
| **确认失败**     | `confirm_failed`           | 链上成功但后端 confirm 失败          | `useClaimReward`                                      |
| **未知回执**     | `unknown`（tx）            | pending 超时无回执；禁双提交         | `unknown-receipt-lock` / `WalletTransactionWaitError` |

## 壳与导航

| 业务术语           | 代码名                                                                  | 含义                                                                  | Owner                     |
| ------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------- |
| **兑换**           | `exchange`（`views/dapp/exchange` · `web3/exchange` · `core/exchange`） | 获取/处理协议代币入口                                                 | DApp rail                 |
| **资产**           | `assets`                                                                | 余额与持仓总览                                                        | DApp rail                 |
| **质押**           | `staking`                                                               | 质押 / 债券 / X 挖矿等                                                | DApp rail                 |
| **奖励**           | `rewards`                                                               | 奖励卡片与领取                                                        | DApp rail                 |
| **释放**           | `release`                                                               | 收益释放 + 本金释放                                                   | DApp rail                 |
| **社区**           | `community`                                                             | 邀请与推荐关系                                                        | DApp rail                 |
| **共建**           | `genesis`                                                               | 创世/共建认购与记录                                                   | DApp rail / genesis views |
| **DApp 页签**      | `DappTab`                                                               | exchange · assets · staking · rewards · release · community · genesis | `dapp-tabs`               |
| **Genesis 季**     | phase / season                                                          | 预售季；链上 phases + active                                          | presale queries           |
| **季/折扣 chrome** | promo                                                                   | 派生写入 store                                                        | `GenesisPromoSync`        |

## 命名政策

见 [`docs/naming.md`](docs/naming.md)。Batch 4 full polish 已落地（exchange config / claim-reward / unknown-receipt-lock / `app/startup` 等）。**合约部署 key 与 ABI/后端字段名不改**。

## 冻结边界（勿改）

- 合约 / ABI / 后端 JSON **字段名**
- React Query **key 字符串**（含 `['chain','swap',…]` / `'flashSwap'`）
- `WRITE_PATH.EXCHANGE` 字面量 `'swap'`（historical latch）
- 哨兵业务字面量：`confirm_failed`、`unknown`（工程哨兵如 `EXCHANGE_QUOTE_FAILED` 已随 Batch 4 更名）
- `core/presale` 目录名（链上域 SSOT，与产品面 Genesis 双层并存）
