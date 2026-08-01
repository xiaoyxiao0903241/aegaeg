import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('formatContributionPlaceholder: disconnected / loading / value', async () => {
  const { formatContributionPlaceholder, formatApiDecimalAmount } = await loadModule(
    '/src/views/dapp/rewards/rewards-display.ts',
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

test('planLabel and splitAmountByPct', async () => {
  const { planLabel } = await loadModule('/src/core/assets/claim-plans.ts')
  const { splitAmountByPct } = await loadModule('/src/views/dapp/rewards/rewards-display.ts')

  assert.equal(splitAmountByPct(1000n, 40), 400n)

  const plans = [{ index: 0, exists: true, durationSeconds: 60n * 86_400n, taxBps: 500n }]
  assert.equal(planLabel(60, plans, '{days}d ({tax})', '{days}d', '{rate}%'), '60d (5%)')
  assert.equal(planLabel(90, plans, '{days}d ({tax})', '{days}d', '{rate}%'), '90d')
})
