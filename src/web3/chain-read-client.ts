import type { Wallet } from 'thirdweb/wallets'
import { createPublicClient, custom, type PublicClient } from 'viem'
import { bsc } from 'viem/chains'

import { bscReadClient } from '~/web3/bsc-read-client'
import { walletEip1193Provider } from '~/web3/wallet/wallet-eip1193-provider'

export type ChainReadClient = PublicClient

/** Viem public client backed by the connected wallet's EIP-1193 provider. */
export function createWalletReadClient(wallet: Wallet): ChainReadClient {
  return createPublicClient({
    chain: bsc,
    transport: custom(walletEip1193Provider(wallet)),
  })
}

/** Wallet RPC when connected; otherwise the app public read RPC (SSR / disconnected). */
export function chainReadClient(wallet?: Wallet | null): ChainReadClient {
  return wallet ? createWalletReadClient(wallet) : bscReadClient
}
