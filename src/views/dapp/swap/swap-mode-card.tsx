import { DappIcon } from '~/app/shell/components/dapp-icon'
import { Card } from '~/shared/ui/card'
import { chipVariants } from '~/shared/ui/chip'
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
          'cursor-pointer transition-[border-color,transform] duration-180 ease-out hover:-translate-y-px hover:border-primary',
      )}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1">
        <Card.Header className="flex-row items-center gap-1.5">
          {/* Mode row locks 13px on PC+H5 (dev parity); copy token alone is 12 on H5 */}
          <Card.Label
            as="span"
            className="text-[0.8125rem] font-semibold leading-normal tracking-[-0.02em] text-foreground"
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
                // 4175 Coming soon = #FF9500 (not primary coral) — intentional product badge.
                'pointer-events-none shrink-0 bg-[#FF9500] text-white',
              )}
            >
              {badge}
            </span>
          ) : null}
        </Card.Header>
        <Card.Description className="text-[0.8125rem] leading-normal tracking-[-0.02em]">
          {body}
        </Card.Description>
      </Card.Content>
    </Card>
  )
}
