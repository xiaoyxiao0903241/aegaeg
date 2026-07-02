/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THIRDWEB_CLIENT_ID?: string
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string
  readonly VITE_BSC_RPC_URL?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_DERIVE_FROM_DOMAIN?: string
  readonly VITE_AUTH_MESSAGE_FORMAT?: string
  readonly VITE_BSCSCAN_BASE_URL?: string
  readonly VITE_SWAP_DEFAULT_SLIPPAGE_BPS?: string
  readonly VITE_SWAP_DEADLINE_SECONDS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
