import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const ADDRESS = '0x1111111111111111111111111111111111111111'

const activePhase = {
  index: 0,
  minAmount: 100n,
  maxAmount: 10_000n,
  discountBps: 0n,
  airdropValueRatio: 0n,
  startTime: 0n,
  endTime: 9_999_999_999n,
  soldAmount: 0n,
  userPurchaseLimit: 0n,
}

const enoughRemaining = {
  remainingPhaseAmount: 5000n,
  remainingUserAmount: 5000n,
  userPurchaseLimit: 0n,
  userPhaseAmountCurrent: 0n,
}

function baseArgs(overrides = {}) {
  return {
    address: ADDRESS,
    purchaseAmount: 100n,
    activePhase,
    fetchIsBound: async () => true,
    fetchPaused: async () => false,
    fetchPhaseRemaining: async () => enoughRemaining,
    ...overrides,
  }
}

test('fetchLiveGenesisPostApprove re-reads bind/pause/remaining (not render snapshot)', async () => {
  const { fetchLiveGenesisPostApprove } = await loadModule(
    '/src/views/dapp/genesis/fetch-live-genesis-post-approve.ts',
  )

  let boundCalls = 0
  let pauseCalls = 0
  let remainingCalls = 0

  const ok = await fetchLiveGenesisPostApprove(
    baseArgs({
      fetchIsBound: async () => {
        boundCalls += 1
        return true
      },
      fetchPaused: async () => {
        pauseCalls += 1
        return false
      },
      fetchPhaseRemaining: async () => {
        remainingCalls += 1
        return enoughRemaining
      },
    }),
  )
  assert.deepEqual(ok, { ok: true })
  assert.equal(boundCalls, 1)
  assert.equal(pauseCalls, 1)
  assert.equal(remainingCalls, 1)

  const unboundAfterApprove = await fetchLiveGenesisPostApprove(
    baseArgs({ fetchIsBound: async () => false }),
  )
  assert.deepEqual(unboundAfterApprove, { ok: false, reason: 'not_bound' })

  const pausedAfterApprove = await fetchLiveGenesisPostApprove(
    baseArgs({ fetchPaused: async () => true }),
  )
  assert.deepEqual(pausedAfterApprove, { ok: false, reason: 'unavailable' })

  const remainingDrift = await fetchLiveGenesisPostApprove(
    baseArgs({
      purchaseAmount: 200n,
      fetchPhaseRemaining: async () => ({
        remainingPhaseAmount: 100n,
        remainingUserAmount: 100n,
        userPurchaseLimit: 0n,
        userPhaseAmountCurrent: 0n,
      }),
    }),
  )
  assert.deepEqual(remainingDrift, { ok: false, reason: 'unavailable' })

  const readFailed = await fetchLiveGenesisPostApprove(
    baseArgs({
      fetchIsBound: async () => {
        throw new Error('rpc down')
      },
    }),
  )
  assert.deepEqual(readFailed, { ok: false, reason: 'unavailable' })

  const missingAddress = await fetchLiveGenesisPostApprove(baseArgs({ address: undefined }))
  assert.deepEqual(missingAddress, { ok: false, reason: 'not_bound' })
})

test('assertQuotedExchangeStillSubmittable fails when live sell balance drops', async () => {
  const { assertQuotedExchangeStillSubmittable } = await loadModule(
    '/src/core/exchange/live-quoted-out.ts',
  )

  const base = {
    walletReady: true,
    amountIn: 100n,
    quotedOut: 90n,
    amountOutMin: 85n,
    isPlaceholderData: false,
    isQuotePending: false,
    isBalancesLoading: false,
    isSubmitting: false,
    quoteUpdatedAt: Date.now(),
    maxQuoteAgeMs: 60_000,
  }

  assert.doesNotThrow(() => assertQuotedExchangeStillSubmittable({ ...base, sellBalance: 100n }))
  assert.throws(
    () => assertQuotedExchangeStillSubmittable({ ...base, sellBalance: 50n }),
    (error) => error instanceof Error && error.message === 'EXCHANGE_SUBMIT_BLOCKED',
  )
})
