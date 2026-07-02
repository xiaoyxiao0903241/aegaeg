import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('calcAmountOutMin applies slippage in basis points', async () => {
  const { calcAmountOutMin } = await loadModule('/src/lib/swap/calc-amount-out-min.ts')

  assert.equal(calcAmountOutMin(10_000n, 50), 9_950n)
  assert.equal(calcAmountOutMin(100_000_000_000_000_000_000n, 100), 99_000_000_000_000_000_000n)
})

test('calcAmountOutMin rejects invalid slippage', async () => {
  const { calcAmountOutMin } = await loadModule('/src/lib/swap/calc-amount-out-min.ts')

  assert.throws(() => calcAmountOutMin(100n, -1), /slippage/i)
  assert.throws(() => calcAmountOutMin(100n, 10_000), /slippage/i)
})

test('buildSwapPaths returns direct and WBNB routes', async () => {
  const { buildSwapPaths } = await loadModule('/src/lib/swap/build-swap-paths.ts')
  const tokenIn = '0x1111111111111111111111111111111111111111'
  const tokenOut = '0x2222222222222222222222222222222222222222'
  const wbnb = '0x3333333333333333333333333333333333333333'

  assert.deepEqual(buildSwapPaths(tokenIn, tokenOut, wbnb), [
    [tokenIn, tokenOut],
    [tokenIn, wbnb, tokenOut],
  ])
})

test('selectBestPath prefers higher quoted output', async () => {
  const { selectBestPath } = await loadModule('/src/lib/swap/select-best-path.ts')
  const direct = ['0xaaa', '0xbbb']
  const viaWbnb = ['0xaaa', '0xwbnb', '0xbbb']

  assert.deepEqual(
    selectBestPath([
      { path: direct, quotedOut: 100n },
      { path: viaWbnb, quotedOut: 120n },
    ]),
    viaWbnb,
  )
  assert.deepEqual(
    selectBestPath([
      { path: direct, quotedOut: 150n },
      { path: viaWbnb, quotedOut: 120n },
    ]),
    direct,
  )
})

test('buildSwapDeadline returns unix seconds in the future', async () => {
  const { buildSwapDeadline } = await loadModule('/src/lib/swap/build-swap-deadline.ts')
  const now = 1_700_000_000
  assert.equal(buildSwapDeadline(20 * 60, now), 1_700_001_200)
})
