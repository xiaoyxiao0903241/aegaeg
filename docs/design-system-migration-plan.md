# Design System 迁移计划（Foundation → Pages）

> **版本**：v2.0 · **2026-07-08**  
> **审查**：Composer 2.5 ×5 二次盲评 → [`design-token-audit-synthesis.md`](./design-token-audit-synthesis.md) **v3.0**
> **验收**：**先 dev computed parity** → 再 Figma canonical 帧 · 每切片 **dev diff 可回滚**  
> **规范 SSOT**：[`aegis-design-system-spec.md`](./aegis-design-system-spec.md) · [`design-token-tiers.md`](./design-token-tiers.md) · [`component-anatomy.md`](./component-anatomy.md)  
> **流程 SSOT**：[`style-refactor-playbook.md`](./style-refactor-playbook.md)

**用户定稿（2026-07-08）**：

1. **探针页**：每个 Foundation PR 以 **Swap PC/H5**（Figma `12:2` / `62:2`）验收  
2. **两阶段 parity**：Foundation / 逐页均 **先 100% dev computed 一致**，再开切片向 Figma 靠拢  
3. **Card surface 收束**：删 home/dapp 双轴重叠；见 [`component-anatomy.md`](./component-anatomy.md)

---

## 总览

```text
Phase 0  基线（只读）
P0       Theme + Token CSS（不动 call site）
P1       组件 Foundation（Text → Button → Card → FaqList → Input → shell cards）
P2       逐页替换 + 删 legacy className
P3       清债（alias · 常量 · shell 断点集中）
```

**断点策略（目标态）**：

| 层级 | `max-dapp:` / `dapp:` |
|------|------------------------|
| Text / Button / Input / FAQ 叶子 | **0** — 响应式在 variant + `--dapp-type-*` `@media` |
| Card / shell primitive | **极少** — 仅 layout（display/padding/gap） |
| `shell-layout.ts` | **集中保留** — rail 隐藏、window 形态等 |
| 页面 call site | **禁止** typography 断点 class |

---

## Phase 0 — 基线（只读）

| 交付物 | 说明 |
|--------|------|
| Swap computed 快照 | PC + H5 · 顶栏 / rail / 主卡 / FAQ / Button / Input |
| 样式栈表 | top 20 call site + 5 个 Foundation 组件定义 |
| 31 帧路由映射 | `figma-pages-inventory.md` → dev route |

**命令**：`pnpm compare:style-baseline` · `pnpm compare:computed`（Swap route）

**产出路径（须 commit）**：

- `docs/baselines/swap-pc-computed.json`
- `docs/baselines/swap-h5-computed.json`
- `docs/baselines/swap-style-stack.md`

**验证**：快照入库；无业务写盘

---

## P0 — Theme + Token（CSS only）

### 10 variant PC→H5 px（验收 SSOT）

| variant | PC | H5 |
|---------|----|----|
| rail | 10 | 10 |
| kicker | 11 | 12 |
| meta | 13 | 13 |
| detail | 14 | 14 |
| question | 15 | 15 |
| headline | 16 | 15 |
| brand | 17 | 18 |
| section | 18 | 16 |
| widget-title | 21 | 22 |
| amount | 22 | 23 |

### site-fluid typography（冻结）

**纯 px-lock**：`--dapp-type-*` 一律 `Npx`；`html.site-fluid` 根 rem 阶梯 **只** 放大 shell/layout/icon rem，**不** 改字号 var。

| 任务 | 文件 |
|------|------|
| 校准 `--foreground` → Figma ink `#0b0e14`（hex 先行） | [`theme.css`](../src/shared/styles/tokens/theme.css) |
| Tier B hex 收编 | theme.css |
| **E1–E6** shadow · radius pill/sm/md/lg/xl | theme.css `@theme` |
| **10 档 px-locked** `--type-*` + legacy `--dapp-type-*` alias | [`tokens/theme.css`](../src/shared/styles/tokens/theme.css) |
| H5 **逐 variant** `@media (max-width:820px)` | theme.css |
| DApp **禁用** Home blanket `--text-*` +1 | `html:not(.dapp-app)` in theme.css |
| site-fluid typography **纯 px-lock** | theme.css site-fluid `@media` |
| Card/Button/Input/FAQ **anatomy token** 文档 | [`component-anatomy.md`](./component-anatomy.md) |

**验证**：`pnpm lint:all` · token 单元测试 · **Legacy WebView**（下）· **不改 call site**

### Legacy WebView（Chrome 90–91）

| 规则 | 原因 |
|------|------|
| Typography `--dapp-type-*: Npx` | 与 site-fluid 解耦 |
| semantic 色 hex 先行 | oklch &lt;111 丢弃 |
| `@media (max-width: 820px)` 字面量 | 禁止 range syntax |
| 验收 **prod build** | dev 不跑 lightningcss |

---

## P1 — 组件 Foundation（每组件 1 PR）

**顺序**：Text → Button → Card → FaqList → AmountInput → shell cards（MetricCard 等）

**每个 PR 流程**（Playbook 强制）：

1. `compare:computed` / style-baseline — **改前** Swap PC+H5  
2. 样式栈表 → **单一 owner**（variant / surface / size）  
3. 改 primitive；call site **仅 Swap 探针**  
4. computed **parity PASS**（与 Phase 0 基线一致）  
5. dev diff 三行  

**验收 SSOT（v3 仲裁）**：

- **主 gate**：`compare:computed` vs `docs/baselines/`  
- **Figma 辅助**：screenshot / 帧对照 — **第二 PR** 或 P2 后半  
- **禁止** 无基线对比的「目测放行」

**第二 PR（可选同组件）**：向 Figma 靠拢（色/间距/字阶），仍 Swap 探针 + Figma 帧对照

| 组件 | P1 目标 |
|------|---------|
| **Text** | 10+3 compound；删 `weight`；H5 在 CSS var |
| **Button** | variant×size×shape；typography 无 `max-dapp:` |
| **Card** | surface 收束（见 anatomy）；E1–E6 mapping |
| **FaqList** | `question` + `detail`；spacing tier slot |
| **AmountInput** | `--dapp-type-amount` 或 input token |
| **shell cards** | 删 hand-rolled `<strong>` class；Tier B 内化 |

**验证**：Swap `12:2`/`62:2` computed PASS · grep 该组件 **0** 新增 `max-dapp:` typography

---

## P2 — 逐页替换

顺序：**Swap**（补全非探针区）→ **Genesis** → **Rewards** → **Community** → **Home** → overlay/modal

每页 PR：

1. Playbook 样式栈（改前）  
2. call site → 新 variant / surface / tone  
3. 删该页 `*Class` 常量 · legacy variant  
4. computed parity → Figma 对照  
5. dev diff 三行  

**验证**：该页 `rg 'max-dapp:(text-|font-|leading-|tracking-)'` → 0

---

## P3 — 清债

- 删 legacy Text variant / `dapp-type-scale.ts` 双 SSOT  
- `rg` 零 scattered typography · 零未用 `*Class`  
- shell-layout 能下沉 CSS 的再收一轮  
- 更新 [`typography-baseline.md`](./typography-baseline.md)  
- **全 canonical 帧** Figma PASS  

**验证**：`pnpm check` · build · Legacy WebView smoke

---

## dev diff 模板

```text
Slice: <p0|p1-text|p2-swap|…> | Route: Swap PC/H5
Parity: compare:computed PASS (dev baseline) | Figma delta: <none|摘要>
Delta & rollback: <摘要> | revert: git revert <sha>
```

---

## 风险登记

| # | 风险 | 缓解 |
|---|------|------|
| 1 | site-fluid 放大 rem 字号 | px-lock typography |
| 2 | foreground 改色全站跳变 | 单 PR · 先 parity 再 Figma 色 |
| 3 | 去 blanket +1 H5 回归 | 逐 variant 表 · Swap H5 探针 |
| 4 | Card surface 迁移漏改 | anatomy 表 + rg `surface=` |
| 5 | parity 后 Figma 切片过大 | 组件/页拆分 PR |
| 6 | Chrome 91 oklch / 断点 | hex-first · prod build |
| 7 | `max-dapp:` 删不干净 | P1 grep gate · shell 白名单 |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v2.0 | 2026-07-08 | Foundation→Pages；Swap 探针；parity-first；Card 收束；v3 仲裁补丁 |
| v1.1 | 2026-07-08 | Legacy WebView |
| v1.0 | 2026-07-08 | tokens-first Phase 0–6 |
