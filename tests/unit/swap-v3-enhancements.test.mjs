import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('calcSqrtPriceImpactBps returns absolute move in bps', async () => {
  const { calcSqrtPriceImpactBps } = await loadModule(
    '/src/core/swap/calc-sqrt-price-impact-bps.ts',
  )

  assert.equal(calcSqrtPriceImpactBps(1_000_000n, 1_010_000n), 100)
  assert.equal(calcSqrtPriceImpactBps(1_000_000n, 990_000n), 100)
  assert.equal(calcSqrtPriceImpactBps(0n, 1_000n), 0)
})

test('formatGasEstimate formats bigint gas with tilde prefix', async () => {
  const { formatGasEstimate } = await loadModule('/src/lib/swap/format-gas-estimate.ts')

  assert.equal(formatGasEstimate(0n), '—')
  assert.equal(formatGasEstimate(120_000n), '~120,000')
})
