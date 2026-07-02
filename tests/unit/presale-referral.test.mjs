import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('estimateAgxFromUsd1 matches deployment example', async () => {
  const { estimateAgxFromUsd1 } = await loadModule('/src/lib/presale/presale-math.ts')

  const estimated = estimateAgxFromUsd1(1000, 3000, 55)
  assert.ok(Math.abs(estimated - 25.974) < 0.01)
})

test('findActivePresalePhase picks phase by timestamp', async () => {
  const { findActivePresalePhase } = await loadModule('/src/lib/presale/presale-math.ts')

  const active = findActivePresalePhase(
    [
      {
        index: 0,
        minAmount: 100n,
        maxAmount: 1000n,
        discountBps: 3000n,
        airdropValueRatio: 500n,
        startTime: 100n,
        endTime: 200n,
        soldAmount: 0n,
        userPurchaseLimit: 10_000n,
        purchasedAmount: 0n,
      },
      {
        index: 1,
        minAmount: 100n,
        maxAmount: 1000n,
        discountBps: 2500n,
        airdropValueRatio: 200n,
        startTime: 201n,
        endTime: 300n,
        soldAmount: 0n,
        userPurchaseLimit: 20_000n,
        purchasedAmount: 0n,
      },
    ],
    150,
  )

  assert.equal(active?.index, 0)
})

test('parseReferrerFromSearch reads ref query param', async () => {
  const { parseReferrerFromSearch } = await loadModule('/src/config/referral.ts')

  assert.equal(
    parseReferrerFromSearch('?ref=0x74A4127e0aaC45C8C23935707fE37889821029c3'),
    '0x74A4127e0aaC45C8C23935707fE37889821029c3',
  )
  assert.equal(parseReferrerFromSearch('?foo=bar'), null)
})
