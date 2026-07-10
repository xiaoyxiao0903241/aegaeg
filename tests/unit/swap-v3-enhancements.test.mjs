import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('calcPriceImpactBps uses true price (P∝√P²), not sqrt move', async () => {
  const { calcPriceImpactBps } = await loadModule('/src/core/swap/calc-price-impact-bps.ts')

  // √P +1% ⇒ P +≈2.01% ⇒ ~201 bps
  assert.equal(calcPriceImpactBps(1_000_000n, 1_010_000n), 201)
  assert.equal(calcPriceImpactBps(1_000_000n, 990_000n), 199)
  assert.equal(calcPriceImpactBps(0n, 1_000n), 0)
})

test('formatGasEstimate formats bigint gas with tilde prefix', async () => {
  const { formatGasEstimate } = await loadModule('/src/views/dapp/swap/trade-swap/swap-format-gas-estimate.ts')

  assert.equal(formatGasEstimate(0n), '—')
  assert.equal(formatGasEstimate(120_000n), '~120,000')
})
