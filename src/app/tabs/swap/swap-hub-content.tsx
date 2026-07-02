import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { FaqList } from '~/components/faq-list'
import { useDappShell } from '~/app/dapp-shell-context'
import { SwapHubAboutCard } from '~/app/tabs/swap/swap-hub-about-card'
import { SwapProgramCards } from '~/app/tabs/swap/swap-program-cards'
import { dappDetailSectionGapClass, dappDetailTitleGapClass } from '~/app/dapp-detail-layout'

export function SwapHubContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()

  return (
    <DappDetailPage>
      {!sessionReady ? (
        <section className="pt-2.5">
          <SwapHubAboutCard />
        </section>
      ) : null}

      <section className={sessionReady ? undefined : dappDetailSectionGapClass}>
        <h2
          className={cn(
            'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
            'max-dapp:text-base max-dapp:tracking-[-0.04em]',
            dappDetailTitleGapClass,
          )}
        >
          {t.swap.hub.program.title}
        </h2>
        <SwapProgramCards />
      </section>

      <section className={dappDetailSectionGapClass}>
        <h2
          className={cn(
            'm-0 text-lg font-semibold leading-[1.3] tracking-[-0.04em] text-foreground',
            'max-dapp:text-base max-dapp:tracking-[-0.04em]',
            dappDetailTitleGapClass,
          )}
        >
          {t.swap.faq.title}
        </h2>
        <FaqList defaultOpenFirst={false} items={t.swap.hub.faq.items} variant="dapp" />
      </section>
    </DappDetailPage>
  )
}
