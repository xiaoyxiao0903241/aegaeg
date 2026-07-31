import { useI18n } from '~/i18n/use-i18n'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { formatGenesisSeasonIntro } from '~/core/presale/genesis-promo'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { GenesisPurchaseForm } from '~/views/dapp/genesis/genesis-purchase-form'
import { resolveWalletRemountKey } from '~/shared/lib/resolve-wallet-remount-key'
import { useActiveAccount } from '~/web3/thirdweb-react'

export function GenesisWidget({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const account = useActiveAccount()
  const formKey = resolveWalletRemountKey(account?.address)

  const hasUpcomingSeason = genesis.seasonOptions.some((season) => season.status === 'Upcoming')
  const programEnded = !genesis.isLoading && genesis.activePhase === null && !hasUpcomingSeason
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
