# React Runtime（Compiler · Hooks · i18n）

> **SSOT**：React 19 运行时约定、Compiler 启用策略、hooks/i18n 渲染规则。  
> 命令门禁见 [`agents/commands.md`](./agents/commands.md)。  
> 切片地图：S0–S8（质量重构 epic）。

## 0. 版本事实

| 项 | 现状 |
|----|------|
| React | `^19.2.7`（[`package.json`](../package.json)） |
| Vite | `^8` + `@vitejs/plugin-react` `^6` |
| React Compiler | **annotation 金丝雀已启用**（[`vite.config.ts`](../vite.config.ts)：`reactCompilerPreset({ compilationMode: 'annotation' })`） |
| 浏览器目标 | `chrome >= 90` + `@vitejs/plugin-legacy` |

**纠正**：React 19 **不**内置 Compiler。Compiler 是独立 `babel-plugin-react-compiler`；未接入前，删除 `useMemo`/`useCallback` 是真回归。

官方： [React Compiler introduction](https://react.dev/learn/react-compiler/introduction) · [Installation (Vite)](https://react.dev/learn/react-compiler/installation)

---

## 1. S0 基线（2026-07-10）

环境：`pnpm env:status` → **prod**（仅 `.env`）。

| 探针 | 结果 |
|------|------|
| `tsc -b` | 0 error |
| `eslint src` | **59 warning / 0 error** |

### 按规则

| 规则 | 计数 |
|------|------|
| `react-refresh/only-export-components` | 43 |
| `react-hooks/set-state-in-effect` | 11 |
| `react-hooks/exhaustive-deps` | 5 |

### 热文件（Top）

- **only-export**：`shared/ui/card.tsx`(8)、`rewards-widget-primitives.tsx`(5)、`dapp-tabs.tsx`(3)、contexts / widget composites
- **set-state-in-effect**：`use-genesis-widget.ts`(2)、`dapp-mobile-nav`、`swap-slippage-modal`、`wallet-details-modal`、`use-capped-token-amount-input`、…
- **exhaustive-deps**：`use-genesis-widget.ts`(2)、`auth-provider`、`dapp-rail`、`genesis-purchase-form`

### S3 进度（2026-07-10）

**已修：**

- `exhaustive-deps`：`auth-provider`（`activeTab`）、`dapp-rail`（删死依赖 `rateLabel`）、`use-genesis-widget`（`phases` 稳定化）、`genesis-purchase-form`（deps 收窄）
- `set-state-in-effect` 改写：`swap-slippage-modal`（open 时 remount）、`wallet-details-modal`（`onOpenChange` 清 copied）

**保留（契约登记，S6/动画类）：**

- `dapp-mobile-nav` 进出场 mount
- `dapp-rail` indicator / `rAF`
- `use-genesis-widget`：换地址重置 shares；`maxShares` 钳制
- `genesis-purchase-form`：`sharesText` 与 `shares` 镜像（输入草稿）
- `use-capped-token-amount-input`、quote error effect 等 → S6 派生/写入时 cap

### Chrome90 / 行为冒烟清单（S2+ 必跑）

- [ ] Home：首屏 reveal / 指标区动效
- [ ] DApp：Swap 改金额 → 报价 / 提交门禁
- [ ] DApp：Flash 同构
- [ ] Genesis：份额输入 / maxShares=0 禁用
- [ ] Connect / SIWE / 换钱包
- [ ] `pnpm build` + legacy 产物可加载

---

## 2. Compiler 策略（S2）

**状态（2026-07-10）**：annotation 金丝雀已接入；`pnpm build` + `pnpm check` PASS；产物含 Compiler cache helper（`_c(`）。金丝雀组件：`FlashSwapWidget`、`TradeSwapWidget`、`GenesisPurchaseForm`（`"use memo"`）。全量模式待 Chrome90 冒烟后切换。

1. 安装：`babel-plugin-react-compiler`、`@rolldown/plugin-babel`、`@babel/core`
2. Vite：`react()` + `babel({ presets: [reactCompilerPreset({ compilationMode: 'annotation' })] })`
3. **先** annotation，Swap/Genesis 叶子 `"use memo"` 金丝雀 — **已完成**
4. Chrome90 + `pnpm build` PASS 后切全量（去掉 `compilationMode: 'annotation'` 或改 `all`/`infer`）
5. ESLint：`react-hooks` → `recommended-latest` — **已完成**
6. 逃生：`"use no memo"`（临时）；修根因后删除

**禁同 PR**：改 auth Provider 顺序、改 `home-reveal-loader`、盲删存量 memo。

### useMemo / useCallback（官方口径）

| 场景 | 做法 |
|------|------|
| 新代码 + Compiler 已开 | 默认不写；需要精确控制（尤其 **effect 依赖**、第三方边界）再写 |
| 存量 | 先留；Compiler 稳定后逐文件测再删（S7） |
| 未开 Compiler | **禁止**为「React 19」删 memo |

---

## 3. Hooks / 结构约定

1. **纯函数外提**：不依赖 props/state 的逻辑 → 模块顶层或 `src/core/*`
2. **能算就不存**：派生值用表达式；禁 `useEffect` + `setState` 镜像 props
3. **Effect 只同步外部系统**：DOM / 订阅 / 动画进出场；弹窗草稿用 `key` 或 `onOpenChange`
4. **exhaustive-deps**：修根因，禁 `eslint-disable` 糊弄
5. **保留并登记**：`dapp-mobile-nav` 进出场、`dapp-rail` indicator/`rAF`（动画类，勿机械消 lint）

---

## 4. i18n 渲染约定

1. JSX 直接 `t.xxx`；**禁止**为单个字符串 `useMemo`
2. 单次 `replace` / `applyMessageTemplate`：随数据 inline
3. 仅 memo 子组件需稳定引用，或昂贵格式化链（大列表 map）才 memo
4. `useCallback` deps 用 `t` 或 `locale`，勿逐字段拆 deps
5. 占位符统一 `applyMessageTemplate`

同 locale 下 `messages` 为模块单例；字符串 lookup **不值得** memo。

---

## 5. 切片门禁（摘要）

| 片 | 要点 |
|----|------|
| S0–S1 | 本文档 + 基线 |
| S2 | Compiler |
| S3 | hooks lint |
| S4 | i18n 减法（+ locale 懒加载 S4b） |
| S5 | only-export 拆文件 |
| **S5b** | **补测 + ≥2 子 agent 盲评 PASS → 才可 S6** |
| S6 | 纯函数 / 派生状态 |
| S7 | 谨慎删冗余 memo |
| S8 | CI 升 error + 收口 |

### S5b 硬规则

- 未 PASS → **禁止** S6 写盘
- 主 agent 不得自审自过
- 补测覆盖：Swap/Flash/Genesis 门禁、token amount cap、触达的 claim/auth

---

## 6. S5b 审核记录

（执行 S5b 时追加子 agent 结论与仲裁。）
