import { createPublicClient, http } from 'viem'
import { bsc } from 'viem/chains'
import { appEnv } from '~/shared/config/env'

/** Read-only BSC client — quotes, balances, receipt polling (SSOT: VITE_BSC_RPC_URL). */
export const bscReadClient = createPublicClient({
  chain: bsc,
  transport: http(appEnv.bscRpcUrl),
})
