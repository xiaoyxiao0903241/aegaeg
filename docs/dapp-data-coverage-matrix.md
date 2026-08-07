# Dapp 数据覆盖矩阵

> **SSOT**：dapp 动态数据 / 写路径对齐的现行结论（覆盖证明 + 缺口队列）。
> 规则锁定：[`docs/decisions/dapp-data-coverage-matrix-wayfinder.md`](./decisions/dapp-data-coverage-matrix-wayfinder.md)
> 对照源目录：[`docs/research/dapp-tab-source-index.md`](./research/dapp-tab-source-index.md)
> 可读页：[`dapp-data-coverage-matrix.html`](./dapp-data-coverage-matrix.html)（改本文件后跑 `pnpm docs:matrix` 重生）

本文件只记**当前状态**。更新时重读最新手册 / API / 代码后改行；不保留过程史。
表行为精简 `|cell|` 写法，**禁止**按列宽对齐（Prettier 不格式化 `*.md`）。

## 规则

|项|值|
|---|---|
|范围|dapp 全功能；不含 home；宿主专章 = `host` + `views/dapp/shared`|
|盘点|UI+Code 双扫；动态位 = Num+Copy（Visible+FAQ）|
|粒度|读 = 字段级；写 = 动作级（门闸 / 预检 / 成功后刷新）|
|UI 基线|已实现 > Figma > HTML 原型|
|读源优先|**overview / summary** 与同页 **API 表聚合/标题** → 采纳 API；仅当字段无同口径 API、属链余额/仓位时才链优先；API 仅作无钱包回退|
|证据杠|金钱相关：Prod 只读核实后才可 `✅ 已对齐`；写路径不真发交易|
|完成门闩|Complete-known（允许 `🔍 待核实`，须写原因与下一步）|
|缺口|`状态` ≠ `✅ 已对齐` / `⚪ 不适用` 的行即现行缺口；缺口行 `修复方法` 必填|

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

`✅ 已对齐` · `❌ 未接入` · `🟡 部分` · `🔍 待核实` · `⚪ 不适用` · `🚫 阻塞`

### T1 归因

- 链/手册/API 未提供
- 手册或API与链不符
- 手册↔API打架
- FE 读源/算法/门闸/刷新错误
- FE 缺接线
- 文案/单位与链不匹配（稿如此）
- 设计取舍（故意空/0）
- 待核实

（`✅ 已对齐` / `⚪ 不适用` 行 T1 用 `—`；缺口行须填 `修复方法`。）

## 全局对照源

见 [`research/dapp-tab-source-index.md`](./research/dapp-tab-source-index.md)。

---

## 1. 宿主与公共壳（H-）

**对照源指针：** [`research/dapp-tab-source-index.md` §1](./research/dapp-tab-source-index.md#1-host--shared)  
**代码根：** `src/views/dapp/host/` · `src/views/dapp/shared/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|H-001|宿主|DappHost 窗口属性|`sessionReady`（`data-session-ready` / compact shadow）|读|`src/views/dapp/host/dapp-host.tsx`DappHost`；`src/core/auth/auth-machine.ts`deriveAuthState`（地址∩未过期 JWT）；`src/boot/startup/auth-provider.tsx`AuthProvider`|手册 §1.3；AGENTS「连接 ≠ 业务登录」|POST /auth/login|✅ 已对齐|—|—|—|—|连接 alone ≠ true；`shadow-window-compact` 跟 `!sessionReady`|
|H-002|宿主|AppBar / 全壳|connect ≠ login（`walletReady` vs `sessionReady` / `needsSignIn`）|读|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`WalletConnectChip`/`ConnectedWalletChip`；`src/views/dapp/host/app-bar.tsx`AppBarWalletActions`；`useDappHost`+`useAuth`|AGENTS「连接 ≠ 业务登录」；手册 §1.3|POST /auth/login|✅ 已对齐|—|—|—|—|仅 `walletReady&&sessionReady` 出地址胶囊|
|H-003|宿主|AppBar `AppBarWalletActions`|`needsSignIn` 文案门闸（Sign in vs Connect）|读|`src/views/dapp/host/app-bar.tsx`AppBarWalletActions`：`needsSignIn`→`signInRequired`/`connecting`；否则 `connectWallet`|AGENTS「连接 ≠ 业务登录」；手册 §1.3|POST /auth/login|✅ 已对齐|—|—|—|—|—|
|H-004|宿主|WalletConnectChip / AuthProvider|SIWE 签名 + `POST /auth/login` 换 JWT|写|`src/web3/auth/login-with-wallet.ts`loginWithWallet`；`src/boot/startup/auth-provider.tsx`AuthProvider`/`isLoginChainReady`；异网 idle+throw 不落 `loginError`；消息 `defaultChain.id`|手册 §1.3–1.4；AGENTS「连接 ≠ 业务登录」|POST /auth/login|✅ 已对齐|—|—|—|B-45|切回 BSC 后自动再调度登录/续期|
|H-005|宿主|Auth 成功后|登录成功刷新 API query|写|`src/boot/startup/auth-provider.tsx`AuthProvider`：`sessionReady` 上升沿 `invalidateAfterAuthLogin`；断会话 `clearApiQueries`|手册 §1.3；`docs/decisions/dapp-page-bag-dock-detail.md`（boot 组合根）|POST /auth/login|✅ 已对齐|—|—|—|—|入口在 host wallet；副作用在 boot|
|H-006|宿主|WalletDetailsModal|断开钱包|写|`src/views/dapp/host/wallet/wallet-details-modal.tsx`handleDisconnect`：`disconnect`+`clearLoginErrorOnDisconnect`（JWT 表保留）|手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-007|宿主|ConnectedWalletChip|`loginError` 重试登录门闸|写|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`ConnectedWalletChip`/`loginToastMessage`：reconnect 样式→`login()`；封禁/拒签不 toast|手册 §1.3；AGENTS 鉴权|POST /auth/login|✅ 已对齐|—|—|—|—|—|
|H-008|宿主|ConnectedWalletChip|短地址展示|读|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`ConnectedWalletChip`：`formatShortAddress(account?.address??session?.address)`；须 `sessionReady&&walletReady`|手册 §1.3|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-009|宿主|WalletDetailsModal Title|短地址（详情）|读|`src/views/dapp/host/wallet/wallet-details-modal.tsx`WalletDetailsModal`：`formatShortAddress(walletAddress)`|手册 §1.3|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-010|宿主|WalletDetailsModal|复制完整地址|写|`src/views/dapp/host/wallet/wallet-details-modal.tsx`handleCopy`→`copyTextToClipboard`|UI 基线（已实现）；手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-011|宿主|WalletDetailsModal|USD1 余额（Num）|读|`wallet-details-modal.tsx`；`useUsd1PresaleWalletQuery`→`BSC_CONTRACTS.usd1`；pending=`…`/error=`—`/ok=`formatTokenAmount`|手册 §4.3 USD1.`balanceOf`|—（纯链）|🔍 待核实|待核实|样本钱包对照 USD1.`balanceOf` 与弹窗余额|—|—|R2 确认🔍：个人金钱无本轮 Prod；metadata≠余额✅；error 不造 0|
|H-012|宿主|WalletDetailsModal|AGX/gAGX/X/XX/迁移态等 §4 字段|读|`src/views/dapp/host/wallet/wallet-details-modal.tsx` 注释「不含代币列表」；host 无迁移 UI|手册 §4.3 / §17；`docs/figma-pages.md`（无 host 迁移帧）|—（纯 UI）|⚪ 不适用|—|—|—|阻塞·迁移页|全量资产归 assets tab|
|H-013|宿主|AppBar 网络胶囊|当前网络名「BSC」（Copy）|读|`src/views/dapp/host/app-bar.tsx`AppBarWalletActions`+`useWriteReadiness`：同网 BSC 图标+文案；异网见 H-014|手册 §1.3 `chainId`；§1.4 `wrong_network`；§4.4|—（纯链）|✅ 已对齐|—|—|—|B-45|读 live chain|
|H-014|宿主|AppBar 异网胶囊|`wrong_network` 切 BSC 引导|写|`src/views/dapp/host/app-bar.tsx`handleSwitchToBsc`：`useSwitchActiveWalletChain(defaultChain)`；`switching`→disabled+`Loader2`；失败 toast|手册 §1.4 / §4.4|—（纯 UI）|✅ 已对齐|—|—|—|B-45|无「切换中…」文案；仅换 spinner|
|H-015|宿主|WalletConnectModal|连接钱包（thirdweb ConnectEmbed）|写|`src/views/dapp/host/wallet/wallet-connect-modal.tsx`；`WalletConnectButton`：`needsSignIn` 时不挂 Embed（直接 `login`）|手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|`onConnect`/已连接 effect 关窗|
|H-016|宿主|WalletDetailsModal|钱包掉线后 Reconnect|写|`src/views/dapp/host/wallet/wallet-details-modal.tsx`：`!walletReady`→`reconnectWallet` CTA + `WalletConnectModal`|手册 §4.4|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-017|宿主|Rail / MobileNav|Exchange 可领红点（Turbine）|读|`src/views/dapp/host/rail.tsx`/`mobile-nav.tsx`；`useTurbineExchangeRailDot(walletReady)`→`src/web3/exchange/turbine-exchange-read.ts`readTurbineHasClaimable`（`silencesSize`+`isVested`）|手册 §16 Turbine|—（纯链）|✅ 已对齐|—|—|—|—|与 H-018 同 `walletReady` 门闸|
|H-018|宿主|Rail / MobileNav|Release 可领红点（queue+splitter+archive）|读|`src/views/dapp/host/rail.tsx`/`mobile-nav.tsx`；`useReleaseRailDot(walletReady)`→`src/web3/release/release-read.ts`readReleaseHasClaimable`|手册 §12–13|—（纯链）|✅ 已对齐|—|—|—|—|BSC 公共读；不要求 JWT|
|H-019|宿主|Rail genesis tooltip|创世季序号 `{season}`（Num）|读|`rail.tsx`→`formatGenesisSeasonIntro`；`GenesisPromoSync`：`activePhase`→index+1，else live，else **`return 1`**；loading 只把 discount 换成 `…`，season 仍可能 1|手册 §6；figma 教程/创世|—（纯链）|🟡 部分|FE 读源/算法/门闸/刷新错误|无活期/加载中：season 显 `—`（或省略季号），对齐 H-020 诚实空；禁回退 1|—|—|R2 终裁：T1=FE（伪造季号≠设计取舍）；Prod phase=0≠无活期回退合法|
|H-020|宿主|Rail genesis tooltip|折扣 `{discount}`（Copy/Num）|读|`src/views/dapp/host/genesis-promo-sync.tsx`：`discountBps/100`→`-N%`；0/无活期→`—`；loading→`…`（`formatGenesisSeasonIntro`）|手册 §6 phase `discountBps`|—（纯链）|✅ 已对齐|—|—|—|—|诚实空态|
|H-021|宿主|GenesisPromoSync（host 挂载）|phases / activePhase / agxPrice → store|读|`src/views/dapp/host/genesis-promo-sync.tsx`GenesisPromoSync`；`src/web3/presale/use-presale-queries.ts`usePresalePhasesQuery`等；`readAllPresalePhases`|手册 §6 PreSale|—（纯链）|✅ 已对齐|—|—|—|—|host 单例防双查；驱动 H-019/020|
|H-022|宿主|DappHost|`useConnectWarmPrefetch`（绑定+多币余额暖热）|读|`src/views/dapp/host/dapp-host.tsx`；`src/web3/wallet/use-connect-warm-prefetch.ts`useConnectWarmPrefetch`→`prefetchConnectWarm(address,bscReadClient)`|手册 §1.3 / §5；B-39|—（纯链）|✅ 已对齐|—|—|B-39|B-39 closed|无壳层 UI 展示绑定→附录 Z|
|H-023|宿主|ConnectPromoCard / DockConnectPromo|未连接引导卡 + 连接 CTA|写|`src/views/dapp/shared/connect-promo-card.tsx`ConnectPromoCard`；`dock-connect-promo.tsx`DockConnectPromo`；CTA=`WalletConnectChip`|手册 §1.4 `need_wallet`；UI 基线|—（纯 UI）|✅ 已对齐|—|—|—|—|各 tab 决定是否渲染；门闸不一致属 tab 章|
|H-024|宿主|ConnectPromoCard|`needsSignIn` 时标题仍为 connect 促销文案|读|`src/views/dapp/shared/connect-promo-card.tsx`：`t.dapp.connect.promoTitle` 固定；按钮经 `WalletConnectChip` 可切 `signInRequired`|AGENTS「连接 ≠ 业务登录」；i18n `dapp.connect`|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|产品确认后：`needsSignIn` 时分支 `promoTitle`（i18n）或关 C-21 标故意保留|—|C-21|标题/按钮语义分裂|
|H-025|宿主|OnboardingTourTooltip|步骤进度点 / `currentStep`（0…11）|读|`src/views/dapp/host/onboarding/onboarding-tooltip.tsx`OnboardingTourTooltip`；`shared.ts`ONBOARDING_STEP_COUNT=12`|`docs/figma-pages.md` 教程 1/12–12/12|—（纯 UI）|✅ 已对齐|—|—|—|—|非链上数值|
|H-026|宿主|OnboardingGuide|完成/跳过持久化 `done`|写|`src/views/dapp/host/onboarding/onboarding-guide.tsx`finish`→`writeOnboardingDone`；键 `aegis.onboarding.v1`；回 `exchange` hub|UI 基线；`docs/figma-pages.md` 教程|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-027|宿主|AppBar OnboardingTourChip|未完成红点 + 重播|读|`src/views/dapp/host/primitives.tsx`OnboardingTourChip`；`app-bar.tsx`：`done===false` coral；H5 `max-dapp:hidden`|`docs/figma-pages.md` 教程|—（纯 UI）|✅ 已对齐|—|—|—|—|首次仍 auto-start（H-028）|
|H-028|宿主|Onboarding auto-start|首次访问自动打开引导|写|`src/views/dapp/host/onboarding/onboarding-guide.tsx`useOnboardingAutoStart`：`!done` 延时 400ms|UI 基线|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-029|宿主|shared/`goBindReferral`|跳转社区补绑推荐人|写|`src/views/dapp/shared/navigation.ts`goBindReferral`→`selectTab('community')`；host 无绑定表单|手册 §5；legacy 绑定细节|—（纯 UI）|⚪ 不适用|—|—|—|—|绑定读写归 community；暖热见 Z|
|H-030|宿主|Host 壳层|推荐绑定状态 `isBindReferral` 可见位|读|host Fold 无展示；仅 `prefetchConnectWarm`→`readIsBindReferral`（H-022）|手册 §1.3 / §5|—（纯链）|⚪ 不适用|—|—|—|—|非缺能力——产品未在壳层展示|
|H-031|宿主|DetailToggle / DockHeader|`detailCollapsed` 折叠态|读|`src/views/dapp/shared/detail-toggle.tsx`/`dock-header.tsx`；`useDappHostStore.detailCollapsed`|`docs/decisions/dapp-page-bag-dock-detail.md`|—（纯 UI）|⚪ 不适用|—|—|—|—|本地壳态；无链数据|
|H-032|宿主|DappHost DEV alert|Thirdweb Client ID 缺失提示|读|`src/views/dapp/host/dapp-host.tsx`：`import.meta.env.DEV && !isThirdwebConfigured`|工程配置（`.env.example`）|—（纯 UI）|⚪ 不适用|—|—|—|—|仅 DEV|
|H-033|宿主|AppBar LanguageMenu|语言切换|写|`src/views/dapp/host/app-bar.tsx`→`LanguageMenu`/`setLocale`|i18n SSOT；foundation 文案|—（纯 UI）|⚪ 不适用|—|—|—|—|非链/API 动态位|
|H-034|宿主|Rail hover/focus|`prefetchTabQueries` 暖热|读|`src/views/dapp/host/rail.tsx` onMouseEnter/onFocus→`prefetchTabQueries`|性能预取（非权威源）|—（纯 UI）|✅ 已对齐|—|—|—|—|仅 inactive+stale refetch|
|H-035|宿主|DappHost hash|Tab hash ↔ `activeTab`|读/写|`src/views/dapp/host/dapp-host.tsx`replaceTabHash`/`syncTabFromHash`|UI 路由；`docs/decisions/dapp-page-bag-dock-detail.md`|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-036|宿主|DappHost tab 切换|`refetchStaleTabQueries` + 外页子视图 reset|写|`src/views/dapp/host/dapp-host.tsx` `displayTab` effect→`refetchStaleTabQueries`+`resetForeignSubviewStores`|刷新门闸|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|H-037|宿主|WalletConnectChip 登录中|`isLoggingIn` → Connecting 文案|读|`src/views/dapp/host/wallet/wallet-connect-chip.tsx`WalletConnectButton`：`aria-busy`+disabled+`t.wallet.connecting`|AGENTS 鉴权 UX|POST /auth/login|✅ 已对齐|—|—|—|—|—|
|H-038|宿主|SIWE 消息 chainId 字段|登录消息内 chain 声明|写|`src/web3/auth/login-message.ts`createSiweLoginFields`/`loginMessage`：`chain_id=String(expected)`；`loginWithWallet` 仅 live=BSC 才签发|手册 §1.3 chainId；AGENTS 写链门闸|POST /auth/login|✅ 已对齐|—|—|—|B-45|与 H-004 同门闸；不写异网 live id|
|H-039|宿主|AboutCard / TabHeader / DockFrame|标题/副文案槽位|读|`src/views/dapp/shared/about-card.tsx`/`tab-header.tsx`/`dock-frame.tsx`；动态 Num 由调用方 tab 传入|`docs/foundation/component-usage.md`；`docs/decisions/dapp-page-bag-dock-detail.md`|—（纯 UI）|⚪ 不适用|—|—|—|—|Host 不展开 tab Num|
|H-040|宿主|Host 壳层|账户迁移入口 / `isOldAccount` 提示|读|host 无迁移入口 UI；`src/core/migration/migration-user.ts` 存在但不挂壳|手册 §4.3 / §17；`docs/figma-pages.md`（超出稿）|—（纯 UI）|⚪ 不适用|—|—|—|阻塞·迁移|解阻条件：产品/稿确认迁移表面后再接线|

## 2. 质押（S-）

**对照源指针：** [`research/dapp-tab-source-index.md` §2](./research/dapp-tab-source-index.md#2-staking)  
**代码根：** `src/views/dapp/staking/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|S-001|质押|Hub·概览|质押总量 TVL = `StakingPool.poolAgxBalance`|读|`formatAgxCompact(undefined)`→`0 AGX`；`tvlUsdSub`=`formatUsdApprox(poolAgx??0,…)`；loaded 时跟 `poolAgxBalance`|手册 §8 · `poolAgxBalance`|—|🟡 部分|FE 读源/算法/门闸/刷新错误|缺 overview 显 `—`/`…`；禁 null→`0 AGX`/`≈$0`；loaded∧真 0 才 `0`|—|—|R2 确认🟡：无源造 0；前版 Prod=0 仅 loaded 合法|
|S-002|质押|Hub·概览|总市值 = `circulatingSupply × AGX/$`|读|`labels.mcap`：`circulating!=null∧price!=null`→积；else `formatUsd(null)`→**`$0.00`**|手册 sagx.`circulatingSupply`+价源|—|🟡 部分|FE 读源/算法/门闸/刷新错误|价/流通缺失时 mcap 显 `—`（禁 `formatUsd(null)`）；circulating=0∧有价才 `$0`|—|—|R2：null 价造 $0；Prod circulating=0 有价时 $0 仍合法|
|S-003|质押|Hub·概览|AGX 流通量 = `sAGX.circulatingSupply`|读|`formatAgxGrouped(undefined)`→`0.00 AGX`；loaded 跟 `circulatingSupply`|手册 · sagx.`circulatingSupply`|—|🔍 待核实|待核实|缺源显 `—`；禁 null→`0.00 AGX`；Prod eth_call 对拍流通量后再抬|—|—|R1：金钱无本轮 Prod；无源造 0|
|S-004|质押|Hub·概览|智库储备 = `Treasury.totalReserves` → USD1 展示|读|`formatTreasuryUsd1`：reserves/price null→`0 USD1`/`≈$0`；有源则 AGX×价|手册 · treasury.`totalReserves`|—|🟡 部分|FE 读源/算法/门闸/刷新错误|缺 reserves/价显 `—`；禁空态造 0；两源齐且真 0 才 `$0`|—|—|R2 确认🟡：无价/无储备造 0；前版 Prod reserves 不抵空态|
|S-005|质押|Hub·概览|AGX 价格（USD）|读|`labels.price`←`useAgxPriceUsd`；null/error→`formatNumber(0)`→**`$0.00`**（hook 注释亦写兜底 0.00）|价源 hook（池 spot）|—|🟡 部分|FE 读源/算法/门闸/刷新错误|缺价显 `—`/`…`；禁 null→`$0.00`；本轮无 Prod spot 对拍|—|—|R2：无源造 $0；接线在|
|S-006|质押|Hub·概览|总销毁量 = `AgxContributionSwap.getConfig().totalBurned`|读|`src/views/dapp/staking/hub/use-hub.ts`：`labels.burned`←overview.`totalBurned`；Prod=`1.5e9`|手册 · `contracts/agxcontributionswap.md` `getConfig`|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 `zh.ts` `hub.overview.metrics.burned.hint`：去掉「销毁债券」或改为「贡献销毁 totalBurned」|C-09|C-09|R2 终裁：不拆行；数✅/hint 债同 S-014；Prod 量仅 loaded 旁证|
|S-007|质押|Hub·概览|当前 Rebase 收益率 = 最近 `sAGX.rebases[i].rebase`|读|`readLatestSagxRebaseRate1e18`→null（空数组/从未）；`formatRebasePct(null)`→**`0.00%`**（`YIELD_EMPTY`）|手册 sagx rebases|—|🟡 部分|FE 读源/算法/门闸/刷新错误|空/null 显 `—`（对齐 S-008）；禁 `0.00%` 冒充实 rebase|—|—|R2：无源造 0%；二分探最新接线仍在|
|S-008|质押|Hub·概览|可运行周期 Runway|读|`labels.runway`=`runwayUnknown`=`—`；不伪造 0 天|无公式/无链字段|—|⚪ 不适用|—|—|A-19|A-19|诚实空态合法；同 Z-012|
|S-009|质押|Hub·概览|质押地址数|读|`useStakeAddressCount(sessionReady)`；`!sessionReady`/loading/fail 均 `formatNumber(0)`|—|`POST /performance/stake-address-count`|🟡 部分|设计取舍（故意空/0）|未登录或查询失败/loading 显 `—`（或需登录提示），禁伪造 0|—|—|R2 确认🟡：API 门控对；造 0≠诚实空|
|S-010|质押|Hub·周期表|基础日收益 / 加成 / 周期收益|读|`formatYieldPct(null)`→`YIELD_EMPTY`=`0.00%`；算法跟 epoch×`epochsPerDay`+`lockedBonusBps`|手册 epoch×`epochsPerDay`；`lockedBonusBps`|—|🟡 部分|FE 读源/算法/门闸/刷新错误|rebase/epochs 缺失显 `—`；禁 `0.00%` 冒充实收益（同 S-007）|B-44|—|R1：无源造 0%；债券 seg 加成=0 仍合法|
|S-011|质押|Hub·图表|TVL/市值历史序列|读|序列接线公开 API；`chartValueLabel`=`formatUsd(lastValue)` null→`$0.00`；`formatPercentChange(null)`→`+0.0%`|`docs/backend-api/api.md` #protocol-market-stats/series|`POST /protocol-market-stats/series`|🟡 部分|FE 读源/算法/门闸/刷新错误|无点/缺 lastValue 显 `—`；禁 `$0`/`+0%`；序列对账另 Prod|A-18|A-18|R2 终裁🟡（非🔍）：主缺=空态造 $0/+0%；接线 Z-011；序列 Prod 不抬本行|
|S-012|质押|Hub·FAQ|「约 14,400 块 / Epoch≈12h / 日 2 次」|读(Copy)|`zh.ts` assets rebase steps「约 14,400 区块 / 约 12 小时 / 每日 2 次」已渲染；≠链 `epoch.length`|手册 epoch / `epochsPerDay`|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 FAQ：插值 `epoch.length`/`epochsPerDay`，删死写 14400/12h/日2次|C-14|C-14|R2 确认 R1 ❌→🟡（接线在、文案错≠未接入）|
|S-013|质押|Hub·FAQ|「收益以 gAGX 结算 / 可直接挖 X」|读(Copy)|`zh.ts` hub/stake FAQ 已渲染 gAGX 结算叙事|手册 §8/§9 结算 AGX；§15 挖矿须 gAGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 FAQ：结算单位改 AGX；挖 X 写清先 wrap gAGX|C-08 · A-07|C-08 · A-07|R2 确认 R1 ❌→🟡（文案已接、口径错）|
|S-014|质押|Hub·FAQ/hint|总销毁量 hint 含销毁债券|读(Copy)|`overview.metrics.burned.hint`|同 S-006|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 S-006 改 hint|C-09|C-09|—|
|S-015|质押|Hub·FAQ|Rebase hint「每个 Epoch（约 12 小时）」|读(Copy)|`metrics.rebase.hint` 已渲染死写 12h|同 S-012|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 S-012：hint 跟 `epochsPerDay`/块长|C-14|C-14|R2 确认 R1 ❌→🟡|
|S-016|质押|Stake·Dock|钱包 AGX 余额（Amount 标签）|读|`useStakeSession`←`readStakeOpenPreflight`/`balanceOf`；无样本对账|手册 §8 ERC20.`balanceOf`|—|🔍 待核实|待核实|样本钱包对照 `AGX.balanceOf` 与 Dock `amountLabel`|—|—|接线在；金额 L 未做|
|S-017|质押|Stake·Dock|基础日收益 / 周期收益 / 加成|读|`yieldMeta`←`formatYieldPct`/`formatBonusPct`；null→`0.00%`（同 S-010）|同 S-010|—|🟡 部分|FE 读源/算法/门闸/刷新错误|同 S-010：缺源显 `—`|B-44|—|R1：继承 S-010 空态造 0%|
|S-018|质押|Stake·Dock|锁定天数文案|读(Copy)|liquid / `{days} 天线性释放`|手册周期|—|✅ 已对齐|—|—|—|—|—|
|S-019|质押|Stake·Dock|剩余额度（可见位）|读|预检用 `remainingQuota` 门闸；Dock **未展示** `meta.remaining`|`remainingStakeAmount` + 个人限额|—|⚪ 不适用|—|—|B-36|—|能力在门闸；i18n 残留见 Z-002|
|S-020|质押|Stake·写|**质押开仓** `liquidStake` / `lockedStake`|写|`submitStakeOpen`：`approveThenLiveWrite`+推荐/额度/迁移/池开关；成功 `invalidateAfterStaking`|手册 §8.2/8.3|—|✅ 已对齐|—|—|B-36|—|soft: insufficientAllowance|
|S-021|质押|Stake·Detail|总质押量 / Epoch / 下次 Rebase / Rebase%|读|总质押 `poolAgxWei??0n`；`formatRebasePct(null)`→`0.00%`；倒计时跟块高|Hub 同批 overview|—|🟡 部分|FE 读源/算法/门闸/刷新错误|缺 overview：量/`%` 显 `—`；禁 `0n`/`0.00%` 冒充；倒计时块高可保留|—|—|R1：无源造 0；B-33 倒计时接线仍在|
|S-022|质押|Stake·Detail|我的持仓 Σ principal|读|`useStakeDetail`←`readStakePositions` 聚合；无样本钱包|手册 §8 仓位读|—|🔍 待核实|待核实|样本地址对照链仓位 Σ principal 与「我的持仓」|—|—|接线在；金额 L 未做|
|S-023|质押|Stake·Detail|已释放 / 待释放|读|`assets-read` liquid `releasedPrincipal:0n`；`use-stake` pending=`principal−released`→活期整笔「待释放」|手册 §8.2 liquid / §8.3 locked `getReleasedPrincipal`（A-08）|—|🟡 部分|FE 读源/算法/门闸/刷新错误|改聚合：liquid 不套 locked 的 pending 公式（或产品改口径）+ 单测|B-12 · A-08|B-12 · A-08|活期 released=0 故意；错在 pending 套公式|
|S-024|质押|Stake·Detail|当前 Rebase 收益 / 加成|读|数跟链 `blockReward`/`extraInterest`；展示用 `GAGX_DECIMALS` 标 **gAGX**|手册 getStakeRewards；链付 AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|改单位标签 AGX（或产品确认 gAGX 叙事）；样本钱包核数值|C-02 · A-07|C-02 · A-07|单位错已定；数值待核实|
|S-025|质押|Stake·Detail|质押记录表|读|`useStakeFlowPositions`|`docs/backend-api` #stake-flow/positions|`POST /stake-flow/positions`|✅ 已对齐|—|—|—|—|需 session|
|S-026|质押|Stake·FAQ|「每日 2 次 Rebase / 约 12h」等|读(Copy)|`stake.faq` / intro 已渲染死写|`epoch.length`|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 S-012 改 stake.faq/intro|C-14|C-14|R2 确认 R1 ❌→🟡|
|S-027|质押|Stake·FAQ/机制|「收益以 gAGX」|读(Copy)|mechanismSteps / faq 已渲染|链 AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 S-013/S-024 改 Copy 单位|C-02 · C-08|C-02 · C-08|R2 确认 R1 ❌→🟡|
|S-028|质押|Stake·Detail|趋势图|读|共用 `useProtocolMarketStatsChart`；同 S-011 空态 `$0`/`+0%`|同 S-011|`POST /protocol-market-stats/series`|🟡 部分|FE 读源/算法/门闸/刷新错误|同 S-011|A-18|A-18|R2 终裁🟡=S-011（非🔍）；继承空态造零|
|S-029|质押|Bond·Dock|各周期 `discountRateBP` / 折扣价|读|`formatBondDiscountLabel`；Prod 180=8500→「85%」|手册 · BondDepository.`discountRateBP`|—|✅ 已对齐|—|—|—|—|R2 终裁✅（非🔍）：协议配置价率非个人金钱；标签债→S-030|
|S-030|质押|Bond·Dock/Detail|「债券溢价率」标签 vs 展示值|读(Copy+Num)|标签「溢价率」/FAQ「收益空间」；值=`discountRateBP` 价率（85%）非 15% 空间|手册 discountRateBP=成交价率|—|🟡 部分|文案/单位与链不匹配（稿如此）|改标签/FAQ 为「折扣价率」或展示 `10000−BP` 空间%|C-16|C-16|曾 B-13→C；数对见 S-029|
|S-031|质押|Bond·Dock|已售 / 最大购买量（债务剩余）|读|`formatBondDebtRemainingDisplay`←maxDebt/totalDeposit；接线在|手册 BondDepository 债务|—|🔍 待核实|待核实|Prod eth_call 对拍债务剩余展示；禁假 Prod|B-34|—|R1：金钱无本轮 Prod；算法接线保留|
|S-032|质押|Bond·Dock|获得 AGX 预览（净/毛）|读|`readBondZapAgxPreview`：`valueOf×1e9/agxPrice`；Prod `RestakeConfig.agxPrice`=`55e18` vs Treasury `valueOf` 9 位→毛兑付≈尘埃|手册 · BondHelper 报价 + fee；`ErrorBondTooSmall`|—|🚫 阻塞|手册或API与链不符|解阻=链侧校正 `agxPrice`/`valueOf` 量纲；FE 不私自换价。核对后重开门闸|B-34|—|FE 已接；1000 USD1 LP 预估 gross=`2` ≪ `0.01` AGX|
|S-033|质押|Bond·Dock|允许滑点|读|`useBondHelperSlippageQuery`|手册 BondHelper|—|✅ 已对齐|—|—|—|—|—|
|S-034|质押|Bond·Dock|USD1 余额|读|zap 预检 `readBondZapPreflight`；无样本|ERC20 `USD1.balanceOf`|—|🔍 待核实|待核实|样本钱包对照 USD1.`balanceOf` 与 Dock 余额|—|—|—|
|S-035|质押|Bond·写|**购买** `zapIntoLiquidityBond` / `zapIntoBurnBond`|写|`submitBondZap`+live 门闸完整；Prod 只读同 S-032：合理 USD1→`grossPayout < 1e7`→恒 `bondTooSmall`|手册 §10.4；`ErrorBondTooSmall`|—|🚫 阻塞|手册或API与链不符|解阻条件=链价位量纲修复（同 S-032）；再测 zap 门闸|B-34|—|FE 门闸已接；非 FE 私自换价可修|
|S-036|质押|Bond·Detail|LP/Burn 总质押量 Σ totalDeposit|读|`useBondDetail`←三池 `market.totalDeposit`；接线在|手册 BondDepository|—|🔍 待核实|待核实|Prod eth_call Σ `totalDeposit` 对拍 Detail 总质押量|—|—|R1：金钱无本轮 Prod|
|S-037|质押|Bond·Detail|下次 Rebase / Rebase%|读|同源 Hub overview；`formatRebasePct(null)`→`0.00%`|同 S-007/S-021|—|🟡 部分|FE 读源/算法/门闸/刷新错误|同 S-007：空/null 显 `—`|—|—|R1：继承 S-007 造 0%|
|S-038|质押|Bond·Detail|持仓 / 已释放 / 待释放|读|`pendingRelease=payoutRemaining−pendingPayout`；接线在；无样本|手册 getBondInfo 聚合|—|🔍 待核实|待核实|样本钱包对照 payoutRemaining/pendingPayout 三卡|—|—|「已释放」≈可领 payout|
|S-039|质押|Bond·Detail|当前 Rebase 收益|读|`useBondDetail`←`row.profit`（`getStakeProfit`）；展示标 gAGX|手册 BondDepository.`getStakeProfit`；链付 AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|改单位 AGX；样本核数值|C-02 · A-07|C-02 · A-07|—|
|S-040|质押|Bond·Detail|购买记录|读|session 门控 `useBondFlow*Purchases`|`docs/backend-api` #bond-flow|`POST /bond-flow/lp-purchases` · `/burn-purchases`|✅ 已对齐|—|—|—|—|—|
|S-041|质押|Bond·FAQ|溢价率解释 / 折扣区间文案|读(Copy)|lpbond/burnbond.faq 已渲染「溢价」叙事；值语义见 S-030|discountRateBP 语义|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 S-030 改 FAQ 语义|C-16|C-16|R2 确认 R1 ❌→🟡；C-13 复投漏 180 属 shared FAQ|
|S-042|质押|Xmine·Dock|日收益率 = `yieldRateBP/100` %|读|overview null→`ZERO_PCT`=`0.00%`；loaded=`formatXmineDailyYieldLabel`|手册 §15 · `yieldRateBP`|—|🟡 部分|FE 读源/算法/门闸/刷新错误|缺 overview 显 `—`/`…`；禁 `0.00%`；loaded 跟 BP|—|—|R2 确认🟡：无源造 0%；前版 Prod=1 仅 loaded|
|S-043|质押|Xmine·Dock|质押额度剩余 = quota−staked|读|B-14：spendable=min(balance,remaining)；额度标签用 remaining|手册 `miningQuotaOf` / `miningStakeAmountOf`|—|🔍 待核实|待核实|样本地址对照 quota−staked 与 Dock 额度标签|—|—|算法 closed；个人额度无样本|
|S-044|质押|Xmine·Dock|gAGX 余额 / Max|读|`useXmineSession`←`readXminePreflight`/`RewardGAGX.balanceOf`|手册 §15 ERC20|—|🔍 待核实|待核实|样本对照 gAGX.`balanceOf` 与 Max 上限|—|—|—|
|S-045|质押|Xmine·Dock|「锁定天数 / 24 小时后释放」|读(Copy)|`meta.lockValue`=`24 小时后释放` 已渲染；非自动释放|手册 §15.4 `activateWarmup`|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 Copy：写清须资产页 `activateWarmup`，非到期自动|C-03|C-03|R2 确认 R1 ❌→🟡；动作存在见 S-064|
|S-046|质押|Xmine·写|**质押** `stakeGagxForMining`|写|`submitXmineStake`：quota/余额/allowance；不足跳闪兑；`invalidateAfterStaking`|手册 §15.4|—|✅ 已对齐|—|—|B-14|—|—|
|S-047|质押|Xmine·Detail|总质押量 = gagx.balanceOf(pool)|读|`tvlGagxWei??0n` 空态造 0；loaded←`totalStakedGagx`|手册 §15|—|🟡 部分|FE 读源/算法/门闸/刷新错误|缺 overview 显 `—`；禁 `??0n`；loaded∧真 0 才 `0`|—|—|R2 确认🟡：无源造 0；前版 Prod=1e9 仅 loaded|
|S-048|质押|Xmine·Detail|「X 价格」= AGX per X（自 xPerAgx）|读|`useXmineDetail`：`agxAmountPerXFromXPerAgx`→`N AGX`；Prod xPerAgx=`1e19`→`10 AGX`；非 USD|手册 `xPerAgx`|—|🟡 部分|文案/单位与链不匹配（稿如此）|产品改名「AGX/X」或加单位说明；数已正确|C-17|C-17|R2 确认🟡：标签易误解；值对；非金钱假零|
|S-049|质押|Xmine·Detail|累计挖矿产出|读|`useX0MiningLifetimeReward` 翻尽页（B-17 closed）|无链累计 view|`POST /x0-mining/logs`（operation=REWARD 翻页累加）|🔍 待核实|待核实|样本+JWT 对照翻页累加 vs 展示|—|—|需 session|
|S-050|质押|Xmine·Detail|下一次挖矿产出|读|固定 `—`|无字段|—|⚪ 不适用|—|—|A-17|A-17|诚实空；同 Z-014|
|S-051|质押|Xmine·Detail|我的挖矿质押|读|链优先 `miningStakeAmountOf`；回落 API holdings|手册 §15|`POST /x0-mining/positions`（回落）|🔍 待核实|待核实|样本对照链 miningStake 与卡面|—|—|—|
|S-052|质押|Xmine·Detail|「已释放」|读|`use-xmine.tsx` 注释「无 PRV 已释字段，先显示 0」→`formatNumber(0)`+`formatUsdApprox(0,…)`；不冒充 miningStake（B-24）|无缓冲拆分字段|—|🟡 部分|设计取舍（故意空/0）|无 PRV 拆分源：指标改 `—` 或移除行（对齐 S-008/S-050）；禁固定 0|A-15|A-15|R2 确认🟡：B-24 仍成立；固定 0≠诚实空|
|S-053|质押|Xmine·Detail|挖矿产出 pending|读|`readXminePosition`：`pending` / `pendingValue`|手册 §15|—|🔍 待核实|待核实|样本对照 pending 与卡面|—|—|—|
|S-054|质押|Xmine·Detail|挖矿记录|读|`useX0MiningLogs`；session 门控|`docs/backend-api` #x0-mining/logs|`POST /x0-mining/logs`|✅ 已对齐|—|—|—|—|—|
|S-055|质押|Xmine·FAQ/机制|「24h 锁定后即可…」暗示自动|读(Copy)|faq + mechanismSteps 已渲染|同 S-045|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 S-045 改 FAQ/机制文案|C-03|C-03|R2 确认 R1 ❌→🟡|
|S-056|质押|Calc·Dock|输入：产品/周期/数量/价格/天数|读(输入)|`useCalcDock`；价种子自 spot 一次|本地估算|—|✅ 已对齐|—|—|—|—|非链报价|
|S-057|质押|Calc·结果|质押/债券/xmine 估算公式|读|`buildCalcEstimate`/`use-calc`/`readStakingHubOverview` 三层 `epochsPerDay ?? 2`；`baseDailyPctFromEpoch` 默认参亦 2|手册折扣表 + 链 yield/epoch|—|🟡 部分|FE 读源/算法/门闸/刷新错误|overview 未就绪或 `epochsPerDayFromLength` 失败时禁静默 2：显 `—`/推迟估算，或只信链推算值|B-18|—|R2：B-18 公式接线仍在；`??2` 与 S-012/C-14 死写日2次同簇|
|S-058|质押|Calc·Aside|收益曲线 / 关键节点 / 说明|读|notes「仅供参考」|本地|—|✅ 已对齐|—|—|—|—|—|
|S-059|质押|Assets·写（质押域）|**Mixed 领奖**（liquid/locked/bond）含 restake=compound|写|`submitMixedClaim` dual-check；`invalidateAfterAssetsClaim`→assets+staking+release|手册 §9|—|✅ 已对齐|—|—|B-27|—|UI 在 assets；restakeBps>0 即复投|
|S-060|质押|Assets·写（质押域）|**本金赎回** liquid `claimPrincipal` / locked `claimPrincipal(index)`|写|`submitStakeRedeem`；warmup 禁；`invalidateAfterAssetsClaim`|手册 §8|—|✅ 已对齐|—|—|—|—|—|
|S-061|质押|Assets·写（质押域）|**活期 warmup 激活** `LiquidStaking.claim()`|写|`submitLiquidWarmupClaim`→`invalidateAfterStaking`|手册 §8.2|—|✅ 已对齐|—|—|—|—|≠ Mixed|
|S-062|质押|Assets·写（债券域）|**债券赎回** `redeem(..., false)`|写|`submitBondRedeem`；进分流器；`invalidateAfterAssetsClaim`|手册 §10|—|✅ 已对齐|—|—|—|—|无 `shouldStake=true` UI|
|S-063|质押|Assets·写（Xmine）|**领取 X** `claimReward`|写|`submitXmineClaim` dual-check→assets claim invalidate|手册 §15.4|—|✅ 已对齐|—|—|—|—|—|
|S-064|质押|Assets·写（Xmine）|**激活 warmup** `activateWarmup`|写|`submitXmineActivateWarmup`|手册 §15.4|—|✅ 已对齐|—|—|—|—|纠正 C-03 文案缺口（动作存在）|
|S-065|质押|Assets·写（Xmine）|**解押** `startUnstake`|写|`submitXmineUnstake`；进分流器|手册 §15.4|—|✅ 已对齐|—|—|—|—|—|
|S-066|质押|跨面·Copy|aside.positionsHint「领取/赎回/解押在资产页」|读(Copy)|与写路径落点一致|产品分流|—|✅ 已对齐|—|—|—|—|—|
|S-067|质押|EarlyStaking|仓位展示 / 领本金 / Mixed|读+写|无 Figma；`abis`/`contracts`/`src` 均无 Early；无 `views` call site|手册 §8.4 · EarlyStaking|—|🚫 阻塞|FE 缺接线|解阻 B-19 后：补 ABI+地址再接仓位/领取|blocker（B-19）|blocker|R2 确认🚫；同 Z-001/A-028；禁假 Prod|
|S-068|质押|Stake·机制|「活期 warmup 后需激活」|读(Copy)|与 S-061 一致|手册 §8.2|—|✅ 已对齐|—|—|—|—|—|
|S-069|质押|Xmine·机制|「领取 X 与解押在资产页；不提供取消 warmup」|读(Copy)|对齐 ErrorWarmupExitDisabled|手册 cancelWarmup revert|—|✅ 已对齐|—|—|—|—|—|
|S-070|质押|Bond·机制|「经 BondHelper zap」|读(Copy)|与 S-035 写路径一致|手册 §10|—|✅ 已对齐|—|—|—|—|—|

---

## 3. 奖励（W-）

**对照源指针：** [`research/dapp-tab-source-index.md` §3](./research/dapp-tab-source-index.md#3-rewards)  
**代码根：** `src/views/dapp/rewards/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|W-001|奖励|Hub 统计|总奖励 `total_reward` 展示为 gAGX|读|`useRewardsHub` 拼 `gAGX`；API 字段标 gAGX；链 Dao 结算 AGX|`docs/backend-api/api.md` #performance/making-overview（total_reward=gAGX）|`POST /performance/making-overview`|🟡 部分|文案/单位与链不匹配（稿如此）|改单位标签为 AGX，或产品确认 gAGX 叙事；overview 字段继续跟 API|A-07→C-15|C-15|采纳 API 字段；单位见 C-15|
|W-002|奖励|Hub 统计|档位 `making_rank` → A{n}/空|读|`formatMakingRankLabel`+`makingRankToRowIndex`|—|`POST /performance/making-overview`（`making_rank`）|✅ 已对齐|—|—|—|—|机制表行高亮同源|
|W-003|奖励|Hub 统计|个人持仓 USD + AGX 副标|读|`formatUsdFromAgx`/`formatAgxSecondary`←`personal_position`|（AGX）×价|`POST /performance/making-overview`|🔍 待核实|待核实|样本+JWT：`personal_position` vs 链/价；副标继续标 AGX|—|—|金钱无 Prod；接线保留|
|W-004|奖励|Hub 统计|做市业绩 USD + AGX|读|同上←`making_market`|—|`POST /performance/making-overview`|🔍 待核实|待核实|样本+JWT：`making_market` 金额对账|—|—|同 W-003 money-bar|
|W-005|奖励|Hub 统计|小区业绩 USD + AGX|读|同上←`small_market`|—|`POST /performance/making-overview`|🔍 待核实|待核实|样本+JWT：`small_market` 金额对账|—|—|同 W-003 money-bar|
|W-006|奖励|Hub 统计|可用贡献值|读|`useRewardsContribution`：有 summary 用 API；无会话回退链 `userContribution`|手册 · AgxContributionSwap|`POST /agx-contribution/summary`|🔍 待核实|待核实|样本对照 API `available_contribution` vs 链 `userContribution`；overview 采纳 API 接线保留|—|—|R2：点数同 A-005/X-032 money-bar；无 Prod|
|W-007|奖励|Hub 卡片·幸运|可领额（链快照）|读|`readLuckyClaimSnapshot`+Hub `luckyAmount`（仅 `claimable∧amount>0`）|手册 §14 `getWinnerInfo`/`rewardClaimed`|—|🔍 待核实|待核实|Prod 对账 Hub 幸运可领额后再抬 ✅|—|—|R2 确认🔍；数源/门闸对齐；后缀 gAGX→C-15|
|W-008|奖励|Hub 卡片·发展|`unlocked_claimable` 标 gAGX|读|`useMarketAllowanceSummary`；`formatGagxBalance`|手册 · `MarketFund.agx()`；API 字段文 unlocked=AGX|`POST /market-allowance/summary`|🟡 部分|文案/单位与链不匹配（稿如此）|统一 UI/日志后缀为 AGX（跟 API 文与链）|A-09→C-05|C-05|API 文 AGX；UI 写 gAGX|
|W-009|奖励|Hub 卡片·创世|团队可领 `$`（total−claimed）|读|Hub 创世卡 `$` 格式，不走 gAGX|RewardClaimer=USD1|`POST /team-reward/total`|🔍 待核实|待核实|Prod 对账 Hub 创世可领 `$` 后再抬 ✅|—|—|R2 确认🔍；社区基金可领不在 Hub 预览|
|W-010|奖励|Hub 卡片·推荐/参与/共建|可领预览|读|Hub 无预览→`formatGagxBalance(null)`→`0.0000gAGX`；详情须签后才有额|无未签只读预览|须 `POST /claim/dao-reward` 后知额|🟡 部分|设计取舍（故意空/0）|sessionReady∧value=null 改 `—`/空态，勿 format 成 0；未签无预览能力保持（Z-010）|A-21|A-21|R2 确认🟡：A-21 故意无预览≠✅；已登录仍造 0|
|W-011|奖励|Hub FAQ|「AGX / gAGX 口径」Copy|读|`zh.ts` `rewards.faq`（Hub 条无「1:1」；1:1 在 cards/hint/子 FAQ）|链结算 AGX；API 多标 gAGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 Hub FAQ：单位口径改 AGX（或产品确认 gAGX 叙事）|C-15|C-15|1:1 贡献错文案见 W-026/052/054|
|W-012|奖励|Hub 机制表|档位行高亮|读|`tierRowIndex`∩静态 i18n 表|—|`making_rank`|✅ 已对齐|—|—|—|—|表文案静态|
|W-013|奖励|Lucky 详情|今日奖池 `$` `today_total_prize`|读|`use-lucky.tsx`|—|`POST /lucky-reward/summary`|🔍 待核实|待核实|样本+JWT：`today_total_prize` vs 链奖池|—|—|金钱无 Prod；summary 接线保留|
|W-014|奖励|Lucky 详情|开奖倒计时|读|`readLuckyRoundDisplaySnapshot` 15s 刷新|链 `getRound(open).endTime`|—|✅ 已对齐|—|—|—|—|未连钱包无倒计时|
|W-015|奖励|Lucky 详情|本轮资格 Yes/No + 轮内购买额|读|同上；hint 用 USD1 额|链 `isUserEligible` + Tracker `getUserRoundStat`|—|🔍 待核实|待核实|Prod 对账轮内购买额后再抬 ✅|—|—|R2 确认🔍；资格布尔 OK；金额无 Prod|
|W-016|奖励|Lucky 详情|累计中奖次数 `win_count`|读|`formatApiCountLabel`|—|`POST /lucky-reward/summary`|✅ 已对齐|—|—|—|—|—|
|W-017|奖励|Lucky 中奖榜|`reward_amount` 后缀 gAGX|读|`mapLuckyWinnerToRow`|API winners 标 gAGX；链付 AGX|`POST /lucky-reward/winners`|🟡 部分|文案/单位与链不匹配（稿如此）|改行后缀 AGX（或产品确认 gAGX）|C-15|C-15|—|
|W-018|奖励|Lucky 我的记录|参与额 / 是否中奖 / tx|读|`mapLuckyMyRoundToRow`|—|`POST /lucky-reward/my-rounds`|🔍 待核实|待核实|Prod 对账 participation_amount 后再抬 ✅|—|—|R2 确认🔍；中奖额单位见 W-017|
|W-019|奖励|Lucky 日期筛|近 5 个 UTC 日|读|`DRAW_DATE_OPTION_COUNT=5`|设计取舍|—|🟡 部分|设计取舍（故意空/0）|产品确认是否扩窗；扩则改常量+筛选项|C-18←B-31|C-18|更早开奖日不可选|
|W-020|奖励|Lucky FAQ|「折算 gAGX」「1:1 贡献」|读|`lucky.faq`|链 AGX + divisor=6|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 lucky.faq：单位 AGX；贡献跟链 quote（约 1:6）|C-06·C-15|C-06·C-15|—|
|W-021|奖励|Lucky·写|Mixed 领取：门闸 + 双读 + invalidate|写|`submitLuckyMixedClaim`→`evaluateRewardsMixedClaim`；`invalidateAfterRewardsMixedClaim`（rewards+release+staking）|手册 §14 `claimRewardMixed` + §9.3|—|✅ 已对齐|—|—|B-27|B-27 closed|贡献不足导 burn；暂停/不可领阻断|
|W-022|奖励|Referral 详情|`total_referral_reward` + gAGX|读|`use-referral.ts`|API 标 gAGX；Dao 付 AGX|`POST /referral-award/summary`|🟡 部分|文案/单位与链不匹配（稿如此）|改后缀 AGX|C-15|C-15|—|
|W-023|奖励|Referral 详情|持仓 / 直推数 / 贡献|读|summary 三字段；直推数与 `direct-referrals` 同 indexer|—|`POST /referral-award/summary`|🔍 待核实|待核实|样本对账持仓/贡献金额；直推数继续跟 API 表（不混链）|—|—|R2：不拆行；持仓/贡献 money-bar；计数接线保留|
|W-024|奖励|Referral 详情|「下次发放」|读|硬编码 `NON_NUMERIC_EMPTY`|无 `next_payout`|—|⚪ 不适用|—|—|A-20|A-20|诚实空；同 Z-013|
|W-025|奖励|Referral 记录/直推表|流水与成员|读|primitives mappers（`awarded_gross` 等）|—|`POST /referral-award/logs` · `/direct-referrals`|🔍 待核实|待核实|样本+JWT 对账 logs/直推表金额列后再抬 ✅|—|—|R2：表金额走 money-bar；mapper 接线保留|
|W-026|奖励|Referral FAQ|Mixed「1:1 消耗」|读|`referral.faq` + card body|链 divisor=6|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 Copy 跟链 quote（约 1:6）|C-06←A-11|C-06|—|
|W-027|奖励|Referral·写|Dao Mixed 领取（REFERRAL=42）|写|`submitDaoMixedClaim`：校验 `DAO_REWARD_SIGN_TYPE`；`writeDaoMixedClaim`；双读贡献/池余额；`invalidateAfterRewardsMixedClaim`|手册 DaoPool：`signType` 须=4；与 OpenAPI/FE 41–45 冲突|`POST /claim/dao-reward`（signType 41–45）|🔍 待核实|手册↔API打架|Prod cast/`eth_call` 证实合约接受 41–45 抑或仅 4；再定 FE/签服|A-10|A-10|**高风险** 写路径未真发|
|W-028|奖励|Participate 详情|总奖励 gAGX / 持仓 / 贡献 / 下次发放空|读|summary 走 API；nextPayout 空同 W-024|—|`POST /participation-award/summary`|🟡 部分|文案/单位与链不匹配（稿如此）|改总奖励单位 AGX；next 空保持|C-15·A-20|C-15·A-20|数跟 summary|
|W-029|奖励|Participate 记录/邀请人|logs + inviter|读|`use-participate` mappers（`awarded_gross` 等）|—|`POST /participation-award/logs` · `/inviter`|🔍 待核实|待核实|样本+JWT 对账 logs/邀请人金额列后再抬 ✅|—|—|R2：同 W-025 表金额 money-bar|
|W-030|奖励|Participate FAQ|1:1 贡献 Copy|读|`participate.faq`|链 divisor=6|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 W-026 改 FAQ|C-06|C-06|—|
|W-031|奖励|Participate·写|Dao Mixed（PARTICIPATION=43）|写|`submitDaoMixedClaim`|同 W-027|`POST /claim/dao-reward`|🔍 待核实|手册↔API打架|同 W-027 Prod 证实 signType|A-10|A-10|同签类型风险|
|W-032|奖励|Cobuild 详情|`total_rank_reward` gAGX + 折算|读|`use-cobuild.ts`|API 含 RANK+SURPASS|`POST /rank-reward/summary`|🟡 部分|文案/单位与链不匹配（稿如此）|改后缀 AGX|C-15|C-15|—|
|W-033|奖励|Cobuild 详情|档位当前/下一 + 三门槛进度|读|summary 持仓/做市/直推门槛；队员表同模块 API|∩ 静态 tier 表|`POST /rank-reward/summary`|✅ 已对齐|—|—|—|—|R2 确认：接线✅；无价 AGX 裸比失真伞→W-055|
|W-034|奖励|Cobuild 记录|等级奖 / 平越奖 / 直推成员|读|Tab 切换重置页码；logs `awarded_gross`|—|`POST /rank-reward/logs` · `/peer-surpass-logs` · `/team-members`|🔍 待核实|待核实|样本+JWT 对账等级/平越奖金额列后再抬 ✅|—|—|R2：同 W-025 表金额 money-bar|
|W-035|奖励|Cobuild FAQ|1:1 + gAGX 叙事|读|`cobuild.faq`|链|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 cobuild.faq：单位 AGX；贡献跟链 quote（约 1:6）|C-06·C-15|C-06·C-15|—|
|W-036|奖励|Cobuild·写|Dao Mixed RANK(41)/SURPASS(44)|写|Segment 选类型；金额仅签名后可知；无 LIFETIME(45) UI|同 W-027|`POST /claim/dao-reward`|🔍 待核实|手册↔API打架|同 W-027；另确认是否要接 LIFETIME(45)|A-10·A-21|A-10·A-21|—|
|W-037|奖励|Grant 详情|档位 / `total_claimed_allowance` gAGX|读|`use-grant.ts`（suffix `gAGX`）|API：claimed 标 gAGX、`unlocked_claimable` 标 AGX（自打架）；链付 AGX|`POST /market-allowance/summary`|🟡 部分|手册或API与链不符|统一 API/UI 后缀为 AGX（跟链 MarketFund）|A-09→C-05|C-05|—|
|W-038|奖励|Grant 详情|发放/领取流水表|读|allowance 列标 gAGX|—|`POST /market-allowance/paid-logs` · `/claim-logs`|🟡 部分|文案/单位与链不匹配（稿如此）|改列后缀 AGX|C-05|C-05|—|
|W-039|奖励|Grant FAQ|「不耗贡献、gAGX 直达钱包」|读|`grant.faq`|链 AGX 直达；不耗贡献/不经 Queue ✅|—|🟡 部分|文案/单位与链不匹配（稿如此）|改「gAGX」→「AGX」；流程句保留|C-05|C-05|—|
|W-040|奖励|Grant Dock|待解锁 `unlockable_allowance` / 可领 `unlocked_claimable`|读|`use-simple-claim` 两字段|—|`POST /market-allowance/summary`|🔍 待核实|待核实|样本+JWT：两字段 vs MarketFund 链余额；单位见 W-037/038/058|—|—|金钱无 Prod；单位债另记|
|W-041|奖励|Grant·写|MarketFund 签名领取|写|`useMarketFundClaim`/`claimMarketFundReward` skipConfirm；UI `hasGrantClaimable`+session+writeReady；`invalidateAfterTeamClaim`（skipConfirm→仍 shouldInvalidate）|手册 §9.5 · MarketFund|`POST /claim/market-fund`（signType=51）|✅ 已对齐|—|—|B-25|C-05·B-25|写路径非展示金额；不真发；CTA/日志后缀见 W-037/038/058|
|W-042|奖励|Genesis Dock|股东档 / 个人·团队进度|读|`use-genesis.ts`+`useShareholderRankLabels`|—|`POST /performance` · teamOverview · partitions|✅ 已对齐|—|—|—|—|R3–R9 用合格分区|
|W-043|奖励|Genesis Dock|直推已领 `$`|读|`useReferralTotal`→`claimed ?? total`|—|`POST /referral/total`|🔍 待核实|待核实|Prod 对账直推已领后再抬 ✅|—|—|R2 确认🔍；展示已领口径|
|W-044|奖励|Genesis Dock|团队奖可领 / 已领 meta（USD1）|读|`claimableAmountValue`|手册 RewardClaimer|`POST /team-reward/total`|🔍 待核实|待核实|Prod 对账团队奖可领/已领后再抬 ✅|—|—|R2 确认🔍|
|W-045|奖励|Genesis Dock|社区基金可领 / 锁定 meta|读|`unlocked_claimable`；超体系徽标|手册 CommunityFund；token 以合约为准|`POST /community-fund/total`|🔍 待核实|待核实|Prod 对账社区基金可领/锁定后再抬 ✅|—|—|R2 确认🔍|
|W-046|奖励|Genesis·写|团队奖签名领取 + confirm|写|`useTeamRewardClaim`；confirm_failed→`shouldInvalidate=false`|手册 RewardClaimer|`POST /claim/team-reward` + `/claim/confirm`|✅ 已对齐|—|—|—|—|链成功确认失败不乐观清余额|
|W-047|奖励|Genesis·写|社区基金签名领取 + confirm|写|`useCommunityFundClaim`；同 outcome 不变量|—|`POST /claim/community-fund` + confirm|✅ 已对齐|—|—|—|—|—|
|W-048|奖励|Genesis 详情/FAQ|历史 Tab + FAQ Copy|读|referral/team/communityFund 历史|FAQ 指向 RewardClaimer/CommunityFund|各 `/…/logs`|✅ 已对齐|—|—|—|—|—|
|W-049|奖励|Mixed 面板共用|释放/复投比例与计划档|读|`readClaimPlans`+原始 index 匹配|链 `queuePlans` / `RestakeConfig.getPlan`|—|✅ 已对齐|—|—|—|—|勿用过滤后下标|
|W-050|奖励|Mixed 面板共用|所需/已有贡献（Lucky 预览）|读|Lucky `amount>0` 时展示；Dao 签前 required 槽为空|链 `quoteRequiredContribution`|—|✅ 已对齐|—|—|C-06·B-26|C-06·B-26|**链侧正确**；文案仍写 1:1|
|W-051|奖励|Mixed 面板共用|贡献不足 → 打开兑换 burn|写/导流|`openExchangeView('burn')`|手册 §9.2 convert|—|✅ 已对齐|—|—|—|—|convert 本体在 exchange|
|W-052|奖励|API/文案|Mixed 贡献「1:1」vs 链 `/6`|读|API 文案 1:1；链 `quoteRequiredContribution=amount/6`（FE 写闸信链）；Copy 仍写 1:1|手册 §9 · 链 quote|`POST /claim/dao-reward` 文：贡献点与领取金额 1:1|🟡 部分|手册↔API打架|后端签前闸改跟链 `/6`（或文档改口径）；FE Copy 跟链（cards/hint/子 FAQ）|A-11→C-06|C-06|FE 写闸已跟链；缺口在 API 闸+Copy|
|W-053|奖励|Lucky 写闸|LuckyPool live `paused`|读|`readLuckyClaimSnapshot`→`paused`；`evaluateRewardsMixedClaim`/`submitLuckyMixedClaim` pre+live 入 `luckyPaused`|以链 live 为准（不跟死文）|—|✅ 已对齐|—|—|—|—|bool 写闸跟 live；非展示金额；paused 样本非 money-bar|
|W-054|奖励|Hub intro Copy|「Mixed 按 1:1 消耗」|读|onboarding/教程轨 `zh.ts`|链 divisor=6|—|🟡 部分|文案/单位与链不匹配（稿如此）|改教程/intro 跟链 quote|C-06|C-06|Visible Copy|
|W-055|奖励|Cobuild 门槛|持仓/做市 AGX→USD 进度|读|无价时退回 AGX 与 `$` 门槛直比|API AGX × `useAgxPriceUsd`|`POST /rank-reward/summary`|🔍 待核实|待核实|价源异常/缺价时人工核对进度徽章；必要时无价禁 `$` 比|—|—|R2 确认🔍伞；W-033 接线保持 ✅|
|W-056|奖励|Dao Mixed·写后|invalidate 覆盖 release/staking|写|`invalidateAfterRewardsMixedClaim`|手册 §9.3/§9.5|—|✅ 已对齐|—|—|B-27|B-27|—|
|W-057|奖励|简单领取·写后|Market/Team/Community invalidate|写|`invalidateAfterTeamClaim`→rewards 桶（allowance/team/community/erc20）|手册成功后刷新|—|✅ 已对齐|—|—|—|—|Market skipConfirm 仍 `shouldInvalidate=true`|
|W-058|奖励|Mixed token 芯片|面板标 `tokenGagx`|读|`claim-panels` / `mixed.tokenGagx`|链 AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|改芯片/i18n 为 AGX|C-15|C-15|Lucky/Dao 共用|

## 4. 释放（L-）

**对照源指针：** [`research/dapp-tab-source-index.md` §4](./research/dapp-tab-source-index.md#4-release)  
**代码根：** `src/views/dapp/release/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|L-001|释放|Hub·释放池卡|释放中金额|读|`useReleaseHub`+`formatReleaseApiOrChainLabel`：`chainReady` 优先 `queueReleasing`；无钱包用 API|手册 §12 RewardQueue（releasing≈total−claimable）|`/release-pool/summary` `releasing_amount`|🔍 待核实|待核实|Prod 对账释放中金额后再抬 ✅|—|B-29|R2 确认🔍；金额 4 位；B-29 仍成立|
|L-002|释放|Hub·释放池卡|「可领取」金额|读|`use-hub` 注释勿把累计 `released_amount` 当可领；`apiQueueClaimableRaw=released−claimed`；有链用 `totalClaimable`|手册 §12 claimable|`/release-pool/summary`（派生；有链不用）|🔍 待核实|待核实|Prod 对账可领取金额后再抬 ✅|—|—|R2 确认🔍；标签=`可领取`|
|L-003|释放|Hub·释放池卡|进度 %|读|`formatReleasePct`←`releaseProgressBps(claimable,releasing)`|手册 §12 进度语义|—|✅ 已对齐|—|—|—|—|—|
|L-004|释放|Hub·释放池卡|单位文案|读(Copy)|`t.release.units.queue='gAGX'`；`formatReleaseApiOrChainLabel` unit 同源|手册 §12 `token()`=AGX；稿/i18n 写 gAGX|api.md 标 gAGX|🟡 部分|文案/单位与链不匹配（稿如此）|改 i18n `units.queue`→`AGX`（全 locale）；队列 Num 后缀跟改；产品确认后同步稿|C-07 · A-12|C-07|数已接线；错在单位标签|
|L-005|释放|Hub·缓冲池卡|AGX Total（池内剩余）|读|`bufferTotalAgx`：链=`claimable+releasing`；API=`releasing_amount`；注释勿用累计入池|手册 §13 PRV/分流器剩余|`/buffer-pool/summary` `releasing_amount`|🔍 待核实|待核实|Prod 对账缓冲 AGX Total 后再抬 ✅|—|—|R2 确认🔍；「releasing」=池内剩余|
|L-006|释放|Hub·缓冲池卡|AGX「可领取」|读|`apiRaw: undefined`；只信链 `agx.totalClaimable`|手册 §13 `claimableAmount`|—（API 无同口径 claimable）|🔍 待核实|待核实|Prod 对账缓冲 AGX 可领后再抬 ✅|A-16|A-16|R2 确认🔍|
|L-007|释放|Hub·缓冲池卡|gAGX Total|读|`gagxTotalLabel`=`gagx.claimable+releasing`；未连钱包 `0`；audit「勿当假零」|手册 §13 多 token 桶|—（API 无 gAGX summary）|🔍 待核实|待核实|Prod 对账 gAGX Total 后再抬 ✅|—|—|R2 确认🔍：money-bar；断连→0 不另标 🟡|
|L-008|释放|Hub·缓冲池卡|gAGX「可领取」|读|Hub 绑 `bufferClaimableGagx`←链 `gagx.totalClaimable`；与 AGX 对称|手册 §13|—|🔍 待核实|待核实|Prod 对账 gAGX 可领后再抬 ✅|—|—|R2 确认🔍：同 L-007 不双降 🟡|
|L-009|释放|Hub·缓冲池卡|进度 %|读|`bufferPct=formatReleasePct(agxClaimable,agxReleasing)`；**不含** gagx|产品入场卡单一进度|—|🟡 部分|设计取舍（故意空/0）|产品确认仅 AGX 进度可接受则关缺口；否则合入 gagx 或进度下钻子页|—|—|gAGX 细节在 Buffer 子页|
|L-010|释放|Hub·Detail|税率表周期/税率|读|`taxBps/100`；`useReleaseQueuePlans`；空则 i18n fallback|手册 §12 `queuePlans` feeRate|—|✅ 已对齐|—|—|—|—|算法跟链 plans；本轮未 Prod 对拍具体 bps|
|L-011|释放|Hub·Detail|aboutSlides / purpose|读(Copy)|Visible 文案；无动态数|产品叙事|—|✅ 已对齐|—|—|—|—|—|
|L-012|释放|Hub·Detail|mechanismSteps「6:1」|读(Copy)|`zh.ts` hub.mechanismSteps：title「6 : 1 贡献机制」；body「50% 销毁 · 50% 注入 X 底池」|FE 信链 `quoteRequiredContribution`（≈amount/6→6:1）；body 实为 burn `splitBps` 叙事|—|🟡 部分|文案/单位与链不匹配（稿如此）|改该步 body：写清 Mixed 消耗贡献≈领奖额/6（跟链 quote）；删/迁 50% 销毁·注入（属 exchange burn）|C-06|C-06|R2 确认🟡：title 对；body 串台|
|L-013|释放|Hub·FAQ|「领取的 gAGX 去向」题干|读(Copy)|题干写 gAGX；答案已澄清 AGX→Turbine|手册 §12→§16|—|🟡 部分|文案/单位与链不匹配（稿如此）|FAQ 题干改 AGX（跟 L-004）；答案已对齐可保留|C-07|C-07|Visible+FAQ|
|L-014|释放|Queue·Dock|各档 claimable / releasing|读|`readReleaseQueueSnapshot` Multicall per-plan|手册 §12 分档 snapshot|—|🔍 待核实|待核实|Prod 对账分档 claimable/releasing 后再抬 ✅|—|—|R2 确认🔍；数字算法对|
|L-015|释放|Queue·Dock|单位 + token 图标|读(Copy)|`units.queue` + `gagxIcon`（`queue/dock.tsx`）；金额用 `AGX_DECIMALS`|链 token=AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 L-004 改单位；图标改 `agxIcon`；B-28 重审仍属 C|C-07|C-07|数算法对；错在标签/图标|
|L-016|释放|Queue·Dock|进度 % / USD hint|读|档内 pct + `useAgxPriceUsd`|手册 §12 + 价源|—|🔍 待核实|待核实|Prod 对账 USD hint（量×价）后再抬 ✅|—|—|R2 确认🔍|
|L-017|释放|Queue·Dock|领取 CTA 门闸|写·门闸|`canClaimWhen` + `releaseClaimBlockReason`：claimable>0 · writeReady · planIndex≥0 · unknown lock|手册 §12 领取前置|—|✅ 已对齐|—|—|—|—|—|
|L-018|释放|Queue·Dock|claim（unlock）|写|`submitReleaseQueueClaim`：pre→live 双读闸 → `claimAllVestedRewards(planIndex)` → `invalidateAfterReleaseClaim`|手册 §12 `claimAllVestedRewards`|—|✅ 已对齐|—|—|—|—|不真发；toast「涡轮配额」|
|L-019|释放|Queue·Dock|单档刷新|写·刷新|`readReleaseQueuePlanByDays` patch cache；不整表重拉|手册分档读|—|✅ 已对齐|—|—|—|—|—|
|L-020|释放|Queue·Detail|释放中 / 可领取 stats|读|B-29 链优先；图标仍 `gagxIcon`|手册 §12；有链优先|`/release-pool/summary` 派生可领|🔍 待核实|待核实|Prod 对账 Queue Detail 金额后再抬 ✅|—|C-07|单位见 L-004/L-015|
|L-021|释放|Queue·Detail|累计从释放池领取|读|无链 lifetime view；session 用 API `total_claimed_amount`；无 session→诚实 0|链无累计 view；API 有字段但标 gAGX|`/release-pool/summary` `total_claimed_amount`（标 gAGX）|🟡 部分|文案/单位与链不匹配（稿如此）|继续用 API 累计；后缀跟 C-07 改 AGX；无 session 保持 0|A-12|A-12|非「API 未提供」——缺的是链 lifetime + 单位|
|L-022|释放|Queue·Detail|释放池记录表|读|`mapReleasePoolLogToRow`；金额无单位后缀|手册流水|`/release-pool/logs`|✅ 已对齐|—|—|—|A-12|indexer 空态诚实|
|L-023|释放|Queue·FAQ|gAGX 去向|读(Copy)|题干 gAGX；答案「涡轮配额」未点名 AGX|手册 §12→Turbine AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|题干改 AGX；答案补「AGX 进涡轮配额」|C-07|C-07|—|
|L-024|释放|Buffer·Dock|AGX 可领 / 释放中|读|`useBuffer` 硬编码单位 `AGX` + `agxIcon`|手册 §13 AGX 桶|—|🔍 待核实|待核实|Prod 对账 Buffer Dock AGX 后再抬 ✅|—|—|—|
|L-025|释放|Buffer·Dock|gAGX 可领 / 释放中|读|分流器 gagx 桶；单位 `gAGX` + `gagxIcon`|手册 §13|—|🔍 待核实|待核实|Prod 对账 Buffer Dock gAGX 后再抬 ✅|—|—|—|
|L-026|释放|Buffer·Dock|intro `{days}`|读|`usePrincipalReleaseDurationDays` 插值 intro|手册 `effectiveDuration` / `DEFAULT_RELEASE_DURATION`|—|✅ 已对齐|—|—|—|—|—|
|L-027|释放|Buffer·Dock|提取 CTA 门闸|写·门闸|双卡共用；`canClaimWhen` 看 `totalClaimable`(AGX+gAGX)|手册 §13 可领>0|—|✅ 已对齐|—|—|—|—|—|
|L-028|释放|Buffer·Dock|claim（redeem/buffer）|写|`submitReleaseBufferClaim`：空窗跳过；各 hop `claimMany` + 归档 PRV；双闸；每跳后 invalidate|手册 §13 瀑布/`claimMany`|—|✅ 已对齐|—|—|—|—|非链尾→下游再释放|
|L-029|释放|Buffer·Dock|刷新|写·刷新|`bufferQuery.refetch()`|—|—|✅ 已对齐|—|—|—|—|—|
|L-030|释放|Buffer·Dock|claimSuccess 文案|读(Copy)|zh：「已提交领取，进入分流器释放」偏中继叙事|手册：链尾→钱包；中继→next|—|🟡 部分|文案/单位与链不匹配（稿如此）|toast 按 hop 区分链尾/中继；或统一「已提交领取」去向说明链上为准|—|—|优于旧「仅 AGX 进钱包」|
|L-031|释放|Buffer·Detail|AGX 累计进入/提取/释放中|读|链优先；无链回落 API cumulative/released/releasing|手册 §13|`/buffer-pool/summary`|🔍 待核实|待核实|Prod 对账 Buffer Detail AGX 三元组后再抬 ✅|—|—|—|
|L-032|释放|Buffer·Detail|gAGX 三元组|读|无钱包→0；仅链（API 无 gAGX）|手册 §13|—|🔍 待核实|待核实|Prod 对账 Buffer Detail gAGX 三元组后再抬 ✅|—|A-16 旁系|R2 确认🔍：同 L-007 不双降 🟡|
|L-033|释放|Buffer·Detail|缓冲记录表|读|`contract_address` 原值；金额无币种后缀|—|`/buffer-pool/logs`|✅ 已对齐|—|—|—|—|—|
|L-034|释放|Buffer·Detail|mechanismSteps「30 天缓冲」|读(Copy)|intro 已动态天数；步骤仍写死 30|`effectiveDuration` 可≠30|—|🟡 部分|文案/单位与链不匹配（稿如此）|mechanismSteps 插值 `{days}` 同源 `usePrincipalReleaseDurationDays`|—|—|—|
|L-035|释放|Buffer·FAQ|「AGX 直接进入钱包」|读(Copy)|zh：「点击提取，AGX 直接进入钱包」；忽略 next 瀑布与 gAGX|手册：仅链尾 `next==0`；可有 gAGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|FAQ 改为：链尾进钱包 / 中继进下游释放；并点名可含 gAGX（对齐 L-030/L-036）|—|建议新 C|与 L-030 成功文案不一致|
|L-036|释放|Buffer·FAQ|AGX/gAGX 双资产|读(Copy)|zh 已写「分流器释放单可为 AGX 或 gAGX」|手册 splitter 多 token|—|✅ 已对齐|—|—|—|—|audit 刻意不记假零|
|L-037|释放|Rail 红点|hasClaimable|读|`readReleaseHasClaimable` / host `use-release-rail-dot`：queue+splitter+archive|手册 §12–13|—|✅ 已对齐|—|—|—|—|Host 表面，能力属 release|
|L-038|释放|写后刷新|invalidateAfterReleaseClaim|写·刷新|`invalidateTabQueries('release')`；`TAB_QUERY_KEYS.release` 含 `releaseRoot`+`turbineRoot`+erc20+API|手册成功后刷配额/余额|release/buffer-pool API keys|✅ 已对齐|—|—|—|—|queue→涡轮配额可见性|
|L-039|释放|API 权威|release-pool summary 币种|读|有链时 Num 跟链；UI 标签仍 `units.queue`=gAGX|api.md「amount 均为 gAGX」vs 链 AGX|`/release-pool/summary`|🟡 部分|手册或API与链不符|后端改文档/字段标 AGX；FE 标签跟 C-07；禁止再把 API 单位当链单位|A-12|A-12|数源优先已对；错在权威单位文案|
|L-040|释放|API 权威|buffer-pool 无 claimable|读|FE 信链正确（`apiRaw: undefined`）|链有 claimableAmount；API 无|`/buffer-pool/summary`|🟡 部分|链/手册/API 未提供|后端补同口径 claimable 或文档标明「已提取≠可领」；FE 继续信链|A-16|A-16|审计「刻意不记为 FE 缺口」|
|L-041|释放|合约地址|RewardQueue proxy|读|`contracts.ts`←`VITE_BSC_REWARD_QUEUE`=`0x320feF8885283CbD1271aD1F39c5Fe694d56583C`（fail-closed）|`env/manual.bsc.addresses.env` 同址|—|✅ 已对齐|—|—|—|—|与入仓地址 env 一致；换源拷贝 env 即可|
|L-042|释放|Code 能力|`claimVestedReward` 单条|写|产品用按档 `claimAll`；单条无 UI|手册有单条；FE 仅 `claimAll`|—|⚪ 不适用|—|—|—|Z?|反查附录候选|
|L-043|释放|Code 能力|`claimVestedRewardsInRange`|写|FE 未暴露|手册有；产品未要|—|⚪ 不适用|—|—|—|Z?|—|
|L-044|释放|Queue 入队|enqueueReward|写|由 staking/rewards/bond 写入；本 tab 只领|仅 authorized callers|—|⚪ 不适用|—|—|—|—|unlock 入口在上游 tab|

---

## 5. 兑换（X-）

**对照源指针：** [`research/dapp-tab-source-index.md` §5](./research/dapp-tab-source-index.md#5-exchange)  
**代码根：** `src/views/dapp/exchange/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|X-001|兑换|Hub·程序卡|「交易 gAGX」→ 闪兑 + `pairId=gagx`|写|`hub/detail.tsx` `TRADE_GAGX_CARD_INDEX` + `setPairId('gagx')`|已实现 UI|—|✅ 已对齐|—|—|—|—|入口接线|
|X-002|兑换|Hub·程序卡|「获取 USD1」→ 闪兑 + `pairId=usdt`|写|`GET_USD1_CARD_INDEX` → `setPairId('usdt')`|手册 §7.2 Usd1Swap|—|✅ 已对齐|—|—|**B-02**|B-02|已关；重审仍跟链配置|
|X-003|兑换|Hub·程序卡|「涡轮 / 获取 AGX / 贡献点数」导航|写|`PROGRAM_TARGETS` → turbine/trade/burn|已实现 UI|—|✅ 已对齐|—|—|—|—|—|
|X-004|兑换|Hub·程序卡|「出售 X」入口|写|`PROGRAM_TARGETS[4]=null`；`TRADE_LIVE_TOKEN_KEYS` 无 `x`|链/产品 DEFER；手册 §7.1 仅 USD1↔AGX live|—|❌ 未接入|链/手册/API 未提供|产品决定：藏卡或标「即将开放」；开放时扩 `TRADE_LIVE_TOKEN_KEYS`+路径|— **A-02**|A-02|卡可见不可点；市价 picker 同|
|X-005|兑换|Hub·程序卡|「获取贡献点数」body `{ratio}`|读|`readBurnContributionSwapConfig` → `formatBurnContributionRatioColon`|手册 §9.2 `rateBps`|—|✅ 已对齐|—|—|—|—|非静态 1:6|
|X-006|兑换|Hub·FAQ|FAQ 文案「USDT→USD1」等|读(Copy)|`t.exchange.hub.faq` / program body「USDT」；余额跟 `getConfig().usdtToken`|手册叙事 USDT vs 链 `usdtToken`（现网常为 XX）|—|🟡 部分|手册或API与链不符|i18n/稿改跟链 symbol（或读 ERC20.symbol）；勿写死 USDT|— **A-01**|A-01|文案仍写 USDT|
|X-007|兑换|闪兑·概览|兑换比率 Tile|读|`FlashExchangeDetail` ← `overviewRateLabel`（spot）|gAGX 1:1 / `quoteUsd1Out`|—|✅ 已对齐|—|—|—|—|—|
|X-008|兑换|闪兑·概览|结算文案「链上 · 秒到」|读(Copy)|`t.exchange.flash.settlementValue`|产品文案|—|✅ 已对齐|—|—|—|—|非金额|
|X-009|兑换|闪兑·USDT 对|输入币余额 / allowance|读|`readFlashUsdtBalances` 用 `config.usdtToken`，禁 env 写死|手册 §7.2 `getConfig().usdtToken` + ERC20|—|🔍 待核实|待核实|样本钱包对照 `usdtToken.balanceOf`/allowance 与 Dock|**B-01**|B-01|接线跟链；金钱无 Prod；symbol 见 X-019|
|X-010|兑换|闪兑·USDT 对|USD1 余额|读|同上|ERC20 `USD1.balanceOf`|—|🔍 待核实|待核实|样本对照 USD1.`balanceOf` 与 Dock|**B-01**|B-01|接线在；金钱无 Prod|

|X-011|兑换|闪兑·USDT 对|`getConfig`（paused/min/max/reserve/rate/decimals）|读|`readUsd1SwapConfig`；`evaluateFlashUsd1Swap` 门闸|手册 §7.2 Usd1Swap|—|✅ 已对齐|—|—|—|—|decimals 跟 config|
|X-012|兑换|闪兑·USDT 对|预估 USD1 出|读|`readFlashPairQuote` → `quoteUsd1Out`|手册 §7.2|—|✅ 已对齐|—|—|—|—|—|
|X-013|兑换|闪兑·gAGX 对|gAGX↔AGX 余额；reverse 时 AGX allowance→gAGX|读|`readFlashGagxBalances`；forward 无需 approve|RedeemableGAGX / AGX|—|🔍 待核实|待核实|样本对照 gAGX/AGX.`balanceOf`（+ reverse allowance）与 Dock|—|—|接线在；quote=1:1；金钱无 Prod|
|X-014|兑换|闪兑·Dock|卖出/买入金额面值 + 余额 Label|读|`useFlashExchangeSession` + `formatTokenAmount`；未加载空串|上列链读|—|🔍 待核实|待核实|随 X-009/X-010/X-013 样本对拍 Label；未加载保持空串|—|—|不造 0；金钱无 Prod|

|X-015|兑换|闪兑·写|USDT→USD1：approve → live 重闸 → `swap` → invalidate|写|`submitFlashExchange`：approve 后 `assertStillSubmittable`+`evaluateFlashUsd1Swap`；`invalidateAfterExchange`；滑点 100bps|手册 §7.2|—|✅ 已对齐|—|—|**B-01**|B-01|minOut 非 0|
|X-016|兑换|闪兑·写|gAGX redeem / AGX wrap|写|`redeemGagxFlashExchange` / `wrapAgxFlashExchange` + approve-if-needed|gagx 合约|—|✅ 已对齐|—|—|—|—|—|
|X-017|兑换|闪兑·FAQ|「USDT→USD1」说明 / 单向路径|读(Copy)|`t.exchange.flash.faq` + pairs 标签 USDT|Visible+FAQ；语义单向正确|—|🟡 部分|手册或API与链不符|同 X-006/X-019 改币名|— **A-01**|A-01|币名叙事错|
|X-018|兑换|闪兑·FAQ|gAGX↔AGX 1:1 / 无滑点 / gAGX 可挖 X|读(Copy)|flash FAQ：1:1/无滑点；「也可质押挖矿 X」（Xmine 收 gAGX）|gAGX↔AGX；XStakingPool|—|✅ 已对齐|—|—|—|—|R2 确认✅分责；发放句归 X-055/C-08|

|X-019|兑换|闪兑·币对 UI|Segment/路由 symbol「USDT」|读|`EXCHANGE_CONFIG.tokens.usdt.symbol='USDT'`；余额地址跟链|链 token 实为 XX|—|🟡 部分|文案/单位与链不匹配（稿如此）|config/UI symbol 跟 `usdtToken` 实币或 ERC20.symbol|— **A-01**|A-01|标签≠合约名|
|X-020|兑换|市价·概览|池汇率 Tile|读|`useMarketTradeSpotRates` → detail|手册 §7.1 Router/pair spot|—|✅ 已对齐|—|—|—|—|—|
|X-021|兑换|市价·Dock|USD1/AGX 余额（live keys）|读|`useMarketTradeBalances`|手册 §7.1 ERC20|—|🔍 待核实|待核实|样本对照 USD1/AGX.`balanceOf` 与 Dock（X 余额旁路不 live）|—|—|R2 确认🔍；接线在|

|X-022|兑换|市价·Dock|Router allowance（卖出币）|读|同上 + `needsTokenApproval`|ERC20|—|✅ 已对齐|—|—|—|—|—|
|X-023|兑换|市价·报价|`getAmountsOut`；卖 AGX 先扣卖税净额报价|读|`fetchExchangeQuote` / `readAgxSellTaxBps` + `effectiveAgxSellTaxBps`（块额度）|手册 §7.1 AGX 卖税|—|✅ 已对齐|—|—|**B-35**|B-35|已关；非一律 extraSellBP|
|X-024|兑换|市价·Dock|价格影响 %|读|quote.`priceImpactBps`；高影响警告阈值|本地 `calcPriceImpactBps`|—|✅ 已对齐|—|—|—|—|—|
|X-025|兑换|市价·Dock|「预估 Gas」|读|`gasEstimate` 恒 `0n`（`exchange-read` 注释）→ 展示 `—`|无链/API gas 字段|—|✅ 已对齐|—|—|— **A-03**|A-03|非金额；诚实 `—`（A-03 记缺 gas 源）|
|X-026|兑换|市价·Dock|滑点 / `amountOutMin`|读/写门闸|`calcAmountOutMin`；提交 `assertStillSubmittable` 强制 refetch quote|手册 §7.1 用户滑点|—|✅ 已对齐|—|—|—|—|—|
|X-027|兑换|市价·Dock|路径标签 / Pancake deep link|读|`formatTradeRouteLabel`；仅 USD1↔AGX live|path helper|—|✅ 已对齐|—|—|—|—|—|
|X-028|兑换|市价·写|approve(sell→Router) → live balance+quote → `swapExactTokensForTokens` → invalidate|写|`submitMarketTrade`；deadline 由 write 层生成|手册 §7.1|—|✅ 已对齐|—|—|—|—|—|
|X-029|兑换|市价·Token picker|X 选项展示但不可选为 live|读|`isTradeTokenLive`；`TRADE_LIVE_TOKEN_KEYS=['usd1','agx']`|产品 DEFER|—|✅ 已对齐|—|—|— **A-02**|A-02|与 Hub 出售 X 一致；开通债见 X-004/A-02|
|X-030|兑换|市价·FAQ tabs|按代币 FAQ Copy|读(Copy)|`MarketTradeFaqTabs` + `t.exchange.faq.tabs`|Visible+FAQ|—|✅ 已对齐|—|—|—|—|无独立金额断言|
|X-031|兑换|销毁·Dock|AGX 余额 / allowance→ContributionSwap|读|`readBurnExchangeBalances`|手册 §9.2|—|🔍 待核实|待核实|样本对照 AGX.`balanceOf`/allowance→ContributionSwap 与 Dock|—|—|R2 确认🔍；接线在|
|X-032|兑换|销毁·Dock|当前贡献值|读|`readBurnUserStats`：`originalOf==0` 回退 user|手册 `originalOf`→`userContribution(root)`|—|🔍 待核实|待核实|样本对照 `userContribution(root)` 与 Dock 贡献值|**B-10**|B-10|R2 确认🔍；算法 closed；同 W-006/A-005|

|X-033|兑换|销毁·Dock|销毁比率 / 预估贡献点|读|config + `readBurnContributionQuote`；slippageBps=0|`rateBps` · `quoteContributionOut`|—|✅ 已对齐|—|—|—|—|—|
|X-034|兑换|销毁·Dock|去向「黑洞%·LP%」|读|dock destination + FAQ interpolate|`getSplitConfig().splitBps`|—|✅ 已对齐|—|—|—|—|—|
|X-035|兑换|销毁·概览|累计销毁 AGX / 获得·消耗贡献点|读|未连接用 config 全网 `totalBurned`/`totalContribution`；已连接用 userStats；标签无全网/个人区分|链 userStats vs 全网 config|—|🟡 部分|FE 读源/算法/门闸/刷新错误|改标签区分「全网/个人」或未连接也显个人空态|— **C-20**|C-20|静默切口径；非「故意空/0」|
|X-036|兑换|销毁·历史|burn-logs / consume-logs 表|读|`useBurnHistory`；需 `sessionReady`|—|`/agx-contribution/burn-logs` · `consume-logs`|✅ 已对齐|—|—|—|—|—|
|X-037|兑换|销毁·FAQ|比率/去向/不可转让等|读(Copy)|destination FAQ 注入 `burnPct/injectPct`|FAQ + 链 split|—|✅ 已对齐|—|—|—|—|—|
|X-038|兑换|销毁·写|approve AGX → live config/余额重闸 → `convert` → invalidate|写|`submitBurnExchange` + `evaluateBurnContributionSwap`|手册 §9.2|—|✅ 已对齐|—|—|—|—|刷 exchange（含 burn logs keys）|
|X-039|兑换|涡轮·概览|「待解锁 gAGX」数额|读|`readTurbineQuota`=`migratedFrom`+root；UI 拼 `gAGX`|手册 §16 `turbineBalances`（AGX wei）|—|🟡 部分|文案/单位与链不匹配（稿如此）|概览/Dock 标签改 AGX；数源保持 quota|— **A-04**/**C-01**；**B-04→C-01**|A-04,C-01,A-06|R2 确认🟡：单位主责；不双降🔍|
|X-040|兑换|涡轮·概览|「冷却中 gAGX」|读|`sumTurbineSilenceBuckets` 仅 cooling；不并入 vested|手册 silences ∧ `!isVested`|—|🟡 部分|文案/单位与链不匹配（稿如此）|同 C-01 改单位；分态保持|— **C-01**；**B-05**|C-01,B-05|R2 确认🟡：同 X-039 不双降🔍|
|X-041|兑换|涡轮·概览|「累计已提取」|读|`useTurbineSummary`→`claimed_total`；冷却/待解锁走链 silences；**不用** `unclaimed_total` 填冷却卡|API `claimed_total`；`unclaimed_total`≠冷却分态|`/turbine/summary` `claimed_total`|🔍 待核实|待核实|样本+JWT：`claimed_total` vs 链 cooled claims；确认非 wei；冷却卡继续只用 silences|— **A-05**|A-05|R2 确认🔍：金钱无 Prod；`unclaimed_total` API 债另记|
|X-042|兑换|涡轮·概览|三卡 USD hint|读|`formatAgxQuotaUsd`；无报价 → `$0.00`；claimed 用 API 小数×单价|`quoteUsdInForAgxOut(1 AGX)` × 量|claimed←`claimed_total`|🟡 部分|FE 读源/算法/门闸/刷新错误|无 `unitUsd` 时 hint 显 `—`（禁 `$0.00`）；claimed 腿随 X-041 Prod 后再抬|— **A-05**|A-05|缺价造 $0；claimed USD 绑 X-041|

|X-043|兑换|涡轮·Dock 解锁|可解锁额度 Label（gAGX）|读|`useTurbine` `unlockableAmountLabel` 硬拼 gAGX|同配额 AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|Label 改 AGX（C-01）|— **C-01**|C-01|—|
|X-044|兑换|涡轮·Dock 解锁|支付 USD1 / 将获 AGX 预览|读|预览=min(折减输入,quota)；`payUsd1Label`：quote `isError`/undefined→`formatNumber(0)`|`quoteUsdInForAgxOut` · `previewTurbineExpectedAgx`|—|🟡 部分|FE 读源/算法/门闸/刷新错误|quote 失败/加载中显 `—`；仅输入=0 才显 0；B-06 min(slip,quota) 算法保留|**B-06**|B-06|R2：quote fail→0 造零；happy-path 算法仍对|
|X-045|兑换|涡轮·Dock 解锁|冷却周期小时 / AGX 价 / 合约滑点%|读|session queries|`currentCooldownDuration` · quote · `swapSlippageBP`|—|✅ 已对齐|—|—|—|—|—|
|X-046|兑换|涡轮·Dock 提取|silence 列表金额+状态+CTA|读|dock map rows；vested 可点；可领在列表不进「冷却中」卡|`silences`+`isVested`|—|🟡 部分|文案/单位与链不匹配（稿如此）|列表金额单位改 AGX；分态保持（B-05）|— **C-01**；**B-05**|C-01,B-05|—|
|X-047|兑换|涡轮·写 解锁|approve(USD1) → live 重报价补授权 → `buyAgxAndStartCooldown(liveUsd)` → invalidate|写|`submitTurbineUnlock` 禁 approve(pre) send(live) 漂移；`evaluateTurbineUnlockLive`|手册 §16.4|—|✅ 已对齐|—|—|**B-07**|B-07|—|
|X-048|兑换|涡轮·写 提取|live `isVested` → `claimCooledGagx(i)` → invalidate exchange +（分流器）release + refetch silences|写|`submitTurbineClaim`；`splitterManager!=0` 则 `invalidateAfterReleaseClaim`|手册 §16.4–16.5|—|✅ 已对齐|—|—|—|—|swap-and-pop 后整表 refetch|
|X-049|兑换|涡轮·记录表|`/turbine/logs`|读|`useTurbineLogs` + presenter|—|`/turbine/logs`|✅ 已对齐|—|—|—|—|—|
|X-050|兑换|涡轮·机制/FAQ|「gAGX 进涡轮」「提取到钱包」等 Copy|读(Copy)|mechanism 冷却步已写分流器；FAQ「到钱包」/配额 gAGX；toast `claimSuccess` 已写分流器|配额 AGX wei；claim→分流器|—|🟡 部分|文案/单位与链不匹配（稿如此）|FAQ「到钱包」改「经分流器」；配额/单位改 AGX（C-01）；toast 已对齐勿重做|— **C-01**/**A-04**|C-01,A-04|mechanism≠FAQ|
|X-051|兑换|涡轮·配额账户|读 root vs 写/silence 用当前钱包|读|`readTurbineQuota` 走 migration root；silences(user)|链：quota@root（手册自相矛盾，FE 跟链）|—|✅ 已对齐|—|—|— **A-06**；**B-08**|A-06,B-08|FE 跟链；手册债不挡 ✅|
|X-052|兑换|涡轮·Rail 红点|有可领 silence|读|`readTurbineHasClaimable` / `use-turbine-exchange-rail-dot`|`isVested` 探测|—|✅ 已对齐|—|—|**B-05**|B-05|—|
|X-053|兑换|写后刷新（共享）|`invalidateAfterExchange` 覆盖面|写·刷新|tab keys：swap/erc20/flash/burn/turbine + turbine API + contribution logs|手册成功后刷新|turbine/agx-contribution API|✅ 已对齐|—|—|—|—|涡轮 claim 另刷 release|
|X-054|兑换|闪兑/市价/销毁|CTA 授权态 `needsApproval`（展示层）|读|`useExchangeQuote.needsApproval`；写内仍 `approve*IfNeeded`|allowance vs amountIn|—|✅ 已对齐|—|—|—|—|UI 可提示，写内再闸|
|X-055|兑换|共享 FAQ C-08 旁路|Flash「以 gAGX 发放/收到 gAGX」叙事|读(Copy)|`exchange.flash.faq`：「均以 gAGX 形式发放」「收到相应数量的 gAGX」；hub.faq 无此发放句|链结算 AGX；主责 shared C-08|—|🟡 部分|文案/单位与链不匹配（稿如此）|改 flash FAQ 发放句→AGX（或产品确认 gAGX 叙事）；1:1/挖 X 句仍归 X-018|— **C-08**|C-08|R2 确认🟡分责；与 X-018 ✅ 分拆保持|


---

## 6. 资产（A-）

**对照源指针：** [`research/dapp-tab-source-index.md` §6](./research/dapp-tab-source-index.md#6-assets)  
**代码根：** `src/views/dapp/assets/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|A-001|资产|Hub·总览|总资产价值 `totalValue`|读|`use-hub`→`stake_invest_usd_value`；Visible hint/FAQ 称「含未提取收益」；API 仅注 ACTIVE 投影|产品总估值 vs `user_performance.stake_invest_usd_value`|`/assets/reward-summary` `stake_invest_usd_value`|🔍 待核实|待核实|A-054 对账字段是否含未提取收益；不符则改 hint/FAQ 或扩口径|—|—|金钱；勿先标 ✅/🟡|
|A-002|资产|Hub·总览|可领取收益（展示）|读|Hub **禁用** API `claimable_gagx`（见 A-003）；链 `blockReward+extraInterest+profit`；标 gAGX；**不含** X/market/DAO/释放/涡轮|产品：仓位 Mixed 未领子集|API 宽口径故意不用|🟡 部分|文案/单位与链不匹配（稿如此）|标签跟 C-02；展示范围产品钉（非 API 打架——故意缩口）|A-13|open|单位/范围文案债|
|A-003|资产|Hub·总览|API 字段 `claimable_gagx`|读|类型有字段；`use-hub` 注释明确不直出|API reward-summary 宽口径|`/assets/reward-summary`|⚪ 不适用|—|—|A-13|open|故意不接线（设计取舍）；非死代码|

|A-004|资产|Hub·总览|累计已领取 `claimed`|读|session：API；链无累计 → 回退 `0.00 gAGX`|链无累计 view|`total_reward_claimed`|🔍 待核实|待核实|并入 A-054：样本对账 `total_reward_claimed`；单位见 A-047|B-21 旁路|—|金钱无 Prod；缺数显 0 属设计|
|A-005|资产|Hub·总览|我的贡献点数|读|apiReady→API；fallback→`readContributionSnapshot`|手册 §9.2|`available_contribution`|🔍 待核实|待核实|并入 A-054：样本对账 `available_contribution` vs 链|—|—|金钱/点数展示无 Prod|
|A-006|资产|Hub·总览 / FAQ|贡献消耗文案「1:1」|读(Copy)|`contributionHint`/FAQ「按 1:1」；写路径信链 quote|链 `quoteRequiredContribution` / divisor；手册 §9|—|🟡 部分|文案/单位与链不匹配（稿如此）|Copy 改跟链 `/6`（C-06）；写闸不动|C-06 · A-11|open|—|
|A-007|资产|Hub·持仓|可赎回已释放 `holdingsReleased`|读|禁用 API 流水语义；链 `redeemableReleasedWei`；活期 `releasedPrincipal=0n` 不计入|产品：Locked `getReleasedPrincipal` + Bond `pendingPayout`|`total_released_agx`（同名不同义，不用）|🟡 部分|文案/单位与链不匹配（稿如此）|标签与 API 解耦命名；活期可赎本金是否计入须产品拍板（C-04/B-12）|A-14 · C-04 · B-22|—|—|
|A-008|资产|Hub·持仓|总持仓 `holdingsTotal`|读|apiReady→API；fallback 链求和|—|`/assets/holdings-summary` `total_holdings_agx`|🔍 待核实|待核实|并入 A-054：样本对账 `total_holdings_agx`↔链四桶|—|—|金钱无 Prod|
|A-009|资产|Hub·缓冲|在池总量 / 已提取（AGX）|读|`bufferQuery` 不绑 API fallback 开关；有快照用链|手册 §13|`buffer_pool_releasing/released` 回落|🔍 待核实|待核实|并入 A-054：样本对账缓冲 AGX；claimable 仍信链|A-16|A-16|金钱无 Prod；API 无同口径 claimable|
|A-010|资产|Hub·缓冲|在池总量 / 已提取（gAGX）|读|`bufferGagx*`；API 未分 token；UI `bufferAsset` 切换|手册 §13 gagx 桶|—|🔍 待核实|待核实|并入 A-054：样本对账 gagx 桶；勿当假零|A-16|—|金钱无 Prod|
|A-011|资产|Hub·总览|`market_fund_claimable_agx`|读|类型有字段；Hub **无**展示/入口；rewards 有做市领取|做市津贴归属 rewards|`/assets/reward-summary`（未消费）|⚪ 不适用|—|—|—|A-13|同 Z-006；故意不展（设计取舍）|

|A-012|资产|Hub·Dock|质押卡 仓位/收益/APR|读|`formatAprFromRebase`：`epochsPerDay ?? 2`；仓位/收益另展|手册质押 APR|dist `stake_total_agx` + 链 yield|🟡 部分|FE 读源/算法/门闸/刷新错误|`epochsPerDay` 缺失时 APR 显 `—`/`APR_EMPTY`，禁静默 `?? 2`（同 S-057）；仓位/收益金额另随 A-054|B-23|—|R2 确认🟡；APR 算法债；金钱伞 A-054|

|A-013|资产|Hub·Dock|LP/销毁债券卡 仓位/收益/APR|读|`bondApr=APR_EMPTY` 注释写明；仓位/profit 另展|无独立 APR 源|`bond_lp`/`bond_burn` + 链 profit|🔍 待核实|待核实|样本对拍仓位/profit；APR 空源保持 `APR_EMPTY`（非假 rebase）|B-23|—|R2 确认🔍：仓位金钱无 Prod；APR_EMPTY 非过严|
|A-014|资产|Hub·Dock|X挖矿卡 仓位/收益/APR|读|Hub claimable **不含** X pending；卡上 yield 单独 X；APR=`yieldRateBP`|手册 §15|`stake_x_pool`|🔍 待核实|待核实|样本对拍 xmine 仓位/pending；可领不含 X 禁令保持|B-20 · B-23|—|R2 确认🔍；算法 closed|
|A-015|资产|Hub·分布|持仓分布图|读|`buildHoldingsDistributionView`|四模式 `positionUsd`|`/assets/holdings-distribution`|🔍 待核实|待核实|并入 A-054：样本对账 distribution `positionUsd` 占比|—|—|R2 确认🔍；Empty 接线保留|

|A-016|资产|Hub·Rebase 卡|Epoch/每日次数 Copy|读(Copy)|`hub.rebase.steps` 静态「约 12h / 每日 2 次」|链 `epoch().length`（Prod≠14400）|—|🟡 部分|文案/单位与链不匹配（稿如此）|跟质押 C-14：文案改跟 `epoch.length` 或删死数|C-14|open|—|
|A-017|资产|Hub·FAQ|「钱包闲置余额不计入」|读(Copy)|FAQ Visible；Hub=`stake_invest_usd_value` 仓位估值，不计钱包 `balanceOf`|产品 FAQ；余额见 host 弹窗/非本 tab|—|✅ 已对齐|—|—|A-048|—|闲置余额断言独立于 A-001「含未提取收益」；A-001/A-054 自担金额口径|
|A-018|资产|Hub·FAQ|收益形式 gAGX / X|读(Copy)|Hub FAQ：「Rebase 以 gAGX 计量；X 挖矿为 X」；未写「可直接挖 X」|链 Mixed→队列（多为 AGX）；Xmine→X|—|🟡 部分|文案/单位与链不匹配（稿如此）|「计量」单位跟 C-02/A-047 改 AGX；保留 X 区分|C-02 · C-08 旁|C-02|R2 确认🟡：X 区分对；gAGX 计量仍假|
|A-019|资产|Hub·FAQ|领取后进 RewardQueue/释放池|读(Copy)|FAQ 文案|手册 Mixed / RewardQueue|—|✅ 已对齐|—|—|—|—|—|
|A-020|资产|Hub·FAQ|缓冲池 AGX/gAGX|读(Copy)|FAQ + UI 切换|手册 §13|—|✅ 已对齐|—|—|—|—|—|
|A-021|资产|Position·质押|仓位列表字段（本金/已释放角标/收益/加成）|读|活期 `releasedPrincipal` 恒 `0n`（链无线性 released，非读错）；定期 `getReleasedPrincipal`；warmup 行独立|Locked `getReleasedPrincipal`；liquid 无对等|—|🟡 部分|设计取舍（故意空/0）|同 B-12：统计/角标是否排除 liquid 或改「待释放」口径|B-12 · A-08|**open**|FE 镜像链；产品口径未钉|
|A-022|资产|Position·质押·统计|我的持仓/已释放/待释放/Rebase/加成/总收益|读|`useAssetsPositionStats`：`pendingRelease=principal−released`；活期 released=0 → 待释放=全本金|同上|—|🟡 部分|FE 读源/算法/门闸/刷新错误|聚合排除 liquid 或改公式；单测钉口径|B-12|open|公式套用 locked 语义到 liquid|
|A-023|资产|Position·质押|Mixed 领取（弹窗+写）|写|`submitMixedClaim` dual-check + legs；`invalidateAfterAssetsClaim`→assets/staking/**release**|手册 §9 Mixed|—|✅ 已对齐|—|—|—|B-37|金额=0 仍可开弹窗（测试期）；链闸兜底|
|A-024|资产|Position·质押|本金赎回（活期全额 / 定期 claimable）|写|`submitStakeRedeem` warmup 禁；确认弹窗天数=`effectiveDuration`|手册 §8 / §13；live `readStakeRedeemableAmount`|—|✅ 已对齐|—|—|—|—|—|
|A-025|资产|Position·质押|激活活期 warmup|写|`submitLiquidWarmupClaim`；成功 refetch stake|手册 LiquidStaking `claim()`|—|✅ 已对齐|—|—|—|—|—|
|A-026|资产|Position·质押|操作记录|读|`useAssetsPositionOpsRows` + sessionReady|—|`/stake-flow/logs`|✅ 已对齐|—|—|—|—|—|
|A-027|资产|Position·质押·FAQ|领取 vs 赎回 / 已释放含义|读(Copy)|`products.stake.faq`|手册|—|✅ 已对齐|—|—|—|—|—|
|A-028|资产|Position·质押|EarlyStaking 仓位|读|`readStakePositions` 仅 liquid+180/360/540；无 Early；FE 无 Early ABI|手册 §8.4 EarlyStaking|—|🚫 阻塞|FE 缺接线|解阻 B-19 后：补 Early ABI+读仓位+领本金/Mixed UI|B-19|blocker|R2 确认🚫 trio：同 S-067·Z-001；禁假 Prod|
|A-029|资产|Position·LP债券|仓位卡本金/待赎/收益|读|`readLpBondPositions`；profit 展示后缀 gAGX|手册 §10；链 profit 入队多为 AGX|—|🟡 部分|文案/单位与链不匹配（稿如此）|标签改 AGX（C-02/A-047）；数源保持|C-02|C-02|R2 确认🟡：单位冲突；金额 Prod 另见仓位读源|
|A-030|资产|Position·LP债券|Mixed 领取 / 本金赎回|写|dual-check + `pendingPayoutFor` live|手册 §10|—|✅ 已对齐|—|—|—|—|—|
|A-031|资产|Position·LP·统计|「LP债券总收益」累计|读|末格现行 `'—'`；无累计源不硬编|—|无累计 API/链视图|✅ 已对齐|—|—|—|—|无源显示 `—`（非金额假零）；非 FE 读源缺口|
|A-032|资产|Position·LP·FAQ|复投周期「360/540」、缓冲「30 天」|读(Copy)|FAQ 写死；UI 计划来自 `readClaimPlans`；赎回天数 hook 链|链 plans / Manager.duration|—|🟡 部分|文案/单位与链不匹配（稿如此）|FAQ 插值链上计划/天数；写路径已动态|C-13|—|—|
|A-033|资产|Position·销毁债券|仓位读 + Mixed/赎回写 + 流水|读/写|与 LP 对称 `readBurnBondPositions`；profit 后缀 gAGX|同 LP · BurnBond|bond-flow burn|🟡 部分|文案/单位与链不匹配（稿如此）|读侧单位跟 C-02；写路径 dual-check 已齐勿重做|C-02|C-02|R2 确认🟡不拆行：写齐、读单位同 A-029|
|A-034|资产|Position·销毁·FAQ|同 LP 结构 + 销毁叙事|读(Copy)|FAQ Visible|手册 BurnBond|—|✅ 已对齐|—|—|—|—|—|
|A-035|资产|Xmine·仓位|`miningStake` / `pending` / warmup|读|不把 miningStake 冒充已释放；`readXminePosition`|手册 §15 `readXminePosition`|—|🔍 待核实|待核实|样本对照 miningStake/pending/warmup 与仓位卡；冒充已释放禁令保持|B-24|—|R2 确认🔍；算法 closed|
|A-036|资产|Xmine·统计|「已释放」格|读|代码 `released=0n` + 注释|无 PRV 映射字段|—|🟡 部分|设计取舍（故意空/0）|无 PRV 拆分源：改 `—` 或移除行（对齐 S-052）；禁固定 0|A-15 · A-16|—|R2 确认🟡：同 S-052 固定 0≠诚实空|
|A-037|资产|Xmine·统计|挖矿总产出（终身）|读|`useX0MiningLifetimeReward` 翻页累加|无协议累计 view|`/x0-mining/logs` REWARD|🔍 待核实|待核实|样本+JWT 对照翻页累加 vs 统计格|B-17|—|R2 确认🔍；翻页算法 closed|
|A-038|资产|Xmine|领取 X / 激活 warmup / 解押|写|`submitXmine*` + `invalidateAfterAssetsClaim`|手册 XStakingPool；dual-check|—|✅ 已对齐|—|—|—|—|—|
|A-039|资产|Xmine·FAQ|「24 小时锁定」|读(Copy)|FAQ 断言 24h；UI 有激活预热|链 warmupEndTime；须 `activateWarmup`|—|🟡 部分|文案/单位与链不匹配（稿如此）|FAQ 改「预热结束后须激活」；跟 C-03|C-03|open|—|
|A-040|资产|Xmine·FAQ|「每日 UTC 0 点结算」|读(Copy)|FAQ Visible|链连续计息 / settle|—|🟡 部分|文案/单位与链不匹配（稿如此）|对照手册结算语义改 FAQ 或删死时点|C-13|open|—|
|A-041|资产|Claim modal|释放/复投比例与计划|读|`readClaimPlans`；默认 release 60 / restake 540|链 RewardQueue plans|—|✅ 已对齐|—|—|—|—|—|
|A-042|资产|Claim modal|贡献不足门闸 + 前往销毁|读/写门闸|CTA `contributionOk && plansOk`；写内 dual-check 再闸|链 quote vs userContribution|—|✅ 已对齐|—|—|A-11|A-11|文案 1:1 见 A-006|
|A-043|资产|Claim modal|确认 Mixed 写 + 刷新|写|`invalidateAfterAssetsClaim` 含 **release** tab|手册 §9|—|✅ 已对齐|—|—|B-37|closed→✅|—|
|A-044|资产|Redeem confirm|释放天数文案|读|`usePrincipalReleaseDurationDays`；默认 30|Manager `effectiveDuration`|—|✅ 已对齐|—|—|—|—|—|
|A-045|资产|Redeem confirm|确认赎回写|写|live 重读可赎金额 `evaluateRedeem`|手册 claimPrincipal / bond redeem|—|✅ 已对齐|—|—|—|—|—|
|A-046|资产|Hub / API|登录优先 API，缺则链回退|读|session+apiReady：overview/summary/dist 走 API；yield/APR/可赎等无同口径仍链|`assetsHubNeedsChainFallback`|assets summary/dist|✅ 已对齐|—|—|B-21|closed→✅|符合读源优先|
|A-047|资产|全表面|收益/利润单位标 gAGX|读(Copy)|仓位/Hub/弹窗金额单位 gAGX|链多为 AGX 入队|部分 API 亦标 gAGX|🟡 部分|文案/单位与链不匹配（稿如此）|全局标签改 AGX（C-02/A-07）；冲突表可列不修数|C-02 · A-07|open|—|
|A-048|资产|（对照手册 §4）|AGX/gAGX/X/USD1/XX `balanceOf` 展示|读|现行 assets=仓位 Hub；FAQ 声明不计闲置；钱包弹窗仅 USD1|手册 §4.3|—|⚪ 不适用|—|—|—|—|产品形态≠手册「钱包资产页」（设计取舍）|
|A-049|资产|（对照手册 §4）|资产页全量 approve|写|无全量 approve；业务按钮各自检查|手册 §4.4 不建议|—|⚪ 不适用|—|—|—|—|符合手册交互（设计取舍）|

|A-050|资产|（对照手册 §4）|迁移 `isOldAccount` / canonical|读|assets 袋无迁移提示；迁移 UI 超出 Figma|AccountMigrationManager；staking 侧有闸|—|🚫 阻塞|FE 缺接线|等迁移页产品/稿 unblock；或 host 级轻提示|—|—|可链 host/迁移债；非「漏接可立刻修」|
|A-051|资产|Hub·总览|未连接 / API pending 零值占位|读|`zeroOverview`；DockConnectPromo|产品空态|—|✅ 已对齐|—|—|—|—|缺数/未连接显示 0（设计）|
|A-052|资产|Hub·可领|未登录可领是否含 X|读|`claimableGagxWei` 不含 `xPending`|产品|—|✅ 已对齐|—|—|B-20|closed→✅|—|
|A-053|资产|Position·活期|「已释放」角标|读|`badgeVisible={releasedPrincipal>0}` → 活期永不显示|链无线性 released|—|🟡 部分|设计取舍（故意空/0）|与 B-12 同修；角标/统计口径产品确认|B-12|open|与「随时可赎」并存易误解；非读源错误|
|A-054|资产|Hub 金钱字段|Prod 链/API 金额对账|读|无样本地址对账|L 杠（金钱须 Prod 只读）|相关 Hub 字段|🔍 待核实|待核实|样本+JWT 抽检 A-001/004/005/008/009/010（+claimable）|—|—|money-bar 伞行；字段行已各自 🔍|
|A-055|资产|API holdings-summary|`total_released_agx` 字段|读|FE 故意不用；用链可赎|API=缓冲已提+CLAIM_PRINCIPAL|`total_released_agx`|⚪ 不适用|—|—|A-14|—|正确规避同名不同义（设计取舍）|

|A-056|资产|Claim 展示额|弹窗金额单位 gAGX|读|`amountLabel` 后缀 gAGX|链 reward/profit wei|—|🟡 部分|文案/单位与链不匹配（稿如此）|弹窗单位改 AGX（C-02）|C-02|—|—|
|A-057|资产|Xmine FAQ / 上限|可质押上限叙事|读(Copy)|FAQ 有文案；assets 袋无上限 Num（在 staking xmine）|手册 X 挖矿上限|—|🔍 待核实|待核实|对照手册公式核 FAQ；上限 Num 主责 staking|—|—|—|
|A-058|资产|Hub APR 提示|aprHint Copy（未提取收益）|读(Copy)|Dock Tooltip；与卡上 yield 对齐|产品|—|✅ 已对齐|—|—|—|—|—|

---

## 7. 社区（CM-）

**对照源指针：** [`research/dapp-tab-source-index.md` §7](./research/dapp-tab-source-index.md#7-community)  
**代码根：** `src/views/dapp/community/`

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|CM-001|社区|Dock·绑定态|`isBound`（是否已绑定）|读|`use-referral.ts`→`readIsBindReferral`；`walletReady` 即可|手册 §5 `isBindReferral`；legacy §2|—（纯链）|✅ 已对齐|—|—|—|—|不要求 SIWE|
|CM-002|社区|Dock·已绑定面板|推荐人地址展示|读|`displayReferrer`（链 `readReferrer` 优先，缺则 API）；`usePerformance(sessionReady)`|手册 §5 `getReferral`；legacy §2|POST /performance（`invite_address`）|✅ 已对齐|—|—|B-30|B-30 closed|`referral.ts` 注释已写「链优先」；类型旧注「API 优先」过时非取数 bug|
|CM-003|社区|Dock·邀请链接（展示）|链接文案 `{host}/r/{short}`|读|`shared.tsx` `formatReferralLinkDisplay`；仓内无 `/r/` 路由|产品展示形态（≠绑定入口）|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|统一展示与复制：改 `formatReferralLinkDisplay` 为 `origin+pathname+?ref=`，或产品明确「展示串不可照抄」并改文案|C-19|C-19|用户照抄展示串无法建立推荐；真路径见 CM-004|
|CM-004|社区|Dock·复制邀请链接|剪贴板 URL|写|`use-community.ts`：`getRuntimeOrigin()+pathname+referralSharePath(addr)`|FE 约定 `?ref=`（`referral.ts`）|—（纯 UI）|✅ 已对齐|—|—|C-19（对照）|C-19|与展示形态分叉；复制路径正确|
|CM-005|社区|Dock·绑定输入预填|URL/`sessionStorage` pending 推荐人|读|`parseReferrerFromSearch`→`PENDING_REFERRER_KEY`；仅预填|FE `?ref=`；手册 §5 须显式 `bindReferral`|—（纯 UI）|✅ 已对齐|—|—|—|—|不自动写链|
|CM-006|社区|Dock·绑定按钮|`canBind` 门闸|读|`use-referral.ts`：须 `isFetched`∧¬loading∧未绑∧有输入|手册 §5 绑定前置|—（纯链）|✅ 已对齐|—|—|B-38|B-38 closed|父节点合法性在 mutate 预检|
|CM-007|社区|Dock·绑定|`bindReferral(parent)`|写|`isReferralParentAllowed`（已绑或 root）；`WRITE_PATH.REFERRAL_BIND`；自荐/非法软错|手册 §5 `bindReferral`；legacy §2|—（纯链）|✅ 已对齐|—|—|—|—|冷却 5s；unknown→path lock|
|CM-008|社区|Dock·绑定成功后|缓存刷新|写|`invalidateAfterReferralBind`→community 桶（`chain.referral`+team/performance）|FE invalidate 约定|—（纯 UI）|✅ 已对齐|—|—|—|—|成员表仍等 indexer|
|CM-009|社区|Dock·未连接|绑定/链接隐藏；仅外链+Connect|读|`dock.tsx` `CommunityDisconnectedDock`|UI 基线（已实现）|—（纯 UI）|✅ 已对齐|—|—|—|—|不造空成员态（与 Detail 一致）|
|CM-010|社区|Detail·统计卡|直推人数 `direct_referral_count`|读|`detail.tsx`←`useTeamOverview`|API 一期 team；读源优先 overview|POST /team/overview|✅ 已对齐|—|—|—|—|采纳 API；链 `getReferralCount` 未展≠缺口|
|CM-011|社区|Detail·统计卡|直推业绩 `direct_presale_volume`（`$`）|读|`formatNumber(...,{prefix:'$'})`+`volumePrefix`|API 一期 team（金钱）|POST /team/overview|🔍 待核实|待核实|Prod 样本地址+SIWE：对账 overview.`direct_presale_volume` 与 indexer/`user_performance`|—|—|接线正确；金钱 L 未做|
|CM-012|社区|Detail·统计卡|社区人数 `descendant_count`|读|overview；叙源 `referral_ancestors` 全下级|API 一期 team|POST /team/overview|✅ 已对齐|—|—|—|—|链无廉价等价；采纳 API|
|CM-013|社区|Detail·统计卡|社区业绩 `sales_team_market`（`$`）|读|同 CM-011 展示前缀|API 一期 team（金钱）|POST /team/overview|🔍 待核实|待核实|同 CM-011：Prod 对账 `sales_team_market`|—|—|接线正确；金钱 L 未做|
|CM-014|社区|Detail·统计卡|共建等级（创世 S*）|读|`useShareholderRank`→`displayPresaleRank(performance.presale_rank)`；**不用** `making_rank`|手册 §6 预售等级；API performance|POST /performance（`presale_rank`）|✅ 已对齐|—|—|—|—|未登录/未 SIWE 显 S0；注释硬约束|
|CM-015|社区|Detail·统计卡|`today_addition_*` 四字段|读|Detail 注释无「今日」行；i18n `statToday` 未接线|API 类型有字段；产品未展|POST /team/overview（未消费）|⚪ 不适用|设计取舍（故意空/0）|—|—|—|能力在 API，产品未展|
|CM-016|社区|Detail·统计卡|已连钱包未 SIWE 时数值|读|`walletReady&&!sessionReady`→不请求 overview，卡面 **0/S0**；表走 Auth 空态|连接≠登录（AGENTS）；UI 门闸|—（纯 UI）|🟡 部分|设计取舍（故意空/0）|产品二选一：`needsSignIn` 时统计卡改 Sign-in CTA/骨架，或文案标明「登录后可见」避免假零|—|—|非 loading 骨架|
|CM-017|社区|Detail·成员标题|`我的社区成员（{count}）`|读|`direct_referral_count ?? referrals.total`；未登录固定 0|API overview/referrals|POST /team/overview · POST /team/referrals|✅ 已对齐|—|—|—|—|同源采纳 API|
|CM-018|社区|Detail·成员表|加入时间 `register_time`|读|`mapTeamReferralToCompactRow`→`formatRegisterDate`|API 一期 referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-019|社区|Detail·成员表|地址|读|`ExplorerLink`←`item.address`|API 一期 referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-020|社区|Detail·成员表|列「参与共建」← `presale_volume` `$`（标签）|读|表头 i18n `shareholder`=「参与共建」对个人认购额（有 `$`）；`mapTeamReferralToCompactRow`|文案 SSOT i18n；API referrals|POST /team/referrals|🟡 部分|文案/单位与链不匹配（稿如此）|改 `zh.ts` `community.shareholder`（及各 locale）为「个人业绩/认购额」，或产品确认「参与共建」即认购额|—|—|R2：只记标签语义；金额 Prod→CM-033|
|CM-021|社区|Detail·成员表|共建等级 `presale_rank`|读|`formatTableGenesisRank`（缺/0→`-`）|API referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-022|社区|Detail·成员表|直推人数 `direct_referral_count`|读|行内人数|API referrals|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-023|社区|Detail·成员表|列「社区业绩」← `sales_team_market`|读|`mapTeamReferralToCompactRow`：**无 `$`**（概览卡有 `$`）|文案/展示一致性；API referrals|POST /team/referrals|🟡 部分|文案/单位与链不匹配（稿如此）|`shared.tsx` 对 `sales_team_market` 加 `prefix:'$'`，与统计卡对齐|—|—|同字段展示不一致|
|CM-024|社区|Detail·成员表|分页 `total` / page|读|`Table.Pagination`；`keepPreviousData`|API Paginated|POST /team/referrals|✅ 已对齐|—|—|—|—|—|
|CM-025|社区|Detail·成员表|未登录 Auth 空态|读|`dappTableViewState`+`WalletConnectChip`|连接≠登录；UI 基线|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|CM-026|社区|Detail·邀请引导|三步文案（分享/共建/奖励）|读|`inviteFlow`「链接注册后即可」；真路径=连钱包+显式绑定|i18n Copy；手册 §5|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|改 `community.inviteFlow`：写明须连接钱包并在社区页绑定推荐人|—|—|Visible Copy|
|CM-027|社区|Detail·生态支持|创世期数 `{season}`|读|`useGenesisPromoChrome().activeSeasonNumber` 填 program label；无活期时 store/`GenesisPromoSync` **回退 1**（同 H-019）|手册 §6 / Genesis promo（H-019 同源）|—（纯链）|🟡 部分|设计取舍（故意空/0）|同 H-019：无活期/加载中 season 显 `—`（禁回退 1）|← H-019|—|R2 确认🟡：不塌并；可见 call site；修点仍 H-019|
|CM-028|社区|Detail·生态支持|Notion 外链 CTA|读|`program.href`；无链上数|静态配置 / i18n|—（纯 UI）|⚪ 不适用|—|—|—|—|—|
|CM-029|社区|Detail·FAQ|「邀请关系…自动建立且永久」|读|FAQ；链须 `bindReferral`，链接仅预填|i18n FAQ vs 手册 §5|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|改 FAQ：绑定须用户确认上链；「永久」仅指绑定成功后|—|建议新 C|永久一经绑定则真|
|CM-030|社区|Detail·FAQ|「创世推荐奖励 3%…压缩」|读|i18n FAQ；本页无金额 Num；`RewardLogItem.order_amount` 注 `floor(amount/0.03)`|i18n；`src/shared/api/types/community.ts`（非 api.md）|—（纯 UI）|✅ 已对齐|—|—|—|—|静态比率 Copy≠展示金钱；领取归 rewards|
|CM-031|社区|Detail·FAQ|「S1 至 S10」晋升|读|与 `MAX_PRESALE_RANK=10` / `formatPresaleRank` 一致|i18n FAQ；`core/presale/rank`|—（纯 UI）|✅ 已对齐|—|—|—|—|—|
|CM-032|社区|Dock·快捷外链|docs/youtube/…|读|`communityQuickLinkItems`|静态 `community-links.ts`|—（纯 UI）|⚪ 不适用|—|—|—|—|—|
|CM-033|社区|Detail·成员表|行内 `presale_volume`（`$` Num）|读|`mapTeamReferralToCompactRow`→`formatNumber(volume,{prefix:'$'})`；非 overview 聚合|API 一期 referrals（金钱）|POST /team/referrals|🔍 待核实|待核实|Prod 样本+SIWE：对账 referrals.`presale_volume` 与表行 `$`；禁假 Prod|—|—|R2：要独立🔍（≠CM-011 `direct_presale_volume`）；标签债仍 CM-020|

---

## 8. 共建（GN-）

**对照源指针：** [`research/dapp-tab-source-index.md` §8](./research/dapp-tab-source-index.md#8-genesis共建--预售)  
**代码根：** `src/views/dapp/genesis/`（勿与 `rewards/genesis` 混淆）

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|GN-001|共建|Dock·季卡轮播|全部 `phases()`（名/状态 LIVE·Ended·Upcoming）|读|`readAllPresalePhases`→`seasonOptionsFromPhases`→`GenesisSeasonCarousel`|手册 §6.3 `getPhaseCount`+`phases`|—（纯链）|✅ 已对齐|—|—|—|—|无 phase→骨架；接线正确；本轮未重跑 Prod|
|GN-002|共建|Dock·季卡|阶段折扣 `%`（`discount` bps）|读|`SeasonCard` meta + dock intro via promo store|手册 §6.3 `phases.discount`|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-003|共建|Dock·季卡|阶段空投比例 `airdropValueRatio`|读|`desktopMeta.airdrop` `+N%`/`—`|手册 §6.3|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-004|共建|Dock·季卡|阶段起止日期|读|`formatPhaseDateRange`→季卡 `date`|手册 §6.3 `startTime`/`endTime`|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-005|共建|Dock·季卡|折后参考价 `≈ $x`（`agxPrice×(1−discount)`）|读|`seasonOptions.price` 已算；`primitives-season.tsx` `SeasonCard` **不渲染** `price`|手册 §6.3 展示字段|—（纯链）|❌ 未接入|FE 缺接线|在 `SeasonCard` 渲染 `season.price`，或删除未用 `price` 字段（YAGNI）|—|—|Code 有、UI 无|
|GN-006|共建|Dock 字幕|进行中期号 + 折扣 intro|读|`formatGenesisSeasonIntro`←`activeSeasonNumber`+`discountLabel`；折扣无活期→`—`；**季号无活期回退 1**（`GenesisPromoSync`）|手册 §6 活动阶段|—（纯链）|🟡 部分|设计取舍（故意空/0）|同 H-019：无源 season 显 `—`；折扣空态已诚实|← H-019|—|R2 确认🟡：不塌并；折扣✅；季号同源伪造|
|GN-007|共建|Dock·份额标签|1 份 = `minAmount` USD1；最大份数|读|`shares` 插值 `formatTokenAmount(minAmount)`+`genesisMaxShares`；`sharePriceWei`=`minAmount`|手册 §6.4 `BASE_UNIT`/`minAmount`|—（纯链）|🔍 待核实|待核实|Prod eth_call `phases(i).minAmount` 对拍份额标签 `{min}` USD1|—|—|展示金钱（同 GN-008 源）；接线在；L 未做|
|GN-008|共建|Dock·清单|「本期共建额度」min–max|读|`quotaLabel`（`genesisPurchaseSummary`）←phase `minAmount`/`maxAmount`|手册 §6.3 `minAmount`/`maxAmount`|—（纯链）|🔍 待核实|待核实|Prod eth_call `phases(i)` 对拍 Dock `quotaLabel` 上下限|—|—|接线在；金钱 L 未做（同 CM-011 口径）|
|GN-009|共建|Dock·清单|「支付」USD1 金额|读|`payUsd1Label`=`shares×sharePriceWei(minAmount)`|手册 §6.4|—（纯链）|🔍 待核实|待核实|有活期阶段时对拍 `shares×minAmount` 与清单「支付」|—|—|接线在；金钱 L 未做|
|GN-010|共建|Dock·清单|「将获得 AGX」估算|读|`estimateAgxFromUsd1` 已接线展示；Prod 无活期阶段未对拍购后记账|展示估算（非链 getter）|—（纯链）|🔍 待核实|待核实|有活期阶段后：对拍一笔购后 AGX 记账 vs `estimatedAgxLabel`；偏差则改公式或 UI 标「预估」|—|—|接线在；金额 L 未做|
|GN-011|共建|Dock·清单|「认购价值」USD|读|`estimateContributionValueUsd`=`amount/(1−discount)`，非链 getter|产品公式（无同名链字段）|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|改标签/说明为「折前等值 USD」，或产品确认「认购价值」即该公式|—|—|数已展；标签≠链 AGX|
|GN-012|共建|Dock·清单|「将获得 X 初始空投价值」|读|`usePresalePreviewAirdropValueQuery`→`addedAirdropValue`|手册 §6 `previewAirdropValue`|—（纯链）|🔍 待核实|待核实|有活期+样本份额：对拍 `previewAirdropValue.addedAirdropValue` 与清单空投行|—|—|接线在；0→`$0`；金额 L 未做（旁系 GN-010）|
|GN-013|共建|Dock·空投 hint|门槛文案「单期累计 ≥ {threshold}」|读·Copy|`use-genesis-dock`：loading/null 仍插 `—`；产品缺数宜 0|手册/legacy 门槛；i18n `xTokenAirdropHint`|—（纯链）|🟡 部分|设计取舍（故意空/0）|loaded∧null→插 `$0`；仅 `airdropThresholdLoading` 用 `—`（与 B-42 收口）|← B-42|B-42|对齐为 0 属展示收口|
|GN-014|共建|Dock·空投门槛数值|`AIRDROP_THRESHOLD`|读|`readPresaleAirdropThresholdWei`→`presaleAirdropThresholdToUsd`；无硬编码|ABI `AIRDROP_THRESHOLD`|—（纯链）|🔍 待核实|待核实|Prod eth_call `AIRDROP_THRESHOLD` 对拍 hint/FAQ `{threshold}`；禁手册常量冒充 Prod|—|—|接线 live；前版「Prod cast/L」无本轮证据→降级|
|GN-015|共建|Detail·全球卡|`totalPurchasedAmount`|读|`usePresaleTotalPurchasedQuery`←`readTotalPresalePurchased`；loading Skeleton|手册 §6.3|—（纯链）|🔍 待核实|待核实|Prod eth_call `totalPurchasedAmount` 对拍全球卡|—|—|接线在；前版「Prod=0」无本轮证据→降级|
|GN-016|共建|Detail·进度头|「本期共建」当前/上限|读|`userPhaseAmountCurrent` / `seasonContributionMaxWei`（limit>0?limit:maxAmount）|手册 `getUserPhaseRemainingAmount`|—（纯链）|🔍 待核实|待核实|样本钱包+活期：对拍 `getUserPhaseRemainingAmount` 与进度头|—|—|接线在；须钱包；root 见 GN-037；金钱 L 未做|
|GN-017|共建|Detail·页脚|「累计共建」`userTotalAmount`|读|`usePresaleUserTotalQuery`←`readUserPresaleTotal`(migration root)→footer `$`|手册 `userTotalAmount(root)`|—（纯链）|🔍 待核实|待核实|样本钱包对拍 `userTotalAmount(root)` 与页脚累计|—|—|接线在；金钱 L 未做|
|GN-018|共建|Detail·贡献表|销售日志分页行（含 `$` amount）|读|`useSalesLogs`+`sessionReady`；`mapSalesLogToDesktopRow` 展 `amount` 为 `$`；未登录 Auth 槽|API 一期 sales|POST /sales/logs|🔍 待核实|待核实|样本+JWT：对账 `/sales/logs`.`amount` 与表行 `$`；门闩 `sessionReady` 已对|—|—|门闩✅；行内金钱 L 未做（同 CM-011）|
|GN-019|共建|Detail·贡献表|行内「预计 AGX」|读|`formatSalesLogAgx`：优先 `item.tokens`，否则 `estimateAgxFromUsd1`（无「预估」后缀）|API tokens 或 FE 回退估算|POST /sales/logs（`tokens`）|🟡 部分|文案/单位与链不匹配（稿如此）|`tokens` 缺失时行内加「预估」后缀；有 tokens 则直接展示|—|—|回退未标注；非缺接线|
|GN-020|共建|Detail·贡献表|行内折扣|读|`phaseDiscountBps`+`formatDiscountBps`←链 phases|手册 `phases[phase_id].discount`|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-021|共建|Detail·同步 hint|链有累计、API 空表|读|`userTotal>0&&rows==0`→`contributionsSyncPending`；购后 `pollGenesisContributions`|产品同步态|POST /sales/logs|✅ 已对齐|—|—|—|—|—|
|GN-022|共建|FAQ|`{phaseCount}`/`{discounts}`/`{phaseQuotas}`/`{minUsd}`/`{shareIncrement}`/`{airdropRatios}`/`{threshold}`|读·Copy|`genesisFaqTemplateValues` 填入 FAQ（`threshold`←同 GN-014；`minUsd`/`phaseQuotas`←phases）|手册 §6 phases|—（纯链）|🔍 待核实|待核实|随 GN-014/GN-008 Prod：对拍 FAQ `{threshold}`/`{minUsd}`/`{phaseQuotas}`；模板接线保留|← GN-014|—|接线在；插值金钱无 Prod→跟 GN-014 降级；`phaseDurationDays`→Z-016|
|GN-023|共建|FAQ|空投资格「单账户累计」vs 链/hint「单期累计」|Copy|zh FAQ「单账户累计」；hint「单期累计」；链 per-phase|手册：单档/单期累计超门槛|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|改 `zh.ts` genesis FAQ 空投条为「单期累计」，与 `xTokenAirdropHint`/链一致|C-10|C-10|R2 确认🟡：wired-wrong（同 S-012）；≠❌|
|GN-024|共建|FAQ|「X 空投 12 月线性释放 / 合约自动」|Copy|FAQ 承诺释放；FE 无 `claimAirdrop` 入口（GN-041 正确未接）|产品：空投仅价值统计|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|删/改 FAQ 释放承诺；改为「空投价值累计、无站内领取入口」（对齐 GN-041）|C-11|C-11|R2 确认🟡：Copy 错≠能力未接；能力 GN-041 ✅|
|GN-025|共建|FAQ / errors|「100 USD」倍数文案|Copy|`errors.invalidAmount`「100 USD」；份额标签已写 USD1|`BASE_UNIT=100e18` **USD1**|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|全 locale 将 `invalidAmount` 改为「100 USD1」|C-12|C-12|R2 确认🟡：错误已展；wired-wrong≠❌|
|GN-026|共建|FAQ|「AGX 540 天释放周期」|Copy|无 Genesis 侧释放/领取接线；purchase 不转入钱包 AGX|购后记账≠本页可领|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|改 FAQ：购后为链上累计记账，非本页即时到账/可领；到账路径见释放/资产章|—|建议新 C|R2 确认🟡：文案已接线；勿暗示本页可领|
|GN-027|共建|Dock|阶段倒计时 Num（starts/ends）|读|`useGenesisCountdownClock` 写入 session；`GenesisPurchaseForm` **无消费**；i18n 有 `startsIn`/`endsIn`|手册 `startTime`/`endTime`|—（纯链）|❌ 未接入|FE 缺接线|在 Dock/`FormInfoCard` 渲染 `countdown`+`countdownMode`，或删死文案与组装|—|—|现仅驱动 `invalidateAfterGenesisPhaseTransition`|
|GN-028|共建|Dock|AGX 开盘参考价展示|读|`referencePriceLabel` 已组装（`agxPriceUsd`；缺价→`$0.00`）；i18n `referencePrice`；Dock/`FormInfoCard` **未渲染**|手册 `agxPrice()`|—（纯链）|❌ 未接入|FE 缺接线|清单加 `referencePrice` 行，或删未用 label/i18n；季卡见 GN-005|—|—|R2 确认❌：同 GN-005 Code有UI无；未渲染≠🟡；接上后须禁缺价`$0`；禁假 Prod/$55|
|GN-029|共建|Dock|USD1 余额展示|读|`usd1Balance` 参与 maxShares/门闸；`usd1BalanceLabel` 无 UI|ERC20 `balanceOf`；手册 §4/§6|—（纯链）|❌ 未接入|FE 缺接线|份额旁或清单展示 `usd1BalanceLabel`，或接受仅门闸用并删死 label|—|—|—|
|GN-030|共建|Dock|`paused()` 门闸|读|`isPaused`/`isPausedUnknown`→`canPurchase` false；购前 live 重读|手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|跟 live `paused`；本轮未重跑 Prod|
|GN-031|共建|Dock CTA|推荐未绑定 → 去绑定|读·写门闸|`needsReferralBind` 换 CTA；mutation 亦拦；`goBindReferral`|手册 `PreSaleUserNotBound` / §5|—（纯链）|✅ 已对齐|—|—|—|—|绑定 UI 在 community|
|GN-032|共建|Dock CTA|程序结束 / 即将开始|读|`isGenesisProgramEnded`；`seasonUpcoming` label|手册 phases 生命周期|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-033|共建|写·授权|`approve(USD1→PreSale)`|写|`approveUsd1ForPresaleIfNeeded` 合入购买 mutation|手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|无独立 Approve 按钮|
|GN-034|共建|写·购买|`purchase(phaseIndex,amount)`|写|`purchasePresale`；`WRITE_PATH.GENESIS`；前置 bound/paused/active/额度|手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|未真发交易；写路径接线完整|
|GN-035|共建|写·approve 后重闸|live：bound/paused/phase+user remaining|写门闸|`fetchLiveGenesisPostApprove`+balance/allowance 重读|AGENTS 写链；手册 §6.4|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-036|共建|写·成功后刷新|链查询 + sales 轮询|写刷新|`invalidateAfterGenesisPurchase` 乐观累加+`pollGenesisContributions`|手册成功后刷新表|POST /sales/logs|✅ 已对齐|—|—|—|—|—|
|GN-037|共建|读·迁移|额度/累计按 migration root|读|`readMigratedFrom`+`migrationStakeRoot` 于 userTotal/phase remaining|手册 presale 迁移 · §17|—（纯链）|✅ 已对齐|—|—|—|—|—|
|GN-038|共建|面板|`userPhaseAirdropValue` / `userTotalAirdropValue`|读|仅本次 `previewAirdropValue`（GN-012）；无累计空投 UI；`PRESALE_METHODS` 无此二 getter|稿/实现均未展累计空投面板|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|—|—|与 GN-012 不冲突：单笔 preview≠累计面板；无 ABI|
|GN-039|共建|面板|累计应得 AGX（链汇总）|读|仅当笔/行估算（GN-010/019）；无链累计 UI；`PRESALE_METHODS` 无 `userTotalAgx`|稿/实现均未展累计 AGX 汇总|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|—|—|与估算行不冲突；无 ABI 片段|
|GN-040|共建|边界|团队奖签名领取|写|UI 在 `rewards/genesis`；`invalidateAfterTeamClaim`|手册 RewardClaimer；legacy §4|POST /claim/team-reward 等（W- 章）|⚪ 不适用|—|—|—|—|归 **W-**；勿双计|
|GN-041|共建|边界|`claimAirdrop` 用户领取|读/写|FE 未实现；`PRESALE_METHODS` 无 claim 写方法|产品：空投仅价值统计（无站内领取）|—（纯链）|✅ 已对齐|—|—|—|—|ABI 无入口；与 GN-024 FAQ Copy 冲突（C-11）|
|GN-042|共建|空态 FAQ|`phases.length===0` 时 FAQ 插值|Copy|`ZERO_FAQ`：金额位 `$0`；`threshold` 仍 `—`（不读已加载门槛）|产品缺数=0 vs 诚实空|—（纯 UI）|🟡 部分|设计取舍（故意空/0）|`genesisFaqTemplateValues`：无 phase 时若门槛已知仍填 `$N`/`$0`，与 GN-013 同策|—|—|金额 0 合法；门槛 — 同簇|
|GN-043|共建|Host 角标（交叉）|rail/community 季号折扣 chrome|读|`useGenesisPromoChrome`；季号同源 **回退 1**（H-019）；折扣空→`—`（H-020）|同 phases/`agxPrice`|—（纯链）|🟡 部分|设计取舍（故意空/0）|同 H-019 修季号回退；折扣保持诚实空|← H-019|—|R2 确认🟡：不塌并；交叉证明同源；不占新 H-|

---

## 9. 代码反查附录（Z-）

**用途：** 手册/ABI/API 有能力但主章未落点、或跨章冲突的反查队列（非独立产品 tab）。  
**对照：** 各主章行 + A/B/C 链；改主章后同步本附录。

|行号|章节|页面/表面|数据或动作|读/写|代码位置|文档位置|API接口|状态|T1归因|修复方法|继承自|A/B/C链|备注|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Z-001|反查|EarlyStaking|claimPrincipal / claimRewardMixed / 仓位 UI|读/写|`abis.ts`/`contracts.ts`/`src/**` 均无 Early 符号（rg 空；codegraph 无节点）|手册 §8.4（B-19）|—（纯链）|🚫 阻塞|FE 缺接线|解阻 B-19 后：先补 Early ABI+地址，再接 assets/staking 仓位与领本金/Mixed|S-067·A-028|blocker（B-19）|R2 确认🚫 trio：S-067·A-028·Z-001；src 无 Early；禁假 Prod|
|Z-002|反查|Stake Dock|剩余额度 `meta.remaining` 展示|读|预检 `remainingQuota` 门闸用；Dock 未展示（S-019）|手册额度；产品未展|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|S-019|B-36|能力在门闸不在 UI|
|Z-003|反查|RewardGAGX|wrap / redeem|读/写|`flash-exchange-write.ts` `wrapAgxFlashExchange` / `redeemGagxFlashExchange`；非 staking tab|手册 gagx；兑换闪兑|—（纯链）|✅ 已对齐|—|—|X-016|—|反查确认归 exchange 闪兑 gAGX 对|
|Z-004|反查|RewardQueue|`claimVestedReward` 单条|写|FE 仅 `claimAllVestedRewards` 按档（L-042）|手册有单条；产品批量|—（纯链）|⚪ 不适用|设计取舍（故意空/0）|—|L-042|—|产品用批量|
|Z-005|反查|Connect warm prefetch|推荐绑定+多币暖热|读|`useConnectWarmPrefetch` / `prefetchConnectWarm`；无壳层展示|手册 §5；H-022|—（纯链）|✅ 已对齐|—|—|H-022|B-39|后台暖热非 UI|
|Z-006|反查|`market_fund_claimable_agx`|资产 Hub 未展示|读|类型有字段；Hub 缩可领子集（A-011/A-003）|API reward-summary|POST …/reward-summary（未消费）|⚪ 不适用|设计取舍（故意空/0）|—|A-011|A-13|做市津贴在 rewards|
|Z-007|反查|Sell X path|卖 X 交易|写|Hub 卡不可点；`TRADE_LIVE_TOKEN_KEYS` 无 `x`（X-004/X-029）|链/产品无卖 X|—（能力不存在）|⚪ 不适用|链/手册/API 未提供|—|X-004|A-02|能力不存在|
|Z-008|反查|invite link canonical|真实 `?ref=` vs 展示 `/r/`|读/写|`formatReferralLinkDisplay` vs `referralSharePath`（CM-003/004）|产品展示 vs FE 约定|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|同 CM-003：统一展示串或改文案|CM-003|C-19|冲突表|
|Z-009|反查|FAQ 空投线性释放|无合约入口断言|Copy|genesis FAQ（GN-024）；手册无用户 `claimAirdrop`|新手册沉默领取|—（纯 UI）|🟡 部分|文案/单位与链不匹配（稿如此）|同 GN-024 改 i18n|GN-024|C-11|R2 确认🟡：随 GN-024 wired-wrong；≠❌|
|Z-010|反查|DAO Mixed 未签预览|只读预览 API|读|无未签只读接口；Hub 金额位故意 0（W-010）|产品设计；须签后 `/claim/dao-reward`|—（API 未提供预览）|⚪ 不适用|—|—|W-010|A-21|R2：能力 N/A 保持⚪；已登录造 0 缺口在 W-010 🟡|
|Z-011|反查|Hub 趋势图序列|历史序列|读|公开 POST；无需登录（S-011/S-028）|protocol-market-stats|POST /protocol-market-stats/series|✅ 已对齐|—|—|S-011|A-18|—|
|Z-012|反查|Hub Runway|公式/字段|读|UI `—` 诚实空（S-008）|无链/API 字段|—（未提供）|⚪ 不适用|链/手册/API 未提供|—|S-008|A-19|继承 A|
|Z-013|反查|下次发放|`next_payout`|读|空态合法（rewards summary）|API 无可用下次发放|—（未提供）|⚪ 不适用|链/手册/API 未提供|—|—|A-20|继承 A|
|Z-014|反查|Xmine 下次产出|字段|读|固定 `—`（S-050）|无链/API 字段|—（未提供）|⚪ 不适用|链/手册/API 未提供|—|S-050|A-17|继承 A|
|Z-015|反查|缓冲 API claimable|与链同口径字段|读|FE 信链分流器（A-009）；API 无同口径 claimable|手册 §13；A-16|—（API 无同口径）|⚪ 不适用|链/手册/API 未提供|—|A-009|A-16|正确避开口径坑|
|Z-016|反查|Genesis FAQ|`phaseDurationDays` 已算未插值|读·Copy|`genesisFaqTemplateValues` 产出；zh FAQ 无 `{phaseDurationDays}`|手册 phases 时长|—（纯 UI）|⚪ 不适用|设计取舍（故意空/0）|—|GN-022|—|要展示则加 FAQ 句；否则可删字段（deletion-first）|
