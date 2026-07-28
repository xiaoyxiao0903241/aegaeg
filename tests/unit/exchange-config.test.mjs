import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

test('swap config exposes USD1-USDT trade pair on BSC', async () => {
  const { EXCHANGE_CONFIG } = await loadModule('/src/shared/config/exchange.ts')

  assert.equal(EXCHANGE_CONFIG.chainId, 56)
  assert.equal(EXCHANGE_CONFIG.defaultSlippageBps, 50)
  assert.equal(EXCHANGE_CONFIG.deadlineSeconds, 20 * 60)
  assert.equal(EXCHANGE_CONFIG.tradePair.tokenA.symbol, 'USD1')
  assert.equal(EXCHANGE_CONFIG.tradePair.tokenB.symbol, 'USDT')
  assert.equal(EXCHANGE_CONFIG.tradePair.enabled, true)
  assert.deepEqual(EXCHANGE_CONFIG.tradePair.symbols, ['USD1', 'USDT'])
})

test('swap config marks design-only tokens as disabled', async () => {
  const { EXCHANGE_CONFIG } = await loadModule('/src/shared/config/exchange.ts')

  assert.equal(EXCHANGE_CONFIG.tokens.usdt.enabled, true)
  assert.equal(EXCHANGE_CONFIG.feeTier, 100)
  assert.equal(EXCHANGE_CONFIG.tokens.agx.enabled, false)
  assert.equal(EXCHANGE_CONFIG.tokens.gagx.enabled, false)
  assert.equal(EXCHANGE_CONFIG.tokens.x.enabled, false)
})

test('swap config defaultSlippageBps maps to UI percent for Trade init', async () => {
  const { EXCHANGE_CONFIG } = await loadModule('/src/shared/config/exchange.ts')
  const { clampSlippagePercent } = await loadModule('/src/core/exchange/token-amount.ts')

  assert.equal(clampSlippagePercent(EXCHANGE_CONFIG.defaultSlippageBps / 100), 0.5)
})
