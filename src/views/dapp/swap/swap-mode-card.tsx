import { DappIcon } from '~/app/shell/components/dapp-icon'
import { Card } from '~/shared/ui/card'
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
        'flex w-full items-center gap-3 text-left shadow-none',
        interactive &&
          'cursor-pointer transition-[border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-primary',
      )}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1">
        <Card.Header className="flex-row items-center gap-1.5">
          <Card.Label as="span" className="font-semibold">
            {title}
          </Card.Label>
          {badge ? (
            <Text
              as="span"
              variant="caption"
              className="normal-case rounded-full bg-primary px-2 py-1.5 text-[10px] font-medium leading-none tracking-[-0.02em] text-primary-foreground"
            >
              {badge}
            </Text>
          ) : null}
        </Card.Header>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
    </Card>
  )
}
