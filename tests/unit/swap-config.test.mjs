import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('swap config exposes USD1-USDT trade pair on BSC', async () => {
  const { SWAP_CONFIG } = await loadModule('/src/shared/config/swap.ts')

  assert.equal(SWAP_CONFIG.chainId, 56)
  assert.equal(SWAP_CONFIG.defaultSlippageBps, 50)
  assert.equal(SWAP_CONFIG.deadlineSeconds, 20 * 60)
  assert.equal(SWAP_CONFIG.tradePair.tokenA.symbol, 'USD1')
  assert.equal(SWAP_CONFIG.tradePair.tokenB.symbol, 'USDT')
  assert.equal(SWAP_CONFIG.tradePair.enabled, true)
  assert.deepEqual(SWAP_CONFIG.tradePair.symbols, ['USD1', 'USDT'])
})

test('swap config marks design-only tokens as disabled', async () => {
  const { SWAP_CONFIG } = await loadModule('/src/shared/config/swap.ts')

  assert.equal(SWAP_CONFIG.tokens.usdt.enabled, true)
  assert.equal(SWAP_CONFIG.feeTier, 100)
  assert.equal(SWAP_CONFIG.tokens.agx.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.gagx.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.x.enabled, false)
})

test('swap config defaultSlippageBps maps to UI percent for Trade init', async () => {
  const { SWAP_CONFIG } = await loadModule('/src/shared/config/swap.ts')
  const { clampSlippagePercent } = await loadModule('/src/core/swap/token-amount.ts')

  assert.equal(clampSlippagePercent(SWAP_CONFIG.defaultSlippageBps / 100), 0.5)
})
