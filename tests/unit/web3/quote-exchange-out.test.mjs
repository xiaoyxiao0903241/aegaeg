import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('needsTokenApproval is true when allowance is below amountIn', async () => {
  const { needsTokenApproval } = await loadModule('/src/web3/exchange/exchange-write.ts')

  assert.equal(needsTokenApproval(50n, 100n), true)
  assert.equal(needsTokenApproval(100n, 100n), false)
  assert.equal(needsTokenApproval(101n, 100n), false)
})

test('formatExchangeRateColon displays colon exchange rate and trims trailing zeros', async () => {
  const { formatExchangeRateColon } = await loadModule('/src/views/dapp/exchange/shared.ts')

  assert.equal(
    formatExchangeRateColon({
      amountIn: 10n ** 18n,
      amountOut: 1001n * 10n ** 15n,
      decimalsIn: 18,
      decimalsOut: 18,
    }),
    '1 : 1.001',
  )

  assert.equal(
    formatExchangeRateColon({
      amountIn: 10n ** 18n,
      amountOut: 10n ** 18n,
      decimalsIn: 18,
      decimalsOut: 18,
    }),
    '1 : 1',
  )
})
