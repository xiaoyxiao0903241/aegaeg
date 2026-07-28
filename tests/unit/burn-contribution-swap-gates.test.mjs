import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('burn contribution swap gates: paused / min / max / zero rate', async () => {
  const { resolveBurnContributionSwapGate } = await loadModule(
    '/src/core/exchange/burn-contribution-swap-gates.ts',
  )

  const base = {
    decimals: 9,
    rateBps: 60_000n,
    isPaused: false,
    minIn: 0n,
    maxIn: 0n,
    totalBurned: 0n,
    totalContribution: 0n,
  }

  assert.equal(
    resolveBurnContributionSwapGate({
      amountIn: 1n,
      config: { ...base, isPaused: true },
    }),
    'paused',
  )
  assert.equal(
    resolveBurnContributionSwapGate({
      amountIn: 5n,
      config: { ...base, minIn: 10n },
    }),
    'belowMin',
  )
  assert.equal(
    resolveBurnContributionSwapGate({
      amountIn: 20n,
      config: { ...base, maxIn: 10n },
    }),
    'aboveMax',
  )
  assert.equal(
    resolveBurnContributionSwapGate({
      amountIn: 1n,
      config: { ...base, rateBps: 0n },
    }),
    'zeroRate',
  )
  assert.equal(resolveBurnContributionSwapGate({ amountIn: 1n, config: base }), null)
})

test('formatBurnContributionRateLabel from rateBps', async () => {
  const { formatBurnContributionRateLabel } = await loadModule(
    '/src/core/exchange/burn-contribution-swap-gates.ts',
  )

  assert.equal(
    formatBurnContributionRateLabel({
      rateBps: 60_000n,
      decimals: 9,
      agxSymbol: 'AGX',
      pointsLabel: '贡献点数',
    }),
    '1 AGX = 6 贡献点数',
  )
  assert.equal(
    formatBurnContributionRateLabel({
      rateBps: 0n,
      decimals: 9,
      agxSymbol: 'AGX',
      pointsLabel: 'points',
    }),
    '1 AGX = — points',
  )
})
