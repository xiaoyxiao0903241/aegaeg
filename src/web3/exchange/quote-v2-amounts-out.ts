import { parseAbi } from 'viem'

import { PANCAKE_ROUTER_V2_METHODS } from '~/web3/abis'
import { bscReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'

const routerAbi = parseAbi([PANCAKE_ROUTER_V2_METHODS.getAmountsOut])

/**
 * 通过 Pancake V2 Router 获取路径报价
 *
 * 调用 `getAmountsOut`，返回路径末端的输出数量；输入为 0 时直接返回 0，
 * 少于两跳不是合法路径，直接抛错。
 *
 * @param router 路由器合约地址
 * @param amountIn 输入代币数量
 * @param path 兑换路径，直连两跳或经中间币三跳
 * @param client 链上读取客户端，默认公共 RPC
 * @returns 路径末端的输出数量
 */
export async function quoteV2AmountsOut({
  router,
  amountIn,
  path,
  client = bscReadClient,
}: {
  router: `0x${string}`
  amountIn: bigint
  /** 直连（2）或经中间币（3）跳，Pancake V2 `getAmountsOut` 路径。 */
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
