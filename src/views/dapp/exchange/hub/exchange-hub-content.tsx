import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/ui/faq-list'
import { ExchangeProgramCards } from '~/views/dapp/exchange/hub/exchange-program-cards'

/** PC hub right `4267:212` — section titles use Text `section` token (no px override). */
export function ExchangeHubContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
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
