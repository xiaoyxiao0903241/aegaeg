# 世界级重构目标（North Star）

> **定稿时机**：`b1ad39b` 之后 · 登录态四 tab 对照后  
> **视觉基线**：登录态 4175（`pnpm dev:baseline`）heatmap + Figma SSOT  
> **完成定义**：API gate + 人工对照表（红块标签）+ 可选 scoped 探针；**探针 PASS alone ≠ DONE**

---

## 1. 一句话目标

把 AEGIS X 的 Home + DApp 做成：**一套 token / 一套 Text / 一套 shell primitive**，在任意分辨率下与 Figma 同构，且代码里几乎看不到硬编码色、散落字阶、第二套语义色。

---

## 2. 非目标（明确不做）

| 不做 | 原因 |
|------|------|
| 用整页 screenshot % 当收工 | 动态数 / INTENTIONAL token 会永久染红 |
| 把 INTENTIONAL 贴回 4175 | muted 0.7、radius-sm 14、section lh 1.3 等是 Foundation 定稿 |
| 改 Community 左卡 padding | 用户已确认满意 |
| 为 H5 分叉文案 / 平行组件 | PC 文案 SSOT；H5 只是响应式 |
| 引入动画库 / 新设计语言 | 保持现有品牌与 CSS 动效栈 |
| 默认全页 DOM 探针找问题 | 发现靠红块；探针只确认 |

---

## 3. 世界级验收条（可判定）

### A. Token / 颜色

1. 业务色只来自 `tokens.json` → `theme.css`；组件内 **零新增** hex / 任意 `oklch(...)` / `#FF9500` 类硬编码（SVG stop / 第三方 override 须 PR 注明）。
2. `oklch` + hex 双写是 **有意 fallback**（Chromium &lt;111），不是混用 bug；禁止再发明第三套色。
3. 零命中遗留 class：`text-ink-*` / `text-faint` / `text-on-dark` / `text-faq-text` / `coral-bright`（新 diff）。深底次级文案用 `tone="inverse-muted"`（`#b8c0ce`），禁止 `inverse`+opacity 近似。

### B. Typography

1. 全站用户可见文案走 `<Text variant tone>`；Home brand / 裸 `<span>` 清零。
2. `--type-*-size` 为 **rem @16px**，随 `html.site-fluid` 缩放（1920@16 与 2560@24 正文同比放大）。
3. Chrome 特例（如 DApp brand `text-lg leading-7`）写在 call site + `verification.md` 标签，不偷偷改 brand token 破坏其它面。

### C. Shell / 四 tab 同构

1. Swap / Genesis / Rewards / Community **共享** topbar · rail · card · heading · table · FAQ 行为一致。
2. 登录态对照只标 **REGRESSION / INTENTIONAL / IGNORE**；修 REGRESSION，不修 IGNORE。
3. 子页按 heatmap **红块**收敛，不用整页 %；诊断序见 skill / runbook §6.2。

### D. 工程

1. Foundation 六组件 API 与 `api.md` 键数一致；无 legacy alias。
2. 改 primitive → 全仓 call site 同 PR；runbook 映射表先于写盘。
3. `pnpm exec tsc --noEmit` + 相关 `compare:style-baseline` 切片可复跑。
4. Class / CSS 减法：无顶部长 `*ClassName` / 空装饰 class（见 skill）。

---

## 4. 推进顺序（自主重构时遵守）

```text
1. 共享 chrome 回归清零（topbar / lang / rail / heading）← 已收
2. Swap 子页 Convert/Trade heatmap 红块 ← 主 REGRESSION 已收（pill / TokenChip / rate）
3. Genesis / Rewards / Community 剩余 REGRESSION（不动 Community 左 padding）← Community 主项已收；Rewards 多为 IGNORE
4. Home header 与 DApp chrome 对齐（语言按钮、brand 走 Text）
5. 硬编码色/尺寸清扫 + 全站 Text 覆盖审计
6. P8 删 legacy theme 块与死 alias + 结构债（dappPanelTitleClassName 等）
```

每步：**heatmap 红块** → 源码根因 → 最小闭环 → 需要时 scoped 探针 → commit。

---

## 5. 当前已知差距（2026-07-09）

| 项 | 状态 |
|----|------|
| Topbar brand / Language menu / type rem | fixed |
| Lang item radius 10→14 · muted 0.7 · section lh | INTENTIONAL |
| Community 左卡 padding | 用户锁定，不改 |
| Trade FAQ pill · TokenChip lh · Convert rate tabular | fixed |
| Community stat label · Copy link min-h | fixed |
| Genesis / Rewards 细带红块 | 多为 IGNORE（级联 / 抗锯齿 / 动态） |
| Home brand 仍裸 span | **待收** |
| 硬编码色 / Coming soon `#FF9500` 等 | **待扫**（产品 badge 可保留并注明） |
| 结构债：`dappPanelTitleClassName` 等顶部长 cn | **视觉收敛后再清** |
| P8 legacy theme / 死 alias | **待做** |
| 全站 Text 覆盖审计 | **待做** |

---

## 6. 「离世界级有多远」（粗标尺）

| 维度 | 约进度 | 说明 |
|------|--------|------|
| DApp 登录态视觉 REGRESSION | ~85% | 主红块已修或已标；剩 IGNORE/INTENTIONAL |
| Token / 语义色纪律 | ~70% | `inverse-muted` 已立；硬编码与遗留 class 未清零 |
| Typography / Text 全覆盖 | ~60% | DApp 主路径较好；Home brand / 裸节点未清 |
| Class / CSS 减法 | ~40% | 门禁已写；结构债延后 |
| P8 清债 | ~10% | 未开刀 |
| **综合（North Star）** | **~55–65%** | 视觉主战场过半；工程清债与 Home 仍是大头 |

「世界级」≠ 整页红像素 0%。达标看：§3 四条可判定 + 红块清单无未标 REGRESSION。

---

## 7. 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 登录态四 tab 对照后首版 North Star |
| v1.1 | 红块优先诊断；进度表与「离世界级」粗标尺（2026-07-09） |
