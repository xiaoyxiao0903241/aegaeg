import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('runUnknownGuardedWrite rejects when path already latched', async () => {
  const { runUnknownGuardedWrite } = await loadModule(
    '/src/web3/wallet/run-unknown-guarded-write.ts',
  )
  const { WRITE_PATH, lockUnknownReceipt, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM)

  let ran = false
  const result = await runUnknownGuardedWrite({
    path: WRITE_PATH.RELEASE_CLAIM,
    lockedError: 'LOCKED',
    run: async () => {
      ran = true
      return 'ok'
    },
  })

  assert.equal(ran, false)
  assert.deepEqual(result, { ok: false, error: 'LOCKED' })
  resetUnknownReceiptLocksForTests()
})

test('runUnknownGuardedWrite clears latch on success', async () => {
  const { runUnknownGuardedWrite } = await loadModule(
    '/src/web3/wallet/run-unknown-guarded-write.ts',
  )
  const { WRITE_PATH, isUnknownReceiptLocked, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  const result = await runUnknownGuardedWrite({
    path: WRITE_PATH.RELEASE_CLAIM,
    lockedError: 'LOCKED',
    run: async () => 42,
  })

  assert.deepEqual(result, { ok: true, value: 42 })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)
})

test('runUnknownGuardedWrite locks on unknown submit outcome only', async () => {
  const { runUnknownGuardedWrite } = await loadModule(
    '/src/web3/wallet/run-unknown-guarded-write.ts',
  )
  const { WalletSubmitUnknownError } = await loadModule(
    '/src/web3/wallet/wallet-submit-unknown-error.ts',
  )
  const { WRITE_PATH, isUnknownReceiptLocked, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  const soft = await runUnknownGuardedWrite({
    path: WRITE_PATH.RELEASE_CLAIM,
    lockedError: 'LOCKED',
    run: async () => {
      throw 'SOFT_GATE'
    },
  })
  assert.deepEqual(soft, { ok: false, error: 'SOFT_GATE' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)

  const unknown = await runUnknownGuardedWrite({
    path: WRITE_PATH.RELEASE_CLAIM,
    lockedError: 'LOCKED',
    run: async () => {
      throw new WalletSubmitUnknownError()
    },
  })
  assert.equal(unknown.ok, false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), true)
  resetUnknownReceiptLocksForTests()
})
