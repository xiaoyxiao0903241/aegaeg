import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const ADDR = '0x1111111111111111111111111111111111111111'

test('submitWithUnknownReceiptLock rejects when path already latched', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WRITE_PATH, lockUnknownReceipt, resetUnknownReceiptLocksForTests } = await loadModule(
    '/src/web3/wallet/unknown-receipt-lock.ts',
  )

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM, Symbol('prior'), ADDR)

  let ran = false
  const result = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    address: ADDR,
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
    address: ADDR,
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
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 'sibling',
  })
  assert.deepEqual(second, { ok: false, error: 'IN_FLIGHT' })

  releaseFirst('done')
  assert.deepEqual(await first, { ok: true, value: 'done' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR), false)
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
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('stale-unknown'), ADDR)

  const blocked = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 1,
  })
  assert.deepEqual(blocked, { ok: false, error: 'LOCKED' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), true)

  clearUnknownReceiptLock(WRITE_PATH.EXCHANGE, ADDR)
  const ok = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 2,
  })
  assert.deepEqual(ok, { ok: true, value: 2 })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), false)
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
  lockUnknownReceipt(WRITE_PATH.RELEASE_CLAIM, ownerA, ADDR)
  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ADDR, Symbol('b'))
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR), true)
  clearUnknownReceiptLock(WRITE_PATH.RELEASE_CLAIM, ADDR, ownerA)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR), false)
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
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => 42,
  })

  assert.deepEqual(result, { ok: true, value: 42 })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR), false)
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
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      throw 'SOFT_GATE'
    },
  })
  assert.deepEqual(soft, { ok: false, error: 'SOFT_GATE' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR), false)

  const unknown = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.RELEASE_CLAIM,
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      throw new WalletSubmitUnknownError()
    },
  })
  assert.equal(unknown.ok, false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.RELEASE_CLAIM, ADDR), true)
  resetUnknownReceiptLocksForTests()
})

test('submitWithUnknownReceiptLock stores broadcast hash on the latch until success', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const {
    WRITE_PATH,
    getUnknownReceiptLatchEvidence,
    isUnknownReceiptLocked,
    notifyWriteHash,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  const hash = `0x${'cd'.repeat(32)}`
  const result = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      notifyWriteHash(hash)
      assert.deepEqual(getUnknownReceiptLatchEvidence(WRITE_PATH.EXCHANGE, ADDR), { hash })
      return 'mined'
    },
  })
  assert.deepEqual(result, { ok: true, value: 'mined' })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), false)
  resetUnknownReceiptLocksForTests()
})

test('submitWithUnknownReceiptLock send-timeout latch has no hash', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WalletSubmitUnknownError } = await loadModule(
    '/src/web3/wallet/wallet-submit-unknown-error.ts',
  )
  const {
    WRITE_PATH,
    getUnknownReceiptLatchEvidence,
    isUnknownReceiptLocked,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      throw new WalletSubmitUnknownError()
    },
  })
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), true)
  assert.equal(getUnknownReceiptLatchEvidence(WRITE_PATH.EXCHANGE, ADDR), undefined)
  resetUnknownReceiptLocksForTests()
})

test('submitWithUnknownReceiptLock unlocks when the receipt reverted', async () => {
  const { submitWithUnknownReceiptLock } = await loadModule(
    '/src/web3/wallet/submit-with-unknown-receipt-lock.ts',
  )
  const { WalletTransactionWaitError } = await loadModule(
    '/src/web3/wallet/wait-wallet-transaction.ts',
  )
  const { WRITE_PATH, isUnknownReceiptLocked, notifyWriteHash, resetUnknownReceiptLocksForTests } =
    await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  const hash = `0x${'cd'.repeat(32)}`
  const result = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.EXCHANGE,
    address: ADDR,
    whenLocked: 'LOCKED',
    whenInFlight: 'IN_FLIGHT',
    run: async () => {
      notifyWriteHash(hash)
      throw new WalletTransactionWaitError(hash, 'reverted')
    },
  })
  assert.equal(result.ok, false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR), false)
  resetUnknownReceiptLocksForTests()
})
