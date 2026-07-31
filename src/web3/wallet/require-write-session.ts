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

type WalletGetter = () => Wallet | undefined | null

/** Bound by `useChainMutation` for the duration of a write — same Wallet instance as the hook. */
let boundWalletGetter: WalletGetter | null = null

/**
 * Bind the active-wallet getter for zero-arg `requireWriteSession()`.
 * Returns unbind — call in `finally` so tests / nested writes cannot leak.
 */
export function bindWriteSessionWallet(getWallet: WalletGetter): () => void {
  const previous = boundWalletGetter
  boundWalletGetter = getWallet
  return () => {
    if (boundWalletGetter === getWallet) {
      boundWalletGetter = previous
    }
  }
}

/**
 * Fail-closed write boundary: derive account + L-tier read client from wallet.
 *
 * - `requireWriteSession()` — uses getter bound by `useChainMutation` (call-site 最少字数)
 * - `requireWriteSession(wallet)` — explicit override (tests / non-mutation paths e.g. referral)
 */
export function requireWriteSession(wallet?: Wallet | undefined | null): WriteSession {
  const resolved = wallet !== undefined ? wallet : boundWalletGetter?.()
  if (!resolved) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }
  const account = resolved.getAccount()
  if (!account?.address) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }
  return {
    wallet: resolved,
    account,
    address: account.address as Address,
    readClient: resolveChainReadClient(resolved),
  }
}
