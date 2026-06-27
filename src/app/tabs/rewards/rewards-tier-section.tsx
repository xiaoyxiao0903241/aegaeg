import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { formatPresaleRank, getPresaleRankHighlightedRows } from '~/lib/api/format-display'
import { useShareholderRankLabels } from '~/hooks/use-shareholder-rank'
import { buildRewardTierRows, getTeamRequirementLegRank } from '~/lib/presale/tier-table'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappTableCard } from '~/app/components/dapp-table-card'
import { ResponsiveTable } from '~/app/components/responsive-table'
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
    t.tables.postLaunchRank,
  ]

  const tierRows = rewardTiers.map((row, rowIndex) => {
    const totalVolumeCell = formatTierTotalVolumeCell(
      row[0],
      row[2],
      t.rewards.tierDualLegRequirement,
    )
    const cells = [row[0], row[1], totalVolumeCell, row[3], row[4]]
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
