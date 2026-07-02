/**
 * thirdweb `useActiveWalletConnectionStatus()` often stays `'unknown'` while the
 * wallet is already usable. Never treat `'unknown'` as a blocking handshake.
 * Active account address is the SSOT for on-chain readiness.
 */
export function hasWalletAccount(
  account: { address: string } | undefined | null,
): boolean {
  return Boolean(account?.address)
}

/** AutoConnect still running and no account restored yet. */
export function isWalletRestorePending(
  account: { address: string } | undefined | null,
  isAutoConnecting: boolean,
): boolean {
  return isAutoConnecting && !hasWalletAccount(account)
}
