import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { railItems } from '~/app/assets'
import { railIconMask, railNavLabelKeys } from '~/app/rail-shared'
import { useI18n } from '~/i18n/use-i18n'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { Text } from '~/shared/ui/text'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { formatGenesisSeasonIntro } from '~/views/dapp/genesis/genesis-promo'
import { usePairSpotRate } from '~/hooks/use-pair-spot-rate'

type RailIndicator = {
  height: number
  top: number
}

const railItem = tv({
  base: cn(
    'relative z-1 flex w-full min-h-15 cursor-pointer flex-col items-center justify-center gap-1 rounded-md bg-transparent px-1 py-2.5',
    'transition-[color,background-color] duration-180 ease-out',
  ),
  variants: {
    active: {
      true: 'text-primary',
      false: 'text-muted-foreground hover:bg-background hover:text-foreground',
    },
    mobile: {
      true: 'min-h-12 flex-row justify-start px-3',
      false: '',
    },
  },
})

function useRailTooltips(activeTab: DappTab) {
  const { messages: t } = useI18n()
  const { rateLabel } = usePairSpotRate(activeTab === 'swap')
  const genesis = useGenesisWidgetContext()

  return useMemo(
    () => ({
      swap: t.swap.intro,
      genesis: formatGenesisSeasonIntro(
        t.genesis.intro,
        genesis.activeSeasonNumber,
        genesis.discountLabel,
        genesis.isLoading,
      ),
      rewards: t.nav.rewardsTooltip,
      community: t.nav.communityTooltip,
    }),
    [
      genesis.activeSeasonNumber,
      genesis.discountLabel,
      genesis.isLoading,
      rateLabel,
      t,
    ],
  )
}

export function DappRail({
  activeTab,
  mobile = false,
  onSelectTab,
}: {
  activeTab: DappTab
  mobile?: boolean
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()
  const tooltips = useRailTooltips(activeTab)
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef(new Map<DappTab, HTMLButtonElement>())
  const [indicator, setIndicator] = useState<RailIndicator | null>(null)
  const [indicatorReady, setIndicatorReady] = useState(false)

  const updateIndicator = useCallback(() => {
    const nav = navRef.current
    const button = itemRefs.current.get(activeTab)
    if (!nav || !button) return

    const navRect = nav.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()

    setIndicator({
      top: buttonRect.top - navRect.top,
      height: buttonRect.height,
    })
  }, [activeTab])

  useLayoutEffect(() => {
    updateIndicator()

    if (!indicatorReady) {
      requestAnimationFrame(() => setIndicatorReady(true))
    }
  }, [activeTab, indicatorReady, updateIndicator])

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new ResizeObserver(updateIndicator)
    observer.observe(nav)
    itemRefs.current.forEach((button) => observer.observe(button))

    return () => observer.disconnect()
  }, [updateIndicator])

  return (
    <nav
      className={cn(
        'relative flex h-full min-h-0 max-h-full flex-col gap-1.5 border-r border-border bg-card px-2 py-3.5',
        'max-dapp:hidden',
        mobile && 'grid h-auto max-h-none min-h-0 gap-0 border-0 p-2',
      )}
      aria-label="DApp sections"
      ref={navRef}
    >
      {indicator ? (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-2 top-0 z-0 rounded-md bg-accent will-change-[transform,height]',
            indicatorReady &&
              'transition-[transform,height] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          )}
          style={{
            height: indicator.height,
            transform: `translate3d(0, ${indicator.top}px, 0)`,
          }}
        />
      ) : null}

      {railItems.map((item) => {
        const label = t.nav[railNavLabelKeys[item.id]]
        const active = item.id === activeTab

        return (
          <AnchoredTooltip content={tooltips[item.id]} key={item.id} position="right">
            <button
              aria-label={label}
              aria-selected={active}
              className={railItem({ active, mobile })}
              onClick={() => onSelectTab(item.id)}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node)
                else itemRefs.current.delete(item.id)
              }}
              role="tab"
              type="button"
            >
              <span
                className="aspect-square size-[var(--dapp-icon-rail)] bg-current"
                style={railIconMask(item.icon)}
                aria-hidden="true"
              />
              <Text
                as="span"
                variant="caption"
                tone={active ? 'primary' : 'muted-foreground'}
                className={cn(
                  mobile ? 'min-w-0 flex-1 truncate' : 'block w-full min-w-0 truncate text-center',
                  'text-xs leading-snug tracking-tight',
                )}
                title={label}
              >
                {label}
              </Text>
            </button>
          </AnchoredTooltip>
        )
      })}
    </nav>
  )
}
