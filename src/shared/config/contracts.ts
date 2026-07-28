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
  /** CommunityFund proxy — development fund claim */
  communityFundVault: Address
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
  usd1Swap: requireEnvAddress('VITE_BSC_USD1_SWAP'),
  agx: requireEnvAddress('VITE_BSC_AGX'),
  gagx: requireEnvAddress('VITE_BSC_GAGX'),
  xToken: requireEnvAddress('VITE_BSC_X_TOKEN'),
  agxContributionSwap: requireEnvAddress('VITE_BSC_AGX_CONTRIBUTION_SWAP'),
  turbine: requireEnvAddress('VITE_BSC_TURBINE'),
} as const satisfies BscContracts
