import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('burn contribution gates respect paused/min/max/zeroRate', async () => {
  const {
    resolveBurnContributionSwapGate,
    burnContributionSwapGateBlocksSubmit,
    formatBurnContributionRateLabel,
  } = await loadModule('/src/core/exchange/burn-contribution-swap-gates.ts')

  const base = {
    decimals: 9,
    rateBps: 60000n,
    isPaused: false,
    minIn: 1_000_000_000n,
    maxIn: 100_000_000_000n,
    totalBurned: 0n,
    totalContribution: 0n,
  }

  assert.equal(resolveBurnContributionSwapGate({ amountIn: 0n, config: base }), null)
  assert.equal(
    resolveBurnContributionSwapGate({ amountIn: 500_000_000n, config: base }),
    'belowMin',
  )
  assert.equal(
    resolveBurnContributionSwapGate({ amountIn: 200_000_000_000n, config: base }),
    'aboveMax',
  )
  assert.equal(
    resolveBurnContributionSwapGate({
      amountIn: 2_000_000_000n,
      config: { ...base, isPaused: true },
    }),
    'paused',
  )
  assert.equal(
    resolveBurnContributionSwapGate({
      amountIn: 2_000_000_000n,
      config: { ...base, rateBps: 0n },
    }),
    'zeroRate',
  )
  assert.equal(resolveBurnContributionSwapGate({ amountIn: 2_000_000_000n, config: base }), null)
  assert.equal(burnContributionSwapGateBlocksSubmit('paused'), true)
  assert.equal(burnContributionSwapGateBlocksSubmit(null), false)

  assert.equal(
    formatBurnContributionRateLabel({
      rateBps: 60000n,
      decimals: 9,
      agxSymbol: 'AGX',
      pointsLabel: '贡献点数',
    }),
    '1 AGX = 6 贡献点数',
  )
})
