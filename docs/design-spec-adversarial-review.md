# 设计规范 — 多 Agent 对抗审查与仲裁

> **日期**：2026-07-08  
> **输入**：[`figma-pages-inventory.md`](./figma-pages-inventory.md)（31 UI 帧）· [`inferred-design-spec.md`](./inferred-design-spec.md) · [`typography-baseline.md`](./typography-baseline.md) · [`text-refactor-plan.md`](./text-refactor-plan.md)  
> **SSOT 裁决（v1.0 更新）**：**Figma MCP 导出优先**；dev 差异为 **迁移清单**（见 [`aegis-design-system.md`](./aegis-design-system.md) §8），不是设计目标。  
> 下文 §1–§6 保留对抗过程记录；**最终定稿以 §8 为准**。

---

## 1. 对抗设定

| 视角 | 立场 | Agent |
|------|------|-------|
| **极简派** | 最少 variant / 最少 spacing token；无 parity 失败不改 dev | [极简派审](21bee182-971d-4393-92b2-233d14d2d950) |
| **严格派** | Figma 高频 px 档独立保留；完整 spacing / tooltip 规范；显式 delta | [严格派审](5a959793-de99-4df8-bf66-4af86b03c74d) |

---

## 2. 主 Agent 仲裁结论

### 2.1 可冻结项（双方一致）

| 项 | 结论 |
|----|------|
| Text API | 仅 `variant` + `tone`；**删除 `weight` prop** |
| **17px** | **保留独立档** → 目标 variant `title3`；dev 已有 `--dapp-type-body-lg-size` 17→18 |
| 13px 正文 | `footnote` 为 DApp 默认档 |
| Parity 例外 | `kicker`、`panel-title`、`table-cell` 等 compound **不可删** |
| Home | 独立 variant 组，与 DApp flat 表分文件 |
| Shell typography | network pill / tooltip / ConnectButton **自管**，禁止包 `<Text>` |
| 图标 / 图片 | 不纳入规范（重构范围外） |
| 中文稿帧 | `4161:*` / `4172:*` 字阶与英文帧一致，**合并记录** |

### 2.2 分歧项与裁决

| 分歧 | 极简派 | 严格派 | **仲裁（dev SSOT）** |
|------|--------|--------|----------------------|
| **15px 独立 variant** | 否决 `subheadline`；FAQ 用 `body`+semibold | 保留 `subheadline` 15→14 | **分轨**：Figma 文档保留 **15px 设计档**（inferred §4）；工程 **暂不引入 `subheadline` 15→14**，因 dev `faq-question` = `text-sm` → **PC 14px / H5 15px**（`mobile-type-scale.css`），与 refactor plan 的 15→14 **H5 方向相反**。迁移期保留 **`faq-question` parity 别名** 或映射 `body`+`font-semibold`+现有 responsive scale |
| **DApp flat 档数** | 8 档 + 3 parity | 12 档 + 6 parity | **10 档 + 5 parity**（见 §3.1） |
| **spacing token** | 仅 Tailwind 标准档 | 5/9/14/18/34 等全记录 | **Tailwind 标准档为主**；5/9/14/18/34 写入 **组件间距常量表**（inferred §7 / 本文 §4），**不新增** `@theme` spacing token |
| **callout variant** | 删，合并 footnote+semibold | 保留 13px semibold 档 | **删独立 variant**；同档强调用 `footnote` + `className="font-semibold"` |
| **Connect CTA 15px** | 随 dev 14px | Figma 15px | **dev 优先**（delta #5） |

### 2.3 探针结论（FAQ 15px 关键事实）

```tsx
// src/shared/ui/text.tsx — dev effective
'faq-question': 'text-sm font-semibold ... max-dapp:text-sm'
// PC: text-sm = 14px · H5: --text-sm = 0.9375rem (15px)
```

Figma `qhd` = **15px 恒定**；dev = **响应式 14→15**。这不是「噪声」，而是 **已验收 intentional diff** — 重构不得用 Figma 15px PC 直接改 dev，除非 computed 探针显式改 policy。

---

## 3. 冻结设计规范（可执行版）

### 3.1 DApp flat variant（目标 10 档）

| variant | PC→H5 | 默认字重 | Leading | Tracking | 用途 |
|---------|-------|----------|---------|----------|------|
| `caption` | 10–12→+1 | medium/normal | compact 1.2 | −0.20~−0.24px | badge、rail |
| `footnote` | **13→12*** | normal | body 1.5 | −0.26px | **默认** meta/box |
| `body` | **14→13** | normal | body 1.5 | −0.28px | token、FAQ 答案 |
| `headline` | 16→15 | semibold | title 1.3 | −0.48px | 卡片小标题 |
| **`title3`** | **17→18** | semibold | 1.3 / H5 1.2 | −0.34px（detail −0.68 例外） | 顶栏品牌、rank、侧栏 |
| `title2` | 21→22 | semibold | 1.3 / H5 1.2 | −0.42~−0.63px | widget 标题 |
| `title1` | 22→23 | semibold | 1.3 / H5 1.2 | −0.54px | amount |
| `largeTitle` | 26–30+ | semibold | compact 1.2 | display | Home stat（或归 Home 文件） |

\*H5 13px 主力：`footnote` 在 H5 帧仍为 13px，非 blanket +1。

**Parity 例外（5 个，保留名至 alias 清零）**：`kicker`、`panel-title`、`table-cell`、`faq-question`、`program-title`。

> **Figma-only 档（文档，非当前 variant）**：**15px FAQ 问题** — 见 delta #1；待 policy 变更后再映射为 `subheadline` 或改 dev scale。

### 3.2 Spacing（组件常量 SSOT）

| px | 用法 | 归属 |
|----|------|------|
| 6 | rail 栈、pct | `gap-1.5` |
| 8 | icon+文案、meta | `gap-2` |
| 10 | topbar、pct pt | `gap-2.5` |
| 12 | FAQ 内、stage H5 px | `gap-3` / `px-3` |
| 14 | swap box padding | `p-3.5` |
| 16 | 卡片 px、sechead | `p-4` |
| 18 | FAQ py | `py-4.5` |
| 24 | wcol/dcol px | `px-6` |
| 34 | Home 段间距 PC | `gap-8.5` |
| 5/9/11 | rail 项内、box 纵 gap | call-site 或 slot，不进 theme |

### 3.3 Tooltip / Network pill（`76:2` + 现实现）

| 组件 | 要点 |
|------|------|
| **Tooltip** | bg `#111625`、12px medium lh 1.45、px-3 py-2、`sideOffset=6`；**非 `<Text>`** |
| **Network pill** | h 36/30 PC/H5、rounded-full、12px semibold lh 1.2；BSC 固定无下拉 + tooltip |
| **Rail hover** | coral-soft 底 + 12px 标签 + 190px 宽 tooltip |

---

## 4. Figma→dev Delta 表（须逐条探针）

| # | 区域 | Figma | dev 4175 | 裁决 |
|---|------|-------|----------|------|
| 1 | FAQ 问题 | 15px SB | PC **14px** / H5 **15px** | **dev**；保留 parity 别名 |
| 2 | FAQ 答案 H5 | 14px | **13px** (`max-dapp:text-xs`) | **dev** |
| 3 | Connect 主 CTA | 15px | **14px** primary | **dev** |
| 4 | `title3` tracking | −0.34px | `title-lg` **−0.28px** | **dev**（差 0.06px） |
| 5 | `table-cell` | −0.26px | **tracking 0** | **dev** parity 白名单 |
| 6 | Network pill | ~13px | **12px** (`text-xs`) | **dev** |
| 7 | Tooltip | 帧内 12/14/16 样例 | 统一 **12px** | **dev** |
| 8 | 13px 正文 H5 | 帧内仍 13px | caption H5 → **14px** | **dev** + dapp-scale |
| 9 | `@theme` 15/17 | 推断已写 | 散落 `--dapp-type-*` | Phase 3 收编 |
| 10 | FAQ H5 缩放方向 | 15→14（若用 subheadline） | 14→**15** | **禁止**用 Figma subheadline 覆盖 |

---

## 5. 对 `text-refactor-plan.md` 的修订建议

1. **§3.2 `subheadline`**：标注为 **Figma 目标档**；工程 Phase 1–2 **不迁移** `faq-question` → `subheadline`，直至 delta #1 policy 决议。
2. **删 `callout`**：并入 `footnote` + `font-semibold`（采纳极简派）。
3. **DApp flat 目标**：48 角色名 → **10 flat + 5 parity**（非 12+6）。
4. **Phase 3**：优先收编 `--font-size-17`（已有 var）；**15px theme token 延后**，与 FAQ policy 绑定。

---

## 6. 下一步（不在本文写代码）

1. 逐页填 computed delta（`compare:computed` × 31 帧路由映射）
2. Phase 1：删 `weight` prop + 清冗余 `weight=`
3. Phase 2：alias 映射（`title-lg`→`title3`，**保留** `faq-question`）
4. 用户确认 delta #1 是否改 dev PC 14→15 后，再决定是否引入 `subheadline`

---

## 8. v1.0 最终裁决（产品确认 · 2026-07-08）

> 主 SSOT 正文：[`aegis-design-system.md`](./aegis-design-system.md) v1.0

| 议题 | v0.1 对抗结论 | **v1.0 定稿** |
|------|---------------|---------------|
| 冲突裁决 | dev 4175 优先 | **Figma 为准** |
| 字号档数 | 10 flat + 5 parity | **31 primitive px** + DApp/Home semantic 分表 |
| variant 命名 | caption1/2、title1/2/3、footnote | **Figma 角色派生**：`micro`、`rail`、`meta`、`question`、`brand`、`section`… **禁止 caption+数字** |
| 18px / 20px / 30px | 省略或区间 | **独立档**：`section`(18)、`panel`(20)、`stat`(30) |
| 32 种 px | 未完整落盘 | **全表记录** + §1.2 设计债说明 |
| callout variant | 删，合并 footnote+semibold | **`meta` + font-semibold** |
| 默认阅读档 | footnote | **`meta`**（13px） |
| H5 缩放 | dev mobile-type-scale | **逐 variant 查 Figma H5 帧** |

---

## 7. 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-07-08 | 极简派 vs 严格派盲评 + 主 agent 仲裁 |
| v1.0 | 2026-07-08 | §8 产品确认：Figma SSOT + 全 px 表 + 新 variant 命名 |
