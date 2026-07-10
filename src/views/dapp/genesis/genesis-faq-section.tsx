import { useI18n } from '~/i18n/use-i18n'
import { DappCollapsibleSection } from '~/app/shell/dapp-collapsible-section'
import { FaqList } from '~/shared/ui/faq-list'
import { applyMessageTemplate } from '~/views/dapp/genesis/genesis-promo'
import { buildGenesisFaqTemplateValues } from '~/views/dapp/genesis/genesis-faq'
import { useGenesisWidgetContext } from '~/app/use-genesis-widget-context'

export function GenesisFaqSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  const genesisFaqValues = buildGenesisFaqTemplateValues(
    genesis.phases,
    genesis.airdropThresholdUsd,
    genesis.isLoading && genesis.phases.length === 0,
  )

  const genesisFaqItems = t.genesis.faq.items.map((item) => ({
    q: item.q,
    a: applyMessageTemplate(item.a, genesisFaqValues),
  }))

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.genesis.faq.title}>
      <FaqList items={genesisFaqItems} variant="dapp" />
    </DappCollapsibleSection>
  )
}
