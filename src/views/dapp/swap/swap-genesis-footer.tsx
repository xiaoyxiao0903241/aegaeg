import { DappWidgetConnectFooter } from '~/app/shell/dapp-widget-connect-footer'
import { GenesisPromoCard } from '~/views/dapp/genesis/genesis-promo-card'
import { useGenesisPromo } from '~/hooks/use-genesis-promo'
import { useI18n } from '~/i18n/use-i18n'

export function SwapGenesisFooter({ onSelectGenesis }: { onSelectGenesis: () => void }) {
  const { messages: t } = useI18n()
  const genesis = useGenesisPromo()

  return (
    <DappWidgetConnectFooter>
      <GenesisPromoCard
        actionLabel={t.genesis.joinGenesis}
        className="gap-1.5 [&_p]:leading-tight"
        isLoading={genesis.isLoading}
        onClick={onSelectGenesis}
        promo={genesis.promoSnapshot}
      />
    </DappWidgetConnectFooter>
  )
}
