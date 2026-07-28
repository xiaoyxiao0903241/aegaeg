import { CLAIM_CONFIRM_SYNC_FAILED, WALLET_GATE_ERROR } from '~/web3/errors/sentinels'
import {
  type ErrorRule,
  nameOrSelector,
  readErrorCode,
  readErrorText,
  resolveFirstMatch,
  toErrorText,
} from '~/web3/errors/error-text'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

/** Friendly i18n messages for the claim-reward flow (RewardClaimer errors + flow). */
export interface TeamClaimErrorMessages {
  zeroAmount: string
  invalidSigner: string
  alreadyUsed: string
  expired: string
  noOrder: string
  failed: string
  /** On-chain claim succeeded; backend confirm failed. */
  confirmSyncFailed?: string
  walletNotConnected?: string
}

const TEAM_CLAIM_ERROR_RULES: Array<ErrorRule<keyof TeamClaimErrorMessages>> = [
  {
    match: nameOrSelector(/ErrorAlreadyUsed|AlreadyUsed|already.?(used|claimed)/i, '0xd7003173'),
    messageKey: 'alreadyUsed',
  },
  {
    match: nameOrSelector(/ErrorSignatureExpired|SignatureExpired|expired/i, '0x66e6698b'),
    messageKey: 'expired',
  },
  {
    match: nameOrSelector(/ErrorInvalidSigner|InvalidSigner|invalid.?sign/i, '0xab3834a6'),
    messageKey: 'invalidSigner',
  },
  {
    match: nameOrSelector(/ErrorZeroAmount|ZeroAmount/i, '0xc91787e4'),
    messageKey: 'zeroAmount',
  },
]

function isNoTeamClaimOrder(error: unknown, raw: string): boolean {
  const code = readErrorCode(error)
  return (
    code === 404 ||
    /no\s*(team\s*)?reward|available\s*to\s*claim|no.?pending|未?待领取|无可领取|not\s*found/i.test(
      raw,
    )
  )
}

/**
 * Map a team-reward claim failure (RewardClaimer custom errors per contract.md
 * §4.4, or the no-pending-order API case) to a friendly message.
 */
export function resolveTeamClaimError(
  error: unknown,
  messages: TeamClaimErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const text = toErrorText(readErrorText(error))

  if (text.raw === CLAIM_CONFIRM_SYNC_FAILED && messages.confirmSyncFailed) {
    return messages.confirmSyncFailed
  }

  const mapped = resolveFirstMatch(text, TEAM_CLAIM_ERROR_RULES, messages)
  if (mapped) return mapped

  if (text.raw === WALLET_GATE_ERROR.NOT_CONNECTED || /please connect wallet/i.test(text.raw)) {
    return messages.walletNotConnected ?? messages.failed
  }

  if (text.raw === WALLET_GATE_ERROR.PENDING_UNKNOWN) {
    return messages.failed
  }

  if (isNoTeamClaimOrder(error, text.raw)) return messages.noOrder

  return messages.failed
}
