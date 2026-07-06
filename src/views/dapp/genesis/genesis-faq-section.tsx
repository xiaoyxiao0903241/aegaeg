import { useMemo } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { FaqList } from '~/components/faq-list'
import { applyMessageTemplate } from '~/lib/presale/genesis-promo'
import { buildGenesisFaqTemplateValues } from '~/lib/presale/genesis-faq'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'

export function GenesisFaqSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  const genesisFaqValues = useMemo(
    () =>
      buildGenesisFaqTemplateValues(
        genesis.phases,
        genesis.airdropThresholdUsd,
        genesis.isLoading && genesis.phases.length === 0,
      ),
    [genesis.airdropThresholdUsd, genesis.isLoading, genesis.phases],
  )

  const genesisFaqItems = useMemo(
    () =>
      t.genesis.faq.items.map((item) => ({
        q: item.q,
        a: applyMessageTemplate(item.a, genesisFaqValues),
      })),
    [genesisFaqValues, t.genesis.faq.items],
  )

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.genesis.faq.title}>
      <FaqList items={genesisFaqItems} variant="dapp" />
    </DappCollapsibleSection>
  )
}
