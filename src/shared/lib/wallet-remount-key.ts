/** Stable React remount key for wallet-scoped draft state. */
export function walletRemountKey(address: string | null | undefined): string {
  return address?.toLowerCase() ?? 'disconnected'
}
