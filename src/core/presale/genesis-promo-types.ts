/**
 * 预售首页横幅（Genesis promo）的数据类型。
 *
 * 快照与季节选项均为已格式化字符串，核心层不依赖 i18n；供横幅展示使用。
 */
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
