import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import { ExchangeHubAboutCard } from '~/views/dapp/exchange/hub/exchange-hub-about-card'
import { ExchangeProgramCards } from '~/views/dapp/exchange/hub/exchange-program-cards'

export function ExchangeHubContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()

  return (
    <DappDetailPage>
      {!sessionReady ? (
        <section className="pt-2.5">
          <ExchangeHubAboutCard />
        </section>
      ) : null}

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.hub.program.title}</DappContentHeading>
        <ExchangeProgramCards />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.exchange.faq.title}</DappContentHeading>
        <FaqList defaultOpenFirst={false} items={t.exchange.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
