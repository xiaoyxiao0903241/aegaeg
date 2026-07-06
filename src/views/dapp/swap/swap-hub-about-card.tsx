import { useI18n } from '~/i18n/use-i18n'
import { SwapPromoCard } from '~/views/dapp/swap/swap-promo-card'
import { SwapPromoConnectButton } from '~/views/dapp/swap/swap-promo-connect-button'

export function SwapHubAboutCard() {
  const { messages: t } = useI18n()

  return (
    <SwapPromoCard
      action={<SwapPromoConnectButton />}
      body={t.swap.hub.about.body}
      title={t.swap.hub.about.title}
    />
  )
}
