import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('parseApiAmount fail-closed; formatApiAmount zeros empty', async () => {
  const { formatApiAmount, parseApiAmount } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(parseApiAmount(undefined), null)
  assert.equal(parseApiAmount(''), null)
  assert.equal(parseApiAmount('  '), null)
  assert.equal(parseApiAmount('abc'), null)
  assert.equal(parseApiAmount('12.5'), 12.5)
  assert.equal(formatApiAmount(null), '0.00')
  assert.equal(formatApiAmount('1000'), '1,000.00')
  assert.equal(formatApiAmount('bad', { prefix: '$' }), '$0.00')
  assert.equal(formatApiAmount('11.03', { digits: 4 }), '11.0300')
})

test('getPresaleRankHighlightedRows maps rank to tier table row index', async () => {
  const { getPresaleRankHighlightedRows } = await loadModule('/src/shared/presenters/format.ts')

  assert.deepEqual(getPresaleRankHighlightedRows(0, 6), [])
  assert.deepEqual(getPresaleRankHighlightedRows(3, 6), [2])
  assert.deepEqual(getPresaleRankHighlightedRows(6, 6), [5])
  assert.deepEqual(getPresaleRankHighlightedRows(8, 10), [7])
})

test('formatMakingRankLabel maps making rank to A# or emptyLabel', async () => {
  const { formatMakingRankLabel } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatMakingRankLabel(3, '—'), 'A3')
  assert.equal(formatMakingRankLabel(0, '—'), '—')
  assert.equal(formatMakingRankLabel(null, '-'), '-')
  assert.equal(formatMakingRankLabel(1.9, '—'), 'A1')
})

test('formatMakingRankLabel appends (+N) only when is_boost_rank and boost_rank > 0', async () => {
  const { formatMakingRankBoostSuffix, formatMakingRankLabel } = await loadModule(
    '/src/shared/presenters/format.ts',
  )

  assert.equal(formatMakingRankLabel(3, '—', { is_boost_rank: true, boost_rank: 1 }), 'A3(+1)')
  assert.equal(formatMakingRankLabel(3, '—', { is_boost_rank: false, boost_rank: 1 }), 'A3')
  assert.equal(formatMakingRankLabel(3, '—', { is_boost_rank: true, boost_rank: 0 }), 'A3')
  assert.equal(formatMakingRankLabel(0, '—', { is_boost_rank: true, boost_rank: 1 }), '—')
  assert.equal(formatMakingRankBoostSuffix(14, { is_boost_rank: true, boost_rank: 2 }), '(+2)')
  assert.equal(formatMakingRankBoostSuffix(0, { is_boost_rank: true, boost_rank: 1 }), '')
})

test('formatShareholderHintForRank renders tier-specific hint', async () => {
  const { formatShareholderHintForRank } = await loadModule('/src/shared/presenters/format.ts')
  const tiers = [
    ['S1', '$500', '$5,000', '1%'],
    ['S2', '$1,000', '$10,000', '2%'],
    ['S3', '$2,000', '$30,000', '3%'],
  ]

  assert.equal(formatShareholderHintForRank(3, 'Reward {bonus}', 'fallback', tiers), 'Reward 3%')
  assert.equal(formatShareholderHintForRank(0, '{bonus}', 'fallback', tiers), 'fallback')
})

test('formatNumber supports $ prefix and USD suffix', async () => {
  const { formatNumber } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatNumber(5000, { suffix: ' USD' }), '5,000 USD')
  assert.equal(formatNumber('invalid', { suffix: ' USD' }), '0 USD')
  assert.equal(formatNumber(1234.5, { digits: 2, prefix: '$' }), '$1,234.50')
  assert.equal(formatNumber(1000, { digits: 0, trimZeros: true }), '1,000')
})

test('formatUsdApprox: missing / no price / NaN → ≈ $0.00', async () => {
  const { formatUsdApprox } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatUsdApprox(0, null), '≈ $0.00')
  assert.equal(formatUsdApprox(0, 65), '≈ $0.00')
  assert.equal(formatUsdApprox(1, null), '≈ $0.00')
  assert.equal(formatUsdApprox(1, 0), '≈ $0.00')
  assert.equal(formatUsdApprox(2, 10), '≈ $20.00')
  assert.equal(formatUsdApprox(Number.NaN, 10), '≈ $0.00')
})

test('formatCompact / formatUsd / formatPercentChange match hub Figma shapes', async () => {
  const { formatCompact, formatUsd, formatPercentChange, formatUsdApprox } = await loadModule(
    '/src/shared/presenters/format.ts',
  )

  assert.equal(formatCompact(129_000, { suffix: ' AGX' }), '129K AGX')
  assert.equal(formatCompact(8_410_000, { prefix: '$' }), '$8.41M')
  assert.equal(formatCompact(0, { digits: 2, suffix: ' AGX' }), '0.00 AGX')
  assert.equal(formatCompact(65, { digits: 2 }), '65.00')
  assert.equal(formatUsd(18_600_000), '$18.6M')
  assert.equal(formatUsd(65), '$65.00')
  assert.equal(formatUsd(null), '$0.00')
  assert.equal(formatUsdApprox(129_000, 65, { compact: true }), '≈ $8.39M')
  assert.equal(formatUsdApprox(0, null, { compact: true }), '≈ $0.00')
  assert.equal(formatPercentChange(412.4), '+412.4%')
  assert.equal(formatPercentChange(null), '+0.0%')
  assert.equal(formatPercentChange(-1.2), '-1.2%')
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

test('formatDiscountBps signs promo; table can drop the minus', async () => {
  const { formatDiscountBps } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatDiscountBps(3000), '-30%')
  assert.equal(formatDiscountBps(3000, { signed: false }), '30%')
  assert.equal(formatDiscountBps(0), '0%')
})

test('formatTableGenesisRank hides S0 in community member table', async () => {
  const { formatTableGenesisRank } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(formatTableGenesisRank(0), '-')
  assert.equal(formatTableGenesisRank(-1), '-')
  assert.equal(formatTableGenesisRank(3), 'S3')
})

test('mapTeamReferralToCompactRow renders invite table cells', async () => {
  const { mapTeamReferralToCompactRow } = await loadModule('/src/views/dapp/community/shared.tsx')

  const registerTime = '2026-04-12T08:00:00.000Z'
  const row = mapTeamReferralToCompactRow({
    address: '0x05A1E51500000000000000000000000000000000',
    register_time: registerTime,
    presale_rank: 0,
    direct_referral_count: 16,
    sales_team_market: '0',
    making_market: '10',
    making_market_usd: '245960',
    making_rank: 0,
    boost_rank: 0,
    is_boost_rank: false,
    active_stake_balance: '100',
    active_stake_balance_usd: '8000',
  })

  const date = new Date(registerTime)
  const pad = (n) => String(n).padStart(2, '0')
  assert.equal(
    row[0],
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`,
  )
  assert.equal(row[1]?.props?.value, '0x05A1E51500000000000000000000000000000000')
  assert.deepEqual(row[1]?.props?.shortOptions, { head: 4, tail: 4 })
  assert.equal(row[2], '$8,000')
  assert.equal(row[3], '-')
  assert.equal(row[4], '16')
  assert.equal(row[5], '$245,960')

  const ranked = mapTeamReferralToCompactRow({
    address: '0x05A1E51500000000000000000000000000000000',
    register_time: registerTime,
    presale_rank: 0,
    direct_referral_count: 0,
    sales_team_market: '0',
    making_market: '0',
    making_market_usd: '0',
    making_rank: 3,
    boost_rank: 0,
    is_boost_rank: false,
    active_stake_balance: '0',
    active_stake_balance_usd: '0',
  })
  assert.equal(ranked[3], 'A3')

  const boosted = mapTeamReferralToCompactRow({
    address: '0x05A1E51500000000000000000000000000000000',
    register_time: registerTime,
    presale_rank: 0,
    direct_referral_count: 0,
    sales_team_market: '0',
    making_market: '0',
    making_market_usd: '0',
    making_rank: 3,
    boost_rank: 1,
    is_boost_rank: true,
    active_stake_balance: '0',
    active_stake_balance_usd: '0',
  })
  assert.equal(boosted[3], 'A3(+1)')
})

test('mapRewardLogToRow uses i18n labels for status', async () => {
  const { mapRewardLogToRow } = await loadModule('/src/views/dapp/rewards/shared.tsx')
  const labels = {
    pending: '待领取',
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
  const { mapTeamRewardClaimLogToRow } = await loadModule('/src/views/dapp/rewards/shared.tsx')
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
  const { mapCommunityFundLogToRow } = await loadModule('/src/views/dapp/rewards/shared.tsx')
  const labels = {
    pending: '待领取',
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

test('mapMarketAllowancePaidLogToRow formats subsidy rate as percent', async () => {
  const { mapMarketAllowancePaidLogToRow } = await loadModule('/src/views/dapp/rewards/shared.tsx')

  const row = mapMarketAllowancePaidLogToRow({
    paid_time: 1_700_000_000,
    agx_amount: '2000',
    operation_type: '质押',
    tx_hash: null,
    subsidy_rate: '8',
    allowance_amount: '160',
  })

  assert.equal(row[1], '2,000.0000 AGX')
  assert.equal(row[4], '8%')
  assert.equal(row[5], '160.0000 gAGX')
})

test('mapMarketAllowanceClaimLogToRow keeps four gAGX decimals and unit', async () => {
  const { mapMarketAllowanceClaimLogToRow } = await loadModule('/src/views/dapp/rewards/shared.tsx')

  const row = mapMarketAllowanceClaimLogToRow({
    claim_time: 1_700_000_000,
    allowance_amount: '12.5',
    tx_hash: null,
  })

  assert.equal(row[1], '12.5000 gAGX')
  assert.equal(row[2], '-')
})

test('claimableAmountValue subtracts claimed from total', async () => {
  const { claimableAmountValue } = await loadModule('/src/views/dapp/rewards/shared.tsx')
  const { formatNumber } = await loadModule('/src/shared/presenters/format.ts')

  assert.equal(
    formatNumber(claimableAmountValue('1000', '657.82'), { digits: 2, prefix: '$' }),
    '$342.18',
  )
  assert.ok(claimableAmountValue('0.004', '0') > 0)
  assert.equal(
    formatNumber(claimableAmountValue('0.004', '0'), { digits: 2, prefix: '$' }),
    '$0.00',
  )
})
