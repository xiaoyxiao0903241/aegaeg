import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useI18n } from '~/i18n/use-i18n'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'
import { useXmineDetailAsideView } from '~/views/dapp/staking/xmine/use-xmine-detail-aside-view'

export function XmineContent() {
  const { messages: t } = useI18n()
  const { overviewItems, positionItems, recordRows, recordsLoading } = useXmineDetailAsideView()

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.xmine}
        faq={t.staking.xmine.faq}
        mechanismSteps={t.staking.xmine.mechanismSteps}
        mechanismTitle={t.staking.xmine.mechanismTitle}
        overviewItems={overviewItems}
        overviewLayout="triple-plus"
        positionItems={positionItems}
        recordColWidths={['10.9375rem', '6.25rem', '8.75rem', '1fr']}
        recordColumns={t.staking.aside.xmineRecordColumns}
        recordRows={recordRows}
        recordsEmptyTitle={recordsLoading ? '…' : t.staking.aside.recordsEmpty.xmine}
        recordsTitle={t.staking.aside.recordsTitles.xmine}
        showXValueCard
      />
    </DappDetailPage>
  )
}
