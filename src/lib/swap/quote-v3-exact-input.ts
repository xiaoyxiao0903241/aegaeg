import { parseAbi } from 'viem'
import { QUOTER_V3_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

const quoterAbi = parseAbi([QUOTER_V3_METHODS.quoteExactInputSingle])

export interface V3QuoteExactInputSingleResult {
  amountOut: bigint
  sqrtPriceX96After: bigint
  initializedTicksCrossed: number
  gasEstimate: bigint
}

export async function quoteV3ExactInputSingle({
  quoter,
  tokenIn,
  tokenOut,
  amountIn,
  fee,
}: {
  quoter: `0x${string}`
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  amountIn: bigint
  fee: number
}): Promise<V3QuoteExactInputSingleResult> {
  if (amountIn === 0n) {
    return {
      amountOut: 0n,
      sqrtPriceX96After: 0n,
      initializedTicksCrossed: 0,
      gasEstimate: 0n,
    }
  }

  const { result } = await bscReadClient.simulateContract({
    address: quoter,
    abi: quoterAbi,
    functionName: 'quoteExactInputSingle',
    args: [
      {
        tokenIn,
        tokenOut,
        amountIn,
        fee,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })

  return {
    amountOut: result[0],
    sqrtPriceX96After: result[1],
    initializedTicksCrossed: Number(result[2]),
    gasEstimate: result[3],
  }
}
