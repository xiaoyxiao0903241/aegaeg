import type { TeamReferralItem } from '~/shared/api/types'
import {
  TABLE_EMPTY,
  formatCount,
  formatInviteMemberAddress,
  formatRegisterDate,
  formatShortAddress,
  formatTableGenesisRank,
  formatUsd,
} from '~/shared/api/format-display'
import { getRuntimeHost } from '~/shared/lib/runtime-host'

function formatTableUsdAmount(value: string | number | undefined | null): string {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return TABLE_EMPTY
  return formatUsd(num)
}

function formatTableVolume(value: string | number | undefined | null): string {
  const num = Number(value)
  if (!Number.isFinite(num)) return TABLE_EMPTY
  return formatCount(num)
}

export function mapTeamReferralToCompactRow(item: TeamReferralItem): string[] {
  return [
    formatRegisterDate(item.register_time),
    formatInviteMemberAddress(item.address),
    formatTableUsdAmount(item.presale_volume),
    formatTableGenesisRank(item.presale_rank),
    formatCount(item.direct_referral_count ?? 0),
    formatTableVolume(item.sales_team_market),
  ]
}

/** Sidebar display: host + shortened address. */
export function formatReferralLinkDisplay(address: string): string {
  return `${getRuntimeHost()}/r/${formatShortAddress(address)}`
}
