import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { useI18n } from '~/i18n/use-i18n'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { BSC_CONTRACTS } from '~/config/contracts'
import { bscscanToken } from '~/config/explorer'
import { SwapPromoCard, swapPromoCardPillActionClass } from '~/app/components/swap-promo-card'

export function TokenAboutCard({
  body,
  title,
}: {
  body: string
  title: string
}) {
  const { messages: t } = useI18n()
  const isDesktop = !useMobileViewport()
  const variant = isDesktop ? 'desktop' : 'mobile'

  const contractButton = (
    <button
      className={swapPromoCardPillActionClass(variant, true)}
      onClick={() => {
        window.open(bscscanToken(BSC_CONTRACTS.usd1Official), '_blank', 'noopener,noreferrer')
      }}
      type="button"
    >
      {t.swap.tokenContract}
      <img alt="" height={isDesktop ? 15 : 13} src={dappAssets.arrowUpRight} width={isDesktop ? 15 : 13} />
    </button>
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
