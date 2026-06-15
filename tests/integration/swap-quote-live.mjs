/**
 * 链上报价集成测试 — 无需钱包，验证 BSC RPC + Router getAmountsOut
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

const oneUsd1 = 10n ** 18n

console.log('Testing USD1 → USDT quote on BSC mainnet (xxToken contract)...')
const quote = await fetchSwapQuote({
  amountIn: oneUsd1,
  tokenIn: BSC_CONTRACTS.usd1,
  tokenOut: BSC_CONTRACTS.xxToken,
})

assert.ok(quote.quotedOut > 0n, 'quotedOut should be positive')
assert.ok(quote.path.length >= 2, 'path should have at least 2 hops')

console.log('✓ USD1 → USDT')
console.log(`  path: ${quote.path.join(' → ')}`)
console.log(`  1 USD1 ≈ ${Number(quote.quotedOut) / 1e18} USDT (raw: ${quote.quotedOut})`)

console.log('Testing USDT → USD1 quote...')
const reverse = await fetchSwapQuote({
  amountIn: quote.quotedOut,
  tokenIn: BSC_CONTRACTS.xxToken,
  tokenOut: BSC_CONTRACTS.usd1,
})

assert.ok(reverse.quotedOut > 0n, 'reverse quotedOut should be positive')
console.log('✓ USDT → USD1')
console.log(`  path: ${reverse.path.join(' → ')}`)
console.log(`  quotedOut: ${reverse.quotedOut}`)

console.log('\nAll live quote checks passed.')
