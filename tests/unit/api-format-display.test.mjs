import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('formatPresaleRank maps API rank to shareholder label', async () => {
  const { formatPresaleRank } = await loadModule('/src/shared/api/format-display.ts')

  assert.equal(formatPresaleRank(0), 'S0')
  assert.equal(formatPresaleRank(3), 'S3')
})

test('getPresaleRankHighlightedRows maps rank to tier table row index', async () => {
  const { getPresaleRankHighlightedRows } = await loadModule('/src/shared/api/format-display.ts')

  assert.deepEqual(getPresaleRankHighlightedRows(0, 6), [])
  assert.deepEqual(getPresaleRankHighlightedRows(3, 6), [2])
  assert.deepEqual(getPresaleRankHighlightedRows(6, 6), [5])
  assert.deepEqual(getPresaleRankHighlightedRows(8, 10), [7])
})

test('formatShareholderHintForRank renders tier-specific hint', async () => {
  const { formatShareholderHintForRank } = await loadModule('/src/shared/api/format-display.ts')
  const tiers = [
    ['S1', '$500', '$5,000', '1%'],
    ['S2', '$1,000', '$10,000', '2%'],
    ['S3', '$2,000', '$30,000', '3%'],
  ]

  assert.equal(formatShareholderHintForRank(3, 'Reward {bonus}', 'fallback', tiers), 'Reward 3%')
  assert.equal(formatShareholderHintForRank(0, '{bonus}', 'fallback', tiers), 'fallback')
})

test('formatGroupedNumber supports $ prefix and USD suffix', async () => {
  const { formatGroupedNumber } = await loadModule('/src/shared/api/format-display.ts')

  assert.equal(formatGroupedNumber(5000, { suffix: ' USD' }), '5,000 USD')
  assert.equal(formatGroupedNumber('invalid', { suffix: ' USD' }), '0 USD')
  assert.equal(formatGroupedNumber(1234.5, { digits: 2, prefix: '$' }), '$1,234.50')
  assert.equal(formatGroupedNumber(1000, { digits: 0, trimZeros: true }), '1,000')
})

test('formatApproxUsd: missing / no price / NaN → ≈ $0.00', async () => {
  const { formatApproxUsd } = await loadModule('/src/shared/api/format-display.ts')

  assert.equal(formatApproxUsd(0, null), '≈ $0.00')
  assert.equal(formatApproxUsd(0, 65), '≈ $0.00')
  assert.equal(formatApproxUsd(1, null), '≈ $0.00')
  assert.equal(formatApproxUsd(1, 0), '≈ $0.00')
  assert.equal(formatApproxUsd(2, 10), '≈ $20.00')
  assert.equal(formatApproxUsd(Number.NaN, 10), '≈ $0.00')
})

test('formatTableGenesisRank hides S0 in community member table', async () => {
  const { formatTableGenesisRank } = await loadModule('/src/shared/api/format-display.ts')

  assert.equal(formatTableGenesisRank(0), '-')
  assert.equal(formatTableGenesisRank(-1), '-')
  assert.equal(formatTableGenesisRank(3), 'S3')
})

test('mapTeamReferralToCompactRow renders invite table cells', async () => {
  const { mapTeamReferralToCompactRow } = await loadModule(
    '/src/views/dapp/community/community-display.ts',
  )

  assert.deepEqual(
    mapTeamReferralToCompactRow({
      address: '0x05A1E51500000000000000000000000000000000',
      register_time: '2026-04-12T08:00:00.000Z',
      presale_volume: '8000',
      presale_rank: 0,
      direct_referral_count: 16,
      sales_team_market: '245960',
    }),
    ['2026-04-12', '0x05…0000', '$8,000', '-', '16', '245,960'],
  )
})

test('mapRewardLogToRow uses i18n labels for status', async () => {
  const { mapRewardLogToRow } = await loadModule('/src/views/dapp/rewards/rewards-display.ts')
  const labels = {
    pending: '待处理',
    processing: '处理中',
    paid: '已支付',
    claimed: '已领取',
    failed: '失败',
    unknown: '—',
  }

  const row = mapRewardLogToRow(
    {
      id: 1,
      from_address: '0xabc123def4567890abcdef1234567890abcdef12',
      to_address: '0xdef',
      amount: '12.5',
      order_amount: '416',
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

  assert.equal(row[3], '$416')
})

test('mapTeamRewardClaimLogToRow renders presale team claim history', async () => {
  const { mapTeamRewardClaimLogToRow } = await loadModule(
    '/src/views/dapp/rewards/rewards-display.ts',
  )
  const labels = {
    pending: '待领取',
    processing: '处理中',
    paid: '已领取',
    claimed: '已领取',
    failed: '已过期',
    unknown: '—',
  }

  const row = mapTeamRewardClaimLogToRow(
    {
      status: 1,
      amount: '342.18',
      presale_rank: 3,
      claimed_at: '2026-05-25T00:00:00.000Z',
      created_at: '2026-05-24T12:00:00.000Z',
    },
    labels,
  )

  assert.equal(row.length, 4)
  assert.equal(row[1], '$342.18')
  assert.equal(row[2], 'S3')
  assert.equal(row[3], '已领取')
})

test('mapCommunityFundLogToRow renders development fund history without genesis rank', async () => {
  const { mapCommunityFundLogToRow } = await loadModule(
    '/src/views/dapp/rewards/rewards-display.ts',
  )
  const labels = {
    pending: '待处理',
    processing: '处理中',
    paid: '已支付',
    claimed: '已领取',
    failed: '失败',
    unknown: '—',
  }

  const row = mapCommunityFundLogToRow(
    {
      block_time: 1_747_000_000,
      status: 2,
      presale_rank: 3,
      amount: '60',
    },
    labels,
  )

  assert.equal(row.length, 3)
  assert.equal(row[1], '$60.00')
  assert.equal(row[2], '已支付')
})

test('claimableAmountValue subtracts claimed from total', async () => {
  const { claimableAmountValue } = await loadModule('/src/views/dapp/rewards/rewards-display.ts')
  const { formatGroupedNumber } = await loadModule('/src/shared/api/format-display.ts')

  assert.equal(
    formatGroupedNumber(claimableAmountValue('1000', '657.82'), { digits: 2, prefix: '$' }),
    '$342.18',
  )
  assert.ok(claimableAmountValue('0.004', '0') > 0)
  assert.equal(
    formatGroupedNumber(claimableAmountValue('0.004', '0'), { digits: 2, prefix: '$' }),
    '$0.00',
  )
})
