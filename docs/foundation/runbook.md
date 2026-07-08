# Foundation 重构 Runbook（L1 · 执行 SSOT）

> **API SSOT**：[`api.md`](./api.md) · **验收 SSOT**：[`verification.md`](./verification.md)

---

## 1. 边界

**In scope（P0–P7 · 全部）**

| 阶段 | 组件/任务 | 文件 | 说明 |
|------|-----------|------|------|
| P0 | Token 架构 | `src/shared/styles/tokens/tokens.json` + 生成 | JSON 源 SSOT，CI 生成 CSS/TS |
| P1 | Text | `src/shared/ui/text.tsx` | 10 variant × 5 tone |
| P2 | Card | `src/shared/ui/card.tsx` | 6 surface，无 context/fill/radius |
| P3 | Chip（新增） | `src/shared/ui/chip.tsx` | 替换 pct / badge / tab |
| P4 | Input | `src/shared/ui/input.tsx` | 合并 amount-input，3 variant |
| P5 | Button | `src/shared/ui/button.tsx` | 4 variant × 3 size × 2 shape |
| P6 | Composite | `src/shared/ui/composite/*.tsx` | 9 个高频业务组件 |
| P7 | 页面替换 | `src/views/**` | Swap → Genesis → Rewards → Community → Home |

**Out of scope（P2 后续或独立切片）**：Home 动效 · Web3 · 全站 Figma 像素级 · 暗色模式

---

## 2. 阶段

```text
Phase 0   基线入库（只读）→ docs/baselines/
P0        Token JSON + 生成 theme.css/tokens.ts（不动 call site）
P1        Text     — 10 variant × 5 tone
P2        Card     — 6 surface 无 context
P3        Chip     — 新增，替换 pct/badge/tab
P4        Input    — 合并 amount-input
P5        Button   — 4 variant × 3 size × 2 shape
P6        Composite — 9 个高频业务组件
P7        页面替换 — Swap → Genesis → Rewards → Community → Home
```

**P0–P7 顺序**（依赖）：Token → Text → Card → Chip → Input → Button → Composite → 页面替换

---

## 2.1 与旧 handoff 的差异

- 原 handoff 顺序：Text → Button → Card → FaqList → AmountInput → shell cards
- 当前定稿：Token 架构先行，新增 Chip，Input 合并 AmountInput，Button 在 Input 之后（因 Button 依赖 Text，link 要走 Text），Composite 在 primitives 稳定后提取。

---

## 3. 单组件六步（写盘前 1–2，写盘 3–4，写盘后 5–6）

| Step | 动作 | 产出 |
|------|------|------|
| **1** | 公开 API 表 | [`api.md`](./api.md) 对应 § — 键数定死 |
| **2** | dev @4175 computed 映射表 | 探针节点 + `rg` 全仓旧 API → 新 prop |
| **3** | 样式栈（七维） | 每改动 call site 一张栈表（§4） |
| **4** | 同 PR 实现 | primitive 收束 + **全仓 call site** |
| **5** | 双 gate | [`verification.md`](./verification.md) |
| **6** | 报告 | §7 模板 |

---

## 4. 样式栈（Step 3 必填）

### 4.1 七维

字号 · 字重 · 行高 · 字距 · 颜色 · 优先级（`!`）· 语义元素（`as`）

### 4.2 模板

```text
Call site: <path> — <UI>
├─ Layer … effective: …
PC: size · weight · leading · tracking · color
H5: (同上)
单一 owner: <Component + prop/variant>
```

### 4.3 反模式

| 禁止 | 正确 |
|------|------|
| 只改 leaf 留 wrapper 默认字号 | wrapper 零 typography 或去掉 |
| theme / shell 补丁凑 diff=0 | 映射表 → api 轴 |
| primitive alias 过渡 | 同 PR 全仓 rename |
| 探针 PASS 但 API 键数超标 | 双 gate 都 PASS |
| P1 只改 Swap 文件 | 全仓 call site 同 PR |
| 新增 context / fill / radius 等场景分叉轴 | 用 surface + className 微调 |

---

## 5. 全站文本规则

用户可见文案 **必须** `<Text>`（`Button` 内字由 button typography 自管）。禁止 typography React wrapper。布局-only 用 `div`/`section`。

---

## 6. MUST NOT（全局）

- `deprecatedAliases` / runtime 旧名映射
- 无 Phase 0 基线写 P1
- 无映射表改 primitive
- 改 `--foreground` 等非 P0 切片凑 parity
- call site `max-dapp:(text-|font-|leading-|tracking-)`（白名单见 api §7）

---

## 7. PR 报告模板

```text
Slice: p1-<token|text|button|card|chip|input|composite|page>
API: <api.md §N 公开枚举>
Mapping: N nodes
Parity: compare:style-baseline PC diff=0 H5 diff=n 或人工对照表确认
Call sites: full repo same PR
Rollback: git revert <sha>
```

---

## 8. Phase 0 / P0 摘要

**Phase 0**

```bash
pnpm capture:phase0-baseline
pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5
```

**P0**：`tokens.json` 为源 → 生成 `theme.css` / `tokens.ts`。收敛颜色/字号/间距/圆角/阴影，删除代码臆造 token。不改 call site。

**P1–P7**：见 §2 阶段表。

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 migration-plan + playbook 执行面；对抗仲裁定稿 |
| v2.0 | 按 Figma 审计更新为 P0–P7，新增 Token/Chip/Input/Composite 阶段 |
