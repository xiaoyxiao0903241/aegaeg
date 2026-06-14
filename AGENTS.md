AI 工作规范

> **本节用于**：AI 助手自身的行为校准和工程决策。处理用户请求前应先回顾本节。

> 以下规范指导 AI 编码助手在本项目中的工作方式、工程决策和工具使用。

### 8.1 工作方式

- **默认端到端完成**：理解问题、读取相关文件、实施最小充分修改、验证、报告。用户明确要求「只分析 / 暂不修改 / 只给建议」时才停在分析。
- **先定义再实现**：先定义真实问题、约束、边界条件、失败模式和验收标准，再选择实现方式。
- **暴露不确定性**：写代码前暴露会影响数据所有权、同步正确性、schema / API、性能目标或平台语义的不确定性；禁止静默假设。
- **优先最小闭环**：优先做能验证目标的最小闭环。切片必须绑定一个用户可判断 case 或一个证明边界。
- **找根因不用补丁**：找根因，不用补丁掩盖症状；失败来自流程时，同步修改文档或本文件，不靠聊天记忆。
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
- 触达代码时优先用 `agent-lsp` 做语义查询，使用最小 workspace root。
- **CodeGraph** 是当前默认代码图谱工具。依赖结果前先运行 `codegraph status .`；索引不新时运行 `codegraph sync .`。
- 探索概念用 `codegraph context`；查调用关系用 `codegraph callers` / `codegraph callees`；评估影响面用 `codegraph impact`；文本兜底仍用 `rg`。
- `.codegraph/` 是本地索引并被忽略。

### 8.4 设计稿来源

- **正式 Figma 设计稿 SSOT**：https://www.figma.com/design/vwsbcJZSSj7ssKaTDGyxzL/AEGIS-X--Copy---Copy---Copy-?m=auto&fuid=937729319273650487
- 后续官网首页、H5、DApp 页面和组件的像素级对齐，以该 Figma 文件为准；历史 Figma 链接只作为过往参考，除非用户明确指定。
- **像素级对齐的含义**：优先对齐元素归属、组件结构、视觉层级、字体、颜色、圆角、阴影、边框、间距节奏、素材、hover / active / connected / disconnected 状态。1-2px 的浏览器渲染、截图或布局取整偏差可以接受，禁止围绕这些误差反复修改。
- **PC 是文案 SSOT**：H5 是 PC 的响应式布局，不是独立文案版本。PC / H5 文案不一致时，以 PC 为准；不要为了 H5 单独新增同义文案 key 或分叉 copy。
- **动态数值不作为静态对齐重点**：余额、金额、兑换率、统计值、奖励数值后续会接入动态数据；静态阶段只保证数值区域的组件样式、状态表现、留白和可承载真实数据的布局正确。

### 8.5 首页动效与性能

- 参考站 `https://aegis-x5.vercel.app/` 只作为动效基准，不作为素材来源；生产素材必须来自正式 Figma 或项目 canonical public assets。
- 首页不得为了动效引入 Framer Motion、GSAP、Anime、Lottie 等动画库；优先使用 CSS keyframes / transitions，加少量 `IntersectionObserver` / `requestAnimationFrame`。
- 动效只动画 `opacity`、`transform`、`clip-path`、`filter`、`box-shadow` 等不触发布局重排的属性；hover 不改变卡片几何位置，使用阴影、边框和轻微背景 tint 模拟浮起。
- 指标区动效顺序为：面板先从中线展开，数值再启动计数和轻微 pop；首页动效不根据 `prefers-reduced-motion` 降级，所有设备保持一致播放。
- Figma SVG 导出经常包含整页背景、父容器和裁剪上下文；用于运行时的图标必须提取 leaf node / clean paths，不能直接使用污染的整卡导出。

### 8.6 AEGIS X DApp 技术约束

- **DApp 页面推进顺序**：先收束共享 shell / rail / card / typography / table / action primitives，再按 Figma frame title 逐页实现：Swap → Genesis → Rewards → Community。不要在未完成当前页面结构对齐前随机跳到其他页面。
- **页面归属规则**：页面内容归属以 Figma frame title 为准；例如 `DApp — Swap` 里的 Genesis 说明仍属于 Swap 页面展示，不迁移到 Genesis tab。连接 / 未连接状态也按对应 frame 处理。
- **H5 响应式规则**：H5 是同一套 PC 文案与组件的响应式布局，不是独立页面。除非 Figma 明确表达为不同状态组件，否则不要为 H5 新增同义文案、独立数据表或单独业务逻辑。
- **对齐验收重点**：DApp 对齐先看元素是否齐全、状态是否正确、组件视觉是否一致、素材是否来自 Figma、布局是否能承载未来动态数据；动态数值和 1-2px 渲染取整不作为阻塞项。
- **当前第一版范围**：只做 EVM DApp，目标链为 **BSC + Ethereum**；不引入 Solana / Bitcoin / TON / TRON 多链能力，除非甲方明确变更范围。
- **前端技术栈**：React + Vite + TypeScript + Tailwind CSS。
- **钱包技术栈**：thirdweb React SDK v5；`ThirdwebProvider` / `ConnectButton` 负责连接 UI、钱包列表、自动重连、WalletConnect 和 EIP-6963 钱包发现；链上读写、签名、交易状态以 thirdweb SDK 的 client、account、wallet 和 transaction API 为 SSOT。
- **钱包兼容策略**：必须同时保留 injected provider、WalletConnect fallback、EIP-6963 多钱包发现；移动钱包内置浏览器优先 injected，普通移动浏览器走 WalletConnect deep link / QR。
- **链配置策略**：BSC / Ethereum chain 配置集中维护在 `src/web3/thirdweb.ts`；不要在组件里散落 chain id、RPC URL、区块浏览器 URL、代币地址。
- **登录语义**：连接钱包不等于业务登录。涉及推荐关系、奖励记录、用户态 session 时，应增加 SIWE/nonce 签名认证闭环。
- **UI 实现**：钱包按钮优先用 thirdweb `ConnectButton` 的 `connectButton` / `detailsButton` / `connectModal` 配置承接项目设计，不直接暴露默认按钮样式到核心界面。
