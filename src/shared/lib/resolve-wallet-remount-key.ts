/** Stable React remount key for wallet-scoped draft state. */
export function resolveWalletRemountKey(address: string | null | undefined): string {
  return address?.toLowerCase() ?? 'disconnected'
}
