/** Barrel — domain resolvers live in `~/web3/errors/*`. Call sites keep this path. */
export {
  CLAIM_CONFIRM_SYNC_FAILED,
  CLAIM_SIGNATURE_EXPIRED,
  GENESIS_PURCHASE_ERROR,
  REFERRAL_BIND_ERROR,
  EXCHANGE_QUOTE_FAILED,
  EXCHANGE_SUBMIT_GATE_FAILED,
  WALLET_GATE_ERROR,
  WALLET_WRITE_ERROR,
} from '~/web3/errors/sentinels'
export {
  isUserRejectedWalletError,
  resolveWalletTransactionError,
  toWalletUserFacingMessage,
  type WalletTransactionErrorMessages,
} from '~/web3/errors/wallet-error'
export { resolveContractErrorMessage } from '~/web3/errors/erc20-error'
export {
  resolveReferralBindError,
  type ReferralBindErrorMessages,
} from '~/web3/errors/referral-bind-error'
export { resolveTeamClaimError, type TeamClaimErrorMessages } from '~/web3/errors/team-claim-error'
export {
  resolveGenesisPurchaseError,
  type GenesisContractErrorMessages,
} from '~/web3/errors/genesis-purchase-error'
export { resolveExchangeUserFacingMessage } from '~/web3/errors/exchange-user-facing-message'
