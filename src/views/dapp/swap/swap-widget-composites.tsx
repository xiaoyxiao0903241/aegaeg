import type { InputHTMLAttributes, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { dappAssets, flashSwapAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { DappWidgetConnectFooter } from '~/app/shell/components/dapp-widget-connect-footer'
import { dappWidgetBodyClass } from '~/app/shell/components/dapp-widget-frame'
import { GenesisPromoCard } from '~/app/shell/components/genesis-promo-card'
import { SwapAmountSkeleton, SwapBalanceSkeleton } from '~/app/shell/components/dapp-skeleton'
import { TokenChip } from '~/app/shell/components/token-chip'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { useI18n } from '~/i18n/use-i18n'
import { AmountBox } from '~/shared/ui/amount-box'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { Card } from '~/shared/ui/card'
import { IconButton } from '~/shared/ui/icon-button'
import { PercentButtonRow } from '~/shared/ui/segment'
import { Text } from '~/shared/ui/text'
import { WidgetSubpageHeader } from '~/shared/ui/widget-header'
import { cn } from '~/shared/lib/utils'
import { useDappShellStore } from '~/stores/dapp-shell-store'
import { useSwapViewStore } from '~/stores/swap-view-store'

const swapGenesisFooterCardClass = 'gap-1.5 [&_p]:leading-tight'

export const swapPercentRowClass = 'pt-2.5 max-dapp:mt-3 max-dapp:py-0'

/** Figma `flb` — 34×34 · `rounded-control` · border · card. Trade flip + Flash divider. */
export const swapFlowButtonClass = cn(
  'grid size-[2.125rem] shrink-0 place-items-center rounded-control border border-border bg-card p-0',
  'text-sm leading-none tracking-[-0.02em] text-foreground shadow-none',
)

/** Interactive flb (Trade flip) — very light scale (match Button motion SSOT). */
export const swapFlowButtonInteractiveClass = cn(
  swapFlowButtonClass,
  'origin-center',
  'transition-[border-color,background-color,box-shadow,transform,opacity] duration-160 ease-out',
  'enabled:cursor-pointer enabled:hover:scale-[1.02] enabled:hover:border-primary',
  'enabled:focus-visible:scale-[1.02] enabled:focus-visible:border-primary',
  'enabled:active:scale-[0.985] enabled:active:duration-75 enabled:active:border-primary',
  'disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-60',
)

export const swapFlipCard = tv({
  variants: {
    flipping: {
      true: '[animation:swap-card-flip_320ms_cubic-bezier(.2,.8,.2,1)_both]',
      false: '',
    },
  },
  defaultVariants: {
    flipping: false,
  },
})

export function SwapPanelToggle() {
  const { messages: t } = useI18n()
  const detailCollapsed = useDappShellStore((state) => state.detailCollapsed)
  const toggle = useDappShellStore((state) => state.toggleDetailCollapsed)

  return (
    <AnchoredTooltip content={t.topbar.toggleTooltip}>
      <IconButton
        aria-expanded={!detailCollapsed}
        aria-label={detailCollapsed ? t.topbar.showDetails : t.topbar.hideDetails}
        className="shrink-0"
        onClick={toggle}
      >
        <DappIcon
          className={cn(
            'transition-transform duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)]',
            detailCollapsed && 'rotate-90',
          )}
          size="lg"
          src={dappAssets.menu}
          alt=""
        />
      </IconButton>
    </AnchoredTooltip>
  )
}

export function SwapWidgetBody({
  bodyClassName,
  children,
  footer,
}: {
  bodyClassName?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className={cn(dappWidgetBodyClass, bodyClassName)}>
      {children}
      {footer ? <div className="mt-auto w-full shrink-0">{footer}</div> : null}
    </div>
  )
}

export function SwapSubpageHeader({
  subtitle,
  title,
}: {
  subtitle: ReactNode
  title: ReactNode
}) {
  const { messages: t } = useI18n()
  const setView = useSwapViewStore((state) => state.setView)

  return (
    <WidgetSubpageHeader
      action={<SwapPanelToggle />}
      backLabel={
        <>
          <DappIcon alt="" size="sm" src={flashSwapAssets.backArrow} />
          <Text
            tone="muted-foreground"
            variant="headline"
            className="text-base font-medium leading-[1.4]"
          >
            {t.swap.backToHub}
          </Text>
        </>
      }
      onBack={() => setView('hub')}
      subtitle={subtitle}
      title={title}
    />
  )
}

export function useSwapBalanceLabels({
  buyBalanceLabel,
  isBalancesLoading,
  sellBalanceLabel,
  sessionReady,
  walletReady,
}: {
  buyBalanceLabel: string
  isBalancesLoading: boolean
  sellBalanceLabel: string
  sessionReady: boolean
  walletReady: boolean
}) {
  const { messages: t } = useI18n()
  const swapPreview = !sessionReady
  const showBalanceSkeleton = !swapPreview && isBalancesLoading
  const zeroBalanceLabel = `${t.swap.balance}: 0.00`

  const sellLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${walletReady ? sellBalanceLabel : '—'}`
  )

  const buyLabel = showBalanceSkeleton ? (
    <>
      {t.swap.balance}: <SwapBalanceSkeleton />
    </>
  ) : swapPreview ? (
    zeroBalanceLabel
  ) : (
    `${t.swap.balance}: ${walletReady ? buyBalanceLabel : '—'}`
  )

  return { buyLabel, sellLabel, swapPreview }
}

type AmountToken = { icon: string; symbol: string }

export function SwapAmountFlow({
  amountBoxClassName,
  buy,
  buyAmount,
  buyBalance,
  middleSlot,
  onFillPercent,
  onSellAmountChange,
  sell,
  sellAmountDisplay,
  sellBalance,
  sessionReady,
  showBuyAmountSkeleton,
  walletReady,
}: {
  amountBoxClassName?: string
  buy: AmountToken
  buyAmount: string
  buyBalance: ReactNode
  middleSlot: ReactNode
  onFillPercent: (percent: number) => void
  onSellAmountChange: (value: string) => void
  sell: AmountToken
  sellAmountDisplay: string
  sellBalance: ReactNode
  sessionReady: boolean
  showBuyAmountSkeleton: boolean
  walletReady: boolean
}) {
  const { messages: t } = useI18n()
  const swapPreview = !sessionReady

  const sellAmountProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    'aria-label': string
  } = {
    'aria-label': `${sell.symbol} sell amount`,
    disabled: sessionReady && !walletReady,
    inputMode: 'decimal',
    onChange: (event) => onSellAmountChange(event.currentTarget.value),
    placeholder: '0.00',
    value: sellAmountDisplay,
  }

  return (
    <>
      <AmountBox
        amountProps={sellAmountProps}
        balance={sellBalance}
        className={amountBoxClassName}
        label={t.swap.sell}
        sessionReady={sessionReady}
        startAdornment={<TokenChip icon={sell.icon} label={sell.symbol} />}
      />

      <PercentButtonRow
        className={swapPercentRowClass}
        disabled={!swapPreview && !walletReady}
        onSelect={onFillPercent}
      />

      {middleSlot}

      <AmountBox
        amountProps={{
          'aria-label': `${buy.symbol} receive amount`,
          placeholder: '0.00',
          readOnly: true,
          value: swapPreview ? buyAmount || '0.00' : buyAmount,
        }}
        balance={buyBalance}
        className={cn('mt-0', amountBoxClassName)}
        label={t.swap.buy}
        loading={showBuyAmountSkeleton}
        loadingSkeleton={<SwapAmountSkeleton />}
        sessionReady={sessionReady}
        startAdornment={<TokenChip icon={buy.icon} label={buy.symbol} />}
      />
    </>
  )
}

export function SwapMetaPanel({
  className,
  items,
}: {
  className?: string
  items: Array<{
    label: React.ReactNode
    value: React.ReactNode
    valueClassName?: string
  }>
}) {
  return (
    <Card
      as="div"
      surface="outlined"
      className={cn(
        // Chrome from Card outlined (`p-3.5` / `rounded-md`); ≡ DappMetaList — do not re-pad.
        'grid shrink-0 gap-2',
        dappWidgetFooterTopGapClass,
        className,
      )}
    >
      {items.map((item, index) => (
        <p className="m-0 flex items-center justify-between gap-3" key={index}>
          {/* Meta rows: detail 14 + token tracking -0.02em ≡ Figma */}
          <Text
            as="span"
            variant="detail"
            tone="muted-foreground"
            className="leading-normal"
          >
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="detail"
            className={cn(
              'mt-0 text-right font-semibold leading-normal',
              item.valueClassName,
            )}
          >
            {item.value}
          </Text>
        </p>
      ))}
    </Card>
  )
}

export function SwapGenesisFooter({ onSelectGenesis }: { onSelectGenesis: () => void }) {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  return (
    <DappWidgetConnectFooter>
      <GenesisPromoCard
        actionLabel={t.genesis.joinGenesis}
        className={swapGenesisFooterCardClass}
        isLoading={genesis.isLoading}
        onClick={onSelectGenesis}
        promo={genesis.promoSnapshot}
      />
    </DappWidgetConnectFooter>
  )
}
