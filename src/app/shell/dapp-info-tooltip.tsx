import { DappInfoIcon } from '~/app/shell/dapp-info-icon'
import { AnchoredTooltip, type AnchoredTooltipProps } from '~/shared/components/anchored-tooltip'
import { cn } from '~/shared/lib/utils'

type DappInfoTooltipProps = Pick<AnchoredTooltipProps, 'align' | 'content' | 'position'> & {
  ariaLabel?: string
  className?: string
}

/** Hint tooltip trigger (e.g. Genesis xTokenAirdrop icon). */
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
          'duration-dapp-fast inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80',
          className,
        )}
        type="button"
      >
        <DappInfoIcon />
      </button>
    </AnchoredTooltip>
  )
}
