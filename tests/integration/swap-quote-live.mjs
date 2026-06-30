/**
 * 链上报价集成测试 — PancakeSwap V3 QuoterV2 on BSC
 * 运行: node tests/integration/swap-quote-live.mjs
 */
import assert from 'node:assert/strict'
import { createServer } from 'vite'

async function loadModule(specifier) {
  const server = await createServer({
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { hmr: false, middlewareMode: true },
  })
  try {
    return await server.ssrLoadModule(specifier)
  } finally {
    await server.close()
  }
}

const { fetchSwapQuote } = await loadModule('/src/web3/swap-read.ts')
const { BSC_CONTRACTS } = await loadModule('/src/config/contracts.ts')

const oneUnit = 10n ** 18n

console.log('Testing USD1 → USDT quote on BSC (PancakeSwap V3)...')
const quote = await fetchSwapQuote({
  amountIn: oneUnit,
  tokenIn: BSC_CONTRACTS.usd1Official,
  tokenOut: BSC_CONTRACTS.usdt,
})

assert.ok(quote.quotedOut > 0n, 'quotedOut should be positive')
assert.equal(quote.fee, 100)

console.log('✓ USD1 → USDT')
console.log(`  1 USD1 ≈ ${Number(quote.quotedOut) / 1e18} USDT (raw: ${quote.quotedOut})`)

console.log('Testing USDT → USD1 quote...')
const reverse = await fetchSwapQuote({
  amountIn: oneUnit,
  tokenIn: BSC_CONTRACTS.usdt,
  tokenOut: BSC_CONTRACTS.usd1Official,
})

assert.ok(reverse.quotedOut > 0n, 'reverse quotedOut should be positive')
console.log('✓ USDT → USD1')
console.log(`  1 USDT ≈ ${Number(reverse.quotedOut) / 1e18} USD1 (raw: ${reverse.quotedOut})`)

console.log('\nAll live V3 quote checks passed.')
