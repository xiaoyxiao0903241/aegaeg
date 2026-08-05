import { useI18n } from '~/i18n/use-i18n'
import { Section } from '~/shared/components/section'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanAddress } from '~/shared/config/explorer'
import { GenesisGlobalCard } from '~/views/dapp/genesis/genesis-global-card'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

function openPreSaleContract() {
  window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
}

export function GenesisGlobalSection({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()

  return (
    <Section>
      <GenesisGlobalCard
        body={t.genesis.globalBody}
        contractLabel={t.genesis.viewContract}
        kicker={t.genesis.globalLabel}
        onViewContract={openPreSaleContract}
        value={`$${genesis.globalPurchasedLabel}`}
      />
    </Section>
  )
}
