import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('flow log amount cells use 0 when raw amount is missing', async () => {
  const { mapStakeFlowLogToOpsRow, mapStakePositionToAsideRow } = await loadModule(
    '/src/shared/presenters/map-flow-log-rows.tsx',
  )

  const ops = mapStakeFlowLogToOpsRow({
    block_time: 1_700_000_000,
    operation: 'Stake',
    amount: 'not-a-number',
    tx_hash: null,
  })
  assert.equal(ops[2], '0.0000')
  assert.equal(ops[3], '-')

  const aside = mapStakePositionToAsideRow({
    block_time: 1_700_000_000,
    term_days: 180,
    amount: 'bad',
    released_pct: 'nan',
    tx_hash: null,
  })
  assert.equal(aside[2], '0.00 AGX')
  assert.equal(aside[3], '-')
})
