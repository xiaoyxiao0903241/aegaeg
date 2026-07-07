# 视觉 Parity 工作流（4175 vs 5174）

> **适用**：Typography / shell / DApp·Home 与 **dev 基线**（`/private/tmp/aegis-dev-baseline`，`:4175`）的像素级与 computed 级对齐。  
> **前置 SSOT**：[`style-refactor-playbook.md`](./style-refactor-playbook.md)（改代码前样式栈）· [`typography-baseline.md`](./typography-baseline.md)（4175 字阶映射）。  
> **Figma**：新元素 / 缺状态时用 Figma；**回归 parity 以 4175 为准**，不得用 Figma 数值替代 4175 跑 regression（见根 `AGENTS.md` §8.4）。

**本文件是验收主路径。** `compare:computed` 探针是回归网，**不能替代**本流程。

---

## 0. 原则

| 原则 | 说明 |
|------|------|
| **截图发现 WHERE** | `diff.png`（人眼）→ `diff-heatmap.png`（聚类）→ 定位 DOM |
| **computed 确认 WHAT** | 同一语义 leaf 上比对 rules / computed |
| **探针是副产物** | 稳定 diff 节点才晋升 `ui-compare-computed.mjs` |
| **0% ≠ pass** | 须打开 `diff.png` + widget crop；小元素可被全页 pct 淹没 |
| **禁止探针先行** | 不得「先列 probe 再宣称对齐」 |
| **动效不在修复范围** | 截图时用 `freezeMotion` 只为**避免假 diff**；parity 修复阶段**不管**动画/过渡/视频帧对齐 |

---

## 1. 环境（每次会话固定）

```bash
# 终端 A — 基线 dev
cd /private/tmp/aegis-dev-baseline && pnpm dev --host 127.0.0.1 --port 4175 --strictPort

# 终端 B — 当前 branch dev
cd /Users/ava/Documents/Projects/aegis && pnpm dev --host 127.0.0.1 --port 5174 --strictPort

# Kimi WebBridge 守护进程 + Edge 扩展已连接
```

| 端口 | 角色 |
|------|------|
| `4175` | **基线 SSOT**（dev worktree） |
| `5174` | 当前 refactor 分支 |

**状态对齐**：DApp hash tab（`#swap` / `#genesis` / `#rewards` / `#community`）、Swap hub vs 子视图、wallet 连接态与 suite 一致。

---

## 2. 主闭环（必须按序）

```
Phase A  样式栈（playbook §1–2，改代码前）
    ↓
Phase B  compare:screenshots（顺序截图 + origin 门禁）
    ↓
Phase C  compare:diff-audit（标红簇 → DOM → computed）
    ↓
Phase D  按 audit 改静态样式/布局（不管动效）
    ↓
Phase E  重跑 B + C
    ↓
Phase F  compare:computed（回归网）+ test:unit + lint:all
```

**切片 DONE**：audit 零未解释 diff 簇；`report.json` 中 `baseTab.origin` / `currTab.origin` 正确；playbook §4.2 勾选。

---

## 3. Phase B — 截图 diff

```bash
pnpm compare:screenshots
# → tmp/screenshot-diff/<target>/
#     base-4175.png   ← 4175 单张
#     curr-5174.png   ← 5174 单张
#     diff.png        ← curr 底图 + 差异标红（人眼验收）
#     diff-heatmap.png← 灰底 + 红点（机器聚类，勿用人眼）
# → tmp/screenshot-diff/report.json
```

### 3.1 截图方式（已验证）

**默认 `fullPage`（推荐）**：WebBridge CDP `Page.captureScreenshot({ captureBeyondViewport: true })` + `Page.getLayoutMetrics().cssContentSize` → **一张原生整页 PNG**（如 Home desktop **1440×6857**），**保留 Edge / 钱包会话**，`tileCount: 1`。

**Legacy `longPage`**：`UI_COMPARE_CAPTURE=longPage` — 视口分段滚动 → 垂直拼接；有接缝/动效时机风险，仅作 fallback。

`report.json` 含 `captureMode`（`webbridge-fullPage` / `longPage`）、`stitchedHeight`、`tileCount`。

**4175 一张、5174 一张**，必须 **顺序截图**，禁止同一 session 内同时开两个 localhost 标签：

```
每个 target:
  close_session
  navigate(4175) → prepare → assert origin:4175 → screenshot → close_tab
  navigate(5174) → prepare → assert origin:5174 → screenshot → close_tab
  writeDiff(base, curr)
  close_session
```

| 步骤 | 说明 |
|------|------|
| `prepare` | CDP viewport · hash tab · scrollHome/scrollDapp · freezeMotion · **CDP fullPage 截图** |
| **origin 门禁** | `location.origin` 必须等于 `http://127.0.0.1:4175` 或 `:5174`，否则 **FAIL** |
| `report.json` | 记录 `baseTab` / `currTab` 的 `url`、`tabId`、`origin` |

**错误用法（已证实会产出假「几乎相同」PNG）**：

- 同时 `navigate` 4175 + 5174 两个标签，再 `find_tab` 切换  
- `find_tab` 在双 localhost 标签时会**误匹配端口**（搜 5174 仍返回 4175 标签）→ 两次截图同一端口 → pct 虚低（如 swap 0.5% vs 真实 ~8%）

### 3.2 Target 矩阵（10 个，全跑）

| id | viewport | tab | 备注 |
|----|----------|-----|------|
| `home-desktop` | 1440×900 | — | **fullPage** · scrollHome · freezeMotion |
| `home-h5` | 390×844 | — | **fullPage** · scrollHome |
| `dapp-swap-desktop` | 1440×900 | `#swap` | fullPage |
| `dapp-swap-h5` | 390×844 | `#swap` | **fullPage** · scrollDapp |
| `dapp-genesis-desktop` | 1440×900 | `#genesis` | |
| `dapp-genesis-h5` | 390×844 | `#genesis` | `scrollDapp` |
| `dapp-rewards-desktop` | 1440×900 | `#rewards` | |
| `dapp-rewards-h5` | 390×844 | `#rewards` | `scrollDapp` |
| `dapp-community-desktop` | 1440×900 | `#community` | |
| `dapp-community-h5` | 390×844 | `#community` | `scrollDapp` |

Tab SSOT：`window.location.hash`（`src/app/utils.ts` `getInitialTab()`），**禁止**点 H5 底栏文案。

### 3.3 读 diff.png

- **`diff.png`**：curr 底图 + 差异标红 — **人眼验收必看**
- **`diff-heatmap.png`**：聚类输入，**不能**当验收图
- 红色 = 像素 RGB 差之和 > `UI_COMPARE_DIFF_THRESHOLD`（默认 8）
- `pct > 0` → 进 audit；**修复时忽略纯动效红区**（见 §0）

**验收参考 pct**（顺序截图修复后，2026-07-07 实测）：

| target | pct |
|--------|-----|
| dapp-swap-desktop | ~8% |
| dapp-swap-h5 | ~19% |
| dapp-genesis-desktop | ~16% |

若 swap desktop 仍 ~0.5%、rail 零红像素 → **截图 capture 错误**，查 `report.json` 的 origin。

### 3.4 假阴性防护

1. 打开 `diff.png`，不全信 pct  
2. Widget / rail **crop 目检**  
3. Home fold 以下：长图应覆盖；若 `captureMode=viewport-fallback` 或 DApp desktop 内列滚动 → 查 `report.json` 的 `scrollHeight` / `stitchedHeight`  
4. 语义色 sRGB 差 ≤ 阈值 → **computed 对照**（如 rail `black/0.7` vs `foreground`）

---

## 4. Phase C — 标红 → DOM → computed

```bash
pnpm compare:diff-audit
pnpm compare:diff-audit -- dapp-swap-desktop   # 单 target
# → tmp/visual-diff-audit/<target>.json
# → tmp/visual-diff-audit/summary.json
```

基于 **`diff-heatmap.png`** 聚类；Playwright 双端口同 viewport 探针 computed。

人工必做：

- 簇打在 `<header>` 但 computed 相同 → 下钻 leaf  
- **布局错位**：同坐标比到「文字 vs 背景」→ 查 lineHeight / margin / btn 高度  
- 语义锚点：文案 / 组件结构，**禁止** `span.rounded-full` + `.first()`

---

## 5. Phase D — 改代码

**在范围内**：字号、字重、行高、字距、颜色、padding/margin/gap、layout 尺寸。  
**不在范围内（不用管）**：

- CSS `animation` / `transition` 曲线与时长  
- hero 视频帧、keyframes 相位  
- hover 过渡中间态  
- `prefers-reduced-motion` 分支  

1. 每个 audit `styleDiffs` → playbook §2 样式栈表 → 单一 variant owner  
2. Typography → `Text variant`；surface/layout 留 leaf class  
3. Shell 轨（wallet 按钮等）不包 Text  

---

## 6. Phase E / F — 复验

```bash
pnpm compare:screenshots              # 默认 WebBridge CDP fullPage
pnpm compare:screenshots:stitch       # legacy 视口拼接 fallback
pnpm compare:diff-audit
pnpm compare:computed:skip-wallet     # 未连接态探针回归
pnpm compare:style-baseline -- dapp-swap-desktop
pnpm test:unit && pnpm lint:all
```

### 6.1 当前基线验收（4175 vs 5174，2026-07）

| 维度 | 目标 | 实测 |
|------|------|------|
| **Computed 探针**（skip-wallet） | 静态 CSS 全 MATCH | **105/105**（忽略 `boxShadow` 动效、≤0.5px 宽度取整） |
| **Style baseline** swap desktop | 0 DIFF | **26 MATCH / 0 DIFF** |
| **Screenshot fullPage** home-desktop | ≤2% | **1.09%** |
| **Screenshot fullPage** dapp-swap-desktop | ≤1% | **0.18%** |
| **Screenshot fullPage** DApp H5 | — | **18–30%**（文档高度不一致，待下一切片） |

**DONE 本切片**：Home + DApp desktop 静态样式；**未 DONE**：DApp H5 布局高度 parity。

| 工具 | 角色 |
|------|------|
| `compare:screenshots` | 发现 WHERE（WebBridge CDP fullPage + origin 门禁） |
| `compare:screenshots:stitch` | legacy 视口拼接 |
| `compare:diff-audit` | 标红 → computed |
| `compare:computed` | 探针回归网 |

---

## 7. 4175 vs Figma

| 场景 | SSOT |
|------|------|
| refactor parity | **4175** |
| 新 frame / 缺状态 | **Figma** |

---

## 8. 教训摘要

| 问题 | 根因 | 处置 |
|------|------|------|
| PNG 95% 相同、rail 无红 | 双标签 + `find_tab` 误匹配 | 顺序截图 + origin 断言 |
| diff 看不到主界面 | 旧版灰底 diff | 改用 overlay `diff.png` |
| Coming soon chip 漏 | 机械 `variant="xs"` | `mode-badge` + 语义锚点 |
| 布局同坐标色差大 | lineHeight 累积 Y 偏移 | computed 比元素 bbox，不单比全页坐标 |
| 动效红区 | 截图未冻结 / 过渡态 | 截图可 freeze；**修复阶段不管动效** |

---

## 9. 相关路径

| 资源 | 路径 |
|------|------|
| 截图脚本 | `scripts/ui-compare-screenshot-diff.mjs` |
| audit 脚本 | `scripts/ui-compare-diff-audit.mjs` |
| computed 探针 | `scripts/ui-compare-computed.mjs` |
| 截图产物 | `tmp/screenshot-diff/` |
| audit 产物 | `tmp/visual-diff-audit/` |
