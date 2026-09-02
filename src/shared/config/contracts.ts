import { requireEnvAddress } from '~/shared/config/env'

export type Address = `0x${string}`

export interface BscContracts {
  chainId: 56
  wbnb: Address
  usd1: Address
  usdt: Address
  /** PancakeSwap V2 路由器——手册 §7.1 PancakeRouter 买 AGX */
  pancakeRouter: Address
  /** Pancake V2 AGX/USD1 交易对（部署 key 为 `PancakePair`） */
  pancakePair: Address
  /** PreSale 代理——Genesis 购买入口 */
  preSale: Address
  multicall3: Address
  /** Referral 代理——绑定推荐人 / 网络树 */
  referral: Address
  /** RewardClaimer 代理——团队奖励领取 */
  rewardClaimer: Address
  /** CommunityFund 代理——推荐 / Genesis 发展基金领取 */
  communityFundVault: Address
  /** DaoPool——DAO Mixed 签名领取（手册 §9.5 签名奖励） */
  daoPool: Address
  /** MarketFund——发展津贴签名领取 */
  marketFund: Address
  /** LuckyPool——幸运 Mixed 领取（手册 §14 LuckyPool 去中心化抽奖；可能暂停） */
  luckyPool: Address
  /** DailyPurchaseTracker——轮内购买资格（手册 §14.1） */
  dailyPurchaseTracker: Address
  /** Usd1Swap 代理——USDT → USD1 兑换（手册 §7.2 Usd1Swap） */
  usd1Swap: Address
  /** AGX 代币（部署 key 为 `AGX`） */
  agx: Address
  /** gAGX / RewardGAGX 代理（部署 key 为 `RewardGAGX`） */
  gagx: Address
  /** XToken（部署 key 为 `XToken`） */
  xToken: Address
  /** AgxContributionSwap——销毁 AGX 兑换贡献值（手册 §9.2 贡献值页面） */
  agxContributionSwap: Address
  /** Turbine 配额中心——解锁 / 领取 gAGX（手册 §16 Turbine） */
  turbine: Address
  /** LiquidStaking——AGX 活期质押（手册 §8.2 活期 LiquidStaking） */
  liquidStaking: Address
  /** LockedStaking 180 天（手册 §8.3 定期 LockedStaking） */
  lockedStaking180d: Address
  /** LockedStaking 360 天 */
  lockedStaking360d: Address
  /** LockedStaking 540 天 */
  lockedStaking540d: Address
  /** EarlyStaking——预售用户专属锁仓（手册 §8.4 EarlyStaking） */
  earlyStaking: Address
  /** BondHelper——LP / Burn 债券一键入口（手册 §10 债券 Bond / BurnBond） */
  bondHelper: Address
  /**
   * AegisLpBondingCalculator——LP Bond 预估估值（手册 §10.6 方法二）。
   * 部署 key：`BondingCalculator`
   */
  bondingCalculator: Address
  /** BondDepository 180 天 */
  bondDepository180d: Address
  /** BondDepository 360 天 */
  bondDepository360d: Address
  /** BondDepository 540 天 */
  bondDepository540d: Address
  /** BurnBondDepository 180 天 */
  burnBondDepository180d: Address
  /** BurnBondDepository 360 天 */
  burnBondDepository360d: Address
  /** BurnBondDepository 540 天 */
  burnBondDepository540d: Address
  /** XStakingPool——gAGX 挖矿质押（手册 §15 XStakingPool X 挖矿） */
  xStakingPool: Address
  /** RewardQueue——Mixed 线性释放队列（手册 §12 RewardQueue 奖励释放队列） */
  rewardQueue: Address
  /** RestakeConfig——Mixed 复投计划索引（手册 §9 贡献值与 Mixed 领奖） */
  restakeConfig: Address
  /**
   * AegisSplitterManager——按用户路由头部分流器（手册 §13）。
   * 新本金释放读/写经 Manager → AegisSplitterHead_*。
   */
  aegisSplitterManager: Address
  /**
   * AegisSplitterHead_0——现行头部分流器（手册 §13 / 地址表）。
   * 缓冲流水 `contract_address` 多为事件发出方，是本地址而非 Manager。
   *
   * @see docs/onchain-manual/00-addresses.md
   */
  aegisSplitterHead0: Address
  /** AccountMigrationManager——手册 §17 账户迁移；本轮 migrationEnabled=false */
  accountMigrationManager: Address
  /** sAGX——rebase 型质押份额（合约文档 docs/onchain-manual/contracts/sagx.md） */
  sagx: Address
  /** StakingPool——周期 / 池 AGX 总量（合约文档 docs/onchain-manual/contracts/stakingpool.md） */
  stakingPool: Address
  /** Treasury——总储备数据来源（合约文档 docs/onchain-manual/contracts/treasury.md） */
  treasury: Address
}

/**
 * BSC 合约地址。
 * 每个字段均来自 `VITE_BSC_*` 环境变量；缺失 / 非法即抛错（不提供代码默认值）。
 * 地址目录唯一来源：`docs/onchain-manual/00-addresses.md`。
 * 环境变量模板：`env/manual.bsc.addresses.env` + `.env.example`。
 */
export const BSC_CONTRACTS = {
  chainId: 56,
  wbnb: requireEnvAddress('VITE_BSC_WBNB'),
  usd1: requireEnvAddress('VITE_BSC_USD1'),
  usdt: requireEnvAddress('VITE_BSC_USDT'),
  pancakeRouter: requireEnvAddress('VITE_BSC_PANCAKE_ROUTER'),
  pancakePair: requireEnvAddress('VITE_BSC_PANCAKE_PAIR'),
  multicall3: requireEnvAddress('VITE_BSC_MULTICALL3'),
  referral: requireEnvAddress('VITE_BSC_REFERRAL'),
  preSale: requireEnvAddress('VITE_BSC_PRESALE'),
  rewardClaimer: requireEnvAddress('VITE_BSC_REWARD_CLAIMER'),
  communityFundVault: requireEnvAddress('VITE_BSC_COMMUNITY_FUND_VAULT'),
  daoPool: requireEnvAddress('VITE_BSC_DAO_POOL'),
  marketFund: requireEnvAddress('VITE_BSC_MARKET_FUND'),
  luckyPool: requireEnvAddress('VITE_BSC_LUCKY_POOL'),
  dailyPurchaseTracker: requireEnvAddress('VITE_BSC_DAILY_PURCHASE_TRACKER'),
  usd1Swap: requireEnvAddress('VITE_BSC_USD1_SWAP'),
  agx: requireEnvAddress('VITE_BSC_AGX'),
  gagx: requireEnvAddress('VITE_BSC_GAGX'),
  xToken: requireEnvAddress('VITE_BSC_X_TOKEN'),
  agxContributionSwap: requireEnvAddress('VITE_BSC_AGX_CONTRIBUTION_SWAP'),
  turbine: requireEnvAddress('VITE_BSC_TURBINE'),
  liquidStaking: requireEnvAddress('VITE_BSC_LIQUID_STAKING'),
  lockedStaking180d: requireEnvAddress('VITE_BSC_LOCKED_STAKING_180D'),
  lockedStaking360d: requireEnvAddress('VITE_BSC_LOCKED_STAKING_360D'),
  lockedStaking540d: requireEnvAddress('VITE_BSC_LOCKED_STAKING_540D'),
  earlyStaking: requireEnvAddress('VITE_BSC_EARLY_STAKING'),
  bondHelper: requireEnvAddress('VITE_BSC_BOND_HELPER'),
  bondingCalculator: requireEnvAddress('VITE_BSC_BONDING_CALCULATOR'),
  bondDepository180d: requireEnvAddress('VITE_BSC_BOND_DEPOSITORY_180D'),
  bondDepository360d: requireEnvAddress('VITE_BSC_BOND_DEPOSITORY_360D'),
  bondDepository540d: requireEnvAddress('VITE_BSC_BOND_DEPOSITORY_540D'),
  burnBondDepository180d: requireEnvAddress('VITE_BSC_BURN_BOND_DEPOSITORY_180D'),
  burnBondDepository360d: requireEnvAddress('VITE_BSC_BURN_BOND_DEPOSITORY_360D'),
  burnBondDepository540d: requireEnvAddress('VITE_BSC_BURN_BOND_DEPOSITORY_540D'),
  xStakingPool: requireEnvAddress('VITE_BSC_X_STAKING_POOL'),
  rewardQueue: requireEnvAddress('VITE_BSC_REWARD_QUEUE'),
  restakeConfig: requireEnvAddress('VITE_BSC_RESTAKE_CONFIG'),
  aegisSplitterManager: requireEnvAddress('VITE_BSC_AEGIS_SPLITTER_MANAGER'),
  aegisSplitterHead0: requireEnvAddress('VITE_BSC_AEGIS_SPLITTER_HEAD_0'),
  accountMigrationManager: requireEnvAddress('VITE_BSC_ACCOUNT_MIGRATION_MANAGER'),
  sagx: requireEnvAddress('VITE_BSC_SAGX'),
  stakingPool: requireEnvAddress('VITE_BSC_STAKING_POOL'),
  treasury: requireEnvAddress('VITE_BSC_TREASURY'),
} as const satisfies BscContracts
