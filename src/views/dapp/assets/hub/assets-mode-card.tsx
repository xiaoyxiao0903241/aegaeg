import { DappIcon } from '~/app/shell/dapp-icon'
import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/** Hub product entry — Figma `asset/*` leaf (not DappModeCard chrome). */
export function AssetsModeCard({
  aprHint,
  aprLabel,
  icon,
  onClick,
  positionApprox,
  positionLabel,
  positionValue,
  title,
  tourId,
  yieldApprox,
  yieldLabel,
  yieldValue,
}: {
  aprHint: string
  aprLabel: string
  icon: string
  onClick?: () => void
  positionApprox: string
  positionLabel: string
  positionValue: string
  title: string
  tourId?: string
  yieldApprox: string
  yieldLabel: string
  yieldValue: string
}) {
  return (
    <Card
      surface="outlined"
      className={cn(
        'relative grid w-full gap-2 p-4 text-left shadow-none',
        onClick &&
          'duration-dapp-fast transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      data-tour-id={tourId}
    >
      {onClick ? (
        <button
          aria-label={title}
          className="absolute inset-0 z-0 cursor-pointer rounded-[inherit] border-0 bg-transparent p-0"
          onClick={onClick}
          type="button"
        />
      ) : null}
      <div className="pointer-events-none relative z-10 grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <DappIcon alt="" className="size-5 shrink-0" size="sm" src={icon} />
            <Text as="span" className="text-sm font-semibold" variant="copy">
              {title}
            </Text>
          </div>
          <div className="pointer-events-auto flex items-center gap-1">
            <Text as="span" className="text-[13px] font-medium" variant="detail">
              {aprLabel}
            </Text>
            <DappInfoTooltip className="size-3 [&_svg]:size-3" content={aprHint} />
          </div>
        </div>
        <div className="grid gap-1">
          <div className="flex items-center justify-between gap-2">
            <Text as="span" tone="muted-foreground" variant="detail">
              {positionLabel}
            </Text>
            <Text as="span" tone="muted-foreground" variant="detail">
              {yieldLabel}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Text as="strong" className="text-sm font-semibold" variant="copy">
              {positionValue}
            </Text>
            <Text as="strong" className="text-sm font-semibold text-primary" variant="copy">
              {yieldValue}
            </Text>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Text as="span" tone="muted-foreground" variant="detail">
              {positionApprox}
            </Text>
            <Text as="span" tone="muted-foreground" variant="detail">
              {yieldApprox}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  )
}
