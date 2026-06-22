import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('genesis countdown helpers detect elapsed boundaries', async () => {
  const {
    buildPhaseCountdownKey,
    hasPhaseCountdownElapsed,
    resolvePhaseCountdownTarget,
  } = await loadModule('/src/lib/presale/presale-math.ts')

  const nowSeconds = 1_000
  const phases = [
    {
      index: 0,
      minAmount: 0n,
      maxAmount: 0n,
      discountBps: 0n,
      airdropValueRatio: 500n,
      startTime: 900n,
      endTime: 1_200n,
      soldAmount: 0n,
      userPurchaseLimit: 10_000n * 10n ** 18n,
      purchasedAmount: 0n,
    },
    {
      index: 1,
      minAmount: 0n,
      maxAmount: 0n,
      discountBps: 0n,
      airdropValueRatio: 200n,
      startTime: 1_500n,
      endTime: 2_000n,
      soldAmount: 0n,
      userPurchaseLimit: 20_000n * 10n ** 18n,
      purchasedAmount: 0n,
    },
  ]

  const activeTarget = resolvePhaseCountdownTarget(phases, nowSeconds)
  assert.deepEqual(activeTarget, { mode: 'ends', targetTime: 1_200n })
  assert.equal(hasPhaseCountdownElapsed(1_200n, 1_200), true)
  assert.equal(hasPhaseCountdownElapsed(1_200n, 1_199), false)
  assert.equal(buildPhaseCountdownKey(activeTarget), 'ends:1200')
})
