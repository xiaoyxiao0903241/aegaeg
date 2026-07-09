# Foundation 重构 Runbook（L1 · 执行 SSOT）

> **API SSOT**：[`api.md`](./api.md) · **验收 SSOT**：[`verification.md`](./verification.md)

---

## 1. 边界

**In scope（P0–P8 · 全部）**

| 阶段 | 组件/任务 | 文件 | 说明 |
|------|-----------|------|------|
| P0 | Token 架构 | `src/shared/styles/tokens/tokens.json` + 生成 | JSON 源 SSOT，CI 生成 CSS/TS |
| P1 | Text | `src/shared/ui/text.tsx` | 10 variant × 7 tone |
| P2 | Card | `src/shared/ui/card.tsx` | 4 surface，无 context/fill/radius |
| P3 | Chip（新增） | `src/shared/ui/chip.tsx` | 替换 pct / badge / tab |
| P4 | Input | `src/shared/ui/input.tsx` | 合并 amount-input，3 variant：default/numeric/amount |
| P5 | Button | `src/shared/ui/button.tsx` | 4 variant × 3 size × 2 shape |
| P6 | Composite | `src/shared/ui/composite/*.tsx` | 9 个高频业务组件 |
| P7 | 页面替换 | `src/views/**` | Swap → Genesis → Rewards → Community → Home |
| P8 | 清债 | — | 删 dapp-type-scale.ts / 旧 color class / 文档同步 |

**Out of scope（P2 后续或独立切片）**：Home 动效 · Web3 · 全站 Figma 像素级 · 暗色模式

---

## 2. 阶段

```text
Phase 0   基线入库（只读）→ docs/baselines/
P0        Token JSON + 生成 theme.css/tokens.ts（不动 call site）
P1        Text     — 10 variant × 7 tone
P2        Card     — 4 surface 无 context
P3        Chip     — 新增，替换 pct/badge/tab
P4        Input    — 合并 amount-input，default/numeric/amount
P5        Button   — 4 variant × 3 size × 2 shape
P6        Composite — 9 个高频业务组件
P7        页面替换 — Swap → Genesis → Rewards → Community → Home
P8        清债     — 删 dapp-type-scale.ts / 旧 color class / 文档同步
```

**P0–P8 顺序**（依赖）：Token → Text → Card → Chip → Input → Button → Composite → 页面替换 → 清债

---

## 2.1 与旧 handoff 的差异

- 原 handoff 顺序：Text → Button → Card → FaqList → AmountInput → shell cards
- 当前定稿：Token 架构先行，新增 Chip，Input 合并 AmountInput（variant 为 default/numeric/amount），Button 在 Input 之后（因 Button 依赖 Text，link 要走 Text），Composite 在 primitives 稳定后提取（Accordion / CalloutCard / Segment / NavRail / PanelHeader 等最终命名）。

---

## 3. 单组件六步（写盘前 1–2，写盘 3–4，写盘后 5–6）

| Step | 动作 | 产出 |
|------|------|------|
| **1** | 公开 API 表 | [`api.md`](./api.md) 对应 § — 键数定死 |
| **2** | 4175 视觉映射表 | heatmap 红块 / 同位置源码（探针仅确认）+ `rg` 全仓旧 API → 新 prop |
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
- call site `max-dapp:(text-|font-|leading-|tracking-)`（白名单见 api §8）

### 6.1 Class / CSS 减法

> 详述亦见 [`.cursor/skills/aegis-component-refactor/SKILL.md`](../../.cursor/skills/aegis-component-refactor/SKILL.md)。

**`dev` = 视觉对照，≠ 结构模板。** `dev` 有冗余不构成保留理由；重构就是消冗余。对照 `dev` 只验「看起来对不对」。

| MUST | 说明 |
|------|------|
| 无 `*Class = {…} as const` / 顶部长 `cn()` 样式表 | 一次性布局写在 JSX `className` |
| 无空装饰 class | 仅当 CSS/脚本真正选择该名；否则删（即使 `dev` 有同名） |
| 动效用 `data-*` | 同步改选择器；禁止为动效保留空 class |
| 以「是否影响样式」删冗余 | 重复断点、被 Foundation 覆盖的手写、无 computed 影响的 utility — **不看** `dev` 是否保留 |
| 视觉收敛 &lt;1px | 有偏差 → 对照 `dev` **同位置代码**找根因，改 SSOT/call site；禁止 `!` / 局部特判补丁 |
| heatmap 红块优先 | 发现/归因：红块裁切 + 同位置源码；整页 `%` 不作收工（见 skill） |
| 探针降级 | 禁止默认全页 DOM dump；仅肉眼分不清或修完硬验收时，对 1–2 节点 scoped 取 computed |
| 禁止贴回平行样式体系 | 不为截图恢复已删 hand-roll / 遗留色 / type-scale；根因在 token 则改 token |

**偏离标签**：结构债清理标 **INTENTIONAL**；误删导致塌陷标 **REGRESSION** 并修回。

### 6.2 视觉诊断序（登录态 / 子页）

```text
heatmap 红块清单
  → 裁切肉眼分类（色/字/布局/动态/抗锯齿）
  → 同位置源码根因 + REGRESSION|INTENTIONAL|IGNORE
  → 改 SSOT / call site
  → （可选）scoped 探针确认
  → 重跑 heatmap
```

---

## 7. PR 报告模板

```text
Slice: p<N>-<token|text|button|card|chip|input|composite|page|cleanup>
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

**P1–P8**：见 §2 阶段表。

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 migration-plan + playbook 执行面；对抗仲裁定稿 |
| v2.0 | 按 Figma 审计更新为 P0–P7，新增 Token/Chip/Input/Composite 阶段 |
| v2.1 | 同步最终命名：4 Card surface、Input default/numeric/amount、Composite 最终名、P8 清债 |
| v2.2 | 新增 §6.1 Class / CSS 减法；明确 `dev` 仅视觉对照、非结构 SSOT |
| v2.3 | §6.1–6.2：红块优先；探针降级为确认工具 |
