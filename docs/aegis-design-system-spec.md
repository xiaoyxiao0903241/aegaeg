# AEGIS X Design System — 规范全书

> **版本**：v1.2 · **2026-07-08**  
> **性质**：世界级设计规范 **执行 SSOT**（Figma 31 帧 + Tier A/B/C + rem 架构）  
> **审查（归档）**：[`archive/design-token-audit-synthesis.md`](./archive/design-token-audit-synthesis.md)  
> **迁移执行**：[`foundation/runbook.md`](./foundation/runbook.md)  
> **Token 详表**：[`design-token-tiers.md`](./design-token-tiers.md)

---

## 1. 原则与裁决

| 原则 | 内容 |
|------|------|
| **设计 SSOT** | Figma MCP 导出（31 帧）；canonical 帧定 token |
| **工程验收** | Figma 目标态 + **每切片 dev diff** 可回滚 |
| **文案** | PC SSOT；H5 同 copy 响应式布局 |
| **Tier 规则** | A=全局 semantic · B=组件常量 · C=inline/primitive |
| **产品定稿** | 仅 `rit` 四 Tab **10px Medium**；Connect 状态刻意差异 |

**禁止**：48 角色 Text variant · caption+数字 · blanket H5 +1px · 新裸 hex · 超宽屏放大正文字号

---

## 2. Foundations

| 项 | 值 |
|----|-----|
| 字体 | Montserrat · Regular / SemiBold |
| 根字号 | **16px**（821–1919）；见 §11 rem 架构 |
| DApp 栅格 | 1320 = 84 + 400 + 836 · 折叠 482 · H5 402 |
| 断点 | H5 ≤820 · PC ≥821 · site-fluid ≥1920 |
| topbar | 76 / 60 · stage padding 见 tiers §2 |

---

## 3. Token 架构

```
Primitive     --font-size-13, --dapp-type-meta-size (px-locked)
     ↓
Semantic      theme.css, Text variant, spacing slot 名
     ↓
Component     StatCard, WidgetHeader, DappRail anatomy
     ↓
Role          rit, qhd, dl — 迁移映射 only
```

---

## 4. Typography & Text

### 4.1 Tier A — `<Text variant>`（10 + 3 compound）

| variant | PC→H5 | 用途 |
|---------|-------|------|
| `rail` | **10→10** | 仅 rit |
| `kicker` | 11→12 | compound |
| `meta` | 13→13 | 默认 |
| `detail` | 14→14 | FAQ 答案 |
| `question` | 15→15 | qhd |
| `headline` | 16→15 | 卡标题 |
| `brand` | 17→18 | tb |
| `section` | 18→16 | dl |
| `widget-title` | 21→22 | wh |
| `amount` | 22→23 | 金额 |

**Compound**：`kicker` · `panel-title` · `table-cell`

### 4.2 Tier B — 组件内（不进 Text）

12 ovc/表头 · 20 Modal · 26 wh 未连接 · 30 StatCard

### 4.3 Tier C — inline / 忽略

≤9 次 px · 9px 噪声 · 第三方 SDK

### 4.4 API

```tsx
<Text variant="meta" tone="foreground" />
```

- 轴：`variant` + `tone`（+ `tabular` / `as`）
- 无 `weight` prop
- Shell 自管：net · tooltip · ConnectButton

### 4.5 Home namespace（3–4）

`hero-title` · `section-title` · `display-md` · `mega-hero`

---

## 5. Color

### 5.1 Tier A semantic（14）

| Figma | CSS / Tailwind |
|-------|----------------|
| text/ink | `--foreground` / `text-foreground` (**#0b0e14**) |
| text/body | `--ink-strong` → 升格 secondary |
| text/muted | `--muted-foreground` |
| text/inverse | `--primary-foreground` |
| accent/* | `--primary` / `--accent` / `--coral-bright` |
| functional/up | `--success` |
| bg/* | `--background` / `--card` / `--dark` |
| border/default | `--border` |
| text/on-dark | `--on-dark` |

### 5.2 Tier B 收编 hex

`#5b6472` · `#8b93a1` · `#c9cfda` · `#111625` · `#e9785a`（核查）

### 5.3 Text tone（收敛目标）

`foreground` · `muted-foreground` · `primary` · `success` · `inverse` · `on-dark`

**一步到位**：旧 tone 在 **P1 Foundation 各 PR** 同 PR 改 call site — **禁止** primitive 内 alias 映射。

---

## 6. Spacing

**Tier A — 9 slot**（文档名 + Tailwind，**不进 @theme spacing**）

| slot | px | rem@16 | class |
|------|-----|--------|-------|
| inline-default | 8 | 0.5 | gap-2 |
| stack-compact | 6 | 0.375 | gap-1.5 |
| stack-row | 10 | 0.625 | gap-2.5 |
| stack-faq | 12 | 0.75 | gap-3 |
| inset-box | 14 | 0.875 | p-3.5 |
| inset-card | 16 | 1 | p-4 |
| inset-faq-y | 18 | 1.125 | py-4.5 |
| inset-col-x | 24 | 1.5 | px-6 |
| gutter-section | 34 | 2.125 | pt-8.5 |

**Tier B**：box gap9 · rail gap5/6 · qa · dcol px28 — 见组件 anatomy

**Tier C**：stage pt40 · layout magic — inline + 注释

---

## 7. Shape

### 7.1 Radius Tier A

| token | px |
|-------|-----|
| pill | 999 |
| sm | 14 |
| md | 16 |
| lg | 18 |
| xl | 28 / 24 |

### 7.2 Elevation E1–E6

| ID | 用途 |
|----|------|
| E1 | FAQ |
| E2 | 标准卡 |
| E3 | promo |
| E4 | 抬升卡 |
| E5 | app-window |
| E6 | modal |

### 7.3 Tier B

tooltip **r9** · ham **r13**（组件内）

---

## 8. Shell Primitives

```
topbar → stage → app-window
  rail(rit×4) · wcol(wh) · dcol(dl·qa·tbl)
```

|  primitive | Typography |
|------------|------------|
| rit | `rail` 10px |
| net/wal/lang | 自管 13px SB |
| Connect | 状态变体（刻意） |
| tooltip | 12px · 帧 76:2 |

---

## 9. 组件 Anatomy（Tier B 摘要）

> **详表**：[`foundation/api.md`](./foundation/api.md)

### 9.1 Card surface（收束）

| surface | E | 用途 |
|---------|---|------|
| outlined | — | 标准边框卡 |
| elevated | E2 | MetricCard |
| faq | E1 | FaqList |
| promo | E3 | season / promo |
| window | E5 | app-window |
| modal | E6 | dialog |

Home：`fill=surface|token|transparent` namespace 隔离。

### 9.2 其他组件

| 组件 | 关键 token |
|------|------------|
| Button | variant×size×shape · 无 call-site 断点 typography |
| Text | 10+3 · px-lock vars |
| FaqList | question + detail · stack-faq |
| AmountInput | amount size token |
| StatCard | label 12 · value 30 |
| WidgetHeader | 21 / 12 / 26 disconnected |
| DappRail | rit 10 · r14 · gap 5/6 |

---

## 10. 页面映射（31 帧）

| Canonical | Node | 用途 |
|-----------|------|------|
| Swap | 12:2 / 62:2 | DApp 基准 |
| Genesis | 31:2 / 63:2 | |
| Rewards | 32:2 / 64:2 | |
| Community | 82:430 / 77:76 | |
| Tooltip | 76:2 | net/tooltip |
| Home | 7:2 / 53:2 | display namespace |

变体帧（4150:*、101:347）→ parity 参考，**不进 token SSOT**

---

## 11. rem / 断点 / 高分屏

| 区间 | html 根 | Typography | Shell/layout |
|------|---------|------------|--------------|
| ≤820 H5 | 16px | **逐 variant CSS 覆写**（非 blanket +1） | max-dapp 布局 |
| 821–1919 | 16px | **px-locked `--dapp-type-*`** | rem @16 |
| ≥1920 site-fluid | 阶梯 16→48px | **不随根缩放**（px 或反缩放） | rem 同比放大 |

**允许 px**：字号、tracking、1px border、@media 字面量、Tier C layout  
**禁止 px**：新 Tier A radius/shadow call site · 超宽屏靠根 rem 放大正文

---

## 12. 迁移与验收

- **执行**：[`foundation/runbook.md`](./foundation/runbook.md) · [`foundation/verification.md`](./foundation/verification.md)
- **Legacy WebView**：Chrome 90–91 · hex-first · px-lock typography · prod build 验收

### 待补（世界级缺口）

1. **Motion SSOT** — hover/transition/首页动效边界  
2. **A11y SSOT** — focus、对比度、aria  
3. **Computed CI** — variant × PC/H5 × fluid 矩阵

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.2 | 2026-07-08 | Card surface 收束 · 链 component-anatomy |
| v1.1 | 2026-07-08 | §12 链 Legacy WebView 验收 |
| v1.0 | 2026-07-08 | Composer 2.5 ×5 审查 + 仲裁；12 章全书 |
