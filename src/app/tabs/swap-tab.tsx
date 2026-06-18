import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/components/carousel'
import { cn } from '~/lib/utils'
import { buttonDisabledClass } from '~/components/button'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import {
  shellMobilePageTitleClass,
  shellWidgetRootClass,
} from '~/app/shell-layout'
import { dappAssets, tokenCarouselIcons } from '~/app/assets'
import {
  swapTokenCardKeys,
  swapTokenKeys,
  type SwapTokenKey,
} from '~/app/data'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import type { DetailPanelControls } from '~/app/types'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { MetricCard } from '~/app/components/dapp-card'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { DappPanelHeader, dappPanelTitleClassName } from '~/app/components/dapp-panel-header'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import {
  MetricCardSkeleton,
  SwapBalanceSkeleton,
  SwapMetaValueSkeleton,
} from '~/app/components/dapp-skeleton'
import { FaqList } from '~/components/faq-list'
import { GenesisPromoCard } from '~/app/components/genesis-promo-card'
import { MetricGrid } from '~/app/components/metric-grid'
import { SwapConnectPromptCard } from '~/app/components/swap-connect-prompt-card'
import { SwapAmountBox } from '~/app/components/swap-amount-box'
import { SwapSlippageModal } from '~/app/components/swap-slippage-modal'
import { useSwapWidget } from '~/hooks/use-swap-widget'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { useAuth } from '~/providers/auth-provider'
import { usePairSpotRate } from '~/hooks/use-pair-spot-rate'
import { getSwapTokenContractAddress, openTokenContractOnBscScan } from '~/config/token-contracts'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { toast } from 'sonner'

const PERCENTS = [25, 50, 75, 100] as const

const SWAP_CARD_FLIP_ANIM =
  '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]'

const SWAP_WIDGET_FOOTER_SPACER = 'min-h-3.5 shrink-0 grow basis-3.5'

const SWAP_BOTTOM_CARD_CLASS = 'mt-3.5 w-full shrink-0 dapp:mt-auto'

const PERCENT_BTN_CLASS = cn(
  'flex h-[25px] cursor-pointer items-center justify-center rounded-[9px] border border-border bg-card',
  'px-0 py-[5px] text-xs font-semibold whitespace-nowrap text-ink-strong',
  'transition-[border-color,color,transform,background-color] duration-180 ease-out',
  'hover:-translate-y-px hover:border-primary hover:text-primary',
  buttonDisabledClass,
  'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  'max-dapp:h-auto max-dapp:py-1.5 max-dapp:text-[11px]',
)

export function SwapWidget({
  connected,
  detailPanel,
  onSelectGenesis,
  swapPager = false,
}: {
  connected: boolean
  detailPanel: DetailPanelControls
  onSelectGenesis: () => void
  swapPager?: boolean
}) {
  const { messages: t } = useI18n()
  const { isAuthenticated } = useAuth()
  const swap = useSwapWidget(isAuthenticated)
  const genesis = useGenesisWidgetContext()
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [slippageOpen, setSlippageOpen] = useState(false)

  const { pair } = swap
  const flipAnimClass = isFlipping ? SWAP_CARD_FLIP_ANIM : undefined
  const showBalanceSkeleton = swap.isBalancesLoading
  const showRateSkeleton =
    swap.isSpotQuoting &&
    swap.sellAmount.trim().length === 0 &&
    !swap.rateLabel
  const showBuyAmountSkeleton = swap.isQuoting && swap.sellAmount.trim().length > 0

  const sellBalanceLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : (
    `${t.swap.balance}: ${swap.walletReady ? swap.sellBalanceLabel : '—'}`
  )

  const buyBalanceLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : (
    `${t.swap.balance}: ${swap.walletReady ? swap.buyBalanceLabel : '—'}`
  )

  const handleFlip = useCallback(() => {
    if (!swap.walletReady || isFlipping) return
    setIsFlipping(true)
    setRotation((prev) => prev + 180)
    window.setTimeout(() => {
      swap.flipDirection()
    }, 160)
    window.setTimeout(() => {
      setIsFlipping(false)
    }, 320)
  }, [isFlipping, swap])

  const handleSubmit = useCallback(async () => {
    const success = await swap.submit()
    if (!success) return
    toast.success(swap.action === 'approve' ? t.swap.approveSuccess : t.swap.swapSuccess)
  }, [swap, t.swap.approveSuccess, t.swap.swapSuccess])

  useEffect(() => {
    if (!swap.error) return
    const message =
      resolveGenesisPurchaseError(swap.error, {
        insufficientAllowance: t.genesis.insufficientAllowance,
        insufficientUsd1: t.genesis.insufficientUsd1,
        purchaseUnavailable: t.genesis.purchaseUnavailable,
        walletNotConnected: t.genesis.walletNotConnected,
      }) ?? toWalletUserFacingMessage(swap.error)
    if (message) toast.error(message)
  }, [
    swap.error,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
  ])

  const placeholderRateLabel = t.swap.ratePlaceholder

  return (
    <div
      className={cn(
        swapPager
          ? 'flex min-h-full flex-col max-dapp:gap-0'
          : shellWidgetRootClass,
        'max-dapp:gap-0',
        '[&>:first-child]:mb-[18px]',
      )}
    >
      <DappPanelHeader
        detailCollapsed={detailPanel.collapsed}
        onTogglePanel={detailPanel.onToggle}
        showToggle={!swapPager}
        subtitle={connected ? t.swap.intro : t.swap.disconnectedIntro}
        title={t.swap.title}
      />

      <SwapAmountBox
        amountProps={{
          'aria-label': `${pair.sell.symbol} sell amount`,
          disabled: !connected,
          inputMode: 'decimal',
          onChange: (event) => swap.setSellAmount(event.currentTarget.value),
          placeholder: '0.00',
          value: swap.sellAmount,
        }}
        className={flipAnimClass}
        connected={connected}
        balance={sellBalanceLabel}
        label={t.swap.sell}
        tokenIcon={pair.sell.icon}
        tokenLabel={pair.sell.symbol}
      />

      {connected ? (
        <div className="m-0 grid grid-cols-4 gap-1.5 pt-2.5 max-dapp:mt-3 max-dapp:py-0">
          {PERCENTS.map((percent) => (
            <button
              className={PERCENT_BTN_CLASS}
              disabled={!swap.walletReady}
              key={percent}
              onClick={() => swap.fillPercent(percent)}
              type="button"
            >
              {percent}%
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          'flex items-center justify-center py-[6px]',
          'max-dapp:h-auto max-dapp:py-0 max-dapp:drop-shadow-[0_8px_12px_rgba(18,26,51,0.07)]',
        )}
      >
        <AnchoredTooltip content={t.swap.flip}>
          <button
            aria-label={t.swap.flip}
            className={cn(
              'grid size-[34px] place-items-center rounded-[11px] border border-border bg-card p-0',
              'text-[14px] font-normal leading-normal tracking-[-0.28px] text-foreground shadow-none transition-[border-color,transform] duration-180 ease-out',
              'enabled:hover:-translate-y-px enabled:hover:border-primary',
              'enabled:focus-visible:-translate-y-px enabled:focus-visible:border-primary',
              'max-dapp:my-2',
            )}
            disabled={!swap.walletReady}
            onClick={handleFlip}
            type="button"
          >
            <span
              className="grid place-items-center transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              ⇅
            </span>
          </button>
        </AnchoredTooltip>
      </div>

      <SwapAmountBox
        amountLoading={showBuyAmountSkeleton}
        amountProps={{
          'aria-label': `${pair.buy.symbol} receive amount`,
          placeholder: '0.00',
          readOnly: true,
          value: swap.buyAmount,
        }}
        className={cn('mt-0', flipAnimClass)}
        connected={connected}
        balance={buyBalanceLabel}
        label={t.swap.buy}
        tokenIcon={pair.buy.icon}
        tokenLabel={pair.buy.symbol}
      />

      <DappMetaList
        connected={connected}
        items={[
          {
            label: t.swap.rate,
            value: !isAuthenticated ? (
              placeholderRateLabel
            ) : showRateSkeleton ? (
              <SwapMetaValueSkeleton />
            ) : (
              swap.rateLabel || '—'
            ),
          },
          {
            label: t.swap.slippage,
            value: connected ? (
              <>
                {swap.slippage}%
                <button
                  aria-label={t.swap.slippageSettings}
                  className={cn(
                    'grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0',
                    'transition-opacity duration-180 ease-out hover:opacity-80',
                  )}
                  onClick={() => setSlippageOpen(true)}
                  type="button"
                >
                  <img alt="" height="14" src={dappAssets.setting} width="14" />
                </button>
              </>
            ) : (
              '0%'
            ),
            valueClassName: 'inline-flex items-center justify-end gap-1',
          },
          {
            label: t.swap.route,
            value: swap.routeLabel,
          },
        ]}
      />

      {connected && swap.walletReady ? (
        <DappActionRow>
          <DappActionButton
            className="col-span-full"
            disabled={!swap.canSubmit}
            loading={swap.isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {swap.action === 'approve' ? t.swap.approve : t.swap.action}
          </DappActionButton>
        </DappActionRow>
      ) : (
        <div className="mt-3.5 max-dapp:mt-3 [&_.aegis-thirdweb-button-primary]:!min-h-[50px] [&_.aegis-thirdweb-button-primary]:!h-[50px] [&_.aegis-thirdweb-button-primary]:!text-[15px]">
          <WalletConnectChip fullWidth variant="primary" />
        </div>
      )}

      {connected ? (
        <>
          {!swapPager ? (
            <div aria-hidden="true" className={SWAP_WIDGET_FOOTER_SPACER} />
          ) : null}
          <GenesisPromoCard
            actionLabel={t.genesis.joinGenesis}
            className={cn(
              swapPager ? 'mt-3.5 w-full shrink-0' : SWAP_BOTTOM_CARD_CLASS,
              'gap-1.5 [&_button]:min-h-[38px] [&_button]:text-[13px] [&_p]:leading-tight',
              'max-dapp:mt-3.5 max-dapp:[&_button]:min-h-[42px] max-dapp:[&_button]:text-sm',
            )}
            isLoading={genesis.isLoading}
            onClick={onSelectGenesis}
            promo={genesis.promoSnapshot}
          />
        </>
      ) : (
        <>
          {!swapPager ? (
            <div aria-hidden="true" className={SWAP_WIDGET_FOOTER_SPACER} />
          ) : null}
          <SwapConnectPromptCard
            className={
              swapPager ? 'mt-3.5 w-full shrink-0' : SWAP_BOTTOM_CARD_CLASS
            }
          />
        </>
      )}

      <SwapSlippageModal
        onConfirm={swap.setSlippage}
        onOpenChange={setSlippageOpen}
        open={slippageOpen}
        slippage={swap.slippage}
      />
    </div>
  )
}

export function SwapContent({
  connected,
  swapPager = false,
}: {
  connected: boolean
  swapPager?: boolean
}) {
  const { messages: t } = useI18n()
  const { rateLabel: poolRateLabel, isLoading: poolRateLoading } = usePairSpotRate(connected)
  const [faqToken, setFaqToken] = useState<SwapTokenKey>('usd1')
  const faqItems = t.swap.faq.tabs[faqToken].items

  const overviewMetrics = (
    <MetricGrid
      className="max-dapp:mt-3.5 max-dapp:[&>article]:mt-0"
      columns={2}
    >
      {connected && poolRateLoading && !poolRateLabel ? (
        <MetricCardSkeleton className="max-dapp:rounded-[14px] max-dapp:p-3.5" />
      ) : (
        <MetricCard
          className={cn(
            connected && '[&_small]:hidden',
            'max-dapp:rounded-[14px] max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-[13px] max-dapp:[&_strong]:leading-[1.2]',
          )}
          label={t.swap.exchangeRate}
          value={
            connected
              ? poolRateLabel ?? '—'
              : t.swap.fixedRate
          }
        />
      )}
      <MetricCard
        className={cn(
          connected && '[&_small]:hidden',
          'max-dapp:rounded-[14px] max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-[13px] max-dapp:[&_strong]:leading-[1.2]',
        )}
        label={t.swap.settlement}
        value={t.swap.settlementValue}
      />
    </MetricGrid>
  )

  return (
    <DappDetailPage pager={swapPager}>
      <DappContentHeading
        className={cn('pb-4', swapPager && 'hidden')}
        id="swap-title"
      >
        {t.swap.overview}
      </DappContentHeading>

      {swapPager ? (
        <h1
          className={dappPanelTitleClassName(
            cn(shellMobilePageTitleClass, 'max-dapp:mb-0 max-dapp:pb-4'),
          )}
        >
          {t.swap.overview}
        </h1>
      ) : null}

      {overviewMetrics}

      {connected ? (
        <DappCollapsibleSection
          bodyClassName="overflow-visible"
          className={cn(
            '!translate-y-0 !opacity-100 !transition-none',
            '[&_h3]:flex [&_h3]:items-center [&_h3]:justify-between [&_h3]:gap-3',
            '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-[1.2] [&_h3]:tracking-[-0.8px]',
            'max-dapp:[&_h3]:pb-2.5 max-dapp:[&_h3]:text-base max-dapp:[&_h3]:tracking-[-0.64px]',
            'dapp:[&+section]:mt-[34px]',
            '[&_h3_button]:w-full',
          )}
          title={t.swap.tokenAbout.title}
        >
          <TokenAboutCarousel />
        </DappCollapsibleSection>
      ) : null}

      <DappSection title={t.swap.faq.title}>
        <SwapFaqTabs activeToken={faqToken} onSelect={setFaqToken} />
        <FaqList key={faqToken} items={faqItems} variant="dapp" />
      </DappSection>
    </DappDetailPage>
  )
}

function SwapFaqTabs({
  activeToken,
  onSelect,
}: {
  activeToken: SwapTokenKey
  onSelect: (token: SwapTokenKey) => void
}) {
  const { messages: t } = useI18n()
  const labels: Record<SwapTokenKey, string> = {
    usd1: t.swap.faq.tabs.usd1.label,
    agx: t.swap.faq.tabs.agx.label,
    gagx: t.swap.faq.tabs.gagx.label,
    x: t.swap.faq.tabs.x.label,
  }

  return (
    <DappPillTabs
      ariaLabel={t.swap.faq.title}
      className="mt-4 flex flex-wrap gap-2 mb-3"
      items={swapTokenKeys.map((key) => ({
        active: key === activeToken,
        label: labels[key],
      }))}
      onSelect={(index) => onSelect(swapTokenKeys[index])}
    />
  )
}

const TOKEN_CAROUSEL_CARD_INNER =
  'relative min-w-0 overflow-hidden rounded-2xl bg-card'

const TOKEN_CAROUSEL_CARD_SHELL = 'h-full rounded-2xl shadow-subtle'

/** Figma `12:95` dcol px-28 — 与 DappDetailPage px-7 对齐，阴影伸入 padding 带 */
const TOKEN_CAROUSEL_PC_VIEWPORT_BLEED_CLASS =
  'dapp:-mx-7 dapp:w-[calc(100%+3.5rem)] dapp:px-7 dapp:pb-[var(--shadow-bleed-subtle)] dapp:pt-[var(--shadow-bleed-subtle)]'

/** Figma `102:77` dots pt-12；viewport 无 layout pb，负 margin 收回 shadow bleed */
const TOKEN_CAROUSEL_PC_INDICATOR_CLASS =
  'dapp:relative dapp:z-1 dapp:-mt-[var(--shadow-bleed-subtle)] dapp:pt-[var(--carousel-pc-indicator-pt)]'

const TOKEN_CAROUSEL_H5_VIEWPORT_BLEED_CLASS =
  '-mx-[var(--shadow-bleed-h5)] w-[calc(100%+2*var(--shadow-bleed-h5))] px-[var(--shadow-bleed-h5)] pt-[var(--carousel-h5-viewport-pad-y)] pb-[var(--shadow-bleed-subtle)]'

/** 视觉 gap = viewport-pad-y + indicator-pt（Figma 14+12=26px）；负 margin 收回多余 shadow bleed */
const TOKEN_CAROUSEL_H5_INDICATOR_CLASS =
  'relative z-1 -mt-[calc(var(--shadow-bleed-subtle)-var(--carousel-h5-viewport-pad-y))] pt-[var(--carousel-h5-indicator-pt)]'

const TOKEN_CAROUSEL_SLIDE_CLASS =
  'flex min-w-0 w-full max-w-full shrink-0 grow-0 basis-full flex-col'
const TOKEN_CAROUSEL_TRACK_CLASS = 'flex items-stretch'
const TOKEN_CAROUSEL_BODY_GRID_CLASS =
  'relative z-1 grid h-full min-h-0 grid-rows-[auto_1fr] gap-2'

// Figma `113:6` — H5 body text width before corner decoration
const tokenCardMobileBodyTextClass = 'max-w-[236px]'

// PC: body text stops before the vertically centered contract button.
const tokenCardDesktopBodyTextClass = 'max-w-[570px]'

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
    <div
      className={cn(
        TOKEN_CAROUSEL_CARD_SHELL,
        isDesktop && 'min-h-[124px]',
      )}
    >
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

function TokenAboutCarousel() {
  const isDesktop = !useMobileViewport()
  const variant = isDesktop ? 'desktop' : 'mobile'
  const { messages: t } = useI18n()
  const tokens = getSwapTokenContent(t, isDesktop)
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

function getSwapTokenContent(
  t: ReturnType<typeof useI18n>['messages'],
  isDesktop: boolean,
) {
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
      body: isDesktop && copy.bodyDesktop ? copy.bodyDesktop : copy.body,
      key,
      title: copy.title,
    }
  })
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
