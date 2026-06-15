import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../../components/carousel'
import { cn } from '~/lib/utils'
import { useI18n } from '../../i18n/use-i18n'
import { revealClass } from '~/lib/reveal'
import {
  desktopCopyClass,
  shellContentHeadingClass,
  shellContentPageClass,
  shellMobilePageTitleClass,
  shellModulePanelClass,
} from '../shell-layout'
import { dappAssets, tokenCarouselIcons } from '../assets'
import {
  swapTokenCardKeys,
  swapTokenKeys,
  type SwapTokenKey,
} from '../data'
import { WalletConnectChip } from '../wallet-connect-chip'
import type { DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import { DappActionRow } from '../components/dapp-action-row'
import { AnchoredTooltip } from '../../components/anchored-tooltip'
import { MetricCard } from '../components/dapp-card'
import { DappPillTabs } from '../components/dapp-pill-tabs'
import { DappSection } from '../components/dapp-section'
import { DappWidgetHeader, dappWidgetTitleClassName } from '../components/dapp-widget-header'
import { DappMetaList } from '../components/dapp-meta-list'
import {
  MetricCardSkeleton,
  SwapBalanceSkeleton,
  SwapMetaValueSkeleton,
} from '../components/dapp-skeleton'
import { FaqStack } from '../components/faq-stack'
import { GenesisPromoCard } from '../components/genesis-promo-card'
import { MetricGrid } from '../components/metric-grid'
import { ResponsiveTable } from '../components/responsive-table'
import { SwapConnectPromptCard } from '../components/swap-connect-prompt-card'
import { SwapAmountBox } from '../components/swap-amount-box'
import { SwapSlippageModal } from '../components/swap-slippage-modal'
import { useSwapWidget } from '../../hooks/use-swap-widget'
import { useMobileViewport } from '../../hooks/use-mobile-viewport'
import { useGenesisWidgetContext } from '../genesis-widget-context'
import { usePairSpotRate } from '../../hooks/use-pair-spot-rate'
import { useSwapHistory } from '../../hooks/use-swap-history'
import { getSwapTokenContractAddress, openTokenContractOnBscScan } from '../../config/token-contracts'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '../../lib/web3/resolve-contract-error-message'
import { toast } from 'sonner'

const PERCENTS = [25, 50, 75, 100] as const

const SWAP_CARD_FLIP_ANIM =
  '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]'

const SWAP_WIDGET_FOOTER_SPACER = 'min-h-3.5 shrink-0 grow basis-3.5'

const SWAP_BOTTOM_CARD_CLASS = 'mt-auto w-full shrink-0'

const PERCENT_BTN_CLASS = cn(
  'flex h-[25px] cursor-pointer items-center justify-center rounded-[9px] border border-border bg-card',
  'px-0 py-[5px] text-xs font-semibold whitespace-nowrap text-ink-strong',
  'transition-[border-color,color,transform] duration-180 ease-out',
  'hover:-translate-y-px hover:border-primary hover:text-primary',
  'disabled:cursor-not-allowed disabled:opacity-[.58]',
  'max-[820px]:h-auto max-[820px]:py-1.5 max-[820px]:text-[11px]',
)

export function SwapWidget({
  connected,
  detailPanel,
  layoutMode = 'default',
  onSelectGenesis,
}: {
  connected: boolean
  detailPanel: DetailPanelControls
  layoutMode?: 'default' | 'mobilePager'
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const swap = useSwapWidget(connected)
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

  const disconnectedRateLabel = `1 ${pair.sell.symbol} = 1 ${pair.buy.symbol}`

  return (
    <div
      className={cn(
        layoutMode === 'mobilePager'
          ? 'flex min-h-0 flex-col max-[820px]:gap-0'
          : shellModulePanelClass,
        'max-[820px]:gap-0',
        '[&>:first-child]:mb-[18px]',
      )}
    >
      <DappWidgetHeader
        className={layoutMode === 'mobilePager' ? shellMobilePageTitleClass : undefined}
        detailCollapsed={detailPanel.collapsed}
        intro={connected ? t.swap.intro : t.swap.disconnectedIntro}
        introTone={connected ? 'body' : 'subtle'}
        onTogglePanel={detailPanel.onToggle}
        showToggle={connected && layoutMode !== 'mobilePager'}
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
        mobilePreviewValue={connected ? swap.sellAmount || '0.00' : '0.00'}
        balance={sellBalanceLabel}
        label={t.swap.sell}
        tokenIcon={pair.sell.icon}
        tokenLabel={pair.sell.symbol}
      />

      {connected ? (
        <div className="m-0 grid grid-cols-4 gap-1.5 pt-2.5 max-[820px]:mt-3 max-[820px]:py-0">
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
          'max-[820px]:h-auto max-[820px]:py-0 max-[820px]:drop-shadow-[0_8px_12px_rgba(18,26,51,0.07)]',
        )}
      >
        <AnchoredTooltip content={t.swap.flip}>
          <button
            aria-label={t.swap.flip}
            className={cn(
              'grid size-[34px] place-items-center rounded-[11px] border border-border bg-card p-0',
              'text-[14px] font-normal leading-normal tracking-[-0.28px] text-foreground shadow-none transition-[border-color,transform] duration-180 ease-out',
              'disabled:cursor-default enabled:hover:-translate-y-px enabled:hover:border-primary',
              'enabled:focus-visible:-translate-y-px enabled:focus-visible:border-primary',
              'max-[820px]:my-2',
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
        mobilePreviewValue={
          showBuyAmountSkeleton
            ? undefined
            : connected
              ? swap.buyAmount || '0.00'
              : '0.00'
        }
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
            value: showRateSkeleton ? (
              <SwapMetaValueSkeleton />
            ) : connected ? (
              swap.rateLabel || '—'
            ) : (
              disconnectedRateLabel
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
        <div className="mt-3.5 max-[820px]:mt-3 [&_.aegis-thirdweb-button-primary]:!min-h-[50px] [&_.aegis-thirdweb-button-primary]:!h-[50px] [&_.aegis-thirdweb-button-primary]:!text-[15px]">
          <WalletConnectChip fullWidth variant="primary" />
        </div>
      )}

      {connected ? (
        <>
          {layoutMode !== 'mobilePager' ? (
            <div aria-hidden="true" className={SWAP_WIDGET_FOOTER_SPACER} />
          ) : null}
          <GenesisPromoCard
            actionLabel={t.genesis.joinGenesis}
            className={cn(
              layoutMode === 'mobilePager' ? 'mt-3.5 w-full shrink-0' : SWAP_BOTTOM_CARD_CLASS,
              'gap-1.5 [&_button]:min-h-[38px] [&_button]:text-[13px] [&_p]:leading-tight',
              'max-[820px]:mt-3.5 max-[820px]:[&_button]:min-h-[42px] max-[820px]:[&_button]:text-sm',
            )}
            isLoading={genesis.isLoading}
            onClick={onSelectGenesis}
            promo={genesis.promoSnapshot}
          />
        </>
      ) : (
        <>
          {layoutMode !== 'mobilePager' ? (
            <div aria-hidden="true" className={SWAP_WIDGET_FOOTER_SPACER} />
          ) : null}
          <SwapConnectPromptCard
            className={
              layoutMode === 'mobilePager' ? 'mt-3.5 w-full shrink-0' : SWAP_BOTTOM_CARD_CLASS
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
  layoutMode = 'default',
}: {
  connected: boolean
  layoutMode?: 'default' | 'mobilePager'
}) {
  const { messages: t } = useI18n()
  const isMobileViewport = useMobileViewport()
  const { rateLabel: poolRateLabel, isLoading: poolRateLoading } = usePairSpotRate(connected)
  const { desktopRows: swapHistoryRows, mobileRows: mobileSwapHistoryRows } = useSwapHistory()
  const [faqToken, setFaqToken] = useState<SwapTokenKey>('usd1')
  const [aboutOpen, setAboutOpen] = useState(true)
  const faqItems = getSwapFaqItems(t, faqToken)

  const overviewMetrics = (
    <MetricGrid columns={2}>
      {connected && poolRateLoading && !poolRateLabel ? (
        <MetricCardSkeleton className="max-[820px]:rounded-[14px] max-[820px]:p-3.5" />
      ) : (
        <MetricCard
          className={cn(
            connected && '[&_small]:hidden',
            'max-[820px]:rounded-[14px] max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[13px] max-[820px]:[&_strong]:leading-[1.2]',
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
          'max-[820px]:rounded-[14px] max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[13px] max-[820px]:[&_strong]:leading-[1.2]',
        )}
        label={t.swap.settlement}
        value={t.swap.settlementValue}
      />
    </MetricGrid>
  )

  return (
    <div
      className={cn(
        shellContentPageClass,
        layoutMode === 'mobilePager' && 'px-0',
        !connected && 'max-[820px]:[&>.metric-grid]:hidden max-[820px]:[&>h2]:hidden',
      )}
    >
      <h2
        className={cn(
          shellContentHeadingClass,
          'pb-4',
          layoutMode === 'mobilePager' && 'hidden',
          !connected && 'min-[821px]:tracking-[-0.8px]',
        )}
        id="swap-title"
      >
        {t.swap.overview}
      </h2>

      {layoutMode === 'mobilePager' ? (
        <>
          <h1
            className={dappWidgetTitleClassName(
              cn(shellMobilePageTitleClass, 'max-[820px]:mb-3'),
            )}
          >
            {t.swap.overview}
          </h1>
          {overviewMetrics}
        </>
      ) : (
        overviewMetrics
      )}

      {connected ? (
        <DappSection
          className={cn(
            '!translate-y-0 !opacity-100 !transition-none',
            '[&_h3]:flex [&_h3]:items-center [&_h3]:justify-between [&_h3]:gap-3',
            '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-[1.2] [&_h3]:tracking-[-0.8px]',
            'max-[820px]:[&_h3]:pb-2.5 max-[820px]:[&_h3]:text-base max-[820px]:[&_h3]:tracking-[-0.64px]',
            'min-[821px]:[&+section]:mt-[34px]',
          )}
          title={(
          <span className="flex w-full items-center justify-between gap-3">
            {t.swap.tokenAbout}
            <button
              aria-controls="swap-about-body"
              aria-expanded={aboutOpen}
              aria-label={aboutOpen ? t.common.collapse : t.common.expand}
              className="inline-grid size-4 flex-none cursor-pointer place-items-center border-0 bg-transparent p-0"
              onClick={() => setAboutOpen((open) => !open)}
              type="button"
            >
              <img
                alt=""
                className={cn(
                  'size-4 text-foreground opacity-40 transition-transform duration-200',
                  !aboutOpen && 'rotate-180',
                )}
                height="16"
                src={dappAssets.chevronUp}
                width="16"
              />
            </button>
          </span>
        )}
      >
        <div className="-mx-3" id="swap-about-body">
          {aboutOpen
            ? isMobileViewport
              ? <MobileTokenCarousel />
              : <TokenInfoCarousel />
            : null}
        </div>
      </DappSection>
      ) : null}

      <DappSection
        className={cn(connected && 'hidden max-[820px]:block')}
        title={t.swap.recentSwaps}
      >
        {connected ? (
          swapHistoryRows.length > 0 ? (
            <>
              <ResponsiveTable
                className="max-[820px]:hidden"
                headers={[t.tables.time, t.tables.paid, t.tables.received, t.tables.status]}
                plain
                rows={swapHistoryRows}
                positiveColumns={[2]}
                statusColumns={[3]}
              />
              <ResponsiveTable
                className="hidden max-[820px]:block"
                compact
                headers={[t.tables.time, t.tables.received, t.tables.status]}
                plain
                rows={mobileSwapHistoryRows}
                positiveColumns={[1]}
              />
            </>
          ) : (
            <SwapEmptyState />
          )
        ) : (
          <SwapEmptyState />
        )}
      </DappSection>

      {connected ? (
        <DappSection title={t.swap.faq}>
          <div className={cn(revealClass(), 'max-[820px]:hidden')} data-reveal>
            <SwapFaqTabs activeToken={faqToken} onSelect={setFaqToken} />
            <FaqStack items={faqItems} />
          </div>
          <div className={cn(revealClass(), 'hidden max-[820px]:block')} data-reveal>
            <FaqStack items={faqItems} />
          </div>
        </DappSection>
      ) : null}
    </div>
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
    usd1: t.swap.faqTabUsd1,
    agx: t.swap.faqTabAgx,
    gagx: t.swap.faqTabGagx,
    x: t.swap.faqTabX,
  }

  return (
    <DappPillTabs
      ariaLabel={t.swap.faq}
      className="mt-4 flex flex-wrap gap-2 mb-3"
      items={swapTokenKeys.map((key) => ({
        active: key === activeToken,
        label: labels[key],
      }))}
      onSelect={(index) => onSelect(swapTokenKeys[index])}
    />
  )
}

function getSwapFaqItems(
  t: ReturnType<typeof useI18n>['messages'],
  token: SwapTokenKey,
) {
  const items: Record<SwapTokenKey, { answer: string; question: string }[]> = {
    agx: t.swap.faqTabAgxItems.map(({ q, a }) => ({ question: q, answer: a })),
    gagx: t.swap.faqTabGagxItems.map(({ q, a }) => ({ question: q, answer: a })),
    usd1: t.swap.faqTabUsd1Items.map(({ q, a }) => ({ question: q, answer: a })),
    x: t.swap.faqTabXItems.map(({ q, a }) => ({ question: q, answer: a })),
  }

  return items[token]
}

function tokenCardRaysClass(key: string) {
  return cn(
    'before:pointer-events-none before:absolute before:right-0 before:top-0 before:h-[180px] before:w-[328px]',
    'before:bg-[url("/assets/figma/dapp/token-card-rays.svg")] before:bg-cover before:bg-right before:bg-no-repeat',
    key === 'usd1' ? 'before:opacity-95' : 'before:opacity-[0.72]',
  )
}

function mobileTokenCardRaysClass(key: string) {
  return cn(
    'before:pointer-events-none before:absolute before:right-0 before:top-0 before:h-[72px] before:w-[118px]',
    'before:bg-[url("/assets/figma/dapp/token-card-corner.svg")] before:bg-cover before:bg-right before:bg-no-repeat',
    key === 'usd1' ? 'before:opacity-95' : 'before:opacity-[0.72]',
  )
}

function TokenInfoCarousel() {
  const { messages: t } = useI18n()
  const tokens = getSwapTokenContent(t)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
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

  return (
    <Carousel
      aria-label={t.swap.tokenAbout}
      className={cn(revealClass(), 'mt-3.5 grid gap-3 overflow-hidden')}
      data-reveal
      opts={{ align: 'start', loop: true }}
      plugins={[autoplay]}
      setApi={setApi}
    >
      <CarouselContent className="flex items-stretch">
        {tokens.map((token, index) => (
          <CarouselItem className="shrink-0 grow-0 basis-full" key={token.key}>
            <article
              aria-hidden={current !== index}
              className={cn(
                'relative h-[92px] min-w-0 overflow-hidden rounded-2xl bg-card p-4',
                'shadow-[0_10px_28px_rgba(20,28,51,0.1)]',
                tokenCardRaysClass(token.key),
              )}
            >
              <div className="relative z-[1] flex h-full min-w-0 flex-col gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <TokenIcon size="desktop" token={token} />
                  <strong className="truncate text-base font-semibold leading-[1.2] tracking-[-0.48px] text-foreground">
                    {token.title}
                  </strong>
                </div>
                <p className="m-0 line-clamp-1 max-w-[570px] text-[13px] font-normal leading-[1.5] tracking-[-0.26px] text-ink-strong">
                  {token.desktopBody}
                </p>
              </div>
              <AnchoredTooltip content={t.swap.tokenContractTooltip}>
                <button
                  className={cn(
                    'absolute right-[26px] top-1/2 z-[1] inline-flex -translate-y-1/2 items-center gap-[7px]',
                    'rounded-full border border-border bg-card px-4 py-2.5 text-[13px] font-semibold leading-[1.2]',
                    'tracking-[-0.26px] text-foreground transition-[border-color,transform] duration-180 ease-out',
                    'hover:-translate-y-1/2 hover:translate-x-px hover:border-primary',
                    'focus-visible:-translate-y-1/2 focus-visible:translate-x-px focus-visible:border-primary',
                    getSwapTokenContractAddress(token.key) ? '' : 'pointer-events-none opacity-45',
                  )}
                  disabled={!getSwapTokenContractAddress(token.key)}
                  onClick={() => openTokenContractOnBscScan(token.key)}
                  type="button"
                >
                  {t.swap.tokenContract}
                  <img
                    alt=""
                    height="15"
                    src={dappAssets.arrowUpRight}
                    width="15"
                  />
                </button>
              </AnchoredTooltip>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="inline-flex items-center justify-center gap-3.5 self-center pt-3">
        <button
          aria-label={t.swap.tokenPrevious}
          className="grid size-4 cursor-pointer place-items-center border-0 bg-transparent p-0 text-faint"
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          <span
            aria-hidden="true"
            className="block size-4 -rotate-90 bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]"
          />
        </button>
        <span
          aria-label={t.swap.tokenAbout}
          className="inline-flex items-center gap-[7px]"
          role="group"
        >
          {tokens.map((token, index) => (
            <button
              aria-current={current === index ? 'true' : undefined}
              aria-label={`${t.swap.tokenAbout} ${index + 1}`}
              className="grid size-4 cursor-pointer place-items-center border-0 bg-transparent p-0"
              key={token.key}
              onClick={() => goTo(index)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block h-[7px] rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
                  current === index ? 'w-[22px] bg-primary' : 'w-[7px]',
                )}
              />
            </button>
          ))}
        </span>
        <button
          aria-label={t.swap.tokenNext}
          className="grid size-4 cursor-pointer place-items-center border-0 bg-transparent p-0 text-faint"
          onClick={() => api?.scrollNext()}
          type="button"
        >
          <span
            aria-hidden="true"
            className="block size-4 rotate-90 bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]"
          />
        </button>
      </div>
    </Carousel>
  )
}

function getSwapTokenContent(t: ReturnType<typeof useI18n>['messages']) {
  const tokenContent = {
    agx: {
      asset: tokenCarouselIcons.agxIcon,
      key: 'agx',
      title: t.swap.tokenAgx,
      body: t.swap.tokenAgxBody,
      desktopBody: t.swap.tokenAgxBodyDesktop,
    },
    usd1: {
      asset: tokenCarouselIcons.usd1Icon,
      key: 'usd1',
      title: t.swap.tokenUsd1,
      body: t.swap.tokenUsd1Body,
      desktopBody: t.swap.tokenUsd1Body,
    },
    x: {
      asset: tokenCarouselIcons.xIcon,
      key: 'x',
      title: t.swap.tokenX,
      body: t.swap.tokenXBody,
      desktopBody: t.swap.tokenXBodyDesktop,
    },
    gagx: {
      asset: tokenCarouselIcons.gagxIcon,
      key: 'gagx',
      title: t.swap.tokenGagx,
      body: t.swap.tokenGagxBody,
      desktopBody: t.swap.tokenGagxBodyDesktop,
    },
  } satisfies Record<(typeof swapTokenCardKeys)[number], {
    asset: string
    body: string
    desktopBody: string
    key: (typeof swapTokenCardKeys)[number]
    title: string
  }>

  return swapTokenCardKeys.map((key) => tokenContent[key])
}

function MobileTokenCarousel() {
  const { messages: t } = useI18n()
  const tokens = getSwapTokenContent(t)
  const [api, setApi] = useState<CarouselApi>()
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

  return (
    <Carousel
      aria-label={t.swap.tokenAbout}
      className={cn(revealClass(), 'mt-3 grid overflow-hidden max-[820px]:mt-2.5')}
      data-reveal
      opts={{ align: 'start', loop: true }}
      setApi={setApi}
    >
      <CarouselContent
        className="ml-0 flex h-full items-stretch gap-3"
        viewportClassName="h-[132px] py-[14px]"
      >
        {tokens.map((token, index) => (
          <CarouselItem className="h-[104px] shrink-0 grow-0 basis-full pl-0" key={token.key}>
            <article
              aria-hidden={current !== index}
              className={cn(
                'relative flex h-full min-w-0 flex-col overflow-hidden rounded-md bg-card shadow-subtle',
                mobileTokenCardRaysClass(token.key),
              )}
            >
              <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-2 px-4 py-[14px]">
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-[9px]">
                    <TokenIcon size="mobile" token={token} />
                    <strong className="truncate text-[15px] font-semibold leading-[1.2] tracking-[-0.45px] text-foreground">
                      {token.title}
                    </strong>
                  </div>
                  <AnchoredTooltip content={t.swap.tokenContractTooltip}>
                    <button
                      className={cn(
                        'inline-flex shrink-0 cursor-pointer items-center gap-[5px] rounded-full',
                        'border border-border bg-card px-3 py-[7px] text-xs font-semibold leading-[1.2]',
                        'tracking-[-0.24px] whitespace-nowrap text-foreground',
                        getSwapTokenContractAddress(token.key) ? '' : 'pointer-events-none opacity-45',
                      )}
                      disabled={!getSwapTokenContractAddress(token.key)}
                      onClick={() => openTokenContractOnBscScan(token.key)}
                      type="button"
                    >
                      {t.swap.tokenContract}
                      <img
                        alt=""
                        height="13"
                        src={dappAssets.arrowUpRight}
                        width="13"
                      />
                    </button>
                  </AnchoredTooltip>
                </div>
                <p className="m-0 line-clamp-2 max-w-[236px] text-[13px] font-normal leading-[1.5] tracking-[-0.26px] text-faq-text">
                  {token.body}
                </p>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="inline-flex items-center justify-center gap-2.5 pt-3 text-muted-foreground">
        <button
          aria-label={t.swap.tokenPrevious}
          className="grid size-[26px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-faint transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground"
          onClick={() => api?.scrollPrev()}
          type="button"
        >
          <span
            aria-hidden="true"
            className="block size-3.5 -rotate-90 bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]"
          />
        </button>
        <span
          aria-label={t.swap.tokenAbout}
          className="inline-flex items-center gap-1.5"
          role="group"
        >
          {tokens.map((token, index) => (
            <button
              aria-current={current === index ? 'true' : undefined}
              aria-label={`${t.swap.tokenAbout} ${index + 1}`}
              className="grid size-4 cursor-pointer place-items-center border-0 bg-transparent p-0"
              key={token.key}
              onClick={() => goTo(index)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'block rounded-full bg-border transition-[width,background-color] duration-250 ease-out',
                  current === index ? 'h-1.5 w-[18px] bg-primary' : 'size-1.5',
                )}
              />
            </button>
          ))}
        </span>
        <button
          aria-label={t.swap.tokenNext}
          className="grid size-[26px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-faint transition-[background-color,color] duration-180 ease-out hover:bg-background hover:text-muted-foreground"
          onClick={() => api?.scrollNext()}
          type="button"
        >
          <span
            aria-hidden="true"
            className="block size-3.5 rotate-90 bg-current [mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]"
          />
        </button>
      </div>
    </Carousel>
  )
}

type SwapTokenContent = ReturnType<typeof getSwapTokenContent>[number]

function TokenIcon({
  size,
  token,
}: {
  size: 'desktop' | 'mobile'
  token: SwapTokenContent
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

function SwapEmptyState() {
  const { messages: t } = useI18n()

  return (
    <div
      className={cn(
        revealClass(),
        'mt-3.5 grid justify-items-center gap-[18px] overflow-hidden rounded-[18px] bg-card p-[30px_24px] shadow-card',
        'max-[820px]:gap-3.5 max-[820px]:border max-[820px]:border-border max-[820px]:p-[22px_16px] max-[820px]:shadow-none',
      )}
      data-reveal
    >
      <div aria-hidden="true" className="grid w-full gap-3 max-[820px]:gap-[11px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className={cn(
              'grid grid-cols-[minmax(80px,120px)_1fr_minmax(56px,90px)_minmax(50px,70px)] items-center gap-3.5',
              'max-[820px]:grid-cols-[minmax(56px,80px)_1fr_minmax(46px,56px)] max-[820px]:gap-2.5',
            )}
            key={index}
          >
            <span className="h-3.5 rounded-lg bg-border max-[820px]:h-3" />
            <i className="h-3.5 rounded-lg bg-border max-[820px]:h-3" />
            <b className="h-3.5 rounded-lg bg-border max-[820px]:h-3" />
          </div>
        ))}
      </div>
      <div className="grid justify-items-center gap-1.5 text-center text-faint max-[820px]:w-full max-[820px]:gap-[5px]">
        <strong className="text-[15px] font-semibold leading-[1.2] text-foreground max-[820px]:text-sm">
          {t.swap.emptyTitle}
        </strong>
        <p className="m-0 max-w-[42ch] text-[13px] leading-[1.5] text-ink-muted max-[820px]:max-w-none max-[820px]:text-xs max-[820px]:whitespace-nowrap">
          {t.swap.emptyBody}
        </p>
      </div>
      <WalletConnectChip fullWidth variant="primary" />
    </div>
  )
}
