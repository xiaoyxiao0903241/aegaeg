import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import {
  StakingChartSection,
  StakingFaqSection,
  StakingMechanismSection,
  StakingOverviewSection,
  StakingPositionsSection,
  StakingRecordsSection,
  StakingXValueSection,
} from '~/views/dapp/staking/staking-detail-sections'
import { useXmineDetailAsideView } from '~/views/dapp/staking/xmine/use-xmine-detail-aside-view'

/**
 * Xmine 详情页（右栏）
 *
 * 展示 X 价值说明、协议概览、我的仓位、释放记录、
 * 机制说明、趋势图与 FAQ。
 */
export function StakingXmineDetail() {
  const { messages: t } = useI18n()
  const { overviewItems, positionItems, recordRows, recordsLoading } = useXmineDetailAsideView()

  return (
    <Detail>
      <StakingOverviewSection overviewItems={overviewItems} overviewLayout="pair-plus" />
      <StakingXValueSection />
      <StakingPositionsSection positionItems={positionItems} positionLayout="triple-plus" />
      <StakingRecordsSection
        recordColWidths={['10.9375rem', '6.25rem', '8.75rem', '1fr']}
        recordColumns={t.staking.aside.xmineRecordColumns}
        recordRows={recordRows}
        recordsEmptyTitle={recordsLoading ? '…' : t.staking.aside.recordsEmpty.xmine}
        recordsTitle={t.staking.aside.recordsTitles.xmine}
      />
      <StakingMechanismSection
        mechanismSteps={t.staking.xmine.mechanismSteps}
        mechanismTitle={t.staking.xmine.mechanismTitle}
      />
      <StakingChartSection chartTitle={t.staking.aside.chartTitles.xmine} />
      <StakingFaqSection faq={t.staking.xmine.faq} />
    </Detail>
  )
}
