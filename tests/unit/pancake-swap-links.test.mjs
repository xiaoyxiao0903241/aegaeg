import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolvePancakeSwapDeepLink maps USDT and USD1 directions', async () => {
  const { PANCAKE_SWAP_DEEP_LINKS, resolvePancakeSwapDeepLink } = await loadModule(
    '/src/config/pancake-swap-links.ts',
  )

  assert.equal(resolvePancakeSwapDeepLink('USDT', 'USD1'), PANCAKE_SWAP_DEEP_LINKS.usdtToUsd1)
  assert.equal(resolvePancakeSwapDeepLink('USD1', 'USDT'), PANCAKE_SWAP_DEEP_LINKS.usd1ToUsdt)
})

test('formatSwapRateApprox displays connected swap meta rate', async () => {
  const { formatSwapRateApprox } = await loadModule('/src/lib/swap/format-swap-rate.ts')

  assert.equal(
    formatSwapRateApprox({
      amountIn: 10n ** 18n,
      amountOut: 1001n * 10n ** 15n,
      decimalsIn: 18,
      decimalsOut: 18,
      symbolIn: 'USDT',
      symbolOut: 'USD1',
    }),
    '1 USDT ≈ 1.001 USD1',
  )
})
