# React Runtime（Compiler · Hooks · i18n）

> 命令：[`agents/commands.md`](./agents/commands.md)。目录：[`src-layout.md`](./src-layout.md)。

## 版本

| 项 | 现状 |
|----|------|
| React | `^19.2.7` |
| Vite | `^8` + `@vitejs/plugin-react` `^6` |
| Compiler | **全量**（`vite.config.ts` → `reactCompilerPreset()`） |
| 目标 | `chrome >= 90` + legacy plugin |

## Compiler

- 新代码默认不写 `useMemo` / `useCallback`；effect 依赖或第三方边界需要稳定引用时再写。
- 逃生：`"use no memo"`（临时）；修根因后删。
- 存量 memo 可测后删；**勿**盲删 effect 依赖上的 `useCallback`。
- 禁同 PR：改 auth Provider 顺序、改 `home-reveal-loader`、盲删存量 memo。

## Hooks

1. 纯函数外提 → 模块顶或 `src/core/*`
2. 能算就不存；禁 `useEffect` + `setState` 镜像 props
3. Effect 只同步外部系统；弹窗草稿用 `key` / `onOpenChange`
4. `exhaustive-deps` = **error**；禁 `eslint-disable`
5. `set-state-in-effect` = **warn**（登记债仅 `dapp-mobile-nav`；已清：`use-referral`、`rewards-history`、`use-home-popup-notice`、`dapp-rail`）
6. `only-export-components` = **off**

Money-path 表征测：`tests/unit/react-quality-gates.test.mjs`（Genesis clamp / capped amount / stale quote）。

## i18n

- JSX 直接 `t.xxx`；禁为单字符串 `useMemo`
- `useCallback` deps 用 `t` 或 `locale`
- 占位符：`applyMessageTemplate`

## 门禁

| 命令 | 范围 |
|------|------|
| `pnpm check` | tsc + eslint error + architecture + unit |
| pre-commit | staged eslint + tsc；**无** e2e |
| `pnpm test:e2e` | 手动 / 可选 |
