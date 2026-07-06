import { createPublicClient, custom, type PublicClient } from 'viem'
import { bsc } from 'viem/chains'
import type { Wallet } from 'thirdweb/wallets'
import { bscReadClient } from '~/views/dapp/web3/bsc-read-client'
import { resolveWalletEip1193Provider } from '~/views/dapp/web3/resolve-wallet-eip1193-provider'

export type ChainReadClient = PublicClient

/** Viem public client backed by the connected wallet's EIP-1193 provider. */
export function createWalletReadClient(wallet: Wallet): ChainReadClient {
  return createPublicClient({
    chain: bsc,
    transport: custom(resolveWalletEip1193Provider(wallet)),
  })
}

/** Wallet RPC when connected; otherwise the app public read RPC (SSR / disconnected). */
export function resolveChainReadClient(wallet?: Wallet | null): ChainReadClient {
  return wallet ? createWalletReadClient(wallet) : bscReadClient
}
