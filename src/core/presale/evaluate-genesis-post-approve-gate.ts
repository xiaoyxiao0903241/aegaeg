/** Genesis：approve 完成后、purchase 前的二次门闸。 */
export type GenesisPostApproveGate =
  | { ok: true }
  | { ok: false; reason: 'not_bound' | 'unavailable' }

export function evaluateGenesisPostApproveGate({
  isBound,
  isPaused,
  isPausedUnknown,
}: {
  isBound: boolean | undefined
  isPaused: boolean
  isPausedUnknown: boolean
}): GenesisPostApproveGate {
  if (isBound !== true) return { ok: false, reason: 'not_bound' }
  if (isPaused || isPausedUnknown) return { ok: false, reason: 'unavailable' }
  return { ok: true }
}
