import { useI18n } from '~/i18n/use-i18n'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { FaqList } from '~/shared/ui/faq-list'
import { ExchangeProgramCards } from '~/views/dapp/exchange/hub/exchange-program-cards'

/** PC `4267:212`: program grid + FAQs only（无「关于兑换」卡、无共建黑卡）. */
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
        <FaqList items={t.exchange.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
