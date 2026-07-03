/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THIRDWEB_CLIENT_ID?: string
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string
  readonly VITE_BSC_RPC_URL?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_HOST?: string
  readonly VITE_API_DERIVE_FROM_DOMAIN?: string
  readonly VITE_AUTH_MESSAGE_FORMAT?: string
  readonly VITE_BSCSCAN_BASE_URL?: string
  readonly VITE_SWAP_DEFAULT_SLIPPAGE_BPS?: string
  readonly VITE_SWAP_DEADLINE_SECONDS?: string
  readonly VITE_PANCAKE_SWAP_BASE_URL?: string
  readonly VITE_BSC_WBNB?: string
  readonly VITE_BSC_USD1?: string
  readonly VITE_BSC_USDT?: string
  readonly VITE_BSC_PANCAKE_V3_SWAP_ROUTER?: string
  readonly VITE_BSC_PANCAKE_V3_QUOTER?: string
  readonly VITE_BSC_USDT_USD1_POOL?: string
  readonly VITE_BSC_MULTICALL3?: string
  readonly VITE_BSC_DEFAULT_REFERRER?: string
  readonly VITE_BSC_REFERRAL?: string
  readonly VITE_BSC_PRESALE?: string
  readonly VITE_BSC_REWARD_CLAIMER?: string
  readonly VITE_BSC_COMMUNITY_FUND_VAULT?: string
  readonly VITE_BSC_USD1_SWAP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
