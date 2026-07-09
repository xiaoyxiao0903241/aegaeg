# `src/` 目录落点（扁平约定）

> **SSOT**：新文件放哪。与 5-agent 目录共识一致：去空壳、保边界；**禁止**再套 `**/components`。

## 决策树（10 秒）

1. **纯逻辑**（无 React、无链 IO）→ `src/core/<domain>/`（`auth` / `swap` / `presale`）
2. **链读写 / 钱包 / thirdweb** → `src/views/dapp/web3/`（Home **禁止**依赖）
3. **跨面无业务 primitive**（Button、Text、Card…）→ `src/shared/ui/`
4. **跨 Tab chrome**（rail、table shell、钱包弹层…）→ `src/app/shell/`（平铺，无 `components/`）
5. **单 Tab 业务卡 / 页专属弹层** → 对应 `src/views/dapp/<tab>/`（例：`genesis-promo-card`、`season-selector`、`swap-slippage-modal`、`rank-title-with-super-community`）
6. **单面 UI** → `src/views/<面>/` 平铺  
   - Home：`src/views/home/`  
   - DApp 页：`src/views/dapp/{swap,genesis,rewards,community,auth}/`
7. **跨面 hook** → `src/hooks/`；页专属 hook 优先与页袋同目录
8. **全局 store** → `src/stores/`
9. **文案** → `src/i18n/messages/{home,app}/`

不确定时：**宁放页袋，勿放 `shared`**。仅 ≥2 面复用且无页语义才进 `shared`。

## 目标树（摘要）

```text
src/
  core/{auth,swap,presale}/
  app/{bootstrap,shell}/          # shell 内平铺
  shared/{ui,config,styles,lib,api}/
  hooks/  stores/  i18n/messages/{home,app}/
  views/
    home/                         # 无 components/
    dapp/{swap,genesis,rewards,community,auth,web3}/
```

## MUST NOT

- 再发明 `**/components`、`**/utils`、`**/helpers` 空壳袋
- 把 `web3` 或页面业务倒进 `shared/`
- 取消 `views/` 或合并 Home/DApp 入口（须单独确认）
- Home 引入 `thirdweb` / `views/dapp/web3`

## 不变量

1. Home ≠ DApp providers（Home 无 thirdweb）
2. `core` 无 React、无链 IO
3. Foundation 在 `shared/ui`；合约/链配置在既有 SSOT（`shared/config`、`views/dapp/web3`）
