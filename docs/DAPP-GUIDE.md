# AEGIS X DApp 开发指南

> 行为以代码为准。命令门禁见 [`agents/commands.md`](./agents/commands.md)。词表见根目录 [`UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md)；金钱路径见 [`money-path-map.md`](./money-path-map.md)。

## 1. 设计哲学

正确性 > 可验证性 > 简洁性 > 复用 > 速度。业务规则 / schema / 会话 / Derived Fact 各有唯一 owner（SSOT）。优先删除复杂度，不为去重制造脆弱抽象。

## 2. 双层身份

| 层 | 含义 | SSOT |
|----|------|------|
| 钱包连接 | thirdweb account / wallet | `thirdweb` + Connect UI |
| 业务登录 | SIWE → JWT | `AuthProvider` + `login-with-wallet` + `auth-store` |

连接 ≠ 登录。推荐 / 奖励 / claim 依赖 `sessionReady`（已连接且 JWT 有效）。

## 3. 目录与 SSOT

落点细则见 [`src-layout.md`](./src-layout.md)。

| 主题 | 路径 |
|------|------|
| 链 / thirdweb | `src/web3/thirdweb.ts`（经 `thirdweb-react.ts`） |
| 写链 plumbing | `src/web3/wallet/wallet-contract-write.ts` |
| Swap 读/写 | `src/web3/swap/*` |
| Presale / referral / claim | `src/web3/presale-*`、`referral-*`、`reward-claim.ts` |
| 合约地址 | `src/shared/config/contracts.ts` |
| Query key / 失效 | `src/shared/api/query/*` |
| Auth | `src/app/bootstrap/auth-provider.tsx`、`src/core/auth/*`、`src/views/dapp/auth/*` |
| 颜色 / 字阶 | `theme.css`、`src/shared/ui/text.tsx` |

## 4. 链上读写

- 读：`useChainReadClient`（已连接用钱包 RPC，否则公共 BSC）。
- 写：统一 `writeContractViaWallet`；禁止裸 `window.ethereum`；WalletConnect / inApp 禁止 fallback injected。
- 长 pending 无回执 → `WalletTransactionWaitError` outcome `unknown`，闩锁防双提交。

## 5. Swap / Genesis

- Trade / Flash 报价与 submit 门闸：`canSubmitQuotedSwap`（禁 placeholder、过期 quote、余额 loading）。
- Approve 后发第二笔前再跑门闸（quote age / bind / pause）。
- Genesis：`GenesisPromoSync` → `genesis-promo-store` 为 chrome SSOT；无季数据时骨架，不静态 fallback。

## 6. React Query

- Key 只来自 `query-keys.ts`。
- Tab 切换：`invalidateTabQueries(tab)` 且 `refetchType: 'active'`。
- 钱包切换：只刷新**新**地址链上读 + 当前 tab。

## 7. API 与错误

- 读/写：`requestWithSession`（`session-request.ts`）→ 401 → `invalidateSession`。
- 封禁：`isAccountBannedError` = **403 + 封禁文案/业务码**；裸 403 不 latch。
- 登录失败分类：`classifyLoginFailure` → `toLoginErrorSentinel`。

## 8. Claim

链上成功 + `/claim/confirm` 失败 → `confirm_failed`：保留 `txHash`，**不**乐观 `invalidate` 清空余额；confirm 幂等重试。

## 9. 安全清单

- JWT 仅内存/持久化 store（非 HttpOnly cookie，产品未要求前不改）。
- 不把后端 `ApiError.message` 直接给用户；走 i18n sentinel。
- 首页 popup 仍 `dangerouslySetInnerHTML`（未 sanitize；已知同源 JWT 风险）。

## 10. 反模式

| 不要 | 要 |
|------|-----|
| 组件内散落 chain id / 合约地址 | `contracts.ts` / `thirdweb.ts` |
| 裸 403 当封禁 | 业务码 + 文案 |
| confirm 失败仍当成功清空 UI | `confirm_failed` + 保留 txHash |
| Auth → `useQuery` / AuthService 套壳 | 保持派生会话机 |
| Tab lazy Suspense 骨架闪屏 | 仅数据 loading |

## 11. 验证

收工最小门禁：`pnpm check`（见 commands.md）。
