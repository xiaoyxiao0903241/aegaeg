import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('assetsHubProductReturn: claimed + unclaimed over invest', async () => {
  const { assetsHubProductReturn } = await loadModule(
    '/src/core/assets/assets-hub-product-return.ts',
  )

  assert.deepEqual(assetsHubProductReturn({ claimed: 12, unclaimed: 8, invest: 1000 }), {
    totalReward: 20,
    pct: 2,
  })
  assert.deepEqual(assetsHubProductReturn({ claimed: 0, unclaimed: 100, invest: 500 }), {
    totalReward: 100,
    pct: 20,
  })
})

test('assetsHubProductReturn: missing or invalid amounts → 0, never NaN', async () => {
  const { assetsHubProductReturn } = await loadModule(
    '/src/core/assets/assets-hub-product-return.ts',
  )

  assert.deepEqual(assetsHubProductReturn({ claimed: Number.NaN, unclaimed: 10, invest: 100 }), {
    totalReward: 10,
    pct: 10,
  })
  assert.deepEqual(assetsHubProductReturn({ claimed: 10, unclaimed: -5, invest: 100 }), {
    totalReward: 10,
    pct: 10,
  })
  assert.deepEqual(assetsHubProductReturn({ claimed: 50, unclaimed: 10, invest: 0 }), {
    totalReward: 60,
    pct: 0,
  })
  assert.deepEqual(assetsHubProductReturn({ claimed: 50, unclaimed: 10, invest: Number.NaN }), {
    totalReward: 60,
    pct: 0,
  })
  assert.deepEqual(assetsHubProductReturn({ claimed: 50, unclaimed: 10, invest: -1 }), {
    totalReward: 60,
    pct: 0,
  })
})

test('xRewardToGagx: X amount × AGX-per-X; missing rate → 0', async () => {
  const { xRewardToGagx } = await loadModule('/src/core/assets/assets-hub-product-return.ts')

  assert.equal(xRewardToGagx(100, 0.5), 50)
  assert.equal(xRewardToGagx(100, 0), 0)
  assert.equal(xRewardToGagx(100, Number.NaN), 0)
  assert.equal(xRewardToGagx(Number.NaN, 0.5), 0)
})

test('assets hub left cards wire product-invest-reward into yield and return pct', () => {
  const src = readFileSync(
    new URL('../../../src/views/dapp/assets/hub/use-hub.ts', import.meta.url),
    'utf8',
  )
  assert.match(src, /useAssetsProductInvestReward/)
  assert.match(src, /assetsHubProductReturn/)
  assert.match(src, /xRewardToGagx/)
  assert.match(src, /pendingValue/)
  assert.doesNotMatch(src, /formatAprFromRebase/)
  assert.doesNotMatch(src, /formatAprFromDailyPct/)
})
