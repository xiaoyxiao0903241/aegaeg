import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { FaqList } from '~/components/faq-list'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/dapp-shell-context'
import { SwapHubAboutCard } from '~/app/tabs/swap/swap-hub-about-card'
import { SwapProgramCards } from '~/app/tabs/swap/swap-program-cards'
import {
  swapAboutCardOffsetClass,
  swapDetailBlockGapClass,
  swapDetailSectionTitleClass,
} from '~/app/tabs/swap/swap-layout-tokens'

export function SwapHubContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()

  return (
    <DappDetailPage>
      {!sessionReady ? (
        <section className={swapAboutCardOffsetClass}>
          <SwapHubAboutCard />
        </section>
      ) : null}

      <section className={sessionReady ? undefined : swapDetailBlockGapClass}>
        <h2 className={swapDetailSectionTitleClass}>{t.swap.hub.program.title}</h2>
        <SwapProgramCards />
      </section>

      <section className={swapDetailBlockGapClass}>
        <h2 className={swapDetailSectionTitleClass}>{t.swap.faq.title}</h2>
        <FaqList defaultOpenFirst={false} items={t.swap.hub.faq.items} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
