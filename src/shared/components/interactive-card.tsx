import { type ButtonHTMLAttributes, type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { cn } from '~/shared/lib/utils'

type InteractiveCardBase = {
  children: ReactNode
  className?: string
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
  /** 新手引导用的 `data-tour-id` */
  tourId?: string
  'data-slot-id'?: string
}

export type InteractiveCardProps = InteractiveCardBase &
  (
    | {
        /** 整卡 `button`（默认） */
        hitArea?: 'card'
        'aria-label'?: string
      }
    | {
        /** `article` 容器 + 全卡透明 button（供嵌套 tooltip 等） */
        hitArea: 'overlay'
        /** 全卡 button 的无障碍名 */
        'aria-label': string
      }
  )

/**
 * 可点击描边卡片
 *
 * 只管外观与交互；内容用 Text，由调用方按业务组合。
 * @see docs/foundation/component-usage.md B+D
 */
export function InteractiveCard({
  children,
  className,
  onClick,
  hitArea = 'card',
  'aria-label': ariaLabel,
  tourId,
  'data-slot-id': dataSlotId,
}: InteractiveCardProps) {
  const interactive = Boolean(onClick)
  const overlay = interactive && hitArea === 'overlay'

  return (
    <Card
      as={overlay || !interactive ? 'article' : 'button'}
      className={cn(
        'w-full text-left',
        overlay && 'relative',
        interactive &&
          'duration-dapp-fast transition-[border-color,transform] ease-out hover:scale-[1.008] hover:border-primary active:scale-[0.992]',
        interactive && !overlay && 'cursor-pointer',
        className,
      )}
      data-slot-id={dataSlotId}
      data-tour-id={tourId}
      onClick={overlay ? undefined : onClick}
      surface="outlined"
      {...(!overlay && interactive ? { type: 'button' as const } : {})}
    >
      {overlay ? (
        <button
          aria-label={ariaLabel}
          className="absolute inset-0 z-0 cursor-pointer rounded-[inherit] border-0 bg-transparent p-0"
          onClick={onClick}
          type="button"
        />
      ) : null}
      {children}
    </Card>
  )
}
