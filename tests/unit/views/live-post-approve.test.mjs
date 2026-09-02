import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'
import { withBscReadClient } from '../web3/_bsc-read-client-test.mjs'

const ADDRESS = '0x1111111111111111111111111111111111111111'
const ZERO = '0x0000000000000000000000000000000000000000'

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

function genesisReadClient(overrides = {}) {
  const {
    isBound = true,
    isPaused = false,
    remaining = enoughRemaining,
    nowSeconds = 1_000_000,
    throwOn,
  } = overrides
  const counts = { bound: 0, pause: 0, remaining: 0 }
  return {
    counts,
    client: {
      async readContract(request) {
        const fn = request.functionName
        if (throwOn === fn) throw new Error('rpc down')
        if (fn === 'isBindReferral') {
          counts.bound += 1
          return isBound
        }
        if (fn === 'paused') {
          counts.pause += 1
          return isPaused
        }
        if (fn === 'migratedFrom') return ZERO
        if (fn === 'getUserPhaseRemainingAmount') {
          counts.remaining += 1
          return [
            remaining.remainingPhaseAmount,
            remaining.remainingUserAmount,
            remaining.userPurchaseLimit,
            remaining.userPhaseAmountCurrent,
          ]
        }
        throw new Error(`unexpected ${fn}`)
      },
      async getBlock() {
        return { timestamp: BigInt(nowSeconds) }
      },
    },
  }
}

test('fetchLiveGenesisPostApprove re-reads bind/pause/remaining (not render snapshot)', async () => {
  const { fetchLiveGenesisPostApprove } = await loadModule(
    '/src/views/dapp/genesis/fetch-live-genesis-post-approve.ts',
  )

  const okMock = genesisReadClient()
  const ok = await withBscReadClient(okMock.client, () =>
    fetchLiveGenesisPostApprove({
      address: ADDRESS,
      purchaseAmount: 100n,
      activePhase,
    }),
  )
  assert.deepEqual(ok, { ok: true })
  assert.equal(okMock.counts.bound, 1)
  assert.equal(okMock.counts.pause, 1)
  assert.equal(okMock.counts.remaining, 1)

  const unboundMock = genesisReadClient({ isBound: false })
  const unboundAfterApprove = await withBscReadClient(unboundMock.client, () =>
    fetchLiveGenesisPostApprove({
      address: ADDRESS,
      purchaseAmount: 100n,
      activePhase,
    }),
  )
  assert.deepEqual(unboundAfterApprove, { ok: false, reason: 'not_bound' })

  const pausedMock = genesisReadClient({ isPaused: true })
  const pausedAfterApprove = await withBscReadClient(pausedMock.client, () =>
    fetchLiveGenesisPostApprove({
      address: ADDRESS,
      purchaseAmount: 100n,
      activePhase,
    }),
  )
  assert.deepEqual(pausedAfterApprove, { ok: false, reason: 'unavailable' })

  const remainingMock = genesisReadClient({
    remaining: {
      remainingPhaseAmount: 100n,
      remainingUserAmount: 100n,
      userPurchaseLimit: 0n,
      userPhaseAmountCurrent: 0n,
    },
  })
  const remainingDrift = await withBscReadClient(remainingMock.client, () =>
    fetchLiveGenesisPostApprove({
      address: ADDRESS,
      purchaseAmount: 200n,
      activePhase,
    }),
  )
  assert.deepEqual(remainingDrift, { ok: false, reason: 'unavailable' })

  const endedMock = genesisReadClient({ nowSeconds: Number(activePhase.endTime) + 1 })
  const phaseEnded = await withBscReadClient(endedMock.client, () =>
    fetchLiveGenesisPostApprove({
      address: ADDRESS,
      purchaseAmount: 100n,
      activePhase,
    }),
  )
  assert.deepEqual(phaseEnded, { ok: false, reason: 'unavailable' })

  const failMock = genesisReadClient({ throwOn: 'isBindReferral' })
  const readFailed = await withBscReadClient(failMock.client, () =>
    fetchLiveGenesisPostApprove({
      address: ADDRESS,
      purchaseAmount: 100n,
      activePhase,
    }),
  )
  assert.deepEqual(readFailed, { ok: false, reason: 'unavailable' })

  const missingAddress = await fetchLiveGenesisPostApprove({
    address: undefined,
    purchaseAmount: 100n,
    activePhase,
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
