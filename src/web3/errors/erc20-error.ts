import {
  type ErrorRule,
  readErrorText,
  resolveFirstMatch,
  toErrorText,
} from '~/web3/errors/error-text'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

const ERC20_INSUFFICIENT_BALANCE = '0xe450d38c'
const ERC20_INSUFFICIENT_ALLOWANCE = '0xfb8f41b2'

const ERC20_ERROR_RULES: Array<ErrorRule<'insufficientUsd1' | 'insufficientAllowance'>> = [
  {
    match: ({ raw }) =>
      raw.includes(ERC20_INSUFFICIENT_BALANCE) || /ERC20InsufficientBalance/i.test(raw),
    messageKey: 'insufficientUsd1',
  },
  {
    match: ({ raw }) =>
      raw.includes(ERC20_INSUFFICIENT_ALLOWANCE) || /ERC20InsufficientAllowance/i.test(raw),
    messageKey: 'insufficientAllowance',
  },
]

export function resolveContractErrorMessage(
  error: unknown,
  messages: {
    insufficientUsd1: string
    insufficientAllowance: string
  },
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const text = toErrorText(readErrorText(error))
  const mapped = resolveFirstMatch(text, ERC20_ERROR_RULES, messages)
  if (mapped) return mapped

  return null
}
