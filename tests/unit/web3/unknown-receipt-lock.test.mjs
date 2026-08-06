import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ADDR_A = '0x1111111111111111111111111111111111111111'
const ADDR_B = '0x2222222222222222222222222222222222222222'

test('unknown receipt lock blocks path until cleared for address', async () => {
  const {
    WRITE_PATH,
    clearUnknownReceiptLock,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), false)

  const owner = Symbol('test')
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, owner, ADDR_A)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_B), false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.GENESIS, ADDR_A), false)

  clearUnknownReceiptLock(WRITE_PATH.EXCHANGE, ADDR_A)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), false)
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
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM, ownerA, ADDR_A)

  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ADDR_A, ownerB)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR_A), true)

  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ADDR_A, ownerA)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR_A), false)
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
  const first = tryBeginWritePath(WRITE_PATH.ASSETS_CLAIM, ADDR_A)
  assert.equal(first.ok, true)
  assert.equal(isWritePathBusy(WRITE_PATH.ASSETS_CLAIM, ADDR_A), true)

  const second = tryBeginWritePath(WRITE_PATH.ASSETS_CLAIM, ADDR_A)
  assert.deepEqual(second, { ok: false, reason: 'in_flight' })

  endWritePath(WRITE_PATH.ASSETS_CLAIM, ADDR_A)
  assert.equal(isWritePathBusy(WRITE_PATH.ASSETS_CLAIM, ADDR_A), false)

  lockUnknownReceipt(WRITE_PATH.ASSETS_CLAIM, Symbol('latched'), ADDR_A)
  assert.deepEqual(tryBeginWritePath(WRITE_PATH.ASSETS_CLAIM, ADDR_A), {
    ok: false,
    reason: 'locked',
  })
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

test('unknown receipt lock persists across memory rehydrate (refresh simulation)', async () => {
  const store = new Map()
  globalThis.sessionStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value))
    },
    removeItem: (key) => {
      store.delete(key)
    },
  }

  const {
    WRITE_PATH,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    rehydrateUnknownReceiptLocksForTests,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('owner'), ADDR_A)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_B), false)

  rehydrateUnknownReceiptLocksForTests()
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_B), false)

  resetUnknownReceiptLocksForTests()
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), false)
})
