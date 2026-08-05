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

/** 导航各步骤在引导流程中的锚点标识；创世页不在引导范围内。 */
export const railTourIds = {
  exchange: 'nav-swap',
  assets: 'nav-assets',
  staking: 'nav-staking',
  rewards: 'nav-rewards',
  release: 'nav-release',
  community: 'nav-community',
  genesis: undefined,
} as const satisfies Record<DappTab, string | undefined>

/**
 * 将图标文件作为 CSS 遮罩，使其显示为当前文字色。
 *
 * @param icon 图标资源路径
 * @returns 遮罩相关样式，供 `style` 内联使用
 */
export function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
}
