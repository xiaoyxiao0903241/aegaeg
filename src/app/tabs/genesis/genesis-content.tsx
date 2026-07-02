import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { GenesisContributionsSection } from '~/app/tabs/genesis/genesis-contributions-section'
import { GenesisFaqSection } from '~/app/tabs/genesis/genesis-faq-section'
import { GenesisGlobalSection } from '~/app/tabs/genesis/genesis-global-section'
import { GenesisSeasonMetricsSection } from '~/app/tabs/genesis/genesis-season-metrics-section'

export function GenesisContent() {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()
  const seasonStatsTitle = t.genesis.statsTitle.replace(
    '{season}',
    String(genesis.activeSeasonNumber),
  )

  return (
    <DappDetailPage>
      <DappContentHeading id="genesis-title">{seasonStatsTitle}</DappContentHeading>
      <GenesisSeasonMetricsSection />
      <GenesisGlobalSection />
      <GenesisContributionsSection />
      <GenesisFaqSection />
    </DappDetailPage>
  )
}
