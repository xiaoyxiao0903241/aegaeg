import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('swap config exposes USD1-USDT test pair on BSC', async () => {
  const { SWAP_CONFIG } = await loadModule('/src/config/swap.ts')

  assert.equal(SWAP_CONFIG.chainId, 56)
  assert.equal(SWAP_CONFIG.defaultSlippageBps, 50)
  assert.equal(SWAP_CONFIG.deadlineSeconds, 20 * 60)
  assert.equal(SWAP_CONFIG.testPair.tokenA.symbol, 'USD1')
  assert.equal(SWAP_CONFIG.testPair.tokenB.symbol, 'USDT')
  assert.equal(SWAP_CONFIG.testPair.enabled, true)
  assert.deepEqual(SWAP_CONFIG.testPair.symbols, ['USD1', 'USDT'])
})

test('swap config marks design-only tokens as disabled', async () => {
  const { SWAP_CONFIG } = await loadModule('/src/config/swap.ts')

  assert.equal(SWAP_CONFIG.tokens.agx.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.gagx.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.x.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.usdt.enabled, false)
})
