import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

/**
 * Hub mode entry card — Figma exchange/staking left rail.
 * `density`：兑换 Hub 贴稿高（标准刻度，禁 `h-[Npx]`）；其它 Hub 默认 `content`。
 * - content — 无地板，由 pad+文案合成
 * - compact — `min-h-17.5`（70）
 * - tall — `min-h-22`（88，闪兑双行）
 */
export function DappModeCard({
  body,
  density = 'content',
  icon,
  onClick,
  title,
  tourId,
}: {
  body: string
  density?: 'content' | 'compact' | 'tall'
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
        // 清 outlined 默认 p-3.5，改由 px/py + 可选 min-h 合成
        'flex w-full items-center gap-3 p-0 px-4 py-3 text-left shadow-none',
        density === 'tall' && 'min-h-22',
        density === 'compact' && 'min-h-17.5',
        interactive &&
          'duration-dapp-fast cursor-pointer transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
      )}
      data-tour-id={tourId}
      onClick={onClick}
      type="button"
    >
      <DappIcon alt="" className="shrink-0" size="xl" src={icon} />
      <Card.Content className="grid min-w-0 flex-1 gap-1.5">
        <Text as="span" variant="copy" className="leading-normal font-semibold">
          {title}
        </Text>
        <Text as="p" variant="support" className="m-0 leading-normal text-foreground/40">
          {body}
        </Text>
      </Card.Content>
    </Card>
  )
}
