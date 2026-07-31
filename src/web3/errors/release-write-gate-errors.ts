/** Soft-gate sentinels for release queue / buffer claims. Locale-free; map in `getErrorMessage`. */
export const RELEASE_GATE_ERROR = {
  zeroAmount: 'RELEASE_ZERO_AMOUNT',
  lockedUnknown: 'RELEASE_LOCKED_UNKNOWN',
  planUnresolved: 'RELEASE_PLAN_UNRESOLVED',
  unavailable: 'RELEASE_UNAVAILABLE',
} as const
