import { REFERRAL_BIND_ERROR } from '~/web3/errors/sentinels'
import {
  type ErrorRule,
  nameOrSelector,
  readErrorText,
  resolveFirstMatch,
  toErrorText,
} from '~/web3/errors/error-text'
import { isUserRejectedWalletError } from '~/web3/errors/wallet-error'

/** Friendly i18n messages for the referral-bind flow (AegisReferral errors per contract.md §2.4). */
export interface ReferralBindErrorMessages {
  alreadyBound: string
  parentNotBound: string
  selfReferral: string
  invalidParent: string
  migratedAccount: string
  systemConfig: string
  failed: string
}

const REFERRAL_BIND_ERROR_RULES: Array<ErrorRule<keyof ReferralBindErrorMessages>> = [
  {
    match: nameOrSelector(/Referral__AlreadyBound|AlreadyBound/i, '0xd242113b'),
    messageKey: 'alreadyBound',
  },
  {
    match: nameOrSelector(/Referral__ParentNotBound|ParentNotBound/i, '0x3d50dfd5'),
    messageKey: 'parentNotBound',
  },
  {
    match: nameOrSelector(/Referral__SelfReferral|SelfReferral/i, '0xa7e9b6d3'),
    messageKey: 'selfReferral',
  },
  {
    match: nameOrSelector(/Referral__MigratedAccount|MigratedAccount/i, '0xc6dbe929'),
    messageKey: 'migratedAccount',
  },
  {
    match: nameOrSelector(/Referral__(ParentZero|UserZero)/i, '0x841bf48a', '0x55bc9184'),
    messageKey: 'invalidParent',
  },
  {
    match: nameOrSelector(/Referral__(RootZero|NotMigrationManager)/i, '0xc77b7954', '0x209f9827'),
    messageKey: 'systemConfig',
  },
]

export function resolveReferralBindError(
  error: unknown,
  messages: ReferralBindErrorMessages,
): string | null {
  if (isUserRejectedWalletError(error)) return null

  const text = toErrorText(readErrorText(error))

  if (text.raw === REFERRAL_BIND_ERROR.INVALID_PARENT) return messages.invalidParent
  if (text.raw === REFERRAL_BIND_ERROR.PARENT_NOT_BOUND) return messages.parentNotBound

  const mapped = resolveFirstMatch(text, REFERRAL_BIND_ERROR_RULES, messages)
  if (mapped) return mapped

  return null
}
