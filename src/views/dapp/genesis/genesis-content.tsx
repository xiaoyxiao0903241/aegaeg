/**
 * 创世详情页
 *
 * 依次为全球认购进度、我的贡献表与常见问题三个区块；
 * 全部数据由会话宿主传入的 GenesisWidgetState 提供。
 */
import { Detail } from '~/shared/components/detail'
import { GenesisContributionsSection } from '~/views/dapp/genesis/genesis-contributions-section'
import { GenesisFaqSection } from '~/views/dapp/genesis/genesis-faq-section'
import { GenesisGlobalSection } from '~/views/dapp/genesis/genesis-global-section'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

export function GenesisContent({ genesis }: { genesis: GenesisWidgetState }) {
  return (
    <Detail>
      <GenesisGlobalSection genesis={genesis} />
      <GenesisContributionsSection genesis={genesis} />
      <GenesisFaqSection genesis={genesis} />
    </Detail>
  )
}
