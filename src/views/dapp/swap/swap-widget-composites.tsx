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

const swapGenesisFooterCardClass = cn(
  'gap-1.5 [&_button]:min-h-9.5 [&_button]:text-xs [&_p]:leading-tight',
  'max-dapp:[&_button]:min-h-10 max-dapp:[&_button]:text-sm',
)

export const swapPercentRowClass = 'pt-2.5 max-dapp:mt-3 max-dapp:py-0'

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
            className="text-base font-medium leading-[1.4] tracking-[-0.02em]"
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
        startAdornment={<TokenChip icon={buy.icon} label={buy.symbol} />}
      />
    </>
  )
}

export function SwapMetaPanel({
  className,
  sessionReady = true,
  items,
}: {
  className?: string
  sessionReady?: boolean
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
        'grid shrink-0 gap-2 rounded-xl px-3.5 py-3.25',
        dappWidgetFooterTopGapClass,
        className,
      )}
    >
      {items.map((item, index) => (
        <p className="m-0 flex items-center justify-between gap-3" key={index}>
          {/* 4175 meta rows: text-sm (14) + tracking-normal — not copy 13 */}
          <Text
            as="span"
            variant="detail"
            tone="muted-foreground"
            className="leading-normal tracking-normal"
          >
            {item.label}
          </Text>
          <Text
            as="strong"
            variant="detail"
            className={cn(
              'mt-0 text-right font-semibold leading-normal tracking-normal',
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
