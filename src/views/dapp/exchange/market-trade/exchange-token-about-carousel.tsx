import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { exchangeTokenCardKeys } from '~/app/data'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/shared/components/carousel'
import { iconVariants } from '~/shared/components/icon'
import {
  getExchangeTokenContractAddress,
  openTokenContractOnBscScan,
} from '~/shared/config/token-contracts'
import { revealClass } from '~/shared/lib/reveal'
import {
  ExchangePromoCard,
  ExchangePromoPillAction,
} from '~/views/dapp/exchange/exchange-promo-card'

const exchangeTokenAboutCarousel = tv({
  slots: {
    root: [revealClass(), 'grid w-full overflow-visible'],
    viewport: '',
    track: ['flex items-stretch', '-ml-8'],
    slide: ['flex w-full max-w-full min-w-0 shrink-0 grow-0 basis-full flex-col', 'pl-8'],
    indicatorBar: 'inline-flex items-center justify-center',
    navButton:
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
    dotGroup: 'inline-flex items-center gap-1.5',
    dotButton: [
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
      iconVariants({ size: 'base' }),
    ],
    dot: 'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
    chevron: 'block',
  },
  variants: {
    layout: {
      desktop: {
        root: 'gap-3 dapp:mt-0 dapp:gap-0',
        viewport: 'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7 dapp:pb-(--shadow-bleed-subtle)',
        indicatorBar: [
          'gap-3.5 self-center',
          'dapp:relative dapp:z-1 dapp:-mt-(--shadow-bleed-subtle) dapp:pt-(--carousel-pc-indicator-pt)',
        ],
        navButton: iconVariants({ size: 'base' }),
        chevron: iconVariants({ size: 'base' }),
      },
      mobile: {
        root: 'max-dapp:mt-0',
        viewport:
          '-mx-(--shadow-bleed-h5) w-[calc(100%+2*var(--shadow-bleed-h5))] px-(--shadow-bleed-h5) pt-(--carousel-h5-viewport-pad-y) pb-(--shadow-bleed-subtle)',
        indicatorBar: [
          'gap-2.5 text-muted-foreground',
          'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))] pt-(--carousel-h5-indicator-pt)',
        ],
        navButton:
          'duration-dapp-fast size-(--dapp-icon-lg) rounded-full transition-[background-color,color] ease-out hover:bg-background hover:text-muted-foreground',
        chevron: iconVariants({ size: 'md' }),
      },
    },
    dotActive: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      layout: 'desktop',
      dotActive: true,
      class: { dot: 'h-1.5 w-5.5 bg-primary' },
    },
    {
      layout: 'mobile',
      dotActive: true,
      class: { dot: 'h-1.5 w-4.5 bg-primary' },
    },
    {
      layout: 'desktop',
      dotActive: false,
      class: { dot: 'size-1.5' },
    },
    {
      layout: 'mobile',
      dotActive: false,
      class: { dot: 'size-1.5' },
    },
  ],
})

type ExchangeTokenCarouselKey = 'agx' | 'usd1' | 'x' | 'gagx' | 'gagxStake'

type ExchangeTokenCarouselItem = {
  asset: string
  body: string
  key: ExchangeTokenCarouselKey
  title: string
}

type CarouselLayout = 'desktop' | 'mobile'

function TokenCarouselCard({
  contractLabel,
  contractTooltip,
  isActive,
  token,
  variant,
}: {
  contractLabel: string
  contractTooltip: string
  isActive: boolean
  token: ExchangeTokenCarouselItem
  variant: CarouselLayout
}) {
  const isDesktop = variant === 'desktop'
  const contractDisabled = !getExchangeTokenContractAddress(token.key)

  const contractButton = (
    <ExchangePromoPillAction
      className={contractDisabled ? 'pointer-events-none opacity-45' : undefined}
      disabled={contractDisabled}
      layout={variant}
      onClick={() => openTokenContractOnBscScan(token.key)}
      withArrow
    >
      {contractLabel}
      <img
        alt=""
        height={isDesktop ? 15 : 13}
        src={dappAssets.arrowUpRight}
        width={isDesktop ? 15 : 13}
      />
    </ExchangePromoPillAction>
  )

  return (
    <div aria-hidden={!isActive}>
      <ExchangePromoCard
        action={contractButton}
        actionTooltip={contractTooltip}
        body={token.body}
        rays="muted"
        reveal={false}
        shellClassName={isDesktop ? 'min-h-30' : undefined}
        title={token.title}
        titleIconSrc={token.asset}
      />
    </div>
  )
}

function useCarouselSnap(api: CarouselApi | undefined) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }
    api.on('select', handleSelect)
    return () => {
      api.off('select', handleSelect)
    }
  }, [api])

  const goTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  return { current, goTo }
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

function CarouselNavButton({
  ariaLabel,
  direction,
  layout,
  onClick,
}: {
  ariaLabel: string
  direction: 'prev' | 'next'
  layout: CarouselLayout
  onClick: () => void
}) {
  const styles = exchangeTokenAboutCarousel({ layout })
  const Glyph = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button aria-label={ariaLabel} className={styles.navButton()} onClick={onClick} type="button">
      <Glyph aria-hidden className={styles.chevron()} strokeWidth={2} />
    </button>
  )
}

function CarouselDot({
  active,
  ariaLabel,
  layout,
  onClick,
}: {
  active: boolean
  ariaLabel: string
  layout: CarouselLayout
  onClick: () => void
}) {
  const styles = exchangeTokenAboutCarousel({ layout, dotActive: active })
  return (
    <button
      aria-current={active ? 'true' : undefined}
      aria-label={ariaLabel}
      className={styles.dotButton()}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className={styles.dot()} />
    </button>
  )
}

export function TokenAboutCarousel({
  cardKeys = exchangeTokenCardKeys,
}: {
  cardKeys?: readonly ExchangeTokenCarouselKey[]
} = {}) {
  const isDesktop = !useMobileViewport()
  const layout: CarouselLayout = isDesktop ? 'desktop' : 'mobile'
  const styles = exchangeTokenAboutCarousel({ layout })
  const { messages: t } = useI18n()
  const tokens = getExchangeTokenContent(t, cardKeys)
  const [api, setApi] = useState<CarouselApi>()
  const { current, goTo } = useCarouselSnap(api)
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    [],
  )

  return (
    <Carousel
      aria-label={t.exchange.tokenAbout.title}
      className={styles.root()}
      data-reveal
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
      plugins={isDesktop ? [autoplay] : undefined}
      setApi={setApi}
    >
      <CarouselContent
        className={styles.track()}
        spacing="none"
        viewportClassName={styles.viewport()}
      >
        {tokens.map((token, index) => (
          <CarouselItem className={styles.slide()} key={token.key} spacing="none">
            <TokenCarouselCard
              contractLabel={t.exchange.tokenContract}
              contractTooltip={t.exchange.tokenContractTooltip}
              isActive={current === index}
              token={token}
              variant={layout}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className={styles.indicatorBar()}>
        <CarouselNavButton
          ariaLabel={t.exchange.tokenPrevious}
          direction="prev"
          layout={layout}
          onClick={() => api?.scrollPrev()}
        />
        <span aria-label={t.exchange.tokenAbout.title} className={styles.dotGroup()} role="group">
          {tokens.map((token, index) => (
            <CarouselDot
              active={current === index}
              ariaLabel={`${t.exchange.tokenAbout.title} ${index + 1}`}
              key={token.key}
              layout={layout}
              onClick={() => goTo(index)}
            />
          ))}
        </span>
        <CarouselNavButton
          ariaLabel={t.exchange.tokenNext}
          direction="next"
          layout={layout}
          onClick={() => api?.scrollNext()}
        />
      </div>
    </Carousel>
  )
}
