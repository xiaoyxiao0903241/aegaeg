# Dapp 数据覆盖矩阵（普通人可读版）

> 本文件由 `docs/dapp-data-coverage-matrix.md` 派生，保留源矩阵的章节、14 列、行号、状态和对照关系，只改写文案。
> 源矩阵仍是唯一权威来源；本文件只改表述，不改结论。
> 规则锁定：[`docs/decisions/dapp-data-coverage-matrix-wayfinder.md`](./decisions/dapp-data-coverage-matrix-wayfinder.md)
> 对照源目录：[`docs/research/dapp-tab-source-index.md`](./research/dapp-tab-source-index.md)

## 规则

|项|值|
|---|---|
|范围|覆盖整个 dapp 功能；不含首页。宿主专章 = 宿主目录 + 共享壳目录|
|盘点|界面与代码两边都扫；动态位 = 数字 + 文案（可见文案 + 常见问题）|
|粒度|读：按字段；写：按动作（前置检查 / 预检 / 成功后刷新）|
|UI 基线|**控件布局与可见文案**以 Figma PC 验收帧为准（见 [`figma-pages.md`](./figma-pages.md)）。已实现代码只决定落地先后，**不能用离稿实现盖过稿面**；没有稿才用 HTML 原型|
|数/写 唯一权威来源|金额怎么算、前置检查怎么拦、刷新怎么做 = 链上手册 / 接口；与界面文案分层|
|稿链冲突|可见文案 / 单位标签**先保留稿面**；状态记 **`📘 稿链文案`**，T1=`文案/单位与链不匹配（稿如此）`；修复默认 **改稿（Figma + 文案表）对齐链，或产品确认保留稿面**；**禁止**前端默认离稿改文案表|
|gAGX/AGX 取数|**不改 UI 标签**。有独立链上/同口径 gAGX 源（分流器 gagx 桶 / RewardGAGX / 闪兑）→ 读 gAGX（A）；否则用 AGX（或同口径 API）数量填同一 UI（B）。链上真读优先于手册单位叙事。B 已接线且产品确认稿面 → 可标 **`✅ 已对齐`**（备注写清 A/B）|
|读源优先|同页有 **overview / summary** 或 **接口表聚合 / 标题** → 跟接口；只有字段没有同口径接口、且属于链余额 / 仓位时才链优先；接口仅作无钱包时的回退|
|缺数展示|金额 / 数量**没取到也显示 `0`** → T1=`设计取舍（缺数显0）`，状态 **`✅ 已对齐`**（视为正确）；**禁止**改成诚实空 `—`；只有根本没有字段的指标才用 `—` / `⚪`|
|证据杠|**前端接入证**：代码已按手册 / 接口（以及稿的控件 / 可见文案）接好线、前置检查、格式化与空态（含缺数显 0）→ 可标 `✅ 已对齐`；**不要求**生产环境样本对账。写路径不真发交易。链上 / 后端数值业务对错、生产 QA **不归**本矩阵前端判断标准|
|非本矩阵|生产 QA、链上业务审计、后端 indexer 正确性|
|完成判断标准|已知项全部有结论即可（允许 `🔍 待核实`，但须写原因和下一步）|
|缺口|`状态` 不是 `✅ 已对齐` / `⚪ 不适用` 的行就是现行缺口；缺口行的 `修复方法` 必填|

### 列

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

### 行号前缀

|章|前缀|
|---|---|
|宿主与公共壳|`H-`|
|质押|`S-`|
|奖励|`W-`|
|释放|`L-`|
|兑换|`X-`|
|资产|`A-`|
|社区|`CM-`|
|共建|`GN-`|
|代码反查附录|`Z-`|

### 状态

`✅ 已对齐` · `❌ 未接入` · `🟡 部分` · `📘 稿链文案` · `🔍 待核实` · `⚪ 不适用` · `🚫 阻塞`

`📘 稿链文案`：稿可见文案 / 单位与手册·接口不符（前端跟稿）；**非**前端接线错。修复默认改稿或产品确认保留稿面。仍计缺口。

### T1 归因

- 链/手册/接口未提供
- 手册或接口与链不符
- 手册↔接口打架
- 前端读源/算法/前置检查/刷新错误
- 前端缺接线
- 文案/单位与链不匹配（稿如此）
- 设计取舍（故意空/0）
- 设计取舍（缺数显0）
- 待核实

（`✅ 已对齐` / `⚪ 不适用` 行 T1 默认 `—`；**例外**：`设计取舍（缺数显0）` 可标在 ✅ 行以记录口径。缺口行须填 `修复方法`。）

## 全局对照源

见 [`research/dapp-tab-source-index.md`](./research/dapp-tab-source-index.md)。

## 1. 宿主与公共壳（H-）

本表这一章讲的是：**整个 DApp 外壳**（顶栏、侧栏、钱包连接、登录、新手引导等），不是某一个业务 Tab 里的买卖数字。
更细的对照目录见研究索引 §1；实现主要落在宿主与共享壳相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §1](./research/dapp-tab-source-index.md#1-host--shared)  
**代码根：** `src/views/dapp/host/` · `src/views/dapp/shared/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|H-001|宿主|DApp 主窗口|是否已完成业务登录（连接钱包还不够；要有未过期的登录凭证）|读取展示|`src/views/dapp/host/dapp-host.tsx`DappHost`；`src/core/auth/auth-machine.ts`deriveAuthState`（地址∩未过期 JWT）；`src/boot/startup/auth-provider.tsx`AuthProvider`|手册 §1.3；AGENTS「连接 ≠ 业务登录」|POST /auth/login|✅ 已对齐|—|—|—|—|只连上钱包不会算已登录；未登录时窗口阴影样式会不同|
|H-002|宿主|顶栏与整壳|「已连接钱包」和「已业务登录」是两回事；需要签名登录时会另有提示|读取展示|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`WalletConnectChip`/`ConnectedWalletChip`；`src/views/dapp/host/app-bar.tsx`AppBarWalletActions`；`useDappHost`+`useAuth`|AGENTS「连接 ≠ 业务登录」；手册 §1.3|POST /auth/login|✅ 已对齐|—|—|—|—|只有既连上钱包又完成登录，才显示短地址胶囊|
|H-003|宿主|顶栏钱包按钮|需要签名登录时，按钮文案走「请签名登录 / 连接中」；否则走「连接钱包」|读取展示|`src/views/dapp/host/app-bar.tsx`AppBarWalletActions`：`needsSignIn`→`signInRequired`/`connecting`；否则 `connectWallet`|AGENTS「连接 ≠ 业务登录」；手册 §1.3|POST /auth/login|✅ 已对齐|—|—|—|—|—|
|H-004|宿主|钱包连接与登录|用钱包签名并调用登录接口换取登录凭证|提交|`src/web3/auth/login-with-wallet.ts`loginWithWallet`；`src/boot/startup/auth-provider.tsx`AuthProvider`/`isLoginChainReady`；异网 idle+throw 不落 `loginError`；消息 `defaultChain.id`|手册 §1.3–1.4；AGENTS「连接 ≠ 业务登录」|POST /auth/login|✅ 已对齐|—|—|—|B-45|切回 BSC 后会自动再尝试登录或续期|
|H-005|宿主|登录成功之后|登录成功后刷新依赖登录态的页面数据；退出登录则清掉这些页面数据|提交|`src/boot/startup/auth-provider.tsx`AuthProvider`：`sessionReady` 上升沿 `invalidateAfterAuthLogin`；断会话 `clearApiQueries`|手册 §1.3；`docs/decisions/dapp-page-bag-dock-detail.md`（boot 组合根）|POST /auth/login|✅ 已对齐|—|—|—|—|入口在宿主钱包区，刷新副作用在启动层|
|H-006|宿主|钱包详情弹窗|断开钱包连接|提交|`src/views/dapp/host/wallet/wallet-details-modal.tsx`handleDisconnect`：`disconnect`+`clearLoginErrorOnDisconnect`（JWT 表保留）|手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-007|宿主|已连接钱包胶囊|登录出错时可点重试；账号封禁或用户拒签时不弹失败提示|提交|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`ConnectedWalletChip`/`loginToastMessage`：reconnect 样式→`login()`；封禁/拒签不 toast|手册 §1.3；AGENTS 鉴权|POST /auth/login|✅ 已对齐|—|—|—|—|—|
|H-008|宿主|已连接钱包胶囊|显示缩短后的钱包地址|读取展示|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`ConnectedWalletChip`：`formatShortAddress(account?.address??session?.address)`；须 `sessionReady&&walletReady`|手册 §1.3|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-009|宿主|钱包详情弹窗标题|详情标题里的短地址|读取展示|`src/views/dapp/host/wallet/wallet-details-modal.tsx`WalletDetailsModal`：`formatShortAddress(walletAddress)`|手册 §1.3|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-010|宿主|钱包详情弹窗|复制完整钱包地址|提交|`src/views/dapp/host/wallet/wallet-details-modal.tsx`handleCopy`→`copyTextToClipboard`|UI 基线（已实现）；手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-011|宿主|钱包详情弹窗|USD1 余额数字：加载中显示「…」，出错显示「—」，成功则格式化展示|读取展示|`wallet-details-modal.tsx`；`useUsd1PresaleWalletQuery`→`BSC_CONTRACTS.usd1`；pending=`…`/error=`—`/ok=`formatTokenAmount`|手册 §4.3 USD1.`balanceOf`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|个人金钱本轮未做线上样本对账；出错不伪造成 0；前端接线已按口径完成|
|H-012|宿主|钱包详情弹窗|是否在宿主弹窗展示 AGX / gAGX / X / XX 或账户迁移状态|读取展示|`src/views/dapp/host/wallet/wallet-details-modal.tsx` 注释「不含代币列表」；host 无迁移 UI|手册 §4.3 / §17；`docs/figma-pages.md`（无 host 迁移帧）|—（纯 UI）|⚪ 不适用|—|—|—|阻塞·迁移页|完整资产列表在「资产」Tab；迁移页另等产品与稿|
|H-013|宿主|顶栏网络胶囊|当前网络名称显示为「BSC」|读取展示|`src/views/dapp/host/app-bar.tsx`AppBarWalletActions`+`useWriteReadiness`：同网 BSC 图标+文案；异网见 H-014|手册 §1.3 `chainId`；§1.4 `wrong_network`；§4.4|—（纯链）|✅ 已对齐|—|—|—|B-45|读的是钱包当前真实网络|
|H-014|宿主|顶栏错误网络胶囊|不在 BSC 时引导用户切回 BSC|提交|`src/views/dapp/host/app-bar.tsx`handleSwitchToBsc`：`useSwitchActiveWalletChain(defaultChain)`；`switching`→disabled+`Loader2`；失败 toast|手册 §1.4 / §4.4|—（纯 UI）|✅ 已对齐|—|—|—|B-45|没有单独写「切换中…」文案，只用转圈表示|
|H-015|宿主|连接钱包弹窗|打开连接钱包界面（第三方连接组件）|提交|`src/views/dapp/host/wallet/wallet-connect-modal.tsx`；`WalletConnectButton`：`needsSignIn` 时不挂 Embed（直接 `login`）|手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|连接成功或已连接后会自动关窗|
|H-016|宿主|钱包详情弹窗|钱包掉线后显示重新连接|提交|`src/views/dapp/host/wallet/wallet-details-modal.tsx`：`!walletReady`→`reconnectWallet` CTA + `WalletConnectModal`|手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-017|宿主|侧栏 / 手机底栏|「兑换」是否有可领红点（涡轮有可领时）|读取展示|`src/views/dapp/host/rail.tsx`/`mobile-nav.tsx`；`useTurbineExchangeRailDot(walletReady)`→`src/web3/exchange/turbine-exchange-read.ts`readTurbineHasClaimable`（`silencesSize`+`isVested`）|手册 §16 Turbine|—（纯链）|✅ 已对齐|—|—|—|—|与 H-018 一样：没连钱包不算可领红点|
|H-018|宿主|侧栏 / 手机底栏|「释放」是否有可领红点（队列、分流器等有可领时）|读取展示|`src/views/dapp/host/rail.tsx`/`mobile-nav.tsx`；`useReleaseRailDot(walletReady)`→`src/web3/release/release-read.ts`readReleaseHasClaimable`|手册 §12–13|—（纯链）|✅ 已对齐|—|—|—|—|在 BSC 上公开读取即可，不要求已业务登录|
|H-019|宿主|侧栏共建提示|提示文案里的「第几季」|读取展示|`rail.tsx`→`formatGenesisSeasonIntro`；`GenesisPromoSync`：`activePhase`→index+1，else live，else **`return 1`**；loading 只把 discount 换成 `…`，season 仍可能 1|手册 §6；figma 教程/创世|—（纯链）|✅ 已对齐|设计取舍（故意空/0）|—|—|—|产品已确认：没有进行中阶段时回退季号 1；与社区/共建若干行同源壳层展示|
|H-020|宿主|侧栏共建提示|提示文案里的折扣（如 -30%）|读取展示|`src/views/dapp/host/genesis-promo-sync.tsx`：`discountBps/100`→`-N%`；0/无活期→`—`；loading→`…`（`formatGenesisSeasonIntro`）|手册 §6 phase `discountBps`|—（纯链）|✅ 已对齐|—|—|—|—|没有数据时诚实显示空，不硬编折扣|
|H-021|宿主|共建促销数据同步（挂在宿主）|把共建各阶段、当前阶段、AGX 价格写入共用状态，供侧栏提示使用|读取展示|`src/views/dapp/host/genesis-promo-sync.tsx`GenesisPromoSync`；`src/web3/presale/use-presale-queries.ts`usePresalePhasesQuery`等；`readAllPresalePhases`|手册 §6 PreSale|—（纯链）|✅ 已对齐|—|—|—|—|主要服务 H-019 / H-020|
|H-022|宿主|DApp 主窗口|连接后在后台预热：是否已绑推荐人、多币余额等（用户看不见）|读取展示|`src/views/dapp/host/dapp-host.tsx`；`src/web3/wallet/use-connect-warm-prefetch.ts`useConnectWarmPrefetch`→`prefetchConnectWarm(address,bscReadClient)`|手册 §1.3 / §5；B-39|—（纯链）|✅ 已对齐|—|—|B-39|B-39 已关闭|壳层不展示绑定状态；可见展示见附录 Z 相关行|
|H-023|宿主|未连接引导卡|未连接时的引导卡片与「去连接」按钮|提交|`src/views/dapp/shared/connect-promo-card.tsx`ConnectPromoCard`；`dock-connect-promo.tsx`DockConnectPromo`；CTA=`WalletConnectChip`|手册 §1.4 `need_wallet`；UI 基线|—（纯 UI）|✅ 已对齐|—|—|—|—|哪个 Tab 显示引导由各业务页决定；校验不一致记在对应业务章|
|H-024|宿主|未连接引导卡|已经需要签名登录时，卡片大标题仍是「去连接」促销文案，按钮却可能变成「请签名登录」|读取展示|`src/views/dapp/shared/connect-promo-card.tsx`：`t.dapp.connect.promoTitle` 固定；按钮经 `WalletConnectChip` 可切 `signInRequired`|AGENTS「连接 ≠ 业务登录」；i18n `dapp.connect`|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿与文案表，让标题和按钮语义一致；或产品确认保留现状。不要前端擅自离稿改文案|—|C-21|标题与按钮意思不一致；对照 Figma 可见文案跟稿，张力进改稿队列|
|H-025|宿主|新手引导气泡|第几步进度（共 12 步，从第 1 步到第 12 步）|读取展示|`src/views/dapp/host/onboarding/onboarding-tooltip.tsx`OnboardingTourTooltip`；`shared.ts`ONBOARDING_STEP_COUNT=12`|`docs/figma-pages.md` 教程 1/12–12/12|—（纯 UI）|✅ 已对齐|—|—|—|—|这是界面进度，不是链上数字|
|H-026|宿主|新手引导|完成或跳过后记住「已完成」，并回到兑换总览|提交|`src/views/dapp/host/onboarding/onboarding-guide.tsx`finish`→`writeOnboardingDone`；键 `aegis.onboarding.v1`；回 `exchange` hub|UI 基线；`docs/figma-pages.md` 教程|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-027|宿主|顶栏新手引导入口|未完成时显示红点，并可再次打开引导（手机顶栏隐藏此入口）|读取展示|`src/views/dapp/host/primitives.tsx`OnboardingTourChip`；`app-bar.tsx`：`done===false` coral；H5 `max-dapp:hidden`|`docs/figma-pages.md` 教程|—（纯 UI）|✅ 已对齐|—|—|—|—|首次仍可能自动弹出（见 H-028）|
|H-028|宿主|新手引导自动打开|第一次访问且未完成时，稍等片刻自动打开引导|提交|`src/views/dapp/host/onboarding/onboarding-guide.tsx`useOnboardingAutoStart`：`!done` 延时 400ms|UI 基线|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-029|宿主|跳转去绑定推荐人|从其他页跳到「社区」去补绑推荐人|提交|`src/views/dapp/shared/navigation.ts`goBindReferral`→`selectTab('community')`；host 无绑定表单|手册 §5；legacy 绑定细节|—（纯 UI）|⚪ 不适用|—|—|—|—|绑定表单在社区页；后台预热见附录|
|H-030|宿主|外壳|是否在外壳上显示「已绑定推荐人」|读取展示|host Fold 无展示；仅 `prefetchConnectWarm`→`readIsBindReferral`（H-022）|手册 §1.3 / §5|—（纯链）|⚪ 不适用|—|—|—|—|不是漏做能力，而是产品没在外壳展示|
|H-031|宿主|详情折叠按钮 / 侧栏头|右侧详情区是否折叠|读取展示|`src/views/dapp/shared/detail-toggle.tsx`/`dock-header.tsx`；`useDappHostStore.detailCollapsed`|`docs/decisions/dapp-page-bag-dock-detail.md`|—（纯 UI）|⚪ 不适用|—|—|—|—|纯本地界面状态|
|H-032|宿主|开发环境提示|缺少第三方钱包配置时，开发环境给出提示|读取展示|`src/views/dapp/host/dapp-host.tsx`：`import.meta.env.DEV && !isThirdwebConfigured`|工程配置（`.env.example`）|—（纯 UI）|⚪ 不适用|—|—|—|—|只在开发环境出现|
|H-033|宿主|顶栏语言菜单|切换界面语言|提交|`src/views/dapp/host/app-bar.tsx`→`LanguageMenu`/`setLocale`|i18n SSOT；foundation 文案|—（纯 UI）|⚪ 不适用|—|—|—|—|不是链上或业务接口数据|
|H-034|宿主|侧栏悬停/聚焦|鼠标移到未打开的 Tab 上时，预先拉取该页可能用到的数据|读取展示|`src/views/dapp/host/rail.tsx` onMouseEnter/onFocus→`prefetchTabQueries`|性能预取（非权威源）|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-035|宿主|网址哈希|网址里的 Tab 标记与当前打开的 Tab 保持一致|读取并提交|`src/views/dapp/host/dapp-host.tsx`replaceTabHash`/`syncTabFromHash`|UI 路由；`docs/decisions/dapp-page-bag-dock-detail.md`|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-036|宿主|切换 Tab|切换 Tab 后刷新过期数据，并清掉其他 Tab 留下的子页面状态|提交|`src/views/dapp/host/dapp-host.tsx` `displayTab` effect→`refetchStaleTabQueries`+`resetForeignSubviewStores`|刷新门闸|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-037|宿主|连接/登录进行中|正在登录时，按钮显示「连接中」并不可点|读取展示|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`WalletConnectButton`：`aria-busy`+disabled+`t.wallet.connecting`|AGENTS 鉴权 UX|POST /auth/login|✅ 已对齐|—|—|—|—|—|
|H-038|宿主|登录签名消息|签名消息里声明的是预期网络（BSC），不会把错误网络写进消息|提交|`src/web3/auth/login-message.ts`createSiweLoginFields`/`loginMessage`：`chain_id=String(expected)`；`loginWithWallet` 仅 live=BSC 才签发|手册 §1.3 chainId；AGENTS 写链门闸|POST /auth/login|✅ 已对齐|—|—|—|B-45|与 H-004 同一套网络校验|
|H-039|宿主|关于卡 / Tab 头 / 侧栏框|标题和副标题槽位（具体数字由各业务 Tab 自己填）|读取展示|`src/views/dapp/shared/about-card.tsx`/`tab-header.tsx`/`dock-frame.tsx`；动态 Num 由调用方 tab 传入|`docs/foundation/component-usage.md`；`docs/decisions/dapp-page-bag-dock-detail.md`|—（纯 UI）|⚪ 不适用|—|—|—|—|宿主壳不展开各业务页的数字|
|H-040|宿主|外壳|是否提供账户迁移入口或「旧账户」提示|读取展示|host 无迁移入口 UI；`src/core/migration/migration-user.ts` 存在但不挂壳|手册 §4.3 / §17；`docs/figma-pages.md`（超出稿）|—（纯 UI）|⚪ 不适用|—|—|—|阻塞·迁移|等产品与设计确认迁移页面后再接线|

## 2. 质押（S-）

本表这一章讲的是：**质押 Tab**（总览、活期/定期质押、债券、X 挖矿、收益计算器，以及资产页上与质押相关的领取/赎回）。
更细的对照目录见研究索引 §2；实现主要落在质押相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §2](./research/dapp-tab-source-index.md#2-staking)  
**代码根：** `src/views/dapp/staking/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|S-001|质押|总览首页|池子里总共锁了多少 AGX（质押总量）|读取展示|`formatAgxCompact(undefined)`→`0 AGX`；`tvlUsdSub`=`formatUsdApprox(poolAgx??0,…)`；loaded 时跟 `poolAgxBalance`|手册 §8 · `poolAgxBalance`|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|没取到就显示 0，是产品选定的空态；有数据时跟链|
|S-002|质押|总览首页|协议总市值（流通量 × AGX 美元价）|读取展示|`labels.mcap`：`circulating!=null∧price!=null`→积；else `formatUsd(null)`→**`$0.00`**|手册 sagx.`circulatingSupply`+价源|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|缺价也会变成 $0，不是诚实空「—」|
|S-003|质押|总览首页|市场上流通的 AGX 数量|读取展示|`formatAgxGrouped(undefined)`→`0.00 AGX`；loaded 跟 `circulatingSupply`|手册 · sagx.`circulatingSupply`|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接；本表不要求再用线上钱包对账|
|S-004|质押|总览首页|金库储备（按 USD1 展示）|读取展示|`formatTreasuryUsd1`：reserves/price null→`0 USD1`/`≈$0`；有源则 AGX×价|手册 · treasury.`totalReserves`|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|空态造 0，与「未取到显 0」口径一致|
|S-005|质押|总览首页|AGX 的美元价格|读取展示|`labels.price`←`useAgxPriceUsd`；null/error→`formatNumber(0)`→**`$0.00`**（hook 注释亦写兜底 0.00）|价源 hook（池 spot）|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；无价时造 $0|
|S-006|质押|总览首页|历史上总共销毁了多少 AGX|读取展示|`src/views/dapp/staking/hub/use-hub.ts`：`labels.burned`←overview.`totalBurned`；Prod=`1.5e9`|手册 · `contracts/agxcontributionswap.md` `getConfig`|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链上说法，或产品确认保留现状；不要前端擅自改文案|C-09|C-09|数字本身对；旁边提示文案的问题见 S-014；跟稿张力进改稿队列|
|S-007|质押|总览首页|最近一次复利增发的收益率|读取展示|`readLatestSagxRebaseRate1e18`→null（空数组/从未）；`formatRebasePct(null)`→**`0.00%`**（`YIELD_EMPTY`）|手册 sagx rebases|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|无记录时造 0%，不是诚实空|
|S-008|质押|总览首页|还能持续多久|读取展示|`labels.runway`=`runwayUnknown`=`—`；不伪造 0 天|无公式/无链字段|—|⚪ 不适用|—|—|A-19|A-19|诚实空；与附录 Z-012 同|
|S-009|质押|总览首页|有多少个地址参与了质押|读取展示|`useStakeAddressCount(sessionReady)`；`!sessionReady`/loading/fail 均 `formatNumber(0)`|—|`POST /performance/stake-address-count`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|门控对；空/失败造 0，不是「—」|
|S-010|质押|总览·周期表|基础日收益、锁定加成、各周期收益|读取展示|`formatYieldPct(null)`→`YIELD_EMPTY`=`0.00%`；算法跟 epoch×`epochsPerDay`+`lockedBonusBps`|手册 epoch×`epochsPerDay`；`lockedBonusBps`|—|✅ 已对齐|设计取舍（缺数显0）|—|B-44|—|债券段加成为 0 仍合法；空态造 0%|
|S-011|质押|总览·图表|质押总量 / 市值历史曲线|读取展示|`useProtocolMarketStatsChart` 读 `data.list`；涨跌幅=`latest_growth_rate`；`chartValueLabel`=`formatUsd(lastValue)` null→`$0.00`；`formatPercentChange(null)`→`+0.0%`|`docs/backend-api/api.md` #protocol-market-stats/series|`POST /protocol-market-stats/series`|✅ 已对齐|设计取舍（缺数显0）|—|A-18|A-18|主问题是空态造零；接线见附录；本行不靠线上序列抬档|
|S-012|质押|总览·常见问题|写着「约 14,400 块 / 一轮约 12 小时 / 每天 2 次」|读取展示|hub FAQ `{blocks}/{hours}/{timesPerDay}`；本金缓冲 FAQ `{days}`←effectiveDuration|手册 epoch / Manager.duration|—|✅ 已对齐|—|—|C-14|C-14|Epoch+缓冲天数跟链；12 locale 占位齐全；产品确认跟链|
|S-013|质押|总览·常见问题|写着「收益以 gAGX 结算 / 可直接挖 X」|读取展示|`zh.ts` hub/stake FAQ 已渲染 gAGX 结算叙事|手册 §8/§9 结算 AGX；§15 挖矿须 gAGX|—|✅ 已对齐|—|—|C-08 · A-07|C-08 · A-07|产品确认保留稿面（B 口径）；非接线错|
|S-014|质押|总览·提示文案|「总销毁量」旁的说明（含销毁债券说法）|读取展示|`overview.metrics.burned.hint`|同 S-006|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-09|C-09|跟稿张力进改稿队列|
|S-015|质押|总览·提示文案|复利增发提示写「每个复利周期（约 12 小时）」|读取展示|`metrics.rebase.hint` 已渲染死写 12h|同 S-012|—|✅ 已对齐|—|—|C-14|C-14|文案 {blocks}/{hours}/{timesPerDay}←stakingHubOverview.epochLength（共享既有 query）；产品确认跟链|
|S-016|质押|活期/定期·操作区|钱包里还有多少 AGX（可质押余额）|读取展示|`useStakeSession`←`readStakeOpenPreflight`/`balanceOf`；无样本对账|手册 §8 ERC20.`balanceOf`|—|✅ 已对齐|—|—|—|—|前端已接；本表不要求线上对账|
|S-017|质押|活期/定期·操作区|基础日收益 / 周期收益 / 加成|读取展示|`yieldMeta`←`formatYieldPct`/`formatBonusPct`；null→`0.00%`（同 S-010）|同 S-010|—|✅ 已对齐|设计取舍（缺数显0）|—|B-44|—|继承 S-010 的空态造 0%|
|S-018|质押|活期/定期·操作区|锁定多久的说明文案|读取展示|liquid / `{days} 天线性释放`|手册周期|—|✅ 已对齐|—|—|—|—|—|
|S-019|质押|活期/定期·操作区|还能质押多少额度（是否在界面上显示）|读取展示|预检用 `remainingQuota` 门闸；Dock **未展示** `meta.remaining`|`remainingStakeAmount` + 个人限额|—|⚪ 不适用|—|—|B-36|—|能力在前置检查里；文案残留见附录 Z-002|
|S-020|质押|活期/定期·提交|用户提交质押（活期或定期开仓）|提交|`submitStakeOpen`：`approveThenLiveWrite`+推荐/额度/迁移/池开关；成功 `invalidateAfterStaking`|手册 §8.2/8.3|—|✅ 已对齐|—|—|B-36|—|授权不足时会引导补授权|
|S-021|质押|活期/定期·详情|总质押、当前周期、下次复利增发、收益率|读取展示|总质押 `poolAgxWei??0n`；`formatRebasePct(null)`→`0.00%`；倒计时跟块高|Hub 同批 overview|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|倒计时接线在；空态造 0|
|S-022|质押|活期/定期·详情|我的持仓本金合计|读取展示|`useStakeDetail`←`readStakePositions` 聚合；无样本钱包|手册 §8 仓位读|—|✅ 已对齐|—|—|—|—|前端已接；本表不要求线上对账|
|S-023|质押|活期/定期·详情|已释放 / 待释放本金|读取展示|`aggregateStakeRelease`：liquid 对已释放/待释放贡献 0；locked=`released` / `principal−released`；`use-stake` 聚合|手册 §8.2 liquid / §8.3 locked `getReleasedPrincipal`（A-08）|—|✅ 已对齐|—|—|B-12 · A-08|B-12 · A-08|活期已释放=0 是故意的；不要拿分流器冒充；有单测钉死|
|S-024|质押|活期/定期·详情|当前复利增发收益 / 加成|读取展示|数跟链 `blockReward`/`extraInterest`；展示用 `GAGX_DECIMALS` 标 **gAGX**|手册 getStakeRewards；链付 AGX|—|✅ 已对齐|—|—|C-02 · A-07|C-02 · A-07|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|S-025|质押|活期/定期·详情|质押流水记录表|读取展示|`useStakeFlowPositions`|`docs/backend-api` #stake-flow/positions|`POST /stake-flow/positions`|✅ 已对齐|—|—|—|—|需要已登录|
|S-026|质押|活期/定期·常见问题|「每天 2 次复利增发 / 约 12 小时」等|读取展示|`stake.faq`/`intro`：`{blocks}/{hours}/{timesPerDay}`；本金 FAQ `{days}`←effectiveDuration|`epoch.length` · Manager.duration|—|✅ 已对齐|—|—|C-14|C-14|Epoch+缓冲天数跟链；12 locale 占位齐全；产品确认跟链|
|S-027|质押|活期/定期·机制说明|「收益以 gAGX」|读取展示|mechanismSteps / faq 已渲染|链 AGX|—|✅ 已对齐|—|—|C-02 · C-08|C-02 · C-08|产品确认保留稿面（B 口径）；非接线错|
|S-028|质押|活期/定期·详情|趋势图|读取展示|`useStakingDetail('stake')`→`aggregate-series` `metric=stake`（AGX）；涨跌幅=`latest_growth_rate`；空态 `0.00 AGX`/`+0.0%`|`docs/backend-api/api.md` #protocol-market-stats/aggregate-series|`POST /protocol-market-stats/aggregate-series`|✅ 已对齐|设计取舍（缺数显0）|—|A-18|A-18|LP/销毁/X 详情同 hook 换 metric（`lp_bond`/`burn_bond`/`x_stake`）；Hub 仍走 `/series`|
|S-029|质押|债券·操作区|各周期折扣价率（如显示「85%」）|读取展示|`formatBondDiscountLabel`；Prod 180=8500→「85%」|手册 · BondDepository.`discountRateBP`|—|✅ 已对齐|—|—|—|—|这是协议配置价率，不是个人钱包金额；标签叫法问题见 S-030|
|S-030|质押|债券·操作区/详情|标签写「溢价率」，数字却是价率（如 85%）|读取展示|标签「溢价率」/FAQ「收益空间」；值=`discountRateBP` 价率（85%）非 15% 空间|手册 discountRateBP=成交价率|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|产品确认保留「溢价率」稿面；数字是否等于手册「溢价」语义另核（不要擅自改成「折扣」文案）|C-16|C-16|数字对见 S-029；进改稿队列|
|S-031|质押|债券·操作区|已售 / 还能买多少（债务剩余）|读取展示|`formatBondDebtRemainingDisplay`←maxDebt/totalDeposit；接线在|手册 BondDepository 债务|—|✅ 已对齐|设计取舍（缺数显0）|—|B-34|—|前端已接；本表不要求线上对账|
|S-032|质押|债券·操作区|预计能获得多少 AGX（净/毛预览）|读取展示|`readBondZapAgxPreview`：`valueOf×1e9/agxPrice`；Prod `RestakeConfig.agxPrice`=`55e18` vs Treasury `valueOf` 9 位→毛兑付≈尘埃|手册 · BondHelper 报价 + fee；`ErrorBondTooSmall`|—|🚫 阻塞|手册或接口与链不符|要等链上把价格/估值量纲改对；前端不要私自换价。修好后再重测前置检查|B-34|—|前端已接；例如花 1000 USD1 预估毛兑付远小于 0.01 AGX|
|S-033|质押|债券·操作区|允许滑点|读取展示|`useBondHelperSlippageQuery`|手册 BondHelper|—|✅ 已对齐|—|—|—|—|—|
|S-034|质押|债券·操作区|钱包 USD1 余额|读取展示|zap 预检 `readBondZapPreflight`；无样本|ERC20 `USD1.balanceOf`|—|✅ 已对齐|—|—|—|—|前端已接；本表不要求线上对账|
|S-035|质押|债券·提交|用户购买债券（流动性债 / 销毁债）|提交|`submitBondZap`+live 门闸完整；Prod 只读同 S-032：合理 USD1→`grossPayout < 1e7`→恒 `bondTooSmall`|手册 §10.4；`ErrorBondTooSmall`|—|🚫 阻塞|手册或接口与链不符|解阻条件同 S-032：先修链上价位量纲，再测购买|B-34|—|前端前置检查已接；不能靠前端私自换价修好|
|S-036|质押|债券·详情|流动性债 / 销毁债的总存入量|读取展示|`useBondDetail`←三池 `market.totalDeposit`；接线在|手册 BondDepository|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接；本表不要求线上对账|
|S-037|质押|债券·详情|下次复利增发 / 收益率|读取展示|同源 Hub overview；`formatRebasePct(null)`→`0.00%`|同 S-007/S-021|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|继承 S-007 空态造 0%|
|S-038|质押|债券·详情|持仓 / 已释放 / 待释放|读取展示|`pendingRelease=payoutRemaining−pendingPayout`；接线在；无样本|手册 getBondInfo 聚合|—|✅ 已对齐|—|—|—|—|「已释放」约等于当前可领；前端已接|
|S-039|质押|债券·详情|当前复利增发收益|读取展示|`useBondDetail`←`row.profit`（`getStakeProfit`）；展示标 gAGX|手册 BondDepository.`getStakeProfit`；链付 AGX|—|✅ 已对齐|—|—|C-02 · A-07|C-02 · A-07|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|S-040|质押|债券·详情|购买记录|读取展示|session 门控 `useBondFlow*Purchases`|`docs/backend-api` #bond-flow|`POST /bond-flow/lp-purchases` · `/burn-purchases`|✅ 已对齐|—|—|—|—|—|
|S-041|质押|债券·常见问题|溢价率解释 / 折扣区间说法|读取展示|lpbond/burnbond.faq 已渲染「溢价」叙事；值语义见 S-030|discountRateBP 语义|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-16|C-16|共享 FAQ 另有复投漏 180 天档问题；进改稿队列|
|S-042|质押|X 挖矿·操作区|日收益率|读取展示|overview null→`ZERO_PCT`=`0.00%`；loaded=`formatXmineDailyYieldLabel`|手册 §15 · `yieldRateBP`|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|空态造 0%；有数据时跟链|
|S-043|质押|X 挖矿·操作区|还能质押多少额度（额度−已质押）|读取展示|B-14：spendable=min(balance,remaining)；额度标签用 remaining|手册 `miningQuotaOf` / `miningStakeAmountOf`|—|✅ 已对齐|—|—|—|—|算法已定；个人额度无样本；前端已接|
|S-044|质押|X 挖矿·操作区|钱包 gAGX 余额 / 一键最大|读取展示|`useXmineSession`←`readXminePreflight`/`RewardGAGX.balanceOf`|手册 §15 ERC20|—|✅ 已对齐|—|—|—|—|前端已接|
|S-045|质押|X 挖矿·操作区|写着「锁定天数 / 24 小时后释放」|读取展示|`meta.lockValue`=`24 小时后释放` 已渲染；非自动释放|手册 §15.4 `activateWarmup`|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-03|C-03|激活动作见 S-064；进改稿队列|
|S-046|质押|X 挖矿·提交|用户把 gAGX 质押进挖矿|提交|`submitXmineStake`：quota/余额/allowance；不足跳闪兑；`invalidateAfterStaking`|手册 §15.4|—|✅ 已对齐|—|—|B-14|—|—|
|S-047|质押|X 挖矿·详情|池子总质押的 gAGX|读取展示|`tvlGagxWei??0n` 空态造 0；loaded←`totalStakedGagx`|手册 §15|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|空态造 0；有数据时跟链|
|S-048|质押|X 挖矿·详情|标签叫「X 价格」，实际是「1 个 X 值多少 AGX」|读取展示|`useXmineDetail`：`agxAmountPerXFromXPerAgx`→`N AGX`；Prod xPerAgx=`1e19`→`10 AGX`；非 USD|手册 `xPerAgx`|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-17|C-17|标签容易误解，数字本身对；进改稿队列|
|S-049|质押|X 挖矿·详情|累计挖矿产出|读取展示|`useX0MiningLifetimeReward` 翻尽页（B-17 closed）|无链累计 view|`POST /x0-mining/logs`（operation=REWARD 翻页累加）|✅ 已对齐|—|—|—|—|需要已登录；前端已接|
|S-050|质押|X 挖矿·详情|下一次挖矿产出|读取展示|固定 `—`|无字段|—|⚪ 不适用|—|—|A-17|A-17|诚实空；同附录 Z-014|
|S-051|质押|X 挖矿·详情|我的挖矿质押量|读取展示|链优先 `miningStakeAmountOf`；回落 API holdings|手册 §15|`POST /x0-mining/positions`（回落）|✅ 已对齐|—|—|—|—|前端已接|
|S-052|质押|X 挖矿·详情|「已释放」|读取展示|`use-xmine.tsx` 注释「无 PRV 已释字段，先显示 0」→`formatNumber(0)`+`formatUsdApprox(0,…)`；不冒充 miningStake（B-24）|无缓冲拆分字段|—|✅ 已对齐|设计取舍（缺数显0）|—|A-15|A-15|固定 0 不等于诚实空「—」|
|S-053|质押|X 挖矿·详情|待领取的挖矿产出|读取展示|`readXminePosition`：`pending` / `pendingValue`|手册 §15|—|✅ 已对齐|—|—|—|—|前端已接|
|S-054|质押|X 挖矿·详情|挖矿流水记录|读取展示|`useX0MiningLogs`；session 门控|`docs/backend-api` #x0-mining/logs|`POST /x0-mining/logs`|✅ 已对齐|—|—|—|—|—|
|S-055|质押|X 挖矿·常见问题/机制|「24 小时锁定后即可…」听起来像自动放开|读取展示|faq + mechanismSteps 已渲染|同 S-045|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-03|C-03|进改稿队列|
|S-056|质押|收益计算器·输入|产品、周期、数量、价格、天数等输入|读取展示|`useCalcDock`；价种子自 spot 一次|本地估算|—|✅ 已对齐|—|—|—|—|不是链上正式报价|
|S-057|质押|收益计算器·结果|质押 / 债券 / 挖矿的估算结果|读取展示|`buildCalcEstimate`/`calcLocalInterest`/`readStakingHubOverview`：`epochsPerDay` 可空；只信 `epochsPerDayFromLength`；缺→零利息（禁 `?? 2`）|手册折扣表 + 链 yield/epoch|—|✅ 已对齐|—|—|B-18|—|每日几次以链为准；FAQ「每天 2 次」文案另见 S-012|
|S-058|质押|收益计算器·说明|收益曲线、关键节点、免责说明|读取展示|notes「仅供参考」|本地|—|✅ 已对齐|—|—|—|—|—|
|S-059|质押|资产页·提交（质押相关）|混合领取利息（含勾选复投）|提交|`submitMixedClaim` dual-check；`invalidateAfterAssetsClaim`→assets+staking+release|手册 §9|—|✅ 已对齐|—|—|B-27|—|按钮在资产页；勾了复投比例就会复投|
|S-060|质押|资产页·提交（质押相关）|赎回本金（活期 / 定期）|提交|`submitStakeRedeem`；warmup 禁；`invalidateAfterAssetsClaim`|手册 §8|—|✅ 已对齐|—|—|—|—|—|
|S-061|质押|资产页·提交（质押相关）|活期预热结束后点激活|提交|`submitLiquidWarmupClaim`→`invalidateAfterStaking`|手册 §8.2|—|✅ 已对齐|—|—|—|—|这不是混合领息|
|S-062|质押|资产页·提交（债券相关）|赎回债券本金/兑付|提交|`submitBondRedeem`；进分流器；`invalidateAfterAssetsClaim`|手册 §10|—|✅ 已对齐|—|—|—|—|界面没有「赎回并质押」开关|
|S-063|质押|资产页·提交（X 挖矿）|领取挖到的 X|提交|`submitXmineClaim` dual-check→assets claim invalidate|手册 §15.4|—|✅ 已对齐|—|—|—|—|—|
|S-064|质押|资产页·提交（X 挖矿）|激活挖矿预热|提交|`submitXmineActivateWarmup`|手册 §15.4|—|✅ 已对齐|—|—|—|—|说明：文案说「自动」是错的，但这个动作存在|
|S-065|质押|资产页·提交（X 挖矿）|开始解押|提交|`submitXmineUnstake`；进分流器|手册 §15.4|—|✅ 已对齐|—|—|—|—|—|
|S-066|质押|跨页提示文案|提示「领取 / 赎回 / 解押请去资产页」|读取展示|与写路径落点一致|产品分流|—|✅ 已对齐|—|—|—|—|—|
|S-067|质押|早期质押（EarlyStaking）|仓位展示 / 领本金 / 混合领息|读取并提交|无 Figma；`abis`/`contracts`/`src` 均无 Early；无 `views` call site|手册 §8.4 · EarlyStaking|—|🚫 阻塞|前端缺接线|等早期质押合约地址与合约接口说明齐了，再接仓位与领取|blocker（B-19）|blocker|同附录 Z-001、资产 A-028；禁止假装线上已有|
|S-068|质押|活期·机制说明|「活期预热后需要激活」|读取展示|与 S-061 一致|手册 §8.2|—|✅ 已对齐|—|—|—|—|—|
|S-069|质押|X 挖矿·机制说明|「领 X / 解押在资产页；不能取消预热」|读取展示|对齐 ErrorWarmupExitDisabled|手册 cancelWarmup revert|—|✅ 已对齐|—|—|—|—|—|
|S-070|质押|债券·机制说明|「经债券助手一键买入（zap）」|读取展示|与 S-035 写路径一致|手册 §10|—|✅ 已对齐|—|—|—|—|—|

---

## 3. 奖励（W-）

本表这一章讲的是：**奖励 Tab**（总览 Hub、幸运抽奖、推荐/参与/共建、发展金、创世股东，以及 混合领取 / 简单领取面板）。
更细的对照目录见研究索引 §3；实现主要落在奖励相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §3](./research/dapp-tab-source-index.md#3-rewards)  
**代码根：** `src/views/dapp/rewards/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|W-001|奖励|Hub 统计|总奖励数字：界面标成 gAGX|读取展示|`useRewardsHub` 拼 `gAGX`；API 字段标 gAGX；链 Dao 结算 AGX|`docs/backend-api/api.md` #performance/making-overview（total_reward=gAGX）|`POST /performance/making-overview`|✅ 已对齐|—|—|A-07→C-15|C-15|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-002|奖励|Hub 统计|做市档位：显示成 A{n}，没有则空|读取展示|`formatMakingRankLabel`+`makingRankToRowIndex`|—|`POST /performance/making-overview`（`making_rank`）|✅ 已对齐|—|—|—|—|与机制表行高亮同源|
|W-003|奖励|Hub 统计|个人持仓：主标美元，副标 AGX|读取展示|`formatUsdFromAgx`/`formatAgxSecondary`←`personal_position`|（AGX）×价|`POST /performance/making-overview`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|个人金钱本轮未做线上样本对账；接线保留；前端已按口径接入|
|W-004|奖励|Hub 统计|做市业绩：美元主标 + AGX 副标|读取展示|同上←`making_market`|—|`POST /performance/making-overview`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|同 W-003 金钱条口径；前端已接入；线上对账非本表判断标准|
|W-005|奖励|Hub 统计|小区业绩：美元主标 + AGX 副标|读取展示|同上←`small_market`|—|`POST /performance/making-overview`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|同 W-003 金钱条口径；前端已接入；线上对账非本表判断标准|
|W-006|奖励|Hub 统计|可用贡献值|读取展示|`useRewardsContribution`：有 summary 用 API；无会话回退链 `userContribution`|手册 · AgxContributionSwap|`POST /agx-contribution/summary`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|点数同资产/兑换侧金钱条口径；无线上样本对账；前端已接入|
|W-007|奖励|Hub 卡片·幸运|幸运卡可领额（链上快照）|读取展示|`readLuckyClaimSnapshot`+Hub `luckyAmount`（仅 `claimable∧amount>0`）|手册 §14 `getWinnerInfo`/`rewardClaimed`|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|数源与前置检查已对齐；后缀 gAGX 见 C-15；前端已接入；线上对账非本表判断标准|
|W-008|奖励|Hub 卡片·发展|可领额度界面标 gAGX（字段 `unlocked_claimable`）|读取展示|`useMarketAllowanceSummary`；`formatGagxBalance`|手册 · `MarketFund.agx()`；API 字段文 unlocked=AGX|`POST /market-allowance/summary`|✅ 已对齐|—|—|A-09→C-05|C-05|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-009|奖励|Hub 卡片·创世|团队可领金额，按美元展示（总额−已领）|读取展示|Hub 创世卡 `$` 格式，不走 gAGX|RewardClaimer=USD1|`POST /team-reward/total`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|社区基金可领不在 Hub 预览；前端已接入；线上对账非本表判断标准|
|W-010|奖励|Hub 卡片·推荐/参与/共建|可领预览额|读取展示|Hub 无预览→`formatGagxBalance(null)`→`0.0000gAGX`；详情须签后才有额|无未签只读预览|须 `POST /claim/dao-reward` 后知额|✅ 已对齐|设计取舍（缺数显0）|—|A-21|A-21|故意无预览≠漏做；已登录仍可能造 0；口径：未取到显 0（视为正确）|
|W-011|奖励|Hub FAQ|「AGX / gAGX 口径」说明文案|读取展示|`zh.ts` `rewards.faq`（Hub 条无「1:1」；1:1 在 cards/hint/子 FAQ）|链结算 AGX；API 多标 gAGX|—|✅ 已对齐|—|—|C-15|C-15|产品确认保留稿面（B 口径）；非接线错|
|W-012|奖励|Hub 机制表|当前档位对应行高亮|读取展示|`tierRowIndex`∩静态 i18n 表|—|`making_rank`|✅ 已对齐|—|—|—|—|表内说明是静态文案|
|W-013|奖励|Lucky 详情|今日奖池金额（美元，`today_total_prize`）|读取展示|`use-lucky.tsx`|—|`POST /lucky-reward/summary`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|个人金钱本轮未做线上样本对账；摘要接线保留；前端已接入|
|W-014|奖励|Lucky 详情|开奖倒计时|读取展示|`readLuckyRoundDisplaySnapshot` 15s 刷新；仅 `accepting` 时倒计时|链 `getCurrentRoundUserStat` + `getRound.endTime` + `isRoundAcceptingPurchases`|—|✅ 已对齐|—|—|—|—|未激活 / 未接受购买不显示倒计时；没连钱包也没有|
|W-015|奖励|Lucky 详情|本轮是否有资格（Yes/No）+ 本轮购买额|读取展示|同上；hint 用 USD1 额|链 Tracker `getCurrentRoundUserStat`（`qualified` / `totalAmount`）|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|资格跟单笔门槛；不以 `status=Open` 代替时间窗；前端已接入|
|W-016|奖励|Lucky 详情|累计中奖次数 `win_count`|读取展示|`formatApiCountLabel`|—|`POST /lucky-reward/summary`|✅ 已对齐|—|—|—|—|—|
|W-017|奖励|Lucky 中奖榜|中奖额后缀写 gAGX（`reward_amount`）|读取展示|`mapLuckyWinnerToRow`|API winners 标 gAGX；链付 AGX|`POST /lucky-reward/winners`|✅ 已对齐|—|—|C-15|C-15|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-018|奖励|Lucky 我的记录|参与额 / 是否中奖 / 交易哈希|读取展示|`mapLuckyMyRoundToRow`|—|`POST /lucky-reward/my-rounds`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|中奖额单位见 W-017；前端已接入；线上对账非本表判断标准|
|W-019|奖励|Lucky 日期筛|只提供近 5 个 UTC 日可选|读取展示|`DRAW_DATE_OPTION_COUNT=5`|设计取舍|—|✅ 已对齐|设计取舍（故意空/0）|—|C-18←B-31|C-18|产品已确认：日期筛近 5 个 UTC 日通过|
|W-020|奖励|Lucky FAQ|文案写「折算 gAGX」「1:1 贡献」|读取展示|`lucky.faq`|链 AGX + divisor=6|—|✅ 已对齐|—|—|C-06·C-15|C-06·C-15|文案 {ratio}=contributionDivisor:1（链 burnSwapConfig multicall）；产品确认跟链|
|W-021|奖励|Lucky·写|混合领取：前置条件检查 + 提交前再核对 + 刷新页面数据|提交·前置检查|`submitLuckyMixedClaim`→`evaluateRewardsMixedClaim`；`invalidateAfterRewardsMixedClaim`（rewards+release+staking）|手册 §14 `claimRewardMixed` + §9.3|—|✅ 已对齐|—|—|B-27|B-27 closed|贡献不足会引导去销毁（burn）；暂停或不可领会阻断|
|W-022|奖励|Referral 详情|推荐总奖励 + 界面标 gAGX|读取展示|`use-referral.ts`|API 标 gAGX；Dao 付 AGX|`POST /referral-award/summary`|✅ 已对齐|—|—|C-15|C-15|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-023|奖励|Referral 详情|持仓 / 直推人数 / 贡献|读取展示|summary 三字段；直推数与 `direct-referrals` 同 indexer|—|`POST /referral-award/summary`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|不拆行；持仓/贡献走金钱条；计数接线保留；前端已接入|
|W-024|奖励|Referral 详情|「下次发放」时间|读取展示|硬编码 `NON_NUMERIC_EMPTY`|无 `next_payout`|—|⚪ 不适用|—|—|A-20|A-20|诚实空；同附录 Z-013|
|W-025|奖励|Referral 记录/直推表|奖励流水与直推成员表|读取展示|primitives mappers（`awarded_gross` 等）|—|`POST /referral-award/logs` · `/direct-referrals`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|表金额走金钱条；映射接线保留；前端已接入|
|W-026|奖励|Referral FAQ|混合领取「1:1 消耗」说明|读取展示|`referral.faq` + card body|链 divisor=6|—|✅ 已对齐|—|—|C-06←A-11|C-06|文案 {ratio}=contributionDivisor:1（链 burnSwapConfig multicall）；产品确认跟链|
|W-027|奖励|Referral·写|DAO 混合领取（推荐类型 REFERRAL=42）|提交·前置检查|`submitDaoMixedClaim`：校验 `DAO_REWARD_SIGN_TYPE`；`writeDaoMixedClaim`；双读贡献/池余额；`invalidateAfterRewardsMixedClaim`|手册 DaoPool 仍写须=4（入仓过时）；Prod 链不强制=4|`POST /claim/dao-reward`（signType 41–45）|✅ 已对齐|—|—|A-10|A-10|前端/接口 signType 41–45 与线上行为对齐；手册债另队（禁手改入仓正文）。完整签领未真发≠本表判断标准|
|W-028|奖励|Participate 详情|总奖励标 gAGX / 持仓 / 贡献 /「下次发放」为空|读取展示|summary 走 API；nextPayout 空同 W-024|—|`POST /participation-award/summary`|✅ 已对齐|—|—|C-15·A-20|C-15·A-20|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-029|奖励|Participate 记录/邀请人|流水记录 + 邀请人信息|读取展示|`use-participate` mappers（`awarded_gross` 等）|—|`POST /participation-award/logs` · `/inviter`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|同 W-025 表金额金钱条；前端已接入|
|W-030|奖励|Participate FAQ|「1:1 贡献」说明文案|读取展示|`participate.faq`|链 divisor=6|—|✅ 已对齐|—|—|C-06|C-06|文案 {ratio}=contributionDivisor:1（链 burnSwapConfig multicall）；产品确认跟链|
|W-031|奖励|Participate·写|DAO 混合领取（参与类型 PARTICIPATION=43）|提交·前置检查|`submitDaoMixedClaim`|同 W-027|`POST /claim/dao-reward`|✅ 已对齐|—|—|A-10|A-10|同 W-027：前端跟链；手册「须=4」过时另记|
|W-032|奖励|Cobuild 详情|等级总奖励标 gAGX，并做折算展示|读取展示|`use-cobuild.ts`|API 含 RANK+SURPASS|`POST /rank-reward/summary`|✅ 已对齐|—|—|C-15|C-15|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-033|奖励|Cobuild 详情|当前/下一档位 + 三门槛进度|读取展示|summary 持仓/做市/直推门槛；队员表同模块 API|∩ 静态 tier 表|`POST /rank-reward/summary`|✅ 已对齐|—|—|—|—|接线已对齐；无价时 AGX 直比美元失真见 W-055|
|W-034|奖励|Cobuild 记录|等级奖 / 平越奖 / 直推成员|读取展示|Tab 切换重置页码；logs `awarded_gross`|—|`POST /rank-reward/logs` · `/peer-surpass-logs` · `/team-members`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|同 W-025 表金额金钱条；前端已接入|
|W-035|奖励|Cobuild FAQ|「1:1」+ gAGX 叙事文案|读取展示|`cobuild.faq`|链|—|✅ 已对齐|—|—|C-06·C-15|C-06·C-15|文案 {ratio}=contributionDivisor:1（链 burnSwapConfig multicall）；产品确认跟链|
|W-036|奖励|Cobuild·写|DAO 混合领取：等级奖(41) / 平越奖(44)|提交·前置检查|Segment 选类型；金额仅签名后可知；无 LIFETIME(45) UI|同 W-027|`POST /claim/dao-reward`|✅ 已对齐|—|—|A-10·A-21|A-10·A-21|同 W-027；终身奖(45)未接属产品范围另议，不是这条写路径写错|
|W-037|奖励|Grant 详情|档位 / 累计已领额度，界面标 gAGX|读取展示|`use-grant.ts`（suffix `gAGX`）|API：claimed 标 gAGX、`unlocked_claimable` 标 AGX（自打架）；链付 AGX|`POST /market-allowance/summary`|✅ 已对齐|—|—|A-09→C-05|C-05|FE 按 B 接 API 数+gAGX 标签；claimed/unlocked 文档自打架属后端债，产品确认 FE 忽略|
|W-038|奖励|Grant 详情|发放/领取流水表|读取展示|allowance 列标 gAGX|—|`POST /market-allowance/paid-logs` · `/claim-logs`|✅ 已对齐|—|—|C-05|C-05|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|W-039|奖励|Grant FAQ|「不耗贡献、gAGX 直达钱包」|读取展示|`grant.faq`|链 AGX 直达；不耗贡献/不经 Queue ✅|—|✅ 已对齐|—|—|C-05|C-05|产品确认保留稿面（B 口径）；非接线错|
|W-040|奖励|Grant Dock|待解锁额度 / 已解锁可领额度|读取展示|`use-simple-claim` 两字段|—|`POST /market-allowance/summary`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|个人金钱本轮未做线上样本对账；单位债另记；前端已接入|
|W-041|奖励|Grant·写|市场基金签名领取|提交·前置检查|`useMarketFundClaim`/`claimMarketFundReward` skipConfirm；UI `hasGrantClaimable`+session+writeReady；`invalidateAfterTeamClaim`（skipConfirm→仍 shouldInvalidate）|手册 §9.5 · MarketFund|`POST /claim/market-fund`（signType=51）|✅ 已对齐|—|—|B-25|C-05·B-25|写路径不负责展示金额；不真发；按钮/日志后缀见 W-037/038/058|
|W-042|奖励|Genesis Dock|股东档位 / 个人·团队进度|读取展示|`use-genesis.ts`+`useShareholderRankLabels`|—|`POST /performance` · teamOverview · partitions|✅ 已对齐|—|—|—|—|R3–R9 用合格分区|
|W-043|奖励|Genesis Dock|直推已领金额（美元）|读取展示|`useReferralTotal`→`claimed ?? total`|—|`POST /referral/total`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|展示「已领」口径；前端已接入；线上对账非本表判断标准|
|W-044|奖励|Genesis Dock|团队奖可领 / 已领说明（USD1）|读取展示|`claimableAmountValue`|手册 RewardClaimer|`POST /team-reward/total`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接入；线上对账非本表判断标准|
|W-045|奖励|Genesis Dock|社区基金可领 / 锁定说明|读取展示|`unlocked_claimable`；超体系徽标|手册 CommunityFund；token 以合约为准|`POST /community-fund/total`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接入；线上对账非本表判断标准|
|W-046|奖励|Genesis·写|团队奖签名领取 + 二次确认|提交·前置检查|`useTeamRewardClaim`；confirm_failed→`shouldInvalidate=false`|手册 RewardClaimer|`POST /claim/team-reward` + `/claim/confirm`|✅ 已对齐|—|—|—|—|链成功、确认失败时不提前清余额|
|W-047|奖励|Genesis·写|社区基金签名领取 + 二次确认|提交·前置检查|`useCommunityFundClaim`；同 outcome 不变量|—|`POST /claim/community-fund` + confirm|✅ 已对齐|—|—|—|—|—|
|W-048|奖励|Genesis 详情/FAQ|历史 Tab + FAQ 文案|读取展示|referral/team/communityFund 历史|FAQ 指向 RewardClaimer/CommunityFund|各 `/…/logs`|✅ 已对齐|—|—|—|—|—|
|W-049|奖励|混合领取面板共用|释放/复投比例与计划档位|读取展示|`readClaimPlans`+原始 index 匹配|链 `queuePlans` / `RestakeConfig.getPlan`|—|✅ 已对齐|—|—|—|—|勿用过滤后下标|
|W-050|奖励|混合领取面板共用|所需/已有贡献（幸运可预览）|读取展示|Lucky `amount>0` 时展示；Dao 签前 required 槽为空|链 `quoteRequiredContribution`|—|✅ 已对齐|—|—|C-06·B-26|C-06·B-26|链侧 quote 正确；Copy 比见 W-020 等（{ratio}=divisor:1）|
|W-051|奖励|混合领取面板共用|贡献不足时打开兑换页的销毁（burn）|提交|`openExchangeView('burn')`|手册 §9.2 convert|—|✅ 已对齐|—|—|—|—|兑换本体在兑换 Tab|
|W-052|奖励|接口/文案|混合领取贡献「1:1」vs 链上「金额/6」|读取展示|FE 写闸信链 quote；Copy `{ratio}`←`contributionDivisor`|手册 §9 · 链 quote|`POST /claim/dao-reward` 文仍写 1:1（后端文档债，FE 忽略）|✅ 已对齐|—|—|A-11→C-06|C-06|FE 已跟链；产品确认只负责前端，接口文档偏差不挡关|
|W-053|奖励|Lucky 提交检查|幸运池是否暂停（按链上实时状态）|读取并提交|`readLuckyClaimSnapshot`→`paused`；`evaluateRewardsMixedClaim`/`submitLuckyMixedClaim` pre+live 入 `luckyPaused`|以链 live 为准（不跟死文）|—|✅ 已对齐|—|—|—|—|布尔提交检查跟链上实时状态；不是展示金额问题|
|W-054|奖励|Hub intro Copy|文案写「混合领取按 1:1 消耗」|读取展示|onboarding/教程轨 `zh.ts`|链 divisor=6|—|✅ 已对齐|—|—|C-06|C-06|文案 {ratio}=contributionDivisor:1（链 burnSwapConfig multicall）；产品确认跟链|
|W-055|奖励|Cobuild 门槛|持仓/做市进度：AGX 换成美元|读取展示|`agxAmountToUsdProgressCurrent`：有价 AGX×$；无价→null→徽章 empty（`cobuild-tier-progress`）|API AGX × `useAgxPriceUsd`|`POST /rank-reward/summary`|✅ 已对齐|—|—|—|—|已修：禁无价 AGX↔$ 直比；单测钉住 empty|
|W-056|奖励|DAO 混合领取·写后|领取成功后刷新释放/质押页面数据|提交|`invalidateAfterRewardsMixedClaim`|手册 §9.3/§9.5|—|✅ 已对齐|—|—|B-27|B-27|—|
|W-057|奖励|简单领取·写后|市场/团队/社区领取成功后刷新|提交|`invalidateAfterTeamClaim`→rewards 桶（allowance/team/community/erc20）|手册成功后刷新|—|✅ 已对齐|—|—|—|—|市场基金跳过二次确认时仍会刷新|
|W-058|奖励|混合领取代币芯片|面板代币名标成 gAGX|读取展示|`claim-panels` / `mixed.tokenGagx`|链 AGX|—|✅ 已对齐|—|—|C-15|C-15|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|

## 4. 释放（L-）

本表这一章讲的是：**释放 Tab**（总览 Hub、释放池队列、缓冲池/分流器，以及领取后的刷新与侧栏红点）。
更细的对照目录见研究索引 §4；实现主要落在释放相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §4](./research/dapp-tab-source-index.md#4-release)  
**代码根：** `src/views/dapp/release/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|L-001|释放|Hub·释放池卡|释放中金额|读取展示|`useReleaseHub`+`formatReleaseApiOrChainLabel`：`chainReady` 优先 `queueReleasing`；无钱包用 API|手册 §12 RewardQueue（releasing≈total−claimable）|`/release-pool/summary` `releasing_amount`|✅ 已对齐|设计取舍（缺数显0）|—|—|B-29|金额按 4 位展示；有链优先已定；前端已接入；线上对账非本表判断标准|
|L-002|释放|Hub·释放池卡|「可领取」金额|读取展示|`use-hub` 注释勿把累计 `released_amount` 当可领；`apiQueueClaimableRaw=released−claimed`；有链用 `totalClaimable`|手册 §12 claimable|`/release-pool/summary`（派生；有链不用）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|标签就是「可领取」；前端已接入；线上对账非本表判断标准|
|L-003|释放|Hub·释放池卡|进度百分比|读取展示|`formatReleasePct`←`releaseProgressBps(claimable,releasing)`|手册 §12 进度语义|—|✅ 已对齐|—|—|—|—|—|
|L-004|释放|Hub·释放池卡|单位文案|读取展示|`t.release.units.queue='gAGX'`；`formatReleaseApiOrChainLabel` unit 同源|手册 §12 `token()`=AGX；稿/i18n 写 gAGX|api.md 标 gAGX|✅ 已对齐|—|—|C-07 · A-12|C-07|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|L-005|释放|Hub·缓冲池卡|AGX 池内剩余（Total）|读取展示|`bufferTotalAgx`：链=`claimable+releasing`；API=`releasing_amount`；注释勿用累计入池|手册 §13 PRV/分流器剩余|`/buffer-pool/summary` `releasing_amount`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|这里的「释放中」=池内剩余；前端已接入；线上对账非本表判断标准|
|L-006|释放|Hub·缓冲池卡|AGX「可领取」|读取展示|`apiRaw: undefined`；只信链 `agx.totalClaimable`|手册 §13 `claimableAmount`|—（API 无同口径 claimable）|✅ 已对齐|设计取舍（缺数显0）|—|A-16|A-16|前端已接入；线上对账非本表判断标准|
|L-007|释放|Hub·缓冲池卡|gAGX Total|读取展示|`gagxTotalLabel`=`gagx.claimable+releasing`；未连钱包 `0`；audit「勿当假零」|手册 §13 多 token 桶|—（API 无 gAGX summary）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|断连显示 0 不另标部分对齐；前端已接入；线上对账非本表判断标准|
|L-008|释放|Hub·缓冲池卡|gAGX「可领取」|读取展示|Hub 绑 `bufferClaimableGagx`←链 `gagx.totalClaimable`；与 AGX 对称|手册 §13|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|同 L-007，不双降为部分对齐；前端已接入；线上对账非本表判断标准|
|L-009|释放|Hub·缓冲池卡|进度百分比|读取展示|`bufferPct=formatReleasePct(agxClaimable,agxReleasing)`；**不含** gagx|产品入场卡单一进度|—|✅ 已对齐|设计取舍（故意空/0）|—|—|—|Hub 入场卡只看 AGX；gAGX 进度在缓冲子页双卡。产品口径可接受|
|L-010|释放|Hub·详情|税率表周期/税率|读取展示|`taxBps/100`；`useReleaseQueuePlans`；空则 i18n fallback|手册 §12 `queuePlans` feeRate|—|✅ 已对齐|—|—|—|—|算法跟链上计划；本轮未做线上具体费率对拍|
|L-011|释放|Hub·详情|关于/用途说明幻灯|读取展示|Visible 文案；无动态数|产品叙事|—|✅ 已对齐|—|—|—|—|—|
|L-012|释放|Hub·详情|机制步骤「6:1」|读取展示|title `{divisor}`←`contributionDivisor`（共享 burnSwapConfig）；body「50%·50%」仍稿面写死|FE 信链 quote（≈amount/6→6:1）；body 为 burn split 叙事串台|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改稿消串台（贡献步不应讲销毁分流）；或产品确认保留。50% 不接 splitBps|C-06|C-06|标题数字已跟链；正文 50% 故意不接（串台）；张力进改稿队列|
|L-013|释放|Hub·常见问题|「领取的 gAGX 去向」题干|读取展示|题干写 gAGX；答案已澄清 AGX→Turbine|手册 §12→§16|—|✅ 已对齐|—|—|C-07|C-07|产品确认保留稿面（B 口径）；非接线错|
|L-014|释放|队列·操作区|各档可领 / 释放中|读取展示|`readReleaseQueueSnapshot` Multicall per-plan|手册 §12 分档 snapshot|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|数字算法对；前端已接入；线上对账非本表判断标准|
|L-015|释放|队列·操作区|单位 + 代币图标|读取展示|`units.queue` + `gagxIcon`（`queue/dock.tsx`）；金额用 `AGX_DECIMALS`|链 token=AGX|—|✅ 已对齐|—|—|C-07|C-07|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|L-016|释放|队列·操作区|进度百分比 / 美元提示|读取展示|档内 pct + `useAgxPriceUsd`|手册 §12 + 价源|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接入；线上对账非本表判断标准|
|L-017|释放|队列·操作区|领取按钮前置检查|提交·前置检查|`canClaimWhen` + `releaseClaimBlockReason`：claimable>0 · writeReady · planIndex≥0 · unknown lock|手册 §12 领取前置|—|✅ 已对齐|—|—|—|—|—|
|L-018|释放|队列·操作区|领取（解锁）|提交|`submitReleaseQueueClaim`：pre→live 双读闸 → `claimAllVestedRewards(planIndex)` → `invalidateAfterReleaseClaim`|手册 §12 `claimAllVestedRewards`|—|✅ 已对齐|—|—|—|—|本表不真发交易；成功提示写「涡轮配额」|
|L-019|释放|队列·操作区|单档刷新|提交|`readReleaseQueuePlanByDays` patch cache；不整表重拉|手册分档读|—|✅ 已对齐|—|—|—|—|—|
|L-020|释放|队列·详情|释放中 / 可领取统计|读取展示|B-29 链优先；图标仍 `gagxIcon`|手册 §12；有链优先|`/release-pool/summary` 派生可领|✅ 已对齐|设计取舍（缺数显0）|—|—|C-07|单位问题见 L-004 / L-015；前端已接入；线上对账非本表判断标准|
|L-021|释放|队列·详情|累计从释放池领取|读取展示|无链 lifetime view；session 用 API `total_claimed_amount`；无 session→诚实 0|链无累计 view；API 有字段但标 gAGX|`/release-pool/summary` `total_claimed_amount`（标 gAGX）|✅ 已对齐|—|—|A-12|A-12|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|L-022|释放|队列·详情|释放池记录表|读取展示|`mapReleasePoolLogToRow`；金额无单位后缀|手册流水|`/release-pool/logs`|✅ 已对齐|—|—|—|A-12|索引器空态诚实展示|
|L-023|释放|队列·常见问题|gAGX 去向|读取展示|题干 gAGX；答案「涡轮配额」未点名 AGX|手册 §12→Turbine AGX|—|✅ 已对齐|—|—|C-07|C-07|产品确认保留稿面（B 口径）；非接线错|
|L-024|释放|缓冲·操作区|AGX 可领 / 释放中|读取展示|`useBuffer` 硬编码单位 `AGX` + `agxIcon`|手册 §13 AGX 桶|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接入；线上对账非本表判断标准|
|L-025|释放|缓冲·操作区|gAGX 可领 / 释放中|读取展示|分流器 gagx 桶；单位 `gAGX` + `gagxIcon`|手册 §13|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接入；线上对账非本表判断标准|
|L-026|释放|缓冲·操作区|介绍文案里的天数|读取展示|`usePrincipalReleaseDurationDays` 插值 intro|手册 `effectiveDuration` / `DEFAULT_RELEASE_DURATION`|—|✅ 已对齐|—|—|—|—|—|
|L-027|释放|缓冲·操作区|提取按钮前置检查|提交·前置检查|双卡共用；`canClaimWhen` 看 `totalClaimable`(AGX+gAGX)|手册 §13 可领>0|—|✅ 已对齐|—|—|—|—|—|
|L-028|释放|缓冲·操作区|领取（缓冲提取）|提交|`submitReleaseBufferClaim`：空窗跳过；各 hop `claimMany` + 归档 PRV；双闸；每跳后 invalidate|手册 §13 瀑布/`claimMany`|—|✅ 已对齐|—|—|—|—|不是链尾时会继续往下游释放|
|L-029|释放|缓冲·操作区|刷新|提交|`bufferQuery.refetch()`|—|—|✅ 已对齐|—|—|—|—|—|
|L-030|释放|缓冲·操作区|领取成功文案|读取展示|zh：「已提交领取，进入分流器释放」偏中继叙事|手册：链尾→钱包；中继→next|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|—|—|比旧文案「仅 AGX 进钱包」好一些；可见文案跟稿，张力进改稿队列|
|L-031|释放|缓冲·详情|AGX 累计进入 / 提取 / 释放中|读取展示|链优先；无链回落 API cumulative/released/releasing|手册 §13|`/buffer-pool/summary`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|前端已接入；线上对账非本表判断标准|
|L-032|释放|缓冲·详情|gAGX 三元组（进入/提取/释放中）|读取展示|无钱包→0；仅链（API 无 gAGX）|手册 §13|—|✅ 已对齐|设计取舍（缺数显0）|—|—|A-16 旁系|同 L-007，不双降为部分对齐；前端已接入；线上对账非本表判断标准|
|L-033|释放|缓冲·详情|缓冲记录表|读取展示|`contract_address` 原值；金额无币种后缀|—|`/buffer-pool/logs`|✅ 已对齐|—|—|—|—|—|
|L-034|释放|缓冲·详情|机制步骤「30 天缓冲」|读取展示|`mechanismSteps` `{days}`←`usePrincipalReleaseDurationDays`（与 intro 同源）|`effectiveDuration` / DEFAULT|—|✅ 已对齐|—|—|—|—|文案 {days}←effectiveDuration（共享既有 query）；产品确认跟链；措辞未改|
|L-035|释放|缓冲·常见问题|「AGX 直接进入钱包」|读取展示|zh：「点击提取，AGX 直接进入钱包」；忽略 next 瀑布与 gAGX|手册：仅链尾 `next==0`；可有 gAGX|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|—|建议新 C|超出单位口径：忽略 next 瀑布与 gAGX 桶；与 L-030 张力；保留📘|
|L-036|释放|缓冲·常见问题|AGX / gAGX 双资产|读取展示|zh 已写「分流器释放单可为 AGX 或 gAGX」|手册 splitter 多 token|—|✅ 已对齐|—|—|—|—|审计刻意不把断连显 0 记成假零缺口|
|L-037|释放|侧栏红点|是否有可领|读取展示|`readReleaseHasClaimable` / host `use-release-rail-dot`：queue+splitter+archive|手册 §12–13|—|✅ 已对齐|—|—|—|—|表面在宿主，能力属释放|
|L-038|释放|写后刷新|领取成功后刷新|提交|`invalidateTabQueries('release')`；`TAB_QUERY_KEYS.release` 含 `releaseRoot`+`turbineRoot`+erc20+API|手册成功后刷配额/余额|release/buffer-pool API keys|✅ 已对齐|—|—|—|—|队列领取后涡轮配额可见性会更新|
|L-039|释放|接口权威|释放池摘要币种|读取展示|有链时 Num 跟链；UI 标签仍 `units.queue`=gAGX|api.md「amount 均为 gAGX」vs 链 AGX|`/release-pool/summary`|✅ 已对齐|—|—|A-12|A-12|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|L-040|释放|接口权威|缓冲池摘要无「可领」|读取展示|FE 信链正确（`apiRaw: undefined`）|链有 claimableAmount；API 无|`/buffer-pool/summary`|🟡 部分|链/手册/接口未提供|后端补同口径可领，或文档写明「已提取≠可领」；前端继续信链|A-16|A-16|审计刻意不记成前端缺口|
|L-041|释放|合约地址|释放队列代理合约|读取展示|`contracts.ts`←`VITE_BSC_REWARD_QUEUE`=`0x320feF8885283CbD1271aD1F39c5Fe694d56583C`（fail-closed）|`env/manual.bsc.addresses.env` 同址|—|✅ 已对齐|—|—|—|—|与入仓地址一致；换源时重新拷贝环境文件即可|
|L-042|释放|代码能力|单条领取已释放|提交|产品用按档 `claimAll`；单条无 UI|手册有单条；FE 仅 `claimAll`|—|⚪ 不适用|—|—|—|Z?|反查附录候选|
|L-043|释放|代码能力|按区间领取已释放|提交|FE 未暴露|手册有；产品未要|—|⚪ 不适用|—|—|—|Z?|—|
|L-044|释放|队列入队|入队奖励|提交|由 staking/rewards/bond 写入；本 tab 只领|仅 authorized callers|—|⚪ 不适用|—|—|—|—|解锁入口在上游 Tab|

---

## 5. 兑换（X-）

本表这一章讲的是：**兑换 Tab**（总览入口、闪兑、市价交易、销毁换贡献、涡轮解锁与提取）。
更细的对照目录见研究索引 §5；实现主要落在兑换相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §5](./research/dapp-tab-source-index.md#5-exchange)  
**代码根：** `src/views/dapp/exchange/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|X-001|兑换|总览·程序卡|点「交易 gAGX」打开闪兑，并选中 gAGX 交易对|提交|`hub/detail.tsx` `TRADE_GAGX_CARD_INDEX` + `setPairId('gagx')`|已实现 UI|—|✅ 已对齐|—|—|—|—|入口已接好|
|X-002|兑换|总览·程序卡|点「获取 USD1」打开闪兑，并选中 USDT/USD1 交易对|提交|`GET_USD1_CARD_INDEX` → `setPairId('usdt')`|手册 §7.2 Usd1Swap|—|✅ 已对齐|—|—|**B-02**|B-02|已关闭；重审仍跟链上配置|
|X-003|兑换|总览·程序卡|「涡轮 / 获取 AGX / 贡献点数」等程序卡跳转|提交|`PROGRAM_TARGETS` → turbine/trade/burn|已实现 UI|—|✅ 已对齐|—|—|—|—|—|
|X-004|兑换|总览·程序卡|「出售 X」入口|提交|`PROGRAM_TARGETS[4]='trade'`；预选卖 X（`pairAfterTokenSelect`→买 AGX）；`TRADE_TOKEN_KEYS` 含 `x`|Pancake V2 AGX/X；产品已开三币|—|✅ 已对齐|—|—|A-02|A-02|入口进市价；路径见 tradePath|
|X-005|兑换|总览·程序卡|「获取贡献点数」正文里的兑换比例|读取展示|`readBurnContributionSwapConfig` → `formatBurnContributionRatioColon`|手册 §9.2 `rateBps`|—|✅ 已对齐|—|—|—|—|不是写死的 1:6|
|X-006|兑换|总览·常见问题|FAQ 等文案仍写「USDT→USD1」|读取展示|`t.exchange.hub.faq` / program body「USDT」；余额跟 `getConfig().usdtToken`|手册叙事 USDT vs 链 `usdtToken`（现网常为 XX）|—|🟡 部分|手册或接口与链不符|改设计稿和文案表跟链上真实币名（或读代币 symbol）；不要写死 USDT|— **A-01**|A-01|文案仍写 USDT|
|X-007|兑换|闪兑·概览|兑换比率卡片|读取展示|`FlashExchangeDetail` ← `overviewRateLabel`（spot）|gAGX 1:1 / `quoteUsd1Out`|—|✅ 已对齐|—|—|—|—|—|
|X-008|兑换|闪兑·概览|结算说明「链上 · 秒到」|读取展示|`t.exchange.flash.settlementValue`|产品文案|—|✅ 已对齐|—|—|—|—|不是金额数字|
|X-009|兑换|闪兑·USDT 对|输入币余额 / 授权额度|读取展示|`readFlashUsdtBalances` 用 `config.usdtToken`，禁 env 写死|手册 §7.2 `getConfig().usdtToken` + ERC20|—|✅ 已对齐|设计取舍（缺数显0）|—|**B-01**|B-01|接线跟链；金额未做线上对账；币名见 X-019；前端已接；线上对账非本表判断标准|
|X-010|兑换|闪兑·USDT 对|USD1 余额|读取展示|同上|ERC20 `USD1.balanceOf`|—|✅ 已对齐|设计取舍（缺数显0）|—|**B-01**|B-01|接线在；金额未做线上对账；前端已接；线上对账非本表判断标准|
|X-011|兑换|闪兑·USDT 对|合约配置（暂停/最小/最大/储备/费率/小数位）|读取展示|`readUsd1SwapConfig`；`evaluateFlashUsd1Swap` 门闸|手册 §7.2 Usd1Swap|—|✅ 已对齐|—|—|—|—|小数位跟配置|
|X-012|兑换|闪兑·USDT 对|预估能换出多少 USD1|读取展示|`readFlashPairQuote` → `quoteUsd1Out`|手册 §7.2|—|✅ 已对齐|—|—|—|—|—|
|X-013|兑换|闪兑·gAGX 对|gAGX↔AGX 余额；反向时 AGX 授权给 gAGX|读取展示|`readFlashGagxBalances`；forward 无需 approve|RedeemableGAGX / AGX|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；报价 1:1；金额未做线上对账；前端已接；线上对账非本表判断标准|
|X-014|兑换|闪兑·操作区|卖出/买入金额面值 + 余额标签|读取展示|`useFlashExchangeSession` + `formatTokenAmount`；未加载空串|上列链读|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|不硬编 0；金额未做线上对账；前端已接；线上对账非本表判断标准|
|X-015|兑换|闪兑·提交|USDT→USD1：先授权 → 提交前再检查 → 兑换 → 刷新|提交|`submitFlashExchange`：approve 后 `assertStillSubmittable`+`evaluateFlashUsd1Swap`；`invalidateAfterExchange`；滑点 100bps|手册 §7.2|—|✅ 已对齐|—|—|**B-01**|B-01|最少到手量不为 0|
|X-016|兑换|闪兑·提交|gAGX 赎回 / AGX 包装成 gAGX|提交|`redeemGagxFlashExchange` / `wrapAgxFlashExchange` + approve-if-needed|gagx 合约|—|✅ 已对齐|—|—|—|—|—|
|X-017|兑换|闪兑·常见问题|「USDT→USD1」说明 / 单向路径|读取展示|`t.exchange.flash.faq` + pairs 标签 USDT|Visible+FAQ；语义单向正确|—|🟡 部分|手册或接口与链不符|同 X-006/X-019：改币名|— **A-01**|A-01|币名叙事不对|
|X-018|兑换|闪兑·常见问题|gAGX↔AGX 1:1 / 无滑点 / gAGX 可挖 X|读取展示|flash FAQ：1:1/无滑点；「也可质押挖矿 X」（Xmine 收 gAGX）|gAGX↔AGX；XStakingPool|—|✅ 已对齐|—|—|—|—|复审确认：本行职责与发放句分拆；发放句归 X-055|
|X-019|兑换|闪兑·币对界面|分段控件/路由上的币名写「USDT」|读取展示|`EXCHANGE_CONFIG.tokens.usdt.symbol='USDT'`；余额地址跟链|链 token 实为 XX|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|— **A-01**|A-01|标签名≠合约币名；可见文案跟稿，张力进改稿队列|
|X-020|兑换|市价·概览|池子汇率卡片|读取展示|`useMarketTradeSpotRates` → detail|手册 §7.1 Router/pair spot|—|✅ 已对齐|—|—|—|—|—|
|X-021|兑换|市价·操作区|USD1 / AGX 余额（当前可交易币）|读取展示|`useMarketTradeBalances`|手册 §7.1 ERC20|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|复审确认接线在；前端已接；线上对账非本表判断标准|
|X-022|兑换|市价·操作区|路由合约对卖出币的授权额度|读取展示|同上 + `needsTokenApproval`|ERC20|—|✅ 已对齐|—|—|—|—|—|
|X-023|兑换|市价·报价|路由报价；卖 AGX 先扣卖税再按净额报价|读取展示|`fetchExchangeQuote` / `readAgxSellTaxBps` + `effectiveAgxSellTaxBps`（块额度）|手册 §7.1 AGX 卖税|—|✅ 已对齐|—|—|**B-35**|B-35|已关闭；不是一律加固定卖税|
|X-024|兑换|市价·操作区|价格影响百分比|读取展示|quote.`priceImpactBps`；高影响警告阈值|本地 `calcPriceImpactBps`|—|✅ 已对齐|—|—|—|—|—|
|X-025|兑换|市价·操作区|「预估 Gas」|读取展示|`gasEstimate` 恒 `0n`（`exchange-read` 注释）→ 展示 `—`|无链/API gas 字段|—|✅ 已对齐|—|—|— **A-03**|A-03|不是金额；诚实显示「—」（A-03 记缺少 Gas 来源）|
|X-026|兑换|市价·操作区|滑点 / 最少到手量|读取展示与提交前置检查|`calcAmountOutMin`；提交 `assertStillSubmittable` 强制 refetch quote|手册 §7.1 用户滑点|—|✅ 已对齐|—|—|—|—|—|
|X-027|兑换|市价·操作区|路径标签 / 跳转 Pancake 深链|读取展示|`formatTradeRouteLabel`；UI 仅邻接对|path helper|—|✅ 已对齐|—|—|—|—|—|
|X-028|兑换|市价·提交|授权卖出币给路由 → 再读余额与报价 → 兑换 → 刷新|提交|`submitMarketTrade`；deadline 由 write 层生成|手册 §7.1|—|✅ 已对齐|—|—|—|—|—|
|X-029|兑换|市价·选币|X 可选为卖出/买入|读取展示|`TRADE_TOKEN_KEYS`；双栏全量；`pairAfterTokenSelect` 邻接纠偏|池：USD1—AGX—X|—|✅ 已对齐|—|—|A-02|A-02|合法对仅相邻；同币翻转；USD1↔X 对侧落到 AGX|
|X-030|兑换|市价·常见问题|按代币切换的 FAQ 文案|读取展示|`MarketTradeFaqTabs` + `t.exchange.faq.tabs`|Visible+FAQ|—|✅ 已对齐|—|—|—|—|无独立金额断言|
|X-031|兑换|销毁·操作区|AGX 余额 / 对贡献兑换合约的授权|读取展示|`readBurnExchangeBalances`|手册 §9.2|—|✅ 已对齐|设计取舍（缺数显0）|—|—|—|复审确认接线在；前端已接；线上对账非本表判断标准|
|X-032|兑换|销毁·操作区|当前贡献值|读取展示|`readBurnUserStats`：`originalOf==0` 回退 user|手册 `originalOf`→`userContribution(root)`|—|✅ 已对齐|设计取舍（缺数显0）|—|**B-10**|B-10|复审确认算法已关；同奖励/资产贡献口径；前端已接；线上对账非本表判断标准|
|X-033|兑换|销毁·操作区|销毁比率 / 预估贡献点|读取展示|config + `readBurnContributionQuote`；slippageBps=0|`rateBps` · `quoteContributionOut`|—|✅ 已对齐|—|—|—|—|—|
|X-034|兑换|销毁·操作区|去向「黑洞% · LP%」|读取展示|dock destination + FAQ interpolate|`getSplitConfig().splitBps`|—|✅ 已对齐|—|—|—|—|—|
|X-035|兑换|销毁·概览|累计销毁 AGX / 获得·消耗贡献点|读取展示|`burn/detail`：三格始终 `userStats`（agxBurned / contributionEarned / contributionConsumed）；缺→0；不绑 `getConfig().total*`|链 userStats（个人）|—|✅ 已对齐|设计取舍（缺数显0）|—|— **C-20**|C-20|稿标签未区分全网/个人；口径钉个人；缺数显 0|
|X-036|兑换|销毁·历史|销毁流水 / 消耗流水表|读取展示|`useBurnHistory`；需 `sessionReady`|—|`/agx-contribution/burn-logs` · `consume-logs`|✅ 已对齐|—|—|—|—|—|
|X-037|兑换|销毁·常见问题|比率 / 去向 / 不可转让等|读取展示|destination FAQ 注入 `burnPct/injectPct`|FAQ + 链 split|—|✅ 已对齐|—|—|—|—|—|
|X-038|兑换|销毁·提交|授权 AGX → 提交前重读配置/余额 → 兑换 → 刷新|提交|`submitBurnExchange` + `evaluateBurnContributionSwap`|手册 §9.2|—|✅ 已对齐|—|—|—|—|成功后刷新兑换（含销毁流水）|
|X-039|兑换|涡轮·概览|「待解锁 gAGX」数额|读取展示|`readTurbineQuota`=`migratedFrom`+root；UI 拼 `gAGX`|手册 §16 `turbineBalances`（AGX wei）|—|✅ 已对齐|—|—|— **A-04**/**C-01**；**B-04→C-01**|A-04,C-01,A-06|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|X-040|兑换|涡轮·概览|「冷却中 gAGX」|读取展示|`sumTurbineSilenceBuckets` 仅 cooling；不并入 vested|手册 silences ∧ `!isVested`|—|✅ 已对齐|—|—|— **C-01**；**B-05**|C-01,B-05|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|X-041|兑换|涡轮·概览|「累计已提取」|读取展示|`useTurbineSummary`→`claimed_total`；冷却/待解锁走链 silences；**不用** `unclaimed_total` 填冷却卡|API `claimed_total`；`unclaimed_total`≠冷却分态|`/turbine/summary` `claimed_total`|✅ 已对齐|设计取舍（缺数显0）|—|— **A-05**|A-05|复审确认：金额未做线上对账；未领总额接口债另记；前端已接；线上对账非本表判断标准|
|X-042|兑换|涡轮·概览|三张卡的美元约数|读取展示|`formatAgxQuotaUsd`；无报价 → `$0.00`；claimed 用 API 小数×单价|`quoteUsdInForAgxOut(1 AGX)` × 量|claimed←`claimed_total`|✅ 已对齐|设计取舍（缺数显0）|—|— **A-05**|A-05|缺价显 $0.00（空态统一）；已提取美元跟 X-041 接入|
|X-043|兑换|涡轮·操作区·解锁|可解锁额度标签（写 gAGX）|读取展示|`useTurbine` `unlockableAmountLabel` 硬拼 gAGX|同配额 AGX|—|✅ 已对齐|—|—|— **C-01**|C-01|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|X-044|兑换|涡轮·操作区·解锁|支付 USD1 / 将获 AGX 预览|读取展示|预览=min(折减输入,quota)；`payUsd1Label`：quote `isError`/undefined→`formatNumber(0)`|`quoteUsdInForAgxOut` · `previewTurbineExpectedAgx`|—|✅ 已对齐|设计取舍（缺数显0）|—|**B-06**|B-06|复审：报价失败造 0；正常路径算法仍对；口径：未取到显 0（视为正确）|
|X-045|兑换|涡轮·操作区·解锁|冷却周期小时 / AGX 价 / 合约滑点%|读取展示|session queries|`currentCooldownDuration` · quote · `swapSlippageBP`|—|✅ 已对齐|—|—|—|—|—|
|X-046|兑换|涡轮·操作区·提取|冷却列表：金额 + 状态 + 操作按钮|读取展示|dock map rows；vested 可点；可领在列表不进「冷却中」卡|`silences`+`isVested`|—|✅ 已对齐|—|—|— **C-01**；**B-05**|C-01,B-05|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|X-047|兑换|涡轮·提交·解锁|授权 USD1 → 提交前重报价并补授权 → 买入并开始冷却 → 刷新|提交|`submitTurbineUnlock` 禁 approve(pre) send(live) 漂移；`evaluateTurbineUnlockLive`|手册 §16.4|—|✅ 已对齐|—|—|**B-07**|B-07|—|
|X-048|兑换|涡轮·提交·提取|确认已到期 → 领取该条冷却 → 刷新兑换（及分流器/释放）并重拉列表|提交|`submitTurbineClaim`；`splitterManager!=0` 则 `invalidateAfterReleaseClaim`|手册 §16.4–16.5|—|✅ 已对齐|—|—|—|—|列表项删除后整表重拉|
|X-049|兑换|涡轮·记录表|涡轮流水|读取展示|`useTurbineLogs` + presenter|—|`/turbine/logs`|✅ 已对齐|—|—|—|—|—|
|X-050|兑换|涡轮·机制/常见问题|「gAGX 进涡轮」「提取到钱包」等文案|读取展示|mechanism 冷却步已写分流器；FAQ「到钱包」/配额 gAGX；toast `claimSuccess` 已写分流器|配额 AGX wei；claim→分流器|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|— **C-01**/**A-04**|C-01,A-04|机制已写分流器 vs FAQ「到钱包」事实张力；非纯单位 B；保留📘|
|X-051|兑换|涡轮·配额账户|读配额用迁移根账户；写/冷却列表用当前钱包|读取展示|`readTurbineQuota` 走 migration root；silences(user)|链：quota@root（手册自相矛盾，FE 跟链）|—|✅ 已对齐|—|—|— **A-06**；**B-08**|A-06,B-08|前端跟链；手册债不挡已对齐|
|X-052|兑换|涡轮·侧栏红点|有可领的冷却项|读取展示|`readTurbineHasClaimable` / `use-turbine-exchange-rail-dot`|`isVested` 探测|—|✅ 已对齐|—|—|**B-05**|B-05|—|
|X-053|兑换|写后刷新（共用）|兑换成功后刷新覆盖哪些数据|提交·刷新|tab keys：swap/erc20/flash/burn/turbine + turbine API + contribution logs|手册成功后刷新|turbine/agx-contribution API|✅ 已对齐|—|—|—|—|涡轮提取另刷释放|
|X-054|兑换|闪兑/市价/销毁|按钮上的「需要授权」提示|读取展示|`useExchangeQuote.needsApproval`；写内仍 `approve*IfNeeded`|allowance vs amountIn|—|✅ 已对齐|—|—|—|—|界面可提示，发起链上交易内再检查|
|X-055|兑换|共用 FAQ（旁路）|闪兑 FAQ「以 gAGX 发放 / 收到 gAGX」叙事|读取展示|`exchange.flash.faq`：「均以 gAGX 形式发放」「收到相应数量的 gAGX」；hub.faq 无此发放句|链结算 AGX；主责 shared C-08|—|✅ 已对齐|—|—|— **C-08**|C-08|产品确认保留稿面（B 口径）；非接线错|

---

## 6. 资产（A-）

本表这一章讲的是：**资产 Tab**（总览 Hub、持仓与缓冲、各产品仓位页、领取/赎回弹窗，以及与资产相关的 FAQ 文案）。
更细的对照目录见研究索引 §6；实现主要落在资产相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §6](./research/dapp-tab-source-index.md#6-assets)  
**代码根：** `src/views/dapp/assets/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|A-001|资产|Hub·总览|总资产价值（美元）|读取展示|`use-hub`→`stake_invest_usd_value`；Visible hint/FAQ 称「含未提取收益」；API 仅注 ACTIVE 投影|产品总估值 vs `user_performance.stake_invest_usd_value`|`/assets/reward-summary` `stake_invest_usd_value`|🟡 部分|手册或接口与链不符|后端文档钉清该字段是否含未提取收益；或改提示/FAQ；若链回退路径也要「含未提取」，须把可领估值并入总美元|—|—|提示/FAQ 写「含本金+未提取」；接口就绪时直绑该字段（文档未钉是否含收益）；无接口时用持仓本金×价（不含可领 gAGX）。三方口径未钉|
|A-002|资产|Hub·总览|可领取收益（展示）|读取展示|Hub **禁用** API `claimable_gagx`（见 A-003）；链 `blockReward+extraInterest+profit`；标 gAGX；**不含** X/market/DAO/释放/涡轮|产品：仓位 Mixed 未领子集|API 宽口径故意不用|✅ 已对齐|—|—|A-13|open|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|A-003|资产|Hub·总览|接口字段「可领 gAGX」（宽口径）|读取展示|类型有字段；`use-hub` 注释明确不直出|API reward-summary 宽口径|`/assets/reward-summary`|⚪ 不适用|—|—|A-13|open|故意不接线（设计取舍）；不是死代码|
|A-004|资产|Hub·总览|累计已领取|读取展示|session：API；链无累计 → 回退 `0.00 gAGX`|链无累计 view|`total_reward_claimed`|✅ 已对齐|设计取舍（缺数显0）|—|B-21 旁路|—|个人金钱本轮未做线上样本对账；缺数显 0 属设计；前端已接入；线上对账非本表判断标准|
|A-005|资产|Hub·总览|我的贡献点数|读取展示|apiReady→API；fallback→`readContributionSnapshot`|手册 §9.2|`available_contribution`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|金钱/点数展示无线上样本对账；前端已接入；线上对账非本表判断标准|
|A-006|资产|Hub·总览 / FAQ|贡献消耗文案写「1:1」|读取展示|`contributionHint`/FAQ 用 `{ratio}`；写路径信链 quote|链 `quoteRequiredContribution` / divisor；手册 §9|—|✅ 已对齐|—|—|C-06 · A-11|C-06|文案 {ratio}=contributionDivisor:1（链 burnSwapConfig multicall）；产品确认跟链|
|A-007|资产|Hub·持仓|可赎回已释放|读取展示|禁用 API 流水语义；链 `redeemableReleasedWei`；活期 `releasedPrincipal=0n` 不计入|产品：Locked `getReleasedPrincipal` + Bond `pendingPayout`|`total_released_agx`（同名不同义，不用）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|A-14 · C-04 · B-22|—|可见文案跟稿，张力进改稿队列|
|A-008|资产|Hub·持仓|总持仓|读取展示|apiReady→API；fallback 链求和|—|`/assets/holdings-summary` `total_holdings_agx`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|个人金钱无线上样本对账；前端已接入；线上对账非本表判断标准|
|A-009|资产|Hub·缓冲|在池总量 / 已提取（AGX）|读取展示|`bufferQuery` 不绑 API fallback 开关；有快照用链|手册 §13|`buffer_pool_releasing/released` 回落|✅ 已对齐|设计取舍（缺数显0）|—|A-16|A-16|个人金钱无线上样本对账；接口无同口径可领；前端已接入；线上对账非本表判断标准|
|A-010|资产|Hub·缓冲|在池总量 / 已提取（gAGX）|读取展示|`bufferGagx*`；API 未分 token；UI `bufferAsset` 切换|手册 §13 gagx 桶|—|✅ 已对齐|设计取舍（缺数显0）|—|A-16|—|个人金钱无线上样本对账；前端已接入；线上对账非本表判断标准|
|A-011|资产|Hub·总览|做市可领 AGX（接口字段）|读取展示|类型有字段；Hub **无**展示/入口；rewards 有做市领取|做市津贴归属 rewards|`/assets/reward-summary`（未消费）|⚪ 不适用|—|—|—|A-13|同附录相关行；故意不展（设计取舍）|
|A-012|资产|Hub·Dock|质押卡：仓位 / 收益 / 年化收益率|读取展示|`formatAprFromRebase`：缺 `epochsPerDay`→`APR_EMPTY`=`0.00%`（禁 `?? 2`）；仓位/收益另展|手册质押 APR|dist `stake_total_agx` + 链 yield|✅ 已对齐|设计取舍（缺数显0）|—|B-23|—|同质押章对应行；缺日频显 0.00%（不是「—」）|
|A-013|资产|Hub·Dock|LP/销毁债券卡：仓位 / 收益 / 年化收益率|读取展示|`bondApr=APR_EMPTY` 注释写明；仓位/profit 另展|无独立 APR 源|`bond_lp`/`bond_burn` + 链 profit|✅ 已对齐|设计取舍（缺数显0）|—|B-23|—|仓位金钱无线上样本对账；年化收益率空值不是过严；前端已接入；线上对账非本表判断标准|
|A-014|资产|Hub·Dock|X 挖矿卡：仓位 / 收益 / 年化收益率|读取展示|Hub claimable **不含** X pending；卡上 yield 单独 X；APR=`yieldRateBP`|手册 §15|`stake_x_pool`|✅ 已对齐|设计取舍（缺数显0）|—|B-20 · B-23|—|算法已收口；前端已接入；线上对账非本表判断标准|
|A-015|资产|Hub·分布|持仓分布图|读取展示|`buildHoldingsDistributionView`|四模式 `positionUsd`|`/assets/holdings-distribution`|✅ 已对齐|设计取舍（缺数显0）|—|—|—|空态接线保留；前端已接入；线上对账非本表判断标准|
|A-016|资产|Hub·复利增发卡|复利周期 / 每日次数文案|读取展示|`hub.rebase.steps` 用 `{blocks}/{hours}/{timesPerDay}`|链 `epoch().length`（共享 stakingHubOverview）|—|✅ 已对齐|—|—|C-14|C-14|文案 {blocks}/{hours}/{timesPerDay}←stakingHubOverview.epochLength（共享既有 query）；产品确认跟链|
|A-017|资产|Hub·FAQ|「钱包闲置余额不计入」|读取展示|FAQ Visible；Hub=`stake_invest_usd_value` 仓位估值，不计钱包 `balanceOf`|产品 FAQ；余额见 host 弹窗/非本 tab|—|✅ 已对齐|—|—|A-048|—|闲置余额断言独立于 A-001「含未提取收益」；金额口径由 A-001/A-054 自担|
|A-018|资产|Hub·FAQ|收益形式：gAGX / X|读取展示|Hub FAQ：「Rebase 以 gAGX 计量；X 挖矿为 X」；未写「可直接挖 X」|链 Mixed→队列（多为 AGX）；Xmine→X|—|✅ 已对齐|—|—|C-02 · C-08 旁|C-02|产品确认保留稿面（B 口径）；非接线错|
|A-019|资产|Hub·FAQ|领取后进奖励队列 / 释放池|读取展示|FAQ 文案|手册 Mixed / RewardQueue|—|✅ 已对齐|—|—|—|—|—|
|A-020|资产|Hub·FAQ|缓冲池 AGX / gAGX|读取展示|FAQ + UI 切换|手册 §13|—|✅ 已对齐|—|—|—|—|—|
|A-021|资产|Position·质押|仓位列表字段（本金 / 已释放角标 / 收益 / 加成）|读取展示|活期 `releasedPrincipal` 恒 `0n`（链无线性 released，非读错）；定期 `getReleasedPrincipal`；warmup 行独立|Locked `getReleasedPrincipal`；liquid 无对等|—|✅ 已对齐|—|—|B-12 · A-08|**open**|活期已释放恒 0；角标仅在已释放>0 时显示 → 活期永不显；统计已排除活期。口径钉「活期无已释放角标」|
|A-022|资产|Position·质押·统计|我的持仓 / 已释放 / 待释放 / 复利增发 / 加成 / 总收益|读取展示|`aggregateStakeRelease`+`useAssetsPositionStats`：liquid 不进已释放/待释放；locked 保持公式；持仓仍含 liquid 本金|同上|—|✅ 已对齐|—|—|B-12|open→closed|与质押章同 helper；单测钉口径|
|A-023|资产|Position·质押|混合领取（弹窗 + 发起链上交易）|提交·前置检查|`submitMixedClaim` dual-check + legs；`canClaim=!warmup&&reward>0`（已关测试期放开）；`invalidateAfterAssetsClaim`→assets/staking/**release**|手册 §9 Mixed|—|✅ 已对齐|—|—|—|B-37|无利息禁用领取；弹窗金额同源区块奖+额外利息|
|A-024|资产|Position·质押|本金赎回（活期全额 / 定期可赎）|提交·前置检查|`submitStakeRedeem` warmup 禁；确认弹窗天数=`effectiveDuration`|手册 §8 / §13；live `readStakeRedeemableAmount`|—|✅ 已对齐|—|—|—|—|—|
|A-025|资产|Position·质押|激活活期预热|提交|`submitLiquidWarmupClaim`；成功 refetch stake|手册 LiquidStaking `claim()`|—|✅ 已对齐|—|—|—|—|—|
|A-026|资产|Position·质押|操作记录|读取展示|`useAssetsPositionOpsRows` + sessionReady|—|`/stake-flow/logs`|✅ 已对齐|—|—|—|—|—|
|A-027|资产|Position·质押·FAQ|领取 vs 赎回 / 已释放含义|读取展示|`products.stake.faq`|手册|—|✅ 已对齐|—|—|—|—|—|
|A-028|资产|Position·质押|EarlyStaking 仓位|读取展示|`readStakePositions` 仅 liquid+180/360/540；无 Early；FE 无 Early ABI|手册 §8.4 EarlyStaking|—|🚫 阻塞|前端缺接线|解阻 B-19 后：补 Early 合约接口+读仓位+领本金/混合领取界面|B-19|blocker|同质押/附录 Early 三连阻塞；禁止伪造线上样本|
|A-029|资产|Position·LP债券|仓位卡：本金 / 待赎 / 收益|读取展示|`readLpBondPositions`；profit 展示后缀 gAGX|手册 §10；链 profit 入队多为 AGX|—|✅ 已对齐|—|—|C-02|C-02|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|A-030|资产|Position·LP债券|混合领取 / 本金赎回|提交·前置检查|dual-check + `pendingPayoutFor` live|手册 §10|—|✅ 已对齐|—|—|—|—|—|
|A-031|资产|Position·LP·统计|「LP 债券总收益」累计|读取展示|末格现行 `'—'`；无累计源不硬编|—|无累计 API/链视图|✅ 已对齐|—|—|—|—|无源显示「—」（不是金额假零）；不是前端读源缺口|
|A-032|资产|Position·LP·FAQ|复投周期「360/540」、缓冲「30 天」|读取展示|FAQ `{restakeDays}`←`readClaimPlans`；`{days}`←`usePrincipalReleaseDurationDays`（与领取/赎回 UI 同源）|链 plans / Manager.duration|—|✅ 已对齐|—|—|C-13|C-13|文案数值跟链；本金周期 180/360/540 句未改；产品确认跟链|
|A-033|资产|Position·销毁债券|读取仓位 + 混合领取/赎回提交 + 流水|读取展示/提交|与 LP 对称 `readBurnBondPositions`；profit 后缀 gAGX|同 LP · BurnBond|bond-flow burn|✅ 已对齐|—|—|C-02|C-02|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|A-034|资产|Position·销毁·FAQ|同 LP 结构 + 销毁叙事|读取展示|与 A-032 同：`{restakeDays}`←claimPlans；`{days}`←effectiveDuration|手册 BurnBond · plans/duration|—|✅ 已对齐|—|—|C-13|C-13|数值跟链；本金 180/360/540 句未改|
|A-035|资产|Xmine·仓位|挖矿仓位 / 待领 / 预热|读取展示|不把 miningStake 冒充已释放；`readXminePosition`|手册 §15 `readXminePosition`|—|✅ 已对齐|设计取舍（缺数显0）|—|B-24|—|算法已收口；前端已接入；线上对账非本表判断标准|
|A-036|资产|Xmine·统计|「已释放」格|读取展示|代码 `released=0n` + 注释|无 PRV 映射字段|—|✅ 已对齐|设计取舍（缺数显0）|—|A-15 · A-16|—|固定 0 ≠ 诚实空；口径：未取到显 0（视为正确）|
|A-037|资产|Xmine·统计|挖矿总产出（终身）|读取展示|`useX0MiningLifetimeReward` 翻页累加|无协议累计 view|`/x0-mining/logs` REWARD|✅ 已对齐|设计取舍（缺数显0）|—|B-17|—|翻页算法已收口；前端已接入；线上对账非本表判断标准|
|A-038|资产|Xmine|领取 X / 激活预热 / 解押|提交·前置检查|`submitXmine*` + `invalidateAfterAssetsClaim`|手册 XStakingPool；dual-check|—|✅ 已对齐|—|—|—|—|—|
|A-039|资产|Xmine·FAQ|「24 小时锁定」|读取展示|FAQ 断言 24h；UI 有激活预热|链 warmupEndTime；须 `activateWarmup`|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-03|open|可见文案跟稿，张力进改稿队列|
|A-040|资产|Xmine·FAQ|「每日 UTC 0 点结算」|读取展示|FAQ Visible|链连续计息 / settle|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留；不要前端擅自改|C-13|open|可见文案跟稿，张力进改稿队列|
|A-041|资产|Claim modal|释放 / 复投比例与计划|读取展示|`readClaimPlans`；默认 release 60 / restake 540|链 RewardQueue plans|—|✅ 已对齐|—|—|—|—|—|
|A-042|资产|Claim modal|贡献不足前置检查 + 前往销毁|提交·前置检查|CTA `contributionOk && plansOk`；写内 dual-check 再闸|链 quote vs userContribution|—|✅ 已对齐|—|—|A-11|A-11|「1:1」文案见 A-006|
|A-043|资产|Claim modal|确认混合领取提交 + 刷新|提交|`invalidateAfterAssetsClaim` 含 **release** tab|手册 §9|—|✅ 已对齐|—|—|B-37|closed→✅|—|
|A-044|资产|Redeem confirm|释放天数文案|读取展示|`usePrincipalReleaseDurationDays`；默认 30|Manager `effectiveDuration`|—|✅ 已对齐|—|—|—|—|—|
|A-045|资产|Redeem confirm|确认赎回写|提交|live 重读可赎金额 `evaluateRedeem`|手册 claimPrincipal / bond redeem|—|✅ 已对齐|—|—|—|—|—|
|A-046|资产|Hub / 接口|登录优先接口，缺则链回退|读取展示|session+apiReady：overview/summary/dist 走 API；yield/APR/可赎等无同口径仍链|`assetsHubNeedsChainFallback`|assets summary/dist|✅ 已对齐|—|—|B-21|closed→✅|符合读源优先|
|A-047|资产|全表面|收益/利润单位标 gAGX|读取展示|仓位/Hub/弹窗金额单位 gAGX|链多为 AGX 入队|部分 API 亦标 gAGX|✅ 已对齐|—|—|C-02 · A-07|open|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|A-048|资产|（对照手册资产章）|AGX/gAGX/X/USD1/XX 钱包余额展示|读取展示|现行 assets=仓位 Hub；FAQ 声明不计闲置；钱包弹窗仅 USD1|手册 §4.3|—|⚪ 不适用|—|—|—|—|产品形态≠手册「钱包资产页」（设计取舍）|
|A-049|资产|（对照手册资产章）|资产页全量授权|提交|无全量 approve；业务按钮各自检查|手册 §4.4 不建议|—|⚪ 不适用|—|—|—|—|符合手册交互（设计取舍）|
|A-050|资产|（对照手册资产章）|迁移：是否旧账户 / 规范账户|读取展示|assets 袋无迁移提示；迁移 UI 超出 Figma|AccountMigrationManager；staking 侧有闸|—|🚫 阻塞|前端缺接线|等迁移页产品/稿解阻；或宿主级轻提示|—|—|可挂宿主/迁移债；不是「漏接可立刻修」|
|A-051|资产|Hub·总览|未连接 / 接口加载中的零值占位|读取展示|`zeroOverview`；DockConnectPromo|产品空态|—|✅ 已对齐|—|—|—|—|缺数/未连接显示 0（设计）|
|A-052|资产|Hub·可领|未登录可领是否含 X|读取展示|`claimableGagxWei` 不含 `xPending`|产品|—|✅ 已对齐|—|—|B-20|closed→✅|—|
|A-053|资产|Position·活期|「已释放」角标|读取展示|`badgeVisible={releasedPrincipal>0}` → 活期永不显示|链无线性 released|—|✅ 已对齐|设计取舍（故意空/0）|—|B-12|open|同 A-021：活期不显「已释放」角标=镜像链；与「随时可赎」并存属产品叙事，不是读错|
|A-054|资产|Hub 金钱字段|线上链/接口金额对账|读取展示|无样本地址对账|L 杠（金钱须 Prod 只读）|相关 Hub 字段|✅ 已对齐|—|—|—|—|金钱伞行；字段行已各自处理；前端已接入；线上对账非本表判断标准|
|A-055|资产|接口持仓摘要|「总已释放 AGX」字段|读取展示|FE 故意不用；用链可赎|API=缓冲已提+CLAIM_PRINCIPAL|`total_released_agx`|⚪ 不适用|—|—|A-14|—|正确规避同名不同义（设计取舍）|
|A-056|资产|Claim 展示额|弹窗金额单位 gAGX|读取展示|`amountLabel` 后缀 gAGX|链 reward/profit wei|—|✅ 已对齐|—|—|C-02|—|标签 gAGX；数源 AGX/API 回退（B）；产品确认；前端已对齐|
|A-057|资产|Xmine FAQ / 上限|可质押上限叙事|读取展示|FAQ 有文案；assets 袋无上限 Num（在 staking xmine）|手册 X 挖矿上限|—|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐挖矿配额公式，或产品确认保留简化叙事；不要前端擅自改|—|—|质押侧数字走挖矿配额（正确）。线上最大质押比率=100%。手册=Early+三定期+三 LP+三销毁锁定本金×比率；FAQ 写「≥180 天债券+AGX 质押总量」过简（活期不计入）。上限数字在质押 X 挖矿|
|A-058|资产|Hub 年化收益率提示|年化收益率提示文案（未提取收益）|读取展示|Dock Tooltip；与卡上 yield 对齐|产品|—|✅ 已对齐|—|—|—|—|—|
|A-059|资产|Position·质押·领取流程|「领取产出」中间层（收益 / 加成分入口）再进 Mixed|读取展示/提交|仓位「领取」→`AssetsClaimOutputModal`（0 禁用对应 CTA）→单腿 `AssetsClaimModal`；卡上收益=`blockReward`、加成=`extraInterest`|Figma Copy `4848:264`；主仓验收 `4781:3137`；手册 Locked Mixed 两腿|—|✅ 已对齐|—|—|—|closed|复投在第二步 Mixed。赎回浅色贴稿见 A-044/A-045（`AssetsRedeemConfirm` + `InlineAlert` notice）|

---

## 7. 社区（CM-）

本表这一章讲的是：**社区 Tab**（侧栏绑定推荐人、邀请链接、右侧成员与业绩统计、生态支持与常见问题）。
更细的对照目录见研究索引 §7；实现主要落在社区相关页面。
**对照源指针：** [`research/dapp-tab-source-index.md` §7](./research/dapp-tab-source-index.md#7-community)  
**代码根：** `src/views/dapp/community/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|CM-001|社区|侧栏·绑定状态|是否已经绑定推荐人|读取展示|`use-referral.ts`→`readIsBindReferral`；`walletReady` 即可|手册 §5 `isBindReferral`；legacy §2|—（纯链）|✅ 已对齐|—|—|—|—|不要求签名登录|
|CM-002|社区|侧栏·已绑定面板|推荐人地址怎么展示|读取展示|`displayReferrer`（链 `readReferrer` 优先，缺则 API）；`usePerformance(sessionReady)`|手册 §5 `getReferral`；legacy §2|POST /performance（`invite_address`）|✅ 已对齐|—|—|B-30|B-30 closed|代码注释已写「链优先」；类型上旧注「接口优先」过时，不是取数 bug|
|CM-003|社区|侧栏·邀请链接（展示）|展示成「站点/r/短码」这种样子|读取展示|`shared.tsx` `formatReferralLinkDisplay`；仓内无 `/r/` 路由|产品展示形态（≠绑定入口）|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|C-19|C-19|用户照抄展示串建不成推荐；真路径见 CM-004；跟稿张力进改稿队列|
|CM-004|社区|侧栏·复制邀请链接|复制到剪贴板的真实网址|提交|`use-community.ts`：`getRuntimeOrigin()+pathname+referralSharePath(addr)`|FE 约定 `?ref=`（`referral.ts`）|—（纯 UI）|✅ 已对齐|—|—|C-19（对照）|C-19|和展示形态分叉；复制路径是对的|
|CM-005|社区|侧栏·绑定输入预填|从网址或本地暂存里预填推荐人|读取展示|`parseReferrerFromSearch`→`PENDING_REFERRER_KEY`；仅预填|FE `?ref=`；手册 §5 须显式 `bindReferral`|—（纯 UI）|✅ 已对齐|—|—|—|—|不会自动发起链上交易|
|CM-006|社区|侧栏·绑定按钮|能不能点绑定（前置检查）|读取展示|`use-referral.ts`：须 `isFetched`∧¬loading∧未绑∧有输入|手册 §5 绑定前置|—（纯链）|✅ 已对齐|—|—|B-38|B-38 closed|父节点是否合法在提交前再预检|
|CM-007|社区|侧栏·绑定|提交绑定推荐人|提交|`isReferralParentAllowed`（已绑或 root）；`WRITE_PATH.REFERRAL_BIND`；自荐/非法软错|手册 §5 `bindReferral`；legacy §2|—（纯链）|✅ 已对齐|—|—|—|—|冷却约 5 秒；结果未知则锁路径|
|CM-008|社区|侧栏·绑定成功后|刷新相关页面数据|提交|`invalidateAfterReferralBind`→community 桶（`chain.referral`+team/performance）|FE invalidate 约定|—（纯 UI）|✅ 已对齐|—|—|—|—|成员表仍要等 indexer|
|CM-009|社区|侧栏·未连接|未连钱包时隐藏绑定与链接，只留外链和「去连接」|读取展示|`dock.tsx` `CommunityDisconnectedDock`|UI 基线（已实现）|—（纯 UI）|✅ 已对齐|—|—|—|—|与右侧详情一致：不假装有成员|
|CM-010|社区|右侧·统计卡|直推人数|读取展示|`detail.tsx`←`useTeamOverview`|API 一期 team；读源优先 overview|POST /team/overview|✅ 已对齐|—|—|—|—|采纳接口；链上直推计数没展不算缺口|
|CM-011|社区|右侧·统计卡|直推业绩（带 `$`）|读取展示|`formatNumber(...,{prefix:'$'})`+`volumePrefix`|API 一期 team（金钱）|POST /team/overview|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线正确；金钱样本未对账；前端接入证；生产对账非本矩阵判断标准|
|CM-012|社区|右侧·统计卡|社区人数（下级总数）|读取展示|overview；叙源 `referral_ancestors` 全下级|API 一期 team|POST /team/overview|✅ 已对齐|—|—|—|—|链上没有廉价等价字段；采纳接口|
|CM-013|社区|右侧·统计卡|社区业绩（带 `$`）|读取展示|同 CM-011 展示前缀|API 一期 team（金钱）|POST /team/overview|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线正确；金钱样本未对账；前端接入证；生产对账非本矩阵判断标准|
|CM-014|社区|右侧·统计卡|共建等级（创世 S*）|读取展示|`useShareholderRank`→`displayPresaleRank(performance.presale_rank)`；**不用** `making_rank`|手册 §6 预售等级；API performance|POST /performance（`presale_rank`）|✅ 已对齐|—|—|—|—|未登录 / 未签名登录显示 S0；注释有硬约束|
|CM-015|社区|右侧·统计卡|「今日新增」四字段|读取展示|Detail 注释无「今日」行；i18n `statToday` 未接线|API 类型有字段；产品未展|POST /team/overview（未消费）|⚪ 不适用|设计取舍（故意空/0）|—|—|—|能力在接口，产品没展|
|CM-016|社区|右侧·统计卡|已连钱包但未签名登录时的数值|读取展示|`walletReady&&!sessionReady`→不请求 overview，卡面 **0/S0**；表走 Auth 空态|连接≠登录（AGENTS）；UI 门闸|—（纯 UI）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|不是加载骨架；口径：没取到就显 0（视为正确）|
|CM-017|社区|右侧·成员标题|「我的社区成员（人数）」|读取展示|`direct_referral_count ?? referrals.total`；未登录固定 0|API overview/referrals|POST /team/overview · POST /team/referrals|✅ 已对齐|—|—|—|—|同源采纳接口|
|CM-018|社区|右侧·成员表|加入时间|读取展示|`mapTeamReferralToCompactRow`→`formatRegisterDate`|API 一期 referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-019|社区|右侧·成员表|地址|读取展示|`ExplorerLink`←`item.address`|API 一期 referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-020|社区|右侧·成员表|列名「参与共建」实际对的是个人认购额（带 `$`）|读取展示|表头 i18n `shareholder`=「参与共建」对个人认购额（有 `$`）；`mapTeamReferralToCompactRow`|文案 SSOT i18n；API referrals|POST /team/referrals|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|—|本行只记标签语义；金额数字见 CM-033；跟稿张力进改稿队列|
|CM-021|社区|右侧·成员表|共建等级|读取展示|`formatTableGenesisRank`（缺/0→`-`）|API referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-022|社区|右侧·成员表|直推人数|读取展示|行内人数|API referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-023|社区|右侧·成员表|列「社区业绩」对团队市场业绩字段|读取展示|`mapTeamReferralToCompactRow`：**无 `$`**（概览卡有 `$`）|文案/展示一致性；API referrals|POST /team/referrals|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|—|同字段两边展示不一致；跟稿张力进改稿队列|
|CM-024|社区|右侧·成员表|分页总数与页码|读取展示|`Table.Pagination`；`keepPreviousData`|API Paginated|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-025|社区|右侧·成员表|未登录时的需登录空态|读取展示|`dappTableViewState`+`WalletConnectChip`|连接≠登录；UI 基线|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|CM-026|社区|右侧·邀请引导|三步文案（分享 / 共建 / 奖励）|读取展示|`inviteFlow`「链接注册后即可」；真路径=连钱包+显式绑定|i18n Copy；手册 §5|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|—|可见文案跟稿；张力进改稿队列|
|CM-027|社区|右侧·生态支持|创世期数（第几季）|读取展示|`useGenesisPromoChrome().activeSeasonNumber` 填 program label；无活期时 store/`GenesisPromoSync` **回退 1**（同 H-019）|手册 §6 / Genesis promo（H-019 同源）|—（纯链）|✅ 已对齐|设计取舍（故意空/0）|—|← H-019|—|跟 H-019：无活期回退季号 1 产品已确认；同源壳层|
|CM-028|社区|右侧·生态支持|Notion 等外链按钮|读取展示|`program.href`；无链上数|静态配置 / i18n|—（纯 UI）|⚪ 不适用|—|—|—|—|—|
|CM-029|社区|右侧·常见问题|写「邀请关系…自动建立且永久」|读取展示|FAQ；链须 `bindReferral`，链接仅预填|i18n FAQ vs 手册 §5|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|建议新 C|一经绑定则永久为真；跟稿张力进改稿队列|
|CM-030|社区|右侧·常见问题|写「创世推荐奖励 3%…压缩」|读取展示|i18n FAQ；本页无金额 Num；`RewardLogItem.order_amount` 注 `floor(amount/0.03)`|i18n；`src/shared/api/types/community.ts`（非 api.md）|—（纯 UI）|✅ 已对齐|—|—|—|—|静态比率文案 ≠ 展示金钱；领取归奖励章|
|CM-031|社区|右侧·常见问题|写「S1 至 S10」晋升|读取展示|与 `MAX_PRESALE_RANK=10` / `formatPresaleRank` 一致|i18n FAQ；`core/presale/rank`|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|CM-032|社区|侧栏·快捷外链|文档 / YouTube 等|读取展示|`communityQuickLinkItems`|静态 `community-links.ts`|—（纯 UI）|⚪ 不适用|—|—|—|—|—|
|CM-033|社区|右侧·成员表|行内个人认购额（带 `$` 的数字）|读取展示|`mapTeamReferralToCompactRow`→`formatNumber(volume,{prefix:'$'})`；非 overview 聚合|API 一期 referrals（金钱）|POST /team/referrals|✅ 已对齐|设计取舍（缺数显0）|—|—|—|与 CM-011 的直推业绩字段不同；标签债仍见 CM-020；前端接入证；生产对账非本矩阵判断标准|

---

## 8. 共建（GN-）

本表这一章讲的是：**共建 / 预售 Tab**（侧栏季卡与认购清单、右侧全球进度与贡献表、常见问题，以及购买写路径）。
更细的对照目录见研究索引 §8；实现主要落在共建相关页面（不要和奖励里的创世领取搞混）。
**对照源指针：** [`research/dapp-tab-source-index.md` §8](./research/dapp-tab-source-index.md#8-genesis共建--预售)  
**代码根：** `src/views/dapp/genesis/`（勿与 `rewards/genesis` 混淆）

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|GN-001|共建|侧栏·季卡轮播|全部阶段（名称 / LIVE·Ended·Upcoming）|读取展示|`readAllPresalePhases`→`seasonOptionsFromPhases`→`GenesisSeasonCarousel`；骨架仅 `isLoading&&length===0`|手册 §6.3 `getPhaseCount`+`phases`|—（纯链）|🟡 稿链不符|稿有 Ended 季卡；生产 `getPhaseCount=0`（2026-08-08 eth_call）无季可展|前端：空且非加载中不要永驻骨架（已修）；要复现季卡须链上有阶段，或改稿说明清档|—|—|稿「已结束」仍画阶段卡；链清空 ≠ 稿面；「程序已结束」判断对空列表为真，逻辑正确|
|GN-002|共建|侧栏·季卡|阶段折扣百分比|读取展示|`SeasonCard` meta + dock intro via promo store|手册 §6.3 `phases.discount`|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-003|共建|侧栏·季卡|阶段空投比例|读取展示|`desktopMeta.airdrop` `+N%`/`—`|手册 §6.3|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-004|共建|侧栏·季卡|阶段起止日期|读取展示|`formatPhaseDateRange`→季卡 `date`|手册 §6.3 `startTime`/`endTime`|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-005|共建|侧栏·季卡|折后参考价「≈ $x」|读取展示|`seasonOptions.price` 已算；`primitives-season.tsx` `SeasonCard` **不渲染** `price`|手册 §6.3 展示字段|—（纯链）|⚪ 不适用|—|—|—|—|稿无季卡折后价控件；代码有、界面无属未要求能力；等改稿再接或删字段|
|GN-006|共建|侧栏字幕|进行中期号 + 折扣介绍|读取展示|`formatGenesisSeasonIntro`←`activeSeasonNumber`+`discountLabel`；折扣无活期→`—`；**季号无活期回退 1**（`GenesisPromoSync`）|手册 §6 活动阶段|—（纯链）|✅ 已对齐|设计取舍（故意空/0）|—|← H-019|—|跟 H-019：季号回退 1 已通过；折扣空态仍诚实（同 H-020）|
|GN-007|共建|侧栏·份额标签|1 份 = 最少认购额（USD1）；最大份数|读取展示|`shares` 插值 `formatTokenAmount(minAmount)`+`genesisMaxShares`；`sharePriceWei`=`minAmount`|手册 §6.4 `BASE_UNIT`/`minAmount`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|展示金钱（与 GN-008 同源）；接线在；样本未对账；前端接入证；生产对账非本矩阵判断标准|
|GN-008|共建|侧栏·清单|「本期共建额度」最小–最大|读取展示|`quotaLabel`（`genesisPurchaseSummary`）←phase `minAmount`/`maxAmount`|手册 §6.3 `minAmount`/`maxAmount`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；金钱样本未对账（同 CM-011 口径）；前端接入证；生产对账非本矩阵判断标准|
|GN-009|共建|侧栏·清单|「支付」USD1 金额|读取展示|`payUsd1Label`=`shares×sharePriceWei(minAmount)`|手册 §6.4|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；金钱样本未对账；前端接入证；生产对账非本矩阵判断标准|
|GN-010|共建|侧栏·清单|「将获得 AGX」估算|读取展示|`estimateAgxFromUsd1` 已接线展示；Prod 无活期阶段未对拍购后记账|展示估算（非链 getter）|—（纯链）|✅ 已对齐|—|—|—|—|接线在；金额样本未对账；前端接入证；生产对账非本矩阵判断标准|
|GN-011|共建|侧栏·清单|「认购价值」美元|读取展示|`estimateContributionValueUsd`=`amount/(1−discount)`，非链 getter|产品公式（无同名链字段）|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|—|数已展；标签 ≠ 链上 AGX；跟稿张力进改稿队列|
|GN-012|共建|侧栏·清单|「将获得 X 初始空投价值」|读取展示|`usePresalePreviewAirdropValueQuery`→`addedAirdropValue`|手册 §6 `previewAirdropValue`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；0 显示成 `$0`；金额样本未对账（旁系 GN-010）；前端接入证；生产对账非本矩阵判断标准|
|GN-013|共建|侧栏·空投提示|门槛文案「单期累计 ≥ {门槛}」|读取展示|`use-genesis-dock`：loading/null 仍插 `—`；产品缺数宜 0|手册/legacy 门槛；i18n `xTokenAirdropHint`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|← B-42|B-42|对齐为 0 属展示收口；口径：没取到就显 0（视为正确）|
|GN-014|共建|侧栏·空投门槛数值|链上空投门槛常量|读取展示|`readPresaleAirdropThresholdWei`→`presaleAirdropThresholdToUsd`；无硬编码|ABI `AIRDROP_THRESHOLD`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线实时状态；前版「生产 cast / 样本」无本轮证据→降级；前端接入证；生产对账非本矩阵判断标准|
|GN-015|共建|右侧·全球卡|全球已购总量|读取展示|`usePresaleTotalPurchasedQuery`←`readTotalPresalePurchased`；loading Skeleton|手册 §6.3|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；前版「生产=0」无本轮证据→降级；前端接入证；生产对账非本矩阵判断标准|
|GN-016|共建|右侧·进度头|「本期共建」当前 / 上限|读取展示|`userPhaseAmountCurrent` / `seasonContributionMaxWei`（limit>0?limit:maxAmount）|手册 `getUserPhaseRemainingAmount`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；须钱包；迁移根见 GN-037；金钱样本未对账；前端接入证；生产对账非本矩阵判断标准|
|GN-017|共建|右侧·页脚|「累计共建」用户累计额|读取展示|`usePresaleUserTotalQuery`←`readUserPresaleTotal`(migration root)→footer `$`|手册 `userTotalAmount(root)`|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|接线在；金钱样本未对账；前端接入证；生产对账非本矩阵判断标准|
|GN-018|共建|右侧·贡献表|销售日志分页行（含 `$` 金额）|读取展示|`useSalesLogs`+`sessionReady`；`mapSalesLogToDesktopRow` 展 `amount` 为 `$`；未登录 Auth 槽|API 一期 sales|POST /sales/logs|✅ 已对齐|设计取舍（缺数显0）|—|—|—|判断标准对齐；行内金钱样本未对账（同 CM-011）；前端接入证；生产对账非本矩阵判断标准|
|GN-019|共建|右侧·贡献表|行内「预计 AGX」|读取展示|`formatSalesLogAgx`：优先 `item.tokens`，否则 `estimateAgxFromUsd1`（无「预估」后缀）|API tokens 或 FE 回退估算|POST /sales/logs（`tokens`）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|—|回退未标注；不是缺接线；跟稿张力进改稿队列|
|GN-020|共建|右侧·贡献表|行内折扣|读取展示|`phaseDiscountBps`+`formatDiscountBps`←链 phases|手册 `phases[phase_id].discount`|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-021|共建|右侧·同步提示|链上有累计、接口表还空|读取展示|`userTotal>0&&rows==0`→`contributionsSyncPending`；购后 `pollGenesisContributions`|产品同步态|POST /sales/logs|✅ 已对齐|—|—|—|—|—|
|GN-022|共建|常见问题|阶段数 / 折扣 / 额度 / 最少美元 / 份额步进 / 空投比例 / 门槛等插值|读取展示|`genesisFaqTemplateValues` 填入 FAQ（`threshold`←同 GN-014；`minUsd`/`phaseQuotas`←phases）|手册 §6 phases|—（纯链）|✅ 已对齐|设计取舍（缺数显0）|—|← GN-014|—|接线在；插值金钱无生产样本→跟 GN-014 降级；阶段天数见 Z-016；前端接入证；生产对账非本矩阵判断标准|
|GN-023|共建|常见问题|空投资格写「单账户累计」vs 提示/链「单期累计」|读取展示|zh FAQ「单账户累计」；hint「单期累计」；链 per-phase|手册：单档/单期累计超门槛|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|C-10|C-10|已确认：文案接错口径 ≠ 未接入；跟稿张力进改稿队列|
|GN-024|共建|常见问题|写「X 空投 12 月线性释放 / 合约自动」|读取展示|FAQ 承诺释放；FE 无 `claimAirdrop` 入口（GN-041 正确未接）|产品：空投仅价值统计|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|C-11|C-11|已确认：文案错 ≠ 能力未接；能力见 GN-041 ✅；跟稿张力进改稿队列|
|GN-025|共建|常见问题 / 错误文案|「100 USD」倍数说法|读取展示|`errors.invalidAmount`「100 USD」；份额标签已写 USD1|`BASE_UNIT=100e18` **USD1**|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|C-12|C-12|已确认：错误已展；接错单位 ≠ 未接入；跟稿张力进改稿队列|
|GN-026|共建|常见问题|写「AGX 540 天释放周期」|读取展示|无 Genesis 侧释放/领取接线；purchase 不转入钱包 AGX|购后记账≠本页可领|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|—|建议新 C|已确认：文案已接线；勿暗示本页可领；跟稿张力进改稿队列|
|GN-027|共建|侧栏|阶段倒计时数字（开始/结束还有多久）|读取展示|`useGenesisCountdownClock` 写入 session；`GenesisPurchaseForm` **无消费**；i18n 有 `startsIn`/`endsIn`|手册 `startTime`/`endTime`|—（纯链）|⚪ 不适用|—|—|—|—|稿无倒计时控件；时钟只服务阶段切换后作废页面数据，可保留；等改稿再展示|
|GN-028|共建|侧栏|AGX 开盘参考价展示|读取展示|`referencePriceLabel` 已组装（`agxPriceUsd`；缺价→`$0.00`）；i18n `referencePrice`；Dock/`FormInfoCard` **未渲染**|手册 `agxPrice()`|—（纯链）|⚪ 不适用|—|—|—|—|稿无开盘参考价行；标签未挂属未要求能力；等改稿再接或删文案；同 GN-005：代码有界面无 ≠ 部分对齐；接上后须禁止缺价造 `$0`；禁假生产价|
|GN-029|共建|侧栏|USD1 余额展示|读取展示|`usd1Balance` 参与 maxShares/门闸；`usd1BalanceLabel` 无 UI|ERC20 `balanceOf`；手册 §4/§6|—（纯链）|⚪ 不适用|—|—|—|—|稿无 USD1 余额展示行；余额只做前置检查合法；等改稿再展示或删标签|
|GN-030|共建|侧栏|合约是否暂停（前置检查）|读取展示|`isPaused`/`isPausedUnknown`→`canPurchase` false；购前 live 重读|手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|跟实时暂停状态；本轮未重跑生产|
|GN-031|共建|侧栏主按钮|推荐未绑定 → 去绑定|读取展示·提交前置检查|`needsReferralBind` 换 CTA；mutation 亦拦；`goBindReferral`|手册 `PreSaleUserNotBound` / §5|—（纯链）|✅ 已对齐|—|—|—|—|绑定界面在社区|
|GN-032|共建|侧栏主按钮|程序结束 / 即将开始|读取展示|`isGenesisProgramEnded`；结束 CTA=`MainButton primary disabled`（稿即 primary 禁用）；`seasonUpcoming` label|手册 phases 生命周期；Figma `4303:406`|—（纯链）|✅ 已对齐|—|—|—|—|曾误用次要样式；已改主要+禁用；生产阶段数=0 → 视为程序结束|
|GN-033|共建|写·授权|授权 USD1 给预售合约|提交|`approveUsd1ForPresaleIfNeeded` 合入购买 mutation|手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|没有独立「授权」按钮|
|GN-034|共建|写·购买|提交购买（阶段下标 + 金额）|提交|`purchasePresale`；`WRITE_PATH.GENESIS`；前置 bound/paused/active/额度|手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|未真发交易；写路径接线完整|
|GN-035|共建|写·授权后重闸|提交前再查：绑定 / 暂停 / 阶段 + 用户剩余|提交前置检查|`fetchLiveGenesisPostApprove`+balance/allowance 重读|AGENTS 写链；手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-036|共建|写·成功后刷新|链查询 + 销售日志轮询|提交刷新|`invalidateAfterGenesisPurchase` 乐观累加+`pollGenesisContributions`|手册成功后刷新表|POST /sales/logs|✅ 已对齐|—|—|—|—|—|
|GN-037|共建|读·迁移|额度 / 累计按迁移根地址|读取展示|`readMigratedFrom`+`migrationStakeRoot` 于 userTotal/phase remaining|手册 presale 迁移 · §17|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-038|共建|面板|用户本期/累计空投价值汇总|读取展示|仅本次 `previewAirdropValue`（GN-012）；无累计空投 UI；`PRESALE_METHODS` 无此二 getter|稿/实现均未展累计空投面板|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|—|—|与 GN-012 不冲突：单笔预览 ≠ 累计面板；无合约接口说明|
|GN-039|共建|面板|累计应得 AGX（链汇总）|读取展示|仅当笔/行估算（GN-010/019）；无链累计 UI；`PRESALE_METHODS` 无 `userTotalAgx`|稿/实现均未展累计 AGX 汇总|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|—|—|与估算行不冲突；无合约接口说明片段|
|GN-040|共建|边界|团队奖签名领取|提交|UI 在 `rewards/genesis`；`invalidateAfterTeamClaim`|手册 RewardClaimer；legacy §4|POST /claim/team-reward 等（W- 章）|⚪ 不适用|—|—|—|—|归 **W-**；不要双计|
|GN-041|共建|边界|用户领取空投|读取/提交|FE 未实现；`PRESALE_METHODS` 无 claim 写方法|产品：空投仅价值统计（无站内领取）|—（纯链）|✅ 已对齐|—|—|—|—|合约接口说明无入口；与 GN-024 FAQ 文案冲突（C-11）|
|GN-042|共建|空态常见问题|没有任何阶段时 FAQ 怎么插值|读取展示|`ZERO_FAQ`：金额位 `$0`；`threshold` 仍 `—`（不读已加载门槛）|产品缺数=0 vs 诚实空|—（纯 UI）|✅ 已对齐|设计取舍（缺数显0）|—|—|—|金额 0 合法；门槛 — 同簇；口径：没取到就显 0（视为正确）|
|GN-043|共建|宿主角标（交叉）|侧栏 / 社区壳层的季号与折扣|读取展示|`useGenesisPromoChrome`；季号同源 **回退 1**（H-019）；折扣空→`—`（H-020）|同 phases/`agxPrice`|—（纯链）|✅ 已对齐|设计取舍（故意空/0）|—|← H-019|—|跟 H-019：交叉证明同源壳层；季号口径通过|

---

## 9. 代码反查附录（Z-）

本表这一章讲的是：**不是独立产品 Tab**，而是手册 / 合约接口说明 / 接口里有能力、主章却没落点，或跨章互相打架时的反查队列。
对照各主章行与 A/B/C 链；改主章后记得同步本附录。
**用途：** 手册/ABI/API 有能力但主章未落点、或跨章冲突的反查队列（非独立产品 tab）。  
**对照：** 各主章行 + A/B/C 链；改主章后同步本附录。

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Z-001|反查|早期质押|领本金 / 混合领收益 / 仓位界面|读取/提交|`abis.ts`/`contracts.ts`/`src/**` 均无 Early 符号（rg 空；codegraph 无节点）|手册 §8.4（B-19）|—（纯链）|🚫 阻塞|前端缺接线|解阻 B-19 后：先补 Early 合约接口说明与地址，再接资产/质押仓位与领本金/混合领取|S-067·A-028|blocker（B-19）|已确认阻塞三联：S-067·A-028·Z-001；源码无 Early；禁假生产|
|Z-002|反查|质押侧栏|剩余额度展示|读取展示|预检 `remainingQuota` 门闸用；Dock 未展示（S-019）|手册额度；产品未展|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|S-019|B-36|能力在前置检查，不在界面|
|Z-003|反查|gAGX 奖励相关|包装 / 赎回|读取/提交|`flash-exchange-write.ts` `wrapAgxFlashExchange` / `redeemGagxFlashExchange`；非 staking tab|手册 gagx；兑换闪兑|—（纯链）|✅ 已对齐|—|—|X-016|—|反查确认归兑换闪兑的 gAGX 对|
|Z-004|反查|奖励队列|单条领取已释放奖励|提交|FE 仅 `claimAllVestedRewards` 按档（L-042）|手册有单条；产品批量|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|L-042|—|产品用批量|
|Z-005|反查|连接后后台预热|推荐绑定 + 多币暖热|读取展示|`useConnectWarmPrefetch` / `prefetchConnectWarm`；无壳层展示|手册 §5；H-022|—（纯链）|✅ 已对齐|—|—|H-022|B-39|后台暖热不是界面|
|Z-006|反查|做市津贴可领 AGX 字段|资产中心未展示|读取展示|类型有字段；Hub 缩可领子集（A-011/A-003）|API reward-summary|POST …/reward-summary（未消费）|⚪ 不适用|设计取舍（故意空/0）|—|A-011|A-13|做市津贴在奖励|
|Z-007|反查|卖 X 路径|卖出 X 交易|提交|Hub→trade 预选 X→AGX；`TRADE_TOKEN_KEYS` 含 `x`（X-004/X-029）|Pancake path `[x,agx]` / 多跳|—|✅ 已对齐|—|—|X-004|A-02|产品已开；入仓手册 §7.1 旧 live 范围不改正文|
|Z-008|反查|邀请链接正本|真实 `?ref=` vs 展示 `/r/`|读取/提交|`formatReferralLinkDisplay` vs `referralSharePath`（CM-003/004）|产品展示 vs FE 约定|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|CM-003|C-19|冲突表；跟稿张力进改稿队列|
|Z-009|反查|常见问题·空投线性释放|无合约入口的断言|读取展示|genesis FAQ（GN-024）；手册无用户 `claimAirdrop`|新手册沉默领取|—（纯 UI）|📘 稿链文案|文案/单位与链不匹配（稿如此）|改设计稿和文案表对齐链，或产品确认保留稿面；不要前端擅自离稿改文案|GN-024|C-11|已确认：随 GN-024 文案接错口径；≠ 未接入；跟稿张力进改稿队列|
|Z-010|反查|DAO 混合未签预览|只读预览接口|读取展示|无未签只读接口；Hub 金额位故意 0（W-010）|产品设计；须签后 `/claim/dao-reward`|—（API 未提供预览）|⚪ 不适用|—|—|W-010|A-21|能力 N/A 保持不适用；已登录造 0 的缺口在 W-010|
|Z-011|反查|中心趋势图序列|历史序列|读取展示|公开 POST；无需登录（S-011/S-028）|protocol-market-stats|POST /protocol-market-stats/series|✅ 已对齐|—|—|S-011|A-18|—|
|Z-012|反查|中心还能持续多久|公式 / 字段|读取展示|UI `—` 诚实空（S-008）|无链/API 字段|—（未提供）|⚪ 不适用|链/手册/接口未提供|—|S-008|A-19|继承 A|
|Z-013|反查|下次发放|下次发放字段|读取展示|空态合法（rewards summary）|API 无可用下次发放|—（未提供）|⚪ 不适用|链/手册/接口未提供|—|—|A-20|继承 A|
|Z-014|反查|X 挖矿下次产出|字段|读取展示|固定 `—`（S-050）|无链/API 字段|—（未提供）|⚪ 不适用|链/手册/接口未提供|—|S-050|A-17|继承 A|
|Z-015|反查|缓冲接口可领字段|与链同口径的可领|读取展示|FE 信链分流器（A-009）；API 无同口径 claimable|手册 §13；A-16|—（API 无同口径）|⚪ 不适用|链/手册/接口未提供|—|A-009|A-16|正确避开口径坑|
|Z-016|反查|共建常见问题|阶段天数已算未插进文案|读取展示|`genesisFaqTemplateValues` 产出；zh FAQ 无 `{phaseDurationDays}`|手册 phases 时长|—（纯 UI）|⚪ 不适用|设计取舍（故意空/0）|—|GN-022|—|要展示就加 FAQ 句；否则可删字段（先删复杂度）|
|Z-017|反查|金额展示|代币金额格式化补零|读取展示|数字参默认 `trimZeros:false`（与 `formatNumber` 一致）；对象缺省仍 trim（草稿）|展示 SSOT `token-amount.ts`|—（纯 UI）|✅ 已对齐|—|—|—|—|修空态 `0.00`→加载后 `0`；单测钉 `0n,digits:2→0.00`|
