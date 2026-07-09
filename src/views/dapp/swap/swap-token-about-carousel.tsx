import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/shared/ui/carousel'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { swapTokenCardKeys } from '~/app/data'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { getSwapTokenContractAddress, openTokenContractOnBscScan } from '~/shared/config/token-contracts'
import {
  SwapPromoCard,
  SwapPromoPillAction,
} from '~/views/dapp/swap/swap-promo-card'

const swapTokenAboutCarousel = tv({
  slots: {
    root: [revealClass(), 'grid w-full overflow-visible'],
    viewport: '',
    track: ['flex items-stretch', '-ml-8'],
    slide: [
      'flex min-w-0 w-full max-w-full shrink-0 grow-0 basis-full flex-col',
      'pl-8',
    ],
    indicatorBar: 'inline-flex items-center justify-center',
    navButton:
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-muted-foreground',
    dotGroup: 'inline-flex items-center gap-1.5',
    dotButton: [
      'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
      dappIcon({ size: 'base' }),
    ],
    dot: 'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
    chevron:
      "block bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]",
  },
  variants: {
    layout: {
      desktop: {
        root: 'dapp:mt-0 gap-3 dapp:gap-0',
        viewport:
          'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7 dapp:pb-[var(--shadow-bleed-subtle)]',
        indicatorBar: [
          'gap-3.5 self-center',
          'dapp:relative dapp:z-1 dapp:-mt-[var(--shadow-bleed-subtle)] dapp:pt-[var(--carousel-pc-indicator-pt)]',
        ],
        navButton: dappIcon({ size: 'base' }),
        chevron: dappIcon({ size: 'base' }),
      },
      mobile: {
        root: 'max-dapp:mt-0',
        viewport:
          '-mx-[var(--shadow-bleed-h5)] w-[calc(100%+2*var(--shadow-bleed-h5))] px-[var(--shadow-bleed-h5)] pt-[var(--carousel-h5-viewport-pad-y)] pb-[var(--shadow-bleed-subtle)]',
        indicatorBar: [
          'gap-2.5 text-muted-foreground',
          'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))] pt-[var(--carousel-h5-indicator-pt)]',
        ],
        navButton:
          'size-[var(--dapp-icon-lg)] rounded-full transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground',
        chevron: dappIcon({ size: 'md' }),
      },
    },
    chevronDirection: {
      prev: { chevron: '-rotate-90' },
      next: { chevron: 'rotate-90' },
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
      class: { dot: 'h-1.5 w-1.5' },
    },
    {
      layout: 'mobile',
      dotActive: false,
      class: { dot: 'size-1.5' },
    },
  ],
})

type SwapTokenCarouselItem = {
  asset: string
  body: string
  key: (typeof swapTokenCardKeys)[number]
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
  token: SwapTokenCarouselItem
  variant: CarouselLayout
}) {
  const isDesktop = variant === 'desktop'
  const contractDisabled = !getSwapTokenContractAddress(token.key)

  const contractButton = (
    <SwapPromoPillAction
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
    </SwapPromoPillAction>
  )

  return (
    <div aria-hidden={!isActive}>
      <SwapPromoCard
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

function getSwapTokenContent(t: ReturnType<typeof useI18n>['messages']) {
  const assets = {
    agx: tokenCarouselIcons.agxIcon,
    usd1: tokenCarouselIcons.usd1Icon,
    x: tokenCarouselIcons.xIcon,
  } as const

  return swapTokenCardKeys.map((key) => {
    const copy = t.swap.tokenAbout.items.find((item) => item.key === key)!
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
  const styles = swapTokenAboutCarousel({ layout, chevronDirection: direction })
  return (
    <button
      aria-label={ariaLabel}
      className={styles.navButton()}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className={styles.chevron()} />
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
  const styles = swapTokenAboutCarousel({ layout, dotActive: active })
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

export function TokenAboutCarousel() {
  const isDesktop = !useMobileViewport()
  const layout: CarouselLayout = isDesktop ? 'desktop' : 'mobile'
  const styles = swapTokenAboutCarousel({ layout })
  const { messages: t } = useI18n()
  const tokens = getSwapTokenContent(t)
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
      aria-label={t.swap.tokenAbout.title}
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
              contractLabel={t.swap.tokenContract}
              contractTooltip={t.swap.tokenContractTooltip}
              isActive={current === index}
              token={token}
              variant={layout}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className={styles.indicatorBar()}>
        <CarouselNavButton
          ariaLabel={t.swap.tokenPrevious}
          direction="prev"
          layout={layout}
          onClick={() => api?.scrollPrev()}
        />
        <span
          aria-label={t.swap.tokenAbout.title}
          className={styles.dotGroup()}
          role="group"
        >
          {tokens.map((token, index) => (
            <CarouselDot
              active={current === index}
              ariaLabel={`${t.swap.tokenAbout.title} ${index + 1}`}
              key={token.key}
              layout={layout}
              onClick={() => goTo(index)}
            />
          ))}
        </span>
        <CarouselNavButton
          ariaLabel={t.swap.tokenNext}
          direction="next"
          layout={layout}
          onClick={() => api?.scrollNext()}
        />
      </div>
    </Carousel>
  )
}
