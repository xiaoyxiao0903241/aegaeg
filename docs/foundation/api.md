# Foundation 公开 API（L1 · 六组件对称 SSOT）

> **流程**：[`runbook.md`](./runbook.md) · **验收**：[`verification.md`](./verification.md)  
> **原则**：每组件 **键数 = 类型字面量数** · **无 alias 层** · Tier B 不进 Text

每节结构一致：**公开轴 · 禁止 · 依赖 · Swap 探针 · API gate**

---

## §1 Card

| 公开轴 | 值 |
|--------|-----|
| `surface` | `outlined` · `elevated` · `faq` · `promo` · `window` · `modal` |
| Home `fill`（namespace） | `surface` · `token` · `transparent` |

| surface | Elevation | radius | padding | 用途 |
|---------|-----------|--------|---------|------|
| outlined | — | md | inset-card | 标准边框卡 |
| elevated | E2 | md | inset-card | MetricCard |
| faq | E1 | xl | faq inset | FaqList item |
| promo | E3 | lg | 组件内 | promo / season |
| window | E5 | xl | shell | app-window |
| modal | E6 | lg | 组件内 | dialog / sheet |

**禁止**：call site 叠 `shadow-*` / `rounded-*` 覆盖 surface 默认  
**依赖**：无  
**探针**：mode-card-root · program-card · faq card layout  
**Gate**：`surface` 键 = **6**；Swap layout 行 diff=0

---

## §2 Button

| 轴 | 值 |
|----|-----|
| `variant` | `primary` · `secondary` · `ghost` · `tab` · `link` |
| `size` | `sm` · `md` · `lg` |
| `shape` | `pill` · `chip` |

**Typography**：在 `buttonVariants` + token；H5 在 primitive CSS var  
**禁止**：call site `max-dapp:` typography  
**依赖**：无（可与 Text 并行，但 typography 独立）  
**探针**：topbar-connect · swap CTA · mode tab  
**Gate**：`variant` = **5**；`size` = **3**；`shape` = **2**

---

## §3 Text

| 轴 | 值 |
|----|-----|
| `variant` | **12 键**（下表） |
| `tone` | `foreground` · `muted-foreground` · `primary` · `success` · `inverse` · `on-dark` |
| 可选 | `tabular` · `as` |

**禁止**：`weight` prop · 第 13 variant · `deprecatedAliases`

### 12 variant（仅此）

| variant | PC→H5 | 字重 | 用途 |
|---------|------|------|------|
| rail | 10→10 | medium | 仅 rail 四 Tab |
| kicker | 11→12 | semibold | eyebrow |
| meta | 13→13 | normal | **默认**（省略 variant） |
| detail | 14→14 | normal | FAQ 答案 |
| question | 15→15 | semibold | FAQ 问题 |
| headline | 16→15 | semibold | 卡小标题 |
| brand | 17→18 | semibold | 顶栏 / rank |
| section | 18→16 | semibold | 区块 dl |
| widget-title | 21→22 | semibold | widget wh |
| amount | 22→23 | semibold | 金额 |
| panel-title | compound | semibold | 面板 h1 |
| table-cell | compound | normal/medium | 表格 |

**旧名映射（写盘前表，代码里不保留旧名）**：`faq-question`→`question` · `body`/`caption`→`meta`/`detail` · `title-lg`→`brand` · `swap-hub-title` 等→上表之一，**不新增键**

**依赖**：无  
**探针**：Swap catalog 全部 Text owner 行  
**Gate**：`text.tsx` 键 = **12** · `TextVariant` 联合 = 12

---

## §4 FaqList

| 轴 | 值 |
|----|-----|
| `variant` | `home` · `dapp`（layout only） |
| 内部 Text | `question` · `detail` |
| 内部 Card | `surface="faq"` |

| 部分 | owner |
|------|-------|
| gap | stack-faq 12 · H5 10 组件内 |
| chevron | 18px · primary |

**依赖**：P1-Text · P1-Card  
**探针**：faq-question-* · faq answer  
**Gate**：无 `faq-question` variant 名；`variant` = **2**

---

## §5 AmountInput

| 属性 | SSOT |
|------|------|
| 字号 | `--type-amount-size` px-lock |
| 字重 | semibold |
| 对齐 | text-right |
| placeholder | `--placeholder` |

**Tier B**：`swap-amount-box` chrome — border/bg，不进 Input primitive  
**依赖**：P0 token  
**探针**：swap amount 输入区  
**Gate**：无 call site amount typography class

---

## §6 Shell cards（Tier B）

| 组件 | label | value |
|------|-------|-------|
| MetricCard | 12px Tier B | 30px Tier B |
| StatCard | 12 | 30 |
| WidgetHeader | 21 / 12 / 26 disc | Tier B |

**禁止**：hand-rolled `<strong>` + 散落 typography；不用 Text stat variant  
**依赖**：P1-Text（周边文案）· P1-Card（surface）  
**探针**：按组件扩 SWAP_CATALOG 后 gate  
**Gate**：typography 内化组件 token

---

## §7 断点白名单

允许 `max-dapp:` / `dapp:` **仅 layout** 的文件：

- `shell-layout.ts` · `dapp-shell.tsx` · `dapp-topbar.tsx` · `dapp-mobile-nav.tsx`  
- `dapp-widget-frame.tsx` · `dapp-detail-layout.ts` · `responsive-table.tsx` · `dapp-table-*`  
- `wallet-*-modal.tsx` · `swap-slippage-modal.tsx` · `aegis-responsive-dialog.tsx`  
- `home-layout.ts` · `static-layout.ts` · `views/home/components/*`  
- Foundation 定义文件：**layout 断点 only** — `text.tsx` · `button.tsx` · `faq-list.tsx` · `card.tsx`

**禁止**：上述以外 `max-dapp:(text-|font-|leading-|tracking-)`

**不可删**：`legacy-breakpoints.css` 中 `@custom-variant dapp` / `max-dapp`

---

## §8 P1 交付矩阵

| 组件 | primitive | 键数 gate | 同 PR |
|------|-----------|-----------|-------|
| Text | text.tsx | 12 variant | 全仓 `variant=` |
| Button | button.tsx | 5×3×2 | 全仓 Button props |
| Card | card.tsx | 6 surface | 全仓 `surface=` |
| FaqList | faq-list.tsx | 2 layout | 全仓 FaqList |
| AmountInput | amount-input.tsx | token | 全仓 Input |
| shell cards | views/shell | Tier B | 删 scattered class |

---

## 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 component-anatomy + text-refactor-plan；六节对称 |
