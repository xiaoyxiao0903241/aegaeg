import {
  AnchoredTooltip,
  type AnchoredTooltipProps,
} from '~/shared/ui/anchored-tooltip'
import { DappInfoIcon } from '~/app/components/dapp-info-icon'
import { cn } from '~/shared/lib/utils'

type DappInfoTooltipProps = Pick<AnchoredTooltipProps, 'align' | 'content' | 'position'> & {
  ariaLabel?: string
  className?: string
}

/** SSOT for hint tooltip triggers — Genesis xTokenAirdrop icon. */
export function DappInfoTooltip({
  align,
  ariaLabel,
  className,
  content,
  position,
}: DappInfoTooltipProps) {
  return (
    <AnchoredTooltip align={align} content={content} position={position}>
      <button
        aria-label={ariaLabel ?? (typeof content === 'string' ? content : undefined)}
        className={cn(
          'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity duration-180 ease-out hover:opacity-80',
          className,
        )}
        type="button"
      >
        <DappInfoIcon />
      </button>
    </AnchoredTooltip>
  )
}
