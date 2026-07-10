export const swapTokenKeys = ['usd1', 'agx', 'x'] as const
export const swapTokenCardKeys = ['agx', 'usd1', 'x'] as const

export type SwapTokenKey = (typeof swapTokenKeys)[number]
