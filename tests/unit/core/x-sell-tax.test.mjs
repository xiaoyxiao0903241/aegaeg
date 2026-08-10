import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('isXSellPath is case-insensitive', async () => {
  const { isXSellPath } = await loadModule('/src/core/exchange/x-sell-tax.ts')
  const x = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  assert.equal(isXSellPath(x, x), true)
  assert.equal(isXSellPath(x.toUpperCase(), x), true)
  assert.equal(isXSellPath('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', x), false)
})

test('applyXSellTaxToAmountIn subtracts fixed 25% sell tax', async () => {
  const { applyXSellTaxToAmountIn, X_SELL_TAX_BP } = await loadModule(
    '/src/core/exchange/x-sell-tax.ts',
  )
  assert.equal(X_SELL_TAX_BP, 2500)
  const oneX = 10n ** 18n
  assert.equal(applyXSellTaxToAmountIn(oneX), (oneX * 7500n) / 10_000n)
  assert.equal(applyXSellTaxToAmountIn(0n), 0n)
})

test('requiresFeeOnTransferSwap covers AGX and X sells', async () => {
  const { requiresFeeOnTransferSwap } = await loadModule(
    '/src/core/exchange/fee-on-transfer-swap.ts',
  )
  const agx = '0x1111111111111111111111111111111111111111'
  const x = '0x2222222222222222222222222222222222222222'
  const usd1 = '0x3333333333333333333333333333333333333333'
  assert.equal(requiresFeeOnTransferSwap(agx, { agx, x }), true)
  assert.equal(requiresFeeOnTransferSwap(x, { agx, x }), true)
  assert.equal(requiresFeeOnTransferSwap(usd1, { agx, x }), false)
})
