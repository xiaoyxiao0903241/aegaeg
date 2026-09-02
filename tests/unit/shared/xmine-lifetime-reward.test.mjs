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

test('sumX0MiningRewardAmountAcrossPages paginates until items cover total', async () => {
  const { sumX0MiningRewardAmountAcrossPages } = await loadModule(
    '/src/shared/presenters/xmine-lifetime-reward.ts',
  )

  const pages = [
    {
      total: 3,
      items: [
        { operation: 'REWARD', amount: '1' },
        { operation: 'REWARD', amount: '2' },
      ],
    },
    {
      total: 3,
      items: [{ operation: 'REWARD', amount: '0.5' }],
    },
  ]
  let calls = 0
  const sum = await sumX0MiningRewardAmountAcrossPages({
    pageSize: 2,
    fetchPage: async (page, pageSize) => {
      calls += 1
      assert.equal(pageSize, 2)
      return pages[page - 1]
    },
  })
  assert.equal(sum, 3.5)
  assert.equal(calls, 2)
})

test('sumX0MiningRewardAmountAcrossPages stops when page shorter than page_size', async () => {
  const { sumX0MiningRewardAmountAcrossPages } = await loadModule(
    '/src/shared/presenters/xmine-lifetime-reward.ts',
  )

  let calls = 0
  const sum = await sumX0MiningRewardAmountAcrossPages({
    pageSize: 100,
    fetchPage: async () => {
      calls += 1
      return {
        total: 250,
        items: [
          { operation: 'REWARD', amount: '10' },
          { operation: 'STAKE_X', amount: '999' },
        ],
      }
    },
  })
  assert.equal(sum, 10)
  assert.equal(calls, 1)
})
