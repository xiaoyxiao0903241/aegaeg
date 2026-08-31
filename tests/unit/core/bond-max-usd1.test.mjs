import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

const AGX = 10n ** 9n
const USD1 = 10n ** 18n

const pool = {
  reserveU: 55n * USD1,
  reserveAGX: 1n * AGX,
  totalSupply: 10n ** 18n,
}

test('pancakeV2AmountIn is enough to buy the requested amountOut', async () => {
  const { pancakeV2AmountOut, pancakeV2AmountIn } = await loadModule(
    '/src/core/staking/bond-max-usd1.ts',
  )
  const want = AGX / 50n
  const cost = pancakeV2AmountIn(want, pool.reserveU, pool.reserveAGX)
  assert.ok(cost > 0n)
  assert.ok(pancakeV2AmountOut(cost, pool.reserveU, pool.reserveAGX) >= want)
})

test('maxUsd1ForBondPurchase burn: payout of cap stays within maxPayout', async () => {
  const { maxUsd1ForBondPurchase, quoteBondZapPayoutLocal } = await loadModule(
    '/src/core/staking/bond-max-usd1.ts',
  )
  const capGross = AGX / 5n
  const usd1 = maxUsd1ForBondPurchase({
    kind: 'burn',
    maxPayoutAmount: capGross,
    maxDebt: 0n,
    totalDeposit: 0n,
    feeBps: 0n,
    discountRateBP: 8500n,
    pool,
  })
  assert.ok(usd1 > 0n)
  const atCap = quoteBondZapPayoutLocal({
    kind: 'burn',
    usd1Amount: usd1,
    discountRateBP: 8500n,
    feeBps: 0n,
    pool,
  })
  assert.ok(atCap.grossPayout <= capGross)
  const over = quoteBondZapPayoutLocal({
    kind: 'burn',
    usd1Amount: usd1 + 1n,
    discountRateBP: 8500n,
    feeBps: 0n,
    pool,
  })
  assert.ok(over.grossPayout > capGross)
})

test('maxUsd1ForBondPurchase burn: remaining debt tighter than maxPayout', async () => {
  const { maxUsd1ForBondPurchase, quoteBondZapPayoutLocal } = await loadModule(
    '/src/core/staking/bond-max-usd1.ts',
  )
  const remaining = AGX / 20n
  const usd1 = maxUsd1ForBondPurchase({
    kind: 'burn',
    maxPayoutAmount: AGX,
    maxDebt: remaining,
    totalDeposit: 0n,
    feeBps: 0n,
    discountRateBP: 8500n,
    pool,
  })
  const atCap = quoteBondZapPayoutLocal({
    kind: 'burn',
    usd1Amount: usd1,
    discountRateBP: 8500n,
    feeBps: 0n,
    pool,
  })
  assert.ok(atCap.netPayout <= remaining)
  const over = quoteBondZapPayoutLocal({
    kind: 'burn',
    usd1Amount: usd1 + 1n,
    discountRateBP: 8500n,
    feeBps: 0n,
    pool,
  })
  assert.ok(over.netPayout > remaining)
})

test('maxUsd1ForBondPurchase lp: payout of cap stays within maxPayout', async () => {
  const { maxUsd1ForBondPurchase, quoteBondZapPayoutLocal } = await loadModule(
    '/src/core/staking/bond-max-usd1.ts',
  )
  const capGross = AGX / 5n
  const usd1 = maxUsd1ForBondPurchase({
    kind: 'lp',
    maxPayoutAmount: capGross,
    maxDebt: 0n,
    totalDeposit: 0n,
    feeBps: 0n,
    discountRateBP: 8500n,
    pool,
  })
  assert.ok(usd1 > 0n)
  const atCap = quoteBondZapPayoutLocal({
    kind: 'lp',
    usd1Amount: usd1,
    discountRateBP: 8500n,
    feeBps: 0n,
    pool,
  })
  assert.ok(atCap.grossPayout <= capGross)
  const over = quoteBondZapPayoutLocal({
    kind: 'lp',
    usd1Amount: usd1 + 1n,
    discountRateBP: 8500n,
    feeBps: 0n,
    pool,
  })
  assert.ok(over.grossPayout > capGross)
})

test('maxUsd1ForBondPurchase sold out or zero maxPayout is 0', async () => {
  const { maxUsd1ForBondPurchase } = await loadModule('/src/core/staking/bond-max-usd1.ts')
  assert.equal(
    maxUsd1ForBondPurchase({
      kind: 'burn',
      maxPayoutAmount: 0n,
      maxDebt: 0n,
      totalDeposit: 0n,
      feeBps: 0n,
      discountRateBP: 8500n,
      pool,
    }),
    0n,
  )
  assert.equal(
    maxUsd1ForBondPurchase({
      kind: 'burn',
      maxPayoutAmount: 10n * AGX,
      maxDebt: 5n * AGX,
      totalDeposit: 5n * AGX,
      feeBps: 0n,
      discountRateBP: 8500n,
      pool,
    }),
    0n,
  )
})
