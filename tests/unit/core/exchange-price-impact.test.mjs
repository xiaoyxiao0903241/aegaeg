import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('calcV2PriceImpactBps measures mid vs execution', async () => {
  const { calcV2PriceImpactBps } = await loadModule('/src/core/exchange/calc-price-impact-bps.ts')

  // midOut = 1e18 * 1e15 / 1e24 = 1e9; quoted 5e8 → 50% = 5000 bps
  assert.equal(
    calcV2PriceImpactBps({
      amountIn: 10n ** 18n,
      amountOut: 5n * 10n ** 8n,
      reserveIn: 10n ** 24n,
      reserveOut: 10n ** 15n,
    }),
    5000,
  )
  assert.equal(
    calcV2PriceImpactBps({
      amountIn: 0n,
      amountOut: 1n,
      reserveIn: 1n,
      reserveOut: 1n,
    }),
    0,
  )
  // Better-than-mid execution is not adverse impact (do not warn).
  assert.equal(
    calcV2PriceImpactBps({
      amountIn: 10n ** 18n,
      amountOut: 2n * 10n ** 9n,
      reserveIn: 10n ** 24n,
      reserveOut: 10n ** 15n,
    }),
    0,
  )
})

test('gas estimate empty and tilde grouping use formatNumber', async () => {
  const { formatNumber } = await loadModule('/src/shared/presenters/format-display.ts')

  assert.equal(formatNumber(0, { digits: 0, trimZeros: true, prefix: '~' }), '~0')
  assert.equal(formatNumber(90_000n, { digits: 0, trimZeros: true, prefix: '~' }), '~90,000')
})
