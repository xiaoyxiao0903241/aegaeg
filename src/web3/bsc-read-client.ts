import { createPublicClient, http } from 'viem'
import { bsc } from 'viem/chains'

/** Read-only BSC client for QuoterV2 simulate calls (thirdweb readContract cannot quote V3). */
export const bscReadClient = createPublicClient({
  chain: bsc,
  transport: http('https://bsc-dataseed1.binance.org'),
})
