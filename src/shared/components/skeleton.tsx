import { tv } from 'tailwind-variants'

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
export function Skeleton({
  className,
  tone = 'surface',
}: {
  className?: string
  tone?: 'dark' | 'surface'
}) {
  return <span aria-hidden="true" className={dappSkeleton({ tone, class: className })} />
}
