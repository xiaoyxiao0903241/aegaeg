import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'
import type { BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'

export function BondContent({ kind }: { kind: BondKind }) {
  const { messages: t } = useI18n()
  const copy = kind === 'lp' ? t.staking.lpbond : t.staking.burnbond
  return (
    <DappDetailPage>
      <StakingDetailAside
        faq={copy.faq}
        mechanism={copy.mechanism}
        overviewItems={[
          { label: copy.meta.discount, value: '—' },
          { label: copy.meta.slippage, value: '—' },
          { label: copy.meta.cap, value: '—' },
        ]}
      />
    </DappDetailPage>
  )
}
