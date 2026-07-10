# 代码质量审计报告 — 2026-07-10

> **性质**：一次性只读诊断快照，非持续维护的 SSOT 文档。
> **方法**：四个独立审查视角（钱路径正确性 / React 运行时 / 工程化·首页·样式 / 命名·组织）并行通读全部 329 个源文件，对照单测与 dist 产物；主报告中 🔴 必修四项已由主审逐条对照源码核实。
> **范围**：`src/**`（37,521 行）+ `scripts/` + `vite-plugins/` + 门禁配置。仅代码质量，不含功能完备性评估。
> **门禁基线**：审计时 `pnpm check` 全绿（200 单测通过、0 error）；`pnpm lint` 4 warnings（已登记债）；`knip` 1 死导出。**下列 bug 无一被现有门禁拦截。**

---

## 总体结论

代码库处于「世界级卫生 + 世界级内核，但异步编排层有真实资金/安全 bug」的状态。距离世界级的差距不在手艺（命名、极简、算法、纯函数内核均属顶尖），而集中在两个根因：

1. **跨「身份/时效边界」的异步编排缺一个统一抽象** —— 切钱包旧数据泄漏、续票全页闪烁、提交门禁读死快照、8 秒双花阈值，四者表面分属不同领域，实为同一件事：一个快照跨过身份或时效边界后仍被消费。
2. **太多正确性靠纪律与文档保证，而不是靠一个会失败的检查** —— locale 清单人肉同步、`calc` 缺单位穿过五层工具无报警、XSS 靠「信任 admin」、SIWE nonce 一次性靠后端不写断言。

---

## 一、Bug 与隐患清单

### 🔴 必修（真实资金/安全风险，已核实源码）

| # | 严重度 | 位置 | 缺陷与失败场景 |
|---|---|---|---|
| 1 | HIGH | `core/swap/wait-wallet-transaction.ts:105` + `hooks/use-swap-quote.ts:229` | **潜在双花**。8 秒内 `eth_getTransactionByHash` 返回 null 即抛 `outcome:'failed'`，而只有 `'unknown'` 才闩锁 `blockResubmit`。慢 RPC / WalletConnect 移动钱包 / 公共 RPC 索引延迟下，一笔**已上链**的 `swapTokens` 或 `purchasePresale` 被误判「未广播」→ 用户重试 → 第二笔真金白银重复执行。approve 幂等无害。 |
| 2 | HIGH | `hooks/use-swap-quote.ts:198` + `hooks/use-flash-swap-widget.ts:154` | **approve→swap 几乎必现二次点击**（两个审查视角独立命中）。`assertStillSubmittable` 读的 `amountQuoteQuery.dataUpdatedAt / data / sellBalance` 是发起提交那一刻的渲染快照；approve 弹窗 + BSC 出块普遍 8–30s，报价年龄必然超过 `maxQuoteAgeMs=QUERY_STALE_TIME.quote`（10s）→ 抛 `SWAP_SUBMIT_GATE_FAILED`，尽管 `useVisibleInterval` 已把新报价写进缓存。注释宣称「用 live 报价重新门闸」，实现与意图不符。flash 侧 `void refetch()` 连 await 都没有，与 trade 侧不一致。 |
| 3 | HIGH | `views/home/popup-notice-content.tsx:47` | **存储型 XSS 敞口**。API 公告 `dangerouslySetInnerHTML={{ __html: content }}`，注释「Do not sanitize or strip — trust the admin channel」。首页与存放 JWT（`stores/auth-store.ts` zustand persist）的 DApp 同源，后台/CMS 被攻破或供应链注入即可窃取全站会话。且注释威胁模型写错——`innerHTML` 不执行 `<script>`，真正攻击面是 `<img onerror>` / `<svg onload>`。零纵深（无 sanitize、无 CSP、无 iframe 隔离）。 |
| 4 | HIGH | `hooks/use-api-data.ts:37` | **切钱包旧数据泄漏显示**。`placeholderData: (prev) => prev` 不区分「翻页」与「换身份」。钱包 A、B 均有有效 JWT 时，A→B 切换 → 新 queryKey 无缓存 → placeholder 返回 A 的行 → `isLoading===false` → `showSkeleton=false` → A 的数据以「已加载」姿态渲染在 B 名下，直到网络返回。影响 rewards 三张历史表 + community 邀请表；genesis 贡献表因 `GenesisWidgetProvider` wallet-key remount 幸免——恰好证明同类问题两处防御漏了一处。 |

### 🟡 建议修（正确性/安全/体验隐患）

| 位置 | 缺陷 |
|---|---|
| `views/dapp/auth/login-with-wallet.ts:183` + `login-signature-cache.ts:105` | SIWE 签名缓存 1 小时**重放窗口**：命中缓存直接复用同一 nonce + signature 反复调 `login` 换 JWT，`isLoginSignatureUsable` 只校验 SIWE `Expiration Time`。能工作说明后端未消费 nonce；localStorage 泄露即可在 1h 内任意换取有效 token。 |
| `core/auth/classify-login-failure.ts:44` | 封禁判定依赖后端文案：`isBannedShape` 要求 `code===403` **且**命中 `/ban\|封\|forbidden.?account/`。裸 `403 Forbidden`（无关键词）→ 归 `transient` → sentinel 映射为 `null` 不显示封禁，同时 `auth-machine.ts:110` 的 attempt-key 又阻止重试，被封用户表现为「卡在未登录」。 |
| `views/dapp/rewards/rewards-balance-section.tsx:129,183` | **领奖按钮门禁比较格式化字符串** `disabled={teamClaimable === '$0.00'}`：资金操作可用性派生自展示层输出，`formatClaimableAmount` 任何变化都会静默改变按钮行为；$0.004 会因格式化为 '$0.00' 被禁用。应比较数值 `claimable > 0`。 |
| `app/dapp-shell.tsx:47` | 每次切 Tab 无条件 `invalidateTabQueries(activeTab)`，5 分钟 `staleTime` 对 tab 数据形同虚设。「新鲜度」事实存两处（query-client staleTime vs shell 强制失效），来回切 tab 产生成倍 RPC/API 流量。 |
| `shared/api/query/invalidate.ts:12,168` | 购买后轮询用 `readSalesLogCount`（各分页 items 长度最大值）判完成；首页满 20 条时新纪录插入后长度仍 20 → 条件永假 → **固定空转 8 轮 × 2.5s ≈ 20s**，无取消机制。判定应基于 total 字段或首条记录标识。 |
| `web3/wallet/wallet-contract-write.ts:197` | **无链校验 / 无 `wallet_switchEthereumChain`**：无条件写 `Chain ID: 56` 照常签名；写交易硬编码 `chainId: numberToHex(bsc.id)` 直发。钱包停在 ETH 主网时 SIWE 仍签出「看似 BSC」的消息，`estimateWriteGasLimit` 会先在错误链上 simulate 导致错误文案与真实原因不符。 |
| 全仓（`home-motion.css` / `hero-rays.css` / `home-reveal-loader.ts:44`） | **0 处 `prefers-reduced-motion`**：整套 stagger/blur 入场、48s 无限旋转、无限脉冲对减动效用户全量播放，违反 WCAG 2.3.3，也与「低端国产 WebView」耗电诉求矛盾。一条全局 `@media` 豁免 + loader 一个 `matchMedia` 检查即可收口。 |
| `app/bootstrap/auth-provider.tsx:143` + `hooks/use-api-data.ts:33` | 静默续票导致**全页 skeleton 闪烁 + 请求突发**：JWT 到期前 60s 换 token → 所有 queryKey 同时变 → 无 placeholder 的查询 `data=null / isLoading=true` → 用户正浏览的页面整页回退 skeleton 并并发重拉。与 #4 同根因的另一面。 |

### 🟢 低危 / 打磨项

| 位置 | 缺陷 |
|---|---|
| `views/home/home-roadmap-section.tsx:83` | `dapp:w-[calc(50%-15)]` **缺单位** → dist 实测输出 `calc(50% - 15)` 无效被整条丢弃，卡片宽度静默回退到 `max-w-lg`，穿过 5 层工具链无一报警。 |
| `hooks/use-capped-token-amount-input.ts:68` | 100% 填充经 `formatTokenAmount(..., 6)` 截断到 6 位小数再回 parse → `amountIn < balance`，**无法一键卖空**钱包（永留 dust）。 |
| `hooks/use-swap-widget.ts:38` vs `core/swap/swap.ts:41` | UI 初值 `useState(1)`（1%），`SWAP_CONFIG.defaultSlippageBps=50`（0.5%）从未被读取 → **死代码**，改 `VITE_SWAP_DEFAULT_SLIPPAGE_BPS` 不生效。 |
| `core/swap/build-swap-deadline.ts:1` | `deadline` 取本机时钟 `Date.now()/1000`；设备时钟慢 >20min → deadline 落在过去 → PancakeV3 revert「Transaction too old」，错误文案难自解释。 |
| `core/auth/jwt.ts:30` | `isJwtExpired` 在无 `exp` 时返回 false → **陈旧 token 被永久当作有效**，仅靠 renew timer 与后端 401 兜底。 |
| `web3/resolve-contract-error-message.ts:536` | 死导出 `resolveFlashSwapUserMessage`（与 `resolveSwapUserFacingMessage` 重复别名），knip 已抓到但 `check` 门禁不含 `lint:deadcode`。 |
| `hooks/use-genesis-widget.ts:72,215,242,404` | 本地 `error` state 只被 `setError(null)`，从未置非空值 → **死状态**，`queryError ?? error` 恒等于 `queryError`，误导读者。 |
| 多处（rewards/genesis/community effect） | toast-in-effect 以 i18n messages 为依赖，切语言重弹旧错误。错误应在消费时一次性置空。 |

---

## 二、统计数据

| 指标 | 数值 | 评价 |
|---|---|---|
| 源码规模 | 329 文件 / 37,521 行（业务约 23k + i18n 数据约 12.4k） | — |
| 平均文件长度 | **107 行/文件** | 极佳，认知负担低 |
| `src/core` 纯业务内核 | 18 文件 / 1,252 行 | 高度聚焦 |
| TODO / FIXME / HACK / XXX | **0** | 顶级 |
| `any` 类型 | **0**（唯一命中是 HTML 属性 `sizes="any"`） | 顶级 |
| `@ts-ignore` / `@ts-expect-error` | **0** | 顶级 |
| `eslint-disable` | **0** | 顶级 |
| `as unknown as` | **1**（EIP-1193 协议边界，合理） | 顶级 |
| 非 kebab-case 文件 | **0 / 330** | 完美一致 |
| `console.log` 残留 | **0** | — |
| barrel（re-export index） | 真正的仅 **1**（`i18n/messages/home/index.ts`） | 极克制 |
| 单测 | 63 文件 / 4,655 行，**200 用例全绿** | 内核覆盖强 |
| 死代码（knip） | 1 死导出 | 近乎干净 |
| 最长函数 top3 | `useGenesisWidget` 351 行、`useSwapWidget` 312、`TradeSwapWidget` 247 | ⚠️ god hook |
| `pnpm check` | ✅ 通过 | 但漏掉上述全部 bug |

> 0 TODO / 0 any / 0 ts-ignore / 0 eslint-disable 出现在 23k 行业务代码上，不是新仓库的偶然，而是持续执行的结果——卫生指标是真实生产仓库中的顶级水平。

---

## 三、各维度评分（1–10，10 = 世界级）

| 维度 | 分数 | 理由 |
|---|---|---|
| 代码极简性 | **8.5** | deletion-first 真实落地、零套壳（无 Manager/Service/wrapper）、零注释代码；扣在 351 行 god hook、死 token 子系统、`--dapp-*`/`--app-*` 双 namespace 别名层未收敛。 |
| 算法精妙度 | **8.5** | 全程 bigint 定点、`decimalToWei` 字符串拼接绕开 2^53 精度腐蚀、价格影响 `(√P)²` 平方数学、认证纯派生状态机——内核世界级。 |
| 命名 | **8.5** | 有统一语言词表 + 执行 + 元测试验证，kebab-case 零例外；扣在跨域哨兵 `GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED` 被 swap/rewards 消费、`direction` 两处含义冲突。 |
| 逻辑清晰 & 可测试 | **7.5** | 门闸全部纯函数化 + sentinel 错误 + 表征测试是强项；但异步编排层（hooks）零测试覆盖，恰是缺陷聚集处，god hook 只能整包集成测。 |
| 代码组织 | **7.5** | 分层有机器可执行的 depcruise 规则 + 防删元测试；扣在 web3 网关嵌 `views/` 致 hooks 反向依赖 views、壳组件按「能 import 谁」而非「属于谁」分居两地、无 `no-circular`。 |
| 正确性（钱路径） | **7** | 链上 `amountOutMin>0` 门闸、claim 幂等、fail-closed 纪律扎实；扣在双花阈值、快照闭包、未 await 三处真实时序漏洞。 |
| 性能 | **7** | 细粒度 zustand selector、tab `enabled` 门控、可见性感知轮询都对；扣在切 tab 全量失效、15s 全量替换 store、空转轮询、CSS「双入口隔离」实测名不副实（187KB≈184KB）。 |
| 工程化/安全纵深 | **6.5** | 兼容性工程和门禁分层用心；扣在 XSS 信任决策 + 同源会话组合风险、多处「有工具不闭环」（probe 只打印、stylelint/knip 不进 check）。 |

---

## 四、距世界级的最大差距

**差距一：异步/时效边界缺一等抽象。** 切钱包旧数据泄漏、续票全页闪烁、提交门禁读死快照、8 秒双花阈值——表面分属 react-query、auth、swap 三领域，实为同一件事：一个快照跨过「身份边界」或「时效边界」后仍被消费。目前防御是散落各层的约定（token 塞进 queryKey、wallet-key remount、ref 快照、10 秒年龄门禁），每处单独正确，但没有一个「account epoch / quote epoch」原语声明作用域，于是每新增一个数据面就要重新记住所有约定，漏一处即产生一个新 bug。这一层正好是 node 单测覆盖不到的地方——纯函数内核已世界级，短板全在其外的编排层。世界级做法是把这类失效收成单一机制，让 bug 在结构上不可表达。

**差距二：正确性外包给纪律而非机器。** locale 清单人肉在 11 处同步、tokens 与产物一致性靠「build 反正会重跑」、bundle 泄漏探针只打印不拦截、`calc` 缺单位穿过五层工具无报警、XSS 靠「信任 admin」、SIWE nonce 一次性靠后端不写断言。已有很强的门禁骨架（depcruise 进 check、配置本身有元测试），差的是把「会失败的检查」覆盖到剩下靠注释和默契守住的地方。世界级工程的分水岭恰是：每一条口头约束都对应一个会失败的检查。

---

## 五、亮点（对标世界级做得好的）

- **claim 幂等 + 资金不变量**（`core/reward/reward-claim.ts:196` + `resolve-reward-claim-outcome.ts`）：链上成功但 `/confirm` 失败时保留 receipt/txHash 并绝不乐观清余额——最易错的「钱到账但同步失败」场景处理得当。
- **精确定点数学**（`normalize-team-reward-claim.ts:20`）：`decimalToWei` 用 BigInt 字符串拼接绕开 `Number()*1e18` 精度腐蚀，对齐后端签名校验，注释点名失败机理。
- **认证全派生、无可变会话**（`core/auth/auth-machine.ts`）：纯函数状态机 + 按地址会话表 + attempt-key 指纹阻断 relogin 死循环，架构上消除一整类同步 bug。
- **渐进增强动效**：`html:not([data-home-motion-ready])` 强制终态（JS 挂了页面完整可见），data-* 驱动使 CSS 与 React 完全解耦——教科书级。
- **边界知识写进代码**：Provider 嵌套顺序注释（`web-root-providers.tsx:14`）、Chrome 90 兼容（每项带上游 issue 号 + 单测）、测试用 Vite `ssrLoadModule` 直测 .ts 源码零重复配置——真实踩坑固化为防回归资产。

---

## 六、建议修复优先级

1. **三个资金/安全洞**：双花闩锁（#1，`'failed'` 也应 `setBlockResubmit`）→ XSS sanitize 白名单或 CSP（#3）→ swap 门禁从 `queryClient` 读 live 状态而非渲染快照（#2）。
2. **跨钱包 placeholder 隔离**（#4，placeholder 回调比对 previousQuery 的 token 段）。
3. 每项都能配一个会失败的测试锁死——尤其 #1/#2 需引入可注入时钟/查询的时序单测（当前 hooks 编排层的测试真空正是缺陷聚集处）。

> **反面意见**：#2 快照闭包可能是刻意「所见即所签」、approve 后 re-quote 可能为未来多池路由预留、6 位截断可能为输入位数一致性——这些需与作者确认设计意图后再定性。但 **#1 双花阈值与 SIWE 重放窗口无论意图为何都应修正**，不属于「早装晚收紧」策略可覆盖的范畴。

---

## 附录：四视角原始发现（完整 file:line 证据）

> 以下为四个审查代理的完整输出，保留全部定位证据，作为逐条修复的路线图。主报告中的 🔴 必修四项已经主审核实；附录其余条目为单视角静态分析结论，落地前建议对照源码确认。

### A. 钱路径正确性

- [HIGH] `wait-wallet-transaction.ts:12,101` + `use-swap-quote.ts:229` — 8s「未广播」误判 → `'failed'` 不闩锁 → double-spend。
- [HIGH] `swap-write.ts:73` — approve 后多余 re-quote 未传 `poolContext`，`fee` 已由 `useSwapPoolReads` 持有，失败即白费 approve gas。
- [MEDIUM] `login-with-wallet.ts:183` + `login-signature-cache.ts:105` — SIWE 签名缓存 1h 重放窗口。
- [MEDIUM] `classify-login-failure.ts:44` — 封禁判定依赖后端文案，裸 403 静默降级。
- [MEDIUM] `use-swap-quote.ts:198` — mid-submit re-gate 是提交时刻快照闭包，仅报价 age 检查有效。
- [MEDIUM] `use-flash-swap-widget.ts:154` — approve 后 `void refetch()` 未 await，与 trade 侧不一致。
- [MEDIUM] `build-login-message.ts:48` + `wallet-contract-write.ts:197` — 全钱路径无链校验 / 无 `wallet_switchEthereumChain`。
- [LOW] `use-capped-token-amount-input.ts:68` — 100% 填充截断 6 位小数无法卖空。
- [LOW] `use-swap-widget.ts:38` vs `swap.ts:41` — 默认滑点硬编码 1%，`defaultSlippageBps=50` 死代码。
- [LOW] `build-swap-deadline.ts:1` — deadline 取本机时钟，时钟漂移致 revert。
- [LOW] `jwt.ts:30` — 缺 `exp` 的 JWT 视为永不过期。
- 评分：正确性 7 / 算法精妙 8 / 可测试性 7。

### B. React 运行时

- [高] `use-api-data.ts:33,37` — `keepPreviousData` 跨 token 边界泄漏（切钱包旧数据无 skeleton 渲染）。
- [高] `use-swap-quote.ts:186` — 提交后置门禁检查点击时刻快照，`maxQuoteAgeMs=10s` 下 approve→swap 几乎必现二次点击。
- [中] `use-api-data.ts:33` + `auth-provider.tsx:143` — 静默续票导致全页 skeleton 闪烁 + 请求突发。
- [中] `dapp-shell.tsx:47` — 每次切 Tab 无条件 `invalidateTabQueries`，5 分钟 staleTime 形同虚设。
- [中] `rewards-balance-section.tsx:129,183` — 领奖按钮门禁比较格式化字符串 `=== '$0.00'`。
- [中] `invalidate.ts:12,168` — 购买后轮询满页永不完成，固定空转 20s。
- [低] `query-keys.ts:26` — `qualifiedPartitions` 嵌在 performance 前缀下，隐式耦合。
- [低] rewards/genesis/community — toast-in-effect 以 i18n messages 为依赖，切语言重弹旧错误。
- [低] `use-referral.ts:25` — `useMemo` 内写 sessionStorage + 读 window.location，渲染期副作用。
- [低] `use-swap-quote.ts:92,152` — 清空输入后 400ms 窗口提交按钮短暂亮起（资金层安全）。
- [低] `rewards-history-section.tsx:56` — 纠偏型 setState-in-effect，应派生 `effectiveTab`。
- [低] `wallet-details-modal.tsx:76` `setTimeout` 无清理；`dapp-rail.tsx:94` rAF 无 cancel（已登记债）。
- [低] `use-genesis-widget.ts:72` — 本地 `error` state 死状态，从未置非空。
- [观察] `genesis-promo-sync.tsx:66` — RQ→zustand 镜像，15s tick 全量替换致所有订阅者重渲染，set 前浅比较即可消除。
- [观察] `auth-store.ts:178` — persist 无 `version`/`migrate`，迁移靠手写 merge。
- 评分：逻辑清晰 8 / 状态管理 8 / 性能 7 / 可测试性 7。

### C. 工程化 · 首页 · i18n · 样式

- [HIGH] `popup-notice-content.tsx:40` — `dangerouslySetInnerHTML` + 同源 JWT localStorage = 存储型 XSS，威胁模型注释本身写错。
- [HIGH] 全仓 0 处 `prefers-reduced-motion` —— 违反 WCAG 2.3.3。
- [MEDIUM] `home-roadmap-section.tsx:83` — `calc(50%-15)` 缺单位，dist 实测无效被丢弃。
- [MEDIUM] locale 清单 4+ 处硬编码且顺序不一致（`render-home.mjs:8`、`vite.config.ts:26`、`.gitignore`、两个 test），加一门语言要同步约 11 处。
- [MEDIUM] CSS「双入口隔离」名不副实：dist 实测 Home 187KB ≈ DApp 184KB，`shared.css` 的 `@source` 让 home.css 也为全部 DApp 视图生成 utilities。
- [MEDIUM] `generate-tokens.mjs:261` — 约 300 行手写 CSS 内嵌 JS 模板字符串，theme.css 头部宣称「Do not edit manually」但 60% 内容真实 SSOT 在 .mjs 字符串。
- [MEDIUM] `@theme`（非 inline）产生自引用声明 `--radius-sm:var(--radius-sm)`，正确性悬于源顺序，radius/shadow 应改 `@theme inline`。
- [MEDIUM] 死 token 子系统（`--space-1..9` 零消费）+ 双 namespace 别名层（`--dapp-*` 是 `--app-*` 纯别名）。
- [MEDIUM] `messages-catalog.ts:34` `as Record<Locale, CatalogMessages>` 应为 `satisfies`，丢掉穷尽性检查。
- [LOW-MED] timeline 入场 `filter: blur` 在 820px 以下未豁免；roadmap ripple 无限 box-shadow 每帧 repaint。
- [LOW] `probe-home-bundle.mjs` 三个泄漏探针永不 `exit 1`，ja sentinel 硬编码文案。
- [LOW] eslint「登记债」override 无效配置、stylelint/knip 不进 check —— 三者「存在但不防护」。
- [LOW] `home-reveal-loader.ts:102` `img[data-src]` 懒载路径零命中（死代码），文档 §4.1/§6 双重漂移。
- [LOW] i18n 内容/布局耦合（`side`/`dot`/`state`/`href` 混入翻译包）+ "NOW" 徽标硬编码英文。
- [LOW] `vite.config.ts:11` legacyBootFirstPlugin 用正则匹配脚本字面内容搬位置，改文案即静默失效。
- 评分：工程化成熟度 7.5 / CSS·token 体系 6.5 / i18n 设计 7 / 构建脚本 7。

### D. 命名 · 组织 · 极简 · DRY/SSOT

- [中] hooks/ 反向依赖 views/，depcruise 无 `no-circular`（`use-swap-widget.ts:2` import `~/web3/*`；`dapp-tabs.ts:1` 注释「avoids cycle」证明环已出现）。
- [中] 跨域哨兵命名违反统一语言：`GENESIS_PURCHASE_ERROR.WALLET_NOT_CONNECTED` 被 swap、rewards 消费。
- [中] 死兼容分支违反 deletion-first：`presale-display.ts:60` `options: number | ...` 的 number 分支零调用方。
- [低] 死导出 `resolveFlashSwapUserMessage`（knip 抓到但 check 漏网）。
- [低] NumberFormat 散落 6 处，违反 `format-display.ts:47` 的 `formatUsd` SSOT。
- [低] 壳组件双家园：`shared/ui/` 有 3 个 `dapp-` 前缀组件，`app/shell/` 有 27 个 —— 产品无关层出现产品名前缀。
- [低] `direction` 概念撞名：`swap-direction.ts` `'forward'|'reverse'` vs `swap-view-store.ts` `'forward'|'back'`。
- [低] `presale-display.ts` 位置与命名双游离；`dapp-table-empty-message` vs `-empty-state` 区分度低 + 模式重复。
- [低] flash/trade widget-context 逐行同构（各 29 行 diff 零差异），达抽 `createSwapWidgetContext` 工厂门槛。
- [提示] `app/data.ts` / `app/utils.ts` 抽屉命名；depcruise `ui-is-dumb` 规则冗余被元测试焊死。
- [提示] god hook：`useGenesisWidget` 351 行、`useSwapWidget` 312 行。
- 评分：命名 8.5 / 代码组织 7.5 / 极简性 8 / DRY·SSOT 8。

---

*生成方式：只读诊断，未改动任何业务代码。四视角原始报告存于本次会话记录。*
