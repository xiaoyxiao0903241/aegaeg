import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('burn contribution swap gates: paused / min / max / zero rate', async () => {
  const { evaluateBurnContributionSwap } = await loadModule(
    '/src/core/exchange/burn-contribution-swap.ts',
  )

  const base = {
    decimals: 9,
    rateBps: 60_000n,
    isPaused: false,
    minIn: 0n,
    maxIn: 0n,
    totalBurned: 0n,
    totalContribution: 0n,
    splitBps: 5_000n,
    contributionDivisor: 6n,
  }

  assert.equal(
    evaluateBurnContributionSwap({
      amountIn: 1n,
      config: { ...base, isPaused: true },
    }),
    'paused',
  )
  assert.equal(
    evaluateBurnContributionSwap({
      amountIn: 5n,
      config: { ...base, minIn: 10n },
    }),
    'belowMin',
  )
  assert.equal(
    evaluateBurnContributionSwap({
      amountIn: 20n,
      config: { ...base, maxIn: 10n },
    }),
    'aboveMax',
  )
  assert.equal(
    evaluateBurnContributionSwap({
      amountIn: 1n,
      config: { ...base, rateBps: 0n },
    }),
    'zeroRate',
  )
  assert.equal(evaluateBurnContributionSwap({ amountIn: 0n, config: base }), 'zeroAmount')
  assert.equal(evaluateBurnContributionSwap({ amountIn: 1n, config: base }), null)
})

test('formatBurnContributionRateLabel from rateBps', async () => {
  const { formatBurnContributionRateLabel } = await loadModule(
    '/src/core/exchange/burn-contribution-swap.ts',
  )

  assert.equal(
    formatBurnContributionRateLabel({
      rateBps: 60_000n,
      decimals: 9,
      agxSymbol: 'AGX',
      pointsLabel: '贡献点数',
    }),
    '1 AGX = 6.0000 贡献点数',
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

test('formatBurnContributionRatioColon from rateBps', async () => {
  const { formatBurnContributionRatioColon } = await loadModule(
    '/src/core/exchange/burn-contribution-swap.ts',
  )

  assert.equal(formatBurnContributionRatioColon(60_000n), '1:6')
  assert.equal(formatBurnContributionRatioColon(0n), '0')
  assert.equal(formatBurnContributionRatioColon(15_000n), '1:1.5')
})

test('formatContributionClaimRatioLabel from contributionDivisor', async () => {
  const { formatContributionClaimRatioLabel } = await loadModule(
    '/src/core/exchange/burn-contribution-swap.ts',
  )

  assert.equal(formatContributionClaimRatioLabel(6n), '6:1')
  assert.equal(formatContributionClaimRatioLabel(8n), '8:1')
  assert.equal(formatContributionClaimRatioLabel(0n), '6:1')
  assert.equal(formatContributionClaimRatioLabel(null), '6:1')
  assert.equal(formatContributionClaimRatioLabel(undefined), '6:1')
})

test('formatBurnSplitPercent from splitBps', async () => {
  const { formatBurnSplitPercent } = await loadModule(
    '/src/core/exchange/burn-contribution-swap.ts',
  )

  assert.equal(formatBurnSplitPercent(5_000n), '50')
  assert.equal(formatBurnSplitPercent(10_000n), '100')
  assert.equal(formatBurnSplitPercent(3_550n), '35.5')
})
