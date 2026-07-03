import { useMemo } from 'react'
import { useActiveWallet } from 'thirdweb/react'
import {
  resolveChainReadClient,
  type ChainReadClient,
} from '~/web3/chain-read-client'

/** Prefer the connected wallet's RPC; fall back to app read RPC when disconnected. */
export function useChainReadClient(): ChainReadClient {
  const wallet = useActiveWallet()
  return useMemo(() => resolveChainReadClient(wallet), [wallet])
}
