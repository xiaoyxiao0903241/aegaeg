import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { StakingDetailAside } from '~/views/dapp/staking/staking-detail-aside'

export function StakeContent() {
  const { messages: t } = useI18n()
  return (
    <DappDetailPage>
      <StakingDetailAside
        faq={t.staking.stake.faq}
        mechanism={t.staking.stake.mechanism}
        overviewItems={[
          { label: t.staking.stake.meta.apy, value: '—' },
          { label: t.staking.stake.meta.bonus, value: '—' },
          { label: t.staking.stake.meta.remaining, value: '—' },
        ]}
      />
    </DappDetailPage>
  )
}
