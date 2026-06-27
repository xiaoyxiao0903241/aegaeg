export interface BscContracts {
  chainId: 56
  wbnb: `0x${string}`
  usd1: `0x${string}`
  xxToken: `0x${string}`
  xxUsd1Pair: `0x${string}`
  pancakeRouter: `0x${string}`
  preSale: `0x${string}`
  multicall3: `0x${string}`
  referral: `0x${string}`
  rewardClaimer: `0x${string}`
  defaultReferrer: `0x${string}`
  /** AegisUsd1Swap — USDT → USD1 flash swap (BSC mainnet) */
  usd1Swap: `0x${string}`
}

/** BSC Mainnet — 来源 DEPLOYMENT_RESULT.md（2026-06-22） */
export const BSC_CONTRACTS: BscContracts = {
  chainId: 56,
  wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  usd1: '0x32Bb0be09F62bbE69764906d80e9A5782C7F7633',
  xxToken: '0x558D83257Cfb97a994ACC25233fe741062F9AcC2',
  xxUsd1Pair: '0x606211E7e7276149fc503fe8Db858745479a9100',
  pancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  preSale: '0x4F86c19945Cf64137EA31EecED5545e665B7a0f5',
  multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  referral: '0xe0F3AE113dD3997982AE9ad7d5510ffA4E3Cce71',
  rewardClaimer: '0x697B55FCFBC4Cd5401f605EE4D9905816c127f07',
  defaultReferrer: '0x74A4127e0aaC45C8C23935707fE37889821029c3',
  usd1Swap: '0x95EA21C11dd40A7C2b7Ec2f5FBa7b124f3Dec1c0',
}
