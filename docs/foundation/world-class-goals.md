# 世界级重构目标（North Star）

> **定稿时机**：`b1ad39b` 之后 · 登录态四 tab 对照后  
> **视觉基线**：登录态 4175（`pnpm dev:baseline`）computed + Figma SSOT  
> **完成定义**：API gate + 人工对照表 + 探针；**探针 PASS alone ≠ DONE**

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
3. 子页（Convert / Trade）按 heatmap **红块**收敛，不用整页 %。

### D. 工程

1. Foundation 六组件 API 与 `api.md` 键数一致；无 legacy alias。
2. 改 primitive → 全仓 call site 同 PR；runbook 映射表先于写盘。
3. `pnpm exec tsc --noEmit` + 相关 `compare:style-baseline` 切片可复跑。

---

## 4. 推进顺序（自主重构时遵守）

```text
1. 共享 chrome 回归清零（topbar / lang / rail / heading）← 本提交已收一刀
2. Swap 子页 Convert/Trade heatmap 红块
3. Genesis / Rewards / Community 剩余 REGRESSION（不动 Community 左 padding）
4. Home header 与 DApp chrome 对齐（语言按钮、brand 走 Text）
5. 硬编码色/尺寸清扫 + 全站 Text 覆盖审计
6. P8 删 legacy theme 块与死 alias
```

每步：**最小闭环** → 登录态截图/DOM 标签 → 需要时再 commit。

---

## 5. 当前已知差距（对照后）

| 项 | 状态 |
|----|------|
| Topbar brand 18/28/-0.45 | fixed (`b1ad39b`) |
| Language menu 叠字 | fixed |
| Type size px-lock → rem | fixed |
| Lang item radius 10→14 | INTENTIONAL（radius-sm） |
| muted / section lh / FAQ 色 | INTENTIONAL |
| Community 左卡 padding | 用户锁定，不改 |
| Swap Convert/Trade 红块 | 待收敛 |
| Home brand 仍裸 span | 待收 |
| 硬编码色未清零 | 待扫 |

---

## 6. 修订

| 版本 | 说明 |
|------|------|
| v1.0 | 登录态四 tab 对照后首版 North Star |
