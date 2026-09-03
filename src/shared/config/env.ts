const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

function readRaw(key: keyof ImportMetaEnv): string {
  const raw = import.meta.env[key]
  return typeof raw === 'string' ? raw.trim() : ''
}

/** 纯解析函数——有单元测试；运行时读取器调用它。 */
export function parseRequiredString(key: string, raw: string | undefined): string {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (!trimmed) {
    throw new Error(
      `Missing required env ${key}. Set it in .env / .env.local (see .env.example). No code fallback.`,
    )
  }
  return trimmed
}

/** 纯解析函数——有单元测试；运行时读取器调用它。 */
export function parseRequiredAddress(key: string, raw: string | undefined): `0x${string}` {
  const trimmed = parseRequiredString(key, raw)
  if (!EVM_ADDRESS_RE.test(trimmed)) {
    throw new Error(`Invalid ${key} address: ${trimmed}`)
  }
  return trimmed as `0x${string}`
}

/** 纯解析函数——有单元测试；运行时读取器调用它。 */
export function parseRequiredNumber(key: string, raw: string | undefined): number {
  const trimmed = parseRequiredString(key, raw)
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${key} number: ${trimmed}`)
  }
  return parsed
}

/** 纯解析函数——有单元测试；运行时读取器调用它。 */
export function parseRequiredBoolean(key: string, raw: string | undefined): boolean {
  const trimmed = parseRequiredString(key, raw)
  if (trimmed === 'true' || trimmed === '1') return true
  if (trimmed === 'false' || trimmed === '0') return false
  throw new Error(`Invalid ${key} boolean (expected true/false/1/0): ${trimmed}`)
}

/**
 * 解析调试开关：仅 `true` / `1` 才向控制台打印错误。
 *
 * 缺省、空值或其它字符串一律关闭，不抛错。
 *
 * @param raw `VITE_DEBUG_MODE` 原始值
 * @returns 是否打印错误
 */
export function parseDebugMode(raw: string | undefined): boolean {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  return trimmed === 'true' || trimmed === '1'
}

/** 纯解析函数——有单元测试；运行时读取器调用它。 */
export function parseOptionalCsvUrls(raw: string | undefined): string[] {
  if (typeof raw !== 'string' || !raw.trim()) return []
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
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
 * 应用配置在缺失 / 非法时于模块加载阶段即抛错——
 * 绝不静默地带入硬编码的基础设施或产品配置。
 */
export const appEnv = {
  thirdwebClientId: requireEnvString('VITE_THIRDWEB_CLIENT_ID'),
  walletConnectProjectId: requireEnvString('VITE_WALLETCONNECT_PROJECT_ID'),
  bscRpcUrl: requireEnvString('VITE_BSC_RPC_URL'),
  /** 可选；逗号分隔。缺省时读客户端仍挂公共 BSC 种子作故障转移。 */
  bscRpcFallbackUrls: parseOptionalCsvUrls(readRaw('VITE_BSC_RPC_FALLBACK_URLS')),
  apiBaseUrl: requireEnvString('VITE_API_BASE_URL'),
  /** 仅主机名（不含协议），用于运行时 `location` 不可读时的兜底。 */
  appHost: requireEnvString('VITE_APP_HOST'),
  apiDeriveFromDomain: requireEnvBoolean('VITE_API_DERIVE_FROM_DOMAIN'),
  authMessageFormat: requireEnvString('VITE_AUTH_MESSAGE_FORMAT'),
  bscscanBase: requireEnvString('VITE_BSCSCAN_BASE_URL'),
  exchangeDefaultSlippageBps: requireEnvNumber('VITE_SWAP_DEFAULT_SLIPPAGE_BPS'),
  exchangeDeadlineSeconds: requireEnvNumber('VITE_SWAP_DEADLINE_SECONDS'),
  pancakeSwapBaseUrl: requireEnvString('VITE_PANCAKE_SWAP_BASE_URL'),
  communityYoutubeUrl: requireEnvString('VITE_COMMUNITY_YOUTUBE_URL'),
  communityMediumUrl: requireEnvString('VITE_COMMUNITY_MEDIUM_URL'),
  communityTwitterUrl: requireEnvString('VITE_COMMUNITY_TWITTER_URL'),
  communityTelegramUrl: requireEnvString('VITE_COMMUNITY_TELEGRAM_URL'),
  notionZhWhitepaperUrl: requireEnvString('VITE_NOTION_ZH_WHITEPAPER_URL'),
  notionZhDocsUrl: requireEnvString('VITE_NOTION_ZH_DOCS_URL'),
  notionZhEconomicModelUrl: requireEnvString('VITE_NOTION_ZH_ECONOMIC_MODEL_URL'),
  notionEnWhitepaperUrl: requireEnvString('VITE_NOTION_EN_WHITEPAPER_URL'),
  notionEnDocsUrl: requireEnvString('VITE_NOTION_EN_DOCS_URL'),
  notionEnEconomicModelUrl: requireEnvString('VITE_NOTION_EN_ECONOMIC_MODEL_URL'),
  /** 仅 `true`/`1` 打开控制台错误打印；缺省视为关闭。 */
  debugMode: parseDebugMode(readRaw('VITE_DEBUG_MODE')),
} as const
