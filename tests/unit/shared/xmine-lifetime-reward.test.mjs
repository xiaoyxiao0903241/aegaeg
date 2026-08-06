import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('sumX0MiningRewardAmount sums REWARD amounts only; fail-closed on bad amounts', async () => {
  const { sumX0MiningRewardAmount } = await loadModule(
    '/src/shared/presenters/xmine-lifetime-reward.ts',
  )

  assert.equal(sumX0MiningRewardAmount([]), 0)
  assert.equal(
    sumX0MiningRewardAmount([
      { operation: 'STAKE_X', amount: '10' },
      { operation: 'REWARD', amount: '1.5' },
      { operation: 'REWARD', amount: '2.25' },
      { operation: 'REDEEM', amount: '99' },
      { operation: 'REWARD', amount: 'bad' },
    ]),
    3.75,
  )
})
