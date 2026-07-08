# 组件 Anatomy — Foundation SSOT

> **版本**：v1.0 · **2026-07-08**  
> **上游**：[`aegis-design-system-spec.md`](./aegis-design-system-spec.md) · [`design-token-tiers.md`](./design-token-tiers.md)  
> **迁移**：[`design-system-migration-plan.md`](./design-system-migration-plan.md) P0/P1

---

## 1. Card — surface 收束（用户定稿）

**删除/合并**：`context` home/dapp 双轨 · 重叠 `fill` / `radius` / `tone` 自由组合。

**新 API**：`surface` + 可选 `elevated` modifier · Home 专用 `fill` 仅 namespace 隔离

| `surface` | Elevation | radius | padding | 用途 |
|-----------|-----------|--------|---------|------|
| `outlined` | — | md (16) | inset-card | 标准边框卡 · side card |
| `elevated` | E2 | md | inset-card | MetricCard · 轻抬升 |
| `faq` | E1 | xl (28) | inset-faq-y + inset-col-x | FaqList item |
| `promo` | E3 | lg (18) | 组件内 | promo / season |
| `window` | E5 | xl | shell | app-window（shell 专用） |
| `modal` | E6 | lg | 组件内 | dialog / sheet |

**Home namespace**（`context="home"` 保留最小集）：

| `fill` | 说明 |
|--------|------|
| `surface` | 默认白卡 + shadow-card |
| `token` | 代币色块 + shadow-token |
| `transparent` | 无背景 |

**禁止**：call site 叠加 `shadow-*` / `rounded-*` 覆盖 surface 默认（layout className 除外）

---

## 2. Button

| 轴 | 值 |
|----|-----|
| `variant` | primary · secondary · ghost · tab · link |
| `size` | sm · md · lg |
| `shape` | pill · chip |

**Typography**：size 轴映射 token；**无** `max-dapp:` — H5 在 `buttonVariants` 内用 `@media` 或共享 `--dapp-type-*`

**Motion**：lift hover（translate-y + shadow）— 仅 primary/secondary；见 spec §12 待补 Motion SSOT

---

## 3. Text

见 [`text-refactor-plan.md`](./text-refactor-plan.md) — **10 + 3 compound**

**单一 owner**：一个视觉角色 = 一个 `variant` + `tone`；禁止 wrapper `text-base` + leaf `!important`

---

## 4. FaqList

| 部分 | Token / variant |
|------|-----------------|
| 列表 gap | stack-faq (12) · H5 10 组件内 |
| 卡片 | `Card surface="faq"` |
| 问题 | `Text variant="question"` |
| 答案 | `Text variant="detail" tone="foreground"` |
| chevron | 18px · primary / foreground/40 |

**variant**：`home` | `dapp` — 仅 layout（max-width · reveal）；typography 共用

---

## 5. AmountInput / Input

| 属性 | Token |
|------|-------|
| 字号 | `--dapp-type-amount-size`（px-lock） |
| 字重 | semibold（variant 默认） |
| 对齐 | text-right |
| placeholder | `--placeholder` |

**Tier B**：Swap amount box chrome（border/bg）在 `swap-amount-box` 组件，不进 Input primitive

---

## 6. Shell cards（Tier B 内化）

| 组件 | label | value | 备注 |
|------|-------|-------|------|
| MetricCard | 12px · Tier B | 30px · Tier B | 不用 Text stat variant |
| StatCard | 12 | 30 | Genesis |
| WidgetHeader | 21 wh · 12 sub · 26 disc | Tier B | |

---

## 7. 断点白名单（允许 `max-dapp:` / `dapp:` 的文件）

**Layout / shell（viewport 形态）**：

- `shell-layout.ts` · `dapp-shell.tsx` · `dapp-topbar.tsx`  
- `dapp-mobile-nav.tsx` · `dapp-widget-frame.tsx` · `dapp-detail-layout.ts`  
- `responsive-table.tsx` · `dapp-table-*` · `metric-grid.tsx`  
- `wallet-*-modal.tsx` · `swap-slippage-modal.tsx` · `aegis-responsive-dialog.tsx`

**Home namespace（layout-only，P2 末批清理）**：

- `home-layout.ts` · `static-layout.ts` · `views/home/components/*`

**Foundation 定义文件**（仅 **layout** 断点；typography 收进 CSS var）：

- `text.tsx` · `button.tsx` · `faq-list.tsx` · `card.tsx`

**禁止**：上述以外任何文件的 `max-dapp:(text-|font-|leading-|tracking-)`

**不可删除**：`legacy-breakpoints.css` 中 `@custom-variant dapp` / `max-dapp` 定义（Chrome &lt;104 兼容）

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-07-08 | Card surface 收束；Foundation anatomy；v3 白名单扩全 |
