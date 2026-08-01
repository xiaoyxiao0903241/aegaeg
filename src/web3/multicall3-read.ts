import { type Address, type Hex, parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { MULTICALL3_METHODS } from '~/web3/abis'
import type { ChainReadClient } from '~/web3/chain-read-client'

const multicallAbi = parseAbi([MULTICALL3_METHODS.aggregate3])

export type Aggregate3Call = {
  target: Address
  allowFailure?: boolean
  callData: Hex
}

/** 一批 eth_call → Multicall3.aggregate3（单 RPC）。空数组不发请求。 */
export async function readAggregate3(
  client: ChainReadClient,
  calls: readonly Aggregate3Call[],
): Promise<{ success: boolean; returnData: Hex }[]> {
  if (calls.length === 0) return []
  return (await client.readContract({
    address: BSC_CONTRACTS.multicall3,
    abi: multicallAbi,
    functionName: 'aggregate3',
    args: [
      calls.map((call) => ({
        target: call.target,
        allowFailure: call.allowFailure ?? false,
        callData: call.callData,
      })),
    ],
  })) as { success: boolean; returnData: Hex }[]
}
