import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const samplePhases = [
  {
    index: 0,
    minAmount: 100n * 10n ** 18n,
    maxAmount: 10_000n * 10n ** 18n,
    discountBps: 3000n,
    airdropValueRatio: 500n,
    startTime: 0n,
    endTime: BigInt(5 * 86_400),
    soldAmount: 0n,
    userPurchaseLimit: 10_000n * 10n ** 18n,
    purchasedAmount: 0n,
  },
  {
    index: 1,
    minAmount: 100n * 10n ** 18n,
    maxAmount: 20_000n * 10n ** 18n,
    discountBps: 2500n,
    airdropValueRatio: 200n,
    startTime: 0n,
    endTime: BigInt(5 * 86_400),
    soldAmount: 0n,
    userPurchaseLimit: 20_000n * 10n ** 18n,
    purchasedAmount: 0n,
  },
  {
    index: 2,
    minAmount: 100n * 10n ** 18n,
    maxAmount: 30_000n * 10n ** 18n,
    discountBps: 2000n,
    airdropValueRatio: 100n,
    startTime: 0n,
    endTime: BigInt(5 * 86_400),
    soldAmount: 0n,
    userPurchaseLimit: 30_000n * 10n ** 18n,
    purchasedAmount: 0n,
  },
]

test('buildGenesisFaqTemplateValues formats on-chain presale fields', async () => {
  const { buildGenesisFaqTemplateValues } = await loadModule('/src/lib/presale/genesis-faq.ts')

  const values = buildGenesisFaqTemplateValues(samplePhases, 5000)

  assert.equal(values.phaseCount, '3')
  assert.equal(values.phaseDurationDays, '5')
  assert.equal(values.discounts, '30% / 25% / 20%')
  assert.equal(values.minUsd, '$100')
  assert.equal(values.shareIncrement, '100')
  assert.equal(
    values.phaseQuotas,
    '$100–$10,000 / $100–$20,000 / $100–$30,000',
  )
  assert.equal(values.threshold, '$5,000')
  assert.equal(values.airdropRatios, '5% / 2% / 1%')
})

test('buildGenesisFaqTemplateValues returns ellipsis while loading', async () => {
  const { buildGenesisFaqTemplateValues } = await loadModule('/src/lib/presale/genesis-faq.ts')

  const values = buildGenesisFaqTemplateValues([], 5000, true)

  assert.equal(values.phaseCount, '…')
  assert.equal(values.threshold, '…')
})
