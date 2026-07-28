import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('resolvePancakeSwapDeepLink maps USD1 and AGX directions', async () => {
  const { PANCAKE_SWAP_DEEP_LINKS, resolvePancakeSwapDeepLink } = await loadModule(
    '/src/shared/config/pancake-exchange-links.ts',
  )

  assert.equal(resolvePancakeSwapDeepLink('USD1', 'AGX'), PANCAKE_SWAP_DEEP_LINKS.usd1ToAgx)
  assert.equal(resolvePancakeSwapDeepLink('AGX', 'USD1'), PANCAKE_SWAP_DEEP_LINKS.agxToUsd1)
})

test('formatExchangeRateApprox displays connected swap meta rate', async () => {
  const { formatExchangeRateApprox } = await loadModule(
    '/src/views/dapp/exchange/exchange-format-rate.ts',
  )

  assert.equal(
    formatExchangeRateApprox({
      amountIn: 10n ** 18n,
      amountOut: 1001n * 10n ** 15n,
      decimalsIn: 18,
      decimalsOut: 18,
      symbolIn: 'USD1',
      symbolOut: 'AGX',
    }),
    '1 USD1 ≈ 1.001 AGX',
  )
})
