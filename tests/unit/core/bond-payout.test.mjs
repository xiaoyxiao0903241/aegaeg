import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('bond payout helpers follow handbook §10.6', async () => {
  const {
    computeGrossBondPayout,
    computeNetBondPayout,
    computeBondPoolAgxPrice,
    quoteZapLpAmount,
    computeBurnBondGrossPayout,
  } = await loadModule('/src/core/staking/bond-payout.ts')

  const gross = computeGrossBondPayout({
    value: 1_000_000_000n,
    agxPrice: 10n ** 18n,
    discountRateBP: 9500n,
  })
  assert.equal(gross, (((1_000_000_000n * 1_000_000_000n) / 10n ** 18n) * 10_000n) / 9500n)
  assert.equal(computeNetBondPayout(10_000n, 100n), 9900n)

  // agxPrice = reserveU / reserveAGX
  assert.equal(computeBondPoolAgxPrice(55n * 10n ** 18n, 1n * 10n ** 9n), 55n * 10n ** 9n)
  assert.equal(computeBondPoolAgxPrice(0n, 1n), 0n)

  const usd1 = 1000n * 10n ** 18n
  const half = usd1 / 2n
  const agxOut = 9n * 10n ** 9n
  const reserveU = 55n * 10n ** 18n
  const reserveAGX = 1n * 10n ** 9n
  const supply = 10n ** 18n
  const lp = quoteZapLpAmount({
    usd1Amount: usd1,
    agxOut,
    reserveU,
    reserveAGX,
    totalSupply: supply,
  })
  const lpFromAgx = (agxOut * supply) / reserveAGX
  const lpFromUsd = ((usd1 - half) * supply) / reserveU
  assert.equal(lp, lpFromAgx < lpFromUsd ? lpFromAgx : lpFromUsd)

  // Burn：payout = agxOut * 10000 / discountRateBP
  assert.equal(computeBurnBondGrossPayout(8500n, 8500n), 10_000n)
  assert.equal(computeBurnBondGrossPayout(100n, 0n), 0n)

  // 链上口径：value≈997.45e9、价≈55e9、discount 8500 → ≈21.13 AGX
  const value = 997_450_000_000n
  const poolPrice = computeBondPoolAgxPrice(55n * 10n ** 18n, 1n * 10n ** 9n)
  const lpPayout = computeGrossBondPayout({
    value,
    agxPrice: poolPrice,
    discountRateBP: 8500n,
  })
  assert.equal(lpPayout, (((value * 10n ** 9n) / poolPrice) * 10_000n) / 8500n)
  assert.ok(lpPayout > 21n * 10n ** 9n && lpPayout < 22n * 10n ** 9n)
})
