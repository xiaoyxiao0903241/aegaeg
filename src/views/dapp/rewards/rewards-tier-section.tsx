import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { formatPresaleRank, getPresaleRankHighlightedRows } from '~/shared/api/format-display'
import { useShareholderRankLabels } from '~/views/dapp/rewards/use-shareholder-rank'
import { buildRewardTierRows, getTeamRequirementLegRank } from '~/core/presale/tier-table'
import { DappCollapsibleSection } from '~/app/shell/dapp-collapsible-section'
import { DappSection } from '~/app/shell/dapp-section'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

function formatTierTotalVolumeCell(
  rankLabel: string,
  totalVolumeValue: string,
  tierDualLegRequirement: string,
): string {
  const rank = Number.parseInt(rankLabel.replace(/^S/i, ''), 10)
  const legRank = getTeamRequirementLegRank(rank)
  if (legRank == null) return totalVolumeValue
  return tierDualLegRequirement.replace('{rank}', formatPresaleRank(legRank))
}

export function RewardsTierSection() {
  const { messages: t } = useI18n()
  const isMobileViewport = useMobileViewport()
  const { displayRank } = useShareholderRankLabels(t)

  const rewardTiers = buildRewardTierRows()
  const tierHighlightedRows = getPresaleRankHighlightedRows(displayRank, rewardTiers.length)

  const tierHeaders = [
    t.tables.title,
    t.community.shareholder,
    t.tables.totalVolume,
    t.tables.rewardRate,
  ]

  const tierRows = rewardTiers.map((row, rowIndex) => {
    const rankLabel = row[0] ?? ''
    const shareholder = row[1] ?? ''
    const totalVolumeValue = row[2] ?? ''
    const rewardRate = row[3] ?? ''
    const totalVolumeCell = formatTierTotalVolumeCell(
      rankLabel,
      totalVolumeValue,
      t.rewards.tierDualLegRequirement,
    )
    const cells = [rankLabel, shareholder, totalVolumeCell, rewardRate]
    if (tierHighlightedRows.includes(rowIndex)) {
      cells[0] = `${cells[0]} · ${t.rewards.currentTierSuffix}`
    }
    return cells
  })

  const tierTable = (
    <DappTableCard>
      <ResponsiveTable
        compact
        headers={tierHeaders}
        highlightedRows={tierHighlightedRows}
        rows={tierRows}
      />
    </DappTableCard>
  )

  if (isMobileViewport) {
    return (
      <DappSection title={t.rewards.allTiers}>
        <div className={revealClass()} data-reveal>
          {tierTable}
        </div>
      </DappSection>
    )
  }

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.rewards.allTiers}>
      {tierTable}
    </DappCollapsibleSection>
  )
}
