import assert from 'node:assert/strict'
import test from 'node:test'

import { loadModule } from '../load-module.mjs'

test('previewTurbineExpectedAgx applies swapSlippageBP then caps by quota', async () => {
  const { previewTurbineExpectedAgx } = await loadModule(
    '/src/core/exchange/turbine-expected-agx.ts',
  )

  // 100 AGX wei, 3% slippage → 97; quota 100 → 97
  assert.equal(
    previewTurbineExpectedAgx({
      unlockAmountIn: 100n,
      swapSlippageBP: 300n,
      quota: 100n,
    }),
    97n,
  )

  // slippage-reduced exceeds quota → quota wins
  assert.equal(
    previewTurbineExpectedAgx({
      unlockAmountIn: 100n,
      swapSlippageBP: 0n,
      quota: 50n,
    }),
    50n,
  )

  assert.equal(
    previewTurbineExpectedAgx({
      unlockAmountIn: 0n,
      swapSlippageBP: 300n,
      quota: 100n,
    }),
    0n,
  )

  // 非法滑点 → 预览 0（不抛）
  assert.equal(
    previewTurbineExpectedAgx({
      unlockAmountIn: 100n,
      swapSlippageBP: 10_000n,
      quota: 100n,
    }),
    0n,
  )
})
