export const exchangeTokenKeys = ['usd1', 'agx', 'x'] as const
export const exchangeTokenCardKeys = ['agx', 'usd1', 'x'] as const

export type ExchangeTokenKey = (typeof exchangeTokenKeys)[number]
