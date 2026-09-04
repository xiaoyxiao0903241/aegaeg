/** 错误统一出口：汇总哨兵常量与钱包错误助手，用户可见文案一律走 `getErrorMessage`。 */
export { getErrorMessage } from '~/web3/errors/get-error-message'
export {
  CLAIM_SIGNATURE_EXPIRED,
  EXCHANGE_QUOTE_FAILED,
  EXCHANGE_SUBMIT_BLOCKED,
  FLASH_USD1_BLOCKED,
  GENESIS_PURCHASE_ERROR,
  REFERRAL_BIND_ERROR,
  WALLET_BLOCKED,
  WALLET_WRITE_ERROR,
} from '~/web3/errors/sentinels'
export { isUserRejectedWalletError, toWalletUserFacingMessage } from '~/web3/errors/wallet-error'
