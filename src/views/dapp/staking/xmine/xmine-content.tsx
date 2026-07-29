import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

const PLACEHOLDER = '—'

export function XmineContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.xmine}
        faq={t.staking.xmine.faq}
        mechanismSteps={t.staking.xmine.mechanismSteps}
        mechanismTitle={t.staking.xmine.mechanismTitle}
        overviewItems={t.staking.xmine.overviewMetrics.map((metric) => ({
          label: metric.label,
          value: PLACEHOLDER,
        }))}
        overviewLayout="cards"
        positionItems={t.staking.xmine.positionMetrics.map((metric) => ({
          label: metric.label,
          value: PLACEHOLDER,
        }))}
        recordsTitle={t.staking.aside.recordsTitles.xmine}
        showXValueCard
      />
    </DappDetailPage>
  )
}
