export type ExchangeSubview = 'hub' | 'flash' | 'trade' | 'burn' | 'turbine'

/** 纯挂载矩阵：离开子视图即卸载其会话提供者，丢弃本地报价与提交状态。 */
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
