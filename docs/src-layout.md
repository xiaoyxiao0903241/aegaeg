# `src/` 目录落点

> 新文件放哪。禁再套 `**/components` / `**/hooks` / `**/libs` / `**/utils` / `**/helpers` 类型袋。

## 决策树

1. **纯逻辑**（无 React、无链 IO）→ `src/core/<domain>/`
2. **链 / 钱包 / thirdweb** → `src/web3/`（Home 禁；depcruise `home-no-web3` 含 `viem`）
3. **跨面 primitive** → `src/shared/ui/`（**只**视觉 / a11y / 动效 chrome 与无 locale 的纯 helper；**不**拥有 domain options、业务档位表或 locale 文案——档位与文案在 `views/dapp/<tab>/` + `i18n/messages/`。见根 `AGENTS.md` §8.0）
4. **跨 Tab chrome** → `src/app/shell/`（平铺）
5. **单 Tab 业务** → `src/views/dapp/<tab>/`
6. **单面 UI** → `src/views/<面>/`（Home：`views/home/`）
7. **页专属 hook** → 与页袋同目录（`use-*.ts`）
8. **跨面 hook** → `src/hooks/`（白名单；`hooks` ↛ `views`）
9. **全局 store** → `src/stores/`
10. **文案** → `src/i18n/messages/{home,app}/`

不确定：**宁放页袋，勿放 `shared`**。

## `views/dapp/` 根目录

**仅允许**跨 Tab 入口：`dapp-tabs*`、`dapp-tab-registry`、`dapp-tab-sessions`（及同等「注册/会话壳」）。

**禁止**在根目录放业务 helper / display mapper / 单轨 UI。误放反例：根目录 `presale-display.ts`——应落在 **单 Tab 页袋**（`views/dapp/genesis/`，因其依赖 `shared/api` 格式化，**不能**进 `core/`：`core-is-pure` 禁 `core` → `shared/api`）。产品面 Genesis ≠ 预售 core 域名（`UBIQUITOUS_LANGUAGE.md`）：纯预售数学仍在 `core/presale/`。

## 跨 Tab chrome（`app/shell/`）

- **放这里**：≥2 个 DApp Tab 共用的壳（顶栏、面板折叠、文案轮播壳、widget 外框等）。文件平铺；命名用短 `Dapp*`（例：`DappPanelToggle` · `DappTabHeader` · `DappCarousel`）。
- **禁**：把跨轨壳落在某一 `views/dapp/<tab>/` 下并用该 Tab 前缀命名（反例：`ExchangePanelToggle` 被 assets/staking/rewards/release 引用）。
- **vs `shared/ui`**：`shared/ui` = 无 DApp 业务语义的底座（Embla Carousel、`WidgetHeader`、颜色/字阶）；`app/shell` = DApp 壳 chrome（可绑 shell store / 通栏布局，仍不拥有 domain options 或 locale 默认文案——文案由 call site + i18n 传入）。见根 `AGENTS.md` §8.0 R3。
- **单轨 Figma leaf**（仅一轨用、且注释标明非通用壳）留在页袋（例：`AssetsModeCard` / `RewardsModeCard` / `TokenAboutCarousel`）。

## 业务子袋

同能力 ≥4 文件且有单一入口时可按能力名再拆一层（如 `flash-exchange/`、`market-trade/`、`web3/wallet/`）。禁类型空壳袋名。跨子袋共享留在页袋根。

## 树

```text
src/
  core/{auth,exchange,presale}/
  web3/                 # thirdweb、abis、errors、链读客户端
    exchange/  wallet/  # 兑换读写、write intent、unknown-receipt-lock
    presale/   referral/ claim/  # 预售 / 推荐 / 领奖（按域装袋）
  app/{startup,shell}/  # providers / boot；壳 chrome 在 shell/
  shared/{ui,config,styles,lib,api}/
  hooks/  stores/  i18n/messages/{home,app}/
  views/
    home/               # 禁 web3 / thirdweb / viem
    dapp/{exchange,assets,staking,rewards,release,community,genesis,auth}/
      exchange/{flash-exchange,market-trade,hub}/
```

## `hooks/` 白名单

`use-api-data` · `use-capped-token-amount-input` · `use-chain-mutation` · `use-genesis-promo` · `use-mobile-viewport` · `use-present-user-facing-error` · `use-shareholder-rank` · `queries/use-visible-interval`

页专属编排在页袋（如 `use-exchange-quote`、`use-genesis-widget`、`use-claim-reward`）。

跨 Tab **写路径纯函数**（非 hook）：`core/wallet/write-cta.ts`（`canClaimWhen` / `writeCtaDisabled` / `writeCtaLabel` / `formatAmountBalanceLabel`）；`web3/errors/get-error-message.ts`（`getErrorMessage(error, t)`）；`web3/errors/error-messages.ts`（sentinel / revert → i18n 表）；`app/shell/go-bind-referral.ts`。

链上写：读用 `useQuery`；写用唯一共享 hook **`useChainMutation`**（信封 + `retry: false`；已闩静默；错误 `getErrorMessage` toast；可选 `onError` 仅副作用，返回 `'handled'` 可抑制默认 toast）。Domain 仍在页袋 `submit-*`（只抛错，不包信封）。信封实现 `web3/wallet/submit-with-unknown-receipt-lock.ts` **仅**由 hook 调用。

## 不变量

1. Home ≠ DApp providers（Home 无 thirdweb）
2. `core` 无 React、无链 IO
3. 合约地址在 `shared/config`；链/钱包在 `web3`
4. 仅 `src/web3/` 与 `src/views/dapp/auth/` 可直接依赖 `thirdweb`（`web3-gateway`）
5. **`app→views` composition（known-ok）**：`dapp-shell` / session hosts / `dapp-tabs`、`auth-provider`→`login-with-wallet`（不变量 4）、rail dots / genesis promo sync、`app/assets`→home assets。depcruise `app-views-composition` 为 **warn**（文档化边，不升 error）。真泄漏（壳吃页袋 tv/常量）应下沉到 `app/shell` 或上提 helper。
6. **`views/dapp/<tab>` 禁跨 tab 直引**（depcruise `views-no-cross-tab` error）；共享 hook 进 `hooks/`，纯模板进 `shared/lib`。
