function readString(key: keyof ImportMetaEnv, fallback = ''): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' ? raw.trim() : fallback
}

const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

/** Env override for `0x` addresses; invalid or missing values use `fallback`. */
export function readEnvAddress(
  key: keyof ImportMetaEnv,
  fallback: `0x${string}`,
): `0x${string}` {
  const raw = readString(key)
  return EVM_ADDRESS_RE.test(raw) ? (raw as `0x${string}`) : fallback
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

export const appEnv = {
  thirdwebClientId: readString('VITE_THIRDWEB_CLIENT_ID'),
  walletConnectProjectId: readString('VITE_WALLETCONNECT_PROJECT_ID'),
  bscRpcUrl: readString('VITE_BSC_RPC_URL', 'https://bsc-dataseed.binance.org'),
  apiBaseUrl: readString('VITE_API_BASE_URL', 'https://api.x-dao.io/api'),
  /** Fallback app host when `location` is unreadable (hostname only, no protocol). */
  appHost: readString('VITE_APP_HOST', 'x-dao.io'),
  apiDeriveFromDomain: readBoolean('VITE_API_DERIVE_FROM_DOMAIN', true),
  authMessageFormat: readString('VITE_AUTH_MESSAGE_FORMAT', 'siwe'),
  bscscanBase: readString('VITE_BSCSCAN_BASE_URL', 'https://bscscan.com'),
  swapDefaultSlippageBps: readNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS', 50),
  swapDeadlineSeconds: readNumber('VITE_SWAP_DEADLINE_SECONDS', 20 * 60),
  pancakeSwapBaseUrl: readString(
    'VITE_PANCAKE_SWAP_BASE_URL',
    'https://pancakeswap.finance/swap',
  ),
} as const
