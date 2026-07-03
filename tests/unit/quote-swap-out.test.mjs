import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolveSwapAction returns approve when allowance is insufficient', async () => {
  const { resolveSwapAction } = await loadModule('/src/lib/swap/resolve-swap-action.ts')

  assert.equal(resolveSwapAction(50n, 100n), 'approve')
  assert.equal(resolveSwapAction(100n, 100n), 'swap')
})

test('formatSwapRateColon displays colon exchange rate with 4 fraction digits', async () => {
  const { formatSwapRateColon } = await loadModule('/src/lib/swap/format-swap-rate.ts')

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
  const { formatSwapRate } = await loadModule('/src/lib/swap/format-swap-rate.ts')

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
