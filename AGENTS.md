AI 工作规范

> **本节用于**：AI 助手自身的行为校准和工程决策。处理用户请求前应先回顾本节。

> 以下规范指导 AI 编码助手在本项目中的工作方式、工程决策和工具使用。

### 8.0 文档分层与解释规则

> 按「管什么」读文档，不按「哪份先出现」。产品验收语言 ≠ 实现归属。索引见 [`docs/README.md`](docs/README.md)。

#### R1 — 层 SSOT

| 问题类型                 | SSOT                                                                                            | 禁止用它决定                      |
| ------------------------ | ----------------------------------------------------------------------------------------------- | --------------------------------- |
| 用户可见行为 / MUST 清单 | Spec + tickets + grilling Answers                                                               | 把验收字面塞进 `shared/ui`        |
| 组件公开轴 / 视觉 chrome | [`docs/foundation/api.md`](docs/foundation/api.md) + [`runbook.md`](docs/foundation/runbook.md) | ticket 示例文案覆盖 API           |
| 文件落点                 | [`docs/src-layout.md`](docs/src-layout.md)                                                      | 「进组件系统」= 业务数据进 shared |
| 用户可见字符串           | `src/i18n/messages/` + §8.4 PC 文案 SSOT                                                        | 在 primitive 硬编码 locale        |
| 静态 UI                  | Figma `uiKwzwIoD06phS0husdqjB`                                                                  | `docs/figma-export/`、旧 fileKey  |
| 交互状态机               | research 09 / 原型语义                                                                          | 抄原型 DOM/CSS                    |
| 链上                     | [`docs/frontend-manual/`](docs/frontend-manual/)                                                | 原型演示数值当门闸                |
| 金钱写路径               | [`docs/money-path-map.md`](docs/money-path-map.md)                                              | UI ticket 重写已证 gates          |

#### R2 — 产品语言 ≠ 实现归属

- Ticket/Spec 写「Segment：活期/180…」「支持两套 options」= **产品要在对应 rail 可用这些档**。
- Foundation 写 `options` / `value` / `onChange` = **primitive 只吃传入数据**。
- 二者同时为真：**call site（views + i18n）组 options**；`shared/ui` 只实现 chrome 合同。
- Spec 用组件名做决策桶（如 `Segment (05): open ≠ claim`）= **产品规则挂名**，不是授权把 domain presets 放进该组件文件。

#### R3 — 「进组件系统 / shared」只扩 chrome

- **允许**进 `shared/ui`：视觉、a11y 轴、动效合同、无 locale 的纯函数 helper。
- **禁止**进 `shared/ui`：业务档位表、locale 文案、合约地址、rail 专属默认 options、locale `aria-label` 默认值。
- 不确定 → [`src-layout`](docs/src-layout.md)：**宁放页袋，勿放 shared**。

#### R4 — 冲突裁决序（疑似打架时）

1. 全局 Contract / 本文件 MUST NOT
2. 该关注点的层 SSOT（R1 表）
3. Spec Implementation Decisions
4. 当前 ticket 验收条
5. research / scratch / prototype / figma-export（仅参考，除非标明现行 SSOT）

写盘前若 ticket 字面与层 SSOT 张力大：**先暴露不确定性**（§8.1），禁止静默用 ticket 覆盖 foundation / src-layout / i18n。

#### R5 — 设计稿 ∩ 手册（实现准入）

> 用户锁定（2026-07-29）：**没有设计稿就无法诚实实现 UI**；手册不能单独授权「发明界面」。

**写盘前第一步（强制）**：对本票相关表面，**先阅读** [`docs/frontend-manual/`](docs/frontend-manual/)（至少 `01-frontend-integration-guide.md` 对应章节 + 相关 `contracts/*.md`）以及触及写链时的 [`docs/money-path-map.md`](docs/money-path-map.md)，**先弄清功能与门闸**，再打开 Figma 做元素清单。禁止跳过手册、只盯稿面或只抄现码。

| 情况                                                                                  | 动作                                                                                                                                               |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Figma 有该表面/控件/状态，且 `frontend-manual`（或 money-path）写了行为/读链/写链** | **MUST 实现**：视觉跟稿，数据与门闸跟手册；禁止只接线不贴稿、禁止只贴稿不接手册规定的链上读/写/门闸                                                |
| **手册有，Figma 无对应表面/控件**                                                     | **缺口记录**（ticket / map Notes / research）：**优先建议补 Figma**（把手册能力补进稿），**禁止**在代码里发明稿外 UI；补稿或产品裁决前不实现该表面 |
| **Figma 有，手册无链上/行为依据**                                                     | **停手暴露**：禁止用原型演示数或臆测当门闸；补手册或明确 DEFER                                                                                     |
| **二者冲突**                                                                          | 按 R4；写盘前暴露，禁止静默选边                                                                                                                    |

写盘前强制：对本票表面做一次「稿元素清单 × 手册 API/门闸」对照；未对照不得称完成。

**「稿元素清单」形状（禁止偷换）**：

- **必须**按 Figma frame **自上而下、可见节点**列出：标题/副文、Segment、金额卡、翻转/切换、meta 行、CTA、右侧概览/关于/FAQ、连接态与未连接态（若稿有分帧）。
- **必须**含两列：① 稿有 → 实现目标；② **代码现有但稿无 → 删除或记缺口**（禁止默默保留原型 chrome）。
- **禁止**只写能力/链上门闸表（如「接 redeem / getConfig」）冒充元素清单；能力表可附属，但不能替代视觉节点清单。
- PC 文案以稿为准写入 i18n；全 locale 键齐全（缺译不得静默英文兜底冒充完成，除非该语种票另有 DEFER）。

**Frontier**：map「无阻塞可立即开」仍须对照**代码就绪度**（验收 DOM/锚点是否已存在或由本票创建）。`Blocked by: None` ≠ 现在就能诚实验收——冲突时先改阻塞图，再 `/implement`。见 [`docs/agents/implement-checklist.md`](docs/agents/implement-checklist.md)。

#### R6 — 做前 / 做后独立审查（UI 与代码质量分轨）

> 用户锁定（2026-07-29）：贴稿与代码质量都要**独立**过关；实现者自检 ≠ 审查。缺任一门不得称本票完成。

| 门              | 何时                 | 审查什么                                                                                                  | 通过标准                                                                                  |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Pre-Design**  | **写盘前**           | ① **已先读手册**弄清本票功能/读写下法/门闸；② R5 产出物：现行 Figma node 元素清单 + 手册对照 + 代码多余项 | 手册章节已注明；清单完整（含「稿无代码有」）；无未暴露的稿∩手册空缺；**未读手册不得开写** |
| **Post-Design** | **实现后、称完成前** | 对照同一清单逐项 pass/fail（截图或 frame 节点 vs 现码）                                                   | 清单无未解释 fail；稿外 chrome 已删；i18n 键与 PC 文案对齐                                |
| **Post-Code**   | **实现后、称完成前** | 与贴稿**分开**审：极简、逻辑清晰可测、删除优先、边界清晰                                                  | 符合 §8.2；无堆叠补丁/多余抽象；纯逻辑有单测或可测缝；`pnpm check` 过                     |

**独立审查含义**：

- Pre-Design / Post-Design / Post-Code 是三条门，**不可互相替代**（过了链上接线 ≠ 过了贴稿；过了贴稿 ≠ 过了代码质量）。
- 默认由**另一会话 / 子 agent / 用户指定 reviewer**对照清单裁决；实现会话只提交证据（清单路径、diff、验证命令）。用户说「跳过审查」才可省略独立方，但仍须留下自检勾选记录。
- Post-Code 关注点：**正确性与可验证性优先于速度**；清晰优于精巧；能一行不五十一行；禁为「以后扩展」预留空壳。

#### R7 — Tab / 切片提交前多 agent 门禁（用户锁定 2026-07-29）

> **每个 DApp tab（或实现 ticket）在 `git commit` 之前**必须过独立多 agent 审查；实现者自检不算过门。Critical 未清禁止提交。

| 规则               | 要求                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **何时**           | 用户要求「tab 完成即提交」或本票称完成并准备 commit 时；**commit 之前**                                                                       |
| **模型**           | 全部审查子代理固定 **`cursor-grok-4.5-high`（Grok 4.5 high）**；禁止默默换模型                                                                |
| **分轨**           | 至少并行两路：① **Post-Design / Spec**（稿∩手册∩ticket 清单）；② **Post-Code / deletion-first**（§8.2、死代码、假数、多余抽象、金钱路径门闸） |
| **Deletion-first** | Post-Code 路必须显式列：应删未删项、可内联的 wrapper、无测缝分支、稿外 chrome                                                                 |
| **世界级标准**     | 正确性 > 可验证性 > 简洁；fail-closed 金钱路径；无机会主义扩面；能一行不五十一行                                                              |
| **产出**           | 审查结论落盘（ticket 勾选或 `.scratch/.../research/*-review.md`）；Critical → 先修再 commit；DEFER 须写明理由                                 |
| **补审**           | 若某 tab 已提交但未过本门 → **补审**；Critical 用 follow-up commit 修，不 rewrite 已推送历史（除非用户明示）                                  |

节奏见 [`docs/agents/implement-checklist.md`](docs/agents/implement-checklist.md)「提交前多 agent」。

### 8.1 工作方式

- **默认端到端完成**：理解问题、读取相关文件、实施最小充分修改、验证、报告。用户明确要求「只分析 / 暂不修改 / 只给建议」时才停在分析。
- **先定义再实现**：先定义真实问题、约束、边界条件、失败模式和验收标准，再选择实现方式。
- **暴露不确定性**：写代码前暴露会影响数据所有权、同步正确性、schema / API、性能目标或平台语义的不确定性；禁止静默假设。
- **优先最小闭环**：优先做能验证目标的最小闭环。切片必须绑定一个用户可判断 case 或一个证明边界。
- **找根因不用补丁**：找根因，不用补丁掩盖症状；失败来自流程时，同步修改文档或本文件，不靠聊天记忆。
- **样式重构**：触达 Foundation / typography / shell primitive 时，**只读** [`docs/foundation/README.md`](docs/foundation/README.md) 双核（runbook · api）+ [`.cursor/skills/aegis-component-refactor/SKILL.md`](.cursor/skills/aegis-component-refactor/SKILL.md)。**当前分支 = baseline**；探针 PASS ≠ 完成。禁导出 `*Class` 常量；多处复用抽组件。
- **小而精准**：保持小而精准的改动；不要机会主义重写、重命名、格式化或清理无关代码。
- **最终报告必须说明**：改了什么、为什么、如何验证、剩余风险。

### 8.2 工程原则

- **决策优先级**：正确性 > 可验证性 > 简洁性 > 复用 > 速度。
- **SSOT**：业务规则、配置语义、状态真相、schema 字段、协议状态和 Derived Fact（派生事实）只能有一个 owner。
- **DRY**：只消除真实且稳定的重复；不要为了去重制造脆弱抽象。
- **KISS**：优先最直接、最容易验证的数据流和实现。
- **YAGNI**：没有当前不变量、成功标准或验证路径的未来能力不做。
- **清晰优先于精巧；显式优先于隐式；项目内一致性优先于外部理想模式**。
- **抽象必须立刻降低认知负担**，或保护真实边界；否则不要引入。
- **优先删除复杂度**，而不是把复杂度搬到另一层。

**实现时**：

- 优先复用既有工具函数、状态容器、脚本入口和测试基础设施。
- 发现重复逻辑时，先判断是否应回收到现有 SSOT；不要默认再包一层。
- **deletion-first**：实现后删除、内联或收窄不服务不变量、成功标准或验证路径的状态、字段、类型、分支、配置和 helper。
- **代码或复杂脚本切片**：按 **§8.0 R6** 做 Post-Code 独立审查 + 受影响验证；用户要求提交时再按单切片单提交；提交前另过 **§8.0 R7**（Grok 4.5 high 多 agent + deletion-first）。
- 人工审查只保留给视觉、手感、真实滚动物理、主观动效质量和真实辅助技术行为（Post-Design 的主观项）。

### 8.3 工具规则

- 用 `rg` 搜索文本、文档、配置、生成文件和 fallback。
- **项目文档索引**：[`docs/README.md`](docs/README.md) — 仅现状 SSOT；**分层与冲突裁决见 §8.0**；命令门禁 [`docs/agents/commands.md`](docs/agents/commands.md)；目录落点 [`docs/src-layout.md`](docs/src-layout.md)。
- **React 运行时**：[`docs/react-runtime.md`](docs/react-runtime.md) — Compiler（全量）、hooks/effect、i18n 渲染、质量门禁；改 hooks/memo/i18n 前先读。
- 触达代码时优先用 `agent-lsp` 做语义查询，使用最小 workspace root。
- **CodeGraph** 是当前默认代码图谱工具。依赖结果前先运行 `codegraph status .`；索引不新时运行 `codegraph sync .`。
- 探索概念用 `codegraph context`；查调用关系用 `codegraph callers` / `codegraph callees`；评估影响面用 `codegraph impact`；文本兜底仍用 `rg`。
- `.codegraph/` 是本地索引并被忽略。

### 8.4 设计稿来源

- **正式 Figma 设计稿 SSOT（静态 UI）**：https://www.figma.com/design/uiKwzwIoD06phS0husdqjB/AEGIS-X--Copy---Copy-?node-id=4253-365&p=f&m=dev（fileKey `uiKwzwIoD06phS0husdqjB`）。历史文件 `sXWXDvBrLeg5r0NnP1SMZH` 仅作过往参考。
- 后续官网首页、H5、DApp 页面和组件的像素级对齐，以该 Figma 文件为准；历史 Figma 链接只作为过往参考，除非用户明确指定。
- **像素级对齐的含义**：优先对齐元素归属、组件结构、视觉层级、字体、颜色、圆角、阴影、边框、间距节奏、素材、hover / active / connected / disconnected 状态。1-2px 的浏览器渲染、截图或布局取整偏差可以接受，禁止围绕这些误差反复修改。
- **PC 是文案 SSOT**：H5 是 PC 的响应式布局，不是独立文案版本。PC / H5 文案不一致时，以 PC 为准；不要为了 H5 单独新增同义文案 key 或分叉 copy。
- **稿上有数值区 + 手册有链上来源**：必须接真实读链/报价（见 §8.0 R5）；禁止长期用假数冒充验收。1–2px 渲染取整仍不阻塞。

### 8.5 首页动效与性能

- **首页 SSOT**：[`docs/homepage-architecture.md`](docs/homepage-architecture.md)（双入口、HTML、Provider、`home-reveal-loader`）；动效规则 [`docs/homepage-animation-guidelines.md`](docs/homepage-animation-guidelines.md)。`bootHomeReveal()` 由 `views/home/main.tsx` 的 `useLayoutEffect` 调用。
- 参考站 `https://aegis-x5.vercel.app/` 只作动效基准，非素材源；生产素材来自正式 Figma 或 canonical public assets。
- 禁 Framer / GSAP / Anime / Lottie；CSS + 少量 IO / rAF。只动画 `opacity` / `transform` / `clip-path` / `filter` / `box-shadow`；hover 不改卡片几何。
- 指标区：面板中线展开 → 计数 + pop；首页动效不按 `prefers-reduced-motion` 降级。
- Figma SVG 须抽 leaf paths，禁整卡污染导出。
- **现状**：`HomeProviders`（无 thirdweb）；DApp 用 `WebRootProviders`；Home CTA 链到 `app.html`；多语言 HTML 为薄壳 CSR（非 SSG）。

### 8.6 AEGIS X DApp 技术约束

- **页面归属**：以 Figma frame title 为准（如 Swap 帧内的 Genesis 说明仍属 Swap）。连接 / 未连接按对应 frame。
- **H5**：同一套 PC 文案与组件的响应式布局；不为 H5 新增同义文案或分叉业务逻辑。
- **对齐**：元素齐全、状态正确、视觉一致、素材来自 Figma；稿∩手册的数值区须接真实读链/报价（§8.0 R5）；1–2px 取整不阻塞。
- **链范围**：EVM only；`supportedChains` **仅 BSC**（Ethereum 未接入前勿假设已支持）。
- **栈**：React + Vite + TypeScript + Tailwind；钱包 thirdweb v5（`ConnectButton` / injected + WalletConnect + EIP-6963）。
- **链 / 合约 SSOT**：链配置 `src/web3/thirdweb.ts`；运行时地址 `src/shared/config/contracts.ts` ← **仅** `VITE_BSC_*`（**fail-closed：缺配置即报错，禁止代码内合约地址兜底**）。部署地址目录与新功能对接：[`docs/frontend-manual/`](docs/frontend-manual/)（与原始手册字节一致）。组件内禁散落 chain id / RPC / 合约地址。
- **登录**：连接 ≠ 业务登录；SIWE + JWT 由 `AuthProvider` + `login-with-wallet`；推荐 / 奖励依赖 `sessionReady`。
- **金钱路径**：见 [`docs/money-path-map.md`](docs/money-path-map.md)（write intent、unknown latch、approve 后 live 门闸）。

### 8.7 样式与 Tailwind 约束

> 目标：逐步删除散落 CSS 与遗留 theme 扩展色；**新代码从本节约束起执行**。

- **颜色 SSOT**：[`src/shared/styles/tokens/theme.css`](src/shared/styles/tokens/theme.css)（`:root` 源变量 + `@theme` / `@theme inline` 工具类映射）。
- **禁止**：在组件、模块 CSS 或独立样式文件中**新增**自定义 class 名（`.foo-bar`）或平行语义 utility；禁止为省事再发明 `ink-*`、`faint` 等第二套文案色命名。
- **新代码颜色优先级**：
  1. shadcn 语义色：`text-foreground`、`text-muted-foreground`、`text-primary`、`text-success`、`text-destructive` 等（由 `theme.css` 映射，视为 Tailwind 工具类）。
  2. Tailwind 字面量：如 `text-white`（深底标题 / inverse）。
  3. **不引用**遗留 theme 扩展色（`ink-strong`、`ink-muted`、`faint`、`on-dark`、`faq-text`、`coral-bright` 等）——新 diff 不得新增；发现存量引用按切片清掉。
- **允许例外**（须 PR 说明理由）：第三方组件默认样式 override（如 sonner）；必须在 `theme.css` 新增 `--color-*` token 的设计/工程依据。
- **字阶**：走 [`src/shared/ui/text.tsx`](src/shared/ui/text.tsx) 的 `variant` + `tone`（`tv()`）；禁止新建 `*-type-scale.ts` 或散落字阶 class 常量。
- **全站文本**：用户可见文案 **必须** `<Text>` 包装；流程见 [`docs/foundation/runbook.md`](docs/foundation/runbook.md) §3。
- **布局**：间距、栅格、`max-w`、定位等用 Tailwind 原子类或调用处 `className`；细则见 [`docs/foundation/api.md`](docs/foundation/api.md) / [`runbook.md`](docs/foundation/runbook.md)。
- **样式重构强制流程**：凡改 Foundation / typography / shell primitive，**只走** [`docs/foundation/`](docs/foundation/README.md)。未写清根因与标签不得写盘。

## Agent skills

### Implement

Before `/implement` write: [`docs/agents/implement-checklist.md`](docs/agents/implement-checklist.md) (links §8.0). Ticket ownership template: [`docs/agents/issue-tracker.md`](docs/agents/issue-tracker.md).

### Issue tracker

Issues live as local markdown under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.
