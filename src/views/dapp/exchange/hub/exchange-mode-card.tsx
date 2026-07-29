import { DappIcon } from '~/app/shell/dapp-icon'
import { Card } from '~/shared/ui/card'
import { chipVariants } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

export function ExchangeModeCard({
  badge,
  body,
  icon,
  onClick,
  title,
  tourId,
  /** Figma hub: flash row is taller (88) for two-line body; others 70. */
  density = 'default',
}: {
  badge?: string
  body: string
  icon: string
  onClick?: () => void
  title: string
  /** OnboardingGuide `data-tour-id` (ticket 02). */
  tourId?: string
  density?: 'default' | 'tall'
}) {
  const interactive = Boolean(onClick)

  return (
    <Card
      as="button"
      surface="outlined"
      className={cn(
        'flex w-full items-center gap-3 px-4 text-left text-muted-foreground shadow-none',
        density === 'tall' ? 'min-h-[88px] py-2.5' : 'min-h-[70px] py-3.5',
        interactive &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      data-tour-id={tourId}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1.5">
        <Card.Header className="flex-row items-center gap-1.5">
          <Card.Label as="span" className="text-sm font-semibold text-foreground">
            {title}
          </Card.Label>
          {badge ? (
            <span
              className={cn(
                chipVariants({
                  variant: 'solid',
                  tone: 'primary',
                  size: 'sm',
                  shape: 'pill',
                }),
                // Coming soon = token `warning` (not primary coral) — intentional product badge.
                'pointer-events-none shrink-0 bg-warning text-white',
              )}
            >
              {badge}
            </span>
          ) : null}
        </Card.Header>
        <Text as="p" variant="copy" tone="muted-foreground" className="m-0">
          {body}
        </Text>
      </Card.Content>
    </Card>
  )
}
