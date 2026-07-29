import type { CSSProperties } from 'react'
import type { DappTab } from '~/shared/config/dapp-tabs'

export const railNavLabelKeys = {
  exchange: 'exchange',
  assets: 'assets',
  staking: 'staking',
  rewards: 'rewards',
  release: 'release',
  community: 'community',
  genesis: 'genesis',
} as const satisfies Record<
  DappTab,
  'exchange' | 'assets' | 'staking' | 'rewards' | 'release' | 'community' | 'genesis'
>

/** Prototype Shell tour ids for nav steps (ticket 02). Genesis is not in the tour. */
export const railTourIds = {
  exchange: 'nav-swap',
  assets: 'nav-assets',
  staking: 'nav-staking',
  rewards: 'nav-rewards',
  release: 'nav-release',
  community: 'nav-community',
  genesis: undefined,
} as const satisfies Record<DappTab, string | undefined>

export function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
}
