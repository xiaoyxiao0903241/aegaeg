import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

const PLACEHOLDER = '—'

export function StakeContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.stake}
        faq={t.staking.stake.faq}
        mechanismSteps={t.staking.stake.mechanismSteps}
        mechanismTitle={t.staking.stake.mechanismTitle}
        overviewItems={t.staking.stake.overviewMetrics.map((metric) => ({
          label: metric.label,
          value: PLACEHOLDER,
        }))}
        overviewLayout="cards"
        positionItems={t.staking.aside.positionMetrics.map((metric) => ({
          label: metric.label,
          value: PLACEHOLDER,
        }))}
        recordsTitle={t.staking.aside.recordsTitles.stake}
      />
    </DappDetailPage>
  )
}
