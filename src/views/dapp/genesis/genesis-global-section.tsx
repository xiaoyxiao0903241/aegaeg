import { useI18n } from '~/i18n/use-i18n'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { useGenesisWidgetContext } from '~/app/use-genesis-widget-context'
import { DappDetailBlock } from '~/app/shell/components/dapp-detail-block'
import { GenesisGlobalCard } from '~/views/dapp/genesis/genesis-global-card'

function openPreSaleContract() {
  window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
}

export function GenesisGlobalSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()
  const showValueSkeleton =
    (genesis.isLoading && genesis.phases.length === 0) || genesis.globalPurchasedLoading

  return (
    <DappDetailBlock>
      <GenesisGlobalCard
        body={t.genesis.globalBody}
        contractLabel={t.genesis.viewContract}
        kicker={t.genesis.globalLabel}
        onViewContract={openPreSaleContract}
        value={`$${genesis.globalPurchasedLabel}`}
        valueLoading={showValueSkeleton}
      />
    </DappDetailBlock>
  )
}
