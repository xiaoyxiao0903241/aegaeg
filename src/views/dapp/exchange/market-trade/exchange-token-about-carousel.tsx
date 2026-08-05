import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { exchangeTokenCardKeys } from '~/app/data'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import { Carousel } from '~/shared/components/carousel'
import {
  getExchangeTokenContractAddress,
  openTokenContractOnBscScan,
} from '~/shared/config/token-contracts'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import {
  ExchangePromoCard,
  ExchangePromoPillAction,
} from '~/views/dapp/exchange/exchange-promo-card'

type ExchangeTokenCarouselKey = 'agx' | 'usd1' | 'x' | 'gagx' | 'gagxStake'

type ExchangeTokenCarouselItem = {
  asset: string
  body: string
  key: ExchangeTokenCarouselKey
  title: string
}

function TokenCarouselCard({
  contractLabel,
  contractTooltip,
  isDesktop,
  token,
}: {
  contractLabel: string
  contractTooltip: string
  isDesktop: boolean
  token: ExchangeTokenCarouselItem
}) {
  const contractDisabled = !getExchangeTokenContractAddress(token.key)

  const contractButton = (
    <ExchangePromoPillAction
      className={contractDisabled ? 'pointer-events-none opacity-45' : undefined}
      disabled={contractDisabled}
      layout={isDesktop ? 'desktop' : 'mobile'}
      onClick={() => openTokenContractOnBscScan(token.key)}
      withArrow
    >
      {contractLabel}
      <img alt="" className="size-2.5" src={dappAssets.arrowUpRight} />
    </ExchangePromoPillAction>
  )

  return (
    <ExchangePromoCard
      action={contractButton}
      actionTooltip={contractTooltip}
      body={token.body}
      rays="muted"
      reveal={false}
      title={token.title}
      titleIconSrc={token.asset}
    />
  )
}

function getExchangeTokenContent(
  t: ReturnType<typeof useI18n>['messages'],
  keys: readonly ExchangeTokenCarouselKey[],
) {
  const assets: Record<ExchangeTokenCarouselKey, string> = {
    agx: tokenCarouselIcons.agxIcon,
    usd1: tokenCarouselIcons.usd1Icon,
    x: tokenCarouselIcons.xIcon,
    gagx: tokenCarouselIcons.gagxIcon,
    gagxStake: tokenCarouselIcons.gagxIcon,
  }

  return keys.map((key) => {
    const copy = t.exchange.tokenAbout.items.find((item) => item.key === key)!
    return {
      asset: assets[key],
      body: copy.body,
      key,
      title: copy.title,
    }
  })
}

/**
 * 代币介绍轮播（闪电兑换 / 市价交易 / 销毁 / Turbine 共用）
 *
 * 按传入的卡片键从 i18n 取文案并组装卡片，轮播行为由 Carousel
 * 提供；每张卡片可跳转到代币合约浏览器。
 */
export function TokenAboutCarousel({
  cardKeys = exchangeTokenCardKeys,
}: {
  cardKeys?: readonly ExchangeTokenCarouselKey[]
} = {}) {
  const isDesktop = !useMobileViewport()
  const { messages: t } = useI18n()
  const tokens = getExchangeTokenContent(t, cardKeys)

  return (
    <Carousel
      aria-label={t.exchange.tokenAbout.title}
      autoplayMs={4000}
      className={cn(revealClass(), isDesktop ? 'dapp:mt-0' : 'max-dapp:mt-0')}
      data-reveal
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
    >
      <Carousel.Content>
        {tokens.map((token, index) => (
          <Carousel.Item index={index} key={token.key}>
            <TokenCarouselCard
              contractLabel={t.exchange.tokenContract}
              contractTooltip={t.exchange.tokenContractTooltip}
              isDesktop={isDesktop}
              token={token}
            />
          </Carousel.Item>
        ))}
      </Carousel.Content>
      <Carousel.Indicators
        dotLabel={(index) => `${t.exchange.tokenAbout.title} ${index + 1}`}
        nextLabel={t.exchange.tokenNext}
        prevLabel={t.exchange.tokenPrevious}
      />
    </Carousel>
  )
}
