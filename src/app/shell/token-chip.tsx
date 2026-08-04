import { DappIcon } from '~/app/shell/dapp-icon'
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
      {icon ? (
        <DappIcon alt="" className="rounded-md" loading="lazy" size="token" src={icon} />
      ) : null}
      <Text as="span" variant="detail" className="leading-[1.2] font-semibold">
        {label}
      </Text>
      {picker ? (
        <svg
          aria-hidden
          className="size-2.5 shrink-0 text-muted-foreground"
          fill="none"
          viewBox="0 0 9 5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L4.5 4L8 1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
        </svg>
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
