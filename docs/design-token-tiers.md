# Design Token 三层收束规范（Tier A / B / C）

> **版本**：v1.0 · **2026-07-08**  
> **数据源**：[`figma-export/token-usage-audit.json`](./figma-export/token-usage-audit.json)（raw 导出统计）· [`tokens-aggregated.json`](./figma-export/tokens-aggregated.json)  
> **版本**：v1.0 · **2026-07-08**  
> **对抗审查汇总（归档）**：[`archive/design-token-audit-synthesis.md`](./archive/design-token-audit-synthesis.md)  
> **上位文档**：[`aegis-design-system.md`](./aegis-design-system.md)

---

## 0. 收束原则

| Tier | 进规范？ | 进 `@theme`？ | 进 `<Text variant>`？ | 典型 |
|------|----------|---------------|------------------------|------|
| **A** | ✅ SSOT | ✅ | Typography：✅ | 跨组件高频、Figma variable 骨干 |
| **B** | ✅ 组件常量表 | ❌（除引用 A） | ❌ | 单组件绑定、中频 10–49 |
| **C** | 📋 仅 primitive 或忽略 | 可选 `--*` | ❌ | ≤9 次、噪声、一次性布局 |

**产品定稿**：仅左侧 `rail`/`rit` Tab 文案 **10px Medium**（PC/H5 均 10）；Connect 顶栏 connected/disconnected **状态变体**，非设计债。

**Primitive 层**：Figma 出现过的 px/hex **可保留 CSS var**，不等于都要 semantic 名或 Text variant。

### 0.1 rem / 断点 / 高分屏（v2 仲裁）

| 区间 | 策略 |
|------|------|
| **821–1919** | `html` 16px；shell/spacing/radius 用 **rem** |
| **≤820 H5** | **逐 variant** `@media` 覆写 `--dapp-type-*`；**禁止** DApp 使用 `mobile-type-scale` blanket +1 |
| **≥1920 site-fluid** | 根 rem 阶梯放大 **layout/shell**；**Typography px-locked 不跟根缩放** |

详见 [`aegis-design-system-spec.md`](./aegis-design-system-spec.md) §11 · [`archive/design-token-audit-synthesis.md`](./archive/design-token-audit-synthesis.md) §4。

---

## 1. Typography

统计：**2407** 文本节点 · raw 导出 **20** 种 px（9–64；Home mega 在部分帧未进 raw 计数）。

### 1.1 Tier A — `<Text variant>`（10 个 + 3 compound）

| variant | px PC→H5 | 次数 | 主要位置 | 字重 |
|---------|-----------|------|----------|------|
| `rail` | **10→10** | 81* | **仅** `rit` 四 Tab | Medium |
| `kicker` | 11→12 | 133 | stat-card kicker、season badge | SB + compound |
| `meta` | 13→13 | 984 | box/meta/r、net 内文 | Regular |
| `detail` | 14→14 | 275 | tk、FAQ 答案 | Regular |
| `question` | 15→15 | 141 | qhd | SemiBold |
| `headline` | 16→15 | 70 | 卡内小标题 | SemiBold |
| `brand` | 17→18 | 57 | tb 顶栏 | SemiBold |
| `section` | 18→16 | 105 | dl 区块标题 | SemiBold |
| `widget-title` | 21→22 | 32 | wh 主标题 | SemiBold |
| `amount` | 22→23 | 38 | 金额行 | SemiBold |

\*10px 含 rail 定稿前导出；实施后 rit 频次上升、12px rail 归零。

**Compound（不进 flat 表扩展）**：`kicker`（+tracking uppercase）· `panel-title`（21px tab 字距）· `table-cell`（13px tracking）

### 1.2 Tier B — 组件内 typography（不进 Text API）

| px | 次数 | 组件 | 处理 |
|----|------|------|------|
| **12** | 400 | ovc 标签、表头、wh 副标题 | `StatCard`/`MetaRow`/`WidgetHeader` 内 `--font-size-12` 或 `label` utility |
| **20** | 29 | Convert/Modal 标题 | `ConvertPanel` / `Modal` title class |
| **30** | 15 | `sc` 统计大数 | `StatCard` value 30px |
| **26** | 16 | wh 未连接主标题 | `WidgetHeader` disconnected state |

### 1.3 Tier C — primitive only / 忽略

| px | 次数 | 说明 |
|----|------|------|
| 40 | 12 | 仅 Home `sechead` → Home namespace |
| 44 | 8 | 仅 `m` 指标 → 组件内 |
| 19, 64, 34, 9 | ≤7 | 噪声 / chrome / 单帧 |

**12px 与 rail**：rail 统一 10px 后，**12px 不再服务 rit**；剩余 12px 全部 Tier B。

---

## 2. Spacing

统计：**gap 23 档 px** · **padding 37 档 px**（raw 导出；含一次性布局大值）。

### 2.1 Tier A — semantic spacing slot（文档 + Tailwind 标准类）

| slot / px | gap 次数 | padding 次数 | 用途 |
|-----------|----------|--------------|------|
| **inline-default / 8** | 216 | 47+ | icon+文案、meta 行 |
| **stack-compact / 6** | 184 | 54 | rail 栈、rit 内 |
| **stack-faq / 12** | 160 | 152 | FAQ 列表、stage H5 px |
| **stack-row / 10** | 117 | 157+ | topbar、py-10 |
| **inset-box / 14** | 59 | 296 | swap box |
| **inset-card / 16** | 20 | 328 | 卡片 px |
| **inset-faq-y / 18** | 2 | 131 | FAQ py |
| **inset-col-x / 24** | 10 | 128 | wcol/dcol px |
| **gutter-section / 34** | 3 | 59 | dl 段 pt |

**不扩展 `@theme` spacing 全集**；A 档用 Tailwind `gap-2`/`p-3.5` 等 + 文档 slot 名。

### 2.2 Tier B — 组件常量（写进组件 anatomy，不进 theme）

| px | 次数 | 组件 |
|----|------|------|
| 5 | 116 | rit 内 gap、rail |
| 9 | 42 | box 纵 gap |
| 7 | 54 | ovc 内 gap |
| 11 | 14+96 | rit py、meta |
| 13 | 38 | meta py |
| 22 | 7+63 | wcol pb |
| 28 | 40+23 | dcol px |

### 2.3 Tier C — 不抽取

`gap-2`·`px-120`·`pt-40` stage 一次性；`876`/`736` 等布局 magic number。

---

## 3. Color

统计：**16** Figma variable 族 · **41** 游离 hex（应趋近 0）。

### 3.1 Tier A — `theme.css` semantic（必须）

| Figma variable | 次数 | semantic |
|----------------|------|----------|
| text/ink | 1084 | `foreground` |
| bg/surface | 641 | `card` / surface |
| border/default | 636 | `border` |
| text/body | 517 | 次级正文 |
| text/muted | 208 | `muted-foreground` |
| text/inverse | 199 | inverse / primary-foreground |
| accent/primary (coral) | 152 | `primary` / `text-primary` |
| accent/coral-button | 143 | `bg-primary` |
| functional/up | 95 | `success` |
| accent/coral-soft | 70 | rail active 底 |
| text/on-dark | 57 | on-dark |
| bg/page | 34 | `background` |
| bg/dark | 44 | dark surface |
| accent/coral-bright | 14 | kicker |

### 3.2 Tier B — 收编 hex → semantic（禁止 call site 裸写）

| hex | 次数 | 映射 |
|-----|------|------|
| `#5b6472` | 53 | FAQ 答案 → `muted-foreground` 或 `--foreground-secondary` |
| `#8b93a1` | 22 | placeholder |
| `#c9cfda` | 8 | 禁用金额 |
| `#111625` | 4 | tooltip 底 ≈ `bg/dark` |
| `#e9785a` | 33 | 核查是否 duplicate coral |

### 3.3 Tier C — defer

token 品牌色（`#5e2a40` gagx 等）· WalletConnect 蓝 · ≤2 次装饰色。

### 3.4 Text `tone` 轴（A 档）

`foreground` · `muted-foreground` · `primary` · `success` · `inverse` · `on-dark` — 与 Tier A 色一一对应；禁止 call site 写 `text-[#…]`。

---

## 4. Radius · Elevation · Border

### 4.1 Tier A — @theme

| token | px | 次数 | 用途 |
|-------|-----|------|------|
| pill | 999 | 467+ | btn、net、chip |
| md | 16 | 175+117 | box、标准卡 |
| sm | 14 | 180 | rit、紧凑卡 |
| lg | 18 | 64 | 统计大卡 |
| xl | 28 / 24 | 3+19 | app-window PC/H5 |

**Elevation（shadow）— 5 档**

| ID | 值 | 次数 | 用途 |
|----|-----|------|------|
| E2 | `0 8px 24px rgba(18,26,51,0.07)` | 140 | 标准卡 |
| E1 | `0 6px 20px rgba(18,26,51,0.06)` | 82 | FAQ |
| E3 | `0 10px 28px rgba(20,28,51,0.1)` | 33 | promo |
| E5 | `0 12px 80px rgba(18,26,51,0.16)` | 20 | app-window |
| E6 | `0 30px 80px rgba(15,18,31,0.35)` | 3 | modal |

### 4.2 Tier B — 组件

| px | 次数 | 组件 |
|----|------|------|
| 13 | 59 | ham 按钮 |
| 9 | 56 | tooltip bubble |
| 11 | 30 | 局部 pill |

### 4.3 Tier C — 忽略

`799`·`699`·`99`·`1000` 等 SVG/导出污染圆角。

**Border**：`border/default` 1px 足够；禁止第三套 gray border hex。

---

## 5. Shell 自管（不进 Text / 全局 variant）

| 组件 | 样式归属 |
|------|----------|
| net / wal / lang | 顶栏 pill 自管（13px SB 等） |
| tooltip | 12px medium，帧 `76:2` |
| ConnectButton / thirdweb | SDK + 项目 connectModal 配置 |
| StatCard 30px 值 | Tier B 组件 |
| Table cell tracking | compound `table-cell` |

---

## 6. Home namespace（与 DApp 分文件）

Tier A display 仅 **3–4 个**：`hero-title`(69) · `section-title`(24–26) · `display-md`(40–54) · `mega-hero`(138)  
其余 Home px → Tier B/C；共享 Tier A 色板与 primitive。

---

## 7. 收束效果（对比）

| 维度 | 收束前（v1.1） | 收束后（本规范） |
|------|----------------|------------------|
| Text variant | ~12 DApp + ~15 Home | **10 + 3 compound**；Home **3–4** |
| @theme spacing | 倾向膨胀 | **9 slot** + Tailwind |
| 色板 semantic | + 41 hex 散落 | **14 A + 5 B 收编** |
| radius | 29 档混乱 | **5 A + 3 B** |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-07-08 | Tier A/B/C 全域收束 + 五路 agent 审查汇总 |
