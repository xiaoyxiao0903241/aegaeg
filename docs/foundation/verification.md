# Foundation 验收（L2 · P0–P7）

> **流程**：[`runbook.md`](./runbook.md) · **API**：[`api.md`](./api.md) · **审计**：[`design-system-audit-v2.md`](./design-system-audit-v2.md)

---

## 1. 双 Gate

| Gate | 含义 | 命令 |
|------|------|------|
| **API gate** | 代码键数 = api.md 键数，无 legacy API 命中 | `rg` 检查 + tsc |
| **视觉 gate** | 人工对照表确认 或 4175 parity 探针 | `pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5` |

用户已确认：**人工对照表优先**，4175 parity 作为辅助。

---

## 2. 每阶段验收清单

### P0 Token
- [ ] `tokens.json` 源文件存在且结构合法
- [ ] `theme.css` / `tokens.ts` 可由脚本生成
- [ ] 已删除 `--ink-strong`、`--faq-text`、`--on-dark`、`--coral-bright` 等臆造色
- [ ] `pnpm exec tsc --noEmit` 通过

### P1 Text
- [ ] `text.tsx` 只有 10 variant + 5 tone
- [ ] `rg 'panel-title|table-cell|on-dark' src --glob '*.{tsx,ts}'` 零命中
- [ ] 全仓 `variant=` / `tone=` 已迁移
- [ ] 人工对照表确认每个子组件样式对齐

### P2 Card
- [ ] `card.tsx` 只有 6 surface，无 `context`/`fill`/`radius` 轴
- [ ] `rg 'surface="soft"|context=|fill=' src --glob '*.{tsx,ts}'` 零命中
- [ ] 全仓 call site 迁移到新 surface

### P3 Chip
- [ ] `chip.tsx` 存在，3 variant × 2 size × 2 shape × 3 tone
- [ ] pct / badge / tab 已替换为 Chip
- [ ] `rg 'shape="chip"|variant="tab"' src --glob '*.{tsx,ts}'`（Button 的 tab）零命中

### P4 Input
- [ ] `input.tsx` 存在，3 variant：default/amount/shares
- [ ] `amount-input.tsx` 已合并或删除
- [ ] genesis shares field 使用 Input

### P5 Button
- [ ] `button.tsx` 4 variant × 3 size × 2 shape
- [ ] `rg 'variant="tab"|shape="chip"' src/shared/ui/button.tsx` 零命中
- [ ] link 内部使用 Text

### P6 Composite
- [ ] 9 个 Composite 文件存在：`top-bar.tsx` · `app-rail.tsx` · `widget-header.tsx` · `token-amount-input.tsx` · `percent-chip-group.tsx` · `metric-card.tsx` · `data-table.tsx` · `faq-list.tsx` · `promo-card.tsx`
- [ ] 每个 Composite 都有 ≥2 个 call site 或明确的全局 shell 职责
- [ ] 无把 `box` / `dl` / `r` 等纯视觉层包装成 Composite

### P7 页面替换
- [ ] Swap → Genesis → Rewards → Community → Home 逐个完成
- [ ] 每个页面替换后有人工对照表
- [ ] 全站 `dapp-type-scale.ts` 删除
- [ ] `rg 'text-ink-|text-faq-text|text-on-dark|coral-bright' src --glob '*.{tsx,ts}'` 零命中

---

## 3. 常用命令

```bash
# TypeScript
pnpm exec tsc --noEmit

# Lint（关注 src/ 错误，tmp/ 脚本错误可后续清理）
pnpm lint:all

# 4175 parity（用户不强制，作为辅助）
pnpm dev:baseline
pnpm capture:phase0-baseline
pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5

# legacy API 检查
rg 'panel-title|table-cell|on-dark|text-ink-|text-faq-text|coral-bright' src --glob '*.{tsx,ts}'
rg 'surface="soft"|context=|fill=' src --glob '*.{tsx,ts}'
rg 'variant="tab"|shape="chip"' src/shared/ui/button.tsx
```

---

## 4. 人工对照表模板

每个页面/组件替换后填写：

```text
组件: <path>
Figma 层: <layer>
变更前: <className / 旧 API>
变更后: <新 Component + props/className>
样式对齐: Y / N / 差异说明
差异位置: <具体 selector 或 class>
是否可接受: <用户勾选>
```

---

## 5. 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 parity / slice 验收流程 |
| v2.0 | 更新为 P0–P7，增加人工对照表优先、Chip/Input/Composite gate |
