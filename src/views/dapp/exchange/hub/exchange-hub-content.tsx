import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { ExchangeProgramCards } from '~/views/dapp/exchange/hub/exchange-program-cards'

/** PC hub right `4267:212` — section titles use Text `section` token (no px override). */
export function ExchangeHubContent() {
  const { messages: t } = useI18n()

  return (
    <Detail>
      <Section>
        <Section.Title>{t.exchange.hub.program.title}</Section.Title>
        <ExchangeProgramCards />
      </Section>

      <Section>
        <Section.Title>{t.exchange.faq.title}</Section.Title>
        <FaqList defaultOpenFirst={false} items={t.exchange.hub.faq.items} variant="dapp" />
      </Section>
    </Detail>
  )
}
