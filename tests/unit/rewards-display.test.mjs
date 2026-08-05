import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('formatContributionPlaceholder: disconnected / loading / value', async () => {
  const { formatContributionPlaceholder, formatApiDecimalAmount } = await loadModule(
    '/src/views/dapp/rewards/shared.ts',
  )
  const zero = formatApiDecimalAmount(null)

  assert.equal(
    formatContributionPlaceholder({
      walletReady: false,
      hasAddress: false,
      isPending: false,
      contribution: undefined,
      decimals: 18,
    }),
    zero,
  )

  assert.equal(
    formatContributionPlaceholder({
      walletReady: true,
      hasAddress: true,
      isPending: true,
      contribution: undefined,
      decimals: 18,
    }),
    zero,
  )

  assert.equal(
    formatContributionPlaceholder({
      walletReady: true,
      hasAddress: true,
      isPending: false,
      contribution: 1_500_000_000_000_000_000n,
      decimals: 18,
      fractionDigits: 2,
    }),
    '1.5',
  )

  assert.equal(
    formatContributionPlaceholder({
      walletReady: true,
      hasAddress: true,
      isPending: false,
      contribution: undefined,
      decimals: 18,
    }),
    zero,
  )
})

test('lucky non-numeric empties stay dashes; counts stay integers', async () => {
  const { NON_NUMERIC_EMPTY, formatApiCountLabel, formatApiDecimalAmount } = await loadModule(
    '/src/views/dapp/rewards/shared.ts',
  )

  assert.equal(NON_NUMERIC_EMPTY, '\u2014')
  assert.notEqual(formatApiDecimalAmount(null), NON_NUMERIC_EMPTY)
  assert.equal(formatApiCountLabel(false, false, null), '0')
  assert.equal(formatApiCountLabel(true, true, null), '0')
  assert.equal(formatApiCountLabel(true, false, 3), '3')

  const verifyHash = 'verify: {hash}'.replace('{hash}', NON_NUMERIC_EMPTY)
  assert.equal(verifyHash, 'verify: \u2014')
  assert.equal(verifyHash.includes('0.00'), false)
})

test('planLabel and splitAmountByPct', async () => {
  const { planLabel } = await loadModule('/src/core/assets/claim-plans.ts')
  const { splitAmountByPct } = await loadModule('/src/views/dapp/rewards/shared.ts')

  assert.equal(splitAmountByPct(1000n, 40), 400n)

  const plans = [{ index: 0, exists: true, durationSeconds: 60n * 86_400n, taxBps: 500n }]
  assert.equal(planLabel(60, plans, '{days}d ({tax})', '{days}d', '{rate}%'), '60d (5%)')
  assert.equal(planLabel(90, plans, '{days}d ({tax})', '{days}d', '{rate}%'), '90d')
})
