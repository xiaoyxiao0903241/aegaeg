import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('buildRewardTierRows aligns with tier-progress thresholds', async () => {
  const { buildRewardTierRows } = await loadModule('/src/lib/presale/tier-table.ts')

  const rows = buildRewardTierRows()

  assert.equal(rows.length, 10)
  assert.deepEqual(rows[0], ['S1', '≥ $500', '$5,000', '1%', 'A2'])
  assert.deepEqual(rows[2], ['S3', '≥ $2,000', '$30,000', '3%', 'A4'])
  assert.equal(rows[3][2], 'Two legs S3')
  assert.deepEqual(rows[6], ['S7', '≥ $10,000', 'Two legs S6', '7%', 'A8'])
  assert.deepEqual(rows[9], ['S10', '≥ $20,000', 'Two legs S9', '10%', 'A11'])
})

test('mapSalesLogToDesktopRow estimates AGX from amount and discount', async () => {
  const { mapSalesLogToDesktopRow } = await loadModule('/src/lib/api/format-display.ts')

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
    65,
  )

  assert.equal(row[2], '-30%')
  assert.equal(row[3], '21.98')
})
