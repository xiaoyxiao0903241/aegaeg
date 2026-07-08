# Foundation 验收（L2 · P0–P8）

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
- [x] `tokens.json` 源文件存在且结构合法
- [x] `theme.css` / `tokens.ts` 可由脚本生成
- [x] 臆造色已标记 `@deprecated`，`@theme inline` 仍保留映射以兼容现有 source（P8 删除）
- [x] `pnpm exec tsc --noEmit` 通过
- [x] `pnpm exec stylelint src/shared/styles/tokens/theme.css` 通过
- [ ] 确认 legacy color/type alias 迁移计划写入 P8

### P1 Text
- [ ] `text.tsx` 只有 10 variant + 6 tone
- [ ] `rg 'panel-title|table-cell|on-dark' src --glob '*.{tsx,ts}'` 零命中
- [ ] 全仓 `variant=` / `tone=` 已迁移
- [ ] 人工对照表确认每个子组件样式对齐

### P2 Card
- [ ] `card.tsx` 只有 4 surface（outlined/elevated/soft/inverse），无 `context`/`fill`/`radius` 轴
- [ ] `rg 'surface="faq"|surface="promo"|surface="window"|surface="modal"|context=|fill=' src --glob '*.{tsx,ts}'` 零命中
- [ ] 全仓 call site 迁移到新 surface

### P3 Chip
- [ ] `chip.tsx` 存在，3 variant × 2 size × 2 shape × 3 tone
- [ ] pct / badge / tab 已替换为 Chip
- [ ] `rg 'shape="chip"|variant="tab"' src --glob '*.{tsx,ts}'`（Button 的 tab）零命中

### P4 Input
- [ ] `input.tsx` 存在，3 variant：default/numeric/amount
- [ ] `amount-input.tsx` 已合并或删除
- [ ] genesis shares field 使用 `Input variant="numeric"`

### P5 Button
- [ ] `button.tsx` 4 variant × 3 size × 2 shape
- [ ] `rg 'variant="tab"|shape="chip"' src/shared/ui/button.tsx` 零命中
- [ ] link 内部使用 Text

### P6 Composite
- [ ] 9 个 Composite 文件存在：`top-bar.tsx` · `nav-rail.tsx` · `panel-header.tsx` · `amount-input.tsx` · `segment.tsx` · `metric-card.tsx` · `data-table.tsx` · `accordion.tsx` · `callout-card.tsx`
- [ ] 每个 Composite 都有 ≥2 个 call site 或明确的全局 shell 职责
- [ ] 无把 `box` / `dl` / `r` 等纯视觉层包装成 Composite

### P7 按页替换
- [x] Swap 页应用 Composite：`WidgetHeader` / `WidgetSubpageHeader` + `AmountBox` + `Segment` + `MetricCard` + `CalloutCard`
- [x] Genesis 页应用 Composite：`WidgetHeader` + `AmountBox` + `Segment` + `MetricCard` + `DataTable` + `CalloutCard`
- [x] Rewards 页应用 Composite：`WidgetHeader` + `DataTable` + `CalloutCard` + `Accordion`
- [x] Community 页应用 Composite：`WidgetHeader` + `DataTable` + `CalloutCard`
- [x] Home 页应用 Composite：`HomeSection` + `Text`/`Card` 新 API
- [x] 已删除旧组件：`swap-amount-box.tsx` · `swap-widget-header.tsx` · `swap-widget-primitives.tsx`
- [x] `pnpm exec tsc --noEmit` 通过
- [x] `pnpm run build` 通过
- [ ] 人工对照表确认（用户后续进行）

### P8 清债
- [x] 全站 `dapp-type-scale.ts` 删除
- [x] `rg 'text-ink-|text-faq-text|text-on-dark|coral-bright' src --glob '*.{tsx,ts}'` 零命中
- [ ] 删除 `theme.css` 中 `@deprecated legacy colors` 与 `legacy type aliases` 静态块
- [ ] 删除 `.stylelintrc.json` 中为生成文件临时禁用的规则（若不再需要）
- [ ] `docs/foundation/` 与 `SKILL.md` 命名与 api.md 一致

---

## 3. 常用命令

```bash
# TypeScript
pnpm exec tsc --noEmit

# Lint（关注 src/ 错误，tmp/ 脚本错误可后续清理）
pnpm lint:all

# 4175 parity（用户不强制，作为辅助）
# `dev:baseline` 会把当前仓库 `.env` / `.env.local` 同步到 worktree，再启 4175。
# 改 env 后必须重启 baseline（Vite 只在启动时注入）。跳过同步：AEGIS_DEV_BASELINE_SKIP_ENV_SYNC=1
pnpm dev:baseline
pnpm capture:phase0-baseline
pnpm compare:style-baseline -- dapp-swap-desktop dapp-swap-h5

# legacy API 检查
rg 'panel-title|table-cell|on-dark|text-ink-|text-faq-text|coral-bright' src --glob '*.{tsx,ts}'
rg 'surface="faq"|surface="promo"|surface="window"|surface="modal"|context=|fill=' src --glob '*.{tsx,ts}'
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

## 5. dapp-genesis-desktop 视觉标签（4175 vs 5174）

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| y191–232 Phase / Metric | REGRESSION→fixed | `Text` 误把 `max-dapp:text-*` 当字号覆盖；panel leading 1.5→1.3 |
| y299–377 Global 卡数值 | REGRESSION→fixed | 同上；`fs/lh/ls` 已对齐 21px / 27.3px / -0.63px |
| y378–412 Shares input tracking | REGRESSION→fixed | `Input` default/numeric `tracking-normal` |
| y473–490 MetaList | REGRESSION→fixed | `DappMetaList` `copy`→`detail`（14px） |
| muted-foreground 0.5→0.7 | INTENTIONAL | Foundation token（Figma body 70%）；禁贴回 4175 50% |
| radius-sm 10→14 | INTENTIONAL | Foundation `--radius-sm: 0.875rem`（api Card outlined） |
| globalBody `on-dark`→`inverse-muted` | REGRESSION→fixed | 正式 tone；禁 `inverse`+opacity 近似 |
| FAQ answer `faq-text`→`muted-foreground` | INTENTIONAL | 禁贴回 `text-faq-text` |
| panel 20→21 / subtitle 12→13 | INTENTIONAL | Foundation `--type-panel` / `--type-copy` vs 4175 fluid |
| section lh snug(24.75)→1.3(23.4) | INTENTIONAL | Foundation `--type-section-leading` |
| FAQ answer box h 42→70 | INTENTIONAL | UA margin→`py-[1em]` 等价撑开（盒模型含 padding） |
| 动态数值 / 倒计时文案 | IGNORE | 非静态对齐重点 |

## 5b. dapp-rewards / dapp-community 视觉标签（4175 vs 5174）

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Rewards h2 `Current tier` leading-snug + tracking -0.36px | REGRESSION→fixed | `DappContentHeading` 补 `group-data-[tab=rewards]` |
| Rewards table head faint 30% | REGRESSION→fixed | `ResponsiveTable` `text-foreground/30`（禁贴回 `text-faint`） |
| FAQ answer 盒高 42→70 | REGRESSION→fixed | `FaqList` / `Accordion` answer `py-[1em]`（preflight 清掉 UA margin） |
| Invite step leading 1.3→1.5 | REGRESSION→fixed | 对齐 4175 `dappCaptionClass` |
| Community/Rewards `DappSection` h3 lh 24.75→23.4 | INTENTIONAL | 同 §5 section leading；级联 Y 偏移会染红整段 |
| Hero kicker `coral-bright`→`primary` | INTENTIONAL | 禁贴回 `text-coral-bright` |
| Hero body `on-dark`→`inverse-muted` | REGRESSION→fixed | 正式 tone；禁 `inverse`+opacity 近似 |
| Input disabled opacity 50→60 | INTENTIONAL | Foundation Input SSOT（见 p7-swap-delta） |
| Phase 日期 / 累计共建额 | IGNORE | 动态 |
| Community 左卡 padding | INTENTIONAL | 用户确认满意；禁按 4175/dev 改回 |
| Rewards 表行 1px 边框带（y831+/y913+） | IGNORE | section leading 级联 + 抗锯齿；非结构回归 |
| Community 推荐链 URL 端口 4175↔5174 | IGNORE | 环境 host，非 UI SSOT |
| Community Copy link 按钮 Y 细带 | IGNORE | 上文动态文案/级联；禁改左卡 padding |

## 5c. 登录态四 tab 共享 chrome（4175 vs 5174）

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Topbar brand 17→18 / lh / tracking | REGRESSION→fixed | `DappTopbar` `text-lg leading-7 tracking-tight` |
| Language menu item headline/copy 溢出叠字 | REGRESSION→fixed | `LanguageMenu` 行内 `text-sm`/`text-xs` + `leading-normal` |
| `--type-*-size` px-lock 高分屏不随 site-fluid | REGRESSION→fixed | `tokens.json` size → rem @16px；`generate-tokens.mjs` 注释同步 |
| Language menu item radius 10→14 | INTENTIONAL | Foundation `--radius-sm`；禁贴回 4175 10px |
| muted / section leading / FAQ 色 | INTENTIONAL | 同 §5 / §5b |
| 动态报价 / 余额 / 成员数 | IGNORE | 非静态对齐重点 |

## 5d. Swap hub 左下 Genesis promo + Convert/Trade 子页

| 红块 / 节点 | 标签 | 说明 |
|-------------|------|------|
| Genesis promo title/body | REGRESSION→fixed | `tone="inverse-muted"` ≡ `#b8c0ce`（禁 `inverse`+opacity-70） |
| AmountBox Balance 满色 foreground | REGRESSION→fixed | `AmountBox` balance → `muted-foreground`（≡ 4175 `ink-strong` 70%） |
| SwapMetaPanel label/value 13px | REGRESSION→fixed | `copy`→`detail`（14）+ `tracking-normal` |
| Exchange price 数值 1.0001 vs 1.001 | IGNORE | 动态报价 |
| Buy Balance 数值差异 | IGNORE | 链上余额 |
| FAQ question 14/1.3 | 已对齐 | `variant="question"` ≡ 4175 `text-sm` |
| Trade FAQ pill tabs（USD1 active） | REGRESSION→fixed | `DappPillTabs`：`soft`+`primary`+`lg`（`leading-snug`）；禁 `solid`+percent `md`；Chip `md` 去误挂 `bg-card`，`outlined` 自带 `bg-card`；`soft` 透明 1px border 对齐盒模型 |
| muted-foreground 0.5→0.7（hub/子页正文） | INTENTIONAL | 同 §5；禁贴回 4175 50% |
| hub 底栏 / promo 1px Y / coral 级联细带 | IGNORE | 滚动/抗锯齿；非结构回归 |
| Convert 右栏 peach 卡顶边细带 | IGNORE | 1–2px 圆角抗锯齿 |

入口：hub → 点 **Convert**（`flash`）/ **Trade**；脚本 `swapView: 'flash'|'trade'`。

## 5e. Swap hub 登录态 heatmap 标签（env-aligned · 2026-07-09）

| 红块 | 标签 | 说明 |
|------|------|------|
| b5/b6/b9–b11 正文灰阶 | INTENTIONAL | muted 0.5→0.7 |
| b7/b8 promo↔FAQ 交界 | IGNORE | 1px Y + 抗锯齿；promo computed 已对齐 |
| b0–b4 底栏 / coral 细带 | IGNORE | 视口底 / 级联 |
| Convert/Trade 模式卡正文 | INTENTIONAL | 同 muted |

## 6. 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 合并 parity / slice 验收流程 |
| v2.0 | 更新为 P0–P7，增加人工对照表优先、Chip/Input/Composite gate |
| v2.1 | 同步最终命名：4 Card surface、Input default/numeric/amount、Composite 最终名、P8 清债 |
| v2.2 | dapp-genesis-desktop 红块标签 + panel leading 1.3 / Text max-dapp 覆盖修复 |
