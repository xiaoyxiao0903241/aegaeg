import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscscanToken } from '~/shared/config/explorer'
import {
  SwapPromoCard,
  SwapPromoPillAction,
  swapPromoLayoutFromViewport,
} from '~/views/dapp/swap/swap-promo-card'

export function TokenAboutCard({
  body,
  title,
}: {
  body: string
  title: string
}) {
  const { messages: t } = useI18n()
  const isDesktop = !useMobileViewport()
  const layout = swapPromoLayoutFromViewport(isDesktop)

  const contractButton = (
    <SwapPromoPillAction
      layout={layout}
      onClick={() => {
        window.open(bscscanToken(BSC_CONTRACTS.usd1), '_blank', 'noopener,noreferrer')
      }}
      withArrow
    >
      {t.swap.tokenContract}
      <img alt="" height={isDesktop ? 15 : 13} src={dappAssets.arrowUpRight} width={isDesktop ? 15 : 13} />
    </SwapPromoPillAction>
  )

  return (
    <SwapPromoCard
      action={contractButton}
      actionTooltip={t.swap.tokenContractTooltip}
      body={body}
      shellClassName={isDesktop ? 'min-h-30' : undefined}
      title={title}
      titleIconSrc={tokenCarouselIcons.usd1Icon}
    />
  )
}
