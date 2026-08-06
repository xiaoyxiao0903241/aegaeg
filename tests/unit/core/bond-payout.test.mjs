import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('computeGrossBondPayout follows handbook value*1e9*10000/agxPrice/discount', async () => {
  const {
    computeGrossBondPayout,
    computeNetBondPayout,
    quoteV2LpMintAmount,
    applyPercentSlippage,
  } = await loadModule('/src/core/staking/bond-payout.ts')

  const gross = computeGrossBondPayout({
    value: 1_000_000_000n, // 1 unit @ 9 dec backing
    agxPrice: 10n ** 18n, // $1
    discountRateBP: 9500n, // 5% off
  })
  assert.equal(gross, (((1_000_000_000n * 1_000_000_000n) / 10n ** 18n) * 10_000n) / 9500n)

  assert.equal(computeNetBondPayout(10_000n, 100n), 9900n)
  assert.equal(applyPercentSlippage(1000n, 3n), 970n)
  assert.equal(
    quoteV2LpMintAmount({
      amountA: 100n,
      amountB: 200n,
      reserveA: 1000n,
      reserveB: 2000n,
      totalSupply: 10_000n,
    }),
    1000n,
  )
})
