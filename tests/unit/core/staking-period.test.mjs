import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('lockDaysFromPeriodSec maps seconds to whole days', async () => {
  const { lockDaysFromPeriodSec } = await loadModule('/src/core/staking/staking-period.ts')

  assert.equal(lockDaysFromPeriodSec(360n * 86_400n), 360)
  assert.equal(lockDaysFromPeriodSec(540n * 86_400n), 540)
  assert.equal(lockDaysFromPeriodSec(undefined), null)
  assert.equal(lockDaysFromPeriodSec(0n), null)
  assert.equal(lockDaysFromPeriodSec(-1n), null)
})
