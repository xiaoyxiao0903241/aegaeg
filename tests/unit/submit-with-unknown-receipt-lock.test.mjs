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
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM, Symbol('prior'))

  let ran = false
  const result = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      ran = true
      return 'ok'
    },
  })

  assert.equal(ran, false)
  assert.deepEqual(result, { ok: false, error: 'LOCKED' })
  resetUnknownReceiptLocksForTests()
})

test('submitWithUnknownReceiptLock rejects sibling while in flight', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WRITE_PATH, isUnknownReceiptLocked, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()

  let releaseFirst
  const first = submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: () =>
      new Promise((resolve) => {
        releaseFirst = resolve
      }),
  })

  await Promise.resolve()

  const second = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 'sibling',
  })
  assert.deepEqual(second, { ok: false, error: 'IN_FLIGHT' })

  releaseFirst('done')
  assert.deepEqual(await first, { ok: true, value: 'done' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)
  resetUnknownReceiptLocksForTests()
})

test('latched path rejects begin; explicit clearLock allows a later begin', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const {
    WRITE_PATH,
    clearUnknownReceiptLock,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('stale-unknown'))

  const blocked = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 1,
  })
  assert.deepEqual(blocked, { ok: false, error: 'LOCKED' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), true)

  clearUnknownReceiptLock(WRITE_PATH.EXCHANGE)
  const ok = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 2,
  })
  assert.deepEqual(ok, { ok: true, value: 2 })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE), false)
  resetUnknownReceiptLocksForTests()
})

test('owner-scoped clear leaves another owner latch intact', async () => {
  const {
    WRITE_PATH,
    clearUnknownReceiptLock,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  const ownerA = Symbol('a')
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM, ownerA)
  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, Symbol('b'))
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), true)
  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ownerA)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)
})

test('submitWithUnknownReceiptLock success path leaves path unlocked', async () => {
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
    whenInFlight: 'IN_FLIGHT',
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
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      throw 'SOFT_GATE'
    },
  })
  assert.deepEqual(soft, { ok: false, error: 'SOFT_GATE' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), false)

  const unknown = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      throw new WalletSubmitUnknownError()
    },
  })
  assert.equal(unknown.ok, false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM), true)
  resetUnknownReceiptLocksForTests()
})
