export type SwapSubview = 'hub' | 'flash' | 'trade'

/** Pure mount matrix — leaving a subview unmounts its provider (quote/submit state discarded). */
export function viewsNeedingProvider(
  view: SwapSubview,
  motion: boolean,
  outgoingView: SwapSubview | null,
  incomingView: SwapSubview | null,
): { flash: boolean; trade: boolean } {
  const active = new Set<SwapSubview>()
  if (motion) {
    if (outgoingView) active.add(outgoingView)
    if (incomingView) active.add(incomingView)
  } else {
    active.add(view)
  }
  return {
    flash: active.has('flash'),
    trade: active.has('trade'),
  }
}
