export type ChainQueryScope = 'public' | 'wallet'

/** Final `enabled` for chain reads: caller domain gate AND wallet scope gate. */
export function resolveChainQueryEnabled(args: {
  scope: ChainQueryScope
  enabled?: boolean
  address: string | undefined
}): boolean {
  if (!(args.enabled ?? true)) return false
  if (args.scope === 'wallet') return Boolean(args.address)
  return true
}
