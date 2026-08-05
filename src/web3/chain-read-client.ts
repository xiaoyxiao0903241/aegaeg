import type { Wallet } from 'thirdweb/wallets'
import { createPublicClient, custom, type PublicClient } from 'viem'
import { bsc } from 'viem/chains'

import { bscReadClient } from '~/web3/bsc-read-client'
import { walletEip1193Provider } from '~/web3/wallet/wallet-eip1193-provider'

export type ChainReadClient = PublicClient

/** 钱包连接时，用钱包的 EIP-1193 provider 建立只读客户端，链上只读查询走钱包节点。 */
export function createWalletReadClient(wallet: Wallet): ChainReadClient {
  return createPublicClient({
    chain: bsc,
    transport: custom(walletEip1193Provider(wallet)),
  })
}

/** 已连接钱包时返回钱包节点只读客户端，未连接时退回应用公共只读 RPC（SSR / 未连接）。 */
export function chainReadClient(wallet?: Wallet | null): ChainReadClient {
  return wallet ? createWalletReadClient(wallet) : bscReadClient
}
