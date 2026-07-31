import assert from 'node:assert/strict'
import test from 'node:test'
import {
  applyAgxSellTaxToAmountIn,
  isAgxSellPath,
  agxSellTaxBps,
} from '../../src/core/exchange/agx-sell-tax.ts'

test('agxSellTaxBps uses sellRatio when fuse off', () => {
  assert.equal(agxSellTaxBps({ crashFuseActive: false, sellRatio: 350n, extraSellBP: 3000n }), 350)
})

test('agxSellTaxBps uses extraSellBP when fuse on', () => {
  assert.equal(agxSellTaxBps({ crashFuseActive: true, sellRatio: 350n, extraSellBP: 3000n }), 3000)
})

test('applyAgxSellTaxToAmountIn subtracts tax from gross', () => {
  const oneAgx = 10n ** 9n
  assert.equal(applyAgxSellTaxToAmountIn(oneAgx, 0), oneAgx)
  assert.equal(applyAgxSellTaxToAmountIn(oneAgx, 350), (oneAgx * 9650n) / 10_000n)
  assert.equal(applyAgxSellTaxToAmountIn(oneAgx, 3000), (oneAgx * 7000n) / 10_000n)
})

test('isAgxSellPath is case-insensitive', () => {
  const agx = '0x8d0771495272bB97Cd1cD44795222c8fB1b53247'
  assert.equal(isAgxSellPath(agx, agx), true)
  assert.equal(isAgxSellPath(agx.toLowerCase(), agx), true)
  assert.equal(isAgxSellPath('0x32Bb0be09F62bbE69764906d80e9A5782C7F7633', agx), false)
})
