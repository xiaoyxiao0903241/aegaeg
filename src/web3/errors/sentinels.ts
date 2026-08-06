/** 钱包阻断哨兵（兑换 / 领取 / 推荐 / Genesis）。字面量冻结。 */
export const WALLET_BLOCKED = {
  NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  /** 交易结果未知：显式重置前禁重提。 */
  PENDING_UNKNOWN: 'WALLET_PENDING_UNKNOWN',
} as const

export const GENESIS_PURCHASE_ERROR = {
  INSUFFICIENT_USD1: 'GENESIS_INSUFFICIENT_USD1',
  INSUFFICIENT_ALLOWANCE: 'GENESIS_INSUFFICIENT_ALLOWANCE',
  UNAVAILABLE: 'GENESIS_UNAVAILABLE',
  /** @deprecated 改用 `WALLET_BLOCKED.NOT_CONNECTED`（字面相同）。 */
  WALLET_NOT_CONNECTED: WALLET_BLOCKED.NOT_CONNECTED,
  NOT_BOUND: 'GENESIS_NOT_BOUND',
} as const

export const REFERRAL_BIND_ERROR = {
  INVALID_PARENT: 'REFERRAL_INVALID_PARENT',
  PARENT_NOT_BOUND: 'REFERRAL_PARENT_NOT_BOUND',
  SELF_REFERRAL: 'REFERRAL_SELF_REFERRAL',
} as const

/** 本地领取过期预检 → claimErrors.expired。 */
export const CLAIM_SIGNATURE_EXPIRED = 'ErrorSignatureExpired'

/** 链上领取成功但 `/claim/confirm` 失败。 */
export const CLAIM_CONFIRM_SYNC_FAILED = 'CLAIM_CONFIRM_SYNC_FAILED'

export const WALLET_WRITE_ERROR = {
  GAS_ESTIMATE_FAILED: 'WALLET_GAS_ESTIMATE_FAILED',
  /** 写时地址与 intent 不一致。 */
  INTENT_ADDRESS_MISMATCH: 'WALLET_INTENT_ADDRESS_MISMATCH',
  /** 写时链 id 非应用链（BSC）。 */
  WRONG_CHAIN: 'WALLET_WRONG_CHAIN',
  /** eth_sendTransaction 超时无 hash：可能已广播，按 unknown。 */
  SUBMIT_UNKNOWN: 'WALLET_SUBMIT_UNKNOWN',
  /** 同 WRITE_PATH 信封仍在飞。 */
  IN_FLIGHT: 'WALLET_WRITE_IN_FLIGHT',
} as const

/** 报价 RPC / 路由失败 → i18n `errors.quoteFailed`。 */
export const EXCHANGE_QUOTE_FAILED = 'EXCHANGE_QUOTE_FAILED'

/** Approve 后二次阻断失败（报价过期等）— 与 quoteFailed 同文案；定义在 core 一处。 */
export { EXCHANGE_SUBMIT_BLOCKED } from '~/core/exchange/exchange-sentinels'

/** Flash Usd1Swap 写前阻断 → i18n `exchange.flash.blocked`。 */
export const FLASH_USD1_BLOCKED = {
  paused: 'FLASH_USD1_PAUSED',
  belowMin: 'FLASH_USD1_BELOW_MIN',
  aboveMax: 'FLASH_USD1_ABOVE_MAX',
  insufficientReserve: 'FLASH_USD1_INSUFFICIENT_RESERVE',
  zeroRate: 'FLASH_USD1_ZERO_RATE',
} as const
