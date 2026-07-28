const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

function readRaw(key: keyof ImportMetaEnv): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' ? raw.trim() : ''
}

/** Pure parse — unit-tested; runtime readers call this. */
export function parseRequiredString(key: string, raw: string | undefined): string {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (!trimmed) {
    throw new Error(
      `Missing required env ${key}. Set it in .env / .env.local (see .env.example). No code fallback.`,
    )
  }
  return trimmed
}

/** Pure parse — unit-tested; runtime readers call this. */
export function parseRequiredAddress(key: string, raw: string | undefined): `0x${string}` {
  const trimmed = parseRequiredString(key, raw)
  if (!EVM_ADDRESS_RE.test(trimmed)) {
    throw new Error(`Invalid ${key} address: ${trimmed}`)
  }
  return trimmed as `0x${string}`
}

/** Pure parse — unit-tested; runtime readers call this. */
export function parseRequiredNumber(key: string, raw: string | undefined): number {
  const trimmed = parseRequiredString(key, raw)
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${key} number: ${trimmed}`)
  }
  return parsed
}

/** Pure parse — unit-tested; runtime readers call this. */
export function parseRequiredBoolean(key: string, raw: string | undefined): boolean {
  const trimmed = parseRequiredString(key, raw)
  if (trimmed === 'true' || trimmed === '1') return true
  if (trimmed === 'false' || trimmed === '0') return false
  throw new Error(`Invalid ${key} boolean (expected true/false/1/0): ${trimmed}`)
}

export function requireEnvString(key: keyof ImportMetaEnv): string {
  return parseRequiredString(String(key), readRaw(key))
}

export function requireEnvAddress(key: keyof ImportMetaEnv): `0x${string}` {
  return parseRequiredAddress(String(key), readRaw(key))
}

export function requireEnvNumber(key: keyof ImportMetaEnv): number {
  return parseRequiredNumber(String(key), readRaw(key))
}

export function requireEnvBoolean(key: keyof ImportMetaEnv): boolean {
  return parseRequiredBoolean(String(key), readRaw(key))
}

/**
 * Fail-closed app config. Missing / invalid values throw at module load —
 * never silently ship hardcoded infra or product overrides.
 */
export const appEnv = {
  thirdwebClientId: requireEnvString('VITE_THIRDWEB_CLIENT_ID'),
  walletConnectProjectId: requireEnvString('VITE_WALLETCONNECT_PROJECT_ID'),
  bscRpcUrl: requireEnvString('VITE_BSC_RPC_URL'),
  apiBaseUrl: requireEnvString('VITE_API_BASE_URL'),
  /** Hostname only (no protocol) when runtime `location` is unreadable. */
  appHost: requireEnvString('VITE_APP_HOST'),
  apiDeriveFromDomain: requireEnvBoolean('VITE_API_DERIVE_FROM_DOMAIN'),
  authMessageFormat: requireEnvString('VITE_AUTH_MESSAGE_FORMAT'),
  bscscanBase: requireEnvString('VITE_BSCSCAN_BASE_URL'),
  exchangeDefaultSlippageBps: requireEnvNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS'),
  exchangeDeadlineSeconds: requireEnvNumber('VITE_SWAP_DEADLINE_SECONDS'),
  pancakeSwapBaseUrl: requireEnvString('VITE_PANCAKE_SWAP_BASE_URL'),
} as const
