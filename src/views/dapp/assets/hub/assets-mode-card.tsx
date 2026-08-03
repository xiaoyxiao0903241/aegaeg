import { DappIcon } from '~/app/shell/dapp-icon'
import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { DappCountValue } from '~/shared/ui/dapp-count-value'
import { Text } from '~/shared/ui/text'

/**
 * Figma `asset/*` · `4282:223`（h117 · p16 · gap8 · radius/md16）.
 * 副文/≈：稿 caption 13 + muted 40% → `copy` + `text-foreground/40`；`leading-4` 压行盒。
 * 顶行靠 icon20 撑到 20；主值 14 semibold → `detail`。
 */
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
        'relative grid w-full gap-2 rounded-2xl p-4 text-left shadow-none',
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
        <div className="flex min-h-5 flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <div className="flex min-w-0 items-center gap-1">
            <DappIcon alt="" className="size-5 shrink-0" size="sm" src={icon} />
            <Text as="span" className="leading-4 font-semibold wrap-break-word" variant="detail">
              {title}
            </Text>
          </div>
          <div className="pointer-events-auto flex shrink-0 items-center gap-1">
            <Text as="span" className="leading-4 font-medium wrap-break-word" variant="copy">
              <DappCountValue animate={false} text={aprLabel} />
            </Text>
            <DappInfoTooltip className="size-3 text-foreground [&_svg]:size-3" content={aprHint} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-1">
          <Text as="span" className="leading-4 text-foreground/40" variant="copy">
            {positionLabel}
          </Text>
          <Text as="span" className="justify-self-end leading-4 text-foreground/40" variant="copy">
            {yieldLabel}
          </Text>

          <Text as="strong" className="leading-4 font-semibold" variant="detail">
            <DappCountValue text={positionValue} />
          </Text>
          <Text
            as="strong"
            className="justify-self-end leading-4 font-semibold"
            tone="primary"
            variant="detail"
          >
            <DappCountValue text={yieldValue} />
          </Text>

          <Text as="span" className="leading-4 text-foreground/40" variant="copy">
            <DappCountValue animate={false} text={positionApprox} />
          </Text>
          <Text as="span" className="justify-self-end leading-4 text-foreground/40" variant="copy">
            <DappCountValue animate={false} text={yieldApprox} />
          </Text>
        </div>
      </div>
    </Card>
  )
}
