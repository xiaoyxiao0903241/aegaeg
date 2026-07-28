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

export function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
}
