import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('rewardTierRows aligns with tier-progress thresholds', async () => {
  const { rewardTierRows } = await loadModule('/src/core/presale/tier-table.ts')

  const rows = rewardTierRows()

  assert.equal(rows.length, 10)
  assert.deepEqual(rows[0], ['S1', '≥ $500', '$5,000', '1%'])
  assert.deepEqual(rows[2], ['S3', '≥ $2,000', '$30,000', '3%'])
  assert.equal(rows[3][2], 'Two legs S3')
  assert.deepEqual(rows[6], ['S7', '≥ $10,000', 'Two legs S6', '7%'])
  assert.deepEqual(rows[9], ['S10', '≥ $20,000', 'Two legs S9', '10%'])
})

test('commitment floor post-launch labels map API floor rank to A-tier', async () => {
  const {
    getCommitmentFloorPostLaunchLabel,
    getCommitmentFloorBoostedPostLaunchLabel,
    getTeamBonusRateLabel,
    commitmentFloorBoostCopy,
    commitmentFloorRank,
    MAX_COMMITMENT_FLOOR_A_RANK,
  } = await loadModule('/src/core/presale/tier-table.ts')

  assert.equal(MAX_COMMITMENT_FLOOR_A_RANK, 13)
  assert.equal(commitmentFloorRank(0), 0)
  assert.equal(commitmentFloorRank(10), 10)
  assert.equal(commitmentFloorRank(13), 13)
  assert.equal(commitmentFloorRank(14), 13)

  assert.equal(getCommitmentFloorPostLaunchLabel(3), 'A3')
  assert.equal(getCommitmentFloorBoostedPostLaunchLabel(3), 'A4')
  assert.equal(getCommitmentFloorBoostedPostLaunchLabel(0), '')
  assert.equal(getCommitmentFloorPostLaunchLabel(13), 'A13')
  assert.equal(getCommitmentFloorBoostedPostLaunchLabel(12), 'A13')
  assert.equal(getCommitmentFloorBoostedPostLaunchLabel(13), 'A13')
  assert.equal(getCommitmentFloorPostLaunchLabel(14), 'A13')
  assert.equal(
    commitmentFloorBoostCopy(0, {
      boostTemplate: 'boost {rank}',
      maxRankCopy: 'max',
    }),
    undefined,
  )
  assert.equal(
    commitmentFloorBoostCopy(3, {
      boostTemplate: 'boost {rank}',
      maxRankCopy: 'max',
    }),
    'boost A4',
  )
  assert.equal(
    commitmentFloorBoostCopy(13, {
      boostTemplate: 'boost {rank}',
      maxRankCopy: '您已达到最高等级',
    }),
    '您已达到最高等级',
  )
  assert.equal(getTeamBonusRateLabel(0), '1%')
  assert.equal(getTeamBonusRateLabel(2), '2%')
})

test('mapSalesLogToDesktopRow estimates AGX from amount and discount', async () => {
  const { mapSalesLogToDesktopRow } = await loadModule('/src/views/dapp/genesis/shared.ts')

  const row = mapSalesLogToDesktopRow(
    {
      id: 1,
      node_type: 1,
      amount: '1000',
      phase_id: 0,
      tokens: '21.98',
      tx_hash: '0xabc123def4567890abcdef1234567890abcdef12',
      block_number: 1,
      block_time: 1_700_000_000,
      log_index: 0,
      status: 2,
      created_at: null,
    },
    {
      agxPriceUsd: 65,
      phases: [{ discountBps: 3000n }],
    },
  )

  assert.equal(row[2], '-30%')
  assert.equal(row[3], '21.98')
})
