import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('unknown receipt lock blocks path until cleared', async () => {
  const {
    WRITE_PATH,
    clearUnknownReceiptLock,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), false)

  lockUnknownReceipt(WRITE_PATH.EXCHANGE)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.GENESIS), false)

  clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), false)
})

test('isUnknownSubmitOutcome covers wait and submit unknown errors', async () => {
  const { isUnknownSubmitOutcome, WalletSubmitUnknownError } = await loadModule(
    '/src/web3/wallet/wallet-submit-unknown-error.ts',
  )
  const { WalletTransactionWaitError } = await loadModule(
    '/src/web3/wallet/wait-wallet-transaction.ts',
  )

  assert.equal(isUnknownSubmitOutcome(new WalletSubmitUnknownError()), true)
  assert.equal(
    isUnknownSubmitOutcome(
      new WalletTransactionWaitError(
        '0x1111111111111111111111111111111111111111111111111111111111111111',
        'pending',
        'unknown',
      ),
    ),
    true,
  )
  assert.equal(
    isUnknownSubmitOutcome(
      new WalletTransactionWaitError(
        '0x1111111111111111111111111111111111111111111111111111111111111111',
        'reverted',
        'failed',
      ),
    ),
    false,
  )
  assert.equal(isUnknownSubmitOutcome(new Error('boom')), false)
})
