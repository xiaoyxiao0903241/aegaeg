import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('formatPresaleRank maps API rank to shareholder label', async () => {
  const { formatPresaleRank } = await loadModule('/src/lib/api/format-display.ts')

  assert.equal(formatPresaleRank(0), 'S0')
  assert.equal(formatPresaleRank(3), 'S3')
})

test('getPresaleRankHighlightedRows maps rank to tier table row index', async () => {
  const { getPresaleRankHighlightedRows } = await loadModule('/src/lib/api/format-display.ts')

  assert.deepEqual(getPresaleRankHighlightedRows(0, 6), [])
  assert.deepEqual(getPresaleRankHighlightedRows(3, 6), [2])
  assert.deepEqual(getPresaleRankHighlightedRows(6, 6), [5])
  assert.deepEqual(getPresaleRankHighlightedRows(8, 6), [5])
})

test('formatShareholderHintForRank renders tier-specific hint', async () => {
  const { formatShareholderHintForRank } = await loadModule('/src/lib/api/format-display.ts')
  const tiers = [
    ['S1', '$500', '$5,000', '1%', 'A2'],
    ['S2', '$1,000', '$10,000', '2%', 'A3'],
    ['S3', '$2,000', '$30,000', '3%', 'A4'],
  ]

  assert.equal(
    formatShareholderHintForRank(3, '{bonus} · {postLaunch}', 'fallback', tiers),
    '3% · A4',
  )
  assert.equal(formatShareholderHintForRank(0, '{bonus}', 'fallback', tiers), 'fallback')
})

test('formatUsdCompact abbreviates large values', async () => {
  const { formatUsdCompact } = await loadModule('/src/lib/api/format-display.ts')

  assert.equal(formatUsdCompact('412900'), '$412.9K')
  assert.equal(formatUsdCompact('1200'), '$1.2K')
})

test('mapTeamReferralToCompactRow renders invite table cells', async () => {
  const { mapTeamReferralToCompactRow } = await loadModule('/src/lib/api/format-display.ts')

  assert.deepEqual(
    mapTeamReferralToCompactRow({
      address: '0x05A1E51500000000000000000000000000000000',
      register_time: '2026-04-12T08:00:00.000Z',
      presale_rank: 6,
      direct_referral_count: 3,
      sales_team_market: '246000',
    }),
    ['2026-04-12', '0x05A1…0000', 'S6', '3', '$246,000'],
  )
})

test('sumSalesLogAmountUsd totals human-readable USD amounts from log rows', async () => {
  const { sumSalesLogAmountUsd } = await loadModule('/src/lib/api/format-display.ts')

  assert.equal(
    sumSalesLogAmountUsd([
      { amount: '100', block_time: 0, phase_id: 0, tokens: '0', tx_hash: '0x1' },
      { amount: '250.5', block_time: 0, phase_id: 0, tokens: '0', tx_hash: '0x2' },
      { amount: 'invalid', block_time: 0, phase_id: 0, tokens: '0', tx_hash: '0x3' },
    ]),
    350.5,
  )
  assert.equal(sumSalesLogAmountUsd([]), 0)
})

test('resolveRewardTypeI18nKey maps API reward_type to i18n key', async () => {
  const { resolveRewardTypeI18nKey } = await loadModule('/src/lib/api/format-display.ts')

  assert.equal(resolveRewardTypeI18nKey('referral_paid'), 'referralPaid')
  assert.equal(resolveRewardTypeI18nKey('MARKET'), 'marketTeam')
  assert.equal(resolveRewardTypeI18nKey('unknown_type'), 'unknown')
})

test('mapRewardLogToRow uses i18n labels for type and status', async () => {
  const { mapRewardLogToRow } = await loadModule('/src/lib/api/format-display.ts')
  const labels = {
    rewardType: {
      referralPaid: '推荐奖励',
      referralWithdrawn: '推荐奖励领取',
      marketTeam: '做市团队奖',
      presaleTeam: '预售团队奖',
      unknown: '—',
    },
    logStatus: {
      pending: '待处理',
      processing: '处理中',
      paid: '已支付',
      failed: '失败',
      unknown: '—',
    },
  }

  const row = mapRewardLogToRow(
    {
      id: 1,
      from_address: '0xabc123def4567890abcdef1234567890abcdef12',
      to_address: '0xdef',
      amount: '12.5',
      tx_hash: null,
      block_number: 1,
      block_time: 1_700_000_000,
      log_index: 0,
      reward_type: 'referral_paid',
      status: 2,
      created_at: null,
      updated_at: null,
    },
    labels,
  )

})

test('formatClaimableAmount subtracts claimed from total', async () => {
  const { formatClaimableAmount } = await loadModule('/src/lib/api/format-display.ts')

  assert.equal(formatClaimableAmount('1000', '657.82'), '$342.18')
})
