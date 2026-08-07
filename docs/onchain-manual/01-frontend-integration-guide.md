# AEGIS X 前端合约对接与功能流程说明

> 来源：`doc-frontend-integration-guide`

## AEGIS X 前端合约对接与功能流程说明

本文档用于前端完整梳理页面、合约 ABI、读写方法、用户流程和交易状态。目标读者是前端开发、后端签名服务开发、运营后台开发和测试人员。

合约行为以 `src/` 源码为准；端到端流程参考 `e2e/e2e-1-user-smoke.js` 和 `e2e/e2e-200-users-sequential.js`。本文不放代码示例，只给前端真正需要的页面说明、ABI、方法和流程。

### 1. 整体业务逻辑

#### 1.1 系统主线

AEGIS X 的用户端不是单一功能，而是一组围绕 AGX 资产展开的链上流程：

1. 用户连接钱包，前端读取部署地址、余额、授权、推荐关系。
2. 用户获得 AGX 或 USD1：通过预售、Swap、USD1Swap 等入口。
3. 用户绑定推荐关系后，才能进入多数质押、债券、治理相关流程。
4. 用户通过活期质押、定期质押、债券、早期锁仓等产生本金、奖励和抽奖资格。
5. 用户领取奖励时，部分流程走 Mixed 领奖：先检查/补足贡献值，再选择释放和复投比例。
6. 释放类奖励进入 RewardQueue；本金退出经 AegisSplitterManager 按用户注册时间路由到 AegisSplitterHead_* 等头部分流器线性释放（原 PrincipalReleaseVault 30 天缓冲池已由分流器取代，历史释放单凭归档 ABI 领取）。
7. LuckyPool 抽奖资格由业务合约自动记录；开奖后中奖用户主动领取奖励。
8. XStakingPool 使用 gAGX 挖 X，用户先把 AGX 包装成 gAGX，再进入 24 小时 warmup。
9. Turbine 使用 RewardQueue/Turbine 配额，用户支付 USD1 后冷却领取 gAGX。
10. 账户迁移用于旧地址和新地址之间迁移权益，支持迁移的合约内部处理 original/canonical 地址。

#### 1.2 资产与单位

| 资产 / 数值    | decimals   | 前端展示        | 主要用途                                                                                       |
| -------------- | ---------- | --------------- | ---------------------------------------------------------------------------------------------- |
| AGX            | 9          | AGX             | 主代币；质押、治理、债券、贡献值兑换、包装 gAGX                                                |
| sAGX           | 9          | 按 AGX 口径展示 | StakingPool / rebase 记账资产                                                                  |
| gAGX           | 9          | gAGX            | `AegisRedeemableGAGX`，用于 XStakingPool 和 Turbine                                            |
| X              | 18         | X               | XStakingPool 奖励代币                                                                          |
| USD1           | 18         | USD1            | 预售、债券、Turbine、稳定币兑换                                                                |
| USDT / XXToken | 运行时读取 | USDT / XXToken  | USD1Swap 输入资产；本地 XXToken 为 18 位，生产输入 token 必须读取 `decimals()` / `getConfig()` |
| BPS            | 10000      | 百分比          | `5000 = 50%`，`10000 = 100%`                                                                   |

#### 1.3 前端全局状态

所有页面建议共享这些状态，避免每个页面重复实现：

| 状态         | 来源                                                        | 用途                                                |
| ------------ | ----------------------------------------------------------- | --------------------------------------------------- |
| 当前钱包地址 | wallet provider                                             | 所有用户读写入口                                    |
| chainId      | wallet provider                                             | 校验当前网络是否等于部署文件网络                    |
| 部署地址表   | `deployments/*.addresses.json`                              | 实例化合约                                          |
| ERC20 余额   | `balanceOf(user)`                                           | 判断输入上限、显示资产                              |
| ERC20 授权   | `allowance(user, spender)`                                  | 决定是否先展示 approve                              |
| 推荐绑定     | `Referral.isBindReferral(user)`                             | 质押、债券、治理前置条件                            |
| 迁移状态     | `AccountMigrationManager.canonicalAccount/isOldAccount/...` | 判断当前地址是否已迁移                              |
| 当前区块号   | RPC `eth_blockNumber`                                       | StakingPool rebase、RewardManager epoch 奖励状态    |
| 当前区块时间 | 最新区块 `timestamp`                                        | warmup、vesting、线性释放、投票窗口、抽奖轮次倒计时 |

#### 1.4 通用交易状态

每个写方法按钮都建议有相同状态模型：

| 状态             | 前端含义                       |
| ---------------- | ------------------------------ |
| `idle`           | 可操作或等待用户输入           |
| `need_wallet`    | 未连接钱包                     |
| `wrong_network`  | 网络不匹配                     |
| `need_referral`  | 需要先绑定推荐人               |
| `need_balance`   | 余额不足                       |
| `need_allowance` | 需要先 approve                 |
| `estimating`     | 正在预估交易或做前置 view 检查 |
| `confirming`     | 等待钱包确认                   |
| `pending`        | 交易已发出，等待上链           |
| `success`        | 交易成功，刷新读状态           |
| `failed`         | 交易失败，解析自定义错误提示   |

### 2. ABI、地址和模块映射

前端直接使用仓库根目录 `abi/*.json` 的规范导出。当前 BNB Chain 主网批准发布是 release `bb680398-e7c0-46fa-ad87-139446fb4120`：权威地址源为 [`deployments/20260807112833274.bsc.xstaking-liquidity.addresses.json`](../deployments/20260807112833274.bsc.xstaking-liquidity.addresses.json)，schema v2 配置回执为 [`bb680398-e7c0-46fa-ad87-139446fb4120.mainnet-configuration.json`](../deployments/verifications/bb680398-e7c0-46fa-ad87-139446fb4120.mainnet-configuration.json)，两者由 SHA-256 `1dcaff5ac4c0a9ead6a2a17d06a33c049ed4b94ea22cff74d7756d673d181c54` 绑定且回执状态为 `passed`。账户迁移启用是 base verify 之后的独立步骤，对应 [`bb680398-e7c0-46fa-ad87-139446fb4120.account-migration-enablement.json`](../deployments/verifications/bb680398-e7c0-46fa-ad87-139446fb4120.account-migration-enablement.json)，状态同为 `passed`。生产构建必须固定这组不可变证据，不得运行时扫描 `deployments/` 目录或合并历史 JSON。历史 release 只作审计留档；官方 `PancakeFactory` 是需同步核对的外部依赖。

地址项统一取 `proxy ?? address`。前端交互永远连接 proxy/普通合约地址，不连接 `implementation` 或 `admin`。该快照证明地址已写入部署记录，但不替代链上配置、owner、角色、资金、VRF Subscription 和业务验收回读；发布前仍须将 manifest 与 chainId=56、EIP-1967 implementation 和对应 ABI/源码提交一起锁定。

#### 2.1 ABI 与地址 key

| 功能                  | ABI 合约名                  | 源文件                          | 部署 key                                                                       |
| --------------------- | --------------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| AGX                   | `AegisXToken`               | `AGX.sol`                       | `AGX`                                                                          |
| X                     | `XToken`                    | `X.sol`                         | `XToken`                                                                       |
| USD1 / Faucet         | `USD1`                      | `Faucet.sol`                    | 本地/测试快照使用 `Faucet`；主网累计快照使用 `USD1`，两者实现相同              |
| XXToken / USDT 替代币 | `USDT`                      | `XXToken.sol`                   | `XXToken`                                                                      |
| Referral              | `AegisReferral`             | `Referral.sol`                  | `Referral`                                                                     |
| PreSale               | `AegisPreSale`              | `PreSale.sol`                   | `PreSale`                                                                      |
| 预售奖励领取          | `AegisPresaleRewardClaimer` | `Reward.sol`                    | `RewardClaimer`                                                                |
| Contribution          | `AegisAgxContributionSwap`  | `AgxContributionSwap.sol`       | `AgxContributionSwap`                                                          |
| 输入 token 兑换 USD1  | `AegisUsd1Swap`             | `Usd1Swap.sol`                  | `Usd1Swap`                                                                     |
| 活期质押              | `LiquidStaking`             | `LiquidStaking.sol`             | `LiquidStaking`                                                                |
| 180 天定期            | `LockedStaking`             | `LockedStaking.sol`             | `LockedStaking180d`                                                            |
| 360 天定期            | `LockedStaking`             | `LockedStaking.sol`             | `LockedStaking360d`                                                            |
| 540 天定期            | `LockedStaking`             | `LockedStaking.sol`             | `LockedStaking540d`                                                            |
| EarlyStake            | `EarlyStaking`              | `EarlyStaking.sol`              | `EarlyStaking`                                                                 |
| Bond                  | `BondDepository`            | `BondDepository.sol`            | `BondDepository180d` / `BondDepository360d` / `BondDepository540d`             |
| BurnBond              | `BurnBondDepository`        | `BurnBondDepository.sol`        | `BurnBondDepository180d` / `BurnBondDepository360d` / `BurnBondDepository540d` |
| BondHelper            | `AegisBondZapHelper`        | `BondHelper.sol`                | `BondHelper`                                                                   |
| Governance            | `Governance`                | `Governance.sol`                | `Governance`                                                                   |
| DaoPool               | `DaoPool`                   | `Dao.sol`                       | `DaoPool`                                                                      |
| CommunityFund         | `AegisCommunityFund`        | `CommunityFund.sol`             | `CommunityFund`                                                                |
| MarketFund            | `AegisMarketFund`           | `MarketFund.sol`                | `MarketFund`                                                                   |
| RewardQueue           | `AegisRewardVestingQueue`   | `RewardQueue.sol`               | `RewardQueue`                                                                  |
| 本金释放（分流器）    | `AegisSplitterManager`      | `AegisSplitterManager.sol`      | `AegisSplitterManager`                                                         |
| 分流器（头/普通）     | `AegisSplitter`             | `AegisSplitter.sol`             | `AegisSplitterHead_0` 等                                                       |
| LuckyPool             | `AegisLuckyPool`            | `AegisLuckyPool.sol`            | `LuckyPool`                                                                    |
| PurchaseTracker       | `AegisDailyPurchaseTracker` | `AegisDailyPurchaseTracker.sol` | `DailyPurchaseTracker`                                                         |
| gAGX                  | `AegisRedeemableGAGX`       | `RedeemableGAGX.sol`            | `RewardGAGX`                                                                   |
| X 挖矿                | `AegisXMiningPool`          | `XStakingPool.sol`              | `XStakingPool`                                                                 |
| Turbine               | `AegisTurbineVestingHub`    | `Turbine.sol`                   | `Turbine`                                                                      |
| Restake 配置          | `RestakeConfig`             | `RestakeConfig.sol`             | `RestakeConfig`                                                                |
| 账户迁移              | `AccountMigrationManager`   | `AccountMigrationManager.sol`   | `AccountMigrationManager`                                                      |
| Treasury              | `CryptoTreasury`            | `Treasury.sol`                  | `Treasury`                                                                     |
| RBS                   | `AegisReserveMarketMaker`   | `RBS.sol`                       | `RBS`                                                                          |
| RiskControl           | `AegisRiskController`       | `RiskControl.sol`               | `RiskControl`                                                                  |
| RewardManager         | `AegisEpochRewardManager`   | `RewardManager.sol`             | `RewardManager`                                                                |
| FeeBot                | `AegisFeeRoutingBot`        | `FeeBot.sol`                    | `FeeBot`                                                                       |
| TokenFeeBot           | `AegisTokenFeeRoutingBot`   | `TokenFeeBot.sol`               | `TokenFeeBot`                                                                  |

#### 2.2 当前 BNB Chain 主网地址

以下 47 个部署 key 是本轮 release（`MAINNET_REUSE_ALLOWLIST=none`，全部全新部署）的完整地址表，供前端集成参考；权威地址源是 schema v2 passed 回执所绑定的最终 manifest。若后续发生代理升级，只更新 implementation 记录；proxy 地址未迁移时前端交互地址保持不变。

| 部署 key                       | 主网交互地址                                 | 类型 / 来源            |
| ------------------------------ | -------------------------------------------- | ---------------------- |
| `USD1`（Faucet / `USD1` 合约） | `0xd94Be47992B17534d7eDB6293D0433F5C7A166aC` | 普通地址，本轮全新部署 |
| `Referral`                     | `0xEb4339c0898B72d8aC0B8Ba65902558b7529DA9B` | Proxy，本轮全新部署    |
| `PreSale`                      | `0x469aBAd653b0cc4C467B4dF0010e82F4aaf0a0c1` | Proxy，本轮全新部署    |
| `RewardClaimer`                | `0xF2bE1A3A20ed1c1AD9d152DDa89f0f9C428CE365` | Proxy，本轮全新部署    |
| `CommunityFund`                | `0xb3304bb6b3a9b1243eBaDE48d6e4b322f92fcF1E` | Proxy，本轮全新部署    |
| `Usd1Swap`                     | `0x8F3a258045130626D677cD17e724d0CcdE888845` | Proxy，本轮全新部署    |
| `AGX`                          | `0x8D097BBA218393eCD9daE2aca82d718FA0EB02aB` | 普通地址               |
| `XToken`                       | `0x11D7F915158aAEf7932179943ae93FC31451B689` | 普通地址               |
| `sAGX`                         | `0xB59F227A2c4aa91dDD482e983b1767D8ee0cEc96` | 普通地址               |
| `PancakeFactory`               | `0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73` | 外部普通地址           |
| `PancakePair`                  | `0x9302FcEA9eBCfdbDB335197b2a1e57d67a87B302` | AGX/USD1 Pair          |
| `BondingCalculator`            | `0x1B6aD49A45874aFADD03055FE364bB78f04921B3` | 普通地址               |
| `Treasury`                     | `0x32ceB69086E40E1dBea15d75444C64FdDc08230f` | Proxy                  |
| `StakingPool`                  | `0xb50cc1493696B3304FaAC686C16989b47903d01E` | Proxy                  |
| `RewardManager`                | `0x7ccaA7890A44d6Ef2a507F73509A209cc98A9941` | Proxy                  |
| `RewardGAGX`                   | `0xE5d59073D4BDAd269D2f67bE35988337F6F333Aa` | Proxy                  |
| `LockedStaking180d`            | `0xb64C7718F372eB7792EdE434f93F0b556e444406` | Proxy                  |
| `LockedStaking360d`            | `0xCA6bf54Dd4f7D05CA1b0C34Da4AC8fBC97dD8CeD` | Proxy                  |
| `LockedStaking540d`            | `0x5aa7e8996FE0661B3D487f660E6a043BCe000487` | Proxy                  |
| `LiquidStaking`                | `0x73aFfdA5B6399db1666bA203aB9623CA5F48E2fb` | Proxy                  |
| `EarlyStaking`                 | `0x3B525564aF73ae22d36e7615E6330db698F80592` | Proxy                  |
| `XStakingPool`                 | `0x38af581462e25aABE1A25Ae128aE5a63aE015e1c` | Proxy                  |
| `BondDepository180d`           | `0xaFe1cdDd0b6d20483ebC5087b98337370eaE249c` | Proxy                  |
| `BondDepository360d`           | `0xAA334F43999751B3cb0F3313bEda94BAF47980d7` | Proxy                  |
| `BondDepository540d`           | `0x236C5a112Dfa345D51d724362201c0650FaD2E0F` | Proxy                  |
| `BurnBondDepository180d`       | `0x7E45475E5729578eb4F08af7d2115491591295d6` | Proxy                  |
| `BurnBondDepository360d`       | `0x63b399D2fe5a13c58d92E6a74771867516471deF` | Proxy                  |
| `BurnBondDepository540d`       | `0xFb833116349280880E722203B1D80B69682F738E` | Proxy                  |
| `BondHelper`                   | `0xDcE5f1DB9E477fe30dbe6D81cBDE41065A25A641` | Proxy                  |
| `DaoPool`                      | `0x40AD76f0B22C1b4a4996F42540FC0a556A851775` | Proxy                  |
| `Governance`                   | `0x3bABE9D3a51b4092B4ff3Ef33468d76DdEA2D424` | Proxy                  |
| `FeeBot`                       | `0x7E31365dcEdDD37CD9eAB383531fD32907568ab9` | Proxy                  |
| `Turbine`                      | `0x8AA41EeE218bF444532f80021D71249d70783cE6` | Proxy                  |
| `RewardQueue`                  | `0x320feF8885283CbD1271aD1F39c5Fe694d56583C` | Proxy                  |
| `RiskControl`                  | `0x1AAC78d2FE0ef171075df997bD9287394839696B` | Proxy                  |
| `RBS`                          | `0xde591E8C3DD60be77481Ea335d7A038e09357034` | Proxy                  |
| `RestakeConfig`                | `0xcc7ec781A0d08Dafec7c34779A0c306b3198e2e1` | Proxy                  |
| `TokenFeeBot`                  | `0x379B3BFD7e5D1A7C07C7bb132870044b3E156Fe2` | Proxy                  |
| `MarketFund`                   | `0x316B3Eeb21C43A138510cdF7728Ddb88d33f112f` | Proxy                  |
| `AccountMigrationManager`      | `0x6d4656a897cBF7fA1e199806F33f0dA51B9ff778` | Proxy，已启用迁移      |
| `XXToken`                      | `0x5CeDC73b36624caa24581D8567b02a07d3cCeF2A` | 普通地址               |
| `AgxContributionSwap`          | `0xe3Df8686556A30c633bDD5Ca8293E33E57b81FEb` | Proxy                  |
| `LuckyPool`                    | `0xe91148Fe7248b528398442e8eA4e8a7d107c994A` | Proxy，当前暂停        |
| `DailyPurchaseTracker`         | `0xf4328953616607aCc04F1e7Ba90bc379987c1945` | Proxy，当前暂停        |
| `AegisSplitterManager`         | `0x951d22EDBbFeC93ecD40B9fE7faC979A0EA7471F` | Proxy                  |
| `AegisSplitterHead_0`          | `0x193eBD30a5f0827e91880fF404600f5b699df510` | Proxy，头部分流器      |
| `XStakingRewardPair`           | `0xC3587c1E9862b74a5e3dE8C6a48fD85Ae44550B8` | AGX/X Pair             |

`PrincipalReleaseVault` 不属于上述 47 个当前部署 key。其历史主网代理 `0xb40dd16Ea03Ea04DaF63b3b272F31832B666C4Ee` 仅供旧释放单领取，ABI 见 `archive/PrincipalReleaseVault/`；新本金不再进入该合约。

#### 2.3 页面到合约映射

| 页面               | 主要合约                                                  | 辅助合约                                                              |
| ------------------ | --------------------------------------------------------- | --------------------------------------------------------------------- |
| 钱包资产           | ERC20                                                     | AccountMigrationManager                                               |
| 推荐关系           | Referral                                                  | AccountMigrationManager                                               |
| 预售               | PreSale                                                   | USD1 ERC20, RewardClaimer                                             |
| Swap               | PancakeRouter, Usd1Swap                                   | AGX ERC20, USD1/XXToken ERC20                                         |
| 活期质押           | LiquidStaking                                             | AGX ERC20, Referral, RewardQueue, AegisSplitterManager                |
| 定期质押           | LockedStaking180d/360d/540d                               | AGX ERC20, Referral, RewardQueue, RestakeConfig, AegisSplitterManager |
| EarlyStake         | EarlyStaking                                              | RewardQueue, AegisSplitterManager                                     |
| Mixed 领奖         | 各奖励来源合约                                            | AgxContributionSwap, RestakeConfig, RewardQueue                       |
| 债券               | BondHelper, BondDepository, BurnBondDepository            | USD1 ERC20, Referral, AegisSplitterManager                            |
| 治理               | Governance                                                | AGX ERC20, Referral                                                   |
| RewardQueue        | RewardQueue                                               | Turbine                                                               |
| 本金释放（分流器） | AegisSplitterManager / AegisSplitter                      | AGX ERC20                                                             |
| 抽奖               | LuckyPool                                                 | DailyPurchaseTracker                                                  |
| X 挖矿             | RewardGAGX, XStakingPool                                  | AGX ERC20, X ERC20, AegisSplitterManager                              |
| Turbine            | Turbine                                                   | USD1 ERC20, RewardGAGX                                                |
| 账户迁移           | AccountMigrationManager                                   | Referral 和支持迁移的业务合约                                         |
| 管理台             | Treasury/RBS/RiskControl/RewardManager/FeeBot/TokenFeeBot | AGX/USD1/Router                                                       |

### 3. 用户端完整流程

#### 3.1 推荐页面顺序

| 步骤 | 页面        | 目标                                   | 成功后进入             |
| ---- | ----------- | -------------------------------------- | ---------------------- |
| 1    | 钱包资产    | 连接钱包、校验网络、加载地址、读取余额 | 推荐关系 / 预售 / Swap |
| 2    | 推荐关系    | 确认是否已绑定推荐人                   | 质押、债券、治理       |
| 3    | 预售 / Swap | 获取 USD1 或 AGX                       | 质押、债券             |
| 4    | 质押        | 活期、定期、EarlyStake 展示            | 领奖、释放、抽奖       |
| 5    | 债券        | 购买/查看/赎回债券                     | 债券收益 Mixed         |
| 6    | 治理        | 投票、到期取回                         | 奖励/资产              |
| 7    | 奖励中心    | 签名奖励、质押奖励、Mixed 分流         | RewardQueue / Restake  |
| 8    | 释放中心    | RewardQueue 奖励释放、本金释放         | Turbine / 资产         |
| 9    | 抽奖        | 查看资格、轮次、中奖、发奖             | 资产                   |
| 10   | X 挖矿      | wrap gAGX、质押、warmup、领 X、退出    | 本金释放               |
| 11   | Turbine     | 配额购买、冷却领取 gAGX                | 资产                   |
| 12   | 账户迁移    | 旧地址发起、新地址激活                 | 新地址继续使用         |

#### 3.2 e2e 覆盖顺序

| e2e stage                                                   | 前端页面            | 合约动作                                                                      |
| ----------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------- |
| `preflight`, `setup`                                        | 管理台              | 检查地址、权限、库存、pair、奖励资金                                          |
| `fund-users`                                                | 钱包资产            | 读 ERC20 余额                                                                 |
| `referral-binding`                                          | 推荐关系            | `Referral.bindReferral`                                                       |
| `presale-purchase`                                          | 预售                | `PreSale.purchase`                                                            |
| `swap-buy-agx`                                              | Swap                | Router `swapExactTokensForTokens`                                             |
| `liquid-staking`                                            | 活期质押            | `LiquidStaking.liquidStake`                                                   |
| `locked-staking-subpools`                                   | 定期质押            | 180/360/540 天三个 `LockedStaking.lockedStake` 实例                           |
| `lp-bond`, `burn-bond`                                      | 债券                | `BondHelper.zapIntoLiquidityBond`, `zapIntoBurnBond`                          |
| `governance-vote`, `governance-withdrawal`                  | 治理                | `vote`, `withdrawal`                                                          |
| `early-staking`                                             | 管理台 / EarlyStake | `EarlyStaking.earlyStake`                                                     |
| `x-staking-stake`, `x-staking-claim-unstake`                | X 挖矿              | `wrap`, `stakeGagxForMining`, `activateWarmup`, `claimReward`, `startUnstake` |
| `staking-reward-claim`                                      | 质押奖励            | `claimRewardMixed`                                                            |
| `dao-claim`, `community-fund-claim`, `presale-reward-claim` | 签名奖励            | 各签名领取方法                                                                |
| `reward-queue-claim`, `reward-queue`                        | RewardQueue         | 查询并领取释放奖励                                                            |
| `principal-release-*`                                       | 本金释放（分流器）  | Manager/头部分流器 `claim`, `claimMany`（历史 PRV 释放单用归档 ABI）          |
| `usd1-swap`                                                 | USD1Swap            | `quoteUsd1Out`, `swap`                                                        |
| `lucky-pool`                                                | 抽奖                | 查询资格、VRF 开奖、手动领取                                                  |
| `turbine`                                                   | Turbine             | `buyAgxAndStartCooldown`, `claimCooledGagx`                                   |
| `restake`                                                   | 复投                | Mixed 领奖时 `restakeBps = 10000`                                             |
| `fee-bot`, `token-fee-bot`, `risk-control`, `rbs`           | 管理台              | 后台操作                                                                      |
| `account-migration`                                         | 账户迁移            | `requestMigration`, `approveMigration`, `activateMigration`                   |

### 4. 钱包资产页

#### 4.1 页面用途

资产页负责展示用户所有可用资产、合约授权状态、迁移状态和进入各业务页面的基础条件。

#### 4.2 需要实例化的 ABI

| ABI                     | 地址 key                    | 用途                                                            |
| ----------------------- | --------------------------- | --------------------------------------------------------------- |
| ERC20                   | `AGX`                       | AGX 余额和授权                                                  |
| ERC20                   | `RewardGAGX`                | gAGX 余额和授权                                                 |
| ERC20                   | `XToken`                    | X 余额                                                          |
| USD1                    | 本地 `Faucet` / 主网 `USD1` | 两个 key 当前都使用同一 Faucet/USD1 ABI；主网地址取本轮累计快照 |
| ERC20                   | `XXToken`                   | USDT/XXToken 余额                                               |
| AccountMigrationManager | `AccountMigrationManager`   | 迁移状态                                                        |

#### 4.3 展示字段

| 字段                      | 方法                                                            | 说明                                                                |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- |
| AGX 余额                  | `AGX.balanceOf(user)`                                           | 9 decimals                                                          |
| gAGX 余额                 | `RewardGAGX.balanceOf(user)`                                    | 9 decimals                                                          |
| X 余额                    | `XToken.balanceOf(user)`                                        | 18 decimals                                                         |
| USD1 余额                 | 主网 `USD1.balanceOf(user)`；本地按 `Faucet.balanceOf(user)`    | 使用链上 `decimals()` 格式化；本轮主网实现是 `USD1`（`Faucet.sol`） |
| XXToken / 输入 token 余额 | `XXToken.balanceOf(user)` 或生产输入 token 的 `balanceOf(user)` | 本地 XXToken 为 18 位；生产运行时读取 `decimals()`                  |
| 当前地址是否旧地址        | `AccountMigrationManager.isOldAccount(user)`                    | 已迁移旧地址应提示不要继续操作                                      |
| canonical 地址            | `AccountMigrationManager.canonicalAccount(user)`                | 页面可展示最终权益地址                                              |

#### 4.4 交互要求

| 交互     | 前端处理                                               |
| -------- | ------------------------------------------------------ |
| 连接钱包 | 请求钱包账户，读取 chainId                             |
| 网络错误 | 提示切换到部署文件对应网络                             |
| 授权检查 | 每个业务按钮单独检查 spender，不建议资产页全量 approve |
| 迁移提醒 | 如果 `isOldAccount(user) = true`，提示用户切换到新地址 |

主网 USD1 的 Faucet 实现包含无权限控制的 `mint(address,uint256)`，任何钱包都能在链上直接调用。普通前端不应展示 mint 按钮，但隐藏 UI 不能限制链上调用；若产品要求受控发行，必须更换或迁移合约，不能只靠前端权限处理。

### 5. 推荐关系 Referral

#### 5.1 页面用途

推荐关系是质押、债券、治理等流程的重要前置条件。用户没有绑定推荐人时，前端应先引导绑定。

#### 5.2 ABI 与地址

| ABI                       | 地址 key                  |
| ------------------------- | ------------------------- |
| `Referral`                | `Referral`                |
| `AccountMigrationManager` | `AccountMigrationManager` |

#### 5.3 展示字段

| 字段             | 方法                      | 说明                                            |
| ---------------- | ------------------------- | ----------------------------------------------- |
| 是否已绑定       | `isBindReferral(user)`    | true 后不再展示绑定按钮                         |
| 推荐人地址       | `getReferral(user)`       | 可缩略展示                                      |
| 直接下级数量     | `getReferralCount(user)`  | 推荐数据面板                                    |
| 下级列表         | `getChildren(user)`       | 列表分页可用 `getChildAt`                       |
| 推荐人链（上级） | `getReferrals(user, num)` | 从 `.parent` 向上遍历，返回上级推荐人（非下级） |
| root 地址        | `getRootAddress()`        | 默认推荐根地址                                  |
| original 地址    | `originalOf(user)`        | 迁移场景                                        |
| canonical 地址   | `canonicalOf(user)`       | 迁移场景                                        |

#### 5.4 用户写方法

| 按钮       | 方法                     | 参数       | 前置检查                                                                        | 成功后刷新                                                    |
| ---------- | ------------------------ | ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 绑定推荐人 | `bindReferral(referrer)` | 推荐人地址 | 用户未绑定且不是迁移旧地址；referrer 非零且不是自己；除 root 外 referrer 已绑定 | `isBindReferral`, `getReferral`, `getReferralCount(referrer)` |

#### 5.5 注意事项

- 已绑定用户不能重复绑定，前端应隐藏按钮。
- 质押、债券、治理投票前都应先检查 isBindReferral(user) 。
- 账户迁移后，推荐关系相关合约会处理 original/canonical，前端仍以当前钱包地址查询即可。

### 6. 预售 PreSale

#### 6.1 页面用途

预售页展示阶段额度、用户额度、购买金额、空投价值预览，并允许用户用 USD1 购买。

#### 6.2 ABI 与地址

| ABI                         | 地址 key                    | 用途                           |
| --------------------------- | --------------------------- | ------------------------------ |
| `AegisPreSale`              | `PreSale`                   | 查询阶段和购买                 |
| `USD1`                      | 本地 `Faucet` / 主网 `USD1` | USD1 余额和授权                |
| `AegisPresaleRewardClaimer` | `RewardClaimer`             | 预售奖励签名领取，不是预售购买 |

#### 6.3 展示字段

| 字段             | 方法                                                    | 说明                                                  |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| 阶段数量         | `getPhaseCount()`                                       | 用于生成阶段 tab                                      |
| 阶段剩余额度口径 | `getPhaseRemainingAmount(phaseIndex)`                   | 当前源码返回阶段 max 相关口径，不要理解成全局售罄剩余 |
| 用户阶段额度     | `getUserPhaseRemainingAmount(user, phaseIndex)`         | 返回阶段剩余、用户剩余、用户上限、用户已购等信息      |
| 空投价值预览     | `previewAirdropValue(user, phaseIndex, purchaseAmount)` | 仅展示预览                                            |
| USD1 余额        | ERC20 `balanceOf(user)`                                 | 18 decimals                                           |
| USD1 授权        | ERC20 `allowance(user, PreSale)`                        | 不足时先 approve                                      |

#### 6.4 用户写方法

| 按钮      | 方法                             | 参数                  | 前置检查                                                                                                           | 成功后刷新                                                                                     |
| --------- | -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 授权 USD1 | ERC20 `approve(PreSale, amount)` | `amount`              | USD1 余额足够                                                                                                      | allowance                                                                                      |
| 购买预售  | `purchase(phaseIndex, amount)`   | 阶段 index、USD1 金额 | `paused=false`；推荐已绑定；阶段存在；`amount > 0` 且是 `BASE_UNIT = 100e18` 的整数倍；额度、余额和 allowance 足够 | `userPhaseAmount`、`userTotalAmount`、`userTotalAgx`、`userTotalAirdropValue`、USD1 余额及事件 |

#### 6.5 成功结果

购买后源码资金拆分：

| 去向                            | 比例 |
| ------------------------------- | ---- |
| `rewardContract.deposit`        | 10%  |
| `communityFundContract.deposit` | 5%   |
| 推荐预算                        | 3%   |
| `saleWallet`                    | 82%  |

`purchase` 只转移/分配 USD1 并记录用户的 AGX/空投价值，不会在本次交易中把 AGX 转入用户钱包。购买成功应以 `Purchased`、`AirdropValueAccrued` 和上述累计 getter 为准；不要用钱包 AGX 余额判断预售是否成功。若页面展示推荐收益，还要处理 `ReferralRewardPaid` 与未分配推荐预算。

#### 6.6 前端注意

- 当前源码没有用户 claimAirdrop 入口。
- 预售奖励领取是 RewardClaimer.claimReward(...) ，属于签名奖励模块，不是 PreSale.purchase 的同一个交互。
- 预售 USD1 金额使用 18 decimals，并且必须按 100e18 步进。

### 7. Swap

#### 7.1 PancakeRouter 买 AGX

| 项       | 内容                                                |
| -------- | --------------------------------------------------- |
| 页面用途 | 用户用 USD1 通过流动性池购买 AGX                    |
| ABI      | PancakeRouter ABI、ERC20                            |
| 地址     | Router 外部地址、本地 `Faucet` / 主网 `USD1`、`AGX` |

展示字段：

| 字段          | 方法                                          |
| ------------- | --------------------------------------------- |
| USD1 余额     | ERC20 `balanceOf(user)`                       |
| AGX 余额      | ERC20 `balanceOf(user)`                       |
| USD1 授权     | ERC20 `allowance(user, router)`               |
| 预估 AGX 输出 | Router `getAmountsOut(amountIn, [USD1, AGX])` |
| 最小输出      | 前端用滑点计算 `amountOutMin`                 |

写方法：

| 按钮      | 方法                                                                   | 前置检查                          | 成功后刷新              |
| --------- | ---------------------------------------------------------------------- | --------------------------------- | ----------------------- |
| 授权 USD1 | ERC20 `approve(router, amountIn)`                                      | 余额足够                          | allowance               |
| 买 AGX    | `swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)` | 路径有流动性；amountOutMin 已计算 | AGX/USD1 余额、交易历史 |

注意事项：

- 不要把 amountOutMin 写死为 0。
- deadline 应由前端生成，避免交易长时间挂起。

#### 7.2 Usd1Swap

| 项       | 内容                                               |
| -------- | -------------------------------------------------- |
| 页面用途 | 用户用 USDT/XXToken 按固定汇率兑换 USD1            |
| ABI      | `AegisUsd1Swap`、ERC20                             |
| 地址 key | `Usd1Swap`, `XXToken`, 本地 `Faucet` / 主网 `USD1` |

展示字段：

| 字段          | 方法                                           | 说明                                                            |
| ------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| 输入 token    | `getConfig()` 返回 usdt/usd1/rate/limit 等配置 | 本轮部署的 XXToken（USDT，本地与主网一致）                      |
| 当前报价      | `quoteUsd1Out(usdtAmount)`                     | `usdtAmount` 使用输入 token 自身 decimals，输出按 USD1 decimals |
| USD1 库存     | `usd1Reserve()`                                | 库存不足时 swap 会失败                                          |
| 最小/最大输入 | `getConfig()`                                  | 前端用于输入限制                                                |
| paused        | `getConfig()` 或公开变量                       | paused 时禁用 swap                                              |

写方法：

| 按钮           | 方法                                  | 前置检查                                    | 成功后刷新                     |
| -------------- | ------------------------------------- | ------------------------------------------- | ------------------------------ |
| 授权输入 token | ERC20 `approve(Usd1Swap, usdtAmount)` | 余额足够                                    | allowance                      |
| 兑换 USD1      | `swap(usdtAmount, minUsd1Out)`        | 不 paused；金额在限制内；库存足够；授权足够 | USD1/输入 token 余额、累计数据 |

注意事项：

- e2e 为了流程覆盖使用 swap(amount, 0) ；生产前端必须先 quoteUsd1Out ，再按滑点传 minUsd1Out 。
- 这是 USDT/XXToken -> USD1 的单向兑换，不是 USD1 <-> AGX。
- 不要把输入 token 固定为 18 位。初始化时合约会缓存 usdtDecimals / usd1Decimals ；前端从 getConfig() 或两个 ERC20 的 decimals() 读取并分别 parseUnits / formatUnits 。

### 8. 质押 Staking

#### 8.1 质押页面整体结构

建议拆成三个 tab：

| tab  | 合约                          | 用户能力                                     |
| ---- | ----------------------------- | -------------------------------------------- |
| 活期 | `LiquidStaking`               | 质押、激活 warmup、领奖、申请本金退出        |
| 定期 | `LockedStaking180d/360d/540d` | 三池分别质押、查看每条 stake、领取本金、领奖 |
| 早期 | `EarlyStaking`                | 查看管理员创建的早期锁仓、领取本金和奖励     |

仅对用户主动入金的 `LiquidStaking.liquidStake` 和 `LockedStaking.lockedStake` 先检查：

| 检查          | 方法                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| 推荐关系      | `Referral.isBindReferral(user)`                                              |
| AGX 余额      | `AGX.balanceOf(user)`                                                        |
| AGX 授权      | `AGX.allowance(user, stakingContract)`                                       |
| 今日/全局额度 | Liquid 使用三层限额；Locked 使用可选的每日全局和单 root 累计限额，0 表示无限 |
| 迁移状态      | `AccountMigrationManager` 和合约内部 original/canonical                      |

`EarlyStaking` 仓位由管理员创建。用户领取本金或奖励时不要求重新绑定 Referral，也不需要 AGX allowance；不能复用入金按钮的统一门禁去禁用 Early 领取。

#### 8.2 活期 LiquidStaking

| 项       | 内容                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------ |
| ABI      | `LiquidStaking`, ERC20, `Referral`, `AegisSplitterManager`, `AgxContributionSwap`, `RewardQueue` |
| 地址 key | `LiquidStaking`, `AGX`, `Referral`, `AegisSplitterManager`, `AgxContributionSwap`, `RewardQueue` |

展示字段：

| 字段            | 方法                                                                                                                                                                                                   | 说明                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| warmup stake    | `warmupStakes(root)`                                                                                                                                                                                   | public mapping 不自动解析迁移别名；`root` 取 `AccountMigrationManager.migratedFrom(user)`，零地址时使用 user |
| active stake    | `stakes(root)`                                                                                                                                                                                         | 同上；迁移后直接用当前钱包读取可能错误显示为 0                                                               |
| warmup 奖励     | `getStakeRewards(user)` 第 1 个返回值                                                                                                                                                                  | 未激活部分的奖励                                                                                             |
| active 奖励     | `getStakeRewards(user)` 第 2 个返回值                                                                                                                                                                  | 可进入 Mixed 领奖                                                                                            |
| 今日剩余额度    | `remainingStakeAmount()`                                                                                                                                                                               | 全局每日剩余额度                                                                                             |
| warmup 是否到期 | `isWarmupExpired(user)`                                                                                                                                                                                | 到期后允许 `claim()`                                                                                         |
| 本金释放单      | `AegisSplitterManager.getHeadSplitterForUser(user)` 解析头部分流器后，用 `AegisSplitter.getReleases(user,start,limit)` 分页读取；仅接入其他尚未升级的 Splitter 实例时回退 `getReleaseCount/getRelease` | `claimPrincipal` 后创建                                                                                      |

用户写方法：

| 按钮           | 方法                                                                       | 参数                               | 前置检查                       | 成功后刷新                       |
| -------------- | -------------------------------------------------------------------------- | ---------------------------------- | ------------------------------ | -------------------------------- |
| 授权 AGX       | `AGX.approve(LiquidStaking, amount)`                                       | 金额                               | AGX 余额足够                   | allowance                        |
| 活期质押       | `liquidStake(amount)`                                                      | AGX 金额                           | 推荐已绑定；授权足够；额度足够 | warmup stake、余额、抽奖资格     |
| 激活 warmup    | `claim()`                                                                  | 无                                 | warmup 存在且到期              | warmup stake、active stake、奖励 |
| 申请本金退出   | `claimPrincipal(amount)`                                                   | AGX 金额                           | active principal 足够          | active stake、本金释放单         |
| 领取奖励 Mixed | `claimRewardMixed(releasePlanIndex, amount, restakePlanIndex, restakeBps)` | 释放计划、金额、复投计划、复投比例 | active 奖励足够；贡献值足够    | 奖励、RewardQueue、Restake stake |

前端注意：

- 活期有 warmup，warmup 未结束时本金和收益都不能按 active 流程领取或退出。
- claim() 不是普通领奖按钮，它主要用于 warmup 到期激活。
- claimPrincipal(amount) 会经 AegisSplitterManager 路由进入分流器，不是立即把全部 AGX 发回钱包。
- liquidStake 会触发购买记录集成，单笔金额达标时可能进入 LuckyPool 资格。

#### 8.3 定期 LockedStaking

| 项       | 内容                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| ABI      | `LockedStaking`, ERC20, `Referral`, `AgxContributionSwap`, `RewardQueue`, `RestakeConfig`, `AegisSplitterManager` |
| 地址 key | 固定三池：`LockedStaking180d`, `LockedStaking360d`, `LockedStaking540d`                                           |

展示字段：

| 字段             | 方法                                               | 说明                                                                         |
| ---------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| stake 数量       | `getStakesCount(user)`                             | 分页基础                                                                     |
| stake 列表       | `getStakes(user, start, limit)`                    | 返回 `StakeData[]`                                                           |
| 单条 stake       | `getStake(user, index)`                            | 返回 `pending`, `blockReward`, `extraInterest`, `claimableBalance`, `expiry` |
| 可释放本金       | `getReleasedPrincipal(user, index)`                | 定期本金领取按钮依据                                                         |
| 今日全局剩余额度 | `remainingStakeAmount()`                           | `stakingLimit=0` 时返回 `MaxUint256`；否则返回当日剩余额度，饱和为 0         |
| 单 root 累计额度 | `singleAddressLimit()`, `userStakingAmounts(root)` | `singleAddressLimit=0` 时无限；提取本金不返还累计额度，迁移后仍查首次 root   |
| 合约状态         | `status()`                                         | false 时不能质押                                                             |
| 锁定周期         | `periodTime()`                                     | 页面展示期限                                                                 |
| warmupTime       | `warmupTime()`                                     | 当前三个长期池均固定为 0                                                     |

用户写方法：

| 按钮               | 方法                                                                                        | 参数                   | 前置检查                                                                                | 成功后刷新                                                    |
| ------------------ | ------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 授权 AGX           | `AGX.approve(LockedStaking, amount)`                                                        | 金额                   | AGX 余额足够                                                                            | allowance                                                     |
| 定期质押           | `lockedStake(amount)`                                                                       | AGX 金额               | 推荐已绑定；合约开启；授权足够；两项已启用额度均足够                                    | stake 列表、余额、额度、抽奖资格                              |
| 给他人创建定期仓位 | `lockedStake(amount, recipient)`                                                            | AGX 金额、受益人       | recipient 已绑定推荐；双方均非迁移旧地址；调用者授权足够；额度按 recipient 的 root 累计 | recipient 的 stake 列表、调用者余额、额度、recipient 抽奖资格 |
| 领取本金           | `claimPrincipal(index)`                                                                     | stake index            | `claimableBalance > 0`；分流器 Manager 已配置                                           | stake 列表、分流器释放单；钱包 AGX 不会立即增加               |
| 领取普通奖励 Mixed | `claimRewardMixed(stakeIndex, amount, releasePlanIndex, restakePlanIndex, restakeBps)`      | stake index 和分流参数 | `blockReward` 足够；贡献值足够                                                          | stake、RewardQueue、Restake                                   |
| 领取额外奖励 Mixed | `claimExtraRewardMixed(stakeIndex, amount, releasePlanIndex, restakePlanIndex, restakeBps)` | stake index 和分流参数 | `extraInterest` 足够；贡献值足够                                                        | stake、RewardQueue、Restake                                   |

前端注意：

- 定期质押所有操作都必须围绕 stakeIndex 。
- 双参数质押由调用者支付 AGX，但仓位与后续领取权归 recipient。
- Mixed 收益复投始终归收益所属用户本人，不能借 mixed 接口指定其他地址。
- 180d/360d/540d 三个实例共用 ABI，但地址不同；页面可以把每个池作为一个卡片。
- getStakes(user,start,limit) 当 start >= total 会 revert；空列表时不要调用。
- claimPrincipal(index) 领取的是该 stake 已释放本金，不是 RewardQueue。

#### 8.4 EarlyStaking

| 项       | 内容                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| ABI      | `EarlyStaking`, ERC20, `AgxContributionSwap`, `RewardQueue`, `AegisSplitterManager` |
| 地址 key | `EarlyStaking`, `AGX`, `AgxContributionSwap`, `RewardQueue`, `AegisSplitterManager` |

展示字段：

| 字段         | 方法                         | 说明                |
| ------------ | ---------------------------- | ------------------- |
| 用户早期锁仓 | `getStake(user)`             | 返回早期 stake 数据 |
| 已释放本金   | `getReleasedPrincipal(user)` | 本金领取按钮依据    |

用户写方法：

| 按钮           | 方法                                                                       | 前置检查                            | 成功后刷新                                 |
| -------------- | -------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------ |
| 领取本金       | `claimPrincipal()`                                                         | 有可释放本金；分流器 Manager 已配置 | stake、分流器释放单；钱包 AGX 不会立即增加 |
| 领取奖励 Mixed | `claimRewardMixed(amount, releasePlanIndex, restakePlanIndex, restakeBps)` | 奖励足够；贡献值足够                | stake、RewardQueue、Restake                |

管理写方法：

| 按钮             | 方法                             | 说明             |
| ---------------- | -------------------------------- | ---------------- |
| 批量创建早期锁仓 | `earlyStake(users[], amounts[])` | 只有管理员可调用 |

前端注意：

- 普通用户没有自助 EarlyStake 入口。
- 用户端只展示已有锁仓和领取按钮。

### 9. 贡献值与 Mixed 领奖

#### 9.1 Mixed 领奖概念

Mixed 领奖不是单纯 claim。用户领取奖励前，前端要先判断贡献值是否足够；领奖时用户选择：

| 参数               | 含义                               |
| ------------------ | ---------------------------------- |
| `amount`           | 本次领取的奖励金额，AGX 9 decimals |
| `releasePlanIndex` | 进入 RewardQueue 的释放计划        |
| `restakePlanIndex` | 进入 RestakeConfig 的复投计划      |
| `restakeBps`       | 复投比例，0 到 10000               |

奖励会按 `restakeBps` 拆分：

| 部分         | 去向                             |
| ------------ | -------------------------------- |
| release 部分 | `RewardQueue`，后续线性释放      |
| restake 部分 | `RestakeConfig` 对应的定期质押池 |

#### 9.2 贡献值页面

| 项       | 内容                         |
| -------- | ---------------------------- |
| ABI      | `AgxContributionSwap`, ERC20 |
| 地址 key | `AgxContributionSwap`, `AGX` |

展示字段：

| 字段             | 方法                                                     |
| ---------------- | -------------------------------------------------------- |
| 用户贡献值       | `root = originalOf(user)`，再读 `userContribution(root)` |
| 兑换报价         | `quoteContributionOut(agxAmount)`                        |
| 领奖所需贡献值   | `quoteRequiredContribution(rewardAmount)`                |
| AGX 拆分         | `quoteSplit(agxAmount)`                                  |
| 当前配置         | `getConfig()`                                            |
| burn/inject 配置 | `getSplitConfig()`                                       |

写方法：

| 按钮       | 方法                                       | 前置检查                       | 成功后刷新       |
| ---------- | ------------------------------------------ | ------------------------------ | ---------------- |
| 授权 AGX   | `AGX.approve(AgxContributionSwap, amount)` | AGX 余额足够                   | allowance        |
| 兑换贡献值 | `convert(agxAmount)`                       | 授权足够；未暂停；金额在限制内 | 贡献值、AGX 余额 |

#### 9.3 Mixed 领奖前端流程

1. 从业务合约读取可领取奖励。
2. 用户输入本次领取金额。
3. 前端调用 quoteRequiredContribution(rewardAmount) 。
4. 前端先用 AgxContributionSwap.originalOf(user) 解析 root，再读取 userContribution(root) 。
5. 如果贡献值不足，引导用户先 convert(agxAmount) 。
6. 释放计划按 RewardQueue.queuePlans(index) 的真实数组 index 展示；复投计划使用 RestakeConfig.getPlanCount() 后逐个调用 getPlan(i) ，保留链上原始 index。不要把 getAllPlans() 过滤后的数组下标当作 planIndex ，否则删除/停用计划后会选错。
7. 用户确认 restakeBps 。
8. 调对应业务合约的 claim*Mixed 方法。
9. 成功后刷新奖励余额、贡献值、RewardQueue、Restake stake。

#### 9.4 Mixed 领奖方法表

| 来源            | ABI                  | 方法                                                                                                          |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| 活期奖励        | `LiquidStaking`      | `claimRewardMixed(releasePlanIndex, amount, restakePlanIndex, restakeBps)`                                    |
| 定期普通奖励    | `LockedStaking`      | `claimRewardMixed(stakeIndex, amount, releasePlanIndex, restakePlanIndex, restakeBps)`                        |
| 定期额外奖励    | `LockedStaking`      | `claimExtraRewardMixed(stakeIndex, amount, releasePlanIndex, restakePlanIndex, restakeBps)`                   |
| EarlyStake 奖励 | `EarlyStaking`       | `claimRewardMixed(amount, releasePlanIndex, restakePlanIndex, restakeBps)`                                    |
| Bond 收益       | `BondDepository`     | `claimStakeProfitMixed(user, amount, releasePlanIndex, bondIndex, restakePlanIndex, restakeBps)`              |
| BurnBond 收益   | `BurnBondDepository` | `claimStakeProfitMixed(user, amount, releasePlanIndex, bondIndex, restakePlanIndex, restakeBps)`              |
| DAO 签名奖励    | `DaoPool`            | `claimRewardsMixed(signType, amount, expireTime, salt, sign, releasePlanIndex, restakePlanIndex, restakeBps)` |

#### 9.5 签名奖励

| 合约                      | 地址 key        | 方法                                                         | signType                 | 返回资产                  |
| ------------------------- | --------------- | ------------------------------------------------------------ | ------------------------ | ------------------------- |
| DaoPool                   | `DaoPool`       | `claimRewardsMixed(...)`                                     | e2e 使用 `4`             | AGX Mixed                 |
| CommunityFund             | `CommunityFund` | `claimReward(signType, amount, expireTime, salt, sign)`      | 后端指定                 | USD/AGX 以合约 token 为准 |
| MarketFund                | `MarketFund`    | `claimReward(signType, amount, expireTime, salt, sign)`      | 后端指定（E2E 使用 `3`） | AGX（9 位精度）           |
| AegisPresaleRewardClaimer | `RewardClaimer` | `claimReward(signType, amount, expireTime, salt, signature)` | e2e 使用 `1`             | USD1                      |

签名字段统一为：

| 字段            | 含义             |
| --------------- | ---------------- |
| `address(this)` | 被领取的合约地址 |
| `salt`          | 一次性随机值     |
| `user`          | 领取用户地址     |
| `amount`        | 领取金额         |
| `expireTime`    | 签名过期时间     |
| `signType`      | 奖励类型         |

前端注意：

- 签名由后端 signer 生成，前端只提交。
- salt 和签名只能用一次。
- 过期后必须重新请求签名。
- DAO 的 signType 固定为 4 ；其他签名奖励按后端与合约配置传值。成功后刷新对应 token 余额、 useSalt(salt) 和 Claimed /Mixed 事件；DAO Mixed 还要刷新贡献值、RewardQueue 与复投仓位。
- 签名奖励失败时优先提示 ErrorAlreadyUsed 、 ErrorInvalidSigner 、 ErrorSignatureExpired 。

### 10. 债券 Bond / BurnBond

#### 10.1 债券页面结构

建议拆成两个 tab：

| tab       | 合约                                | 用途                   |
| --------- | ----------------------------------- | ---------------------- |
| LP Bond   | `BondHelper` + `BondDepository`     | 用 USD1 进入流动性债券 |
| Burn Bond | `BondHelper` + `BurnBondDepository` | 用 USD1 进入燃烧债券   |

#### 10.2 ABI 与地址

| ABI                    | 地址 key                    | 用途                                                                            |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `AegisBondZapHelper`   | `BondHelper`                | 推荐用户入口                                                                    |
| `BondDepository`       | `BondDepository`            | LP Bond 查询、赎回、收益                                                        |
| `BurnBondDepository`   | `BurnBondDepository`        | Burn Bond 查询、赎回、收益                                                      |
| `USD1`                 | 本地 `Faucet` / 主网 `USD1` | USD1 余额和授权                                                                 |
| `Referral`             | `Referral`                  | 前置推荐关系                                                                    |
| `AegisSplitterManager` | `AegisSplitterManager`      | `redeem(..., false)` 后经 Manager 路由查询分流器释放单（历史 PRV 单凭归档 ABI） |

#### 10.3 展示字段

| 字段          | 方法                                |
| ------------- | ----------------------------------- |
| bond 数量     | `getBondCount(user)`                |
| bond 详情     | `getBondInfo(user, bondIndex)`      |
| vesting 进度  | `percentVestedFor(user, bondIndex)` |
| 待赎回 payout | `pendingPayoutFor(user, bondIndex)` |
| 可领取收益    | `getStakeProfit(user, bondIndex)`   |
| 用户锁定本金  | `getUserLockedPrincipal(user)`      |

#### 10.4 用户写方法

| 按钮           | 方法                                                                                             | 参数                                                    | 前置检查                                                                                | 成功后刷新                        |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------- |
| 授权 USD1      | ERC20 `approve(BondHelper, amount)`                                                              | 金额                                                    | USD1 余额足够                                                                           | allowance                         |
| 买 LP Bond     | `zapIntoLiquidityBond(bondDepository, token, amount)`                                            | bond 地址、USD1 地址、金额                              | 推荐已绑定；授权足够；`authContracts(bondDepository)=true`；Pair 存在；债券容量足够     | bond 列表、余额、抽奖资格         |
| 买 Burn Bond   | `zapIntoBurnBond(burnBondDepository, token, amount)`                                             | burn bond 地址、USD1 地址、金额                         | 推荐已绑定；授权足够；`authContracts(burnBondDepository)=true`；Pair 存在；债券容量足够 | bond 列表、余额、抽奖资格         |
| 赎回 bond      | `redeem(recipient, bondIndex, shouldStake)`                                                      | recipient 必须等于 msg.sender                           | bond 存在；有可赎回 payout；`false` 时分流器 Manager 已配置                             | bond 列表、质押仓位或分流器释放单 |
| 领取收益 Mixed | `claimStakeProfitMixed(user, amount, releasePlanIndex, bondIndex, restakePlanIndex, restakeBps)` | Mixed 参数；注意 `releasePlanIndex` 在 `bondIndex` 之前 | 收益足够；贡献值足够                                                                    | 收益、RewardQueue、Restake        |

#### 10.5 注意事项

- 推荐优先走 BondHelper，避免用户手动组 LP。
- redeem(..., true) 表示把本金重新质押； redeem(..., false) 表示经 AegisSplitterManager 路由到 AegisSplitterHead_* 创建线性释放单，不是本金立即到账。每笔释放单的周期以 getRelease(...).release.duration 为准；前端在 false 成功后先 AegisSplitterManager.getHeadSplitterForUser(user) 解析头部分流器，再刷新 getReleaseCount/getRelease 。
- 收益领取使用 claimStakeProfitMixed ，不要使用旧 claimStakeProfit 。
- claimStakeProfitMixed 的 recipient 必须等于调用者；传入其他地址会以 ErrorUserNotAuthorized 原子回滚。
- Helper 报 ErrorNotApproved 表示目标 bond 未授权， ErrorPairNotExist 表示对应交易对不存在；这两类错误不是用户 allowance 问题。
- 债券也可作为 XStaking 的 mining quota 来源之一，前端可以在 XStaking 页面展示用户锁定本金如何影响 quota。

### 11. Governance 治理

#### 11.1 页面用途

治理页展示提案、投票状态、用户票据和投票结束后取回 AGX。

#### 11.2 ABI 与地址

| ABI          | 地址 key     |
| ------------ | ------------ |
| `Governance` | `Governance` |
| ERC20        | `AGX`        |
| `Referral`   | `Referral`   |

#### 11.3 展示字段

| 字段                | 方法                               |
| ------------------- | ---------------------------------- |
| 提案数量            | `proposalCount()`                  |
| 提案详情            | `getProposal(proposalId)`          |
| 提案状态            | `queryProposalState(proposalId)`   |
| 用户投票记录        | `getVoteReceipt(proposalId, user)` |
| 用户奖励/可取回信息 | `getVoteRewards(proposalId, user)` |
| AGX 授权            | `AGX.allowance(user, Governance)`  |

#### 11.4 写方法

| 按钮         | 方法                                                       | 前置检查                               | 成功后刷新                   |
| ------------ | ---------------------------------------------------------- | -------------------------------------- | ---------------------------- |
| 创建提案     | `initProposal(proposalId, voteEnd, minQuorum, winRateBps)` | proposer/owner 权限                    | 提案列表                     |
| 授权 AGX     | `AGX.approve(Governance, amount)`                          | AGX 余额足够                           | allowance                    |
| 投票         | `vote(proposalId, support, amount)`                        | 推荐已绑定；提案可投；授权足够         | 提案状态、用户票据、AGX 余额 |
| 取回         | `withdrawal(proposalId)`                                   | 投票结束后 10 天窗口内                 | 用户票据、AGX 余额           |
| 取消提案     | `cancelProposal(proposalId)`                               | 权限满足                               | 提案状态                     |
| 结算失败提案 | `finalizeProposal(proposalId)`                             | 投票已结束且仍需固化失败状态           | 提案状态                     |
| 执行提案     | `executeProposal(proposalId)`                              | 任何地址可触发；状态必须为 `Succeeded` | 提案状态                     |

#### 11.5 注意事项

- support : 0 = Against , 1 = For , 2 = Abstain 。
- 当前主路径是 initProposal 、 vote 、 withdrawal 。
- 不要按旧文档设计 propose 入口。

### 12. RewardQueue 奖励释放队列

#### 12.1 页面用途

RewardQueue 展示 Mixed 领奖 release 部分进入的线性释放队列，并允许领取已释放奖励。

#### 12.2 ABI 与地址

| ABI                       | 地址 key      |
| ------------------------- | ------------- |
| `AegisRewardVestingQueue` | `RewardQueue` |
| `Turbine`                 | `Turbine`     |

#### 12.3 展示字段

| 字段            | 方法                                                          | 说明                                                                                 |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| plan 数量       | `queueSize()`                                                 | plans 长度                                                                           |
| plan 配置       | `queuePlans()`                                                | `releaseDuration`, `feeRate`, `feeRecipient`                                         |
| 用户队列总数    | `getUserQueueTotalCount(user)`                                | 跨 plan 总数                                                                         |
| 单 plan 队列数  | `getQueuePlanSize(user, planIndex)`                           | 分组列表                                                                             |
| 单项数据        | `getQueueData(user, planIndex, index)`                        | `lockedAmount`, `lastClaimTime`, `warmupTime`, `remainingDuration`, `releasedAmount` |
| 单项可领取      | `getReleasedRewards(user, planIndex, index)`                  | 按当前时间计算                                                                       |
| plan 可领取合计 | `getReleasedRewardsWithPlanIndex(user, planIndex)`            | 可做 plan 卡片                                                                       |
| 分页可领取合计  | `getReleasedRewardsWithOffset(user, planIndex, start, limit)` | 大列表优化                                                                           |
| 用户可领取列表  | `getUserClaimableList(user, start, limit)`                    | 返回跨 plan 列表和 totalCount                                                        |
| 用户总可领取    | `getUserTotalClaimable(user)`                                 | 顶部汇总                                                                             |

#### 12.4 用户写方法

| 按钮          | 方法                                                 | 前置检查           | 成功后刷新              |
| ------------- | ---------------------------------------------------- | ------------------ | ----------------------- |
| 领取单项      | `claimVestedReward(planIndex, index)`                | 单项 claimable > 0 | 队列项、Turbine 配额    |
| 领取整个 plan | `claimAllVestedRewards(planIndex)`                   | plan claimable > 0 | plan 列表、Turbine 配额 |
| 范围领取      | `claimVestedRewardsInRange(planIndex, start, limit)` | 范围内存在可领取   | 列表、Turbine 配额      |

#### 12.5 注意事项

- 不要假设只有 plan 0 。
- 领取 RewardQueue 后，可能通过 Turbine 形成出售配额；前端应刷新 Turbine 页面状态。
- queuePlanInfo(index) 只返回 feeRate/feeRecipient，完整 plan 列表用 queuePlans() 。

### 13. 分流器本金释放（原 PrincipalReleaseVault）

#### 13.1 页面用途

本金释放页统一展示 LiquidStaking、三个 LockedStaking、EarlyStaking、Bond/BurnBond 的 `redeem(..., false)`、XStakingPool 退出以及 Turbine 冷却 gAGX 所产生的线性释放单。各入口把资金送入 `AegisSplitterManager`（ABI 兼容原 PRV 的 `createRelease(address,uint256)`），Manager 按用户 Referral 绑定时间路由到 `AegisSplitterHead_*` 等头部分流器，再按 `next` 链式串联释放。这些入口不会把本金立即转入钱包；默认 30 天线性释放，新用户可按 Manager 配置独立周期，每笔单据以创建时锁定的周期为准（释放记录带 `token` 字段，AGX 或 gAGX）。

原 `PrincipalReleaseVault` 已于 2026-08-03 从代码库删除，ABI 归档 `archive/PrincipalReleaseVault/`；链上历史释放单仍在该合约上运行，用户凭归档 ABI 在旧地址领取，不再有新的释放单进入。

#### 13.2 ABI 与地址

| ABI                    | 地址 key                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `AegisSplitterManager` | `AegisSplitterManager`                                                               |
| `AegisSplitter`        | `AegisSplitterHead_0` 等（以 `Manager.headSplitters`/`getHeadSplitterForUser` 解析） |
| ERC20                  | `AGX`（释放单另有 gAGX 情形）                                                        |

#### 13.3 展示字段

| 字段           | 方法                                                                                        | 说明                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 用户头部分流器 | `AegisSplitterManager.getHeadSplitterForUser(user)`                                         | 按用户注册时间解析释放单所在分流器                                                                                             |
| 新老用户判定   | `AegisSplitterManager.isNewUser(user)` / `effectiveDuration(user)` / `newUserReleasePeriod` | 展示当前释放周期口径                                                                                                           |
| 释放单数量     | `AegisSplitter.getReleaseCount(user)`                                                       | 列表长度                                                                                                                       |
| 释放单详情     | `AegisSplitter.getRelease(user, index)`                                                     | `release.duration` 是本单锁定周期；同时返回 `token`、`claimableAmount`, `remainingAmount`, `endTime`, `fullyClaimed`           |
| 分页释放单详情 | `AegisSplitter.getReleases(user, start, limit)`                                             | 返回 `(items, totalCount)`；`limit` 必须为 1–50，尾页自动截断，`start >= totalCount` 返回空页；`items[i]` 对应索引 `start + i` |
| 单项可领取     | `AegisSplitter.claimable(user, index)`                                                      | 单独按钮判断                                                                                                                   |
| 单据锁定周期   | `AegisSplitter.getReleaseDuration(user, index)`                                             | 等同于 `getRelease(...).release.duration`                                                                                      |

#### 13.4 用户写方法

| 按钮         | 方法                                    | 前置检查              | 成功后刷新           |
| ------------ | --------------------------------------- | --------------------- | -------------------- |
| 领取单项本金 | `AegisSplitter.claim(index)`            | `claimableAmount > 0` | 释放单、AGX 余额     |
| 批量领取     | `AegisSplitter.claimMany(start, limit)` | 范围内存在 claimable  | 释放单列表、AGX 余额 |

#### 13.5 注意事项

- claim 只有一个参数 index ，没有 claim(user,index) ； claimMany 如果范围内没有可领取金额会 revert ErrorNothingToClaim 。
- 释放单列表使用 getReleases(user,start,limit) ，建议页面大小 50； limit == 0 或 limit > 50 会 revert ErrorInvalidPagination 。主网 AegisSplitterHead_0 已升级到实现 0x5b9D6B8c88973d8c028C1C83956fF5474CE38B7d ，链上 MAX_RELEASE_PAGE_SIZE() == 50 ；接入其他实例前仍须先确认其实现版本。
- 非链尾分流器的领取动作会把可领取金额推入 next 分流器再开启新一轮释放，只有链尾（ next == 0 ）才直接到用户钱包；前端须以 AegisSplitter.getRelease/getReleaseCount 回读为准。
- 释放单来源通常是 claimPrincipal 、 redeem(..., false) 、 startUnstake 或 Turbine claimCooledGagx ，用户不直接创建；Manager 的 createRelease 只接受 authorizedCallers 白名单调用。

### 14. LuckyPool 去中心化抽奖

#### 14.1 用户抽奖页

| 项       | 内容                                          |
| -------- | --------------------------------------------- |
| ABI      | `AegisLuckyPool`, `AegisDailyPurchaseTracker` |
| 地址 key | `LuckyPool`, `DailyPurchaseTracker`           |

展示字段：

| 字段             | 方法                                                   | 说明                                                                                                                                                |
| ---------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 当前轮 ID        | `currentRoundId()`                                     | 当前 Open 轮次；关轮请求 VRF 时合约会立即创建下一个 Open 轮，旧轮需按 ID 查询                                                                       |
| 历史轮数量       | `roundCount()`                                         | 列表分页                                                                                                                                            |
| 历史轮 ID        | `getRoundIds(offset, limit)`                           | 历史列表                                                                                                                                            |
| 轮次详情         | `getRound(roundId)`                                    | Open 状态的 `rewardAmount` 是每位中奖者的 USD1 价值目标；关轮请求 VRF 后会被替换为按实时价格锁定的 AGX 数量，`rewardPerWinner` 在回调开奖后与其一致 |
| 实时奖励报价     | `quoteRewardAgx(rewardValueUsd1)`                      | 按当前 AGX/USD1 池价格报价价值不少于目标 USD1 的 AGX 数量，仅用于展示/备货；实际奖额以关轮时锁定值为准                                              |
| 当前资格         | `isEligible(roundId, user)`                            | public mapping getter                                                                                                                               |
| 用户购买统计     | `DailyPurchaseTracker.getUserRoundStat(roundId, user)` | `totalAmount`, `qualified`, `qualifiedAt`                                                                                                           |
| 最低达标金额     | `DailyPurchaseTracker.minPurchaseAmount()`             | 单笔达标门槛                                                                                                                                        |
| Tracker 安全版本 | `trackingSafetyVersion()`                              | 必须为 `3`；表示购买记录 fail-soft，并会在每次成功记录后 best-effort 检查/推进已到期轮次                                                            |
| 待同步资格       | `pendingQualificationCount(roundId)`                   | 非零时该轮不会关闭；任何地址可调用 `retryQualification`                                                                                             |
| 待归属购买       | `unresolvedDeferredPurchaseCount()`                    | 非零时需运维及时 assign/discard；不会阻止无关当前轮关轮                                                                                             |
| 资格同步状态     | `qualificationSyncState(roundId,user)`                 | `None/Pending/Syncing/Synced/Expired`                                                                                                               |
| 达标用户列表     | `getEligibleUsers(roundId, offset, limit)`             | 管理/公开榜单                                                                                                                                       |
| 中奖地址列表     | `getWinners(roundId)`                                  | 开奖后展示                                                                                                                                          |
| 单用户中奖信息   | `getWinnerInfo(roundId, user)`                         | `won`, `rewardAmount`                                                                                                                               |
| 是否已领取       | `rewardClaimed(roundId, user)`                         | 用户成功执行 `claimRewardMixed` 后 true                                                                                                             |
| 奖励库存         | `rewardReserve()`                                      | 管理页更重要                                                                                                                                        |
| reserved         | `reservedRewards()`                                    | 已锁定未释放奖励                                                                                                                                    |

用户写方法：

| 按钮       | 方法                                                                        | 适用场景                                                                                                      |
| ---------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 领取幸运奖 | `claimRewardMixed(roundId, releasePlanIndex, restakePlanIndex, restakeBps)` | 用户中奖、奖励金额大于 0 且尚未领取；按贡献值系数消费贡献值，释放部分入 RewardQueue、复投部分进 LockedStaking |

用户获得资格的方式：

| 来源     | 说明                           |
| -------- | ------------------------------ |
| 活期质押 | `liquidStake` 由授权购买源记录 |
| 定期质押 | `lockedStake` 由授权购买源记录 |
| 债券     | Bond/BondHelper 路径记录       |
| 复投     | 满足配置时可能记录             |

注意事项：

- 用户不能主动 enterRound 。
- 前端不要直接调用 DailyPurchaseTracker.recordPurchase 。
- 资格按单笔 amount >= minPurchaseAmount ，不是多笔累计达标。
- 每笔授权来源购买会先 best-effort 尝试 LuckyPool upkeep，再读取当前轮归属；若上一轮已到期且能推进，本笔计入新轮。Pool 不可读、推进失败或没有有效 Open 窗口时进入 PurchaseDeferred ，不会写入过期轮。
- LuckyPool 暂停、窗口无效或临时异常不会让质押/债券交易回滚。来源合约的价格读取或 Tracker 调用失败会发出 PurchaseTrackingFailed ；主业务交易仍可能成功，前端须以质押/债券事件和仓位回读为准，并将该事件上报运维。
- 前端可为 Pending 状态提供“重试资格同步”按钮，调用 retryQualification(roundId,user) ；待归属购买属于运维流程，不应由普通用户猜测轮次。
- 自建 keeper 负责在任何 Open 轮到期后触发推进。有资格用户时请求 Chainlink VRF v2.5；零资格时不请求 VRF，直接以 Drawn / 0 人中奖完成并创建下一轮。
- 空轮完成后 requestId=0 、 rewardAmount=0 、 winnerCount=0 ，并触发 RoundSkipped 。前端不能假设所有 Drawn 轮都会出现 RandomnessFulfilled 。
- 有资格用户时，VRF 回调选择最多 maxWinners 个中奖者并记录待领取金额，不转账。
- 每位中奖者默认目标为 500 USD1；关轮请求 VRF 的交易会实时读取 AGX/USD1 价格并向上取整锁定 AGX 奖额。回调前后的价格变化都不会改写已锁定的奖额。
- 开奖后若 won = true 且 rewardClaimed = false ，前端展示“领取”按钮；成功后刷新 rewardClaimed 、 reservedRewards 、 RewardQueue.totalEnqueued 和 AgxContributionSwap.userContribution 。
- 领取前需确保中奖者有足够贡献值（ rewardAmount / contributionDivisor ），否则 claimRewardMixed revert ErrorInsufficientContribution ；前端可引导用户先 AgxContributionSwap.convert 补充贡献值。
- restakeBps 0 = 全部释放进 RewardQueue，10000 = 全部复投进 LockedStaking； releasePlanIndex / restakePlanIndex 对应 RestakeConfig 中的释放计划与复投计划。
- 已迁移旧地址调用领取会报 ErrorAccountMigrated ，应切换到迁移后的新地址。
- LuckyPool 跟随统一 root 迁移，支持 A→B→C（次数读取 Manager 的 maxMigrationHops ，默认 8）。前端应始终使用 canonicalAccount() 展示当前地址，并用 migratedFrom() 展示首次 root；旧地址和中间地址不能继续领取。

#### 14.2 管理抽奖页

| 功能               | 方法                                                      | 说明                                                                                   |
| ------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 奖励充值           | `depositRewards(amount)`                                  | 需要先 approve reward token                                                            |
| 手工推进当前过期轮 | `closeCurrentAndRequestRandomness()`                      | permissionless 应急入口；有资格用户时请求 VRF，零资格时返回 0 并自动跳过               |
| keeper 检查        | `checkUpkeep("0x")`                                       | 每 1～5 分钟只读调用；到期且 Tracker backlog 清零才返回 true，零资格轮无需链下过滤     |
| keeper 执行        | `performUpkeep(performData)`                              | 有资格用户时请求 VRF；零资格时发出 `RoundSkipped` 并创建下一轮                         |
| 显式管理取消       | `cancelCurrentAndCreateNextRound()`                       | 仅 owner；保留的管理兼容入口，会将零资格轮标记为 `Cancelled`，正常 keeper 路径不需使用 |
| 已废弃兼容入口     | `cancelTimedOutRound(roundId)`                            | 始终回滚，前端和运维不得调用                                                           |
| 迁移旧请求绑定     | `migrateLegacyRequestCoordinatorBindings(maxRounds)`      | 代理升级后暂停状态下由 owner 分页执行                                                  |
| 配置默认值         | `setDefaults(rewardValueUsd1, roundDuration, maxWinners)` | owner                                                                                  |
| 配置 VRF           | `setVrfConfig(...)`                                       | owner                                                                                  |
| 暂停               | `setPaused(flag)`                                         | owner                                                                                  |

`setVrfConfig` 切换 Coordinator 后，已经发出的新版本请求仍只接受其发起时的 Coordinator；前端应使用 `requestRoundIdByCoordinator(coordinator, requestId)` 联合查询，不能把 `requestId` 当作跨 Coordinator 全局唯一值。从旧实现升级后，应展示 `legacyRequestBindingCursor / roundCount` 进度并分页执行迁移；`legacyRequestBindingComplete=false` 时链上会拒绝切换 Coordinator。

`setVrfConfig` 的链上实现只拦截零值，管理台必须在提交前按目标网络的 Chainlink 官方参数做硬校验：BNB Chain 的 `requestConfirmations` 必须在 `3..200`，`callbackGasLimit` 必须在 `1..2_500_000`，Coordinator 和 `keyHash` 只能从当前网络审批白名单选择，`subscriptionId` 必须非零且包含 LuckyPool proxy Consumer，Subscription 必须按 `nativePayment` 充足 BNB 或官方 LINK。不允许运营人员任意粘贴地址或越界数值。

管理看板还应分别显示：VRF Subscription 的 LINK/BNB 余额与 `nativePayment`、keeper EOA 的 BNB gas 余额、上次检查时间、上次成功 `performUpkeep` 交易、当前轮 pending 数和全局 deferred 数，以及超过 SLA 仍为 Open 的过期轮告警。若 backlog 非零，先处理资格再告警 keeper；零资格轮的 `RoundSkipped` 是正常完成事件。

### 15. XStakingPool X 挖矿

#### 15.1 页面用途

XStakingPool 页面用于 AGX -> gAGX 包装、gAGX 质押、warmup 激活、X 奖励领取、本金退出。

#### 15.2 ABI 与地址

| ABI                    | 地址 key               | 用途                |
| ---------------------- | ---------------------- | ------------------- |
| `AegisRedeemableGAGX`  | `RewardGAGX`           | AGX/gAGX 包装和赎回 |
| `AegisXMiningPool`     | `XStakingPool`         | 挖矿状态和操作      |
| ERC20                  | `AGX`                  | wrap 前资产         |
| ERC20                  | `XToken`               | 奖励余额            |
| `AegisSplitterManager` | `AegisSplitterManager` | 退出本金释放路由    |

#### 15.3 展示字段

| 字段           | 方法                          | 说明                                                                                                                    |
| -------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| AGX 余额       | `AGX.balanceOf(user)`         | wrap 输入                                                                                                               |
| gAGX 余额      | `RewardGAGX.balanceOf(user)`  | stake 输入                                                                                                              |
| gAGX backing   | `RewardGAGX.backingBalance()` | 管理/透明度                                                                                                             |
| stake 原始结构 | `XStakingPool.stakes(root)`   | 包含 active/warmup gons、时间、rewardStartTime；public mapping 不解析迁移别名，root 用 AccountMigrationManager 首次地址 |
| 总质押量       | `miningStakeAmountOf(user)`   | active + warmup                                                                                                         |
| mining quota   | `miningQuotaOf(user)`         | Early、三个 Locked、三个 Bond、三个 BurnBond 共 10 个来源均按首次 root 读取锁定本金                                     |
| pending X      | `pendingReward(user)`         | 已结算 + 未结算预览                                                                                                     |
| pending 价值   | `pendingRewardValue(user)`    | AGX/gAGX 价值口径                                                                                                       |
| warmup 周期    | `WARMUP_PERIOD()`             | 当前为 24 小时                                                                                                          |
| X 余额         | `XToken.balanceOf(user)`      | 领取后刷新                                                                                                              |

#### 15.4 用户写方法

| 步骤 | 按钮                  | 方法                                       | 前置检查                                                                                | 成功后刷新          |
| ---- | --------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------- |
| 1    | 授权 AGX 给 gAGX      | `AGX.approve(RewardGAGX, amount)`          | AGX 余额足够                                                                            | allowance           |
| 2    | 包装 gAGX             | `RewardGAGX.wrap(amount)`                  | 授权足够                                                                                | AGX/gAGX 余额       |
| 3    | 授权 gAGX 给 XStaking | `RewardGAGX.approve(XStakingPool, amount)` | gAGX 余额足够                                                                           | allowance           |
| 4    | 质押 gAGX             | `stakeGagxForMining(amount)`               | mining quota 足够；授权足够                                                             | stake、warmup 时间  |
| 5    | 激活 warmup           | `activateWarmup()`                         | warmupGons > 0；当前时间 >= warmupEndTime                                               | active stake        |
| 6    | 领取 X                | `claimReward()`                            | pendingReward > 0；管理员已结算或有可预览奖励                                           | X 余额、pending     |
| 7    | 退出                  | `startUnstake()`                           | 无 warmup；active stake > 0；`principalReleaseVault`（指向 AegisSplitterManager）已配置 | stake、分流器释放单 |
| 可选 | 赎回未质押 gAGX       | `RewardGAGX.redeem(amount)`                | gAGX 余额足够                                                                           | AGX/gAGX 余额       |

#### 15.5 管理写方法

| 方法                              | 说明                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `settleRewards()`                 | 管理员/Operator 结算 X 奖励；读取 AGX/X pair 储备价格，gAGX 按底层 AGX 1:1 价值计价 |
| `setRewardPricePair(pair)`        | 配置奖励价格 pair                                                                   |
| `setMiningQuotaSource(sources[])` | 配置 quota 来源                                                                     |
| `injectRewards(rewardAmount, 0)`  | owner/operator 给池子补 X 奖励；先授权 X，第二参数当前未使用但 ABI 必须传入         |

#### 15.6 前端注意

- warmup 未结束时不能领取 X，也不能 startUnstake 。
- cancelWarmup() 当前会 revert ErrorWarmupExitDisabled ，不要做取消按钮。
- X 奖励按秒产生 AGX 价值，但 X 数量由 settleRewards() 在合约内按 pair 实时价格结算，前端不传价格。
- startUnstake() 会把 gAGX redeem 成 AGX，并经 AegisSplitterManager 路由创建分流器释放单，不是立即到账。
- mining quota 由 Early、三个 Locked、三个 Bond、三个 BurnBond 的 alias-aware 锁定本金决定；A→B→C 后新地址 C 继续使用 root A 的本金配额，前端直接查询 miningQuotaOf(canonicalAccount) ，不要自行复制或相加 A/B/C。quota 不足会 revert ErrorMiningQuotaExceeded 。

### 16. Turbine

#### 16.1 页面用途

Turbine 页面展示用户出售配额、需要支付的 USD1、冷却列表和可领取 gAGX。

#### 16.2 ABI 与地址

| ABI                   | 地址 key                    |
| --------------------- | --------------------------- |
| `Turbine`             | `Turbine`                   |
| `USD1`                | 本地 `Faucet` / 主网 `USD1` |
| `AegisRedeemableGAGX` | `RewardGAGX`                |

#### 16.3 展示字段

| 字段         | 方法                          | 说明                                                                            |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------- |
| 用户配额     | `turbineBalances(user)`       | 可购买/沉默的 AGX 配额                                                          |
| 冷却条数     | `silencesSize(user)`          | 列表长度                                                                        |
| 冷却记录     | `silences(user, index)`       | 返回 `silenceBalance`、`startTime`；按 `currentCooldownDuration()` 计算到期时间 |
| 冷却是否到期 | `isVested(user, index)`       | claim 按钮依据                                                                  |
| 当前冷却周期 | `currentCooldownDuration()`   | 可能随 treasury reserve ratio 自适应                                            |
| 所需 USD1    | `quoteUsdInForAgxOut(amount)` | 给定 AGX 配额需要多少 USD1                                                      |

#### 16.4 用户写方法

| 按钮           | 方法                                | 前置检查                                                                     | 成功后刷新                        |
| -------------- | ----------------------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| 授权 USD1      | `USD1.approve(Turbine, amount)`     | USD1 余额足够                                                                | allowance                         |
| 购买并开始冷却 | `buyAgxAndStartCooldown(usdAmount)` | `usdAmount > 0`；turbineBalances > 0；USD1 授权足够；usdAmount <= 全配额报价 | 配额、冷却列表、AGX 余额          |
| 领取冷却 gAGX  | `claimCooledGagx(index)`            | `isVested(user,index)=true`                                                  | 冷却列表、分流器释放单、gAGX 余额 |

#### 16.5 注意事项

- buyAgxAndStartCooldown 会将实际买到的 AGX 发送给用户，同时创建冷却记录；冷却到期的 gAGX 不再直接 mint 到用户钱包，而是经 AegisSplitterManager 路由进入分流器线性释放（默认 30 天，新用户按 Manager 配置周期）。
- 实际消耗的配额是 swap 实得 AGX 与当前 quota 的较小值；部分 USD1 输入不保证一次用完全部 quota。
- claimCooledGagx(index) 成功后会移除该 index，列表顺序可能变化，前端需重新拉取。
- RewardQueue 领取后可能增加 Turbine 配额，领取 RewardQueue 后要刷新 Turbine。

### 17. 账户迁移

#### 17.1 页面用途

账户迁移页面用于把旧地址权益迁移到新地址。流程是旧地址申请、operator 审批、新地址激活。

本轮全新主网发布部署新的 AccountMigrationManager 并启用迁移：21 个迁移目标（含全新部署的 Referral/PreSale，slot 0/1）owner 均为部署者，base verify 通过后由 `configure-account-migration-manager` 一脚本完成绑定 + `lockTargets` + `setOperator` + `setMigrationEnabled(true)`。最终验收 `migrationEnabled() == true`、`targetsLocked() == true`、21 target 全部 `migrationManager()` 指向新 Manager。前端可开放账户迁移入口（旧地址申请 → operator 审批 → 新地址激活）。

#### 17.2 ABI 与地址

| ABI                       | 地址 key                  |
| ------------------------- | ------------------------- |
| `AccountMigrationManager` | `AccountMigrationManager` |

#### 17.3 展示字段

| 字段           | 方法                                | 说明                                                           |
| -------------- | ----------------------------------- | -------------------------------------------------------------- |
| 当前 canonical | `canonicalAccount(account)`         | 最终权益地址                                                   |
| 是否旧地址     | `isOldAccount(account)`             | true 时提示不要继续使用                                        |
| 迁移目标       | `migratedTo(account)`               | 旧地址 -> 新地址                                               |
| 请求的新地址   | `requestedNewOf(account)`           | pending/approved 状态展示                                      |
| 新地址预留来源 | `requestedOldOf(newAccount)`        | 防止两个旧地址抢占同一新地址                                   |
| 身份 root      | `migratedFrom(account)`             | 多跳迁移仍指向首次地址                                         |
| 请求状态       | `requestStatus(account)`            | `None=0, Pending=1, Approved=2, Rejected=3, Finalized=4`       |
| 是否 finalized | `migrationFinalized(account)`       | 激活完成                                                       |
| 请求总数       | `requestCount()`                    | 管理台分页                                                     |
| 请求列表       | `getRequests(offset, limit)`        | 管理台                                                         |
| pending 列表   | `getPendingRequests(offset, limit)` | 管理台                                                         |
| Referral 目标  | `referralTarget()`                  | 必须等于目标数组第 0 项，首次配置后不可替换                    |
| 当前目标数组   | `getMigrationTargets()`             | 当前所有原子迁移 target；不要使用已删除的固定 `targets()` 结构 |
| 目标是否锁定   | `targetsLocked()`                   | 只有 true 才允许重新开启迁移                                   |
| 迁移总开关     | `migrationEnabled()`                | false 时用户申请、激活和 operator 直迁均不可执行               |
| 最大迁移跳数   | `maxMigrationHops()`                | 默认 8；owner 只能在迁移暂停时修改                             |

#### 17.4 写方法

| 角色       | 按钮     | 方法                            | 前置检查                                | 成功后刷新                                    |
| ---------- | -------- | ------------------------------- | --------------------------------------- | --------------------------------------------- |
| 旧地址用户 | 发起迁移 | `requestMigration(newAccount)`  | newAccount 非零且不是旧地址；迁移未完成 | requestStatus、requestedNewOf                 |
| 旧地址用户 | 取消迁移 | `cancelMigrationRequest()`      | 状态为 pending 或 approved              | requestStatus、requestedNewOf、requestedOldOf |
| operator   | 审批迁移 | `approveMigration(oldAccount)`  | 请求状态 pending                        | pending 列表、requestStatus                   |
| 新地址用户 | 激活迁移 | `activateMigration(oldAccount)` | 当前 signer 是 approved newAccount      | canonical、isOldAccount、业务页面             |

#### 17.5 目标清单管理（仅运营后台）

当前 Manager 使用动态 `address[]`，标准主网清单是 21 个唯一 target。Referral 永远位于索引 0；目标上限为 `MAX_MIGRATION_TARGET_COUNT() = 32`。普通用户端不得展示下列 owner 方法。

| 方法                              | 用途                             | 关键约束                                                                                                        |
| --------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `setMigrationEnabled(false)`      | 进入维护状态                     | 调整目标或 `maxMigrationHops` 前必须先暂停                                                                      |
| `setTargets(referral, targets[])` | 首次配置、整体替换或恢复标准顺序 | 1–32 个；`targets[0] == referral`；地址唯一、有代码、且每个 target 的 `migrationManager()` 已反向绑定本 Manager |
| `addMigrationTarget(target)`      | 单独追加 target                  | 不得重复；总数不得超过 32；成功后自动解锁                                                                       |
| `removeMigrationTarget(target)`   | 单独移除非 Referral target       | Referral 禁止移除；保持剩余数组顺序；成功后自动解锁                                                             |
| `lockTargets()`                   | 完整校验并锁定当前数组           | 校验通过后 `targetsLocked=true`                                                                                 |
| `setMigrationEnabled(true)`       | 恢复迁移                         | 会再次验证 target 数组、锁定状态和 `maxMigrationHops > 0`                                                       |

安全操作顺序必须固定为：

text

```text
setMigrationEnabled(false)
  → setTargets / addMigrationTarget / removeMigrationTarget
  → 回读 referralTarget + getMigrationTargets + 每个 target.migrationManager()
  → lockTargets()
  → 回读 targetsLocked=true
  → setMigrationEnabled(true)
```

新增 target 不会自动重放过去已经完成的 A→B 或 A→B→C；移除 target 也不会删除该合约中的历史 alias。运营后台必须在新增前完成历史回填/兼容性评估，在移除前确认目标已退役。任一 target 在执行 `migrateAccount` 时 revert，会使整笔统一迁移原子回滚。

#### 17.6 注意事项

- 激活后，旧地址应提示停止操作。
- 支持 A→B→C；A/B 都是禁用旧地址，前端始终使用 canonicalAccount 返回的最新地址。
- PreSale 汇总展示先用 AccountMigrationManager.migratedFrom(currentWallet) 取得首次 root（返回零地址时 root 即当前地址），再把 root 传给 PreSale 现有 public mapping getter。
- 历史数据保存在首次 root，不会复制用户数组；前端仍用当前钱包查询。
- 单一身份最多迁移 maxMigrationHops() 次（默认 8）；达到当前上限时必须停止并提示联系人工支持。
- 新地址必须是完全干净的 EOA，不能已有推荐关系、业务状态或其他迁移预留。
- old、新地址或首次 root 任一被拉黑都会阻止申请/激活；前端在审批后也要处理激活阶段重新检查失败。
- 超过当前配置值的下一次迁移由 AccountMigrationManager 返回 AM__MaxMigrationHopsExceeded ；具体业务合约不单独设置跳数限制。
- 管理台应展示 pending 请求并支持审批/拒绝。
- getRequests / getPendingRequests 的 limit 必须为 1..20 ；分页组件不得传 0 或大于 20。
- 动态数组版本与旧版固定 Targets 存储布局不兼容；前端不得把旧 Manager ABI 或旧 proxy 地址与本轮 ABI 混用。

### 18. 管理台与风控看板

#### 18.1 管理台模块

| 模块            | ABI              | 地址 key        | 主要读方法                                                                                                                                                                                                                                                                                                                                                         | 主要写方法                                                                                                                                                        |
| --------------- | ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Treasury        | `Treasury`       | `Treasury`      | `totalReserves()`, `supplied()`, `excessReserves()`                                                                                                                                                                                                                                                                                                                | 授权合约调用 reserve/mint 方法                                                                                                                                    |
| RBS             | `RBS`            | `RBS`           | `getTokenPrice(token)`, `quote(...)`                                                                                                                                                                                                                                                                                                                               | `mint`（仅 owner）、`swap`/`addLiquidity`/`burnLP`/`removeLiquidity`（owner 或 operator）                                                                         |
| AGX 防御        | `AegisXToken`    | `AGX`           | `sellRatio()`, `extraSellBP()`, `crashThresholdBP()`, `crashFuseActive()`, `snapshotPrice()`, `defenseEndTime()`, `consecutiveDropBlocks()`, `blockSellQuotaBlock()`, `blockStartAgxReserve()`, `blockSellThresholdBP()`, `blockSellLimit()`, `grossSoldInBlock()`, `pendingCrashThresholdBP()`, `crashThresholdEffectiveBlock()`, `crashThresholdUpdatePending()` | Governance 防御配置方法；`setDefenseMode(false)` 关闭持续熔断但不重开当块额度                                                                                     |
| RiskControl     | `RiskControl`    | `RiskControl`   | `balanceControlAddress()`, `feeControlAddress()` 等公开状态                                                                                                                                                                                                                                                                                                        | `executeBalance()` 仅 balanceControlAddress；`updateFeeRatio(newTaxRate)` 仅 feeControlAddress；owner 只能配置控制地址                                            |
| RewardManager   | `RewardManager`  | `RewardManager` | `previewEpochRewards()`, `recipientCount()`, `info(index)`, `nextRewardFor(recipient)`                                                                                                                                                                                                                                                                             | `distributeEpochRewards()` 任何地址可触发，但区块未到 `endBlock` 时返回 false；`settleEpochRewards(epochNumber)` 仅 StakingPool 且只能结算 current-1 未发放 epoch |
| FeeBot          | `FeeBot`         | `FeeBot`        | `isExecSwap()`                                                                                                                                                                                                                                                                                                                                                     | `exec()`                                                                                                                                                          |
| TokenFeeBot     | `TokenFeeBot`    | `TokenFeeBot`   | `isExecSwap()`                                                                                                                                                                                                                                                                                                                                                     | `exec()`                                                                                                                                                          |
| LuckyPool 管理  | `AegisLuckyPool` | `LuckyPool`     | `rewardReserve()`, `reservedRewards()`, `getRound()`；keeper/VRF 运行状态来自监控                                                                                                                                                                                                                                                                                  | `depositRewards`、配置方法；正常关轮和零资格轮跳过均由无权限 keeper 触发，owner 取消仅为兼容入口                                                                  |
| EarlyStake 管理 | `EarlyStaking`   | `EarlyStaking`  | 用户 stake 查询                                                                                                                                                                                                                                                                                                                                                    | `earlyStake(users, amounts)`                                                                                                                                      |

#### 18.2 管理台注意事项

- 所有 owner/operator 按钮必须先做权限判断。
- 普通用户端不要展示 owner/operator 方法。
- 后台执行类方法应保留操作日志，至少记录 tx hash、调用人、参数、事件。
- FeeBot/TokenFeeBot 执行前先读 isExecSwap() ，如果 shouldExecute=false 不要让用户发交易。
- AGX 默认跌幅阈值为 5%，单区块低税毛卖出额度按阈值的一半计算，即第一笔受管控卖出前 AGX 储备的 2.5%。同块后续卖出会按当前储备单调收紧额度但不会扩大；累计量严格大于 blockSellLimit 时，越界交易整笔改用防御税并进入 RBS，但 crashFuseActive 不会因此自动变为 true。
- AGX 持续熔断需要在两个不同区块各出现一次符合跌幅条件的卖出观察，区块无需相邻；同一区块只计一次，激活前观察到价格恢复至阈值线或以上会清空确认。治理调用 snapshotDefensePrice() 刷新快照时也会清空旧快照下的确认，旧确认不会跨快照累计。 consecutiveDropBlocks() 为兼容保留的历史命名，实际表示当前低价区间内的不同区块确认数。监听 BlockSellQuotaInitialized 、 BlockSellQuotaReduced 、 BlockSellDefenseTaxApplied 、 CrashThresholdUpdateScheduled 、 CrashThresholdUpdated 、 DropConfirmed 、 ExtraSellTaxActivated 和 ExtraSellTaxDeactivated 更新管理台状态。

### 19. 常见错误与前端提示

| 错误 / revert                                                                 | 常见原因                                                                                | 前端提示                                                              |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `Not approved`, `ErrorNotApproved`, `ErrorStakeNotApproved`                   | 未绑定推荐人                                                                            | 先绑定推荐人                                                          |
| `ErrorZeroAmount`, `ErrorAmountZero`                                          | 输入金额为 0                                                                            | 输入大于 0                                                            |
| `ErrorInsufficientBalance`, `ErrorExceedsBalance`                             | 钱包余额或合约库存不足                                                                  | 检查余额或等待补库存                                                  |
| `ErrorStakeAmountLimit`                                                       | 超过质押额度                                                                            | 降低金额或等待额度恢复                                                |
| `ErrorStakeWarmupNotEnded`, `ErrorStillLocked`, `ErrorWarmupPending`          | warmup 或锁定期未结束                                                                   | 展示剩余时间                                                          |
| `ErrorRewardAlreadyClaimed`                                                   | LuckyPool 奖励已领取                                                                    | 不要重复领取                                                          |
| `ErrorInsufficientContribution`                                               | 中奖者贡献值不足                                                                        | 引导用户 `AgxContributionSwap.convert` 补充贡献值后重试               |
| `ErrorRestakeConfigNotSet` / `ErrorRewardQueueNotSet`                         | owner 未接线复投/释放配置                                                               | 运营调用 `setRestakeConfig` / `setRewardQueue`                        |
| `ErrorNotWinner`                                                              | 当前用户未中奖                                                                          | 展示未中奖                                                            |
| `ErrorAlreadyUsed`                                                            | 签名或 salt 已使用                                                                      | 重新请求签名                                                          |
| `ErrorInvalidSigner`                                                          | 签名者不匹配                                                                            | 检查后端 signer 配置                                                  |
| `ErrorSignatureExpired`                                                       | 签名过期                                                                                | 重新请求签名                                                          |
| `ErrorDebtCapacityReached`                                                    | 债券容量不足                                                                            | 等待管理员调参                                                        |
| `ErrorNotPurchaseSource`                                                      | 前端或非授权合约调用 tracker                                                            | 不要直接调用 `recordPurchase`                                         |
| `ErrorMiningQuotaExceeded`                                                    | XStaking 超过 mining quota                                                              | 减少 gAGX 质押或增加锁定本金                                          |
| `ErrorPrincipalReleaseVaultNotSet`                                            | 分流器 Manager 未配置（本金合约 `principalReleaseVault` 未指向 `AegisSplitterManager`） | 联系管理员                                                            |
| `ErrorIndexOutOfBounds`, `ErrorNothingToClaim`                                | RewardQueue/本金释放索引无效或当前无可领                                                | 重新拉取列表和可领取额                                                |
| `ErrorSilentTime`, `ErrorNoSilenceBalance`, `ErrorInvalidAmount`              | Turbine 尚未冷却、记录不存在或输入无效                                                  | 刷新冷却记录并检查输入                                                |
| `AM__NotPending`, `AM__RequestMismatch`, `AM__NewAccountNotClean`             | 迁移状态变化、账户不匹配或新地址不干净                                                  | 重新拉取迁移状态或更换全新地址                                        |
| `AM__MigrationMustBeDisabled`                                                 | 迁移启用中尝试修改目标或跳数                                                            | owner 先暂停迁移                                                      |
| `AM__InvalidTargetCount`, `AM__ReferralTargetMismatch`, `AM__DuplicateTarget` | 动态目标数组数量、Referral 索引或唯一性错误                                             | 按 `getMigrationTargets()` 当前值修正数组                             |
| `AM__InvalidTarget`, `AM__InvalidTargetManager`                               | target 无代码或未反向绑定当前 Manager                                                   | 停止启用迁移，先修复 target 配置                                      |
| `AM__ReferralTargetImmutable`, `AM__ReferralTargetRemovalForbidden`           | 尝试替换或移除首次 Referral                                                             | 保留 Referral 为索引 0；如地址必须更换，只能部署新 Manager 并重新治理 |
| `AM__TargetNotFound`, `AM__TargetsLocked`                                     | 移除不存在的目标或重复锁定                                                              | 重新回读数组/锁定状态后再操作                                         |

### 20. 事件索引建议

前端可以用事件做交易结果补充、历史记录和通知，但页面状态仍建议以 view 方法为准重新拉取。

| 模块                    | 推荐监听事件                                                                                                                                                                                                                                                                | 用途                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Referral                | `BindReferral`, `IdentityMigrated`                                                                                                                                                                                                                                          | 推荐绑定、迁移                                         |
| PreSale                 | `Purchased`, `ReferralRewardPaid`, `AirdropValueAccrued`                                                                                                                                                                                                                    | 购买记录                                               |
| Usd1Swap                | `Swapped`, `Usd1Deposited`, `PausedUpdated`                                                                                                                                                                                                                                 | 兑换记录和库存                                         |
| LiquidStaking           | `Staked`, `Claimed`, `RewardClaimedMixed`, `RestakeClaimed`                                                                                                                                                                                                                 | 质押和领奖历史                                         |
| LockedStaking           | `Staked`, `Claimed`, `RewardClaimed`, `ExtraRewardClaimed`, `RestakeClaimed`                                                                                                                                                                                                | 定期 stake 历史；源码没有 `RewardClaimedMixed` 事件    |
| EarlyStaking            | `Staked`, `Claimed`, `RewardClaimedMixed`                                                                                                                                                                                                                                   | 早期锁仓                                               |
| Bond/BurnBond           | `BondPurchased`, `BondRedeemed`, `RewardClaimedMixed`, `AgxBurned`                                                                                                                                                                                                          | 债券历史                                               |
| Governance              | `ProposalCreated`, `VoteCast`, `Withdraw`, `ProposalCanceled`, `ProposalExecuted`, `ProposalDefeated`                                                                                                                                                                       | 治理记录                                               |
| DaoPool                 | `RewardsClaimedMixed`, `RestakeClaimed`                                                                                                                                                                                                                                     | DAO Mixed 领奖                                         |
| RewardQueue             | `EnteredQueue`, `RewardReleased`, `RewardClaimedFromQueue`                                                                                                                                                                                                                  | 释放队列                                               |
| 分流器（本金释放）      | `AegisSplitter` 的 `Deposited`, `Claimed`；历史 PRV 单沿用 `ReleaseCreated`, `PrincipalClaimed`（归档 ABI）                                                                                                                                                                 | 本金释放                                               |
| LuckyPool               | `RoundCreated`, `RoundSkipped`, `EligibleUserAdded`, `RandomnessRequested`, `RandomnessFulfilled`, `WinnerSelected`, `LuckyRewardClaimedMixed`, `RewardPaid`, `RewardClaimed`                                                                                               | 抽奖全过程；`RoundSkipped` 表示零资格轮以 0 人中奖完成 |
| XStakingPool            | `Staked`, `WarmupActivated`, `RewardSettlement`, `RewardClaimed`, `Unstaked`                                                                                                                                                                                                | X 挖矿                                                 |
| Turbine                 | `Received`, `Silenced`, `CooledGagxClaimed`, `CooldownUpdated`                                                                                                                                                                                                              | 配额、冷却和配置变化                                   |
| AccountMigrationManager | `MigrationRequested`, `MigrationApproved`, `MigrationRejected`, `MigrationCancelled`, `MigrationCompleted`, `OperatorMigrationCompleted`, `TargetsUpdated`, `MigrationTargetAdded`, `MigrationTargetRemoved`, `TargetsLocked`, `TargetsUnlocked`, `MigrationEnabledChanged` | 用户迁移流程与动态目标治理                             |

### 21. 前端交付检查清单

| 检查项       | 要求                                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ABI          | 每个页面使用本文对应 ABI，部署 key 正确                                                                                                                                                                       |
| decimals     | AGX/gAGX/sAGX 9 位，X/USD1 18 位；Usd1Swap 输入 token 必须运行时读取 decimals                                                                                                                                 |
| 地址         | BNB Chain 主网固定本轮部署、配置和只读终验共同批准的完整 manifest；禁止使用六地址基线、运行时扫描目录或合并历史部署 JSON                                                                                      |
| 授权         | 每个写方法前检查正确 spender 的 allowance                                                                                                                                                                     |
| 推荐关系     | 质押、债券、治理前检查 Referral                                                                                                                                                                               |
| 贡献值       | Mixed 领奖前检查 `quoteRequiredContribution` 和 `userContribution`                                                                                                                                            |
| 释放计划     | RewardQueue plan 从链上读取，不写死                                                                                                                                                                           |
| 复投计划     | 用 `getPlanCount + getPlan(i)` 保留原始 index，不把过滤列表下标当 planIndex                                                                                                                                   |
| LuckyPool    | 不提供 `enterRound`，不直接调用 `recordPurchase`                                                                                                                                                              |
| Lucky keeper | 只调用 `checkUpkeep("0x") -> performUpkeep(performData)`；无 owner 权限，不在链下排除零资格轮，keeper BNB 与 VRF Subscription 余额分开监控                                                                    |
| XStaking     | 不传价格；等待管理员 `settleRewards` 后用户领取 X                                                                                                                                                             |
| 分流器 ABI   | 使用 `AegisSplitterManager`/`AegisSplitter` 规范 ABI（`abi/AegisSplitterManager.json`、`abi/AegisSplitter.json`）；历史 PRV 释放单用归档 ABI（`archive/PrincipalReleaseVault/`）；`claim(index)` 只有一个参数 |
| 账户迁移     | 当前独立启用回执已通过：`migrationEnabled=true`、`targetsLocked=true`、21 个 target；前端启用迁移入口前仍须回读链上状态，若后续被暂停或目标解锁则立即禁用写操作                                               |
| 错误提示     | 自定义错误名映射为用户可理解文案                                                                                                                                                                              |

### 22. 本地验证

| 目标             | 命令                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| 编译             | `npx hardhat compile`                                                                |
| 启动 fork 节点   | `npm run node:fork`                                                                  |
| 部署并配置       | `npm run deploy:and:config:local`                                                    |
| 冒烟 e2e         | `npm run e2e:smoke`                                                                  |
| 10～190 用户回归 | `E2E_USER_COUNT=10 npm run run:e2e:local`（支持 10 的倍数；不替代 200 用户严格门禁） |
| 200 用户顺序 e2e | `npm run e2e:200`                                                                    |

### 23. 相关文档

- README_CONTRACTS.md
- ACTUAL_BUSINESS_FLOW.md
- ARCHITECTURE_OVERVIEW.md
- EVENT_AND_FUNCTION_MAPPING.md
- CONFIG.md
