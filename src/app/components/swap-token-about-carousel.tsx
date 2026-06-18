import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/components/carousel'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import { swapTokenCardKeys } from '~/app/data'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { getSwapTokenContractAddress, openTokenContractOnBscScan } from '~/config/token-contracts'

const TOKEN_CAROUSEL_CARD_INNER =
  'relative min-w-0 overflow-hidden rounded-2xl bg-card'

const TOKEN_CAROUSEL_CARD_SHELL = 'h-full rounded-2xl shadow-subtle'

const TOKEN_CAROUSEL_PC_VIEWPORT_BLEED_CLASS =
  'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7 dapp:pb-[var(--shadow-bleed-subtle)] dapp:pt-[var(--shadow-bleed-subtle)]'

const TOKEN_CAROUSEL_PC_INDICATOR_CLASS =
  'dapp:relative dapp:z-1 dapp:-mt-[var(--shadow-bleed-subtle)] dapp:pt-[var(--carousel-pc-indicator-pt)]'

const TOKEN_CAROUSEL_H5_VIEWPORT_BLEED_CLASS =
  '-mx-[var(--shadow-bleed-h5)] w-[calc(100%+2*var(--shadow-bleed-h5))] px-[var(--shadow-bleed-h5)] pt-[var(--carousel-h5-viewport-pad-y)] pb-[var(--shadow-bleed-subtle)]'

const TOKEN_CAROUSEL_H5_INDICATOR_CLASS =
  'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))] pt-[var(--carousel-h5-indicator-pt)]'

const TOKEN_CAROUSEL_SLIDE_CLASS =
  'flex min-w-0 w-full max-w-full shrink-0 grow-0 basis-full flex-col'
const TOKEN_CAROUSEL_TRACK_CLASS = 'flex items-stretch'
const TOKEN_CAROUSEL_BODY_GRID_CLASS =
  'relative z-1 grid h-full min-h-0 grid-rows-[auto_1fr] gap-2'

const tokenCardMobileBodyTextClass = 'max-w-[236px]'
const tokenCardDesktopBodyTextClass = 'max-w-[570px]'

type SwapTokenCarouselItem = {
  asset: string
  body: string
  key: (typeof swapTokenCardKeys)[number]
  title: string
}

function tokenCarouselBodyPadClass(variant: 'desktop' | 'mobile') {
  return variant === 'desktop' ? 'p-4 pr-[148px]' : 'px-4 py-[14px]'
}

function tokenCarouselContractButtonClass(variant: 'desktop' | 'mobile') {
  return cn(
    'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-border bg-card whitespace-nowrap text-foreground',
    variant === 'desktop'
      ? cn(
          'absolute right-4 top-1/2 z-[2] -translate-y-1/2 gap-[7px] px-4 py-2.5',
          'text-[13px] font-semibold leading-[1.2] tracking-[-0.26px]',
          'transition-[border-color,transform] duration-180 ease-out',
          'hover:translate-x-px hover:border-primary',
          'focus-visible:translate-x-px focus-visible:border-primary',
        )
      : 'gap-[5px] px-3 py-[7px] text-xs font-semibold leading-[1.2] tracking-[-0.24px]',
  )
}

function TokenCardDecoration({
  tokenKey,
  variant,
}: {
  tokenKey: string
  variant: 'desktop' | 'mobile'
}) {
  if (variant === 'mobile') {
    return (
      <img
        alt=""
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-0 right-0 h-[72px] w-[118px]',
          tokenKey === 'usd1' ? 'opacity-95' : 'opacity-[0.72]',
        )}
        src={dappAssets.tokenCardCorner}
      />
    )
  }

  return (
    <img
      alt=""
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 right-0 h-full w-[328px] object-fill',
        tokenKey === 'usd1' ? 'opacity-95' : 'opacity-[0.72]',
      )}
      src={dappAssets.tokenCardRays}
    />
  )
}

function TokenIcon({
  size,
  token,
}: {
  size: 'desktop' | 'mobile'
  token: Pick<SwapTokenCarouselItem, 'asset' | 'title'>
}) {
  const isDesktop = size === 'desktop'
  const dimension = isDesktop ? 32 : 30

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 overflow-hidden rounded-full',
        isDesktop ? 'size-8' : 'size-[30px]',
      )}
    >
      <img
        alt=""
        className="block size-full"
        height={dimension}
        src={token.asset}
        width={dimension}
      />
    </span>
  )
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
        tokenCarouselContractButtonClass(variant),
        contractDisabled ? 'pointer-events-none opacity-45' : '',
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
    <div className={cn(TOKEN_CAROUSEL_CARD_SHELL, isDesktop && 'min-h-[124px]')}>
      <article
        aria-hidden={!isActive}
        className={cn(TOKEN_CAROUSEL_CARD_INNER, 'h-full')}
      >
        <TokenCardDecoration tokenKey={token.key} variant={variant} />
        <div className={cn(TOKEN_CAROUSEL_BODY_GRID_CLASS, tokenCarouselBodyPadClass(variant))}>
          <div
            className={cn(
              'flex min-w-0 items-center',
              isDesktop ? 'gap-3' : 'justify-between gap-2',
            )}
          >
            <div className={cn('flex min-w-0 items-center', isDesktop ? 'gap-3' : 'gap-[9px]')}>
              <TokenIcon size={isDesktop ? 'desktop' : 'mobile'} token={token} />
              <strong
                className={cn(
                  'truncate font-semibold leading-[1.2] text-foreground',
                  isDesktop
                    ? 'text-base tracking-[-0.48px]'
                    : 'text-[15px] tracking-[-0.45px]',
                )}
              >
                {token.title}
              </strong>
            </div>
            {!isDesktop ? (
              <AnchoredTooltip content={contractTooltip}>{contractButton}</AnchoredTooltip>
            ) : null}
          </div>
          <p
            className={cn(
              'm-0 min-w-0 text-[13px] font-normal leading-[1.5] tracking-[-0.26px]',
              isDesktop ? 'text-ink-strong' : 'text-faq-text',
              isDesktop ? tokenCardDesktopBodyTextClass : tokenCardMobileBodyTextClass,
            )}
          >
            {token.body}
          </p>
        </div>
        {isDesktop ? (
          <AnchoredTooltip content={contractTooltip}>{contractButton}</AnchoredTooltip>
        ) : null}
      </article>
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
    gagx: tokenCarouselIcons.gagxIcon,
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
        isDesktop ? 'mt-3.5 gap-3 dapp:gap-0' : 'mt-3 max-dapp:mt-2.5',
      )}
      data-reveal
      opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}
      plugins={isDesktop ? [autoplay] : undefined}
      setApi={setApi}
    >
      <CarouselContent
        className={cn(TOKEN_CAROUSEL_TRACK_CLASS, '-ml-4')}
        spacing="none"
        viewportClassName={
          isDesktop ? TOKEN_CAROUSEL_PC_VIEWPORT_BLEED_CLASS : TOKEN_CAROUSEL_H5_VIEWPORT_BLEED_CLASS
        }
      >
        {tokens.map((token, index) => (
          <CarouselItem className={cn(TOKEN_CAROUSEL_SLIDE_CLASS, 'pl-4')} key={token.key} spacing="none">
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
              ? 'size-4'
              : 'size-[26px] rounded-full transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground',
          )}
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          <span
            aria-hidden="true"
            className={cn(
              'block -rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
              isDesktop ? 'size-4' : 'size-3.5',
            )}
          />
        </button>
        <span
          aria-label={t.swap.tokenAbout.title}
          className={cn('inline-flex items-center', isDesktop ? 'gap-[7px]' : 'gap-1.5')}
          role="group"
        >
          {tokens.map((token, index) => (
            <button
              aria-current={current === index ? 'true' : undefined}
              aria-label={`${t.swap.tokenAbout.title} ${index + 1}`}
              className="grid size-4 cursor-pointer place-items-center border-0 bg-transparent p-0"
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
                      ? 'h-[7px] w-[22px] bg-primary'
                      : 'h-1.5 w-[18px] bg-primary'
                    : isDesktop
                      ? 'h-[7px] w-[7px]'
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
              ? 'size-4'
              : 'size-[26px] rounded-full transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground',
          )}
          onClick={() => api?.scrollNext()}
          type="button"
        >
          <span
            aria-hidden="true"
            className={cn(
              'block rotate-90 bg-current [mask:url(\'/assets/figma/dapp/ic-chevron.svg\')_center/contain_no-repeat]',
              isDesktop ? 'size-4' : 'size-3.5',
            )}
          />
        </button>
      </div>
    </Carousel>
  )
}
