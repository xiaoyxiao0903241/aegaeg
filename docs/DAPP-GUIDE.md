# AEGIS X DApp 开发指南

> 面向本仓库贡献者与 AI 助手的**实操手册**。归纳 **2026-07-02 ~ 2026-07-03** 近期提交（约 30 条，自 `a2263d2` 至 `4c27581`）沉淀的架构约定、修复模式与验收清单，并对接 2025–2026 行业最佳实践。

---

## 目录

0. [近期变更概览](#0-近期变更概览)
1. [设计哲学](#1-设计哲学)
2. [架构总览](#2-架构总览)
3. [双层身份：连接钱包 ≠ 业务登录](#3-双层身份连接钱包--业务登录)
4. [目录与 SSOT 地图](#4-目录与-ssot-地图)
5. [链上读写规范](#5-链上读写规范)
6. [Swap / DeFi 交互模式](#6-swap--defi-交互模式)
7. [React Query 与缓存失效](#7-react-query-与缓存失效)
8. [Context 与 Hook 组织](#8-context-与-hook-组织)
9. [API 层与错误处理](#9-api-层与错误处理)
10. [样式、H5 与 Legacy WebView](#10-样式h5-与-legacy-webview)
11. [UI / Figma 对齐](#11-ui--figma-对齐)
12. [安全清单](#12-安全清单)
13. [测试与验证](#13-测试与验证)
14. [常用命令与调试技巧](#14-常用命令与调试技巧)
15. [反模式速查（血泪教训）](#15-反模式速查血泪教训)
16. [扩展路线图](#16-扩展路线图)

---

## 0. 近期变更概览

以下按**主题**归纳近两天提交，便于新人快速建立「仓库当前长什么样」的心智模型。

### 0.1 Web3 读写与交易（`a96271a` → `14e81be`）

| 提交 | 要点 |
|------|------|
| `a96271a` | 写链统一走钱包 EIP-1193 provider，不再裸用 `window.ethereum` |
| `d81f7c7` | WalletConnect / inApp 写链禁止 fallback 到 injected |
| `8004776` / `14e81be` | 长 pending tx 标为 `unknown` 而非 `failed`，避免误报 + 重复提交 |
| `19d3383` | `useChainReadClient`：已连接 → 钱包 RPC；未连接 → 公共 BSC RPC |
| `2a8ebb8` | 从 wallet revert 树解析自定义 error selector，恢复 Referral / PreSale i18n |
| `14e81be` | simulate + estimateGas (+20% buffer)；`eth_accounts` 校验后再 legacy fallback |

**SSOT 文件：** `wallet-contract-write.ts`、`wait-wallet-transaction.ts`、`resolve-wallet-eip1193-provider.ts`、`chain-read-client.ts`、`use-chain-read-client.ts`

### 0.2 Swap 正确性（`19c58a9` → `4c27581`）

| 提交 | 要点 |
|------|------|
| `19c58a9` | Pancake V3 `exactInputSingle` 补 **deadline** 字段（8 元组，selector `0x414bf389`） |
| `01e230e` | 滑点输入 clamp 在 100% 硬上限以下 |
| `7d631ee` | 链上 `amountOutMin` 与 UI 同一 memo；余额 loading 期间禁止 submit |
| `0c73fe6` | pool metadata 按 address 缓存；Genesis 去掉隐藏 approve |
| `4c27581` | Context 单例、`quotesEnabled` gate、删 V2 死代码、Trade 汇率 SSOT |

### 0.3 Auth / API（`896bb81` → `6a378e0`）

| 提交 | 要点 |
|------|------|
| `896bb81` | 签名缓存仅在 API 拒绝时清除；去掉 dead signature 参数 |
| `992bcd6` | `apiRequest` 增加 timeout；`buildApiUrl` 单测 hermetic |
| `12a6e04` / `6a378e0` | 403 封禁在 `apiRequest` 集中 `interceptApiError`；3s toast 节流 |
| `44c6f59` | 推荐绑定 precheck + 封禁 403  surfaced |
| `4c27581` | JWT 无 `exp` 时用 `savedAt + 1h` renew；transient vs permanent login error |

### 0.4 Query / Referral / Rewards

| 提交 | 要点 |
|------|------|
| `992bcd6` / `b991bee` | `query-keys.ts` 中心化 root key，禁止 inline 字面量 |
| `6d04ebe` | 推荐输入去重 effect、删 `buildReferralLink` 死代码 |
| `4a6f79f` | Rewards claim 金额 decimal → wei 无 float 精度损失 |
| `a2263d2` | commitment floor rank 与 A-tier label 1:1 映射 |
| `db57810` | 上线后 A 等级仅认 `presale_commitment_floor_rank`（max A13）；删 S→A fallback |
| `3e69838` | A13 时提升文案改为「您已达到最高等级」 |
| `63160af` | 首页弹窗 `POST /home/popup-notices`、时间窗口与 dismiss 队列 |

### 0.5 配置 / 环境

| 提交 | 要点 |
|------|------|
| `716d8c1` | `VITE_BSC_*` 合约地址 env 覆盖，无效时 fallback `DEFAULT_BSC_CONTRACTS` |
| `9112432` / `845fd0d` | `VITE_APP_HOST` 在 `location` 不可读时 fallback（默认 `x-dao.io`） |

### 0.6 DApp UX / 样式 / 测试

| 提交 | 要点 |
|------|------|
| `074898d` / `7c341c0` | `copyTextToClipboard` + execCommand fallback；5s 复制 cooldown |
| `be58b91` / `cc81bda` / `0922162` | breakpoint `@custom-variant` SSOT；legacy WebView；H5 字号 +1px |
| `1c47b00` | lightningcss 仅 production build |
| `7cc6c08` | Genesis Reserve Council Notion 链接 i18n |
| `076d376` | 单测复用 Vite server；删 flaky `locale.test` |

---

## 1. 设计哲学

### 1.1 决策优先级

```
正确性 > 可验证性 > 简洁性 > 复用 > 速度
```

- **SSOT**：合约地址、链配置、auth 状态、swap 汇率、API base URL、query key 各只有一个 owner。
- **Derived Fact**：UI 展示状态从少量「真相源」推导，不多处维护「当前 session」。
- **Deletion-first**：V2 路径报价、假 Community 统计、`buildReferralLink` 等无验证路径代码直接删。

### 1.2 世界级 DApp 的 UX 底线（行业共识）

| 原则 | 含义 | 本仓库对应 |
|------|------|------------|
| **Simulate before send** | 写链前 simulate，revert 拦在钱包弹窗前 | `wallet-contract-write.ts` |
| **Human-readable signing** | SIWE 让用户看懂签的是什么 | `auth/siwe-message.ts` |
| **Explicit slippage & deadline** | `amountOutMin` + deadline 与 UI 同源 | `calcAmountOutMin` + `SWAP_CONFIG.deadline` |
| **Fail gracefully** | 区分拒签 / transient / revert / 封禁 | auth-machine + `interceptApiError` |
| **Don't spam RPC** | 只在需要的 tab / 子视图轮询 | `SwapSubviewProviders` gate |
| **Connect ≠ Login** | 钱包连接 ≠ JWT session | `useDappShell()` |

参考：[EIP-4361 SIWE](https://eips.ethereum.org/EIPS/eip-4361)、[Viem simulateContract](https://viem.sh/docs/contract/simulateContract.html)。

---

## 2. 架构总览

```
┌─────────────────────────────────────────────────────────────┐
│  app.html / locale HTML  →  WebRootProviders                │
│    ├─ ThirdwebProvider (钱包连接)                            │
│    ├─ QueryProvider (TanStack Query)                        │
│    └─ AuthProvider (SIWE + JWT)                             │
│         └─ DappShell                                        │
│              ├─ GenesisWidgetProvider  (单例 genesis 状态)   │
│              ├─ SwapSubviewProviders   (flash/trade 单例)   │
│              ├─ DappRail + TabWidget + TabContent           │
│              └─ useDappShell() → sessionReady / walletReady │
└─────────────────────────────────────────────────────────────┘
```

**数据流三层：**

| 层 | 技术 | 用途 |
|----|------|------|
| 链上读 | viem + `ChainReadClient` | 余额、allowance、quoter、presale、tx receipt |
| 链上写 | `writeContractViaWallet` | approve、swap、purchase、bind referrer |
| 业务 API | `apiRequest` + JWT | 团队、奖励、销售记录 |

---

## 3. 双层身份：连接钱包 ≠ 业务登录

### 3.1 两个 readiness 信号

来自 `useDappShell()`：

| 字段 | 含义 | 驱动什么 |
|------|------|----------|
| `walletReady` | thirdweb 已连接账户 | 读余额、发交易、显示地址 |
| `sessionReady` | SIWE JWT 有效且与当前地址匹配 | API 数据、个性化 quote、Community |

**规则：**

- 未连接：Connect CTA；公开 spot 价（若产品允许）。
- 已连接未登录：链上读可用；业务 API 需 `sessionReady`。
- 已登录：全功能。

### 3.2 Auth 状态机（SSOT：`auth-machine.ts`）

```
disconnected → needsLogin → authenticated
```

**近几天强化的机制：**

1. **JWT 续期**：有 `exp` → 到期前 60s renew；无 `exp` → `savedAt + FALLBACK_SESSION_TTL_MS`（1h）。
2. **登录 attempt key**：防止 401 → purge → 无限重登。
3. **签名缓存**（`896bb81`）：有效 SIWE 签名可静默换 JWT；**仅 API 拒绝时**清缓存。
4. **错误分类**（`4c27581`）：
   - **Permanent**（拒签、无效签名、封禁）→ 停止自动重试。
   - **Transient**（网络失败）→ 清空 `loginError`，允许 effect 重试。
5. **SIWE 失败 fallback**（`14e81be`）：复杂 SIWE 签名失败时可降级 simple login text。

### 3.3 实现新「需登录」功能时

```tsx
// ✅ API 数据
const { data } = useTeamOverview(sessionReady)

// ✅ 链上读（仅需钱包）
const readClient = useChainReadClient()
const balancesQuery = useQuery({ enabled: walletReady, ... })

// ✅ 链上写
await writeContractViaWallet({ wallet, ... })
```

---

## 4. 目录与 SSOT 地图

| 路径 | SSOT 职责 |
|------|-----------|
| `src/views/dapp/web3/thirdweb.ts` | Client ID、链、Connect 配置 |
| `src/views/dapp/web3/thirdweb-react.ts` | **thirdweb/react 网关**（depcruise 强制经此 import） |
| `src/shared/config/contracts.ts` | BSC 合约（`VITE_BSC_*` env 覆盖 + code fallback） |
| `src/shared/config/swap.ts` | Router、Quoter、Pool、滑点、deadline、轮询间隔 |
| `src/shared/config/env.ts` | API base、RPC、`VITE_APP_HOST` |
| `src/views/dapp/auth/*` | SIWE、JWT、login、状态机编排 |
| `src/core/auth/auth-machine.ts` | 纯 auth 状态推导 |
| `src/shared/api/request.ts` | `apiRequest`、timeout、403 intercept |
| `src/shared/api/account-banned.ts` | 封禁 sentinel、toast 节流 |
| `src/stores/auth-store.ts` | 持久化 JWT + 签名（按地址） |
| `src/views/dapp/web3/chain-read-client.ts` | 读 RPC 路由 SSOT |
| `src/views/dapp/web3/swap-read.ts` | V3 Quoter 报价（**唯一** swap quote 路径） |
| `src/views/dapp/web3/wallet-contract-write.ts` | simulate → estimateGas → send |
| `src/shared/api/query/query-keys.ts` | React Query key 规范 |
| `src/shared/api/query/invalidate.ts` | 钱包切换 / swap / genesis 后失效 |
| `src/core/presale/rank.ts` | 创世 S 等级（S1–S10）、`resolveDisplayPresaleRank` |
| `src/core/presale/tier-table.ts` | 上线后 A 等级（A1–A13）、`resolveCommitmentFloorRank`、静态等级表 |
| `src/views/dapp/presale-display.ts` | 预售 sales log 行映射（DApp 展示层） |
| `src/views/home/popup-notice.ts` | 首页弹窗队列、时间窗口、dismiss 持久化 |
| `src/shared/lib/copy-to-clipboard.ts` | 移动端 + legacy WebView 复制 |
| `src/app/shell/components/*` | DApp shell 共享 UI（card、table、widget frame 等） |
| `src/i18n/messages/app/*` | DApp 文案（PC = SSOT） |

**已删除、勿再引入：**

- `quote-swap-out.ts` / `build-swap-paths.ts` / `select-best-path.ts`（V2 多路径）
- `community-stats.ts`（假数据；未取到显示 `—`）
- `buildReferralLink`（referral refactor 已删）
- `getPostLaunchRankLabel` / S→A 查表、`heroBodyForRank`（A 等级只认 API `presale_commitment_floor_rank`）

**业务数据语义**：等级、弹窗、API 字段与 UI 展示规则见本文 §0 / §6–§9 及 `src/core/presale/`、`src/views/home/popup-notice.ts`。

---

## 5. 链上读写规范

### 5.1 读：`useChainReadClient`（`19d3383`）

```ts
const readClient = useChainReadClient()
// 已连接 → 钱包 EIP-1193 RPC
// 未连接 → bsc-read-client（VITE_BSC_RPC_URL）

await readErc20Balance(token, owner, readClient)
await fetchSwapQuote({ amountIn, tokenIn, tokenOut, client: readClient })
```

**适用：** 余额、quote、presale、referral 读、tx receipt 轮询。

### 5.2 写：`writeContractViaWallet`

流水线（`wallet-contract-write.ts`）：

1. `simulateContract` — 提前暴露 revert  
2. `estimateContractGas` + 20% buffer  
3. `eth_sendTransaction` via 解析后的 EIP-1193 provider  
4. `waitForWalletTransactionConfirmation` — `failed` vs `unknown`

**Provider 路由（`resolve-wallet-eip1193-provider.ts`）：**

- WalletConnect / inApp → thirdweb adapter  
- Injected → EIP-6963 → 验证 `eth_accounts` 匹配后再用 `window.ethereum`  
- **禁止** WC 连接却写到 MetaMask（`d81f7c7`）

### 5.3 交易结果语义（`8004776` / `14e81be`）

| 状态 | 含义 | UI 行为 |
|------|------|---------|
| `success` | receipt status = 1 | 成功 toast + invalidate |
| `failed` | receipt status = 0 | 可读 revert i18n |
| `unknown` | 长时间 pending / 无法确认 | **勿**当失败重发；提示用户查 explorer |

BSC 确认慢时，`unknown` 是正常出口，不是 bug。

### 5.4 合约 revert i18n（`2a8ebb8`）

- 遍历 wallet RPC 嵌套 error 树找 revert data  
- hook 层保留 raw error，交给 `mapContractError` / selector 表  
- Referral、PreSale 自定义 error 恢复中文/英文 copy

### 5.5 金额与精度

```ts
// ✅ 全程 bigint
const amountOutMin = calcAmountOutMin(quotedOut, slippageBps)
parseUnits(decimalString, decimals)  // rewards claim — 4a6f79f

// ❌ Number(wei) — 大额丢精度
```

### 5.6 合约地址配置（`716d8c1`）

```bash
# .env — 均可选，缺失时用 DEFAULT_BSC_CONTRACTS
VITE_BSC_WBNB=
VITE_BSC_USD1=
VITE_BSC_PANCAKE_V3_SWAP_ROUTER=
VITE_BSC_PANCAKE_V3_QUOTER=
```

构建时校验；无效地址 silent fallback 到 code default。

---

## 6. Swap / DeFi 交互模式

### 6.1 报价 SSOT

- **唯一路径**：`fetchSwapQuote` → Pancake V3 Quoter  
- **UI floor**：`amountOutMin = calcAmountOutMin(quotedOut, slippageBps)`  
- **链上执行**：同一 memo 的 `amountOutMin`；可 re-quote fee tier，**不得**改用户确认的 min  
- **deadline**（`19c58a9`）：`exactInputSingle` 8 字段含 `SWAP_CONFIG.deadline`

### 6.2 Context 单例（`4c27581`）

```
SwapSubviewProviders
  ├─ FlashSwapWidgetProvider  → useFlashSwapWidget (一次)
  └─ TradeSwapWidgetProvider  → useTradeSwapWidget (一次)
```

Widget + Content **共用** Context，禁止各调一次 hook。

### 6.3 RPC 轮询 gate

```ts
const effectiveView = motion && incomingView ? incomingView : view
const flashQuotesEnabled = activeTab === 'swap' && effectiveView === 'flash'
const tradeQuotesEnabled = activeTab === 'swap' && effectiveView === 'trade'
```

| 场景 | 轮询 quote |
|------|------------|
| 非 Swap tab | ❌ |
| Swap hub | ❌ |
| Flash / Trade 子视图 | ✅ 对应子视图 only |
| 页面不可见 | ❌ |

### 6.4 滑点与 submit guard

- 输入 clamp `< 100%`（`01e230e`）  
- 余额 loading 或 quote stale 时 `canSubmit = false`（`7d631ee`）

---

## 7. React Query 与缓存失效

### 7.1 Query Key 约定（`b991bee`）

```ts
// ✅ 从 query-keys.ts 引用
queryKeys.chain.swapBalances(address, sell, buy)
queryKeys.api.teamOverview

// ❌ inline ['chain', 'swap', ...] 或 slice hack
```

API query **必须**带 token scope，防换钱包仍显示旧用户数据。

### 7.2 失效入口（SSOT：`invalidate.ts` / `dapp-actions.ts`）

| 事件 | 调用 |
|------|------|
| 登录成功 | `afterAuthLogin(address)` |
| 登出 | `afterAuthLogout()` |
| 换钱包 | `afterWalletSwitch(prev, next, tab)` |
| Swap 成功 | `afterSwap()` |
| Genesis 购买 | `afterGenesisPurchase(...)` |
| 绑定推荐人 | `afterReferralBind()` |

### 7.3 staleTime 参考

| 类型 | staleTime |
|------|-----------|
| API | 5 min |
| 余额 / allowance | 30 s |
| Quote | 10 s + visible interval |

---

## 8. Context 与 Hook 组织

### 8.1 何时用 Provider 单例

- Widget + Content 共用同一 hook 状态（Swap、Genesis）  
- hook 含 `useState` + 链上 query → 重复实例 = 双倍 RPC  
- 子视图过渡需 gate `quotesEnabled`

### 8.2 推荐绑定（`44c6f59` / `4c27581` / `6d04ebe`）

```ts
// ✅ 显式 referrer（输入或 URL ref）
const target = referrerInput.trim() || pendingReferrer
if (!target) return false

// ❌ 静默 defaultReferrer
// ❌ 重复 input effect 触发多次 bind
```

bind 前 precheck 链上 `isBound` + API 403。

---

## 9. API 层与错误处理

### 9.1 `apiRequest` SSOT（`992bcd6` / `12a6e04`）

- 统一 timeout，避免 hung request  
- 403 封禁：`interceptApiError` → `reportAccountBanned`  
- 组件 / hook **不要**各自 parse 403

### 9.2 封禁 toast 节流（`6a378e0`）

并行 API + react-query retry 可能同时 403；`reportAccountBanned` 3s cooldown + Sonner id 去重。

Auth 层用 `ACCOUNT_BANNED_SENTINEL` 写入 `loginError`，UI 单点展示。

### 9.3 API Base URL（`9112432`）

```ts
// 生产：hostname → api.{root}/api
// SSR / 测试 / file://：VITE_APP_HOST fallback
```

单测 mock `location` 时用 hermetic `buildApiUrl`（`992bcd6`）。

### 9.4 业务 API 与等级语义

- **路径与方法 SSOT**：`src/shared/api/endpoints.ts`（均为 **POST**；含 `/home/popup-notices`、`/performance` 等）。
- **等级与弹窗展示规则**：本文 §9.4、`src/core/presale/`、`src/views/home/popup-notice.ts`。
- **创世 S 等级**：`presale_rank`（max S10）；**上线后 A 等级**：`presale_commitment_floor_rank`（max A13，1:1 显示 `A{n}`）。二者独立，前端不做交叉推算。

---

## 10. 样式、H5 与 Legacy WebView

### 10.1 Breakpoint SSOT（`be58b91`）

Tailwind v4 `@custom-variant`：

- `max-tablet`、`tablet`、`max-narrow`  
- 821–1100px 用 `tablet:` 避免 grid cascade 冲突  
- 删 redundant `legacy-browser-fallback.css` patch stack

### 10.2 Legacy WebView（`074898d` / `cc81bda`）

- `oklch` → hex fallback on theme tokens  
- lightningcss 降级 range media query（**仅 prod build**，`1c47b00`）  
- Chromium &lt; 111 内置浏览器可渲染按钮与 H5 layout

### 10.3 H5 字号（`0922162`）

响应式 bump **+1px**，不是 Tailwind 一整档 jump。

### 10.4 剪贴板（`074898d` / `7c341c0`）

`copyTextToClipboard`：Clipboard API → `execCommand` fallback（Huawei/Vivo）。  
同一文案 5s cooldown，防连点 toast 轰炸。

---

## 11. UI / Figma 对齐

- **Figma SSOT**：[AEGIS X 设计稿](https://www.figma.com/design/sXWXDvBrLeg5r0NnP1SMZH/AEGIS-X--Copy---Copy---Copy-)
- **PC 文案 = SSOT**；H5 仅响应式  
- **未取到数据**：`—`（`4c27581` Community）；加载中 `…`  
- 页面顺序：**Shell → Swap → Genesis → Rewards → Community**

---

## 12. 安全清单

### 12.1 前端

- [ ] 私钥 / Admin key 不进 bundle  
- [ ] `VITE_*` 仅 public config  
- [ ] SIWE 含 domain、chainId、nonce、expiration  
- [ ] 403 封禁走 `interceptApiError`，不 fan-out toast  
- [ ] 每笔 tx 展示 token、amount、slippage

### 12.2 链上

- [ ] 写前 simulate  
- [ ] `amountOutMin` / deadline 与 UI 一致  
- [ ] 区分 `failed` vs `unknown`  
- [ ] 合约地址来自 `config/contracts.ts` + env 校验

### 12.3 CI

- [ ] `pnpm exec tsc -b && pnpm test:unit` 通过  
- [ ] Docker `pnpm install --frozen-lockfile`  
- [ ] secrets 不进 git

---

## 13. 测试与验证

### 13.1 单元测试

```bash
pnpm test:unit
node --test tests/unit/auth-machine.test.mjs
node --test tests/unit/audit-fixes-verification.test.mjs
```

**必测领域（近几天新增/强化）：**

- Auth：attempt key、renew、permanent vs transient、signature cache  
- Swap：`calcAmountOutMin`、`exactInputSingle` selector / deadline  
- API：`parseApiResponse`、`buildApiUrl` hermetic  
- 封禁：`resetAccountBannedReportCooldownForTests`（Vite server 复用，`076d376`）

### 13.2 E2E

```bash
pnpm dev:e2e    # :5175
pnpm test:e2e
```

### 13.3 手动验收清单

**Swap**

1. 非 Flash/Trade 子视图：Network 无 10s quoter 重复  
2. Widget 与 Content 汇率一致  
3. submit 后 pending 久未确认 → `unknown`，不弹「失败」  
4. revert → 中文/英文可读（非 raw hex）

**Auth**

5. 网络闪断 → 恢复后可自动重登（非 permanent error 卡死）  
6. 并行 API 403 → 仅一条封禁 toast

**Wallet**

7. WC 连接 → 写链走 WC provider，非 MetaMask  
8. 换钱包 → 余额与 API 数据切换

**Legacy**

9. 旧 Android WebView：按钮可见、复制可用

---

## 14. 常用命令与调试技巧

```bash
pnpm dev
cp .env.example .env    # VITE_THIRDWEB_CLIENT_ID, VITE_BSC_*

pnpm exec tsc -b
pnpm lint
pnpm test:unit

rg "fetchSwapQuote" src/
codegraph context "auth session login"
```

| 现象 | 排查 |
|------|------|
| Wallet 401 | `VITE_THIRDWEB_CLIENT_ID` |
| Swap revert 空 0x | 检查 calldata 字段数 / deadline |
| 换钱包 stale 数据 | `afterWalletSwitch` invalidate |
| 长 pending 误报失败 | `wait-wallet-transaction` outcome |
| 多 toast 403 | `reportAccountBanned` cooldown |

---

## 15. 反模式速查（血泪教训）

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| 全局 quote 轮询 | 匿名也打 RPC | tab + subview gate |
| Widget + Content 各调 hook | 双倍 RPC | Context Provider |
| 写链走 `window.ethereum` | WC 用户写到错钱包 | `resolve-wallet-eip1193-provider` |
| pending 当 failed | 重复 submit | `unknown` 语义 |
| 7 字段 exactInputSingle | 链上 revert 0x | 8 字段 + deadline |
| UI / 链上不同 `amountOutMin` | 滑点保护失效 | 同一 memo |
| inline query key | invalidate 漏网 | `query-keys.ts` |
| 组件各自 handle 403 | toast 轰炸 | `interceptApiError` |
| `Number(bigint)` 算 wei | 精度丢失 | `parseUnits` |
| 静默 defaultReferrer | 误绑 | 显式地址 |
| JWT 无 exp 不 renew | 批量 401 | fallback TTL |
| 假 Community 统计 | 误导 | `—` |
| V2 quote 死代码 | 双轨维护 | 只留 V3 Quoter |
| dev 跑 lightningcss | HMR 慢 / 行为差 | prod only |

---

## 16. 扩展路线图

| 阶段 | 内容 |
|------|------|
| **Now** | BSC；thirdweb + SIWE；Swap / Genesis / Rewards / Community |
| **Next** | Ethereum（`supportedChains` + 动态 `chainId`） |
| **Consider** | Permit2；服务端 SIWE nonce；The Graph |
| **Out of scope** | Solana / TRON；除非需求变更 |

---

## 附录 A：新增功能 Checklist

- [ ] Figma 对齐（PC + H5 同组件）  
- [ ] i18n key 加 `messages/app/en.ts`  
- [ ] `walletReady` / `sessionReady` 分清  
- [ ] query key 来自 `query-keys.ts`  
- [ ] 链上读 `useChainReadClient`；写 `writeContractViaWallet`  
- [ ] 成功后 `dapp-actions` invalidate  
- [ ] 复杂 widget → Context 单例  
- [ ] 无数据 `—`  
- [ ] 单测覆盖 math / 状态机 / calldata

---

## 附录 B：参考资源

- [EIP-4361 Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)  
- [thirdweb React SDK v5](https://portal.thirdweb.com/react/v5)  
- [Viem Docs](https://viem.sh/)  
- [TanStack Query](https://tanstack.com/query/latest)  
- [PancakeSwap V3](https://docs.pancakeswap.finance/)  
- 本项目：`AGENTS.md`、`src/core/auth/auth-machine.ts`

---

## 附录 C：近期提交索引（2026-07-02 ~ 07-03）

<details>
<summary>完整 commit 列表（点击展开）</summary>

```
4c27581 fix: address swap/auth audit findings from code review
076d376 test: reuse Vite server in unit tests and drop locale.test
14e81be fix(web3): harden tx wait, wallet RPC routing, and login signing
6a378e0 fix(api): throttle banned-account toast fan-out across parallel 403s
12a6e04 refactor(api): centralize banned-account 403 handling in apiRequest
44c6f59 fix(dapp): precheck referral parent bind and surface banned-account 403
0922162 fix(styles): reduce H5 typography bump from one step to +1px
19d3383 fix(web3): route connected-wallet chain reads through wallet RPC
2a8ebb8 fix(web3): restore custom contract error i18n from wallet revert data
de71622 fix(swap): align H5 token carousel contract button to the right
7cc6c08 feat(i18n): add locale Notion links for Genesis Reserve Council program
be58b91 refactor(styles): SSOT breakpoint variants, drop layout fallback layer
0f6d048 fix(home): restore section gutters and narrow legacy layout fallback
cc81bda fix(styles): legacy WebView breakpoints and H5 typography
716d8c1 feat(config): allow VITE_BSC_* contract overrides with code fallbacks
7c341c0 fix(dapp): add 5s per-text cooldown on clipboard copy
1c47b00 fix(vite): run lightningcss only on production build
074898d fix(dapp): mobile clipboard fallbacks and legacy WebView CSS compat
0c73fe6 refactor(web3): key pool metadata cache by address, slow countdown tick
6d04ebe refactor(referral): remove duplicate input effect, stale dep and dead code
b991bee refactor(query): centralize root query keys, drop inline literals
992bcd6 fix(api): add request timeout and make buildApiUrl test hermetic
896bb81 fix(auth): drop dead signature param and only clear cached signature on API rejection
4a6f79f fix(rewards): convert decimal claim amounts to wei without float precision loss
7d631ee fix(swap): align executed amountOutMin with UI and guard balance loading
8004776 fix(web3): stop misreporting live pending transactions as failed
d81f7c7 fix(web3): keep non-injected wallet writes off window.ethereum
01e230e fix(swap): clamp slippage input below the 100% hard limit
a96271a fix(web3): route contract writes through wallet EIP-1193 provider
845fd0d chore(config): default VITE_APP_HOST fallback to x-dao.io
9112432 feat(config): fall back to VITE_APP_HOST when location is unreadable
19c58a9 fix(swap): add deadline to Pancake V3 exactInputSingle calldata
a2263d2 fix(rewards): map commitment floor rank 1:1 to A-tier labels
```

</details>

---

*最后更新：2026-07-06 — 含 commitment floor A13、首页弹窗；业务语义见 §9.4。*
