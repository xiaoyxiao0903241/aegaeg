import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/ui/faq-list'
import { ExchangeProgramCards } from '~/views/dapp/exchange/hub/exchange-program-cards'

/** PC hub right `4267:212` / `4323:708`: program grid + FAQs（无「关于兑换」卡、无共建黑卡）· titles 18. */
const hubSectionTitleClass = 'text-[1.125rem] leading-normal tracking-normal'

export function ExchangeHubContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading className={hubSectionTitleClass}>
          {t.exchange.hub.program.title}
        </DappContentHeading>
        <ExchangeProgramCards />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading className={hubSectionTitleClass}>
          {t.exchange.faq.title}
        </DappContentHeading>
        <FaqList items={t.exchange.hub.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
