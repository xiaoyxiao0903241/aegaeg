function readString(key: keyof ImportMetaEnv, fallback = ''): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' ? raw.trim() : fallback
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
  apiBaseUrl: readString('VITE_API_BASE_URL', 'https://api.xdpro.cc/api'),
  apiDeriveFromDomain: readBoolean('VITE_API_DERIVE_FROM_DOMAIN', true),
  authMessageFormat: readString('VITE_AUTH_MESSAGE_FORMAT', 'siwe'),
  bscscanBase: readString('VITE_BSCSCAN_BASE_URL', 'https://bscscan.com'),
  swapDefaultSlippageBps: readNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS', 50),
  swapDeadlineSeconds: readNumber('VITE_SWAP_DEADLINE_SECONDS', 20 * 60),
} as const
