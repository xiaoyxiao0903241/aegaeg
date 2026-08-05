import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { railItems } from '~/app/assets'
import { railIconMask, railNavLabelKeys, railTourIds } from '~/app/rail-shared'
import { useAppShell } from '~/app/use-app-shell'
import { formatGenesisSeasonIntro } from '~/core/presale/genesis-promo'
import { useGenesisPromoChrome } from '~/hooks/use-genesis-promo'
import { useReleaseRailDot } from '~/hooks/use-release-rail-dot'
import { useTurbineExchangeRailDot } from '~/hooks/use-turbine-exchange-rail-dot'
import { useI18n } from '~/i18n/use-i18n'
import { prefetchTabQueries } from '~/shared/api/query/prefetch'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { cn } from '~/shared/lib/utils'

type RailIndicator = {
  height: number
  top: number
}

const railItem = tv({
  base: cn(
    'relative z-1 flex min-h-15 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md bg-transparent px-1 py-2.5',
    'duration-dapp-fast transition-[color,background-color] ease-out',
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

function useRailTooltips() {
  const { messages: t } = useI18n()
  const genesis = useGenesisPromoChrome()

  return useMemo(
    () => ({
      exchange: t.exchange.intro,
      assets: t.assets.body,
      staking: t.staking.body,
      rewards: t.nav.rewardsTooltip,
      release: t.release.intro,
      community: t.nav.communityTooltip,
      genesis: formatGenesisSeasonIntro(
        t.genesis.intro,
        genesis.activeSeasonNumber,
        genesis.discountLabel,
        genesis.isLoading,
      ),
    }),
    [genesis.activeSeasonNumber, genesis.discountLabel, genesis.isLoading, t],
  )
}

/**
 * DApp 左侧导航条
 *
 * 列出一级 Tab（兑换、资产、质押等），高亮当前项并显示跟随滚动的选中指示条。
 * 兑换与释放页有可领奖状态时右上角显示珊瑚色小点；
 * 悬停 / 聚焦非当前项时预取该页查询。`mobile` 模式用于抽屉内横向布局。
 */
export function Rail({
  activeTab,
  mobile = false,
  onSelectTab,
}: {
  activeTab: DappTab
  mobile?: boolean
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useAppShell()
  const tooltips = useRailTooltips()
  const exchangeClaimable = useTurbineExchangeRailDot(sessionReady)
  const releaseClaimable = useReleaseRailDot(walletReady)
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
        'relative flex h-full max-h-full min-h-0 flex-col gap-1.5 border-r border-border bg-card px-2 py-3.5',
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
            indicatorReady && 'duration-dapp-emphasis transition-[transform,height] ease-dapp',
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
          <Tooltip content={tooltips[item.id]} key={item.id} position="right">
            <button
              aria-label={label}
              aria-selected={active}
              className={railItem({ active, mobile })}
              data-tour-id={railTourIds[item.id]}
              onClick={() => onSelectTab(item.id)}
              onMouseEnter={() => {
                if (item.id !== activeTab) prefetchTabQueries(item.id)
              }}
              onFocus={() => {
                if (item.id !== activeTab) prefetchTabQueries(item.id)
              }}
              ref={(node) => {
                if (node) itemRefs.current.set(item.id, node)
                else itemRefs.current.delete(item.id)
              }}
              role="tab"
              type="button"
            >
              <span
                className="aspect-square size-(--dapp-icon-rail) bg-current"
                style={railIconMask(item.icon)}
                aria-hidden="true"
              />
              {item.id === 'exchange' && exchangeClaimable ? (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 size-1.5 rounded-full bg-coral"
                  data-exchange-claimable-dot
                />
              ) : null}
              {item.id === 'release' && releaseClaimable ? (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 size-1.5 rounded-full bg-coral"
                  data-release-claimable-dot
                />
              ) : null}
              <Text
                as="span"
                variant="caption"
                tone={active ? 'primary' : 'muted-foreground'}
                className={cn(
                  mobile ? 'min-w-0 flex-1 truncate' : 'block w-full min-w-0 truncate text-center',
                  'text-xs/snug tracking-tight',
                )}
                title={label}
              >
                {label}
              </Text>
            </button>
          </Tooltip>
        )
      })}
    </nav>
  )
}
