export type ExchangeSubview = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'

/** Pure mount matrix — leaving a subview unmounts its provider (quote/submit state discarded). */
export function viewsNeedingProvider(
  view: ExchangeSubview,
  motion: boolean,
  outgoingView: ExchangeSubview | null,
  incomingView: ExchangeSubview | null,
): { flash: boolean; trade: boolean; burn: boolean; turbine: boolean } {
  const active = new Set<ExchangeSubview>()
  if (motion) {
    if (outgoingView) active.add(outgoingView)
    if (incomingView) active.add(incomingView)
  } else {
    active.add(view)
  }
  return {
    flash: active.has('flash'),
    trade: active.has('trade'),
    burn: active.has('burn'),
    turbine: active.has('turbine'),
  }
}
