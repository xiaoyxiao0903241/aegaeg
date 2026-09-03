import assert from 'node:assert/strict'
import test from 'node:test'

import {
  agxAmountToUsdProgressCurrent,
  dualLineProgressBadge,
  progressPct,
} from '../../../src/core/rewards/cobuild-tier-progress.ts'

test('agxAmountToUsdProgressCurrent: priced → USD; missing/invalid price → null', () => {
  assert.equal(agxAmountToUsdProgressCurrent(10, 65), 650)
  assert.equal(agxAmountToUsdProgressCurrent(10, null), null)
  assert.equal(agxAmountToUsdProgressCurrent(10, undefined), null)
  assert.equal(agxAmountToUsdProgressCurrent(10, 0), null)
  assert.equal(agxAmountToUsdProgressCurrent(10, -1), null)
  assert.equal(agxAmountToUsdProgressCurrent(10, Number.NaN), null)
})

test('progressPct: null current → empty (no AGX↔$ compare)', () => {
  assert.deepEqual(progressPct(null, '$1000'), { kind: 'empty' })
  assert.deepEqual(progressPct(650, '$1000'), { kind: 'pct', value: '65%' })
  assert.deepEqual(progressPct(1000, '$1000'), { kind: 'achieved' })
  assert.deepEqual(progressPct(0, '$1000'), { kind: 'pct', value: '0%' })
})

test('dualLineProgressBadge: backend qualified is achieved SSOT', () => {
  assert.deepEqual(dualLineProgressBadge(null, false, 2), { kind: 'empty' })
  assert.deepEqual(dualLineProgressBadge(1, null, 2), { kind: 'empty' })
  assert.deepEqual(dualLineProgressBadge(1, true, 2), { kind: 'achieved' })
  assert.deepEqual(dualLineProgressBadge(0, false, 2), { kind: 'pct', value: '0%' })
  assert.deepEqual(dualLineProgressBadge(1, false, 2), { kind: 'pct', value: '50%' })
})
