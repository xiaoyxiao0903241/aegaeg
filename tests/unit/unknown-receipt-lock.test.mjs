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

  const owner = Symbol('test')
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, owner)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.GENESIS), false)

  clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), false)
})

test('owner-scoped clear does not drop another call’s latch', async () => {
  const {
    WRITE_PATH,
    clearUnknownReceiptLock,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  const ownerA = Symbol('a')
  const ownerB = Symbol('b')
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM, ownerA)

  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ownerB)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), true)

  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ownerA)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)
})

test('tryBeginWritePath rejects when latched or in flight', async () => {
  const {
    WRITE_PATH,
    endWritePath,
    isWritePathBusy,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
    tryBeginWritePath,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  const first = tryBeginWritePath(WRITE_PATH.ASSETS_CLAIM)
  assert.equal(first.ok, true)
  assert.equal(isWritePathBusy(WRITE_PATH.ASSETS_CLAIM), true)

  const second = tryBeginWritePath(WRITE_PATH.ASSETS_CLAIM)
  assert.deepEqual(second, { ok: false, reason: 'in_flight' })

  endWritePath(WRITE_PATH.ASSETS_CLAIM)
  assert.equal(isWritePathBusy(WRITE_PATH.ASSETS_CLAIM), false)

  lockUnknownReceipt(WRITE_PATH.ASSETS_CLAIM, Symbol('latched'))
  assert.deepEqual(tryBeginWritePath(WRITE_PATH.ASSETS_CLAIM), { ok: false, reason: 'locked' })
  resetUnknownReceiptLocksForTests()
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
