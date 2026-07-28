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
- 代码或复杂脚本切片需要独立审查、受影响验证；用户要求提交时再按单切片单提交。
- 人工审查只保留给视觉、手感、真实滚动物理、主观动效质量和真实辅助技术行为。

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
- **动态数值不作为静态对齐重点**：余额、金额、兑换率、统计值、奖励数值后续会接入动态数据；静态阶段只保证数值区域的组件样式、状态表现、留白和可承载真实数据的布局正确。

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
- **对齐**：元素齐全、状态正确、视觉一致、素材来自 Figma、布局可承载动态数据；动态数值与 1-2px 取整不阻塞。
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
