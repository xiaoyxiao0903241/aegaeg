import { DappIcon } from '~/app/shell/components/dapp-icon'
import { Card } from '~/shared/ui/card'
import { chipVariants } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { cn } from '~/shared/lib/utils'

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
    <Card
      as="button"
      surface="outlined"
      className={cn(
        'flex w-full items-center gap-3 text-left text-muted-foreground shadow-none',
        interactive &&
          'cursor-pointer transition-[border-color,transform] duration-160 ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1">
        <Card.Header className="flex-row items-center gap-1.5">
          <Card.Label
            as="span"
            className="font-semibold leading-normal text-foreground"
          >
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
        <Text as="p" variant="copy" tone="muted-foreground" className="m-0 leading-normal">
          {body}
        </Text>
      </Card.Content>
    </Card>
  )
}
