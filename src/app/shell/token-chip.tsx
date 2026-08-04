import { ChevronDown } from 'lucide-react'

import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export function TokenChip({
  icon,
  label,
  onClick,
  picker = false,
}: {
  icon?: string
  label: string
  /** Figma trade sell/buy token pill with chevron. */
  picker?: boolean
  onClick?: () => void
}) {
  const body = (
    <>
      {icon ? <Icon alt="" className="rounded-md" loading="lazy" size="token" src={icon} /> : null}
      <Text as="span" variant="detail" className="leading-[1.2] font-semibold">
        {label}
      </Text>
      {picker ? (
        <ChevronDown
          aria-hidden
          className="size-2.5 shrink-0 text-muted-foreground"
          strokeWidth={2.5}
        />
      ) : null}
    </>
  )

  if (!picker) {
    return <span className="inline-flex items-center gap-2">{body}</span>
  }

  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-background px-2.5 py-1.5',
        onClick && 'cursor-pointer',
        !onClick && 'cursor-default',
      )}
      onClick={onClick}
      type="button"
    >
      {body}
    </button>
  )
}
