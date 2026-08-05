import { type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 右栏数据卡，组合组件：
 * `Tile` 容器 · `Tile.Label`（可嵌 `Tooltip.Info`）· 主值 children · 可选 `Tile.Note`。
 * Note = 主值下另起一行说明；同行内联旁注仍进主值 children。禁用布局 variant。
 *
 * @see docs/foundation/component-usage.md 右栏数据卡
 */
function TileRoot({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card as="div" className={cn('flex flex-col gap-1.5', className)} surface="elevated">
      {children}
    </Card>
  )
}

/** 顶栏弱标签；旁附说明嵌 `Tooltip.Info`。 */
function Label({ children }: { children: ReactNode }) {
  return (
    <Text
      as="div"
      className="flex items-center gap-1 leading-tight font-medium text-foreground/70"
      variant="support"
    >
      {children}
    </Text>
  )
}

/** 主值下另起一行的说明（弱字阶）。 */
function Note({ children }: { children: ReactNode }) {
  return (
    <Text as="p" className="m-0 leading-none wrap-break-word text-foreground/40" variant="support">
      {children}
    </Text>
  )
}

export const Tile = Object.assign(TileRoot, { Label, Note })
