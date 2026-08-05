import { formatGenesisSeasonIntro } from '~/core/presale/genesis-promo'
import { isGenesisProgramEnded } from '~/core/presale/is-genesis-program-ended'
import { useI18n } from '~/i18n/use-i18n'
import { walletRemountKey } from '~/shared/lib/wallet-remount-key'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { GenesisPurchaseForm } from '~/views/dapp/genesis/primitives'
import { DockFrame } from '~/views/dapp/shared/dock-frame'
import { useActiveAccount } from '~/web3/thirdweb-react'

/**
 * 创世侧栏面板
 *
 * 顶部为创世活动介绍与倒计时，下方为购买表单；
 * 项目结束时展示结束文案，不再提供购买入口。
 */
export function GenesisDock({ genesis }: { genesis: GenesisWidgetState }) {
  const { messages: t } = useI18n()
  const account = useActiveAccount()
  const formKey = walletRemountKey(account?.address)

  const programEnded = isGenesisProgramEnded({
    isLoading: genesis.isLoading,
    activePhase: genesis.activePhase,
    seasonOptions: genesis.seasonOptions,
  })
  const seasonIntro = programEnded
    ? t.genesis.introEnded
    : formatGenesisSeasonIntro(
        t.genesis.intro,
        genesis.activeSeasonNumber,
        genesis.discountLabel,
        genesis.isLoading,
      )

  return (
    <DockFrame subtitle={seasonIntro} title={t.genesis.title}>
      <GenesisPurchaseForm key={formKey} genesis={genesis} />
    </DockFrame>
  )
}
