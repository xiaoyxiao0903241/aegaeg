# AEGIS X DApp 开发指南

> 行为以代码为准。命令：[`agents/commands.md`](./agents/commands.md)。词表：[`UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md)。金钱路径：[`money-path-map.md`](./money-path-map.md)。

## 1. 原则

正确性 > 可验证性 > 简洁性 > 复用 > 速度。业务规则 / schema / 会话 / Derived Fact 各有唯一 owner。

## 2. 双层身份

| 层 | 含义 | SSOT |
|----|------|------|
| 钱包连接 | thirdweb account / wallet | `thirdweb` + Connect UI |
| 业务登录 | SIWE → JWT | `AuthProvider` + `login-with-wallet` + `auth-store` |

连接 ≠ 登录。推荐 / 奖励 / claim 依赖 `sessionReady`。

## 3. 目录与 SSOT

细则：[`src-layout.md`](./src-layout.md)。

| 主题 | 路径 |
|------|------|
| 链 / thirdweb | `src/web3/thirdweb.ts`（经 `thirdweb-react.ts`） |
| 写链 | `src/web3/wallet/wallet-contract-write.ts` |
| Write intent / readiness | `src/web3/wallet/assert-write-intent.ts` · `use-write-readiness.ts` |
| Unknown latch | `src/web3/wallet/pending-unknown-latch.ts` |
| Swap | `src/web3/swap/*` · `views/dapp/swap/*` |
| Presale / referral / claim | `src/web3/presale-*` · `referral-*` · `reward-claim.ts` |
| 合约地址 | `src/shared/config/contracts.ts` |
| Query | `src/shared/api/query/*` |
| Auth | `src/app/bootstrap/auth-provider.tsx` · `src/core/auth/*` · `src/views/dapp/auth/*` |
| 颜色 / 字阶 | `theme.css` · `src/shared/ui/text.tsx` |

## 4. 链上读写

- 读：`useChainReadClient`（已连接用钱包 RPC，否则公共 BSC）。
- 写：`writeContractViaWallet`；发交易前校验 address + chain；`writeReady` 要求在预期链。
- Unknown（含 submit timeout / wait unknown）→ `WRITE_PATH` latch，禁立即重提。

## 5. Swap / Genesis

- 门闸：`canSubmitQuotedSwap`（禁 placeholder、过期 quote、余额 loading、unknown latch）。
- Approve 后 live 重读：Swap = quote + sellBalance；Genesis = bind + pause。
- Genesis chrome：`GenesisPromoSync` → `genesis-promo-store`；无季数据时骨架。

## 6. React Query

- Key 只来自 `query-keys.ts`。
- Tab：`invalidateTabQueries(tab)`，`refetchType: 'active'`。
- 钱包切换：只刷新新地址链上读 + 当前 tab。

## 7. API 与错误

- `requestWithSession` → 401 → `invalidateSession`。
- 封禁：`isAccountBannedError` = 403 + 封禁文案/业务码（裸 403 不 latch）。
- 用户文案走 i18n sentinel，不直接抛后端 `ApiError.message`。

## 8. Claim

链上成功 + `/claim/confirm` 失败 → `confirm_failed`：保留 `txHash`，不乐观 invalidate。

## 9. 反模式

| 不要 | 要 |
|------|-----|
| 组件内散落 chain id / 合约地址 | `contracts.ts` / `thirdweb.ts` |
| 裸 403 当封禁 | 业务码 + 文案 |
| confirm 失败仍清空 UI | `confirm_failed` + 保留 txHash |
| Approve 后用渲染快照做门闸 | live `fetchQuery` / refetch |
| Unknown 后立即重提 | `WRITE_PATH` latch |

## 10. 验证

`pnpm check`（见 commands.md）。
