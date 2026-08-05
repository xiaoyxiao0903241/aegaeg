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

/**
 * 质押详情页（右栏）
 *
 * 展示协议概览、我的持仓、释放记录、机制说明、趋势图与 FAQ。
 * 未连接钱包时仓位与记录为空态。
 */
export function StakeDetail() {
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
