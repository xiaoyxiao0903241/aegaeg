import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('mapLuckyClaimMulticallRow: claimed read failure treats as unclaimed', async () => {
  const { mapLuckyClaimMulticallRow } = await loadModule(
    '/src/core/rewards/map-lucky-claim-multicall-row.ts',
  )

  const row = mapLuckyClaimMulticallRow({
    roundId: 13n,
    infoOk: true,
    won: true,
    rewardAmount: 8783944132n,
    claimedOk: false,
    rewardClaimed: true,
  })

  assert.deepEqual(row, {
    roundId: 13n,
    won: true,
    rewardAmount: 8783944132n,
    rewardClaimed: false,
  })
})

test('mapLuckyClaimMulticallRow: winner info failure treats as no win', async () => {
  const { mapLuckyClaimMulticallRow } = await loadModule(
    '/src/core/rewards/map-lucky-claim-multicall-row.ts',
  )

  const row = mapLuckyClaimMulticallRow({
    roundId: 13n,
    infoOk: false,
    won: true,
    rewardAmount: 1n,
    claimedOk: true,
    rewardClaimed: false,
  })

  assert.deepEqual(row, {
    roundId: 13n,
    won: false,
    rewardAmount: 0n,
    rewardClaimed: false,
  })
})

test('mapLuckyClaimMulticallRow: both ok keeps claimed flag', async () => {
  const { mapLuckyClaimMulticallRow } = await loadModule(
    '/src/core/rewards/map-lucky-claim-multicall-row.ts',
  )

  const row = mapLuckyClaimMulticallRow({
    roundId: 2n,
    infoOk: true,
    won: true,
    rewardAmount: 50n,
    claimedOk: true,
    rewardClaimed: true,
  })

  assert.equal(row.rewardClaimed, true)
  assert.equal(row.rewardAmount, 50n)
})
