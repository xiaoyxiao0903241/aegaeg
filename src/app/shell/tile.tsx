import type { ReactNode } from 'react'

import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 右栏数据卡薄壳 — elevated + label（± tooltip）+ children（± note）。
 * note = 主值下另起一行的说明（弱字阶）；禁 layout variant。
 * @see docs/foundation/component-usage.md 右栏数据卡
 */
export function Tile({
  children,
  className,
  label,
  note,
  tooltip,
}: {
  children: ReactNode
  /** 仅布局逃逸（如 tooltip `overflow-visible` / span `min-w-0`）；禁抹 p/rounded/shadow */
  className?: string
  label: string
  /** 主值下另起一行的说明（任意文案；≠ tooltip） */
  note?: ReactNode
  /** label 旁 tooltip 文案 */
  tooltip?: string
}) {
  return (
    <Card as="div" className={cn('flex flex-col gap-1.5', className)} surface="elevated">
      <Text className="leading-[1.25] font-medium text-foreground/70" variant="support">
        {tooltip != null ? (
          <span className="flex items-center gap-1">
            <span>{label}</span>
            <DappInfoTooltip className="text-foreground" content={tooltip} />
          </span>
        ) : (
          label
        )}
      </Text>
      {children}
      {note != null ? (
        <Text
          as="p"
          className="m-0 leading-none wrap-break-word text-foreground/40"
          variant="support"
        >
          {note}
        </Text>
      ) : null}
    </Card>
  )
}
