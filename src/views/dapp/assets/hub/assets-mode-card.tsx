import { DappIcon } from '~/app/shell/dapp-icon'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

/** Hub product entry — Figma `asset/*` leaf (not ExchangeModeCard chrome). */
export function AssetsModeCard({
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
      as="button"
      surface="outlined"
      className={cn(
        'grid w-full gap-2 p-4 text-left shadow-none',
        onClick &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      data-tour-id={tourId}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <DappIcon alt="" className="size-5 shrink-0" size="sm" src={icon} />
          <Text as="span" className="text-sm font-semibold" variant="copy">
            {title}
          </Text>
        </div>
        <Text as="span" className="text-[13px] font-medium" variant="detail">
          {aprLabel}
        </Text>
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
    </Card>
  )
}
