export type SwapAction = 'approve' | 'swap'

export function resolveSwapAction(allowance: bigint, amountIn: bigint): SwapAction {
  return allowance >= amountIn ? 'swap' : 'approve'
}
