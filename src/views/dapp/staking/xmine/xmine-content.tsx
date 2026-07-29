import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

export function XmineContent() {
  const { messages: t } = useI18n()
  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.xmine}
        faq={t.staking.xmine.faq}
        mechanism={t.staking.xmine.mechanism}
        overviewItems={[
          { label: t.staking.xmine.meta.quota, value: '—' },
          { label: t.staking.xmine.meta.daily, value: '—' },
          { label: t.staking.xmine.meta.h24, value: '—' },
        ]}
        recordsTitle={t.staking.aside.recordsTitles.xmine}
        showXValueCard
      />
    </DappDetailPage>
  )
}
