/** Tab order — leaf module; no tab component imports (avoids utils/registry cycle). */
export const tabOrder = ['swap', 'genesis', 'rewards', 'community'] as const

export type DappTab = (typeof tabOrder)[number]
