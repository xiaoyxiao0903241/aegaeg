import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('submitWithUnknownReceiptLock rejects when path already latched', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WRITE_PATH, lockUnknownReceipt, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM)

  let ran = false
  const result = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    run: async () => {
      ran = true
      return 'ok'
    },
  })

  assert.equal(ran, false)
  assert.deepEqual(result, { ok: false, error: 'LOCKED' })
  resetUnknownReceiptLocksForTests()
})

test('submitWithUnknownReceiptLock clears latch on success', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WRITE_PATH, isUnknownReceiptLocked, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  const result = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    run: async () => 42,
  })

  assert.deepEqual(result, { ok: true, value: 42 })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)
})

test('submitWithUnknownReceiptLock locks on unknown submit outcome only', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WalletSubmitUnknownError } = await loadModule(
    '/src/web3/wallet/wallet-submit-unknown-error.ts',
  )
  const { WRITE_PATH, isUnknownReceiptLocked, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  const soft = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    run: async () => {
      throw 'SOFT_GATE'
    },
  })
  assert.deepEqual(soft, { ok: false, error: 'SOFT_GATE' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)

  const unknown = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    run: async () => {
      throw new WalletSubmitUnknownError()
    },
  })
  assert.equal(unknown.ok, false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), true)
  resetUnknownReceiptLocksForTests()
})
