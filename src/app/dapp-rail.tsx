import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn } from '~/lib/utils'
import type { DappTab } from '~/app/types'
import { railItems } from '~/app/assets'
import { railIconMask, railNavLabelKeys } from '~/app/rail-shared'
import { useI18n } from '~/i18n/use-i18n'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { useDappShell } from '~/app/dapp-shell-context'
import { usePairSpotRate } from '~/hooks/use-pair-spot-rate'
import {
  shellMobileRailClass,
  shellMobileRailItemClass,
  shellRailClass,
  shellRailIconClass,
  shellRailIndicatorClass,
  shellRailItemClass,
} from '~/app/shell-layout'

type RailIndicator = {
  height: number
  top: number
}

function useRailTooltips() {
  const { messages: t } = useI18n()
  const { connected } = useDappShell()
  const { rateLabel } = usePairSpotRate(connected)

  return useMemo(
    () => ({
      swap: !connected
        ? t.swap.disconnectedIntro
        : rateLabel
          ? `${rateLabel} · ${t.swap.settlementValue}`
          : t.swap.intro,
      genesis: t.nav.genesisTooltip,
      rewards: t.nav.rewardsTooltip,
      community: t.nav.communityTooltip,
    }),
    [connected, rateLabel, t],
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
  const tooltips = useRailTooltips()
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
      className={cn(shellRailClass(), mobile && shellMobileRailClass)}
      aria-label="DApp sections"
      ref={navRef}
    >
      {indicator ? (
        <span
          aria-hidden
          className={cn(
            shellRailIndicatorClass,
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
              className={mobile ? shellMobileRailItemClass(active) : shellRailItemClass(active)}
              onClick={() => onSelectTab(item.id)}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node)
                else itemRefs.current.delete(item.id)
              }}
              role="tab"
              type="button"
            >
              <span
                className={shellRailIconClass}
                style={railIconMask(item.icon)}
                aria-hidden="true"
              />
              <span>{label}</span>
            </button>
          </AnchoredTooltip>
        )
      })}
    </nav>
  )
}
