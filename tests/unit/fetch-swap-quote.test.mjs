import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const POOL = '0x9c4ee895e4f6ce07ada631c508d1306db7502cce'
const QUOTER = '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997'
const TOKEN_IN = '0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d'
const TOKEN_OUT = '0x55d398326f99059fF775485246999027B3197955'

function createMockClient({ fee = 100, sqrtBefore = 1_000_000n, quote } = {}) {
  const calls = []
  return {
    calls,
    async readContract(request) {
      calls.push(['read', request.functionName, request.address])
      if (request.functionName === 'fee') return fee
      if (request.functionName === 'token0') return TOKEN_IN
      if (request.functionName === 'token1') return TOKEN_OUT
      if (request.functionName === 'slot0') return [sqrtBefore, 0, 0, 1, 1, 0, true]
      throw new Error(`unexpected readContract ${request.functionName}`)
    },
    async simulateContract(request) {
      calls.push(['simulate', request.functionName, request.address])
      if (request.functionName !== 'quoteExactInputSingle') {
        throw new Error(`unexpected simulate ${request.functionName}`)
      }
      const amountIn = request.args[0].amountIn
      if (quote) return { result: quote(amountIn, request.args[0]) }
      return {
        result: [amountIn / 2n, sqrtBefore + 1_000n, 1n, 120_000n],
      }
    },
  }
}

test('fetchSwapQuote wires pool fee, quoter out, and price impact bps', async () => {
  const { fetchSwapQuote } = await loadModule('/src/web3/swap/swap-read.ts')
  const { clearSwapPoolImmutableCache } = await loadModule('/src/web3/swap/read-swap-pool.ts')
  clearSwapPoolImmutableCache()

  const client = createMockClient({
    fee: 100,
    sqrtBefore: 1_000_000n,
    quote: (amountIn) => [amountIn / 2n, 1_010_000n, 2n, 90_000n],
  })

  const result = await fetchSwapQuote({
    amountIn: 10n ** 18n,
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    client,
  })

  assert.equal(result.quotedOut, 5n * 10n ** 17n)
  assert.equal(result.fee, 100)
  assert.equal(result.tokenIn, TOKEN_IN)
  assert.equal(result.tokenOut, TOKEN_OUT)
  // √P 1e6→1.01e6 ⇒ true price impact ≈201 bps (not 100 sqrt-bps)
  assert.equal(result.priceImpactBps, 201)
  assert.equal(result.gasEstimate, 90_000n)
  assert.ok(client.calls.some((c) => c[0] === 'simulate' && c[2].toLowerCase() === QUOTER.toLowerCase()))
  assert.ok(client.calls.some((c) => c[0] === 'read' && c[2].toLowerCase() === POOL.toLowerCase()))
})

test('quoteV3ExactInputSingle returns zeros for zero amountIn without RPC', async () => {
  const { quoteV3ExactInputSingle } = await loadModule('/src/web3/swap/quote-v3-exact-input.ts')
  const client = createMockClient()

  const result = await quoteV3ExactInputSingle({
    quoter: QUOTER,
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    amountIn: 0n,
    fee: 100,
    client,
  })

  assert.deepEqual(result, {
    amountOut: 0n,
    sqrtPriceX96After: 0n,
    initializedTicksCrossed: 0,
    gasEstimate: 0n,
  })
  assert.equal(client.calls.length, 0)
})
