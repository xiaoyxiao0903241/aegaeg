import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { GenesisContributionsSection } from '~/views/dapp/genesis/genesis-contributions-section'
import { GenesisFaqSection } from '~/views/dapp/genesis/genesis-faq-section'
import { GenesisGlobalSection } from '~/views/dapp/genesis/genesis-global-section'

export function GenesisContent({ genesis }: { genesis: GenesisWidgetState }) {
  return (
    <DappDetailPage>
      <GenesisGlobalSection genesis={genesis} />
      <GenesisContributionsSection genesis={genesis} />
      <GenesisFaqSection genesis={genesis} />
    </DappDetailPage>
  )
}
