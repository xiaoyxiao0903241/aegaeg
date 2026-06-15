import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('quoteSwapOut picks path with higher output', async () => {
  const { quoteSwapOut } = await loadModule('/src/lib/swap/quote-swap-out.ts')
  const tokenIn = '0x1111111111111111111111111111111111111111'
  const tokenOut = '0x2222222222222222222222222222222222222222'
  const wbnb = '0x3333333333333333333333333333333333333333'

  const result = await quoteSwapOut({
    amountIn: 100n,
    tokenIn,
    tokenOut,
    wbnb,
    getAmountsOut: async (_amountIn, path) => {
      if (path.length === 2) return [100n, 90n]
      return [100n, 50n, 120n]
    },
  })

  assert.deepEqual(result.path, [tokenIn, wbnb, tokenOut])
  assert.equal(result.quotedOut, 120n)
})

test('resolveSwapAction returns approve when allowance is insufficient', async () => {
  const { resolveSwapAction } = await loadModule('/src/lib/swap/resolve-swap-action.ts')

  assert.equal(resolveSwapAction(50n, 100n), 'approve')
  assert.equal(resolveSwapAction(100n, 100n), 'swap')
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
