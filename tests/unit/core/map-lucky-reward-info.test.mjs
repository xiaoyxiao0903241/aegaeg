import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('mapLuckyRewardInfo: pending is claimable when pool is live', async () => {
  const { mapLuckyRewardInfo } = await loadModule('/src/core/rewards/map-lucky-reward-info.ts')

  const snap = mapLuckyRewardInfo({
    paused: false,
    accrued: 26335697234n,
    claimed: 0n,
    pending: 26335697234n,
  })

  assert.equal(snap.rewardAmount, 26335697234n)
  assert.equal(snap.totalUnclaimedAmount, 26335697234n)
  assert.equal(snap.won, true)
  assert.equal(snap.rewardClaimed, false)
  assert.equal(snap.claimable, true)
})

test('mapLuckyRewardInfo: claimed ledger is not claimable', async () => {
  const { mapLuckyRewardInfo } = await loadModule('/src/core/rewards/map-lucky-reward-info.ts')

  const snap = mapLuckyRewardInfo({
    paused: false,
    accrued: 100n,
    claimed: 100n,
    pending: 0n,
  })

  assert.equal(snap.rewardAmount, 0n)
  assert.equal(snap.claimable, false)
  assert.equal(snap.won, true)
  assert.equal(snap.rewardClaimed, true)
})

test('mapLuckyRewardInfo: paused reports amount but is not claimable', async () => {
  const { mapLuckyRewardInfo } = await loadModule('/src/core/rewards/map-lucky-reward-info.ts')

  const snap = mapLuckyRewardInfo({
    paused: true,
    accrued: 7n,
    claimed: 2n,
    pending: 5n,
  })

  assert.equal(snap.totalUnclaimedAmount, 5n)
  assert.equal(snap.claimable, false)
})

test('mapLuckyRewardInfo: fail-closed when pending is not accrued minus claimed', async () => {
  const { mapLuckyRewardInfo } = await loadModule('/src/core/rewards/map-lucky-reward-info.ts')

  const snap = mapLuckyRewardInfo({
    paused: false,
    accrued: 10n,
    claimed: 1n,
    pending: 10n,
  })

  assert.equal(snap.rewardAmount, 0n)
  assert.equal(snap.totalUnclaimedAmount, 0n)
  assert.equal(snap.claimable, false)
  assert.equal(snap.won, false)
})
