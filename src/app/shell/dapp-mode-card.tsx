import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

export function DappModeCard({
  body,
  icon,
  onClick,
  title,
  tourId,
  /** Figma hub `4323:699`: flash row h88; others h70. */
  density = 'default',
}: {
  body: string
  icon: string
  onClick?: () => void
  title: string
  /** OnboardingGuide `data-tour-id`. */
  tourId?: string
  density?: 'default' | 'tall'
}) {
  const interactive = Boolean(onClick)

  return (
    <Card
      as="button"
      surface="outlined"
      className={cn(
        'flex w-full items-center gap-3 px-4 text-left shadow-none',
        density === 'tall' ? 'h-[88px] py-2.5' : 'h-[70px] py-3.5',
        interactive &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      data-tour-id={tourId}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1.5">
        <Text as="span" variant="copy" className="text-[14px] leading-normal font-semibold">
          {title}
        </Text>
        <Text as="p" variant="support" className="m-0 text-foreground/40">
          {body}
        </Text>
      </Card.Content>
    </Card>
  )
}
