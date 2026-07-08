# AEGIS X Design System

> **版本**：v1.3 · **2026-07-08**  
> **规范全书**：[`aegis-design-system-spec.md`](./aegis-design-system-spec.md)  
> **迁移执行**：[`foundation/runbook.md`](./foundation/runbook.md)  
> **Token 收束 SSOT**：[`design-token-tiers.md`](./design-token-tiers.md)（Tier A/B/C）  
> **五路审查（归档）**：[`archive/design-token-audit-synthesis.md`](./archive/design-token-audit-synthesis.md)

---

## 0. 导出数据

| 路径 | 内容 |
|------|------|
| [`figma-export/README.md`](./figma-export/README.md) | 31/31 帧索引 |
| [`figma-export/raw/*.tsx`](./figma-export/raw/) | MCP 原始 React+Tailwind |
| [`figma-export/tokens-aggregated.json`](./figma-export/tokens-aggregated.json) | 字号/间距/颜色/圆角聚合 |
| [`figma-export/frames/*.json`](./figma-export/frames/) | 每帧 typography 逐节点 |
| [`figma-pages-inventory.md`](./figma-pages-inventory.md) | 全页面帧清单 |
| [`scripts/extract-figma-design-tokens.py`](../scripts/extract-figma-design-tokens.py) | 重新提取脚本 |

```bash
python3 scripts/extract-figma-design-tokens.py
```

**Canonical 抽样帧**（规范归纳 SSOT，非工程路由 SSOT）：Swap `12:2` · Genesis `31:2` · Rewards `32:2` · Community `82:430` · Tooltip `76:2`。4150:* / 101:347 等变体帧不写入 token SSOT。

---

## 1. Foundations

### 1.1 设计原则

1. **信息密度优先**：DApp 默认阅读档 **13px**（2392 文本节点中 835 个 ≈ **35%**）。
2. **Montserrat 双字重**：Regular（400）正文 · SemiBold（600）标题/数值/强调；**无第三字重 prop**。
3. **容器承担间距**：`gap` / `padding` 在父级；`<Text>` 与 shell primitive **零 margin**。
4. **语义色优先字面量**：Figma variable → `theme.css`；游离 hex 待收编。
5. **PC 文案 SSOT**：H5 是响应式布局，不是第二套 copy。
6. **冲突裁决**：**Figma 为准**；dev 差异记入 §8 迁移清单，不作为设计目标保留。

### 1.2 设计债（Typography）

Figma 31 帧聚合出现 **32 种 px 字号**（9–138）。成熟 Design System 通常 DApp UI **8–12 档**、Marketing **6–10 档 display**。

| 评价 | 说明 |
|------|------|
| **现状** | 10–22px 间几乎每 1–2px 一档；Home 24–138px 再叠 13 档；**属于偏高熵、维护成本大的设计** |
| **工程策略** | **Primitive 全覆盖**（忠实 Figma px）+ **Semantic 按域命名**（DApp / Home 分表）+ 后续设计迭代 **收束字阶** |
| **9px** | 仅 1 节点（H5 Community）→ **非正式档**，不建 semantic variant |

### 1.3 网格与 Shell

| 域 | 规格 |
|----|------|
| 根字号 | 16px @ 设计宽 |
| DApp 三列 | **1320 = 84 + 400 + 836**（rail · wcol · dcol） |
| 折叠窗 | **482px**（仅 rail + wcol） |
| H5 单栏 | **402px** 全宽 app-window |
| topbar | PC **76px** · H5 **60px** |
| stage padding | PC pt80 pb40 px20 · H5 px12 pb24 |
| app-window 圆角 | PC **28px** · H5 **24px** |

### 1.4 断点

| 名称 | 值 | 行为 |
|------|-----|------|
| `max-dapp` | ≤820px | H5 |
| `dapp` | ≥821px | PC DApp / Home 桌面 |

H5 字号 **逐 variant 查 Figma H5 帧**，禁止 blanket +1px 公式。

---

## 2. Design Tokens 架构

> **Spacing · Color · Radius · Elevation 收束** → [`design-token-tiers.md`](./design-token-tiers.md) §2–§4。

```
primitive/     → --font-size-{px}、--tracking-{px}（Figma 出现的每一档 px）
semantic/      → <Text variant="…"> / home-text variant（按域命名，无 caption+数字）
component/     → shell、box、faq、tooltip（间距不进 @theme spacing）
role/          → Figma data-name（rit、qhd、tb、dl…）— 文档/迁移映射，不进公开 API
```

### 2.1 颜色（Primitive → Semantic）

| Figma token | 值 | Semantic |
|-------------|-----|----------|
| `text/ink` | `#0b0e14` | `foreground` |
| `text/body` | `rgba(0,0,0,0.70)` | 次级正文 |
| `text/muted` | `rgba(0,0,0,0.40)` | `muted-foreground` |
| `text/inverse` | `#ffffff` | 深底主文 / 按钮白字 |
| `text/on-dark` | `#b8c0ce` | 深底次级 |
| `accent/primary (coral)` | `#c85c3f` | `text-primary` / rail active |
| `accent/coral-button` | `#e66a47` | `bg-primary` |
| `accent/coral-soft` | `#fceae2` | rail hover、chip 底 |
| `accent/coral-bright` | `#f4a98f` | kicker |
| `functional/up` | `#16b979` | `success` |
| `bg/surface` | `#ffffff` | `card` |
| `bg/page` | `#f5f6f8` | `background` |
| `bg/dark` | `#11141d` | promo / metric / tooltip |
| `border/default` | `#eceef2` | `border` |

**待收编 hex**：`#5b6472`（FAQ 答案）· `#8b93a1`（placeholder）· `#c9cfda`（禁用金额）

### 2.2 圆角

| Token | px | 用途 |
|-------|-----|------|
| `radius/pill` | 999 | 按钮、chip、net、wal |
| `radius/md` | 16 | box、meta、标准卡 |
| `radius/sm` | 14 | H5 紧凑卡、rit |
| `radius/lg` | 18 | 统计大卡 |
| `radius/xl` | 28 / 24 | app-window PC / H5 |

### 2.3 阴影（Elevation）

| Level | 值 | 用途 |
|-------|-----|------|
| E1 | `0 6px 20px rgba(18,26,51,0.06)` | FAQ 卡 |
| E2 | `0 8px 24px rgba(18,26,51,0.07)` | 标准卡片 |
| E5 | `0 12px 80px rgba(18,26,51,0.16)` | app-window |
| E6 | `0 30px 80px rgba(15,18,31,0.35)` | Modal |
| E7 | `0 8px 24px rgba(0,0,0,0.18)` | Tooltip |

### 2.4 间距（语义 slot）

| Slot | px | 用途 |
|------|-----|------|
| `stack-compact` | 6 | rail 栈、pct |
| `inline-default` | 8 | icon+文案、meta 行 |
| `stack-box` | 9 | swap box 内纵 gap |
| `stack-row` | 10 | topbar |
| `stack-faq` | 12 | FAQ 卡内、卡间 |
| `inset-box` | 14 | swap box padding |
| `inset-card` | 16 | 卡片 px |
| `inset-faq-y` | 18 | FAQ py |
| `inset-col-x` | 24 | wcol/dcol 水平 |
| `gutter-section` | 34 / 24 | Detail 区块间距 PC/H5 |

5/7/9/11/13/28 等：**组件常量**，不膨胀 `@theme`。

---

## 3. Typography

> **收束定稿**（Tier A/B/C、频次、spacing/color 同级规则）→ **[`design-token-tiers.md`](./design-token-tiers.md)** §1。  
> 下文为摘要；统计 rerun 见 [`figma-export/token-usage-audit.json`](./figma-export/token-usage-audit.json)。

### 3.1 统计摘要

| 指标 | 值 |
|------|-----|
| 文本节点（raw 统计） | **2407** |
| distinct px（raw） | **20** |
| **Text variant（Tier A）** | **10** + **3 compound** |
| 降为组件内（Tier B） | 12·20·26·30 px 等 |

### 3.2 Tier A variant 摘要

| `variant` | px | 说明 |
|-----------|-----|------|
| `rail` | **10** | **仅**左侧 rit 四 Tab（产品定稿） |
| `kicker` | 11 | compound |
| `meta` | 13 | 默认阅读档 |
| `detail` | 14 | FAQ 答案、tk |
| `question` | 15 | qhd |
| `headline` | 16 | 卡小标题 |
| `brand` | 17 | tb |
| `section` | 18 | dl |
| `widget-title` | 21 | wh 主标题 |
| `amount` | 22 | 金额 |

**Tier B（不进 Text）**：12px ovc/表头、20px Modal、30px StatCard、26px wh 未连接。

**Primitive 全表 px 频次**：见 [`design-token-tiers.md`](./design-token-tiers.md) 与 audit JSON。

### 3.3 Text API

```tsx
<Text variant="meta" tone="subtle" />
<Text variant="question">FAQ title</Text>
<Text variant="brand">AEGIS X</Text>
<Text variant="amount" tabular>1,234.56</Text>
<Text variant="meta" className="font-semibold" />  // 罕见字重
```

- 仅 `variant` + `tone`（+ `tabular` / `as`）；**无 `weight` prop**
- 默认省略 `variant` → **`meta`**（13px）
- Shell（net、tooltip、ConnectButton）**自管 typography**，不包 `<Text>`

### 3.4 Role → Semantic 映射（迁移用）

| Figma `data-name` | → `variant` |
|-------------------|---------------|
| `rit` | `rail` |
| `box` / `meta` / `r` | `meta` |
| `tk` | `detail` |
| `qhd` | `question` |
| `tb` | `brand` |
| `dl` | `section` |
| `wh` | `widget-title` |
| amount 节点 | `amount` |

---

## 4. 核心组件解剖

### 4.1 Shell 结构

```
topbar (h76/60) → stage → app-window (r28/24)
  ├── rail (84) → rit×4
  ├── wcol (400) → wh + 业务卡
  └── dcol (836) → dl · qa · tbl · meta
```

### 4.2 组件规格摘要

| 层 | Padding / Gap | Typography |
|----|---------------|------------|
| **box** | p14 · gap9 | `meta` |
| **meta** | px14 py13 · gap8 | `meta` |
| **qa** | px24 py18 · gap12 | `question` + `detail` |
| **tbl** | header px16 pt14 | `meta` / `table-cell` |
| **rit** | py11 · gap5 · r14 | **`rail` 10px Medium**（仅左侧四 Tab 文案） |
| **net** | h36 · px14 · gap8 | **13px** SB（自管，非 `<Text>`） |
| **cta** | h42-44 · pill | **15px** SB |
| **tooltip** | px12 py9 · r9 | **12px** medium lh1.45（自管） |

**Tooltip SSOT 帧**：`76:2`

### 4.3 状态变体

| 状态 | 表现 |
|------|------|
| disconnected | Connect CTA **15px**；amount 禁用 `#c9cfda` |
| connected | net + wal + lang |
| collapsed swap | **482px** 窗（`182:17`） |
| modal | 560×560/720 · p24 · E6 |
| convert flow | `4161:936` · `panel` 20px 标题 |

---

## 5. Home vs DApp

| 共享 | 分叉 |
|------|------|
| 色板、断点、Montserrat、primitive px | DApp §3.3 semantic |
| ConnectButton | Home §3.4 semantic + display 档 |
| PC 文案 key | H5 渐变顶区（`62:2`） |

---

## 8. dev 迁移清单（Figma 为准 · 待改代码）

| # | 区域 | Figma 目标 | dev 现状（约） |
|---|------|------------|----------------|
| 1 | FAQ 问题 | `question` 15px | PC 14 / H5 15 |
| 2 | FAQ 答案 H5 | `detail` 14px | 13px |
| 3 | Connect CTA | 15px | 14px |
| 4 | `brand` tracking | −0.34px | −0.28px |
| 5 | net 标签 | 13px SB | 12px |
| 6 | 默认阅读档 | `meta` 13px | 混用 sm/xs |
| 7 | `dl` 区块 | `section` 18px | 可能 17px |
| 8 | Text variant 名 | §3.3 表 | ~48 角色名 + caption/title 编号 |

实施路径：[`foundation/runbook.md`](./foundation/runbook.md) + [`foundation/api.md`](./foundation/api.md)

---

## 附录

| 文档 | 用途 |
|------|------|
| [`design-token-tiers.md`](./design-token-tiers.md) | **Tier A/B/C 收束 SSOT** |
| [`archive/design-token-audit-synthesis.md`](./archive/design-token-audit-synthesis.md) | 五路审查汇总（归档） |
| [`foundation/api.md`](./foundation/api.md) | Foundation 六组件 API |
| [`foundation/runbook.md`](./foundation/runbook.md) | 迁移执行 |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-07-08 | 17 帧 MCP + 四路 agent 合成 |
| v0.2 | 2026-07-08 | 31/31 帧落盘；tooltip / convert 补全 |
| **v1.0** | **2026-07-08** | **Figma SSOT**；32 px primitive 全表；Figma 角色命名 variant；设计债说明；dev 改迁移清单 |
| v1.1 | 2026-07-08 | **仅**左侧 `rail`/`rit` Tab 文案定稿 **10px** |
| **v1.2** | **2026-07-08** | 链 [`design-token-tiers.md`](./design-token-tiers.md)；Typography 收束为 10+3 compound |
