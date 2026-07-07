import type { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'
import { useI18n } from '~/i18n/use-i18n'
import { GenesisPromoCard } from '~/app/shell/components/genesis-promo-card'
import { DappWidgetConnectFooter } from '~/app/shell/components/dapp-widget-connect-footer'
import { DappMetaList } from '~/app/shell/components/dapp-meta-list'
import { dappWidgetFooterTopGapClass } from '~/app/dapp-detail-layout'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

const swapPercentGrid = tv({
  base: 'grid grid-cols-4 gap-1.5 pt-2.5 max-dapp:mt-3 max-dapp:py-0',
})

const swapPercentButton = tv({
  base: [
    'group flex cursor-pointer items-center justify-center rounded-[0.5625rem] border border-border bg-card py-1.25',
    'transition-[border-color,color,transform] duration-180 ease-out',
    'hover:-translate-y-px hover:border-primary hover:text-primary',
    'disabled:pointer-events-none disabled:opacity-55',
    'max-dapp:h-auto max-dapp:py-1.5',
  ],
})

const swapGenesisFooterCard = tv({
  base: 'gap-1.5 [&_button]:min-h-9.5 max-dapp:[&_button]:min-h-10',
})

const swapMetaPanel = tv({
  base: 'rounded-xl px-3.5 py-3.25',
})

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

export function SwapPercentButtons({
  disabled,
  onSelect,
}: {
  disabled: boolean
  onSelect: (percent: number) => void
}) {
  return (
    <div className={swapPercentGrid()}>
      {[25, 50, 75, 100].map((percent) => (
        <button
          className={swapPercentButton()}
          disabled={disabled}
          key={percent}
          onClick={() => onSelect(percent)}
          type="button"
        >
          <Text className="group-hover:text-primary" tone="foreground" variant="label" weight="semibold">
            {percent}%
          </Text>
        </button>
      ))}
    </div>
  )
}

export function SwapGenesisFooter({ onSelectGenesis }: { onSelectGenesis: () => void }) {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  return (
    <DappWidgetConnectFooter>
      <GenesisPromoCard
        actionLabel={t.genesis.joinGenesis}
        className={swapGenesisFooterCard()}
        isLoading={genesis.isLoading}
        onClick={onSelectGenesis}
        promo={genesis.promoSnapshot}
      />
    </DappWidgetConnectFooter>
  )
}

export function SwapMetaPanel({
  className,
  ...props
}: ComponentProps<typeof DappMetaList>) {
  return (
    <DappMetaList
      className={cn(swapMetaPanel(), dappWidgetFooterTopGapClass, className)}
      {...props}
    />
  )
}
