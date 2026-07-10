# `src/` 目录落点

> 新文件放哪。禁再套 `**/components` / `**/hooks` / `**/libs` / `**/utils` / `**/helpers` 类型袋。

## 决策树

1. **纯逻辑**（无 React、无链 IO）→ `src/core/<domain>/`
2. **链 / 钱包 / thirdweb** → `src/web3/`（Home 禁；depcruise `home-no-web3` 含 `viem`）
3. **跨面 primitive** → `src/shared/ui/`
4. **跨 Tab chrome** → `src/app/shell/`（平铺）
5. **单 Tab 业务** → `src/views/dapp/<tab>/`
6. **单面 UI** → `src/views/<面>/`（Home：`views/home/`）
7. **页专属 hook** → 与页袋同目录（`use-*.ts`）
8. **跨面 hook** → `src/hooks/`（白名单；`hooks` ↛ `views`）
9. **全局 store** → `src/stores/`
10. **文案** → `src/i18n/messages/{home,app}/`

不确定：**宁放页袋，勿放 `shared`**。

## 业务子袋

同能力 ≥4 文件且有单一入口时可按能力名再拆一层（如 `flash-swap/`、`trade-swap/`、`web3/wallet/`）。禁类型空壳袋名。跨子袋共享留在页袋根。

## 树

```text
src/
  core/{auth,swap,presale}/
  web3/                 # thirdweb、abis、presale/referral/reward、errors
    swap/  wallet/      # 读/写、pool、write intent、latch、wait
  app/{bootstrap,shell}/
  shared/{ui,config,styles,lib,api}/
  hooks/  stores/  i18n/messages/{home,app}/
  views/
    home/               # 禁 web3 / thirdweb / viem
    dapp/{swap,genesis,rewards,community,auth}/
```

## `hooks/` 白名单

`use-api-data` · `use-capped-token-amount-input` · `use-genesis-promo` · `use-mobile-viewport` · `queries/use-visible-interval`

页专属编排在页袋（如 `use-swap-quote`、`use-genesis-widget`、`use-reward-claim`）。

## 不变量

1. Home ≠ DApp providers（Home 无 thirdweb）
2. `core` 无 React、无链 IO
3. 合约地址在 `shared/config`；链/钱包在 `web3`
4. 仅 `src/web3/` 与 `src/views/dapp/auth/` 可直接依赖 `thirdweb`（`web3-gateway`）
