# AGENTS.md — AI / 工程契约

> 写盘前先读本文件。索引：[`docs/README.md`](docs/README.md)。  
> 仓库根**仅本文件**；其余文档在 `docs/`（kebab-case）。  
> 通用 MUST NOT / 收工档 → 全局 Contract（`~/.agents/AGENTS.md`）；**本文件管本仓 SSOT + 流程 + 五柱**。

---

## 0. 最高原则

与下层冲突时**先满足本节**。行为层吸收 [Karpathy Guidelines](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md)（琐碎可缩短；金钱 fail-closed 不可破）。

### 0.1 五柱

| 柱                 | 标准                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **代码极简**       | 最少代码解决问题；无第二 call site 不抽层；禁未要求的功能/配置/「灵活性」；200 行能变 50 → 重写                                                                                                                                                                                    |
| **逻辑清晰可测试** | 决策与 IO 分离；门闸/报价用纯函数+单测；先定可验证成功标准再动手                                                                                                                                                                                                                   |
| **算法精妙**       | 先定不变量再分支；重复回收唯一 owner；禁特例瀑布；**不是**炫技                                                                                                                                                                                                                     |
| **性能优异**       | 热路径便宜；禁无故 N+1 RPC；禁 placeholder 驱动写 CTA；先消多余 IO 再微优化                                                                                                                                                                                                        |
| **遵循最佳实践**   | **代码 / 框架 / 行业**通行实践（语言惯用法、安全、可访问性、Web3 fail-closed、测试与可观测性等）**与**本仓栈约定（手册∩API、Foundation/`<Text>`、目录落点）一并遵守；禁自创平行惯例。与本仓 SSOT 冲突时先暴露，再按决策序与层表裁决（不以「行业流行」静默覆盖 fail-closed / 手册） |

**决策序：** 正确性（含 fail-closed 金钱）> 可验证性 > 极简清晰 > 算法与性能 > 复用 > 速度。

### 0.2 行为硬门

**A. 先想清楚** — 显式假设；多解读并列；有更简做法就说；不清则停并提问。

**B. 第一性原理** — 修前：复现 → 根因证据 → 从根因改。禁症状补丁（特例 if / 再包一层 / 调文案掩盖）。根因在契约 → 同步改文档。未定位根因不写修复。

**C. 目标驱动** — 「修 bug」→ 先复现测试再绿；「加校验」→ 先非法输入测试；多步：`步骤 → verify`。弱目标（「弄好」）先澄清。

### 0.3 写盘后自检

- [ ] 假设/取舍已暴露？根因有证据且从根因修？
- [ ] 成功标准已验证（测试 / `pnpm check` / 手册）？无投机抽象？
- [ ] 金钱 fail-closed？手册/API/Foundation 未开平行方案？
- [ ] 是否符合语言/框架/行业通行实践（且未与本仓 SSOT 打架）？
- [ ] 新增/改动注释是否符合 [`docs/foundation/comment-conventions.md`](docs/foundation/comment-conventions.md)（分层密度、去 Figma 节点引用、禁黑话）？
- [ ] 是否符合 §0.4（DRY/KISS/YAGNI/deletion-first）？

### 0.4 工程原则

- **决策优先级**：正确性 > 可验证性 > 简洁性 > 复用 > 速度。（与 §0.1 决策序同构；金钱路径另要求 fail-closed。）
- **SSOT**：业务规则、配置语义、状态真相、schema 字段、协议状态和 Derived Fact（派生事实）只能有一个 owner。
- **DRY**：只消除真实且稳定的重复；不要为了去重制造脆弱抽象。
- **KISS**：优先最直接、最容易验证的数据流和实现。
- **YAGNI**：没有当前不变量、成功标准或验证路径的未来能力不做。
- **清晰优先于精巧；显式优先于隐式**。项目内一致性优先于「为跟风而跟风」的外部花样；**不**等于可以无视语言/框架/行业已证明的正确做法——后者与本仓 SSOT 同向时必须采用。
- **抽象必须立刻降低认知负担**，或保护真实边界；否则不要引入。
- **优先删除复杂度**，而不是把复杂度搬到另一层。

**实现时**：

- 优先复用既有工具函数、状态容器、脚本入口和测试基础设施。
- 发现重复逻辑时，先判断是否应回收到现有 SSOT；不要默认再包一层。
- **deletion-first**：实现后删除、内联或收窄不服务不变量、成功标准或验证路径的状态、字段、类型、分支、配置和 helper。
- **代码或复杂脚本切片**：做 Post-Code（§0.3 + 本条 + `pnpm check`）；用户要求提交时再单切片单提交；提交前另过独立审查（§2「审查」；默认 Grok 4.5 high + deletion-first）。
- 人工审查只保留给视觉、手感、真实滚动物理、主观动效质量和真实辅助技术行为（Post-Design 主观项）。

---

## 1. Matt 流程（路由表）

全局 Contract「Matt 路由」指向本表。`/ask-matt` 为完整地图；此处为本仓落地。

| 意图              | 走                                                  | 产物落盘（本仓）                                                                         |
| ----------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 有代码 + 磨清想法 | `grill-with-docs`                                   | 结论 → [`docs/decisions/`](docs/decisions/)；**禁** `.scratch` 过程坟、禁根 `CONTEXT.md` |
| 多会话大建        | `to-spec` → `to-tickets` → `implement`              | Spec/票 → [`docs/tickets/`](docs/tickets/)；blocker 写在票内                             |
| 单切片可闭环      | `implement`（内含 tdd + code-review）               | 代码 + 必要 docs；**commit 须用户明示**                                                  |
| 外来杂单          | `triage` → `implement`                              | 票 → `docs/tickets/`                                                                     |
| 难 bug            | `diagnosing-bugs`                                   | 先红反馈环；根因记入决策或票                                                             |
| 雾大不知从何建    | `wayfinder` → 再 `to-spec`                          | 决策票 → `docs/decisions/`；**勿**跳过 to-spec 直 implement                              |
| 架构变深          | `improve-codebase-architecture` / `codebase-design` | 想法回 grill 或决策                                                                      |
| 跨会话            | `handoff`；同会话阶段切 `compact`（勿中途 compact） | handoff 文件可暂放 `docs/handoffs/`，用后可删                                            |

**禁止**复活 Matt 默认的 `.scratch/<feature>/` 过程目录作 SSOT。词表：[`docs/ubiquitous-language.md`](docs/ubiquitous-language.md)。

---

## 2. 文档 SSOT

按「管什么」读。产品语言 ≠ 实现归属。

| 问题            | SSOT                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| 用户可见行为    | 产品 Answer / Spec                                                                                    |
| UI token / 用法 | [`docs/foundation/`](docs/foundation/)                                                                |
| 代码注释        | [`docs/foundation/comment-conventions.md`](docs/foundation/comment-conventions.md)（严格层 / 逻辑层） |
| 文案            | `src/i18n/messages/` · PC 为文案 SSOT                                                                 |
| 静态 UI         | Figma `uiKwzwIoD06phS0husdqjB` · [`docs/figma-pages.md`](docs/figma-pages.md)                         |
| 链上默认        | [`docs/onchain-manual/`](docs/onchain-manual/)（入仓原文；**禁止**改写正文）                          |
| 链上旧切片补全  | [`docs/onchain-manual-legacy.md`](docs/onchain-manual-legacy.md)（同上）                              |
| 后端读          | [`docs/backend-api/`](docs/backend-api/)                                                              |
| 词表 / 命令     | [`docs/ubiquitous-language.md`](docs/ubiquitous-language.md) · [`docs/commands.md`](docs/commands.md) |

- **手册入仓只读：** `onchain-manual/` 与 legacy 正文来自外部手册拷贝；**禁止**为贴本仓路径 / 去考古句 / 审文档而改写。正文若写合约仓 `abi/`、`src/*.sol`、`deployments/` 等，以方法表语义为准；本仓运行时仍走 `abis.ts` + `VITE_BSC_*` / `contracts.ts`。换手册 → 从源重新拷贝，勿手改。
- **shared 只扩 chrome**；业务档位/locale/地址不进 `shared/components`；不确定宁放页袋。
- **组合式优先**：壳 + 具名子件表达槽位（`Tile.Label` / `Table.Header`）；禁袋装 `header=`/`tooltip=` 冒充结构。无第二 call site 不硬抽子件。见 [`docs/foundation/component-usage.md`](docs/foundation/component-usage.md) MUST §7。
- **钱路**：新手册有 → 按新；新沉默且旧手册/可证旧码有 → 按旧；皆无 → 停手、写链 fail-closed。旧码须 `git`/commit+符号可证。钱路专文暂缺。
- **稿 ∩ 手册**：稿有控件 → UI MUST；缺数诚实空；禁因手册缺数砍控件；数/写跟手册。
- **裁决序：** §0 → 全局 MUST NOT → 本层表 → 产品 Answer → 过程稿（仅参考）。
- **审查：** 贴稿对照（Figma + 原型）≠ Post-Code（§0.3 + `pnpm check`）；commit 前 Critical 未清禁止提交。

---

## 3. 工作方式

- 默认端到端；「只分析」才停。
- 样式重构 → [`docs/foundation/`](docs/foundation/) + [`.cursor/skills/aegis-component-refactor/SKILL.md`](.cursor/skills/aegis-component-refactor/SKILL.md)。
- 注释 → [`docs/foundation/comment-conventions.md`](docs/foundation/comment-conventions.md)：说明中文、标识符英文；严格层通俗短、逻辑层四要素+`@see`；禁 Figma 节点坐标注释；只改注释时禁改业务逻辑。
- 报告：改了什么、根因、验证、风险；对照 §0 一句自评。

---

## 4. 栈与产品约束

- **稿：** https://www.figma.com/design/uiKwzwIoD06phS0husdqjB/…（fileKey `uiKwzwIoD06phS0husdqjB`）；页表见 `figma-pages.md`；H5 不新增同义文案。
- **链：** EVM · **仅 BSC**；地址 `contracts.ts` ← **仅** `VITE_BSC_*`（fail-closed）。
- **栈：** React + Vite + TS + Tailwind；钱包 thirdweb v5；连接 ≠ 业务登录（SIWE + JWT / `sessionReady`）。
- **写链：** intent → preflight → 再读 address/chainId → assert → send；approve 后 live 重闸；unknown → path lock。
- **首页动效：** 禁 Framer/GSAP/Anime/Lottie；只动 `opacity`/`transform`/`clip-path`/`filter`/`box-shadow`。
- **样式：** `tokens.json` → `theme.css`；禁遗留色与平行 class；用户可见文案必须 `<Text>`。

---

## 5. 工具

[`docs/README.md`](docs/README.md) · [`docs/commands.md`](docs/commands.md) · `rg` · CodeGraph。
