import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('agxSellTaxBps uses sellRatio when fuse off', async () => {
  const { agxSellTaxBps } = await loadModule('/src/core/exchange/agx-sell-tax.ts')
  assert.equal(agxSellTaxBps({ crashFuseActive: false, sellRatio: 350n, extraSellBP: 3000n }), 350)
})

test('agxSellTaxBps uses extraSellBP when fuse on', async () => {
  const { agxSellTaxBps } = await loadModule('/src/core/exchange/agx-sell-tax.ts')
  assert.equal(agxSellTaxBps({ crashFuseActive: true, sellRatio: 350n, extraSellBP: 3000n }), 3000)
})

test('applyAgxSellTaxToAmountIn subtracts tax from gross', async () => {
  const { applyAgxSellTaxToAmountIn } = await loadModule('/src/core/exchange/agx-sell-tax.ts')
  const oneAgx = 10n ** 9n
  assert.equal(applyAgxSellTaxToAmountIn(oneAgx, 0), oneAgx)
  assert.equal(applyAgxSellTaxToAmountIn(oneAgx, 350), (oneAgx * 9650n) / 10_000n)
  assert.equal(applyAgxSellTaxToAmountIn(oneAgx, 3000), (oneAgx * 7000n) / 10_000n)
})

test('isAgxSellPath is case-insensitive', async () => {
  const { isAgxSellPath } = await loadModule('/src/core/exchange/agx-sell-tax.ts')
  const agx = '0x8d0771495272bB97Cd1cD44795222c8fB1b53247'
  assert.equal(isAgxSellPath(agx, agx), true)
  assert.equal(isAgxSellPath(agx.toLowerCase(), agx), true)
  assert.equal(isAgxSellPath('0x32Bb0be09F62bbE69764906d80e9A5782C7F7633', agx), false)
})
