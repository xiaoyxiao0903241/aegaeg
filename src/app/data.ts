export const swapTokenKeys = ['usd1', 'agx', 'x'] as const
export const swapTokenCardKeys = ['agx', 'usd1', 'x'] as const

export type SwapTokenKey = (typeof swapTokenKeys)[number]

/** Genesis season selector fallback when chain phases are unavailable */
export const seasons = [
  {
    name: 'Season 1',
    status: 'Ended',
    discount: '30% off',
    desktopMeta: {
      discount: '-30%',
      airdrop: '+5%',
    },
    price: '≈ $45.5',
    date: '06.21 – 07.10',
    quota: '$100 – $10,000',
  },
  {
    name: 'Season 2',
    status: 'LIVE',
    discount: '25% off',
    desktopMeta: {
      discount: '-25%',
      airdrop: '+2%',
    },
    price: '≈ $48.75',
    date: '07.11 – 07.30',
    quota: '$100 – $10,000',
    active: true,
  },
  {
    name: 'Season 3',
    status: 'Upcoming',
    discount: '20% off',
    desktopMeta: {
      discount: '-20%',
      airdrop: '+1%',
    },
    price: '≈ $52',
    date: '07.31 – 08.19',
    quota: '$100 – $30,000',
  },
]
