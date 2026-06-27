import { DappIcon } from '~/app/components/dapp-icon'
import { cn } from '~/lib/utils'

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
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-none',
        interactive &&
          'cursor-pointer transition-[border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-primary',
      )}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <strong className="text-[0.8125rem] font-semibold leading-normal tracking-[-0.02em] text-foreground">
            {title}
          </strong>
          {badge ? (
            <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#FF9500] px-2 py-1.5 text-[0.625rem] font-medium leading-none tracking-[-0.02em] text-white">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="text-[0.8125rem] font-normal leading-normal tracking-[-0.02em] text-muted-foreground">
          {body}
        </span>
      </span>
    </button>
  )
}
