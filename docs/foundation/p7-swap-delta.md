# P7 Swap 页替换对照表

> 范围：`src/views/dapp/swap/trade-swap-widget.tsx`、`src/views/dapp/swap/flash-swap-widget.tsx`
> 基线：当前 `refactor/world-class-minimal` 分支（P6 已提交）
> 验证：`pnpm exec tsc --noEmit` 通过 · `pnpm exec vite build --mode staging` 通过

---

## 1. SwapSubpageHeader → WidgetSubpageHeader

| 项 | 变更前 | 变更后 |
|---|---|---|
| 组件 | `SwapSubpageHeader`（`swap-widget-header.tsx`） | `WidgetSubpageHeader`（`shared/ui/widget-header.tsx`） |
| 标题/副标题样式 | `Text variant="panel"` + `Text variant="copy" tone="muted-foreground"` | 相同 |
| back 行 | 内部硬编码 `<DappIcon size="sm" src={flashSwapAssets.backArrow} />` + `<Text tone="muted-foreground" variant="copy">` | `backLabel` 作为 ReactNode 由 call site 组合传入；组件只保留布局和按钮行为 |
| 右上角 action | 内部硬编码 `<SwapPanelToggle />` | `action` prop 传入 `<SwapPanelToggle />` |
| 间距 | `grid gap-3.5` + `dappWidgetHeaderSpacingClass` | 相同 |
| 副标题 max-width | `max-w-[17.5rem]` | 相同 |

**样式对齐：Y**

> 差异说明：结构完全对齐。唯一变化是 back icon + label 和 toggle 从组件内部硬编码改为组合式传入，符合 Foundation "细微差异用 className 抹平，不扩轴" 原则。

---

## 2. SwapWidgetBody → 内联 div

| 项 | 变更前 | 变更后 |
|---|---|---|
| 组件 | `SwapWidgetBody`（`swap-widget-header.tsx`） | 内联 `<div className={cn(dappWidgetBodyClass, 'gap-0')}>` |
| body 布局 | `flex min-h-0 flex-1 flex-col` + `bodyClassName` | 相同 |
| 子元素 gap | 通过 `bodyClassName={cn(dappWidgetBodyClass, 'gap-0')}` 控制 | 相同 |
| footer 定位 | 组件内部 `<div className="mt-auto w-full shrink-0">` | 在 body 末尾条件渲染相同 class 的 div |

**样式对齐：Y**

> 差异说明：`SwapWidgetBody` 只是薄 wrapper，无独立视觉语义；内联后减少一层抽象。footer 行为保持不变。

---

## 3. SwapAmountBox → AmountBox

| 项 | 变更前 | 变更后 |
|---|---|---|
| 组件 | `SwapAmountBox`（`app/shell/components/swap-amount-box.tsx`） | `AmountBox`（`shared/ui/amount-box.tsx`） |
| 外部容器 | `Card surface="outlined"` + `rounded-md p-3.5` | `Card surface="outlined"`（默认 `rounded-sm p-3.5`） |
| label / balance 行 | `flex items-center justify-between gap-3` | 相同 |
| label 排版 | `Text variant="copy"` | 相同 |
| balance 排版 | `Text variant="figure"`（sessionReady 时） | 相同（`disabled=false` 走 `figure`） |
| token 区 | 内部 `<TokenChip icon={tokenIcon} label={tokenLabel} />` | `startAdornment={<TokenChip ... />}` |
| 输入区 | `AmountInput`（即 `Input variant="amount"`） | `Input variant="amount"` |
| loading 骨架 | `amountLoading` + 内部 `<SwapAmountSkeleton />` | `loading` + `loadingSkeleton={<SwapAmountSkeleton />}` |
| sessionReady 视觉 | 旧组件 `!sessionReady` 时硬编码 `text-[#c9cfda]` | 当前 Swap 页两个 box 均传 `sessionReady`（等价 `disabled=false`），未触发旧色；新组件走标准 Input disabled 状态 |

**样式对齐：Y（当前 call site 下）**

> 差异说明：
> - 由于当前 Swap 页的两个 amount box 都显式传了 `sessionReady`（true），旧代码中的 `#c9cfda` 预览色分支不会命中。
> - 若未来在其他页面以 `sessionReady=false` 使用旧组件，预览态颜色会从硬编码 `#c9cfda` 变为标准 `muted-foreground` / `disabled:opacity-60`。
> - 容器圆角从 `rounded-md` 变为 `Card surface="outlined"` 默认的 `rounded-sm`；这是 Foundation Card 统一后的语义，已在 P2 Card 阶段决策。

---

## 4. SwapPercentButtons → PercentButtonRow

| 项 | 变更前 | 变更后 |
|---|---|---|
| 组件 | `SwapPercentButtons`（`swap-widget-primitives.tsx`） | `PercentButtonRow`（`shared/ui/segment.tsx`） |
| 布局 | `grid grid-cols-4 gap-1.5 pt-2.5 max-dapp:mt-3 max-dapp:py-0` | `grid grid-cols-4 gap-1.5`（无 `pt-2.5` / H5 特殊 margin） |
| 按钮样式 | hand-roll `border border-border bg-card rounded-[0.5625rem] py-1.25 hover:-translate-y-px hover:border-primary hover:text-primary` | `Chip variant={active ? 'solid' : 'outlined'} size="sm" shape="rounded"` |
| active 状态 | 无 active 状态（每次点击即触发填充） | 新组件内部 `value=""`，所以所有按钮永远渲染为 `outlined`；行为与原代码一致 |
| 禁用 | `disabled` 直接传给每个 button | 相同 |

**样式对齐：Y（视觉等效，实现统一）**

> 差异说明：
> - 旧按钮有 `pt-2.5` 上间距和 H5 特殊 `mt-3`；新 `PercentButtonRow` 自身不带间距，依赖父级 `dappWidgetBodyClass` 的 `gap-2` 控制。
> - 按钮从 hand-roll 改为 `Chip`，hover/focus 行为由 Chip 统一提供（`solid`/`outlined` 变体），样式语义与 Figma `pcts/pct` 层一致。
> - 因为原 Swap 百分比按钮无"选中态"，新组件通过 `value=""` 保持所有按钮为 `outlined`，行为不变。

---

## 5. SwapMetaPanel → 保留

| 项 | 说明 |
|---|---|
| 组件 | `SwapMetaPanel`（`swap-widget-primitives.tsx`）→ 内部 `DappMetaList` |
| 未替换原因 | 当前 `MetricCard`/`DataTable` 针对的是指标卡和表格，与 meta key/value 列表的视觉结构（label + value 行）不完全匹配；强行替换会引入不必要的 className 覆盖。 |
| 样式 | 继续使用 `Card surface="outlined"` + `Text variant="copy"`/`figure`，已符合 Foundation Text/Card 规范。 |

**样式对齐：Y（无变更）**

---

## 6. SwapGenesisFooter → 保留

| 项 | 说明 |
|---|---|
| 组件 | `SwapGenesisFooter`（`swap-widget-primitives.tsx`）→ 内部 `WidgetPromoCard` / `GenesisPromoCard` |
| 未替换原因 | 当前 `CalloutCard` 的 API（title/body/action）与 `GenesisPromoCard` 的复杂状态（loading skeleton、season/discount 模板、动态状态文案）不完全匹配；强行替换会导致 call site 需要大量组合逻辑。 |
| 未来方向 | P8 清债阶段评估是否将 `WidgetPromoCard` 统一为 `CalloutCard`，或把 `GenesisPromoCard` 提升为独立 Composite。 |

**样式对齐：Y（无变更）**

---

## 7. 整体代码量变化

```
 src/views/dapp/swap/trade-swap-widget.tsx | 49 +++++++++++-----------
 src/views/dapp/swap/flash-swap-widget.tsx  | 47 +++++++++++-----------
 src/views/dapp/swap/swap-widget-header.tsx |  2 +-
 3 files changed, 49 insertions(+), 49 deletions(+)
```

- 删除了 `SwapAmountBox`、`SwapPercentButtons`、`SwapSubpageHeader`、`SwapWidgetBody` 的调用。
- 新增组合式调用：`WidgetSubpageHeader`、`AmountBox`、`PercentButtonRow`、`TokenChip`。
- `swap-widget-header.tsx` 仅导出 `SwapPanelToggle` 以支持组合式 header。

---

## 8. 需要人工确认的视觉点

1. **AmountBox 容器圆角**：从旧 `rounded-md` 变为新 `Card surface="outlined"` 默认的 `rounded-sm`；若 Figma swap box 层明确是 md 圆角，需要在 `AmountBox` 内部或 call site 调整。
2. **PercentButtonRow 上间距**：旧代码有 `pt-2.5` + H5 `mt-3`，新代码依赖父级 `gap-2`；在 H5 下可能略显紧凑。
3. **未连接钱包预览态**：当前 Swap 页未使用 `sessionReady=false`，但旧组件保留了一条硬编码 `#c9cfda` 分支；若其他页面未来需要预览态，需确认标准 disabled 颜色是否可接受。

---

## 9. 后续依赖

- 提交本阶段后，继续 Genesis → Rewards → Community → Home 逐页替换。
- P8 清债：`swap-widget-header.tsx` 中 `SwapHubHeader` 等未使用代码、`swap-amount-box.tsx`、`SwapPercentButtons`、`dapp-type-scale.ts` 遗留类可一并移除。
