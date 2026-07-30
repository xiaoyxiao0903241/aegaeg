import { tv } from 'tailwind-variants'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/**
 * Exchange hub right-rail tile — Figma `4323:704` (elevated, h70).
 * Chrome is identical; optional `icon` URLs are the only structural fork.
 * No onClick → `article` (same visual); never HTML `disabled` (global dims + strips shadow).
 */
const exchangeProgramCard = tv({
  base: 'flex h-[70px] w-full px-4 py-3.5 text-left',
  variants: {
    hasIcon: {
      true: 'items-center justify-between gap-2',
      false: 'flex-col items-start justify-center gap-1.5',
    },
    interactive: {
      true: 'duration-dapp-fast cursor-pointer transition-[transform,box-shadow] ease-out hover:scale-[1.008] active:scale-[0.992]',
      false: null,
    },
  },
})

function ProgramCoinIcon({ icon }: { icon: readonly [string] | readonly [string, string] }) {
  if (icon.length === 1) {
    return (
      <img
        alt=""
        className="size-7 shrink-0 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
    )
  }

  return (
    <span className="relative flex h-7 w-[53px] shrink-0 items-center">
      <img
        alt=""
        className="absolute top-0 left-[2px] size-7 rounded-md object-cover"
        height={28}
        src={icon[0]}
        width={28}
      />
      <img
        alt=""
        className="absolute top-0 left-[25px] size-7 rounded-md object-cover"
        height={28}
        src={icon[1]}
        width={28}
      />
    </span>
  )
}

export function ExchangeProgramCard({
  body,
  icon,
  onClick,
  title,
}: {
  body: string
  /** 1 = single coin · 2 = overlapping dual · omit = text-only. */
  icon?: readonly [string] | readonly [string, string]
  onClick?: () => void
  title: string
}) {
  const interactive = Boolean(onClick)

  return (
    <Card
      as={interactive ? 'button' : 'article'}
      surface="elevated"
      className={cn(exchangeProgramCard({ hasIcon: Boolean(icon), interactive }))}
      {...(interactive ? { onClick, type: 'button' as const } : {})}
    >
      <Card.Content className={cn('grid min-w-0 gap-1.5 text-left', icon && 'flex-1')}>
        <Text as="strong" className="text-[14px] leading-normal font-semibold" variant="copy">
          {title}
        </Text>
        <Text as="span" className="leading-normal text-foreground/40" variant="support">
          {body}
        </Text>
      </Card.Content>
      {icon ? <ProgramCoinIcon icon={icon} /> : null}
    </Card>
  )
}
