import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('pancakeSwapDeepLink builds from token addresses', async () => {
  const { pancakeSwapDeepLink } = await loadModule('/src/shared/config/pancake-exchange-links.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

  assert.match(
    pancakeSwapDeepLink(BSC_CONTRACTS.usd1, BSC_CONTRACTS.agx),
    new RegExp(BSC_CONTRACTS.usd1, 'i'),
  )
  assert.match(
    pancakeSwapDeepLink(BSC_CONTRACTS.agx, BSC_CONTRACTS.usd1),
    new RegExp(BSC_CONTRACTS.agx, 'i'),
  )
  assert.match(
    pancakeSwapDeepLink(BSC_CONTRACTS.xToken, BSC_CONTRACTS.agx),
    new RegExp(BSC_CONTRACTS.xToken, 'i'),
  )
})

test('formatExchangeRateApprox displays connected swap meta rate', async () => {
  const { formatExchangeRateApprox } = await loadModule('/src/views/dapp/exchange/shared.ts')

  assert.equal(
    formatExchangeRateApprox({
      amountIn: 10n ** 18n,
      amountOut: 1001n * 10n ** 15n,
      decimalsIn: 18,
      decimalsOut: 18,
      symbolIn: 'USD1',
      symbolOut: 'AGX',
    }),
    '1 USD1 = 1.001 AGX',
  )
})

test('formatExchangeRateApprox empty amounts keeps rate chrome with zero', async () => {
  const { formatExchangeRateApprox } = await loadModule('/src/views/dapp/exchange/shared.ts')

  assert.equal(
    formatExchangeRateApprox({
      amountIn: 0n,
      amountOut: 0n,
      decimalsIn: 18,
      decimalsOut: 18,
      symbolIn: 'USD1',
      symbolOut: 'AGX',
    }),
    '1 USD1 = 0.000 AGX',
  )
})
