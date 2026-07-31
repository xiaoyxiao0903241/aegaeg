/** Barrel — sentinels + wallet helpers. User message SSOT: `getErrorMessage`. */
export {
  CLAIM_CONFIRM_SYNC_FAILED,
  CLAIM_SIGNATURE_EXPIRED,
  GENESIS_PURCHASE_ERROR,
  REFERRAL_BIND_ERROR,
  EXCHANGE_QUOTE_FAILED,
  EXCHANGE_SUBMIT_GATE_FAILED,
  FLASH_USD1_GATE_ERROR,
  WALLET_GATE_ERROR,
  WALLET_WRITE_ERROR,
} from '~/web3/errors/sentinels'
export {
  isUserRejectedWalletError,
  resolveWalletTransactionError,
  toWalletUserFacingMessage,
  type WalletTransactionErrorMessages,
} from '~/web3/errors/wallet-error'
export { getErrorMessage } from '~/web3/errors/get-error-message'
