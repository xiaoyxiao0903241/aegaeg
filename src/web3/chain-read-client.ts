import { useLayoutEffect } from 'react'
import type { PublicClient } from 'viem'

import { setConnectedReadWallet } from '~/web3/bsc-read-client'
import { useActiveWallet } from '~/web3/thirdweb-react'

export type ChainReadClient = PublicClient

/**
 * 把当前钱包写进默认读客户端。
 *
 * layout 阶段写入，赶在 Query 的 effect 拉数之前。
 * 卸载或钱包实例变化时清掉绑定。
 */
export function useBindConnectedBscReadWallet() {
  const wallet = useActiveWallet()

  useLayoutEffect(() => {
    setConnectedReadWallet(wallet ?? null)
    return () => setConnectedReadWallet(null)
  }, [wallet])
}
