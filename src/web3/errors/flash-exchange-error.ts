import { FLASH_USD1_GATE_ERROR } from '~/web3/errors/sentinels'
import {
  type ErrorRule,
  nameOrSelector,
  readErrorText,
  resolveFirstMatch,
  toErrorText,
} from '~/web3/errors/error-text'

/** Handbook usd1swap.md + redeemablegagx.md — user-facing flash revert copy. */
export type FlashExchangeErrorMessages = {
  paused: string
  belowMin: string
  aboveMax: string
  insufficientReserve: string
  zeroRate: string
  insufficientOutput: string
  transferMismatch: string
  zeroAddress: string
  sameToken: string
  zeroAmount: string
  notAuthorized: string
  invalidLimits: string
}

const FLASH_SENTINEL_RULES: Array<{
  sentinel: string
  messageKey: keyof FlashExchangeErrorMessages
}> = [
  { sentinel: FLASH_USD1_GATE_ERROR.paused, messageKey: 'paused' },
  { sentinel: FLASH_USD1_GATE_ERROR.belowMin, messageKey: 'belowMin' },
  { sentinel: FLASH_USD1_GATE_ERROR.aboveMax, messageKey: 'aboveMax' },
  { sentinel: FLASH_USD1_GATE_ERROR.insufficientReserve, messageKey: 'insufficientReserve' },
  { sentinel: FLASH_USD1_GATE_ERROR.zeroRate, messageKey: 'zeroRate' },
]

const FLASH_CONTRACT_ERROR_RULES: Array<ErrorRule<keyof FlashExchangeErrorMessages>> = [
  { match: nameOrSelector(/^ErrorPaused\b/i), messageKey: 'paused' },
  { match: nameOrSelector(/^ErrorInsufficientUsd1\b/i), messageKey: 'insufficientReserve' },
  { match: nameOrSelector(/^ErrorBelowMin\b/i), messageKey: 'belowMin' },
  { match: nameOrSelector(/^ErrorAboveMax\b/i), messageKey: 'aboveMax' },
  { match: nameOrSelector(/^ErrorInsufficientOutput\b/i), messageKey: 'insufficientOutput' },
  { match: nameOrSelector(/^ErrorTransferAmountMismatch\b/i), messageKey: 'transferMismatch' },
  { match: nameOrSelector(/^ErrorZeroAddress\b/i), messageKey: 'zeroAddress' },
  { match: nameOrSelector(/^ErrorSameToken\b/i), messageKey: 'sameToken' },
  { match: nameOrSelector(/^ErrorZeroAmount\b/i), messageKey: 'zeroAmount' },
  { match: nameOrSelector(/^ErrorZeroRate\b/i), messageKey: 'zeroRate' },
  {
    match: nameOrSelector(/^Error(CallerNotAuthorized|NotAuthorized)\b/i),
    messageKey: 'notAuthorized',
  },
  { match: nameOrSelector(/^ErrorInvalidLimits\b/i), messageKey: 'invalidLimits' },
]

export function resolveFlashExchangeError(
  error: unknown,
  messages: FlashExchangeErrorMessages,
): string | null {
  const text = toErrorText(readErrorText(error))

  for (const rule of FLASH_SENTINEL_RULES) {
    if (text.raw === rule.sentinel || text.raw.startsWith(`${rule.sentinel} `)) {
      return messages[rule.messageKey]
    }
  }

  return resolveFirstMatch(text, FLASH_CONTRACT_ERROR_RULES, messages)
}
