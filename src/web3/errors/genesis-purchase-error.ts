import {
  GENESIS_PURCHASE_ERROR,
  WALLET_GATE_ERROR,
} from '~/web3/errors/sentinels'
import {
  type ErrorRule,
  hasSelector,
  nameOrSelector,
  readErrorText,
  resolveFirstMatch,
  toErrorText,
} from '~/web3/errors/error-text'
import { resolveContractErrorMessage } from '~/web3/errors/erc20-error'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

/**
 * Friendly i18n messages for the PreSale contract's custom errors. All optional
 * so callers that don't surface PreSale errors (e.g. swap) can omit them.
 */
export interface GenesisContractErrorMessages {
  notBound?: string
  paused?: string
  invalidAmount?: string
  phaseInactive?: string
  belowMin?: string
  soldOut?: string
  userLimitExceeded?: string
  invalidPhase?: string
  systemConfig?: string
}

const PRE_SALE_ERROR_RULES: Array<ErrorRule<keyof GenesisContractErrorMessages>> = [
  {
    match: nameOrSelector(/PreSaleUserPurchaseLimitExceeded/i, '0x43f81a81'),
    messageKey: 'userLimitExceeded',
  },
  {
    match: nameOrSelector(/PreSaleUserNotBound/i, '0x3bdd728c'),
    messageKey: 'notBound',
  },
  {
    match: nameOrSelector(/PreSalePhaseIndexOutOfBounds/i, '0x71c4dee5'),
    messageKey: 'invalidPhase',
  },
  {
    match: nameOrSelector(/PreSalePhaseNotActive/i, '0x9d024615'),
    messageKey: 'phaseInactive',
  },
  {
    match: nameOrSelector(/PreSalePhaseSoldOut/i, '0x9e6594e8'),
    messageKey: 'soldOut',
  },
  {
    match: nameOrSelector(/PreSaleBelowMin/i, '0x9468590f'),
    messageKey: 'belowMin',
  },
  {
    match: nameOrSelector(/PreSaleInvalidAmount/i, '0x52d905be'),
    messageKey: 'invalidAmount',
  },
  {
    match: nameOrSelector(/PreSalePaused/i, '0x307f3ea1'),
    messageKey: 'paused',
  },
  {
    match: ({ raw, lower }) =>
      /PreSale(ZeroAddress|InvalidDiscount|InvalidAirdropValueRatio|InvalidAgxPrice)/i.test(raw) ||
      hasSelector(lower, '0xf367a6ee', '0xfa2d446e', '0x84db0e97', '0x76019f9f'),
    messageKey: 'systemConfig',
  },
]

const GENESIS_PURCHASE_SENTINEL_RULES: Array<{
  sentinel: string
  messageKey: keyof GenesisContractErrorMessages | 'insufficientUsd1' | 'insufficientAllowance' | 'purchaseUnavailable' | 'walletNotConnected'
}> = [
  { sentinel: GENESIS_PURCHASE_ERROR.INSUFFICIENT_USD1, messageKey: 'insufficientUsd1' },
  { sentinel: GENESIS_PURCHASE_ERROR.INSUFFICIENT_ALLOWANCE, messageKey: 'insufficientAllowance' },
  { sentinel: GENESIS_PURCHASE_ERROR.UNAVAILABLE, messageKey: 'purchaseUnavailable' },
  { sentinel: WALLET_GATE_ERROR.NOT_CONNECTED, messageKey: 'walletNotConnected' },
  { sentinel: GENESIS_PURCHASE_ERROR.NOT_BOUND, messageKey: 'notBound' },
]

export function resolveGenesisPurchaseError(
  error: unknown,
  messages: {
    insufficientUsd1: string
    insufficientAllowance: string
    purchaseUnavailable: string
    walletNotConnected: string
  } & GenesisContractErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const text = toErrorText(readErrorText(error))

  for (const rule of GENESIS_PURCHASE_SENTINEL_RULES) {
    if (text.raw !== rule.sentinel) continue
    const message = messages[rule.messageKey]
    return message ?? null
  }

  const contractMessage = resolveFirstMatch(text, PRE_SALE_ERROR_RULES, messages)
  if (contractMessage) return contractMessage

  return resolveContractErrorMessage(error, messages)
}
