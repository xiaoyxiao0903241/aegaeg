import { decodeFunctionData, encodeFunctionResult, parseAbi } from 'viem'

import { loadModule } from '../load-module.mjs'

export async function withBscReadClient(client, run) {
  const { setBscReadClientForTest } = await loadModule('/src/web3/bsc-read-client.ts')
  setBscReadClientForTest(client)
  try {
    return await run()
  } finally {
    setBscReadClientForTest(null)
  }
}

/** viem Abi 本身是 fragment 数组；嵌套数组才是「多份 ABI」。 */
function asAbiList(abi) {
  if (Array.isArray(abi) && Array.isArray(abi[0])) return abi
  return [abi]
}

/** 把 aggregate3 拆成单读，让既有 functionName mock 继续工作。 */
export async function expandAggregate3(request, readByName, abi) {
  const abis = asAbiList(abi)
  return Promise.all(
    request.args[0].map(async (call) => {
      let decoded
      let matchedAbi
      for (const item of abis) {
        try {
          decoded = decodeFunctionData({ abi: item, data: call.callData })
          matchedAbi = item
          break
        } catch {
          continue
        }
      }
      if (!decoded || !matchedAbi) {
        throw new Error('undecodable aggregate3 call')
      }
      const result = await readByName({
        functionName: decoded.functionName,
        args: decoded.args,
        address: call.target,
      })
      return {
        success: true,
        returnData: encodeFunctionResult({
          abi: matchedAbi,
          functionName: decoded.functionName,
          result,
        }),
      }
    }),
  )
}

export function withAggregate3(readContract, abi) {
  return async (request) => {
    if (request.functionName !== 'aggregate3') return readContract(request)
    return expandAggregate3(request, readContract, abi)
  }
}

export const ERC20_TEST_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
])
