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

  assert.equal(SWAP_CONFIG.tokens.usdt.enabled, true)
  assert.equal(SWAP_CONFIG.feeTier, 100)
  assert.equal(SWAP_CONFIG.tokens.agx.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.gagx.enabled, false)
  assert.equal(SWAP_CONFIG.tokens.x.enabled, false)
})

test('swap config uses PancakeSwap V3 for trade pair', async () => {
  const { SWAP_CONFIG } = await loadModule('/src/config/swap.ts')
  const { BSC_CONTRACTS } = await loadModule('/src/config/contracts.ts')

  assert.equal(SWAP_CONFIG.router.toLowerCase(), BSC_CONTRACTS.pancakeV3SwapRouter.toLowerCase())
  assert.equal(SWAP_CONFIG.quoter.toLowerCase(), BSC_CONTRACTS.pancakeV3Quoter.toLowerCase())
  assert.equal(SWAP_CONFIG.testPair.tokenA.address.toLowerCase(), BSC_CONTRACTS.usd1Official.toLowerCase())
  assert.equal(SWAP_CONFIG.testPair.tokenB.address.toLowerCase(), BSC_CONTRACTS.usdt.toLowerCase())
})
