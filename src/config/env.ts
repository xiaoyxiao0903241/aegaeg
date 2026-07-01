type Address = `0x${string}`

function readString(key: keyof ImportMetaEnv, fallback = ''): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' ? raw.trim() : fallback
}

function readAddress(key: keyof ImportMetaEnv, fallback: Address): Address {
  const raw = readString(key)
  return /^0x[a-fA-F0-9]{40}$/.test(raw) ? (raw as Address) : fallback
}

function readNumber(key: keyof ImportMetaEnv, fallback: number): number {
  const raw = readString(key)
  if (!raw) return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

function readBoolean(key: keyof ImportMetaEnv, fallback: boolean): boolean {
  const raw = readString(key)
  if (!raw) return fallback
  return raw === 'true' || raw === '1'
}

const CONTRACT_DEFAULTS = {
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
  preSale: '0xDE381f0F124d46Ab7E43629421Ac862b103fe008',
  multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  referral: '0xe0F3AE113dD3997982AE9ad7d5510ffA4E3Cce71',
  rewardClaimer: '0x697B55FCFBC4Cd5401f605EE4D9905816c127f07',
  communityFundVault: '0x083441EC373E547611295e037D759084b1483a95',
  defaultReferrer: '0x74A4127e0aaC45C8C23935707fE37889821029c3',
  usd1Swap: '0x95EA21C11dd40A7C2b7Ec2f5FBa7b124f3Dec1c0',
} as const satisfies Record<string, Address | number>

export const appEnv = {
  thirdwebClientId: readString('VITE_THIRDWEB_CLIENT_ID'),
  walletConnectProjectId: readString('VITE_WALLETCONNECT_PROJECT_ID'),
  bscRpcUrl: readString('VITE_BSC_RPC_URL', 'https://bsc-dataseed.binance.org'),
  apiBaseUrl: readString('VITE_API_BASE_URL', 'https://api.xdpro.cc/api'),
  apiDeriveFromDomain: readBoolean('VITE_API_DERIVE_FROM_DOMAIN', true),
  authMessageFormat: readString('VITE_AUTH_MESSAGE_FORMAT', 'siwe'),
  bscscanBase: readString('VITE_BSCSCAN_BASE_URL', 'https://bscscan.com'),
  swapDefaultSlippageBps: readNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS', 50),
  swapDeadlineSeconds: readNumber('VITE_SWAP_DEADLINE_SECONDS', 20 * 60),
  contracts: {
    chainId: readNumber('VITE_BSC_CHAIN_ID', CONTRACT_DEFAULTS.chainId),
    wbnb: readAddress('VITE_BSC_WBNB', CONTRACT_DEFAULTS.wbnb),
    usd1: readAddress('VITE_BSC_USD1_TEST', CONTRACT_DEFAULTS.usd1),
    usd1Official: readAddress('VITE_BSC_USD1_OFFICIAL', CONTRACT_DEFAULTS.usd1Official),
    xxToken: readAddress('VITE_BSC_XX_TOKEN', CONTRACT_DEFAULTS.xxToken),
    usdt: readAddress('VITE_BSC_USDT', CONTRACT_DEFAULTS.usdt),
    xxUsd1Pair: readAddress('VITE_BSC_XX_USD1_PAIR', CONTRACT_DEFAULTS.xxUsd1Pair),
    pancakeRouter: readAddress('VITE_BSC_PANCAKE_ROUTER', CONTRACT_DEFAULTS.pancakeRouter),
    pancakeV3SwapRouter: readAddress(
      'VITE_BSC_PANCAKE_V3_ROUTER',
      CONTRACT_DEFAULTS.pancakeV3SwapRouter,
    ),
    pancakeV3Quoter: readAddress('VITE_BSC_PANCAKE_V3_QUOTER', CONTRACT_DEFAULTS.pancakeV3Quoter),
    usdtUsd1Pool: readAddress('VITE_BSC_USDT_USD1_POOL', CONTRACT_DEFAULTS.usdtUsd1Pool),
    preSale: readAddress('VITE_BSC_PRESALE', CONTRACT_DEFAULTS.preSale),
    multicall3: readAddress('VITE_BSC_MULTICALL3', CONTRACT_DEFAULTS.multicall3),
    referral: readAddress('VITE_BSC_REFERRAL', CONTRACT_DEFAULTS.referral),
    rewardClaimer: readAddress('VITE_BSC_REWARD_CLAIMER', CONTRACT_DEFAULTS.rewardClaimer),
    communityFundVault: readAddress(
      'VITE_BSC_COMMUNITY_FUND_VAULT',
      CONTRACT_DEFAULTS.communityFundVault,
    ),
    defaultReferrer: readAddress('VITE_BSC_DEFAULT_REFERRER', CONTRACT_DEFAULTS.defaultReferrer),
    usd1Swap: readAddress('VITE_BSC_USD1_SWAP', CONTRACT_DEFAULTS.usd1Swap),
  },
} as const
