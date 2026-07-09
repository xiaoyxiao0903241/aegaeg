import { readEnvAddress } from '~/shared/config/env'

export type Address = `0x${string}`

export interface BscContracts {
  chainId: 56
  wbnb: Address
  usd1: Address
  usdt: Address
  /** PancakeSwap V3 SwapRouter — approve + exactInputSingle (per product doc) */
  pancakeV3SwapRouter: Address
  pancakeV3Quoter: Address
  usdtUsd1Pool: Address
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
}

/** Code fallbacks when `VITE_BSC_*` env vars are unset or invalid. */
export const DEFAULT_BSC_CONTRACTS = {
  chainId: 56,
  wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  usd1: '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d',
  usdt: '0x55d398326f99059fF775485246999027B3197955',
  pancakeV3SwapRouter: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
  pancakeV3Quoter: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  usdtUsd1Pool: '0x9c4ee895e4f6ce07ada631c508d1306db7502cce',
  multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  referral: '0xFe7803230D11BC6FB248f1629a3353E409a2DB29',
  preSale: '0xcb8EBEbd2B4A03AB16A28021AD9Ed50B125bE618',
  rewardClaimer: '0xC6B3D73bA06594dc78be538F65307c6eb348E13E',
  communityFundVault: '0xEf11751f13ff5578c6FA1c6E9eF99bb917a4D5E6',
  usd1Swap: '0xae1155Cf325277accE615cC310dd52da8E46C6e3',
} as const satisfies BscContracts

/**
 * BSC mainnet contract addresses.
 * `VITE_BSC_*` overrides at build time; redeploy without env change uses DEFAULT_BSC_CONTRACTS.
 */
export const BSC_CONTRACTS = {
  chainId: 56,
  wbnb: readEnvAddress('VITE_BSC_WBNB', DEFAULT_BSC_CONTRACTS.wbnb),
  usd1: readEnvAddress('VITE_BSC_USD1', DEFAULT_BSC_CONTRACTS.usd1),
  usdt: readEnvAddress('VITE_BSC_USDT', DEFAULT_BSC_CONTRACTS.usdt),
  pancakeV3SwapRouter: readEnvAddress(
    'VITE_BSC_PANCAKE_V3_SWAP_ROUTER',
    DEFAULT_BSC_CONTRACTS.pancakeV3SwapRouter,
  ),
  pancakeV3Quoter: readEnvAddress(
    'VITE_BSC_PANCAKE_V3_QUOTER',
    DEFAULT_BSC_CONTRACTS.pancakeV3Quoter,
  ),
  usdtUsd1Pool: readEnvAddress(
    'VITE_BSC_USDT_USD1_POOL',
    DEFAULT_BSC_CONTRACTS.usdtUsd1Pool,
  ),
  multicall3: readEnvAddress('VITE_BSC_MULTICALL3', DEFAULT_BSC_CONTRACTS.multicall3),
  referral: readEnvAddress('VITE_BSC_REFERRAL', DEFAULT_BSC_CONTRACTS.referral),
  preSale: readEnvAddress('VITE_BSC_PRESALE', DEFAULT_BSC_CONTRACTS.preSale),
  rewardClaimer: readEnvAddress(
    'VITE_BSC_REWARD_CLAIMER',
    DEFAULT_BSC_CONTRACTS.rewardClaimer,
  ),
  communityFundVault: readEnvAddress(
    'VITE_BSC_COMMUNITY_FUND_VAULT',
    DEFAULT_BSC_CONTRACTS.communityFundVault,
  ),
  usd1Swap: readEnvAddress('VITE_BSC_USD1_SWAP', DEFAULT_BSC_CONTRACTS.usd1Swap),
} as const satisfies BscContracts
