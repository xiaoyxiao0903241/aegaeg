import assert from 'node:assert/strict'
import test from 'node:test'
import { loadModule } from './load-module.mjs'

const PAIR = '0xaC645E2137eB011f612b01942D21De6Be959E266'
const ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const TOKEN_IN = '0x32Bb0be09F62bbE69764906d80e9A5782C7F7633'
const TOKEN_OUT = '0x8d0771495272bB97Cd1cD44795222c8fB1b53247'

function createMockClient({ reserve0 = 10n ** 24n, reserve1 = 10n ** 15n, quotedOut } = {}) {
  const calls = []
  return {
    calls,
    async readContract(request) {
      calls.push(['read', request.functionName, request.address])
      if (request.functionName === 'token0') return TOKEN_IN
      if (request.functionName === 'token1') return TOKEN_OUT
      if (request.functionName === 'getReserves') return [reserve0, reserve1, 0]
      if (request.functionName === 'getAmountsOut') {
        const amountIn = request.args[0]
        const out = quotedOut ?? amountIn / 2n
        return [amountIn, out]
      }
      throw new Error(`unexpected readContract ${request.functionName}`)
    },
  }
}

test('fetchExchangeQuote wires V2 getAmountsOut and reserve price impact', async () => {
  const { fetchExchangeQuote } = await loadModule('/src/web3/exchange/exchange-read.ts')
  const { clearExchangePoolImmutableCache } = await loadModule(
    '/src/web3/exchange/read-exchange-pool.ts',
  )
  clearExchangePoolImmutableCache()

  const amountIn = 10n ** 18n
  const quotedOut = 5n * 10n ** 8n
  const client = createMockClient({
    reserve0: 10n ** 24n,
    reserve1: 10n ** 15n,
    quotedOut,
  })

  const result = await fetchExchangeQuote({
    amountIn,
    tokenIn: TOKEN_IN,
    tokenOut: TOKEN_OUT,
    client,
  })

  assert.equal(result.quotedOut, quotedOut)
  assert.equal(result.tokenIn, TOKEN_IN)
  assert.equal(result.tokenOut, TOKEN_OUT)
  assert.equal(result.gasEstimate, 0n)
  assert.ok(result.priceImpactBps > 0)
  assert.ok(client.calls.some((c) => c[0] === 'read' && c[1] === 'getAmountsOut'))
  assert.ok(client.calls.some((c) => c[0] === 'read' && c[2].toLowerCase() === PAIR.toLowerCase()))
  assert.ok(
    client.calls.some((c) => c[0] === 'read' && c[2].toLowerCase() === ROUTER.toLowerCase()),
  )
})

test('quoteV2AmountsOut returns zero for zero amountIn without RPC', async () => {
  const { quoteV2AmountsOut } = await loadModule('/src/web3/exchange/quote-v2-amounts-out.ts')
  const client = createMockClient()

  const result = await quoteV2AmountsOut({
    router: ROUTER,
    amountIn: 0n,
    path: [TOKEN_IN, TOKEN_OUT],
    client,
  })

  assert.equal(result, 0n)
  assert.equal(client.calls.length, 0)
})
