import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('fetchLiveGenesisPostApprove re-reads bind/pause (not render snapshot)', async () => {
  const { fetchLiveGenesisPostApprove } = await loadModule(
    '/src/views/dapp/genesis/fetch-live-genesis-post-approve.ts',
  )

  let boundCalls = 0
  let pauseCalls = 0

  const ok = await fetchLiveGenesisPostApprove({
    address: '0x1111111111111111111111111111111111111111',
    fetchIsBound: async () => {
      boundCalls += 1
      return true
    },
    fetchPaused: async () => {
      pauseCalls += 1
      return false
    },
  })
  assert.deepEqual(ok, { ok: true })
  assert.equal(boundCalls, 1)
  assert.equal(pauseCalls, 1)

  const unboundAfterApprove = await fetchLiveGenesisPostApprove({
    address: '0x1111111111111111111111111111111111111111',
    fetchIsBound: async () => false,
    fetchPaused: async () => false,
  })
  assert.deepEqual(unboundAfterApprove, { ok: false, reason: 'not_bound' })

  const pausedAfterApprove = await fetchLiveGenesisPostApprove({
    address: '0x1111111111111111111111111111111111111111',
    fetchIsBound: async () => true,
    fetchPaused: async () => true,
  })
  assert.deepEqual(pausedAfterApprove, { ok: false, reason: 'unavailable' })

  const readFailed = await fetchLiveGenesisPostApprove({
    address: '0x1111111111111111111111111111111111111111',
    fetchIsBound: async () => {
      throw new Error('rpc down')
    },
    fetchPaused: async () => false,
  })
  assert.deepEqual(readFailed, { ok: false, reason: 'unavailable' })

  const missingAddress = await fetchLiveGenesisPostApprove({
    address: undefined,
    fetchIsBound: async () => true,
    fetchPaused: async () => false,
  })
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
