import { tv } from 'tailwind-variants'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { Text } from '~/shared/ui/text'

const swapModeCard = tv({
  base: 'flex w-full items-center gap-3 rounded-md border border-border bg-card p-3.5 text-left shadow-none',
  variants: {
    interactive: {
      true: 'cursor-pointer transition-[border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-primary',
      false: '',
    },
  },
})

export function SwapModeCard({
  badge,
  body,
  icon,
  onClick,
  title,
}: {
  badge?: string
  body: string
  icon: string
  onClick?: () => void
  title: string
}) {
  const interactive = Boolean(onClick)

  return (
    <button className={swapModeCard({ interactive })} onClick={onClick} type="button">
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <Text as="strong" tone="foreground" variant="compact-title">
            {title}
          </Text>
          {badge ? (
            <Text
              as="span"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#FF9500] px-2 py-1.5"
              tone="inverse"
              variant="mode-badge"
            >
              {badge}
            </Text>
          ) : null}
        </span>
        <Text tone="muted" variant="compact-body" className="leading-normal">
          {body}
        </Text>
      </span>
    </button>
  )
}
