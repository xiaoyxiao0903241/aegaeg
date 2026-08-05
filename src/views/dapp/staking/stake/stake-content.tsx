import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import { useStakeDetailAsideView } from '~/views/dapp/staking/stake/use-stake-detail-aside-view'
import {
  StakingChartSection,
  StakingFaqSection,
  StakingMechanismSection,
  StakingOverviewSection,
  StakingPositionsSection,
  StakingRecordsSection,
} from '~/views/dapp/staking/staking-detail-sections'

export function StakeContent() {
  const { messages: t } = useI18n()
  const { overviewItems, positionItems, recordRows, recordsLoading } = useStakeDetailAsideView()

  return (
    <Detail>
      <StakingOverviewSection overviewItems={overviewItems} overviewLayout="cards-2" />
      <StakingPositionsSection positionItems={positionItems} />
      <StakingRecordsSection
        recordRows={recordRows}
        recordsEmptyTitle={recordsLoading ? '…' : t.staking.aside.recordsEmpty.stake}
        recordsTitle={t.staking.aside.recordsTitles.stake}
      />
      <StakingMechanismSection
        mechanismSteps={t.staking.stake.mechanismSteps}
        mechanismTitle={t.staking.stake.mechanismTitle}
      />
      <StakingChartSection chartTitle={t.staking.aside.chartTitles.stake} />
      <StakingFaqSection faq={t.staking.stake.faq} />
    </Detail>
  )
}
