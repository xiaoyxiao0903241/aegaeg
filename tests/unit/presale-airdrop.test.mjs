import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const MIN_PERIOD_USD = 5_000

test('X airdrop preview is hidden below single-period cumulative threshold', async () => {
  const { resolveXTokenAirdropUsdForPurchase } = await loadModule('/src/lib/presale/presale-math.ts')

  assert.equal(resolveXTokenAirdropUsdForPurchase(0, 100, 0, MIN_PERIOD_USD), 0)
  assert.equal(
    resolveXTokenAirdropUsdForPurchase(MIN_PERIOD_USD - 200, 100, 0, MIN_PERIOD_USD),
    0,
  )
})

test('X airdrop preview applies phase ratio to current order once eligible', async () => {
  const { resolveXTokenAirdropUsdForPurchase } = await loadModule(
    '/src/lib/presale/presale-math.ts',
  )

  const phase0 = {
    index: 0,
    minAmount: 0n,
    maxAmount: 0n,
    discountBps: 0n,
    airdropValueRatio: 500n,
    startTime: 0n,
    endTime: 0n,
    soldAmount: 0n,
    userPurchaseLimit: 0n,
    purchasedAmount: 0n,
  }
  const phase1 = { ...phase0, index: 1, airdropValueRatio: 200n }

  assert.equal(resolveXTokenAirdropUsdForPurchase(5_900, 100, 0, MIN_PERIOD_USD, phase0), 5)
  assert.equal(resolveXTokenAirdropUsdForPurchase(6_000, 100, 1, MIN_PERIOD_USD, phase1), 2)
})

test('presaleAirdropThresholdToUsd reads AIRDROP_THRESHOLD wei as USD', async () => {
  const { presaleAirdropThresholdToUsd } = await loadModule('/src/lib/presale/presale-math.ts')

  assert.equal(presaleAirdropThresholdToUsd(5000n * 10n ** 18n), 5000)
  assert.equal(presaleAirdropThresholdToUsd(0n), 0)
})

test('estimateXTokenAirdropUsd uses on-chain airdropValueRatio from phase', async () => {
  const { estimateXTokenAirdropUsd } = await loadModule('/src/lib/presale/presale-math.ts')

  assert.equal(
    estimateXTokenAirdropUsd(100, 0, {
      index: 0,
      minAmount: 0n,
      maxAmount: 0n,
      discountBps: 0n,
      airdropValueRatio: 500n,
      startTime: 0n,
      endTime: 0n,
      soldAmount: 0n,
      userPurchaseLimit: 0n,
      purchasedAmount: 0n,
    }),
    5,
  )
  assert.equal(
    estimateXTokenAirdropUsd(100, 1, {
      index: 1,
      minAmount: 0n,
      maxAmount: 0n,
      discountBps: 0n,
      airdropValueRatio: 200n,
      startTime: 0n,
      endTime: 0n,
      soldAmount: 0n,
      userPurchaseLimit: 0n,
      purchasedAmount: 0n,
    }),
    2,
  )
  assert.equal(estimateXTokenAirdropUsd(100, 1, undefined), 0)
})
