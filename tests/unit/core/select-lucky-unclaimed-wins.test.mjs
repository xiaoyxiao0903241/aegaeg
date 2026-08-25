import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('selectLuckyUnclaimedWins: sums all unclaimed and lists rounds newest first', async () => {
  const { selectLuckyUnclaimedWins } = await loadModule(
    '/src/core/rewards/select-lucky-unclaimed-wins.ts',
  )

  const selected = selectLuckyUnclaimedWins({
    paused: false,
    wins: [
      { roundId: 11n, rewardAmount: 10n },
      { roundId: 13n, rewardAmount: 30n },
      { roundId: 12n, rewardAmount: 20n },
    ],
    claimedRoundIds: new Set(),
  })

  assert.equal(selected.totalUnclaimedAmount, 60n)
  assert.equal(selected.unclaimedRounds.length, 3)
  assert.deepEqual(
    selected.unclaimedRounds.map((r) => r.roundId),
    [13n, 12n, 11n],
  )
  assert.equal(selected.roundId, 13n)
  assert.equal(selected.rewardAmount, 30n)
  assert.equal(selected.claimable, true)
})

test('selectLuckyUnclaimedWins: excludes claimed rounds from sum and list', async () => {
  const { selectLuckyUnclaimedWins } = await loadModule(
    '/src/core/rewards/select-lucky-unclaimed-wins.ts',
  )

  const selected = selectLuckyUnclaimedWins({
    paused: false,
    wins: [
      { roundId: 13n, rewardAmount: 30n },
      { roundId: 12n, rewardAmount: 20n },
      { roundId: 11n, rewardAmount: 10n },
    ],
    claimedRoundIds: new Set([13n]),
  })

  assert.equal(selected.totalUnclaimedAmount, 30n)
  assert.equal(selected.unclaimedRounds.length, 2)
  assert.deepEqual(
    selected.unclaimedRounds.map((r) => r.roundId),
    [12n, 11n],
  )
  assert.equal(selected.roundId, 12n)
  assert.equal(selected.rewardAmount, 20n)
  assert.equal(selected.claimable, true)
})

test('selectLuckyUnclaimedWins: paused is not claimable but still reports totals', async () => {
  const { selectLuckyUnclaimedWins } = await loadModule(
    '/src/core/rewards/select-lucky-unclaimed-wins.ts',
  )

  const selected = selectLuckyUnclaimedWins({
    paused: true,
    wins: [{ roundId: 5n, rewardAmount: 7n }],
    claimedRoundIds: new Set(),
  })

  assert.equal(selected.totalUnclaimedAmount, 7n)
  assert.equal(selected.unclaimedRounds.length, 1)
  assert.equal(selected.claimable, false)
  assert.equal(selected.roundId, 5n)
})
