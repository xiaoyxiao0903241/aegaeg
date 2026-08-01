import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useI18n } from '~/i18n/use-i18n'
import { useStakeDetailAsideView } from '~/views/dapp/staking/stake/use-stake-detail-aside-view'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

export function StakeContent() {
  const { messages: t } = useI18n()
  const { overviewItems, positionItems, recordRows, recordsLoading } = useStakeDetailAsideView()

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={t.staking.aside.chartTitles.stake}
        faq={t.staking.stake.faq}
        mechanismSteps={t.staking.stake.mechanismSteps}
        mechanismTitle={t.staking.stake.mechanismTitle}
        overviewItems={overviewItems}
        overviewLayout="cards-2"
        positionItems={positionItems}
        recordRows={recordRows}
        recordsEmptyTitle={recordsLoading ? '…' : t.staking.aside.recordsEmpty.stake}
        recordsTitle={t.staking.aside.recordsTitles.stake}
      />
    </DappDetailPage>
  )
}
