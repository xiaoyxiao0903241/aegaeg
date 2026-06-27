import { useI18n } from '~/i18n/use-i18n'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { formatGenesisSeasonIntro } from '~/lib/presale/genesis-promo'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { GenesisPurchaseForm } from '~/app/tabs/genesis/genesis-purchase-form'

export function GenesisWidget() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  const seasonIntro = formatGenesisSeasonIntro(
    t.genesis.intro,
    genesis.activeSeasonNumber,
    genesis.discountLabel,
    genesis.isLoading,
  )

  return (
    <DappWidgetFrame subtitle={seasonIntro} title={t.genesis.title}>
      <GenesisPurchaseForm />
    </DappWidgetFrame>
  )
}
