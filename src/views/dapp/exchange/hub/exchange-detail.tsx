/**
 * 兑换 Hub 详情页
 *
 * 上部为兑换模式入口卡片（闪兑 / 市价交易 / 销毁 / Turbine），
 * 点击跳转到对应模式；下部为常见问题折叠列表。
 */
import { useI18n } from '~/i18n/use-i18n'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { ExchangeProgramCards } from '~/views/dapp/exchange/hub/exchange-program-cards'

export function ExchangeDetail() {
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
