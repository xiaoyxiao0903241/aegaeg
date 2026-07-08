# Typography Baseline（dev SSOT）

> **样式真源**：`dev` 分支有效 computed 样式。Figma 仅参考。  
> **验收**：同页 dev preview vs 当前分支，字号/字重/字距/行高/颜色一致；布局 `className`（margin、max-width、truncate）允许保留。

## Text API

> **目标态 SSOT**：[`text-refactor-plan.md`](./text-refactor-plan.md)。下表在 Phase 1 完成前仍描述**现状**（含待删 `weight`）。

```tsx
<Text variant="body" tone="strong" tabular>
// 罕见字重（目标态）：
<Text variant="body" tone="strong" className="font-semibold" tabular>
```

| 轴 | 职责 | 禁止 |
|---|---|---|
| `variant` | 字号 + 行高 + 字距 + **默认字重** | call site 写 `text-*` / `leading-*` / `tracking-*` |
| `tone` | 语义色 | call site 写 `text-foreground` / `text-primary` 等 |
| `tabular` | 等宽数字（可选） | — |
| `className` | **布局/状态**；目标态允许**单字重** utility（§4 refactor plan） | 整包 typography |
| ~~`weight`~~ | **删除**（迁移 Phase 1） | — |

## Tone 映射（dev → refactor）

| dev `tone` | refactor `tone` | CSS |
|---|---|---|
| （默认） | `foreground` | `text-foreground` |
| `body` | `strong` | `text-ink-strong` |
| `muted` | `faint` | `text-faint` |
| `subtle` | `subtle` | `text-ink-muted` |
| `coral` | `accent` | `text-primary` |
| `onDark` | `on-dark` | `text-on-dark` |
| `faq` | `faq` | `text-faq-text` |
| `success` | `success` | `text-success` |
| — | `inverse` | `text-white` |
| — | `destructive` | `text-destructive` |

### 35f8393 旧 tone 迁移

| 旧 tone | 新 tone |
|---|---|
| `primary` | `foreground` |
| `secondary` | `subtle` |
| `accent` | `accent` |
| `inverse` | `inverse` |
| `success` | `success` |

## Variant 基线（摘自 dev）

### 通用字阶（`dev:src/components/text.tsx` `size` 轴）

| variant | dev 等价 | 有效样式摘要 |
|---|---|---|
| `xs` | `size="xs"` | `text-xs leading-normal` |
| `sm` | `size="sm"` | `text-sm max-dapp:text-xs leading-normal` |
| `md` | `size="md"` | `text-base max-dapp:text-sm leading-snug` |
| `lg` | `size="lg"` | `text-lg max-dapp:text-base leading-snug tracking-tight` |
| `xl` | `size="xl"` | `text-xl max-dapp:text-lg leading-snug tracking-tight` |
| `2xl` | `size="2xl"` | `text-3xl max-dapp:text-2xl leading-tight tracking-tight` |
| `display` | `size="display"` | `text-4xl max-dapp:text-2xl leading-tight` |

### DApp 角色（`dev:src/app/dapp-type-scale.ts` + 组件常量）

| variant | dev 来源 | 说明 |
|---|---|---|
| `kicker` | `dappKickerClass` | 11px uppercase kicker |
| `caption` | `dappCaptionClass` | 13px 说明行 |
| `label` | 表格/表单标签 | `text-xs tracking-[-0.24px]` |
| `hint` | 辅助说明 | 同 label 字阶，语义为 hint |
| `body` | `size="sm"` 默认 | 14/15px 正文 |
| `body-md` | `size="md"` | 16/17px 正文 |
| `lead` | `size="lg"` + semibold | 区块小标题 |
| `content-heading` | `dapp-content-heading` | `text-lg` + H5 `text-base` + 字距 |
| `title` | `dappTitleSmClass` | 21px 卡片标题 |
| `title-lg` | `dappBodyLgClass` + semibold | 17px 侧栏/卡片标题 |
| `panel-title` | `dappPanelTitleClassName` | 面板 h1 + tab 字距变体 |
| `panel-subtitle` | `dappPanelSubtitleClassName` | 面板副标题 `text-xs` |
| `rank-title` | `dappRankTitleClass` | 排行榜行标题 |
| `value-sm` | 多处 `text-sm semibold` | 14px 数值 |
| `value-lg` | community mobile title 等 | 18px 数值 |
| `amount` | `dappAmountClass` | 22px 金额输入 |
| `referral-amount` | `dappReferralAmountClass` | 推荐奖励金额 |
| `compact-title` | swap mode 等 | 13px semibold |
| `compact-body` | swap mode 等 | 13px normal |
| `program-title` | swap-program-card | `compact-title` + `tracking-[0.08em]` |
| `program-body` | swap-program-card | `compact-body` + `tracking-[-0.03em]` |
| `meta-label` | `dapp-meta-list` label | PC strong / H5 faint |
| `meta-value` | `dapp-meta-list` value | `sm semibold` |
| `table-cell` | `responsive-table` td/th | 表格单元格字阶 |
| `season-title` | season card | `--dapp-season-title-size` |
| `season-meta` | season card meta | `--dapp-season-meta-size` |
| `faq-question` | `faqQuestionClass` | FAQ 问题 |
| `faq-answer` | `faqAnswerClass` | FAQ 答案 |

### Home 角色

| variant | dev 来源 | 说明 |
|---|---|---|
| `section-eyebrow` | `home-section-head` eyebrow | `text-xs tracking-[1.82px] text-primary` |
| `section-display` | `home-section-head` title | `text-4xl max-dapp:text-2xl` |
| `section-subtitle` | `home-section-head` subtitle | `text-base max-dapp:text-sm` + strong |
| `hero-eyebrow` | `heroClass.eyebrow` 内文 | `text-xs leading-[1.2]` |
| `hero-title` | `heroClass.title` | `text-6xl max-dapp:text-4xl` |
| `hero-body` | `heroClass.body` | `text-lg max-dapp:text-sm` + strong |
| `metric-stat` | `home-metrics-section` value | `text-5xl max-dapp:text-3xl` |
| `feature-title` | `home-icon-feature-section` h3 | `text-xl max-dapp:text-lg leading-[1.2]` |

### 别名（迁移期）

| 旧 variant | 新 variant |
|---|---|
| `home-eyebrow` | `section-eyebrow` |
| `home-display` | `section-display` |
| `home-lead` | `hero-body`（hero）/ `section-subtitle`（section head） |
| `title-xl` | `panel-title` |

## Call site 替换规则

1. 读 `git show dev:<mapped-path>`，提取**字体** class（不含 margin/width）。
2. 查上表选 `variant` + `tone`（[`text-refactor-plan.md`](./text-refactor-plan.md) §8）。
3. 删除 call site 上的 `text-*`、`leading-*`、`tracking-*`、`font-*`（variant 已覆盖；罕见字重见 refactor plan §4）。
4. 保留布局 class：`m-0`、`mt-*`、`max-w-*`、`truncate`、`block`、`text-right` 等。
5. dev 用裸 `<h1>`/`<span>` 且字阶稳定 → 改用 `<Text variant=…>`。

## 视觉验收（全站 · Edge 有界面）

```bash
# dev baseline（worktree）
cd /private/tmp/aegis-dev-baseline && pnpm build && pnpm preview --host 127.0.0.1 --port 4175 --strictPort

# 当前分支
pnpm dev   # :5174

# 全站 computed 探针（真实 Edge，可连钱包）
pnpm compare:computed

# 使用本机 Edge 配置（含 MetaMask）— 须先 Cmd+Q 退出 Edge
pnpm compare:computed:system-edge

# 需手动暂停连钱包时
pnpm compare:computed:pause
```

- 浏览器：`channel: msedge`，`headless: false`（默认）
- 配置目录：`tmp/computed-compare/edge-profile`（可保留扩展）
- 覆盖：`/en/` 首页 Desktop+H5 + DApp 四 tab Desktop+H5（仅英文）
- 钱包：`4175` 与 `5174` 各连一次后探测 connected / swap / rewards / community 状态
- 报告：`tmp/computed-compare/report.json`

### Text 例外（shell 自管 typography）

以下组件 **禁止** 在按钮/芯片内包 `<Text>`，字阶由 CSS 类继承：

- `wallet.css`：`.aegis-thirdweb-button*`、`.aegis-connected-wallet-chip`
- Home nav brand / nav links（typography 在 `brandClass` / `navLinksClass`）
- Hero eyebrow pill（typography 在 `.hero-eyebrow` 容器）


| dev | refactor |
|---|---|
| `src/components/text.tsx` | `src/shared/ui/text.tsx` |
| `src/components/*` | `src/shared/ui/*` 或 `src/app/shell/components/*` |
| `src/home/components/*` | `src/views/home/components/*` |
| `src/app/components/*` | `src/app/shell/components/*` |
| `src/app/tabs/*` | `src/views/dapp/*` |
