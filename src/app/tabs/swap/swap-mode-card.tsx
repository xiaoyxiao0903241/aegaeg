import { DappIcon } from '~/app/components/dapp-icon'
import {
  swapModeCardBadgeClass,
  swapModeCardBodyClass,
  swapModeCardClass,
  swapModeCardInteractiveClass,
  swapModeCardTitleClass,
} from '~/app/tabs/swap/swap-layout-tokens'
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
      className={cn(swapModeCardClass, interactive && swapModeCardInteractiveClass)}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <strong className={swapModeCardTitleClass}>{title}</strong>
          {badge ? <span className={swapModeCardBadgeClass}>{badge}</span> : null}
        </span>
        <span className={swapModeCardBodyClass}>{body}</span>
      </span>
    </button>
  )
}
