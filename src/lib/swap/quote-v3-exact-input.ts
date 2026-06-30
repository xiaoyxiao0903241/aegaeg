import { parseAbi } from 'viem'
import { QUOTER_V3_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'

const quoterAbi = parseAbi([QUOTER_V3_METHODS.quoteExactInputSingle])

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
}): Promise<bigint> {
  if (amountIn === 0n) return 0n

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

  return result[0]
}
