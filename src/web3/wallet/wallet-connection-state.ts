/**
 * thirdweb 的 `useActiveWalletConnectionStatus()` 在钱包可用时仍常返回 `'unknown'`，
 * 不能把 `'unknown'` 当作阻塞中的握手状态。
 * 活跃账户地址才是链上就绪的唯一依据。
 */
export function hasWalletAccount(account: { address: string } | undefined | null): boolean {
  return Boolean(account?.address)
}

/** AutoConnect 仍在进行且尚未恢复账户。 */
export function isWalletRestorePending(
  account: { address: string } | undefined | null,
  isAutoConnecting: boolean,
): boolean {
  return isAutoConnecting && !hasWalletAccount(account)
}
