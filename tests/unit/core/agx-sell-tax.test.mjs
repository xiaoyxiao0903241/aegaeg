import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

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

test('effectiveAgxSellTaxBps uses extraSellBP when block sell limit exceeded', async () => {
  const { effectiveAgxSellTaxBps } = await loadModule('/src/core/exchange/agx-sell-tax.ts')
  const base = {
    crashFuseActive: false,
    sellRatio: 350n,
    extraSellBP: 3000n,
    blockSellQuotaBlock: 100n,
    currentBlock: 100n,
  }
  assert.equal(
    effectiveAgxSellTaxBps({
      ...base,
      amountIn: 100n,
      blockSellLimit: 150n,
      grossSoldInBlock: 60n,
    }),
    3000,
  )
  assert.equal(
    effectiveAgxSellTaxBps({
      ...base,
      amountIn: 100n,
      blockSellLimit: 150n,
      grossSoldInBlock: 40n,
    }),
    350,
  )
  assert.equal(
    effectiveAgxSellTaxBps({
      ...base,
      amountIn: 100n,
      blockSellLimit: 0n,
      grossSoldInBlock: 0n,
    }),
    3000,
  )
})

test('effectiveAgxSellTaxBps treats stale quota block as new-block first sell (gross reset)', async () => {
  const { effectiveAgxSellTaxBps } = await loadModule('/src/core/exchange/agx-sell-tax.ts')
  // 观测块 ≠ 当前块 → 视同新块首笔，gross 归零；未超额度时走 sellRatio/fuse，不因陈旧块强制 extra
  assert.equal(
    effectiveAgxSellTaxBps({
      crashFuseActive: false,
      sellRatio: 350n,
      extraSellBP: 3000n,
      amountIn: 100n,
      blockSellLimit: 10_000n,
      grossSoldInBlock: 9_950n,
      blockSellQuotaBlock: 99n,
      currentBlock: 100n,
    }),
    350,
  )
  assert.equal(
    effectiveAgxSellTaxBps({
      crashFuseActive: true,
      sellRatio: 350n,
      extraSellBP: 3000n,
      amountIn: 100n,
      blockSellLimit: 10_000n,
      grossSoldInBlock: 0n,
      blockSellQuotaBlock: 99n,
      currentBlock: 100n,
    }),
    3000,
  )
  assert.equal(
    effectiveAgxSellTaxBps({
      crashFuseActive: false,
      sellRatio: 350n,
      extraSellBP: 3000n,
      amountIn: 100n,
      blockSellLimit: 50n,
      grossSoldInBlock: 9_950n,
      blockSellQuotaBlock: 99n,
      currentBlock: 100n,
    }),
    3000,
  )
})
