# React Runtime（Compiler · Hooks · i18n）

> **SSOT**：React 19 运行时约定、Compiler、hooks/i18n、质量门禁。  
> 命令见 [`agents/commands.md`](./agents/commands.md)。目录落点见 [`src-layout.md`](./src-layout.md)。

## 0. 版本事实

| 项 | 现状 |
|----|------|
| React | `^19.2.7`（[`package.json`](../package.json)） |
| Vite | `^8` + `@vitejs/plugin-react` `^6` |
| React Compiler | **全量**（[`vite.config.ts`](../vite.config.ts)：`reactCompilerPreset()`） |
| 浏览器目标 | `chrome >= 90` + `@vitejs/plugin-legacy` |

React 19 **不**内置 Compiler；Compiler 是独立 `babel-plugin-react-compiler`。

官方：[Introduction](https://react.dev/learn/react-compiler/introduction) · [Installation (Vite)](https://react.dev/learn/react-compiler/installation)

---

## 1. Compiler

| 项 | 约定 |
|----|------|
| 模式 | 全量（已过 Chrome90 冒烟，见 §5） |
| 逃生 | `"use no memo"`（临时）；修根因后删除 |
| 新代码 | 默认不写 `useMemo` / `useCallback`；**effect 依赖**或第三方边界需要稳定引用时再写 |
| 存量 memo | 可逐文件测后删；**勿**盲删 effect 依赖上的 `useCallback` |
| 禁同 PR | 改 auth Provider 顺序、改 `home-reveal-loader`、盲删存量 memo |

`"use memo"` 标注可保留（无害）；全量模式下不再作为启用开关。

---

## 2. Hooks / 结构

1. **纯函数外提**：不依赖 props/state → 模块顶层或 `src/core/*`
2. **能算就不存**：派生用表达式；禁 `useEffect` + `setState` 镜像 props
3. **Effect 只同步外部系统**：DOM / 订阅 / 动画进出场；弹窗草稿用 `key` 或 `onOpenChange`
4. **`exhaustive-deps`**：门禁为 **error**；修根因，禁 `eslint-disable` 糊弄
5. **`set-state-in-effect`**：门禁为 **warn**；登记债（勿机械消 lint）：
   - `dapp-mobile-nav` 进出场 mount
   - `dapp-rail` indicator / `rAF`
   - `use-referral`
   - `use-home-popup-notice`
6. **`only-export-components`**：**off**（允许组件文件同导出 `tv()` / helper）

Money-path SSOT（须 fail-closed）：

| 门禁 | 位置 |
|------|------|
| Genesis shares clamp / `shares≥1` / `maxShares=0` | `clampGenesisShares` · `formatGenesisSharesText` · `canPurchaseGenesis` |
| Token amount 余额下降 re-cap | `resolveCappedTokenAmountRaw` |
| Stale quote 不驱动 submit | `resolveLiveQuotedOut` · `canSubmitQuotedSwap`（Swap/Flash） |

表征测：[`tests/unit/react-quality-gates.test.mjs`](../tests/unit/react-quality-gates.test.mjs)

---

## 3. i18n 渲染

1. JSX 直接 `t.xxx`；**禁止**为单个字符串 `useMemo`
2. 单次 `replace` / `applyMessageTemplate`：随数据 inline
3. 仅子组件需稳定引用，或昂贵格式化链才 memo
4. `useCallback` deps 用 `t` 或 `locale`，勿逐字段拆
5. 占位符统一 `applyMessageTemplate`

同 locale 下 `messages` 为模块单例；字符串 lookup **不值得** memo。

---

## 4. 验证门禁

| 命令 | 范围 |
|------|------|
| **`pnpm check`** | `tsc` + `lint:src`（error）+ architecture + **unit** |
| **git pre-commit** | staged eslint + `tsc`；**不含** e2e |
| `pnpm test:e2e` | Playwright；**手动 / 可选**（不进 hook、不进 `check`） |

Money-path 契约（可选）：[`tests/e2e/dapp-money-path-contract.spec.ts`](../tests/e2e/dapp-money-path-contract.spec.ts)

---

## 5. Chrome90 / 行为冒烟（Compiler 全量前置 — 已全部 PASS）

- [x] Home：首屏 reveal / 指标区动效 — 人工 PASS
- [x] DApp：Swap 改金额 / 提交门禁 — e2e + 表征测 stale quote
- [x] DApp：Flash 同构 — 表征测（Flash 已接线）
- [x] Genesis：份额输入 / `maxShares=0` 禁用 — e2e + unit（含 `shares≥1`）
- [x] Connect / SIWE / 换钱包 — 人工 PASS
- [x] `pnpm build` + legacy 产物可加载 — PASS（Compiler 全量后）

---

## 6. Epic 归档（S0–S8 · 已完成）

质量重构 epic 已收口：Compiler 全量、hooks error 门禁、派生替镜像 effect、表征测、目录扁平。  
历史切片细节以 git 历史为准；**勿**再按「待切全量 / 待冒烟」执行。
