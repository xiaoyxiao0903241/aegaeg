import type { GenesisPromoSnapshot, SeasonOption } from '~/core/presale/genesis-promo-types'

/**
 * 预售首页横幅的展示数据：季节序号、当前主推折扣、加载态与季节选项。
 *
 * @see 手册 §6 预售 PreSale
 */
export type GenesisPromoChrome = {
  activeSeasonNumber: number
  discountLabel: string
  isLoading: boolean
  promoSnapshot: GenesisPromoSnapshot | null
  seasonOptions: SeasonOption[]
}

function seasonOptionEqual(a: SeasonOption, b: SeasonOption): boolean {
  return (
    a.name === b.name &&
    a.status === b.status &&
    a.active === b.active &&
    a.discount === b.discount &&
    a.price === b.price &&
    a.date === b.date &&
    a.desktopMeta.discount === b.desktopMeta.discount &&
    a.desktopMeta.airdrop === b.desktopMeta.airdrop
  )
}

function seasonOptionsEqual(a: readonly SeasonOption[], b: readonly SeasonOption[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i]
    const right = b[i]
    if (!left || !right || !seasonOptionEqual(left, right)) return false
  }
  return true
}

function promoSnapshotEqual(
  a: GenesisPromoSnapshot | null,
  b: GenesisPromoSnapshot | null,
): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  return (
    a.season === b.season &&
    a.discount === b.discount &&
    a.status === b.status &&
    a.dateRange === b.dateRange &&
    a.endDate === b.endDate &&
    a.startDate === b.startDate
  )
}

/**
 * 横幅数据是否语义相等：引用可不同，字段值相同则不应触发状态仓库订阅方刷新。
 *
 * @param a 横幅数据
 * @param b 横幅数据
 * @returns 字段值全部相等返回 true
 * @see 手册 §6 预售 PreSale
 */
export function genesisPromoChromeEqual(a: GenesisPromoChrome, b: GenesisPromoChrome): boolean {
  return (
    a.activeSeasonNumber === b.activeSeasonNumber &&
    a.discountLabel === b.discountLabel &&
    a.isLoading === b.isLoading &&
    promoSnapshotEqual(a.promoSnapshot, b.promoSnapshot) &&
    seasonOptionsEqual(a.seasonOptions, b.seasonOptions)
  )
}
