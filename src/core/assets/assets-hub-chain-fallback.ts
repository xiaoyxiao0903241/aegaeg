/** Assets hub：session+API 优先；仅未登录或 API 三件套失败时才拉链上全表。 */
export function assetsHubNeedsChainFallback(args: {
  walletReady: boolean
  hasAddress: boolean
  sessionReady: boolean
  apiPending: boolean
  apiReady: boolean
}): boolean {
  const enabled = args.walletReady && args.hasAddress
  if (!enabled) return false
  if (!args.sessionReady) return true
  if (args.apiPending || args.apiReady) return false
  return true
}
