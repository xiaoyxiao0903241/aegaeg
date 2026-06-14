import { createThirdwebClient } from 'thirdweb'
import { bsc } from 'thirdweb/chains'

export const thirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID ?? 'YOUR_CLIENT_ID',
})

export const walletConnectProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

export const supportedChains = [bsc] as const

export const defaultChain = bsc

export type SupportedChainId = (typeof supportedChains)[number]['id']

export const appMetadata = {
  name: 'AEGIS X',
  url:
    typeof window === 'undefined' ? 'https://aegis.example' : window.location.origin,
  description: 'AEGIS X BSC DApp',
}
