import type { TeamReferralItem } from '~/shared/api/types'
import {
  formatGroupedNumber,
  TABLE_EMPTY,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
} from '~/shared/api/format-display'
import { getRuntimeHost } from '~/shared/lib/runtime-host'

export function mapTeamReferralToCompactRow(item: TeamReferralItem): string[] {
  const volume = Number(item.presale_volume)
  const teamMarket = Number(item.sales_team_market)

  return [
    formatRegisterDate(item.register_time),
    formatShortAddress(item.address, { head: 4, tail: 4 }),
    Number.isFinite(volume) && volume > 0
      ? formatGroupedNumber(volume, { prefix: '$' })
      : TABLE_EMPTY,
    formatTableGenesisRank(item.presale_rank),
    formatGroupedNumber(item.direct_referral_count ?? 0, { digits: 0, trimZeros: true }),
    Number.isFinite(teamMarket)
      ? formatGroupedNumber(teamMarket, { digits: 0, trimZeros: true })
      : TABLE_EMPTY,
  ]
}

/** Sidebar display: host + shortened address. */
export function formatReferralLinkDisplay(address: string): string {
  return `${getRuntimeHost()}/r/${formatShortAddress(address)}`
}
