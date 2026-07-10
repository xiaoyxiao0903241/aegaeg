import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('pending-unknown latch blocks path until cleared', async () => {
  const {
    WRITE_PATH,
    clearPendingUnknownLatch,
    isPendingUnknownLatched,
    latchPendingUnknown,
    resetPendingUnknownLatchesForTests,
  } = await loadModule('/src/web3/wallet/pending-unknown-latch.ts')

  resetPendingUnknownLatchesForTests()
  assert.equal(isPendingUnknownLatched(WRITE_PATH.SWAP), false)

  latchPendingUnknown(WRITE_PATH.SWAP)
  assert.equal(isPendingUnknownLatched(WRITE_PATH.SWAP), true)
  assert.equal(isPendingUnknownLatched(WRITE_PATH.GENESIS), false)

  clearPendingUnknownLatch(WRITE_PATH.SWAP)
  assert.equal(isPendingUnknownLatched(WRITE_PATH.SWAP), false)
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
