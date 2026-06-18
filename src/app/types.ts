export const tabOrder = ['swap', 'genesis', 'rewards', 'community'] as const

export type DappTab = (typeof tabOrder)[number]
