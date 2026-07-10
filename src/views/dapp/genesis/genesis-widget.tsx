import { useI18n } from '~/i18n/use-i18n'
import { useGenesisWidgetContext } from '~/app/use-genesis-widget-context'
import { formatGenesisSeasonIntro } from '~/views/dapp/genesis/genesis-promo'
import { DappWidgetFrame } from '~/app/shell/dapp-widget-frame'
import { GenesisPurchaseForm } from '~/views/dapp/genesis/genesis-purchase-form'
import { resolveWalletRemountKey } from '~/shared/lib/resolve-wallet-remount-key'
import { useActiveAccount } from '~/web3/thirdweb-react'

export function GenesisWidget() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()
  const account = useActiveAccount()
  const formKey = resolveWalletRemountKey(account?.address)

  const seasonIntro = formatGenesisSeasonIntro(
    t.genesis.intro,
    genesis.activeSeasonNumber,
    genesis.discountLabel,
    genesis.isLoading,
  )

  return (
    <DappWidgetFrame subtitle={seasonIntro} title={t.genesis.title}>
      <GenesisPurchaseForm key={formKey} />
    </DappWidgetFrame>
  )
}
