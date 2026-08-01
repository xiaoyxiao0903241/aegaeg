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

test('formatCompactNumber / formatCompactUsd / formatSignedPercent match hub Figma shapes', async () => {
  const { formatApproxCompactUsd, formatCompactNumber, formatCompactUsd, formatSignedPercent } =
    await loadModule('/src/shared/api/format-display.ts')

  assert.equal(formatCompactNumber(129_000, { suffix: ' AGX' }), '129K AGX')
  assert.equal(formatCompactNumber(8_410_000, { prefix: '$' }), '$8.41M')
  assert.equal(formatCompactNumber(0, { digits: 2, suffix: ' AGX' }), '0.00 AGX')
  assert.equal(formatCompactNumber(65, { digits: 2 }), '65.00')
  assert.equal(formatCompactUsd(18_600_000), '$18.6M')
  assert.equal(formatCompactUsd(65), '$65.00')
  assert.equal(formatCompactUsd(null), '$0.00')
  assert.equal(formatApproxCompactUsd(129_000, 65), '≈ $8.39M')
  assert.equal(formatApproxCompactUsd(0, null), '≈ $0.00')
  assert.equal(formatSignedPercent(412.4), '+412.4%')
  assert.equal(formatSignedPercent(null), '+0.0%')
  assert.equal(formatSignedPercent(-1.2), '-1.2%')
})

test('agxUsd1SpotPriceWeiFromReserves is USD1 wei per 1 AGX', async () => {
  const { agxUsd1SpotPriceWeiFromReserves } = await loadModule(
    '/src/web3/exchange/read-exchange-pool.ts',
  )

  const agx = '0x1111111111111111111111111111111111111111'
  const usd1 = '0x2222222222222222222222222222222222222222'
  // 200_000 AGX (9dec) + 11_000_000 USD1 (18dec) → $55 / AGX
  const reserveAgx = 200_000n * 10n ** 9n
  const reserveUsd1 = 11_000_000n * 10n ** 18n
  const price = agxUsd1SpotPriceWeiFromReserves({
    token0: agx,
    token1: usd1,
    reserve0: reserveAgx,
    reserve1: reserveUsd1,
    agx,
    usd1,
    agxDecimals: 9,
  })
  assert.equal(price, 55n * 10n ** 18n)

  const flipped = agxUsd1SpotPriceWeiFromReserves({
    token0: usd1,
    token1: agx,
    reserve0: reserveUsd1,
    reserve1: reserveAgx,
    agx,
    usd1,
    agxDecimals: 9,
  })
  assert.equal(flipped, 55n * 10n ** 18n)

  assert.equal(
    agxUsd1SpotPriceWeiFromReserves({
      token0: agx,
      token1: usd1,
      reserve0: 0n,
      reserve1: reserveUsd1,
      agx,
      usd1,
      agxDecimals: 9,
    }),
    null,
  )
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
