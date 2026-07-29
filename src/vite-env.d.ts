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
  readonly VITE_BSC_PANCAKE_ROUTER?: string
  readonly VITE_BSC_PANCAKE_PAIR?: string
  readonly VITE_BSC_MULTICALL3?: string
  readonly VITE_BSC_REFERRAL?: string
  readonly VITE_BSC_PRESALE?: string
  readonly VITE_BSC_REWARD_CLAIMER?: string
  readonly VITE_BSC_COMMUNITY_FUND_VAULT?: string
  readonly VITE_BSC_USD1_SWAP?: string
  readonly VITE_BSC_AGX?: string
  readonly VITE_BSC_GAGX?: string
  readonly VITE_BSC_X_TOKEN?: string
  readonly VITE_BSC_AGX_CONTRIBUTION_SWAP?: string
  readonly VITE_BSC_TURBINE?: string
  readonly VITE_BSC_LIQUID_STAKING?: string
  readonly VITE_BSC_LOCKED_STAKING_180D?: string
  readonly VITE_BSC_LOCKED_STAKING_360D?: string
  readonly VITE_BSC_LOCKED_STAKING_540D?: string
  readonly VITE_BSC_BOND_HELPER?: string
  readonly VITE_BSC_BOND_DEPOSITORY_180D?: string
  readonly VITE_BSC_BOND_DEPOSITORY_360D?: string
  readonly VITE_BSC_BOND_DEPOSITORY_540D?: string
  readonly VITE_BSC_BURN_BOND_DEPOSITORY_180D?: string
  readonly VITE_BSC_BURN_BOND_DEPOSITORY_360D?: string
  readonly VITE_BSC_BURN_BOND_DEPOSITORY_540D?: string
  readonly VITE_BSC_X_STAKING_POOL?: string
  readonly VITE_BSC_REWARD_QUEUE?: string
  readonly VITE_BSC_RESTAKE_CONFIG?: string
  readonly VITE_BSC_PRINCIPAL_RELEASE_VAULT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
