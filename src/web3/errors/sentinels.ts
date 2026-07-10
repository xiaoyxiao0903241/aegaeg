/** Shared wallet-gate sentinels (swap / claim / referral / genesis). Literal frozen. */
export const WALLET_GATE_ERROR = {
  NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
} as const

export const GENESIS_PURCHASE_ERROR = {
  INSUFFICIENT_USD1: 'GENESIS_INSUFFICIENT_USD1',
  INSUFFICIENT_ALLOWANCE: 'GENESIS_INSUFFICIENT_ALLOWANCE',
  UNAVAILABLE: 'GENESIS_UNAVAILABLE',
  /** @deprecated Prefer `WALLET_GATE_ERROR.NOT_CONNECTED` — same literal. */
  WALLET_NOT_CONNECTED: WALLET_GATE_ERROR.NOT_CONNECTED,
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
} as const

/** Quote RPC / router failure — map via i18n `errors.quoteFailed`. */
export const SWAP_QUOTE_FAILED = 'SWAP_QUOTE_FAILED'

/** Approve 后二次门闸失败（quote 过期等）— 与 quoteFailed 同文案。 */
export const SWAP_SUBMIT_GATE_FAILED = 'SWAP_SUBMIT_GATE_FAILED'
