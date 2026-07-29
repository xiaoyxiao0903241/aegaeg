import { requireEnvAddress } from '~/shared/config/env'

export type Address = `0x${string}`

/**
 * EIP zero address — protocol sentinel (unbound referrer / disabled slot marker),
 * not a deployment address and not an env fallback.
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const satisfies Address

export interface BscContracts {
  chainId: 56
  wbnb: Address
  usd1: Address
  usdt: Address
  /** PancakeSwap V2 Router — handbook §7.1 Trade */
  pancakeRouter: Address
  /** Pancake V2 AGX/USD1 pair (manual deployment key `PancakePair`) */
  pancakePair: Address
  /** PreSale proxy — Genesis purchase */
  preSale: Address
  multicall3: Address
  /** Referral proxy — bind referrer / network tree */
  referral: Address
  /** RewardClaimer proxy — team reward claim */
  rewardClaimer: Address
  /** CommunityFund proxy — referral / genesis development fund claim */
  communityFundVault: Address
  /** DaoPool — DAO Mixed signed claim (manual §9.5) */
  daoPool: Address
  /** IncentivePool — participation signed claim */
  incentivePool: Address
  /** MarketFund — development stipend signed claim */
  marketFund: Address
  /** LuckyPool — lucky Mixed claim (manual §14; may be paused) */
  luckyPool: Address
  /** Usd1Swap proxy — USDT → USD1 flash swap */
  usd1Swap: Address
  /** AGX token (manual deployment key `AGX`) */
  agx: Address
  /** gAGX / RewardGAGX proxy (manual deployment key `RewardGAGX`) */
  gagx: Address
  /** XToken (manual deployment key `XToken`) */
  xToken: Address
  /** AgxContributionSwap — burn AGX → contribution points (manual §9.2) */
  agxContributionSwap: Address
  /** Turbine vesting hub — unlock / claim gAGX (manual §16) */
  turbine: Address
  /** LiquidStaking — AGX flexible stake (manual §8.2) */
  liquidStaking: Address
  /** LockedStaking 180d (manual §8.3) */
  lockedStaking180d: Address
  /** LockedStaking 360d */
  lockedStaking360d: Address
  /** LockedStaking 540d */
  lockedStaking540d: Address
  /** BondHelper — LP / Burn bond zap entry (manual §10) */
  bondHelper: Address
  /** BondDepository 180d */
  bondDepository180d: Address
  /** BondDepository 360d */
  bondDepository360d: Address
  /** BondDepository 540d */
  bondDepository540d: Address
  /** BurnBondDepository 180d */
  burnBondDepository180d: Address
  /** BurnBondDepository 360d */
  burnBondDepository360d: Address
  /** BurnBondDepository 540d */
  burnBondDepository540d: Address
  /** XStakingPool — gAGX mining stake (manual §15) */
  xStakingPool: Address
  /** RewardQueue — Mixed release vesting (manual §12) */
  rewardQueue: Address
  /** RestakeConfig — Mixed restake plan index (manual §9) */
  restakeConfig: Address
  /** PrincipalReleaseVault — principal exit buffer (manual §13) */
  principalReleaseVault: Address
}

/**
 * BSC contract addresses — **fail-closed**.
 * Every field comes from `VITE_BSC_*` env. Missing / invalid → throw (no code defaults).
 * Address catalog SSOT: `docs/frontend-manual/00-addresses.md`.
 * Env template: `env/manual.bsc.addresses.env` + `.env.example`.
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
  incentivePool: requireEnvAddress('VITE_BSC_INCENTIVE_POOL'),
  marketFund: requireEnvAddress('VITE_BSC_MARKET_FUND'),
  luckyPool: requireEnvAddress('VITE_BSC_LUCKY_POOL'),
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
  bondHelper: requireEnvAddress('VITE_BSC_BOND_HELPER'),
  bondDepository180d: requireEnvAddress('VITE_BSC_BOND_DEPOSITORY_180D'),
  bondDepository360d: requireEnvAddress('VITE_BSC_BOND_DEPOSITORY_360D'),
  bondDepository540d: requireEnvAddress('VITE_BSC_BOND_DEPOSITORY_540D'),
  burnBondDepository180d: requireEnvAddress('VITE_BSC_BURN_BOND_DEPOSITORY_180D'),
  burnBondDepository360d: requireEnvAddress('VITE_BSC_BURN_BOND_DEPOSITORY_360D'),
  burnBondDepository540d: requireEnvAddress('VITE_BSC_BURN_BOND_DEPOSITORY_540D'),
  xStakingPool: requireEnvAddress('VITE_BSC_X_STAKING_POOL'),
  rewardQueue: requireEnvAddress('VITE_BSC_REWARD_QUEUE'),
  restakeConfig: requireEnvAddress('VITE_BSC_RESTAKE_CONFIG'),
  principalReleaseVault: requireEnvAddress('VITE_BSC_PRINCIPAL_RELEASE_VAULT'),
} as const satisfies BscContracts
