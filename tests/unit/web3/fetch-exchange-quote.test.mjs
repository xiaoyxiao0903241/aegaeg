import assert from 'node:assert/strict'
import test from 'node:test'

import { decodeFunctionData, encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'

const agxSellTaxAbi = parseAbi([
  'function sellRatio() view returns (uint256)',
  'function extraSellBP() view returns (uint256)',
  'function crashFuseActive() view returns (bool)',
  'function blockSellQuotaBlock() view returns (uint256)',
  'function blockSellLimit() view returns (uint256)',
  'function grossSoldInBlock() view returns (uint256)',
])

async function loadExchangeAddresses() {
  const { BSC_CONTRACTS } = await loadModule('/src/shared/config/contracts.ts')
  const { EXCHANGE_CONFIG } = await loadModule('/src/shared/config/exchange.ts')
  return {
    agx: BSC_CONTRACTS.agx,
    usd1: BSC_CONTRACTS.usd1,
    x: BSC_CONTRACTS.xToken,
    pool: EXCHANGE_CONFIG.pool,
    router: EXCHANGE_CONFIG.router,
  }
}

function createMockClient({
  tokenIn,
  tokenOut,
  reserve0 = 10n ** 24n,
  reserve1 = 10n ** 15n,
  quotedOut,
}) {
  const calls = []
  return {
    calls,
    async readContract(request) {
      calls.push(['read', request.functionName, request.address])
      if (request.functionName === 'token0') return tokenIn
      if (request.functionName === 'token1') return tokenOut
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

function encodeTaxResult(functionName, value) {
  return encodeFunctionResult({
    abi: agxSellTaxAbi,
    functionName,
    result: value,
  })
}

function createAgxSellClient({ tokenIn, tokenOut, taxValues }) {
  return {
    calls: [],
    getAmountsOutArg: null,
    async getBlockNumber() {
      return 100n
    },
    async readContract(request) {
      this.calls.push(['read', request.functionName, request.address])
      if (request.functionName === 'token0') return tokenIn
      if (request.functionName === 'token1') return tokenOut
      if (request.functionName === 'getReserves') return [10n ** 24n, 10n ** 15n, 0]
      if (request.functionName === 'aggregate3') {
        return request.args[0].map((call) => {
          const { functionName } = decodeFunctionData({
            abi: agxSellTaxAbi,
            data: call.callData,
          })
          const value = taxValues[functionName]
          if (value === undefined) throw new Error(`unexpected aggregate3 ${functionName}`)
          return { success: true, returnData: encodeTaxResult(functionName, value) }
        })
      }
      if (request.functionName === 'getAmountsOut') {
        this.getAmountsOutArg = request.args[0]
        return [this.getAmountsOutArg, this.getAmountsOutArg / 2n]
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
  const { agx, usd1, pool, router } = await loadExchangeAddresses()
  clearExchangePoolImmutableCache()

  const amountIn = 10n ** 18n
  const quotedOut = 5n * 10n ** 8n
  const client = createMockClient({
    tokenIn: usd1,
    tokenOut: agx,
    reserve0: 10n ** 24n,
    reserve1: 10n ** 15n,
    quotedOut,
  })

  const result = await fetchExchangeQuote({
    amountIn,
    tokenIn: usd1,
    tokenOut: agx,
    client,
  })

  assert.equal(result.quotedOut, quotedOut)
  assert.equal(result.tokenIn, usd1)
  assert.equal(result.tokenOut, agx)
  assert.equal(result.gasEstimate, 0n)
  assert.ok(result.priceImpactBps > 0)
  assert.ok(client.calls.some((c) => c[0] === 'read' && c[1] === 'getAmountsOut'))
  assert.ok(client.calls.some((c) => c[0] === 'read' && c[2].toLowerCase() === pool.toLowerCase()))
  assert.ok(
    client.calls.some((c) => c[0] === 'read' && c[2].toLowerCase() === router.toLowerCase()),
  )
})

test('fetchExchangeQuote AGX to USD1 uses post-tax amountIn for getAmountsOut', async () => {
  const { fetchExchangeQuote } = await loadModule('/src/web3/exchange/exchange-read.ts')
  const { clearExchangePoolImmutableCache } = await loadModule(
    '/src/web3/exchange/read-exchange-pool.ts',
  )
  const { agx, usd1 } = await loadExchangeAddresses()
  clearExchangePoolImmutableCache()

  const amountIn = 10n ** 9n
  const taxBps = 3000n
  const netIn = (amountIn * (10_000n - taxBps)) / 10_000n

  const client = createAgxSellClient({
    tokenIn: agx,
    tokenOut: usd1,
    taxValues: {
      sellRatio: 350n,
      extraSellBP: taxBps,
      crashFuseActive: true,
      blockSellQuotaBlock: 100n,
      blockSellLimit: 10n ** 18n,
      grossSoldInBlock: 0n,
    },
  })

  const result = await fetchExchangeQuote({
    amountIn,
    tokenIn: agx,
    tokenOut: usd1,
    client,
  })

  assert.equal(client.getAmountsOutArg, netIn)
  assert.equal(result.quotedOut, netIn / 2n)
  assert.ok(client.calls.some((c) => c[1] === 'aggregate3'))
})

test('fetchExchangeQuote AGX sell uses extraSellBP when block sell limit exceeded', async () => {
  const { fetchExchangeQuote } = await loadModule('/src/web3/exchange/exchange-read.ts')
  const { clearExchangePoolImmutableCache } = await loadModule(
    '/src/web3/exchange/read-exchange-pool.ts',
  )
  const { agx, usd1 } = await loadExchangeAddresses()
  clearExchangePoolImmutableCache()

  const amountIn = 10n ** 9n
  const taxBps = 3000n
  const netIn = (amountIn * (10_000n - taxBps)) / 10_000n

  const client = createAgxSellClient({
    tokenIn: agx,
    tokenOut: usd1,
    taxValues: {
      sellRatio: 350n,
      extraSellBP: taxBps,
      crashFuseActive: false,
      blockSellQuotaBlock: 100n,
      blockSellLimit: amountIn,
      grossSoldInBlock: 1n,
    },
  })

  await fetchExchangeQuote({
    amountIn,
    tokenIn: agx,
    tokenOut: usd1,
    client,
  })

  assert.equal(client.getAmountsOutArg, netIn)
})

test('fetchExchangeQuote X to AGX uses post-tax amountIn for getAmountsOut', async () => {
  const { fetchExchangeQuote } = await loadModule('/src/web3/exchange/exchange-read.ts')
  const { clearExchangePoolImmutableCache } = await loadModule(
    '/src/web3/exchange/read-exchange-pool.ts',
  )
  const { X_SELL_TAX_BP } = await loadModule('/src/core/exchange/x-sell-tax.ts')
  const { agx, x } = await loadExchangeAddresses()
  clearExchangePoolImmutableCache()

  const amountIn = 10n ** 18n
  const netIn = (amountIn * (10_000n - BigInt(X_SELL_TAX_BP))) / 10_000n
  const client = createMockClient({
    tokenIn: x,
    tokenOut: agx,
    quotedOut: netIn / 2n,
  })
  client.getAmountsOutArg = null
  const originalRead = client.readContract.bind(client)
  client.readContract = async (request) => {
    if (request.functionName === 'getAmountsOut') {
      client.getAmountsOutArg = request.args[0]
    }
    return originalRead(request)
  }

  const result = await fetchExchangeQuote({
    amountIn,
    tokenIn: x,
    tokenOut: agx,
    path: [x, agx],
    client,
  })

  assert.equal(client.getAmountsOutArg, netIn)
  assert.equal(result.quotedOut, netIn / 2n)
})

test('quoteV2AmountsOut returns zero for zero amountIn without RPC', async () => {
  const { quoteV2AmountsOut } = await loadModule('/src/web3/exchange/quote-v2-amounts-out.ts')
  const { agx, usd1, router } = await loadExchangeAddresses()
  const client = createMockClient({ tokenIn: usd1, tokenOut: agx })

  const result = await quoteV2AmountsOut({
    router,
    amountIn: 0n,
    path: [usd1, agx],
    client,
  })

  assert.equal(result, 0n)
  assert.equal(client.calls.length, 0)
})
