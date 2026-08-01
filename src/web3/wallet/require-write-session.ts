import type { Account, Wallet } from 'thirdweb/wallets'

import type { Address } from '~/shared/config/contracts'
import { type ChainReadClient, chainReadClient } from '~/web3/chain-read-client'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'

export type WriteSession = {
  wallet: Wallet
  account: Account
  address: Address
  readClient: ChainReadClient
}

/**
 * Fail-closed write boundary: derive account + L-tier read client from wallet.
 * Call sites receive this from `useChainMutation` (or pass an explicit wallet).
 */
export function makeWriteSession(wallet: Wallet | undefined | null): WriteSession {
  if (!wallet) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  const account = wallet.getAccount()
  if (!account?.address) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  return {
    wallet,
    account,
    address: account.address as Address,
    readClient: chainReadClient(wallet),
  }
}
