# React Runtime（Compiler · Hooks · i18n）

> 命令：[`agents/commands.md`](./agents/commands.md)。目录：[`src-layout.md`](./src-layout.md)。

## 版本

| 项       | 现状                                               |
| -------- | -------------------------------------------------- |
| React    | `^19.2.7`                                          |
| Vite     | `^8` + `@vitejs/plugin-react` `^6`                 |
| Compiler | 全量（`vite.config.ts` → `reactCompilerPreset()`） |
| 目标     | `chrome >= 90` + legacy plugin                     |

## Compiler

- 新代码默认不写 `useMemo` / `useCallback`；effect 依赖或第三方边界需要稳定引用时再写。
- 逃生：`"use no memo"`（临时）；修根因后删。
- 勿盲删 effect 依赖上的 `useCallback`。

## Hooks

1. 纯函数外提 → 模块顶或 `src/core/*`
2. 能算就不存；禁 `useEffect` + `setState` 镜像 props
3. Effect 只同步外部系统；弹窗草稿用 `key` / `onOpenChange`
4. `exhaustive-deps` = **error**；禁 `eslint-disable`
5. `set-state-in-effect` = **warn**；禁扩大 per-file 豁免
6. `only-export-components` = **off**

Money-path 表征测：`tests/unit/react-quality-checks.test.mjs`。

## i18n

- JSX 直接 `t.xxx`；禁为单字符串 `useMemo`
- `useCallback` deps 用 `t` 或 `locale`
- 占位符：`applyMessageTemplate`

## 门禁

| 命令            | 范围                                     |
| --------------- | ---------------------------------------- |
| `pnpm check`    | tsc + eslint error + architecture + unit |
| pre-commit      | staged eslint + tsc；无 e2e              |
| `pnpm test:e2e` | 手动 / 可选                              |

**Compiler lint：** `eslint-plugin-react-compiler` → `react-compiler/react-compiler: error`（进 `lint:src --quiet`）。违反 Rules of React 的组件/hook 会被 Compiler 跳过优化。`react-hooks` 的 refs / set-state-in-effect 仍为 warn（登记债）；禁止在 render 期写 `ref.current`（用 `useLayoutEffect` 同步）。
