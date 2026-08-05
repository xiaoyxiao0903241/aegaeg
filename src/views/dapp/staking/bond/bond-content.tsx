import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondDetailAsideView } from '~/views/dapp/staking/bond/use-bond-detail-aside-view'
import {
  StakingChartSection,
  StakingFaqSection,
  StakingMechanismSection,
  StakingOverviewSection,
  StakingPositionsSection,
  StakingRecordsSection,
} from '~/views/dapp/staking/staking-detail-sections'

export function BondContent({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const { copy, overviewItems, positionItems, recordRows, recordsLoading } =
    useBondDetailAsideView(kind)
  const recordsTitle =
    kind === 'lp' ? t.staking.aside.recordsTitles.lpbond : t.staking.aside.recordsTitles.burnbond
  const chartTitle =
    kind === 'lp' ? t.staking.aside.chartTitles.lpbond : t.staking.aside.chartTitles.burnbond

  return (
    <Detail>
      <StakingOverviewSection overviewItems={overviewItems} overviewLayout="cards-2" />
      <StakingPositionsSection positionItems={positionItems} positionLayout="cards-2" />
      <StakingRecordsSection
        recordColWidths={['8.75rem', '4.375rem', '5.625rem', '4.375rem', '6.875rem', '1fr']}
        recordColumns={t.staking.aside.bondRecordColumns}
        recordRows={recordRows}
        recordsEmptyTitle={
          recordsLoading
            ? '…'
            : kind === 'lp'
              ? t.staking.aside.recordsEmpty.lpbond
              : t.staking.aside.recordsEmpty.burnbond
        }
        recordsTitle={recordsTitle}
      />
      <StakingMechanismSection
        mechanismSteps={copy.mechanismSteps}
        mechanismTitle={copy.mechanismTitle}
      />
      <StakingChartSection chartTitle={chartTitle} />
      <StakingFaqSection faq={copy.faq} />
    </Detail>
  )
}
