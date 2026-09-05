# 词表（Ubiquitous Language）

业务词表。代码标识符优先用本表；工程实现细节不进对外 API 名。Owner 以代码为准。

## 登录与会话

|业务术语|代码名|含义|Owner|
|---|---|---|---|
|**业务已登录**|`sessionReady`|钱包已连接且当前地址 JWT 有效；**不含**是否在 BSC|`useAuth` / `useDappHost`|
|**钱包已连**|`walletReady`|thirdweb 当前账户有地址；不等于已登录|`useWriteReadiness`|
|**可写链**|`writeReady`|`walletReady` 且当前链是 BSC；写闸；展示链上读同一道闸|`useWriteReadiness`|
|**登录后主按钮**|`SessionButton`|无 `sessionReady` 不渲染；连钱包引导不走此组件|`views/dapp/shared/session-button`|
|**需要签名登录**|`needsSignIn`|钱包已连但尚无有效会话|`useAuth`|
|**钱包签名登录**|SIWE / `login`|签名换 JWT（含 simple fallback）|`login-with-wallet`|
|**会话令牌**|`token` / JWT|业务 API Bearer；按地址缓存|`auth-store` + `AuthProvider`|
|**清会话**|`invalidateSession`|清当前地址会话（如 401）|`AuthProvider`|
|**登录失败分类**|`classifyLoginFailure`|banned / reject / …|`core/auth/classify-login-failure`|
|**带会话请求**|`requestWithSession`|读/写 API；401 → `invalidateSession`|`shared/api/query/session-request`|

> 禁止用 `isAuthenticated` 作 UI/对外同义词；状态机 `AuthState.kind` 用 `sessionReady`。
> 展示链上读（`useChainQuery` / 暖热预取）= `sessionReady && writeReady`（能写才读）。已登录再切走 BSC：JWT 仍在，顶栏出切网，不误报请登录。

## 产品面与链上域

|业务术语|代码名|含义|Owner|
|---|---|---|---|
|**Genesis**|`genesis`（Tab / UI）|产品面：共建认购|`dapp-tabs` / genesis views|
|**预售合约域**|`presale`（core / queries）|链上 PreSale 读写作；**不**整目录改名为 genesis|`core/presale`、`use-presale-*`|
|**认购**|`purchase` / `submitPurchase`|链上买入；CTA 可含先 approve|`use-genesis-session`|
|**授权**|`approve`|ERC20 allowance；可跨分钟|`*-write.ts`|
|**额度**|`allowance`|已授权额度|链上读 + query cache|

## 兑换与报价

|业务术语|代码名|含义|Owner|
|---|---|---|---|
|**兑换**|`exchangeTokens`|Trade 路径链上 swap|`web3/exchange/exchange-write`|
|**闪兑**|`flashExchange`|Flash 双 pair：gAGX→AGX（`redeem`）与 USDT→USD1（`Usd1Swap`）|`web3/exchange/` · redeemablegagx / flash-exchange-write|
|**报价**|`quote`|链上/路由报价；placeholder 不得驱动 submit|`canSubmitQuotedExchange` / `useExchangeQuote`|
|**闪兑 / 市场交易**|Flash / Trade|Exchange 子视图；Provider 按需挂载|`exchange-view-store`|

## 奖励领取

|业务术语|代码名|含义|Owner|
|---|---|---|---|
|**领取团队奖励**|`claimTeamReward`|签名 → 上链 → confirm|`claim-reward`|
|**领取社区基金**|`claimCommunityFund`|同上|`claim-reward`|
|**领取签名**|`TeamRewardClaimSignature`|后端签名包（字段名兼容 snake/camel）|`claim-reward` / `parseTeamRewardClaim`|
|**领取确认**|`confirmClaimQuietly`|上链后 await POST `/claim/confirm`；无论成败都算领取成功并刷新缓存|`claim-reward`|
|**写路径 id**|`WRITE_PATH`|错误 toast 的 ctx 键|`web3/wallet/write-path.ts`|
|**授权后二次门闸写**|`approveThenLiveWrite`|pre 门闸 → approve? → live 重读门闸 → write|`web3/wallet/approve-then-live-write.ts`|
|**链上读 query**|`useChainQuery`|wallet 前缀+address；public 全 key；freshness；read* 默认 bscReadClient|`hooks/use-chain-query.ts`|
|**链上写 mutation**|`useChainMutation`|retry:false；每笔 send 后 wait；busy=`isPending`；错误 toast|`hooks/use-chain-mutation.ts`|
|**错误用户文案**|`getErrorMessage`|unknown → 用户可见文案（或 null 跳过 toast）|`web3/errors/get-error-message.ts`|

## 壳与导航

|业务术语|代码名|含义|Owner|
|---|---|---|---|
|**兑换**|`exchange`（`views/dapp/exchange` · `web3/exchange` · `core/exchange`）|获取/处理协议代币入口|DApp rail|
|**资产**|`assets`|余额与持仓总览|DApp rail|
|**质押**|`staking`|质押 / 债券 / X 挖矿等|DApp rail|
|**奖励**|`rewards`|奖励卡片与领取|DApp rail|
|**释放**|`release`|收益释放 + 本金释放|DApp rail|
|**社区**|`community`|邀请与推荐关系|DApp rail|
|**共建**|`genesis`|创世/共建认购与记录|DApp rail / genesis views|
|**DApp 页签**|`DappTab`|exchange · assets · staking · rewards · release · community · genesis|`dapp-tabs`|
|**窗口宿主**|`host`|rail / app-bar / mobile-nav / onboarding / wallet|`views/dapp/host/`|
|**跨 tab 产品壳**|`views/dapp/shared`|DockFrame / TabHeader 等（读 store · 绑钱包 · i18n）；≠ Foundation|`views/dapp/shared/`|
|**页袋左栏**|`*Dock`|域左栏组装；文件 `dock.tsx`|各 tab 域根 / mode|
|**页袋右栏**|`*Detail`|域右栏组装；文件 `detail.tsx`|各 tab 域根 / mode|
|**Genesis 季**|phase / season|预售季；链上 phases + active|presale queries|
|**季/折扣 chrome**|promo|派生写入 store|`GenesisPromoSync`|

## 冻结边界（勿改）

- 合约 / ABI / 后端 JSON **字段名**
- React Query **key 字符串**（含 `['chain','swap',…]` / `'flashSwap'`）
- `WRITE_PATH.EXCHANGE` 字面量 `'swap'`（与写链 path id 对齐；勿改）
- 哨兵业务字面量：`unknown`
- `core/presale` 目录名（链上域 SSOT，与产品面 Genesis 双层并存）
