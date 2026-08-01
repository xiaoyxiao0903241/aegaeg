import { parseAbi } from 'viem'

import { PANCAKE_ROUTER_V2_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const routerAbi = parseAbi([PANCAKE_ROUTER_V2_METHODS.getAmountsOut])

export async function quoteV2AmountsOut({
  router,
  amountIn,
  path,
  client = bscReadClient,
}: {
  router: `0x${string}`
  amountIn: bigint
  /** Direct (2) or via-mid (3) hop — Pancake V2 `getAmountsOut`. */
  path: readonly `0x${string}`[]
  client?: ChainReadClient
}): Promise<bigint> {
  if (amountIn === 0n) return 0n
  if (path.length < 2) {
    throw new Error(`QUOTE_PATH_TOO_SHORT:${path.length}`)
  }

  const amounts = await client.readContract({
    address: router,
    abi: routerAbi,
    functionName: 'getAmountsOut',
    args: [amountIn, [...path]],
  })

  return amounts[amounts.length - 1] ?? 0n
}
