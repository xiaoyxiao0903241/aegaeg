import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useI18n } from '~/i18n/use-i18n'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useBondDetailAsideView } from '~/views/dapp/staking/bond/use-bond-detail-aside-view'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

export function BondContent({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const { copy, overviewItems, positionItems, recordRows, recordsLoading } =
    useBondDetailAsideView(kind)
  const recordsTitle =
    kind === 'lp' ? t.staking.aside.recordsTitles.lpbond : t.staking.aside.recordsTitles.burnbond
  const chartTitle =
    kind === 'lp' ? t.staking.aside.chartTitles.lpbond : t.staking.aside.chartTitles.burnbond

  return (
    <DappDetailPage>
      <StakingDetailAside
        chartTitle={chartTitle}
        faq={copy.faq}
        mechanismSteps={copy.mechanismSteps}
        mechanismTitle={copy.mechanismTitle}
        overviewItems={overviewItems}
        overviewLayout="cards-2"
        positionItems={positionItems}
        positionLayout="cards-2"
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
    </DappDetailPage>
  )
}
