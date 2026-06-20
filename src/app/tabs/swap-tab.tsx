import { useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { buttonDisabledClass } from '~/components/button'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import {
  shellMobilePageTitleClass,
  shellWidgetRootClass,
} from '~/app/shell-layout'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import {
  swapTokenKeys,
  type SwapTokenKey,
} from '~/app/data'
import { DappWidgetConnectFooter, DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { MetricCard } from '~/app/components/dapp-card'
import { DappPillTabs } from '~/app/components/dapp-pill-tabs'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { dappPanelTitleClassName } from '~/app/components/dapp-panel-header'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import {
  MetricCardSkeleton,
  SwapBalanceSkeleton,
  SwapMetaValueSkeleton,
} from '~/app/components/dapp-skeleton'
import { FaqList } from '~/components/faq-list'
import { GenesisPromoCard } from '~/app/components/genesis-promo-card'
import { MetricGrid } from '~/app/components/metric-grid'
import { SwapAmountBox } from '~/app/components/swap-amount-box'
import { SwapSlippageModal } from '~/app/components/swap-slippage-modal'
import { TokenAboutCarousel } from '~/app/components/swap-token-about-carousel'
import { useSwapWidget } from '~/hooks/use-swap-widget'
import { useSwapDirectionStore } from '~/stores/swap-direction-store'
import { useDappShell } from '~/app/dapp-shell-context'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { usePairSpotRate } from '~/hooks/use-pair-spot-rate'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { openPancakeSwapDeepLink } from '~/config/pancake-swap-links'
import { toast } from 'sonner'

const SWAP_META_VALUE_ROW_CLASS = 'inline-flex items-center justify-end gap-1'

const PERCENTS = [25, 50, 75, 100] as const

const SWAP_CARD_FLIP_ANIM =
  '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]'

const PERCENT_BTN_CLASS = cn(
  'flex h-6 cursor-pointer items-center justify-center rounded-sm border border-border bg-card',
  'px-0 py-1 text-xs font-semibold whitespace-nowrap text-ink-strong',
  'transition-[border-color,color,transform,background-color] duration-180 ease-out',
  'hover:-translate-y-px hover:border-primary hover:text-primary',
  buttonDisabledClass,
  'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
  'max-dapp:h-auto max-dapp:py-1.5 max-dapp:text-xs',
)

export function SwapWidget({
  onSelectGenesis,
  swapPager = false,
}: {
  onSelectGenesis: () => void
  swapPager?: boolean
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swap = useSwapWidget(sessionReady)
  const genesis = useGenesisWidgetContext()
  const [isFlipping, setIsFlipping] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [slippageOpen, setSlippageOpen] = useState(false)

  const { pair } = swap
  const flipAnimClass = isFlipping ? SWAP_CARD_FLIP_ANIM : undefined
  const swapPreview = !sessionReady
  const showBalanceSkeleton = !swapPreview && swap.isBalancesLoading
  const showRateSkeleton = swap.isExchangePriceQuoting && !swap.exchangePriceLabel
  const showBuyAmountSkeleton = sessionReady && swap.isQuoting && swap.sellAmount.trim().length > 0
  const zeroBalanceLabel = `${t.swap.balance}: 0.00`

  const sellBalanceLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${swap.walletReady ? swap.sellBalanceLabel : '—'}`
  )

  const buyBalanceLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${swap.walletReady ? swap.buyBalanceLabel : '—'}`
  )

  const handleFlip = useCallback(() => {
    if (sessionReady && !swap.walletReady) return
    if (isFlipping) return
    setIsFlipping(true)
    setRotation((prev) => prev + 180)
    window.setTimeout(() => {
      swap.flipDirection()
    }, 160)
    window.setTimeout(() => {
      setIsFlipping(false)
    }, 320)
  }, [isFlipping, sessionReady, swap])

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
    <DappWidgetFrame
      bodyClassName="gap-0"
      frameClass={
        swapPager
          ? 'flex min-h-full flex-col max-dapp:gap-0'
          : shellWidgetRootClass
      }
      showToggle={!swapPager}
      subtitle={t.swap.intro}
      title={t.swap.title}
    >
      <SwapAmountBox
        amountProps={{
          'aria-label': `${pair.sell.symbol} sell amount`,
          disabled: sessionReady && !swap.walletReady,
          inputMode: 'decimal',
          onChange: (event) => swap.setSellAmount(event.currentTarget.value),
          placeholder: '0.00',
          value: swap.sellAmount,
        }}
        className={flipAnimClass}
        sessionReady
        balance={sellBalanceLabel}
        label={t.swap.sell}
        tokenIcon={pair.sell.icon}
        tokenLabel={pair.sell.symbol}
      />

      <div className="m-0 grid grid-cols-4 gap-1.5 pt-2.5 max-dapp:mt-3 max-dapp:py-0">
        {PERCENTS.map((percent) => (
          <button
            className={PERCENT_BTN_CLASS}
            disabled={!swapPreview && !swap.walletReady}
            key={percent}
            onClick={() => swap.fillPercent(percent)}
            type="button"
          >
            {percent}%
          </button>
        ))}
      </div>

      <div
        className={cn(
          'flex items-center justify-center py-1.5',
          'max-dapp:h-auto max-dapp:py-0 max-dapp:drop-shadow-[0_8px_12px_rgba(18,26,51,0.07)]',
        )}
      >
        <AnchoredTooltip content={t.swap.flip}>
          <button
            aria-label={t.swap.flip}
            className={cn(
              'grid size-8 place-items-center rounded-sm border border-border bg-card p-0',
              'text-sm font-normal leading-normal tracking-[-0.28px] text-foreground shadow-none transition-[border-color,transform] duration-180 ease-out',
              'enabled:hover:-translate-y-px enabled:hover:border-primary',
              'enabled:focus-visible:-translate-y-px enabled:focus-visible:border-primary',
              'max-dapp:my-2',
            )}
            disabled={sessionReady && !swap.walletReady}
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
          value: swapPreview ? swap.buyAmount || '0.00' : swap.buyAmount,
        }}
        className={cn('mt-0', flipAnimClass)}
        sessionReady
        balance={buyBalanceLabel}
        label={t.swap.buy}
        tokenIcon={pair.buy.icon}
        tokenLabel={pair.buy.symbol}
      />

      <DappMetaList
        className="mt-3.5 max-dapp:mt-3"
        sessionReady
        items={[
          {
            label: t.swap.exchangePrice,
            value: showRateSkeleton ? (
              <SwapMetaValueSkeleton />
            ) : (
              swap.exchangePriceLabel || placeholderRateLabel
            ),
            valueClassName: SWAP_META_VALUE_ROW_CLASS,
          },
          {
            label: t.swap.allowedSlippage,
            value: (
              <>
                {swap.slippage}%
                <button
                  aria-label={t.swap.slippageSettings}
                  className={cn(
                    'grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0',
                    'transition-opacity duration-180 ease-out hover:opacity-80',
                    sessionReady && !swap.walletReady && 'pointer-events-none opacity-40',
                  )}
                  disabled={sessionReady && !swap.walletReady}
                  onClick={() => setSlippageOpen(true)}
                  type="button"
                >
                  <DappIcon alt="" size="xs" src={dappAssets.setting} />
                </button>
              </>
            ),
            valueClassName: SWAP_META_VALUE_ROW_CLASS,
          },
          {
            label: t.swap.route,
            value: swap.routeLabel,
          },
          {
            label: t.swap.provider,
            value: (
              <>
                {t.swap.providerName}
                <button
                  aria-label={t.swap.openPancakeSwap}
                  className={cn(
                    'grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0',
                    'transition-opacity duration-180 ease-out hover:opacity-80',
                  )}
                  onClick={() => openPancakeSwapDeepLink(swap.pancakeSwapUrl)}
                  type="button"
                >
                  <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
                </button>
              </>
            ),
            valueClassName: SWAP_META_VALUE_ROW_CLASS,
          },
        ]}
      />

      {sessionReady && swap.walletReady ? (
        <DappActionRow className="mt-3.5 max-dapp:mt-3">
          <DappActionButton
            className="col-span-full"
            disabled={!swap.canSubmit}
            loading={swap.isSubmitting}
            onClick={() => void handleSubmit()}
          >
            {swap.action === 'approve' ? t.swap.approve : t.swap.action}
          </DappActionButton>
        </DappActionRow>
      ) : null}

      {sessionReady ? (
        <DappWidgetConnectFooter pager={swapPager}>
          <GenesisPromoCard
            actionLabel={t.genesis.joinGenesis}
            className={cn(
              'gap-1.5 [&_button]:min-h-9.5 [&_button]:text-xs [&_p]:leading-tight',
              'max-dapp:mt-3.5 max-dapp:[&_button]:min-h-10 max-dapp:[&_button]:text-sm',
            )}
            isLoading={genesis.isLoading}
            onClick={onSelectGenesis}
            promo={genesis.promoSnapshot}
          />
        </DappWidgetConnectFooter>
      ) : (
        <DappWidgetConnectPromo pager={swapPager} />
      )}

      <SwapSlippageModal
        onConfirm={swap.setSlippage}
        onOpenChange={setSlippageOpen}
        open={slippageOpen}
        slippage={swap.slippage}
      />
    </DappWidgetFrame>
  )
}

export function SwapContent({
  swapPager = false,
}: {
  swapPager?: boolean
}) {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const swapDirection = useSwapDirectionStore((state) => state.direction)
  const { rateLabel: poolRateLabel, isLoading: poolRateLoading } = usePairSpotRate(
    sessionReady,
    swapDirection,
  )
  const [faqToken, setFaqToken] = useState<SwapTokenKey>('usd1')
  const faqItems = t.swap.faq.tabs[faqToken].items

  const overviewMetrics = (
    <MetricGrid
      className="max-dapp:mt-3.5 max-dapp:[&>article]:mt-0"
      columns={2}
    >
      {sessionReady && poolRateLoading && !poolRateLabel ? (
        <MetricCardSkeleton className="max-dapp:min-w-0 max-dapp:rounded-md max-dapp:p-3.5" />
      ) : (
        <MetricCard
          className={cn(
            sessionReady && '[&_small]:hidden',
            'max-dapp:min-w-0 max-dapp:gap-1.5 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2]',
          )}
          label={t.swap.exchangeRate}
          value={
            sessionReady
              ? poolRateLabel ?? '—'
              : '--- : ---'
          }
        />
      )}
      <MetricCard
        className={cn(
          sessionReady && '[&_small]:hidden',
          'max-dapp:min-w-0 max-dapp:gap-1.5 max-dapp:rounded-md max-dapp:p-3.5 max-dapp:[&_small]:hidden max-dapp:[&_strong]:text-xs max-dapp:[&_strong]:leading-[1.2]',
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

      <DappCollapsibleSection
        bodyClassName="overflow-visible"
        className={cn(
          '!translate-y-0 !opacity-100 !transition-none',
          '[&_h3]:flex [&_h3]:items-center [&_h3]:justify-between [&_h3]:gap-3',
          '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-[1.2] [&_h3]:tracking-[-0.8px]',
          'max-dapp:[&_h3]:pb-2.5 max-dapp:[&_h3]:text-base max-dapp:[&_h3]:tracking-[-0.64px]',
          'dapp:[&+section]:mt-8',
          '[&_h3_button]:w-full',
        )}
        title={t.swap.tokenAbout.title}
      >
        <TokenAboutCarousel />
      </DappCollapsibleSection>

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
