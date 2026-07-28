import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanToken } from '~/shared/config/explorer'
import {
  ExchangePromoCard,
  ExchangePromoPillAction,
  exchangePromoLayoutFromViewport,
} from '~/views/dapp/exchange/exchange-promo-card'

export function TokenAboutCard({ body, title }: { body: string; title: string }) {
  const { messages: t } = useI18n()
  const isDesktop = !useMobileViewport()
  const layout = exchangePromoLayoutFromViewport(isDesktop)

  const contractButton = (
    <ExchangePromoPillAction
      layout={layout}
      onClick={() => {
        window.open(bscscanToken(BSC_CONTRACTS.usd1), '_blank', 'noopener,noreferrer')
      }}
      withArrow
    >
      {t.exchange.tokenContract}
      <img
        alt=""
        height={isDesktop ? 15 : 13}
        src={dappAssets.arrowUpRight}
        width={isDesktop ? 15 : 13}
      />
    </ExchangePromoPillAction>
  )

  return (
    <ExchangePromoCard
      action={contractButton}
      actionTooltip={t.exchange.tokenContractTooltip}
      body={body}
      shellClassName={isDesktop ? 'min-h-30' : undefined}
      title={title}
      titleIconSrc={tokenCarouselIcons.usd1Icon}
    />
  )
}
