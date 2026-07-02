type Address = `0x${string}`

export interface BscContracts {
  chainId: 56
  wbnb: Address
  /** Legacy test USD1 — Flash Swap / PreSale until migrated */
  usd1: Address
  /** Official USD1 — PancakeSwap V3 USDT/USD1 pool */
  usd1Official: Address
  /** Legacy test USDT stand-in (xxToken) — Flash Swap until migrated */
  xxToken: Address
  /** Official BSC USDT — Trade Swap (PancakeSwap V3) */
  usdt: Address
  /** Legacy V2 pair (test tokens) */
  xxUsd1Pair: Address
  /** PancakeSwap V2 router (unused by Trade Swap after V3 migration) */
  pancakeRouter: Address
  /** PancakeSwap V3 Smart Router — required for PCS V3 pool swaps on BSC */
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
  defaultReferrer: Address
  /** Usd1Swap proxy — USDT → USD1 flash swap */
  usd1Swap: Address
}

/**
 * BSC mainnet contract addresses (SSOT).
 * Update proxy rows here on redeploy; do not use VITE_* env overrides.
 */
export const BSC_CONTRACTS = {
  chainId: 56,
  wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  usd1: '0x32Bb0be09F62bbE69764906d80e9A5782C7F7633',
  usd1Official: '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d',
  xxToken: '0x558D83257Cfb97a994ACC25233fe741062F9AcC2',
  usdt: '0x55d398326f99059fF775485246999027B3197955',
  xxUsd1Pair: '0x606211E7e7276149fc503fe8Db858745479a9100',
  pancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  pancakeV3SwapRouter: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
  pancakeV3Quoter: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  usdtUsd1Pool: '0x9c4ee895e4f6ce07ada631c508d1306db7502cce',
  multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  defaultReferrer: '0x74A4127e0aaC45C8C23935707fE37889821029c3',
  referral: '0xFe7803230D11BC6FB248f1629a3353E409a2DB29',
  preSale: '0xcb8EBEbd2B4A03AB16A28021AD9Ed50B125bE618',
  rewardClaimer: '0xC6B3D73bA06594dc78be538F65307c6eb348E13E',
  communityFundVault: '0xEf11751f13ff5578c6FA1c6E9eF99bb917a4D5E6',
  usd1Swap: '0xae1155Cf325277accE615cC310dd52da8E46C6e3',
} as const satisfies BscContracts
