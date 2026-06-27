import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/components/carousel'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { swapTokenCardKeys } from '~/app/data'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { getSwapTokenContractAddress, openTokenContractOnBscScan } from '~/config/token-contracts'
import { SwapPromoCard, swapPromoCardPillActionClass } from '~/app/components/swap-promo-card'

const TOKEN_CAROUSEL_PC_VIEWPORT_BLEED_CLASS =
  'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7 dapp:pb-[var(--shadow-bleed-subtle)]'

const TOKEN_CAROUSEL_PC_INDICATOR_CLASS =
  'dapp:relative dapp:z-1 dapp:-mt-[var(--shadow-bleed-subtle)] dapp:pt-[var(--carousel-pc-indicator-pt)]'

const TOKEN_CAROUSEL_H5_VIEWPORT_BLEED_CLASS =
  '-mx-[var(--shadow-bleed-h5)] w-[calc(100%+2*var(--shadow-bleed-h5))] px-[var(--shadow-bleed-h5)] pt-[var(--carousel-h5-viewport-pad-y)] pb-[var(--shadow-bleed-subtle)]'

const TOKEN_CAROUSEL_H5_INDICATOR_CLASS =
  'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))] pt-[var(--carousel-h5-indicator-pt)]'

const TOKEN_CAROUSEL_SLIDE_CLASS =
  'flex min-w-0 w-full max-w-full shrink-0 grow-0 basis-full flex-col'
const TOKEN_CAROUSEL_TRACK_CLASS = 'flex items-stretch'

type SwapTokenCarouselItem = {
  asset: string
  body: string
  key: (typeof swapTokenCardKeys)[number]
  title: string
}

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
  variant: 'desktop' | 'mobile'
}) {
  const isDesktop = variant === 'desktop'
  const contractDisabled = !getSwapTokenContractAddress(token.key)

  const contractButton = (
    <button
      className={cn(
        swapPromoCardPillActionClass(variant, true),
        contractDisabled && 'pointer-events-none opacity-45',
      )}
      disabled={contractDisabled}
      onClick={() => openTokenContractOnBscScan(token.key)}
      type="button"
    >
      {contractLabel}
      <img
        alt=""
        height={isDesktop ? 15 : 13}
        src={dappAssets.arrowUpRight}
        width={isDesktop ? 15 : 13}
      />
    </button>
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

export function TokenAboutCarousel() {
  const isDesktop = !useMobileViewport()
  const variant = isDesktop ? 'desktop' : 'mobile'
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
      className={cn(
        revealClass(),
        'grid w-full overflow-visible',
        isDesktop ? 'dapp:mt-0 gap-3 dapp:gap-0' : 'max-dapp:mt-0',
      )}
      data-reveal
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
      plugins={isDesktop ? [autoplay] : undefined}
      setApi={setApi}
    >
      <CarouselContent
        className={cn(TOKEN_CAROUSEL_TRACK_CLASS, '-ml-8')}
        spacing="none"
        viewportClassName={
          isDesktop ? TOKEN_CAROUSEL_PC_VIEWPORT_BLEED_CLASS : TOKEN_CAROUSEL_H5_VIEWPORT_BLEED_CLASS
        }
      >
        {tokens.map((token, index) => (
          <CarouselItem className={cn(TOKEN_CAROUSEL_SLIDE_CLASS, 'pl-8')} key={token.key} spacing="none">
            <TokenCarouselCard
              contractLabel={t.swap.tokenContract}
              contractTooltip={t.swap.tokenContractTooltip}
              isActive={current === index}
              token={token}
              variant={variant}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        className={cn(
          'inline-flex items-center justify-center',
          isDesktop
            ? cn('gap-3.5 self-center', TOKEN_CAROUSEL_PC_INDICATOR_CLASS)
            : cn('gap-2.5 text-muted-foreground', TOKEN_CAROUSEL_H5_INDICATOR_CLASS),
        )}
      >
        <button
          aria-label={t.swap.tokenPrevious}
          className={cn(
            'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-faint',
            isDesktop
              ? dappIconClass.base
              : cn(
                  'size-[var(--dapp-icon-lg)] rounded-full transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground',
                ),
          )}
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          <span
            aria-hidden="true"
            className={cn(
              'block -rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
              isDesktop ? dappIconClass.base : dappIconClass.md,
            )}
          />
        </button>
        <span
          aria-label={t.swap.tokenAbout.title}
          className={cn('inline-flex items-center', isDesktop ? 'gap-1.5' : 'gap-1.5')}
          role="group"
        >
          {tokens.map((token, index) => (
            <button
              aria-current={current === index ? 'true' : undefined}
              aria-label={`${t.swap.tokenAbout.title} ${index + 1}`}
              className={cn(
                'grid cursor-pointer place-items-center border-0 bg-transparent p-0',
                dappIconClass.base,
              )}
              key={token.key}
              onClick={() => goTo(index)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
                  current === index
                    ? isDesktop
                      ? 'h-1.5 w-5.5 bg-primary'
                      : 'h-1.5 w-4.5 bg-primary'
                    : isDesktop
                      ? 'h-1.5 w-1.5'
                      : 'size-1.5',
                )}
              />
            </button>
          ))}
        </span>
        <button
          aria-label={t.swap.tokenNext}
          className={cn(
            'grid cursor-pointer place-items-center border-0 bg-transparent p-0 text-faint',
            isDesktop
              ? dappIconClass.base
              : cn(
                  'size-[var(--dapp-icon-lg)] rounded-full transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground',
                ),
          )}
          onClick={() => api?.scrollNext()}
          type="button"
        >
          <span
            aria-hidden="true"
            className={cn(
              'block rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
              isDesktop ? dappIconClass.base : dappIconClass.md,
            )}
          />
        </button>
      </div>
    </Carousel>
  )
}
