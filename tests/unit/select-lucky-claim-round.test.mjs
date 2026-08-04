import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from './load-module.mjs'

test('selectLuckyClaimRound: prefers older unclaimed win over empty prior round', async () => {
  const { selectLuckyClaimRound } = await loadModule(
    '/src/core/rewards/select-lucky-claim-round.ts',
  )

  const selected = selectLuckyClaimRound({
    openRoundId: 5n,
    paused: false,
    rows: [
      { roundId: 4n, won: false, rewardAmount: 0n, rewardClaimed: false },
      { roundId: 3n, won: true, rewardAmount: 100n, rewardClaimed: false },
      { roundId: 2n, won: true, rewardAmount: 50n, rewardClaimed: true },
    ],
  })

  assert.equal(selected.roundId, 3n)
  assert.equal(selected.claimable, true)
  assert.equal(selected.rewardAmount, 100n)
})

test('selectLuckyClaimRound: falls back to prior closed when none claimable', async () => {
  const { selectLuckyClaimRound } = await loadModule(
    '/src/core/rewards/select-lucky-claim-round.ts',
  )

  const selected = selectLuckyClaimRound({
    openRoundId: 3n,
    paused: false,
    rows: [
      { roundId: 2n, won: true, rewardAmount: 10n, rewardClaimed: true },
      { roundId: 1n, won: false, rewardAmount: 0n, rewardClaimed: false },
    ],
  })

  assert.equal(selected.roundId, 2n)
  assert.equal(selected.claimable, false)
  assert.equal(selected.rewardClaimed, true)
})
