export function buildSwapDeadline(deadlineSeconds: number, nowSeconds = Math.floor(Date.now() / 1000)): number {
  return nowSeconds + deadlineSeconds
}
