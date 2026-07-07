# 样式重构 Playbook（强制流程）

> **适用**：迁移 / 删除 `*-type-scale.ts`、改 `Text` / `tv()` variant、收束 shell primitive（`SideTitle` 等）、删除散落 class 常量、任何「看起来只是换 API」的 typography 改动。  
> **约束 SSOT**：根 [`AGENTS.md`](../AGENTS.md) §8.7 · [`design-system-audit.md`](./design-system-audit.md) §2。

**未走完本 Playbook 对应阶段，不得写盘。**

---

## 0. 触发条件（命中任一条即强制）

- 改动 `src/shared/ui/text.tsx` 或共享 `tv()` 定义
- 删除 / 内联 typography class 常量（如 `dappRankTitleClass`）
- 改 shell primitive（`dapp-card`、`dapp-dark-banner` 等）的默认样式
- 调用处从 `className` 常量改为 `Text variant` / `tone`
- PR 描述含「样式对齐」「typography 重构」「删 CSS」

---

## 1. 基线采集（Phase A — 只读）

对每个**待改 call site**，在改代码前记录：

| 项 | 做法 |
|----|------|
| 渲染树 | 从页面组件向下列出 **DOM 层级**（含 wrapper primitive） |
| 样式来源 | 标注每一层：`tv()` variant · `className` · 父级默认 · CSS 变量 |
| Git 基线 | `git show HEAD:<file>` 保存改前片段（或 diff 前截图说明） |
| 断点 | 分别记 **PC**（`min-[821px]`）与 **H5**（`max-dapp`）是否有不同 class |
| 消费者清单 | `rg` 全仓：常量名、primitive 名、旧 `size` / `tone` 值 |

**输出物（必写进 PR / 对话）**：每个 call site 一张 **样式栈表**（见 §2 模板）。

---

## 2. 样式栈分析（Phase B — 根因，防遗漏）

### 2.1 七维检查（每层都要过一遍）

| 维度 | 常见遗漏 |
|------|----------|
| **字号** | 父级 `text-base` / `size="md"` 与子级 fluid `var(--dapp-type-*)` 冲突 |
| **字重** | wrapper `font-semibold` + 子组件 `font-normal` 叠加 |
| **行高** | `leading-[1.2]` 仅在 `max-dapp:` 出现 |
| **字距** | `tracking-[-0.34px]` 只在 call site `className` |
| **颜色** | `tone` 在 wrapper 与 leaf 不一致；遗留 `ink-*` vs `foreground` |
| **优先级** | `!text-[length:...]` 用于压过父级 — 迁移后必须仍有**单一 owner** 承载 |
| **语义元素** | `as="strong"` / `h3` 是否在 wrapper 与子组件重复嵌套 |

### 2.2 样式栈模板（每个 call site 必填）

```text
Call site: <文件路径> — <UI 描述>
├─ [Layer 1] <组件名>  default: <variant/size/tone/className>
├─ [Layer 2] <组件名>  adds: <...>
└─ [Leaf]    <组件名>  effective: <合并后的关键 class>

PC 有效样式: size · weight · leading · tracking · color
H5 有效样式:  (同上，标注 max-dapp 差异)
迁移后单一 owner: <一个组件 + 一个 variant>
```

### 2.3 反模式（禁止）

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| 只迁 leaf，保留带默认字号的 wrapper | 字号被父级压回 `text-base` | 去掉 wrapper **或** wrapper 改为零 typography 默认 |
| 删掉 `!important` 未验证层叠 | H5/PC 字号回退 | 在 **一个** `variant` 保留等价锁定，或去掉冲突父级 |
| 假设同名 variant ≈ 旧 class | `title-lg` ≠ `dappRankTitleClass` | 逐 class 字符串 diff，必要时专用 `rank-title` variant |
| 只 grep 常量名，不 grep primitive | 漏 `SideTitle` 上的 className | 同时搜 **消费者 + primitive 定义** |
| 颜色顺手「升级」语义色 | 视觉偏灰/偏亮 | 先 parity 再换 `tone`；颜色变更单独切片 |

---

## 3. 迁移规则（Phase C — 写盘）

1. **单一 owner**：一个视觉角色 → 一个 `variant`（或一个 primitive），样式只在一层声明。
2. **先 parity，后简化**：第一刀行为与改前一致；删 wrapper / 合并 variant 放第二 PR（若需要）。
3. **专用 variant 优于超长 className**：同一字阶 ≥2 处且含 `!` 或 fluid var → 进 `text.tsx`（如 `rank-title`）。
4. **tone 与 variant 正交**：字号进 `variant`；颜色进 `tone`；layout 进 `className`。
5. **deprecated 别名**：旧 API 仅做映射，不删到无 call site 为止。
6. **颜色**：遵守 §8.7 — 新代码不用遗留 `ink-*` / `faint` 等。
7. **deletion-first**：内联成功后删常量文件；`rg` 零命中再删文件。

---

## 3.1 全站文本 SSOT：`Text` 组件

**目标**：所有用户可见文案（含 label、hint、title、金额展示、错误提示正文）必须由 [`src/shared/ui/text.tsx`](../src/shared/ui/text.tsx) 的 `<Text>` 渲染。

| 必须 | 禁止 |
|------|------|
| `<Text as variant tone className>` | 为 typography 新建 React wrapper（`SideLabel`、`DappDarkBannerKicker`、`RankTitleWithSuperCommunity` 等） |
| 布局-only 容器：`<div>` / `<section>` / `aria-hidden` 空 `<span>` | 带字阶/颜色的裸 `<p>` `<span>` `<strong>` `<small>` `<h1>`–`<h4>` |
| `Button` / `DappActionButton` 内文字（按钮自有样式） | 在 `tv()` slot 里重复一整套 `text-* font-* leading-*` 代替 `Text` |
| `input` / `textarea` 用户输入 | 复制 `textVariants()` 字符串到非 `Text` 元素 |

**迁移顺序**：先删透传 wrapper → call site 内联 `Text` → `rg` 裸标签 → 全仓扫尾分 PR 按页面切片。

---

## 3.2 禁止 typography wrapper 与拼串组件

| 类型 | 处理 |
|------|------|
| 1:1 映射 `Text` variant/tone（`SideValue` → `value-sm`） | **删组件**，call site 内联 |
| 一行 template literal + `Text`（`RankTitleWithSuperCommunity`） | **删 `.tsx`**；call site 内联或 **纯函数**（见下） |
| 仅布局 / Card / 多 slot（`RewardBalanceCard`、`RewardsHeroCard`） | **保留** shell，内部字必须用 `Text` |
| Dead export（`SideTitle` 零引用） | **立即删** |

**拼串规则**：

- **1 处**使用 → JSX 内联 `` `${a} · ${b}` ``
- **≥2 处**相同规则 → `format-display.ts` / `core/` **纯函数**（可单测），**不得**新建 React 组件
- 业务派生（`formatPresaleRank`、`formatUsd`）→ 保持 `core/` / `format-display`

**arb 规则（极简 + 安全）**：

1. 删 wrapper 前必填 §2 样式栈，指定唯一 `variant` owner  
2. 含 `!` / fluid var 的 class **只进** `text.tsx` variant，禁止在 call site 复制  
3. PC/H5 分叉在 call site 用三元选 `variant`，不为此新建组件

---

## 4. 验收（Phase D — 必做）

### 4.1 自动

```bash
pnpm test:unit
pnpm lint:all
# 若改动了共享 Text / 大量 views：
pnpm build   # 或至少 tsc -b，说明已知无关失败
```

### 4.2 样式回归清单（每个改动的 call site）

- [ ] PC：字号 · 字重 · 颜色与基线一致（允许 1–2px 渲染差）
- [ ] H5：同上，`max-dapp` 规则未丢
- [ ] 无双重 `Text` / typography wrapper（除非 intentional）
- [ ] `rg <旧常量名>` 在本切片范围零命中
- [ ] 新代码未引入 §8.7 禁止的 legacy 色

### 4.3 人工（UI 角色）

Rewards 等级卡、深色 Banner、Swap 金额框等 **高对比 typographic 角色** — 改后需人眼确认或截图对比。

---

## 5. PR 切片与描述模板

**切片**：单 PR 绑定一个可验证页面区域（如「Rewards 左栏等级卡」），不混 Home + DApp。

**PR 描述必含**：

```markdown
## Style refactor — <区域>

### Call sites
- [ ] <path> — <描述>

### 样式栈（改前 → 改后 owner）
| Site | 改前 effective | 改后 variant/tone | 风险 |
|------|----------------|-------------------|------|

### Verification
- [ ] PC / H5 人眼或截图
- [ ] pnpm test:unit + lint:all
```

---

## 6. 案例：Rewards 等级卡 title（回归教训）

**改前栈**：

```text
SideTitle (strong, size=md → text-base, semibold)
  className += dappRankTitleClass  (!fluid size, !important)
  └─ RankTitleWithSuperCommunity (span)
       className += dappRankTitleClass  (重复)
```

**错误迁移**：去掉 `SideTitle` 上的 `dappRankTitleClass`，仅子级 `variant="title-lg"`（无 `!`）→ 父级 `text-base` 生效，字号变小。

**正确迁移**：

- 新增 `Text variant="rank-title"` = 完整 `dappRankTitleClass` 字符串
- call site **直接** `<Text variant="rank-title">` + 内联或 `formatRankTitleWithBadge()` 拼串
- **禁止**再引入 `RankTitleWithSuperCommunity` 等拼串组件

---

## 7. 相关 SSOT

| 资源 | 路径 |
|------|------|
| Text variant / tone | `src/shared/ui/text.tsx` |
| DApp fluid 字号变量 | `src/shared/styles/dapp-scale.css`（及引用处） |
| Theme 色 | `src/shared/styles/tokens/theme.css` |
| variant 判定 | `docs/design-system-audit.md` §2 |
| Tailwind 约束 | `AGENTS.md` §8.7 |
