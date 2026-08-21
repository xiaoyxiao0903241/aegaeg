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

test('referral-bind unknown latch does not lock other write paths', async () => {
  const {
    WRITE_PATH,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
    tryBeginWritePath,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.REFERRAL_BIND, Symbol('bind'), ADDR_A)

  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REFERRAL_BIND, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REFERRAL_BIND, ADDR_B), false)

  const otherPaths = [
    WRITE_PATH.EXCHANGE,
    WRITE_PATH.GENESIS,
    WRITE_PATH.STAKING,
    WRITE_PATH.BOND_ZAP,
    WRITE_PATH.XMINE,
    WRITE_PATH.ASSETS_CLAIM,
    WRITE_PATH.RELEASE_CLAIM,
    WRITE_PATH.REWARD_LUCKY_MIXED,
    WRITE_PATH.REWARD_DAO_MIXED,
    WRITE_PATH.REWARD_SIGNED_CLAIM,
  ]
  for (const path of otherPaths) {
    assert.equal(isUnknownReceiptLocked(path, ADDR_A), false, path)
    assert.equal(tryBeginWritePath(path, ADDR_A).ok, true, path)
  }

  resetUnknownReceiptLocksForTests()
})

test('legacy reward-claim latch blocks new reward paths until force-cleared', async () => {
  const {
    WRITE_PATH,
    clearUnknownReceiptLock,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
    tryBeginWritePath,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.REWARD_CLAIM, Symbol('legacy'), ADDR_A)

  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REWARD_LUCKY_MIXED, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REWARD_DAO_MIXED, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REWARD_SIGNED_CLAIM, ADDR_A), true)
  assert.deepEqual(tryBeginWritePath(WRITE_PATH.REWARD_LUCKY_MIXED, ADDR_A), {
    ok: false,
    reason: 'locked',
  })

  clearUnknownReceiptLock(WRITE_PATH.REWARD_LUCKY_MIXED, ADDR_A)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REWARD_CLAIM, ADDR_A), false)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.REWARD_LUCKY_MIXED, ADDR_A), false)
  assert.equal(tryBeginWritePath(WRITE_PATH.REWARD_LUCKY_MIXED, ADDR_A).ok, true)
  resetUnknownReceiptLocksForTests()
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
        'reverted',
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

const TX_HASH = `0x${'ab'.repeat(32)}`

function mockSessionStorage() {
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
  return store
}

test('unknown receipt lock persists hash across rehydrate', async () => {
  mockSessionStorage()
  const {
    WRITE_PATH,
    getUnknownReceiptLatchEvidence,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    rehydrateUnknownReceiptLocksForTests,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('owner'), ADDR_A, {
    hash: TX_HASH,
  })
  assert.deepEqual(getUnknownReceiptLatchEvidence(WRITE_PATH.EXCHANGE, ADDR_A), {
    hash: TX_HASH,
  })

  rehydrateUnknownReceiptLocksForTests()
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), true)
  assert.deepEqual(getUnknownReceiptLatchEvidence(WRITE_PATH.EXCHANGE, ADDR_A), {
    hash: TX_HASH,
  })
  resetUnknownReceiptLocksForTests()
})

test('v2 latches without hash still block and stay unobservable', async () => {
  const store = mockSessionStorage()
  const {
    WRITE_PATH,
    getUnknownReceiptLatchEvidence,
    isUnknownReceiptLocked,
    listUnknownReceiptLatches,
    rehydrateUnknownReceiptLocksForTests,
    resetUnknownReceiptLocksForTests,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  store.set('aegis:unknown-receipt-lock:v2', JSON.stringify([{ address: ADDR_A, path: 'swap' }]))
  rehydrateUnknownReceiptLocksForTests()

  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), true)
  assert.equal(getUnknownReceiptLatchEvidence(WRITE_PATH.EXCHANGE, ADDR_A), undefined)
  const listed = listUnknownReceiptLatches()
  assert.equal(listed.length, 1)
  assert.equal(listed[0].hash, undefined)
  resetUnknownReceiptLocksForTests()
})

test('settleUnknownReceiptLock force-clears without owner', async () => {
  mockSessionStorage()
  const {
    WRITE_PATH,
    isUnknownReceiptLocked,
    lockUnknownReceipt,
    resetUnknownReceiptLocksForTests,
    settleUnknownReceiptLock,
  } = await loadModule('/src/web3/wallet/unknown-receipt-lock.ts')

  resetUnknownReceiptLocksForTests()
  lockUnknownReceipt(WRITE_PATH.EXCHANGE, Symbol('owner'), ADDR_A, { hash: TX_HASH })

  assert.equal(settleUnknownReceiptLock(WRITE_PATH.EXCHANGE, ADDR_A), true)
  assert.equal(isUnknownReceiptLocked(WRITE_PATH.EXCHANGE, ADDR_A), false)
  assert.equal(settleUnknownReceiptLock(WRITE_PATH.EXCHANGE, ADDR_A), false)
  resetUnknownReceiptLocksForTests()
})
