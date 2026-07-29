# UI 页面实现工作流（全仓通用 · 强制）

> **状态：** 用户锁定 2026-07-29  
> **适用范围：** **任意** 用户可见页面 / 表面 / 组件贴稿实现（DApp 七轨、Home、H5、壳、弹层、后续新页）——不限于某一 ticket 序列。  
> **挂载：** 根 [`AGENTS.md`](../../AGENTS.md) §8.0 R5 / §8.4 · [`implement-checklist.md`](./implement-checklist.md) Pre-Design

## 1. 一句话

做任何页面 UI：**手册钉功能 → Figma `get_design_context` 钉 leaf →（有原型则）WebBridge 钉交互 → 对照现码写错位表 → 最小改码 → 回看 → `pnpm check`。**  
禁止用截图肉眼估、结构壳 PASS、钱路 PASS 或 `pnpm check` 绿冒充贴稿完成。

## 2. 三源与工具（硬分工）

| 源                                                    | 钉什么                                                | 工具                                                                | 禁止                                                            |
| ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| **正式 Figma**（现行 fileKey 见 AGENTS §8.4）         | 可见 leaf：树、字阶、色、圆角、阴影、间距、素材、状态 | MCP **`get_design_context`**（主）；写盘前加载 figma-design-to-code | 仅截图驱动实现；整页粘贴 MCP 参考代码；手描 icon 冒充稿         |
| **可操作原型**（若该面有；DApp 见 `~/Downloads/新/`） | 交互状态机：点哪、开层、空态、segment、浮层           | **Kimi WebBridge** 开原型（`file://` 或托管 URL）                   | 抄 DOM/CSS；演示数当门闸/链上真相；只读 research 摘要代替点原型 |
| **frontend-manual ∩ money-path**（触及链上时）        | 读/写、门闸、诚实失败                                 | 读手册 + 既有 read/write                                            | 假数；有 API 永久静态                                           |

冲突裁决（与 AGENTS R4/R5 同向）：**视觉跟 Figma · 交互跟原型 · 钱跟手册。**  
无原型的表面：交互以 Figma 状态帧 + 手册为准，仍须 `get_design_context`；不得用「没有原型」跳过 Figma context。

### 2.1 Figma（任意页）

1. 对本票 **每个相关页级 frame**（PC；若做 H5 则含对应 H5 帧）调 `get_design_context(fileKey, nodeId)`。
2. **大帧必须再拆子节点**二次（或多次）拉 context，直到 leaf 尺寸/间距/字阶可勾选；禁止「只看整页截图」。
3. MCP 返回的代码是 **REFERENCE**：映射进本仓 shell / tokens / call site（见 `src-layout` + foundation），禁止整页粘贴。
4. 图标/图：用 MCP asset 入库或接既有 leaf 组件；禁止手写 path 冒充稿。
5. 截图仅用于定向或收工抽查，**不是**实现规格。

### 2.2 原型（有则必须点）

- DApp 默认三份：`AEGIS X DApp.html`（有数据）· `AEGIS DApp 无数据.html` · `AEGIS DApp Shell 演示.html`（tour）。
- WebBridge **不能**直接打开 `file://`：先在原型目录起本地静态服（例：`python3 -m http.server 8765 --bind 127.0.0.1`），再 `navigate` 到 `http://127.0.0.1:8765/...`。
- WebBridge：`navigate` → `snapshot` / 点击走通本面 IA；对照 `pnpm dev` 本站。
- **不**用安装 Playwright / Cursor browser 学原型；`pnpm test:e2e` 仅可选修后锁回归。
- 一任务一 `session`；`group_title` 用中文。

### 2.3 手册（触及功能/链上时）

先能口述用户流、读/写、前置检查、成功刷新，再开 Figma 元素清单。纯展示且无链上行为的表面：至少确认「无手册义务 / 诚实空 / DEFER」再贴稿。

## 3. 单面标准步骤（每页复制）

```text
1. 手册（若适用） → 允许的读写 / 必须诚实空 / DEFER
2. Figma           → get_design_context（页级 + 子节点）→ leaf 表落盘
3. WebBridge       → 有原型则点通 IA；对照本站
4. 对照现码        → 标：缺 leaf / 错层级 / 错材质 / 交互错
5. 最小改码        → 复用 chrome；按清单改；禁凭感觉「调好看」
6. 回看            → WebBridge 并排；必要时再拉 Figma context
7. pnpm check      → 绿；1–2px 不挡关；整块错 / 错状态机挡关
```

## 4. 验收禁语

禁止用下列任一冒充「该页 UI 已对齐 / 完成」：

- 结构壳 PASS / 钱路 Critical PASS / `pnpm check` 绿
- 「跟稿差不多」且无 leaf 勾选表
- 只更新了摘要文档、未开 `get_design_context` 或（有原型时）未 WebBridge 点原型

## 5. 与其它文档的关系

| 文档                          | 角色                                                      |
| ----------------------------- | --------------------------------------------------------- |
| 本文件                        | **任意页**贴稿工具序与禁法（通用）                        |
| `AGENTS.md` §8.0 R5           | 稿∩手册准入与元素清单形状                                 |
| `implement-checklist.md`      | 单票三门节奏；Pre-Design 须引用本文件                     |
| `.scratch/.../research/38` 等 | 某次 effort 的增强需求 / 顺序；**不得**窄化本文件适用范围 |

某 effort 的 ticket 序（如 11→19）写在该 effort 的 plan/tickets 里，**不是**本通用流程的一部分。
