import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { formatGenesisSeasonIntro } from '~/core/presale/genesis-promo'
import { isGenesisProgramEnded } from '~/core/presale/is-genesis-program-ended'
import { useI18n } from '~/i18n/use-i18n'
import { walletRemountKey } from '~/shared/lib/wallet-remount-key'
import { GenesisPurchaseForm } from '~/views/dapp/genesis/genesis-purchase-form'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { useActiveAccount } from '~/web3/thirdweb-react'

export function GenesisWidget({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const account = useActiveAccount()
  const formKey = walletRemountKey(account?.address)

  const programEnded = isGenesisProgramEnded({
    isLoading: genesis.isLoading,
    activePhase: genesis.activePhase,
    seasonOptions: genesis.seasonOptions,
  })
  const seasonIntro = programEnded
    ? t.genesis.introEnded
    : formatGenesisSeasonIntro(
        t.genesis.intro,
        genesis.activeSeasonNumber,
        genesis.discountLabel,
        genesis.isLoading,
      )

  return (
    <DappWidgetFrame subtitle={seasonIntro} title={t.genesis.title}>
      <GenesisPurchaseForm key={formKey} genesis={genesis} />
    </DappWidgetFrame>
  )
}
