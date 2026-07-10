import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { GenesisContributionsSection } from '~/views/dapp/genesis/genesis-contributions-section'
import { GenesisFaqSection } from '~/views/dapp/genesis/genesis-faq-section'
import { GenesisGlobalSection } from '~/views/dapp/genesis/genesis-global-section'
import { GenesisSeasonMetricsSection } from '~/views/dapp/genesis/genesis-season-metrics-section'

export function GenesisContent({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const seasonStatsTitle = t.genesis.statsTitle.replace(
    '{season}',
    String(genesis.activeSeasonNumber),
  )

  return (
    <DappDetailPage>
      <DappContentHeading id="genesis-title">{seasonStatsTitle}</DappContentHeading>
      <GenesisSeasonMetricsSection genesis={genesis} />
      <GenesisGlobalSection genesis={genesis} />
      <GenesisContributionsSection genesis={genesis} />
      <GenesisFaqSection genesis={genesis} />
    </DappDetailPage>
  )
}
