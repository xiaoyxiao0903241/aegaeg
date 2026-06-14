import type { CSSProperties } from 'react'
import { cn } from '~/lib/utils'
import type { DappTab } from './types'
import { railItems } from './assets'
import { useI18n } from '../i18n/use-i18n'
import { AnchoredTooltip } from '../components/anchored-tooltip'
import {
  shellMobileRailClass,
  shellMobileRailItemClass,
  shellRailClass,
  shellRailIconClass,
  shellRailItemClass,
} from './shell-layout'

const railCopy = {
  swap: {
    label: 'swap',
    tooltip: 'swapTooltip',
  },
  genesis: {
    label: 'genesis',
    tooltip: 'genesisTooltip',
  },
  rewards: {
    label: 'rewards',
    tooltip: 'rewardsTooltip',
  },
  community: {
    label: 'community',
    tooltip: 'communityTooltip',
  },
} as const

function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
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

  return (
    <nav
      className={cn(shellRailClass(), mobile && shellMobileRailClass)}
      aria-label="DApp sections"
    >
      {railItems.map((item) => {
        const copy = railCopy[item.id]
        const label = t.nav[copy.label]
        const active = item.id === activeTab

        return (
          <AnchoredTooltip content={t.nav[copy.tooltip]} key={item.id} position="right">
            <button
              aria-label={label}
              aria-selected={active}
              className={mobile ? shellMobileRailItemClass(active) : shellRailItemClass(active)}
              onClick={() => onSelectTab(item.id)}
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
