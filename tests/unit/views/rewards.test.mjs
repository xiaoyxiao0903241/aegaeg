import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('formatContributionPlaceholder: disconnected / loading / value', async () => {
  const { formatContributionPlaceholder } = await loadModule('/src/views/dapp/rewards/shared.tsx')
  const zero = '0.0000'

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
    }),
    '1.5000',
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
  const { NON_NUMERIC_EMPTY, formatApiCountLabel, formatApiAmount } = await loadModule(
    '/src/views/dapp/rewards/shared.tsx',
  )

  assert.equal(NON_NUMERIC_EMPTY, '\u2014')
  assert.notEqual(formatApiAmount(null), NON_NUMERIC_EMPTY)
  assert.equal(formatApiCountLabel(false, false, null), '0')
  assert.equal(formatApiCountLabel(true, true, null), '0')
  assert.equal(formatApiCountLabel(true, false, 3), '3')
})

test('planLabel and splitAmountByPct', async () => {
  const { planLabel, formatPlanTaxSchedule } = await loadModule('/src/core/assets/claim-plans.ts')
  const { splitAmountByPct } = await loadModule('/src/views/dapp/rewards/shared.tsx')

  assert.equal(splitAmountByPct(1000n, 40), 400n)

  const plans = [{ index: 0, exists: true, durationSeconds: 60n * 86_400n, taxBps: 500n }]
  assert.equal(planLabel(60, plans, '{days}d ({tax})', '{days}d', '{rate}%'), '60d (5%)')
  assert.equal(planLabel(90, plans, '{days}d ({tax})', '{days}d', '{rate}%'), '90d')

  const schedule = [
    { index: 0, exists: true, durationSeconds: 5n * 86_400n, taxBps: 2000n },
    { index: 1, exists: true, durationSeconds: 20n * 86_400n, taxBps: 1000n },
    { index: 2, exists: false, durationSeconds: 40n * 86_400n, taxBps: 500n },
  ]
  assert.equal(
    formatPlanTaxSchedule(schedule, '{days}d · {tax}', '{days}d', '{rate}%', ', '),
    '5d · 20%, 20d · 10%',
  )
  assert.equal(
    formatPlanTaxSchedule(schedule, '{days} 天 · {tax}', '{days} 天', '税率 {rate}%', '、'),
    '5 天 · 税率 20%、20 天 · 税率 10%',
  )
  assert.equal(formatPlanTaxSchedule([], '{days}d', '{days}d', '{rate}%', ', '), '—')
})

test('formatDaoGrantStatus READY uses the pending label', async () => {
  const { formatDaoGrantStatus } = await loadModule('/src/views/dapp/rewards/shared.tsx')
  const labels = {
    pending: '待领取',
    processing: '处理中',
    paid: '已支付',
    claimed: '已领取',
    failed: '失败',
    unknown: '—',
  }
  assert.equal(formatDaoGrantStatus('READY', labels), '待领取')
  assert.equal(formatDaoGrantStatus('CLAIMED', labels), '已领取')
})

test('zh READY status copy is 待领取', async () => {
  const { default: zh } = await loadModule('/src/i18n/messages/app/zh.ts')
  assert.equal(zh.rewards.logStatus.pending, '待领取')
})

test('mapLuckyWinnerToRow stake column uses tracker USD1 not participation_amount', async () => {
  const { mapLuckyWinnerToRow, NON_NUMERIC_EMPTY } = await loadModule(
    '/src/views/dapp/rewards/shared.tsx',
  )
  const item = {
    rank: 1,
    address: '0x1111111111111111111111111111111111111111',
    participation_amount: '999',
    reward_amount: '1.5',
  }

  assert.equal(mapLuckyWinnerToRow(item)[2], NON_NUMERIC_EMPTY)
  assert.equal(mapLuckyWinnerToRow(item, { stakeAmountUsd1: 5n * 10n ** 18n })[2], '$5.00')
  assert.equal(mapLuckyWinnerToRow(item, { stakeAmountUsd1: 0n })[2], '$0.00')
})

test('mapLuckyMyRoundToRow stake column uses tracker USD1 not participation_amount', async () => {
  const { mapLuckyMyRoundToRow, NON_NUMERIC_EMPTY } = await loadModule(
    '/src/views/dapp/rewards/shared.tsx',
  )
  const item = {
    date: '2026-08-19',
    round_id: 7,
    participation_amount: '999',
    is_winner: false,
    rank: null,
    reward_amount: '0',
    draw_tx_hash: null,
  }
  const labels = { won: 'won {amount}', lost: 'lost' }

  assert.equal(mapLuckyMyRoundToRow(item, labels)[1], NON_NUMERIC_EMPTY)
  assert.equal(
    mapLuckyMyRoundToRow(item, { ...labels, stakeAmountUsd1: 5n * 10n ** 18n })[1],
    '$5.00',
  )
})

test('lucky overview totals from summary.total_reward_amount; cards use Tile.Note', () => {
  const hook = readFileSync(
    new URL('../../../src/views/dapp/rewards/lucky/use-lucky.tsx', import.meta.url),
    'utf8',
  )
  const detail = readFileSync(
    new URL('../../../src/views/dapp/rewards/lucky/detail.tsx', import.meta.url),
    'utf8',
  )
  assert.match(hook, /total_reward_amount/)
  assert.doesNotMatch(hook, /formatApiStatLabel\([^)]*'0'\)/)
  assert.match(detail, /Tile\.Note/)
  assert.doesNotMatch(detail, /flex-wrap items-baseline/)
})
