# Foundation 重构 Runbook（L1 · 执行 SSOT）

> **API SSOT**：[`api.md`](./api.md) · **验收 SSOT**：[`verification.md`](./verification.md)

---

## 1. 边界

**In scope（P1 · 六类全部）**

| # | 组件 | primitive / shell |
|---|------|---------------------|
| 1 | Text | `src/shared/ui/text.tsx` |
| 2 | Button | `src/shared/ui/button.tsx` |
| 3 | Card | `src/shared/ui/card.tsx` + shell cards |
| 4 | FaqList | `src/shared/ui/faq-list.tsx` |
| 5 | AmountInput | `src/shared/ui/amount-input.tsx` |
| 6 | shell cards | MetricCard · WidgetHeader · StatCard 等 |

**Out of scope（P2 或独立切片）**：页面 layout tv() · Home 动效 · Web3 · 全站 Figma 像素级

---

## 2. 阶段

```text
Phase 0   基线入库（只读）→ docs/baselines/
P0        theme.css token（不动 call site）
P1        六类 Foundation — 每类 1 PR
P2        页面级 layout / 常量清债
```

**P1 顺序**（依赖）：Text → Button → Card → FaqList → AmountInput → shell cards

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
Slice: p1-<text|button|card|faq-list|amount-input|shell-cards>
API: <api.md §N 公开枚举>
Mapping: N nodes
Parity: compare:style-baseline PC diff=0 H5 diff=n
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

**P0**：`theme.css` — px-lock `--type-*` · Tier B hex · E1–E6 · H5 `@media` per variant。不改 call site。

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 migration-plan + playbook 执行面；对抗仲裁定稿 |
