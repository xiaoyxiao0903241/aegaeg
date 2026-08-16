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

test('genesisPromoSnapshot falls back to upcoming season', async () => {
  const { genesisPromoSnapshot } = await loadModule('/src/core/presale/genesis-promo.ts')

  const now = 1_700_000_000
  const phases = [
    {
      index: 0,
      minAmount: 100n,
      maxAmount: 10_000n,
      discountBps: 2_500n,
      airdropValueRatio: 200n,
      startTime: BigInt(now + 86_400),
      endTime: BigInt(now + 172_800),
      soldAmount: 0n,
      userPurchaseLimit: 20_000n,
    },
  ]

  const snapshot = genesisPromoSnapshot(phases, null, 55, now)

  assert.equal(snapshot?.status, 'Upcoming')
  assert.equal(snapshot?.discount, '-25%')
  assert.match(snapshot?.startDate ?? '', /^\d{2}\.\d{2}$/)
})
