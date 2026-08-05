import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

/** 社区数据卡在 H5 下共用的容器样式（被多张实时卡引用，故抽成一处）。 */
export const communityStatCardMobileShell = tv({
  base: cn(
    'max-dapp:items-start max-dapp:rounded-md max-dapp:border-0',
    'max-dapp:p-(--dapp-community-stat-padding) max-dapp:text-left max-dapp:shadow-card',
  ),
})

const dappSkeleton = tv({
  base: ['block rounded-md', 'motion-safe:animate-[dapp-skeleton-pulse_1.4s_ease-in-out_infinite]'],
  variants: {
    tone: {
      surface: 'bg-skeleton',
      dark: 'bg-skeleton-on-dark',
    },
  },
  defaultVariants: {
    tone: 'surface',
  },
})

/**
 * 加载占位块，带脉冲动画。
 *
 * @param tone surface=普通背景 · dark=深色背景上的占位
 */
export function DappSkeleton({
  className,
  tone = 'surface',
}: {
  className?: string
  tone?: 'dark' | 'surface'
}) {
  return <span aria-hidden="true" className={dappSkeleton({ tone, class: className })} />
}
