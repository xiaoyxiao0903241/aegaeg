export type GenesisPromoStatus = 'LIVE' | 'Ended' | 'Upcoming'

export type GenesisPromoSnapshot = {
  season: number
  discount: string
  status: GenesisPromoStatus
  dateRange: string
  endDate: string
  startDate: string
}

export type SeasonOption = {
  active?: boolean
  date: string
  desktopMeta: {
    airdrop: string
    discount: string
  }
  discount: string
  name: string
  price: string
  status: string
}
