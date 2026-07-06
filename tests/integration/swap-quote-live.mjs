/**
 * 链上报价集成测试 — PancakeSwap V3 QuoterV2 on BSC
 * 运行: node tests/integration/swap-quote-live.mjs
 */
import assert from 'node:assert/strict'
import { loadModule } from '../unit/load-module.mjs'

const { fetchSwapQuote, readSwapPoolImmutableMetadata, readSwapPoolSpotPrice } =
  await loadModule('/src/views/dapp/web3/swap-read.ts')
const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')

const pool = await readSwapPoolImmutableMetadata()
assert.equal(pool.fee, 100)
assert.equal(pool.token0.toLowerCase(), BSC_CONTRACTS.usdt.toLowerCase())
assert.equal(pool.token1.toLowerCase(), BSC_CONTRACTS.usd1.toLowerCase())

const spot = await readSwapPoolSpotPrice()
assert.ok(spot.sqrtPriceX96 > 0n, 'pool sqrtPriceX96 should be positive')

const oneUnit = 10n ** 18n

console.log('Testing USD1 → USDT quote on BSC (PancakeSwap V3)...')
const quote = await fetchSwapQuote({
  amountIn: oneUnit,
  tokenIn: BSC_CONTRACTS.usd1,
  tokenOut: BSC_CONTRACTS.usdt,
})

assert.ok(quote.quotedOut > 0n, 'quotedOut should be positive')
assert.equal(quote.fee, 100)
assert.ok(quote.gasEstimate > 0n, 'gasEstimate should be positive')
assert.ok(quote.sqrtPriceX96After > 0n, 'sqrtPriceX96After should be positive')
assert.ok(Number.isFinite(quote.priceImpactBps), 'priceImpactBps should be finite')

console.log('✓ USD1 → USDT')
console.log(`  1 USD1 ≈ ${Number(quote.quotedOut) / 1e18} USDT (raw: ${quote.quotedOut})`)
console.log(`  price impact: ${quote.priceImpactBps} bps, gas: ${quote.gasEstimate}`)

console.log('Testing USDT → USD1 quote...')
const reverse = await fetchSwapQuote({
  amountIn: oneUnit,
  tokenIn: BSC_CONTRACTS.usdt,
  tokenOut: BSC_CONTRACTS.usd1,
})

assert.ok(reverse.quotedOut > 0n, 'reverse quotedOut should be positive')
console.log('✓ USDT → USD1')
console.log(`  1 USDT ≈ ${Number(reverse.quotedOut) / 1e18} USD1 (raw: ${reverse.quotedOut})`)

console.log('\nAll live V3 quote checks passed.')
