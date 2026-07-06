# 重构执行手册（rev3）

> **SSOT 架构**：[`refactor-plan-minimal-world-class.md`](./refactor-plan-minimal-world-class.md)  
> **读者**：执行 R0–R8 的开发者 / AI agent  
> **纪律**：**先 `-move` 验 parity，再 `-refactor`**

---

## 1. PR 命名与分支

| 类型 | 分支示例 | PR 标题示例 |
|------|----------|-------------|
| move | `refactor/r3-move-swap` | `refactor(R3-move): relocate swap tab to views/dapp/swap` |
| refactor | `refactor/r3-refactor-swap` | `refactor(R3-refactor): extract swap side card primitives` |
| 骨架 | `refactor/r0-tab-registry` | `refactor(R0): introduce dapp tab registry` |

**Merge 顺序**：严格按 refactor-plan §9.3 表格；**`-refactor` 不得早于对应 `-move` merge**。

---

## 2. Move PR checklist（复制即用）

### 2.1 开始前

- [ ] 确认映射行（refactor-plan **附录 A** + 本 PR tab 行）
- [ ] 从最新 `main` 拉分支
- [ ] 若为首 tab move（R3-move）：确认 Playwright 基线存在或本 PR 先补最小 snapshot

### 2.2 实施（仅允许）

- [ ] `git mv` 或等价搬迁至终态路径
- [ ] 更新 **import**（含 registry、`dapp-tabs.tsx`）
- [ ] 旧路径 **一行 shim**：`export * from '~/views/...'`
- [ ] 登记 `scripts/lint-shims.mjs`（R1-move 起）
- [ ] CSS：**仅**改 `@import` 路径（R2-move）；**不改**规则/ token 值

### 2.3 禁止（出现即 reject）

- [ ] 改 `className` / Tailwind 字符串
- [ ] 改组件树结构（增删 wrapper、改条件渲染语义）
- [ ] 改业务逻辑、API 调用、store 语义
- [ ] 顺手 format 无关文件、重命名标识符（rename 专项 PR 除外）
- [ ] 与 `-refactor` 目标混在同一 PR

### 2.4 验收

```bash
pnpm build
pnpm test:unit
# 本 tab / 本层 E2E 或 snapshot（见 §5）
```

- [ ] DApp tab：PC + H5 snapshot，对比 **move 前 main**（`maxDiffPixelRatio: 0.02`）
- [ ] Home（R7-move）：24 HTML · reveal/计数/懒图 · 语言切换
- [ ] depcruise 无新增违规
- [ ] PR diff 自查：无 className / 逻辑 hunks

---

## 3. Refactor PR checklist

### 3.1 前置

- [ ] 对应 **`-move` 已在 main**
- [ ] 以 **move 后 main** 为 screenshot baseline

### 3.2 实施

- [ ] 抽组件 / 收 CSS / `tv()` variant（遵循 [`design-system-audit.md`](./design-system-audit.md)）
- [ ] codegraph `impact` 查共享改动面
- [ ] 可选：cursor-ide-browser `browser_snapshot` 确认重复 DOM 已收拢
- [ ] diff ≤800 行；超出拆 `refactor-a` / `refactor-b`

### 3.3 验收

```bash
pnpm build
pnpm test:unit
# snapshot 对比 move 后 baseline，非 move 前
```

---

## 4. Tab Registry（R0+）

- **SSOT**：[`src/views/dapp/dapp-tabs.tsx`](../src/views/dapp/dapp-tabs.tsx)（或 `.ts`）
- `dapp-shell` **只读** registry，禁止硬编码四 tab 组件 import
- R3-move 起：**仅改 registry 内模块路径**，不改 shell 分支逻辑
- `SwapSubviewProviders` 随 registry shell providers 挂载

---

## 5. Parity / E2E

| 配置 | 路径 |
|------|------|
| Playwright | [`playwright.config.ts`](../playwright.config.ts) · `toHaveScreenshot` · `maxDiffPixelRatio: 0.02` |
| Dev E2E 端口 | `5175` · `pnpm dev:e2e` |

**若 `tests/e2e` 缺失**：在 **R3-move 前**补最小用例（E1 + Swap PC/H5 各 1 张）。

### 浏览器 MCP（spot-check）

1. `browser_navigate` → `http://127.0.0.1:5174/en/app.html`
2. `browser_snapshot` 看 a11y 树
3. `browser_take_screenshot` 视觉确认
4. 需要 computed style 时用 `browser_cdp` + `CSS.getComputedStyleForNode`

**不替代** Playwright 回归；仅辅助 refactor 前找重复块。

---

## 6. 与 Home 性能文档

| 项 | 归属 PR |
|----|---------|
| Home 去 thirdweb | **R7-refactor**（或独立 PR，不挡 R0） |
| locale inline i18n | R7-refactor 或独立 |
| `wallet-loader` rename | **R7-move**（行为不变） |

见 [`homepage-load-optimization.md`](./homepage-load-optimization.md)。

---

## 7. 反面意见

- merge 点 ~18 → 用固定 checklist + 分支名降低管理成本
- move PR 夹带「小改 class」会摧毁 bisect → CR 必查 §2.3
- 无 E2E 基线则 parity 只能靠人工 → R3-move 前补 snapshot

---

## 8. 快速路由

| 任务 | 读 |
|------|-----|
| 总计划 | [`refactor-plan-minimal-world-class.md`](./refactor-plan-minimal-world-class.md) |
| 代码现状（Home） | [`homepage-architecture.md`](./homepage-architecture.md) |
| DApp 实操 | [`DAPP-GUIDE.md`](./DAPP-GUIDE.md) |
| 视觉 variant 规则 | [`design-system-audit.md`](./design-system-audit.md) |
