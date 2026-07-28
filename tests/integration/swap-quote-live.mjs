/**
 * 链上报价集成测试 — Pancake V2 Router getAmountsOut on BSC (USD1↔AGX)
 * 运行: node tests/integration/swap-quote-live.mjs
 */
import assert from 'node:assert/strict'
import { loadModule } from '../unit/load-module.mjs'

const { fetchExchangeQuote, readExchangePoolImmutableMetadata, readExchangePoolSpotPrice } =
  await loadModule('/src/web3/exchange/exchange-read.ts')
const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

const pool = await readExchangePoolImmutableMetadata()
assert.equal(pool.token0.toLowerCase(), BSC_CONTRACTS.usd1.toLowerCase())
assert.equal(pool.token1.toLowerCase(), BSC_CONTRACTS.agx.toLowerCase())

const spot = await readExchangePoolSpotPrice()
assert.ok(spot.reserve0 > 0n, 'reserve0 should be positive')
assert.ok(spot.reserve1 > 0n, 'reserve1 should be positive')

const oneUsd1 = 10n ** 18n

console.log('Testing USD1 → AGX quote on BSC (Pancake V2)...')
const quote = await fetchExchangeQuote({
  amountIn: oneUsd1,
  tokenIn: BSC_CONTRACTS.usd1,
  tokenOut: BSC_CONTRACTS.agx,
})

assert.ok(quote.quotedOut > 0n, 'quotedOut should be positive')
assert.ok(Number.isFinite(quote.priceImpactBps), 'priceImpactBps should be finite')

console.log('✓ USD1 → AGX')
console.log(`  1 USD1 ≈ ${Number(quote.quotedOut) / 1e9} AGX (raw: ${quote.quotedOut})`)
console.log(`  price impact: ${quote.priceImpactBps} bps`)

console.log('Testing AGX → USD1 quote...')
const oneAgx = 10n ** 9n
const reverse = await fetchExchangeQuote({
  amountIn: oneAgx,
  tokenIn: BSC_CONTRACTS.agx,
  tokenOut: BSC_CONTRACTS.usd1,
})

assert.ok(reverse.quotedOut > 0n, 'reverse quotedOut should be positive')
console.log('✓ AGX → USD1')
console.log(`  1 AGX ≈ ${Number(reverse.quotedOut) / 1e18} USD1 (raw: ${reverse.quotedOut})`)

console.log('\nAll live V2 quote checks passed.')
