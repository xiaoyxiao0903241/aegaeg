import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('genesisPromoSnapshot uses active season discount and end date', async () => {
  const { genesisPromoSnapshot } = await loadModule('/src/core/presale/genesis-promo.ts')

  const now = 1_700_000_000
  const phases = [
    {
      index: 0,
      minAmount: 100n,
      maxAmount: 10_000n,
      discountBps: 3_000n,
      airdropValueRatio: 500n,
      startTime: BigInt(now - 86_400),
      endTime: BigInt(now + 86_400),
      soldAmount: 1_000n,
      userPurchaseLimit: 10_000n,
    },
  ]

  const snapshot = genesisPromoSnapshot(phases, phases[0], 55, now)

  assert.equal(snapshot?.season, 1)
  assert.equal(snapshot?.discount, '-30%')
  assert.equal(snapshot?.status, 'LIVE')
  assert.match(snapshot?.endDate ?? '', /^\d{2}\.\d{2}$/)
  assert.match(snapshot?.startDate ?? '', /^\d{2}\.\d{2}$/)
  assert.match(snapshot?.dateRange ?? '', /\d{2}\.\d{2}/)
})

function phaseAt(index, times, discountBps) {
  return {
    index,
    minAmount: 100n,
    maxAmount: 10_000n,
    discountBps,
    airdropValueRatio: 200n,
    startTime: BigInt(times.start),
    endTime: BigInt(times.end),
    soldAmount: 0n,
    userPurchaseLimit: 20_000n,
  }
}

test('genesisPromoSnapshot uses first season when the only phase is upcoming', async () => {
  const { genesisPromoSnapshot } = await loadModule('/src/core/presale/genesis-promo.ts')

  const now = 1_700_000_000
  const phases = [phaseAt(0, { start: now + 86_400, end: now + 172_800 }, 2_500n)]

  const snapshot = genesisPromoSnapshot(phases, null, 55, now)

  assert.equal(snapshot?.status, 'Upcoming')
  assert.equal(snapshot?.season, 1)
  assert.equal(snapshot?.discount, '-25%')
  assert.match(snapshot?.startDate ?? '', /^\d{2}\.\d{2}$/)
})

test('genesisPromoSnapshot uses last season when all phases have ended', async () => {
  const { genesisPromoSnapshot } = await loadModule('/src/core/presale/genesis-promo.ts')

  const now = 1_700_000_000
  const phases = [
    phaseAt(0, { start: now - 300_000, end: now - 200_000 }, 2_000n),
    phaseAt(1, { start: now - 180_000, end: now - 1 }, 3_500n),
  ]

  const snapshot = genesisPromoSnapshot(phases, null, 55, now)

  assert.equal(snapshot?.status, 'Ended')
  assert.equal(snapshot?.season, 2)
  assert.equal(snapshot?.discount, '-35%')
})

test('genesisPromoSnapshot uses first season when any phase is upcoming', async () => {
  const { genesisPromoSnapshot } = await loadModule('/src/core/presale/genesis-promo.ts')

  const now = 1_700_000_000
  const phases = [
    phaseAt(0, { start: now - 200_000, end: now - 1 }, 2_000n),
    phaseAt(1, { start: now + 86_400, end: now + 172_800 }, 2_500n),
    phaseAt(2, { start: now + 200_000, end: now + 300_000 }, 4_000n),
  ]

  const snapshot = genesisPromoSnapshot(phases, null, 55, now)

  assert.equal(snapshot?.season, 1)
  assert.equal(snapshot?.discount, '-20%')
})
