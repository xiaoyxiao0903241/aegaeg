import type { Account, Wallet } from 'thirdweb/wallets'
import { WALLET_GATE_ERROR } from '~/web3/errors/sentinels'
import { resolveChainReadClient, type ChainReadClient } from '~/web3/chain-read-client'
import type { Address } from '~/shared/config/contracts'

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
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }
  const account = wallet.getAccount()
  if (!account?.address) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }
  return {
    wallet,
    account,
    address: account.address as Address,
    readClient: resolveChainReadClient(wallet),
  }
}
