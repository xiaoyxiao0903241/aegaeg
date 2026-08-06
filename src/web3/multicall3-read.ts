import { type Address, decodeFunctionResult, type Hex, parseAbi } from 'viem'

import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { MULTICALL3_METHODS } from '~/web3/abis'
import type { ChainReadClient } from '~/web3/chain-read-client'

const multicallAbi = parseAbi([MULTICALL3_METHODS.aggregate3])

export type Aggregate3Call = {
  target: Address
  allowFailure?: boolean
  callData: Hex
}

export type Aggregate3Result = {
  success: boolean
  returnData: Hex
}

/** 一批 eth_call → Multicall3.aggregate3（单 RPC）。空数组不发请求。 */
export async function readAggregate3(
  client: ChainReadClient,
  calls: readonly Aggregate3Call[],
): Promise<Aggregate3Result[]> {
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
  })) as Aggregate3Result[]
}

/**
 * 解码 aggregate3 单槽；`success === false` 时按 label 抛出错误，失败结果不放行。
 * functionName 必须与 ABI 中该方法的函数签名一致。
 *
 * @param results aggregate3 返回结果槽
 * @param index 要解码的结果下标
 * @param abi 对应方法的 ABI
 * @param functionName ABI 中的方法名
 * @param label 解码失败或调用失败时使用的错误标识
 * @returns 按调用方泛型解析出的返回值
 */
export function decodeAggregate3Result<T>(
  results: readonly Aggregate3Result[],
  index: number,
  abi: readonly unknown[] | unknown[],
  functionName: string,
  label: string,
): T {
  const slot = results[index]
  if (!slot?.success) throw new Error(label)
  return decodeFunctionResult({
    abi: abi as never,
    functionName: functionName as never,
    data: slot.returnData,
  } as never) as T
}
