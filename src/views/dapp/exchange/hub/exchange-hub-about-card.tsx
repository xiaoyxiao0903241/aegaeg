import { useI18n } from '~/i18n/use-i18n'
import { ExchangePromoCard } from '~/views/dapp/exchange/exchange-promo-card'
import { ExchangePromoConnectButton } from '~/views/dapp/exchange/hub/exchange-promo-connect-button'

export function ExchangeHubAboutCard() {
  const { messages: t } = useI18n()

  return (
    <ExchangePromoCard
      action={<ExchangePromoConnectButton />}
      body={t.exchange.hub.about.body}
      title={t.exchange.hub.about.title}
    />
  )
}
