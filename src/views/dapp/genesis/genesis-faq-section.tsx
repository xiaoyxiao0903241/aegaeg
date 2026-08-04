import { DappCollapsibleSection } from '~/app/shell/dapp-collapsible-section'
import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/components/faq-list'
import { applyMessageTemplate } from '~/shared/lib/apply-message-template'
import { genesisFaqTemplateValues } from '~/views/dapp/genesis/genesis-faq'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

export function GenesisFaqSection({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()

  const genesisFaqValues = genesisFaqTemplateValues(
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
