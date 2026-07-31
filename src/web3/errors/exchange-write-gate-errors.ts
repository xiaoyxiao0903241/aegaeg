/** Soft-gate sentinels for burn / exchange writes. Locale-free; map in `getErrorMessage`. */
export const BURN_GATE_ERROR = {
  paused: 'BURN_CONTRIBUTION_PAUSED',
  belowMin: 'BURN_CONTRIBUTION_BELOW_MIN',
  aboveMax: 'BURN_CONTRIBUTION_ABOVE_MAX',
  zeroRate: 'BURN_CONTRIBUTION_ZERO_RATE',
} as const
