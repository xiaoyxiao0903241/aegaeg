import type { CSSProperties } from 'react'
import type { DappTab } from '~/app/types'

export const railNavLabelKeys = {
  swap: 'swap',
  genesis: 'genesis',
  rewards: 'rewards',
  community: 'community',
} as const satisfies Record<DappTab, 'swap' | 'genesis' | 'rewards' | 'community'>

export function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
}
