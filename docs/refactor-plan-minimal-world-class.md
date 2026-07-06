# AEGIS X 架构重构方案（FINAL）

> **版本**：FINAL · rev3（先迁移验 parity，再重构 · move/refactor 两拍）  
> **状态**：批准实施 · **R0 已完成**（下一 merge：**R0.5**）  
> **执行手册**：[`refactor-execution-playbook.md`](./refactor-execution-playbook.md)  
> **North Star**：**算在 core、副作用在 edge、配置在 shared、界面在 views** — 用最少的目录，让编译器替人记规矩。

---

## 0. 执行摘要

| 项 | 决策 |
|----|------|
| 架构 | 四层：`app` · `core` · `views` · `shared` |
| **执行纪律** | **`-move`**（只改路径/shim/registry）→ 验 parity → **`-refactor`**（抽组件/收 CSS） |
| 工期 | **6–8 周 · ~18 个 merge 点** |
| 第一 PR | **R0 Tab Registry**（~120 行，1 天） |
| 护栏 | **2 条 CI 硬规则**（R1-move）+ **3 条 depcruise**（2 warn → R8-refactor error） |
| `core/` | **15 文件**封闭清单 |
| Auth | `core/auth`（算）+ `views/dapp/auth`（做）；**含 thirdweb 的 login 仍归 auth，eslint 白名单** |
| CSS | **双 bundle**（home / dapp）+ shared tokens — **非**单文件塞入 wallet 样式 |

---

## 1. 问题与资产

### 1.1 根因

1. 无编译期边界  
2. `dapp-shell.tsx` 硬编码四 tab  
3. SSOT 分散（CSS、theme、断点）

### 1.2 资产

`auth-machine` · swap/presale 算法 · 43 unit tests · lightningcss 兼容策略

### 1.3 刻意 defer

dapp-card 全量 tv · format-display 拆分 · zod / DDD

---

## 2. 世界级标准（本项目）

| 原则 | 可操作 |
|------|--------|
| 代码极简 | 4 层 · 15 core 文件 · 无 pages/adapters |
| 可测试 | `core/` 纯函数 · 测试 mirror 路径 |
| SSOT | 一域一 owner 一 lint（§6） |
| 可落地 | Tab Registry · shim · **move/refactor 分两拍** · **每 PR ≤800 行** · 可 revert |

---

## 3. 终态目录

```
src/
├── app/
│   ├── bootstrap/
│   ├── main.tsx
│   └── home/main.tsx
├── core/                    # §4 — 15 文件
│   ├── swap/ (7)
│   ├── presale/ (4)
│   └── auth/ (4)
├── views/
│   ├── home/                # sections + home-renderer + home-reveal-loader（原 wallet-loader）
│   └── dapp/
│       ├── dapp-tabs.tsx
│       ├── auth/            # §5
│       ├── shell/
│       ├── swap/            # 扁平，文件名前缀 hub/flash/trade
│       ├── genesis/
│       ├── rewards/
│       ├── community/
│       ├── format-display.ts   # 跨 3 tab → 留 dapp 根（附录 D 裁决规则）
│       ├── state/           # 4 跨 tab zustand
│       └── web3/
└── shared/
    ├── ui/
    ├── styles/
    │   ├── tokens/          # SSOT
    │   ├── home.css         # 入口：home main 引用
    │   ├── dapp.css         # 入口：dapp main 引用
    │   └── theme.ts
    ├── config/
    ├── api/                 # 含 query/ · http-errors.ts（401 SSOT）
    ├── lib/
    └── i18n/
```

### 3.1 依赖方向

```
app       → views, shared
views     → core, shared, views/dapp/{web3,state,auth}
core      → core 内 only（禁 views/shared/app）
shared/*  → 禁 import views/core（shared/api 禁 import views/dapp/auth）
shared/ui → shared/lib only
```

### 3.2 目录裁决规则（附录 D）

> **单 tab 消费 → colocate 到该 tab；≥2 tab 消费 → 留 `views/dapp/` 根或 `shared/`**

---

## 4. `core/` 封闭清单（15）

swap ×7 · presale ×4 · auth ×4（见附录 A）

**`jwt.ts` 与 `atob`**：R1 改为注入 `decodeBase64Url` 参数，或暂放 `shared/lib/jwt.ts` 并在 R8 再评估是否回 core。

---

## 5. Auth（两目录 + 错误 SSOT）

### 5.1 文件归属

| 文件 | 终态 |
|------|------|
| auth-machine, resolve-auth-status, auth-address, jwt | `core/auth/` |
| session, login-signature-cache, build-login-message, login-with-wallet | `views/dapp/auth/` |

`login-with-wallet` **使用 thirdweb** — 仍归 `views/dapp/auth/`，**不**归 web3/；eslint `no-restricted-imports` **白名单**：

- `src/web3/**`
- `src/views/dapp/web3/**`
- `src/views/dapp/auth/**`
- 迁移期 `src/lib/api/auth/login-with-wallet.ts`

### 5.2 R1 前置：HTTP 错误 SSOT（必做）

**问题**：`fetch-authenticated` 从 `login-with-wallet` import `isUnauthorizedError` — shared 反向依赖 views。

**修法（R1 第一天，<30 行）**：

```ts
// shared/api/http-errors.ts — 新建
export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}
```

`login-with-wallet` · `fetch-authenticated` · `auth-provider` **均改 import 此处**。

### 5.3 对外 API

- 业务 **禁止** 直接 import 8 个 auth 源文件  
- 经 `views/dapp/auth/index.ts` 导出编排能力  
- `auth-provider` 留 `providers/` 至 R8-refactor；R1-move 只改 import 路径

### 5.4 已知耦合（document，R8-refactor 前不修）

`auth-provider` → `dapp-shell-store` / `dapp-actions`（auth 读 UI tab 态）。**不在 R1 强行解耦**，避免 scope 膨胀。

---

## 6. SSOT 注册表

| 领域 | Owner | Enforcement |
|------|-------|-------------|
| CSS token | `shared/styles/tokens/` | stylelint |
| CSS 入口 | **`shared/styles/home.css` + `dapp.css`** | 禁止 home import wallet-only 规则未用 |
| JS 色 | `shared/styles/theme.ts` | lint:hex |
| 断点 | `shared/config/breakpoints.ts` | — |
| 链/合约 | `shared/config/` | lint:hex + review |
| API path | `shared/api/endpoints.ts` | knip |
| HTTP 401 | **`shared/api/http-errors.ts`** | R0.5 |
| 业务规则 | `core/*` | depcruise |
| 链上 IO | `views/dapp/web3/` | eslint thirdweb 白名单 |
| Tab | `views/dapp/dapp-tabs.tsx` | review |

---

## 7. Tab Registry

R0 引入 `views/dapp/dapp-tabs.tsx`；`dapp-shell` **只读 registry**。

- Phase B：**仅改 registry** 中 tab 模块路径  
- R0 用 **静态 import**（非 lazy），避免首屏 Suspense 回归；lazy 留 Phase C 可选  
- `SwapSubviewProviders` 随 swap 条目在 registry 挂载  

---

## 8. Shim 策略

旧路径一行 `export * from '...'`；**R8-refactor 统一删除**。

- R1-move 起：`scripts/lint-shims.mjs` 登记路径 + 到期 PR  
- R8-refactor：`lint:shims` 纳入 `lint:all`  

---

## 9. 执行计划（rev3 · ~18 merge 点）

### 9.0 总览

```
Phase A   R0 → R0.5 → R1-move → R2-move → R2-refactor
Phase B   R3-move → R3-refactor → R4-move → R4-refactor → … → R7-move → R7-refactor
Phase C   R8-move → R8-refactor
```

**Per-tab 闭环**：`Swap-move → 验 parity → Swap-refactor → 验`；不等到全站迁完再重构任一 tab。

| PR 类型 | 允许 | 禁止 |
|---------|------|------|
| **`-move`** | `git mv`、改 import、registry、shim、CSS **路径** | 改 className、改组件树、改业务逻辑、顺手 format |
| **`-refactor`** | 抽组件、收 CSS/tv、删重复、小逻辑整理 | 与 `-move` 混在同一 PR |

细则见 [`refactor-execution-playbook.md`](./refactor-execution-playbook.md)。

### 9.1 迁移 PR 契约（`-move`）

- 文件按附录 A 映射搬迁；旧路径 **shim** + `lint-shims.mjs` 登记  
- R3+ **仅改 registry 路径**，不改 tab 行为  
- `pnpm build` + `pnpm test:unit` 全绿  
- DApp：该 tab PC/H5 snapshot 与 **move 前 main** 对比（`maxDiffPixelRatio: 0.02`）  
- diff 审查：**不应出现**业务逻辑 / className hunks  

### 9.2 重构 PR 契约（`-refactor`）

- **前置**：对应 `-move` 已 merge 且 parity 基线已建立  
- 遵循 [`design-system-audit.md`](./design-system-audit.md) variant 规则  
- 浏览器 MCP / Playwright 对比 **move 后** baseline  
- diff ≤800 行；超出拆 PR  

### 9.3 Merge 清单

| PR | 内容 | 天数 | diff 上限 |
|----|------|------|-----------|
| **R0** | Tab Registry；`dapp-shell` 只读 registry | 1 | 200 |
| **R0.5** | `http-errors.ts` + 改 3 处 import | 0.5 | 80 |
| **R1-move** | core 15 + views/dapp/auth 4 + shim + depcruise/eslint | 3 | 800 |
| **R2-move** | CSS **路径**迁 shared/styles；home/dapp 双入口；**不改 token 值** | 2 | 800 |
| **R2-refactor** | tokens、theme.ts、lint:hex（过小可并入 R3-refactor） | 2 | 800 |
| **R3-move** | Swap → `views/dapp/swap/` + registry + shim | 2 | 800 |
| **R3-refactor** | Swap 抽组件 / 收 CSS | 2 | 800 |
| **R4-move** | Genesis → `views/dapp/genesis/` | 1.5 | 800 |
| **R4-refactor** | Genesis section 组件化 | 1.5 | 800 |
| **R5-move** | Rewards + `format-display.ts` | 1.5 | 800 |
| **R5-refactor** | Rewards tier/table UI | 1.5 | 800 |
| **R6-move** | Community | 1 | 800 |
| **R6-refactor** | Community stat/table chrome | 1 | 800 |
| **R7-move** | Home + home-renderer + **home-reveal-loader rename** + render-home.mjs | 2 | 800 |
| **R7-refactor** | Home 去 thirdweb（load-opt Phase 1）· 可选 inline i18n · section 抽取 | 2 | 800 |
| **R8-move** | `components/`→`shared/ui/`；config/web3/lib 剩余 | 3 | 800 |
| **R8-refactor** | shell/providers→bootstrap；**删 shim**；`lint:all` | 2 | 800 |

**R3-move 若超 800 行**：拆 `R3-move-web3` + `R3-move-views`。

**并行说明**：R1-move 与 R2-move **可并行开发**；**merge 顺序** R0→R0.5→R1-move→R2-move→R2-refactor→R3-move→…

**工期**：Phase A ~1.5 周 · Phase B ~3.5 周 · Phase C ~1.5 周 → **6–8 周**

**可选并行（不挡 R0）**：Home load-opt Phase 1 默认 **R7-refactor**；可独立 PR。

### R2 CSS（R2-move 路径 · R2-refactor 语义）

**R2-move**（仅路径，规则不变）：

**现状**：`home.css` → globals + **wallet.css** + home-motion；`dapp.css` → foundations + **wallet.css**。

**R2-move 终态路径**：

```
shared/styles/tokens/*          # 目录就位；值可暂不改
shared/styles/foundations.css
shared/styles/home.css          # home main 引用
shared/styles/dapp.css          # dapp main 引用
```

**R2-refactor**：token 值 SSOT、`theme.ts`、`lint:hex`、stylelint baseline。

- **禁止** 把 `wallet.css` 并入 home 首屏 bundle（对齐 static-homepage 性能红线）  
- `connect-theme` hex → `theme.ts`（R2-refactor）；物理文件仍 `web3/connect-theme` 至 R8-move  

### R7 Home（move / refactor 拆分）

#### R7-move

- [ ] `src/home/**` → `views/home/**`  
- [ ] **`wallet-loader.ts`** → `views/home/home-reveal-loader.ts` + rename（**行为不变**）  
- [ ] `scripts/render-home.mjs` 更新 SSR 路径  
- [ ] E8：**24** HTML 入口 + redirect；reveal / 计数 / 懒图  

#### R7-refactor

- [ ] Home 去 `WebRootProviders`（[`homepage-load-optimization.md`](./homepage-load-optimization.md) Phase 1）  
- [ ] 可选 locale inline i18n（Phase 2）  
- [ ] section 组件抽取 / CSS 去重  

#### Home 与钱包 / 动效（现状 vs 目标）

| 问题 | **现状（代码）** | **R7 / 目标** |
|------|------------------|---------------|
| Home 是否探测 / 连接钱包？ | **否** — CTA 为 `<a href="…/app.html">`；无 ConnectButton | 保持 |
| Home 是否 import thirdweb？ | **是** — `home/main.tsx` → `WebRootProviders` | **R7-refactor** 移除；见 load-optimization |
| `wallet-loader.ts` 是什么？ | **动效 boot**，非钱包 | **R7-move** rename → `home-reveal-loader` |
| R7 应删 wallet-loader 吗？ | **否** — rename 保留动效 | 除非产品去掉 reveal/计数 |

**代码 SSOT**：[`homepage-architecture.md`](./homepage-architecture.md)

**Rename 对照**（**R7-move**）：

| 现名 | 终态 |
|------|------|
| `src/wallet-loader.ts` | `views/home/home-reveal-loader.ts` |
| `bootWalletLoader()` | `bootHomeReveal()`（或 `bootHomeMotion()`） |
| `html[data-wallet-loader-ready]` | `html[data-home-motion-ready]`（可选，与 TS 同步） |
| `home-motion.css` 注释中的 wallet-loader | 改为 home-reveal-loader |

`home.css` 引用 **`wallet.css`** 仅为 CTA **视觉 token**（`.aegis-thirdweb-button`），**不是**加载钱包 SDK；R2 双 bundle 仍禁止把 dapp-only wallet 规则打进 home 首屏。

**加载性能**：Phase 1 默认 **R7-refactor**；Phase 2 inline i18n 可跟 R7-refactor 或独立 PR。

### R3 Swap 注意

- **R3-move**：registry 更新 swap 路径；**禁止** 抽组件 / 改 class  
- **R3-refactor**：dapp-card / side card；**dapp-card 68 处 tab class** — 登记 §13  

---

## 10. 工具链

### 10.1 硬规则（2 条 CI · R1-move 起）

| # | 规则 | 工具 |
|---|------|------|
| 1 | core 纯净 | depcruise `core-is-pure` |
| 2 | thirdweb 白名单 | eslint `no-restricted-imports` |

### 10.2 depcruise（3 条 · R1 warn/error 见下）

```js
// .dependency-cruiser.cjs
module.exports = {
  forbidden: [
    {
      name: 'core-is-pure',
      severity: 'error',
      from: { path: '^src/core/' },
      to: {
        path: '^(react|react-dom|thirdweb|viem|@tanstack|zustand|src/views|src/shared|src/app)',
        pathNot: '^src/core/',
      },
    },
    {
      name: 'shared-no-views',
      severity: 'error',  // R1-move 起
      from: { path: '^src/shared/' },
      to: { path: '^src/(views|core)/' },
    },
    {
      name: 'web3-gateway',
      severity: 'warn',     // R8-move → error
      from: {
        path: '^src/',
        pathNot: '^src/web3/|^src/views/dapp/web3/|^src/views/dapp/auth/',
      },
      to: { path: '^thirdweb' },
    },
    {
      name: 'ui-is-dumb',
      severity: 'warn',     // R8-move → error
      from: { path: '^src/shared/ui/' },
      to: { path: '^src/(views|core)/' },
    },
  ],
  options: { tsPreCompilationDeps: true, tsConfig: { fileName: 'tsconfig.json' } },
}
```

> **口径**：对外称 **2 硬规则** = eslint thirdweb + depcruise core-is-pure；depcruise 另 2–3 条渐进 warn→error。

### 10.3 脚本

```json
{
  "lint": "eslint .",
  "lint:css": "stylelint \"src/**/*.css\"",
  "lint:hex": "node scripts/lint-hex.mjs",
  "lint:architecture": "depcruise src --config .dependency-cruiser.cjs",
  "lint:deadcode": "knip --include exports,dependencies,duplicates",
  "lint:shims": "node scripts/lint-shims.mjs",
  "lint:all": "pnpm lint && pnpm lint:css && pnpm lint:hex && pnpm lint:architecture && pnpm lint:deadcode && pnpm lint:shims"
}
```

| 阶段 | CI |
|------|-----|
| R0 | build · eslint · test:unit · E1 |
| R0.5+ | 同上 |
| R1-move | + lint:architecture · shared-no-views |
| R2-refactor | + stylelint · lint:hex · knip |
| R8-refactor | lint:all |

### 10.4 契约测试

`tests/unit/depcruise-config.test.mjs` — 断言规则名存在；R1 起 CI 跑。

---

## 11. 样式与 dapp-card

- R2-move / R2-refactor：双 bundle + tokens（§9）  
- dapp-card：**R3-refactor** 起；**R3-move 不改 class** — §13  
- shell-layout tv：R8-refactor 可选  

---

## 12. 验收

### 12.1 E2E / Parity

| ID | 场景 | move 必跑 | refactor 对比基线 |
|----|------|-----------|-------------------|
| E1 | DApp 未连接 | R0 | move 后 |
| E2–E4 | Swap | **R3-move** | R3-move merge |
| E5 | Genesis | **R4-move** | R4-move merge |
| E6 | Rewards | **R5-move** | R5-move merge |
| E6b | Community | **R6-move** | R6-move merge |
| E7 | 全站快照 | R2-move、各 tab **-move** | 各 tab **-refactor** |
| E8 | Home 24 HTML | **R7-move** | R7-refactor |

SLO：3 跑 2 绿。**`-move` PR 未过 parity 禁止开 `-refactor` 分支 merge。**

### 12.2 thirdweb 手工（R3+）

Injected · 内置浏览器 · WC · EIP-6963 · 链切换 — FAIL 则 revert。

### 12.3 测试路径

`tests/unit/core/` · `views/dapp/auth/` · `views/dapp/web3/` · `shared/api/` · `shared/config/` · `views/home/`

### 12.4 R8-refactor 终态

core 15 文件 · depcruise 0 · knip 0 · **shim 0** · 旧顶层目录 0

### 12.5 每 PR DoD

**`-move`**：build · test:unit · **parity 截图** · registry/shim · 无 className/逻辑 hunks · diff ≤800  

**`-refactor`**：build · test:unit · 对比 **move baseline** · diff ≤800

---

## 13. 风险

| 风险 | 缓解 |
|------|------|
| Registry 回归 | R0 E1 |
| move/refactor 混 PR → bisect 失败 | **§9 两拍纪律** + playbook CR |
| R8 过大 | **R8-move / R8-refactor** |
| home 首屏加载 dapp CSS | **R2-move 双 bundle** |
| home 首屏加载 thirdweb JS | **R7-refactor** [`homepage-load-optimization.md`](./homepage-load-optimization.md) |
| dapp-card 遗留 tab class | **R3-refactor** 登记 |
| auth fetch→login 耦合 | **R0.5 http-errors** |
| wallet-loader 误删或漏迁 | **R7-move** rename 保留动效 |
| E2E 基线缺失 | **R3-move 前**补最小 Playwright snapshot |
| 并行 R1/R2 冲突 | 线性 merge 顺序 |

---

## 14. 分支

`refactor/r0-tab-registry` → `refactor/r0.5-http-errors` → `refactor/r1-move-core-auth` → `refactor/r2-move-css` → …  

命名：`refactor/r{N}-move-{scope}` · `refactor/r{N}-refactor-{scope}`（见 playbook）

---

## 附录 A · lib/ 49 文件映射

（同 rev1 · auth/format-display/web3/query 见 §5、§9）

| 源 | 终态 |
|----|------|
| swap 算法 ×7 | core/swap/ |
| swap format-* | views/dapp/swap/ |
| presale 算法 ×4 | core/presale/ |
| presale genesis-* | views/dapp/genesis/ |
| auth core ×4 | core/auth/ |
| auth 编排 ×4 | views/dapp/auth/ |
| format-display | views/dapp/format-display.ts |
| api 其余 + query ×4 | shared/api/ |
| lib/web3 ×2 | views/dapp/web3/ |
| breakpoints | shared/config/ |
| 其余 lib 工具 | shared/lib/ |
| page-scroll-restoration | views/dapp/shell/ |
| suppress-known-console-noise | app/bootstrap/ |

## 附录 B · Store / Context / Config / Web3

Store：4 → `state/`；2 → `swap/` colocate  
Context：shell / genesis / swap×2  
Config ×8 · Web3 ×21 → R8b  

Config ×8 · Web3 ×21 → R8-move  

## 附录 C · rev3 吸收

| 主题 | 处理 |
|------|------|
| 先迁移再重构 | **§9 move/refactor 两拍**；playbook SSOT |
| 组件抽取时机 | **R3-refactor 起**，不在 R3-move |
| Per-tab 闭环 | 不等到全站迁完再 refactor |
| rev2 其余决策 | 不变（core 15、Tab Registry、双 bundle、auth 两目录） |

## 附录 D · 目录裁决规则

1. **≥2 tab 或 ≥2 层消费** → `views/dapp/` 根或 `shared/`  
2. **单 tab** → colocate 该 tab 目录  
3. **纯函数无 IO** → 候选 `core/`（须进 15 文件清单）  
4. **禁止** 为 1–2 个文件新建子目录（如 `tables/`）除非文件 >300 行且稳定  

`format-display`：genesis + rewards + community → **留 `views/dapp/format-display.ts`**

---

## 附录 E · 评审综合分（rev2 自评）

| 维度 | rev1 | rev2 |
|------|------|------|
| 架构边界 | 8 | **9** |
| 可执行性 | 7 | **9** |
| 极简 | 8.6 | **8.8** |
| 工具链闭环 | 7 | **9** |
| CSS/Home | 7 | **9** |
| Auth 数据流 | 8 | **9** |
| **综合** | **8.2** | **9.0** |

---

**文档**：[`refactor-execution-playbook.md`](./refactor-execution-playbook.md) · [`README.md`](./README.md) · [`homepage-architecture.md`](./homepage-architecture.md)

**下一步**：**R0 Tab Registry**（进行中）→ **R0.5** → **R1-move**
