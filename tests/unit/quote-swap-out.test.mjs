import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('needsTokenApproval is true when allowance is below amountIn', async () => {
  const { needsTokenApproval } = await loadModule('/src/web3/swap/swap-write.ts')

  assert.equal(needsTokenApproval(50n, 100n), true)
  assert.equal(needsTokenApproval(100n, 100n), false)
  assert.equal(needsTokenApproval(101n, 100n), false)
})

test('formatSwapRateColon displays colon exchange rate with 4 fraction digits', async () => {
  const { formatSwapRateColon } = await loadModule('/src/views/dapp/swap/swap-format-rate.ts')

  assert.equal(
    formatSwapRateColon({
      amountIn: 10n ** 18n,
      amountOut: 1001n * 10n ** 15n,
      decimalsIn: 18,
      decimalsOut: 18,
    }),
    '1 : 1.0010',
  )
})

test('formatSwapRate displays exchange rate between tokens', async () => {
  const { formatSwapRate } = await loadModule('/src/views/dapp/swap/swap-format-rate.ts')

  assert.equal(
    formatSwapRate({
      amountIn: 10n ** 18n,
      amountOut: 2n * 10n ** 17n,
      decimalsIn: 18,
      decimalsOut: 18,
      symbolIn: 'USD1',
      symbolOut: 'USDT',
    }),
    '1 USD1 = 0.2 USDT',
  )
})
