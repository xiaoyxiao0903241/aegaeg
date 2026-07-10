import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import { SwapHubAboutCard } from '~/views/dapp/swap/hub/swap-hub-about-card'
import { SwapProgramCards } from '~/views/dapp/swap/hub/swap-program-cards'

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

      <DappDetailBlock>
        <DappContentHeading>{t.swap.hub.program.title}</DappContentHeading>
        <SwapProgramCards />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.swap.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.swap.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
