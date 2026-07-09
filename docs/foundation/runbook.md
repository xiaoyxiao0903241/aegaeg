# Foundation Runbook（执行 SSOT）

> **API**：[`api.md`](./api.md)  
> **Baseline**：当前分支 + Figma 正式稿

---

## 1. 何时走本 runbook

触达 **Token / Text / Button / Card / Chip / Input / Composite / shell primitive** 时必走。  
纯业务逻辑、Web3、Home 动效脚本 → 各自文档，不扩 Foundation 轴。

---

## 2. 单切片流程（写盘前 → 写盘后）

| Step | 动作 | 产出 |
|------|------|------|
| **1** | 对 [`api.md`](./api.md) 确认公开轴；键数定死 | 不扩轴 / 不新增 alias |
| **2** | Figma 节点 + 当前分支同位置源码 | 根因一句 + REGRESSION \| INTENTIONAL \| IGNORE |
| **3** | 样式栈（字号·字重·行高·字距·色·`!`·`as`） | 单一 owner |
| **4** | primitive 收束 + **全仓 call site**（同 PR） | 无半迁移 |
| **5** | 双 gate | API + 人工对照（`tsc` / 肉眼） |

### 报告模板

```text
Slice: <area>-<intent>
API: api.md §N
Root cause: …
Label: REGRESSION|INTENTIONAL|IGNORE
Verify: …
Risk: …
```

---

## 3. 全站文本

- 用户可见文案 **必须** `<Text variant tone>`。
- `Button` / `Chip` 内字由自身 typography 管（含 `asChild` 链）。
- 布局-only 用 `div` / `section`，禁止平行 typography wrapper。
- **Shell 布局禁止字阶**：`dapp-shell` / rail / mobile-nav 等只留布局 / 色 / 间距；`text-*` / `font-*` / `leading-*` / `tracking-*` 不得进 shell chrome（字阶归 `<Text>`）。
- **禁止组件硬编码**：`text-[Npx]`、`tracking-[Npx]`、`max-w-[Nch]`、组件内 `#hex` / `rgb()`（色进 `tokens.json` 或 engineering `:root`；字距用 em 或 `--type-*-tracking`）。
- **JS 色值**：`theme.ts` 从生成的 `colorHex` 取 brand 色；thirdweb Connect 可保留 chrome-only hex（非产品轴）。Toaster / scrollbar / wallet 阴影走 engineering CSS vars，禁在 `app.css` / `scrollbars.css` 再写裸 `oklch(...)`。

---

## 4. MUST NOT

- `deprecatedAliases` / runtime 旧名映射
- 无映射 / 无根因就改 primitive
- 为凑截图改 `--foreground` 等全局 token
- call site `max-dapp:(text-|font-|leading-|tracking-)`（白名单见 api §8）
- call site `!min-h-*` / `!text-*` 绕过 Button size
- 新增 `ink-*` / `faint` / `on-dark` / `coral-bright` 等遗留色
- 把 `dev` 结构当保留理由（`dev` 有冗余 ≠ 该留）
- **导出 Tailwind class 常量**（`*Class` / 平行 `*-layout.ts` 间距表）；单用处写在 JSX；多处复用 → **抽组件** 或组件内 `tv()`

---

## 5. Class / CSS 减法

| MUST | 说明 |
|------|------|
| 无 `*Class = {…} as const` / 顶部长样式表 | 一次性布局写在 JSX `className` |
| 无空装饰 class | 仅当 CSS/脚本真正选择该名 |
| 动效用 `data-*` | 同步改选择器 |
| 以「是否影响样式」删冗余 | 不看旧 worktree 是否保留 |
| 视觉偏差找根因 | 改 SSOT / call site；禁 `!important` / 局部特判 |
| 红块优先 | 整页 `%` 不作收工 |
| 探针降级 | 仅肉眼分不清或硬验收时 scoped 取 computed |

### 禁止当死 CSS 删

| 区域 | 为何 |
|------|------|
| `home-motion.css` + reveal `data-*` | Home 动效运行时 |
| `wallet.css` 主路径（connected chip / connect-embed / tw-modal） | Connect shell；CTA 已迁 Button |
| DApp 动效钩子（`faq-answer-panel*` · `dapp-collapsible-*` · panel-enter · modal/sheet …） | 有 DOM/`data-*` 绑定 |
| `scrollbars.css` 全局 + `scrollbar-x-track` | 表卡横向滚动（`scrollbar-none` / `scrollbar-dark` 已删：零 call site） |

可删前提：`rg` 全仓（含 `scripts/`）零命中，且不在上表。

### 跨 tab 统一

| 面 | SSOT |
|----|------|
| 左卡 padding/圆角 | Card `outlined` / `DappSideCard` |
| 块间距 / 标题→内容 | `DappDetailBlock` · `DappSection` / `DappContentHeading`（`pb-4`）· `DappWidgetFrame` |
| 标题字阶 | Text `section` / `panel` + `copy` |
| 主 pill 高度 | `DappActionButton`：inverse 38 · card 42 · external 44 · modal 46 · hero 48；Home hero / topbar Connect = Button `lg` 48 / `sm` 36 |
| Overview 指标 | `MetricCard`；Community `sc` / Rewards hero **不并** |

`group-data-[tab=*]`：只合并同值重复；跨 tab 复用组件必须保留守卫。

---

## 6. 视觉诊断序

```text
红块清单 → 裁切肉眼（色/字/布局/动态/抗锯齿）
  → 同位置源码根因 + 标签
  → 改 SSOT / call site
  → （可选）scoped 探针
  → 重跑对照
```

1–2px 渲染取整、动态数值内容 → 通常 IGNORE。

---

## 7. Token 提醒

- 源：`src/shared/styles/tokens/tokens.json` → 生成 `theme.css` / `tokens.ts`
- 改 token 后跑 `pnpm build:tokens`
- 新色必须有设计/工程依据，并进 `tokens.json`（禁组件内硬编码 hex）

---

## 修订

| 版本 | 说明 |
|------|------|
| v3.0 | 收束为 baseline 维护手册；去掉 P0–P8 迁移叙事与 Phase0 依赖 |
| v3.1 | 删 verification.md；禁 class 常量 / `dapp-detail-layout`；多处复用抽组件 |
| v3.2 | 删 `shell-layout.ts`；布局进 `dapp-shell` / rail / widget 组件；`SwapFlowButton` 替代 class 常量 |
