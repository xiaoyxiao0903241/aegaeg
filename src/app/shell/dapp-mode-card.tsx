import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

/**
 * Hub mode entry card — Figma exchange/staking left rail.
 * **No fixed height**: vertical rhythm from `p-4` + content
 * (taller bodies e.g. flash 2-line copy grow naturally).
 */
export function DappModeCard({
  body,
  icon,
  onClick,
  title,
  tourId,
}: {
  body: string
  icon: string
  onClick?: () => void
  title: string
  /** OnboardingGuide `data-tour-id`. */
  tourId?: string
}) {
  const interactive = Boolean(onClick)

  return (
    <Card
      as="button"
      surface="outlined"
      className={cn(
        'flex w-full items-center gap-3 p-4 text-left shadow-none',
        interactive &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      data-tour-id={tourId}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1.5">
        <Text as="span" variant="copy" className="font-semibold">
          {title}
        </Text>
        <Text as="p" variant="support" className="m-0 text-foreground/40">
          {body}
        </Text>
      </Card.Content>
    </Card>
  )
}
