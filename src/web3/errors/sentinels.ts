/** Shared wallet-block sentinels (swap / claim / referral / genesis). Literal frozen. */
export const WALLET_BLOCKED = {
  NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  /** Unknown tx outcome — resubmit blocked until explicit reset. */
  PENDING_UNKNOWN: 'WALLET_PENDING_UNKNOWN',
} as const

export const GENESIS_PURCHASE_ERROR = {
  INSUFFICIENT_USD1: 'GENESIS_INSUFFICIENT_USD1',
  INSUFFICIENT_ALLOWANCE: 'GENESIS_INSUFFICIENT_ALLOWANCE',
  UNAVAILABLE: 'GENESIS_UNAVAILABLE',
  /** @deprecated Prefer `WALLET_BLOCKED.NOT_CONNECTED` — same literal. */
  WALLET_NOT_CONNECTED: WALLET_BLOCKED.NOT_CONNECTED,
  NOT_BOUND: 'GENESIS_NOT_BOUND',
} as const

export const REFERRAL_BIND_ERROR = {
  INVALID_PARENT: 'REFERRAL_INVALID_PARENT',
  PARENT_NOT_BOUND: 'REFERRAL_PARENT_NOT_BOUND',
} as const

/** Local claim expire precheck — maps to claimErrors.expired. */
export const CLAIM_SIGNATURE_EXPIRED = 'ErrorSignatureExpired'

/** On-chain claim succeeded but `/claim/confirm` failed. */
export const CLAIM_CONFIRM_SYNC_FAILED = 'CLAIM_CONFIRM_SYNC_FAILED'

export const WALLET_WRITE_ERROR = {
  GAS_ESTIMATE_FAILED: 'WALLET_GAS_ESTIMATE_FAILED',
  /** Live wallet address ≠ intent captured at write start. */
  INTENT_ADDRESS_MISMATCH: 'WALLET_INTENT_ADDRESS_MISMATCH',
  /** Live chain id ≠ expected app chain (BSC). */
  WRONG_CHAIN: 'WALLET_WRONG_CHAIN',
  /** eth_sendTransaction timed out before a hash — may still broadcast; treat as unknown. */
  SUBMIT_UNKNOWN: 'WALLET_SUBMIT_UNKNOWN',
} as const

/** Quote RPC / router failure — map via i18n `errors.quoteFailed`. */
export const EXCHANGE_QUOTE_FAILED = 'EXCHANGE_QUOTE_FAILED'

/** Approve 后二次门闸失败（quote 过期等）— 与 quoteFailed 同文案。 */
export const EXCHANGE_SUBMIT_BLOCKED = 'EXCHANGE_SUBMIT_BLOCKED'

/** Flash Usd1Swap preflight gates — map via i18n `exchange.flash.blocked`. */
export const FLASH_USD1_BLOCKED = {
  paused: 'FLASH_USD1_PAUSED',
  belowMin: 'FLASH_USD1_BELOW_MIN',
  aboveMax: 'FLASH_USD1_ABOVE_MAX',
  insufficientReserve: 'FLASH_USD1_INSUFFICIENT_RESERVE',
  zeroRate: 'FLASH_USD1_ZERO_RATE',
} as const
