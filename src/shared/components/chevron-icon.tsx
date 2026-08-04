import { tv } from 'tailwind-variants'

import { dappIcon } from '~/shared/components/dapp-icon-scale'

const CHEVRON_MASK = {
  up: "[mask:url('/assets/figma/dapp/ic-chevron-up.svg')_center/contain_no-repeat]",
  side: "[mask:url('/assets/figma/dapp/ic-chevron.svg')_center/contain_no-repeat]",
} as const

const chevronIcon = tv({
  extend: dappIcon,
  base: 'block bg-current',
  variants: {
    direction: {
      left: '-rotate-90',
      right: 'rotate-90',
      up: '',
    },
  },
})

export function ChevronIcon({
  className,
  direction,
}: {
  className?: string
  direction: 'left' | 'right' | 'up'
}) {
  const mask = direction === 'up' ? CHEVRON_MASK.up : CHEVRON_MASK.side
  return (
    <span
      aria-hidden
      className={chevronIcon({
        size: 'xs',
        direction,
        class: [mask, className],
      })}
    />
  )
}
