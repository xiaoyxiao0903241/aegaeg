/** Tab order — leaf module; no tab component imports (avoids utils/registry cycle). */
export const tabOrder = [
  'exchange',
  'assets',
  'staking',
  'rewards',
  'release',
  'community',
  'genesis',
] as const

export type DappTab = (typeof tabOrder)[number]
