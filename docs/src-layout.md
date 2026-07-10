# `src/` 目录落点（扁平约定）

> **SSOT**：新文件放哪。与 5-agent 目录共识一致：去空壳、保边界；**禁止**再套 `**/components` / `**/hooks` / `**/libs` 类型袋。

## 决策树（10 秒）

1. **纯逻辑**（无 React、无链 IO）→ `src/core/<domain>/`（`auth` / `swap` / `presale`）
2. **链读写 / 钱包 / thirdweb** → `src/web3/`（Home **禁止**依赖；depcruise `home-no-web3`）
3. **跨面无业务 primitive**（Button、Text、Card…）→ `src/shared/ui/`
4. **跨 Tab chrome**（rail、table shell、钱包弹层…）→ `src/app/shell/`（平铺，无 `components/`）
5. **单 Tab 业务卡 / 页专属弹层** → 对应 `src/views/dapp/<tab>/`（可再拆业务子袋，见下）
6. **单面 UI** → `src/views/<面>/` 平铺  
   - Home：`src/views/home/`  
   - DApp 页：`src/views/dapp/{swap,genesis,rewards,community,auth}/`
7. **页专属 hook** → 与页袋（或业务子袋）同目录（`use-*.ts`）
8. **跨面 hook** → `src/hooks/`（仅白名单；depcruise `hooks-no-views`：`hooks` ↛ `views`）
9. **全局 store** → `src/stores/`
10. **文案** → `src/i18n/messages/{home,app}/`

不确定时：**宁放页袋，勿放 `shared`**。仅 ≥2 面复用且无页语义才进 `shared`。

## 业务子袋（允许）

页袋内可按**能力名**再拆一层（非类型名）：

| 条件 | 规则 |
|------|------|
| 阈值 | 同能力 ≥4 文件、有单一入口语义 |
| 命名 | 能力名：`flash-swap/` · `trade-swap/` · `hub/` · `season/` · `web3/swap/` · `web3/wallet/` |
| 禁止 | `components/` · `hooks/` · `libs/` · `utils/` · `helpers/` |
| 共享 | 跨子袋复用的 quote / pool / pair 等留在页袋根 |

例：

```text
views/dapp/swap/
  flash-swap/   trade-swap/   hub/
  use-swap-quote.ts  use-swap-pool-reads.ts  …   # 跨子袋共享
views/dapp/genesis/
  season/       # season card / options / selector
```

## 目标树（摘要）

```text
src/
  core/{auth,swap,presale}/
  web3/                           # 链网关根：thirdweb、abis、presale/referral/reward、error present
    swap/                         # trade + flash 读/写、pool、quoter
    wallet/                       # 写链 plumbing、provider、wait、connection state
  app/{bootstrap,shell}/          # shell 内平铺
  shared/{ui,config,styles,lib,api}/
  hooks/  stores/  i18n/messages/{home,app}/
  views/
    home/                         # 无 components/；禁 web3 / thirdweb
    dapp/
      {swap,genesis,rewards,community,auth}/
```

## `hooks/` 白名单（跨面 / 无页语义）

仅保留：

- `use-api-data.ts` — 多 Tab API
- `use-capped-token-amount-input.ts` — 可复用金额输入
- `use-genesis-promo.ts` — 跨面 promo
- `use-mobile-viewport.ts`
- `queries/use-visible-interval.ts`

页专属编排在页袋：

| 袋 | hook |
|----|------|
| `views/dapp/swap/`（含子袋） | `use-swap-widget` · `use-flash-swap-widget` · `use-swap-quote` · `use-swap-pool-reads` |
| `views/dapp/genesis/` | `use-genesis-widget` |
| `views/dapp/rewards/` | `use-reward-claim` · `use-shareholder-rank` |
| `views/dapp/community/` | `use-referral` |
| `web3/` | `use-chain-read-client` · `use-presale-queries` |

## MUST NOT

- 再发明 `**/components`、`**/hooks`、`**/libs`、`**/utils`、`**/helpers` 类型空壳袋
- 把 `web3` 或页面业务倒进 `shared/`
- 取消 `views/` 或合并 Home/DApp 入口（须单独确认）
- Home 引入 `thirdweb` / `src/web3`
- 在 `src/hooks/` 新增页专属编排（应落页袋）
- `src/hooks/` import `src/views/`（depcruise error）

## 不变量

1. Home ≠ DApp providers（Home 无 thirdweb）
2. `core` 无 React、无链 IO
3. Foundation 在 `shared/ui`；合约地址在 `shared/config`；链/钱包网关在 `src/web3`
4. 页专属 hook 与页袋同目录；跨面 hook 不得反向依赖 views
5. 仅 `src/web3/` 与 `src/views/dapp/auth/` 可直接依赖 `thirdweb`（depcruise `web3-gateway`）
