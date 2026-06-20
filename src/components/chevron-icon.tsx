import { cn } from '~/lib/utils'
import { dappIconClass } from '~/app/dapp-icon-scale'

const CHEVRON_MASK = {
  up: "[mask:url('/assets/figma/dapp/ic-chevron-up.svg')_center/contain_no-repeat]",
  side: "[mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]",
} as const

export function ChevronIcon({
  className,
  direction,
}: {
  className?: string
  direction: 'left' | 'right' | 'up'
}) {
  const rotation =
    direction === 'left' ? '-rotate-90' : direction === 'right' ? 'rotate-90' : ''
  const mask = direction === 'up' ? CHEVRON_MASK.up : CHEVRON_MASK.side

  return (
    <span
      aria-hidden
      className={cn('block shrink-0 bg-current', dappIconClass.xs, rotation, mask, className)}
    />
  )
}
