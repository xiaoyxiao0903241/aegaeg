export type ChainQueryScope = 'public' | 'wallet'

/** Final `enabled` for chain reads: caller domain enabled AND wallet scope enabled. */
export function chainQueryEnabled(args: {
  scope: ChainQueryScope
  enabled?: boolean
  address: string | undefined
}): boolean {
  if (!(args.enabled ?? true)) return false
  if (args.scope === 'wallet') return Boolean(args.address)
  return true
}
